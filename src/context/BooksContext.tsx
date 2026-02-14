import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo, useCallback } from 'react';
import { Book, FilterOptions } from '../types/opds';
import { opdsParser } from '../services/opdsParser';
import { filterEngine } from '../services/filterEngine';
import { STORYWEAVER_LANGUAGES_LIST } from '../utils/storyWeaverLanguages';

interface BooksContextType {
    books: Book[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    filterOptions: FilterOptions;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export function BooksProvider({ children }: { children: ReactNode }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dynamic OPDS Fetch & Fallback
    const filterOptions = useMemo<FilterOptions>(() => {
        // Get options from the engine based on current books
        const dynamicOptions = filterEngine.getFilterOptions(books);

        // Fallback: If no books loaded yet or languages missing, use static list
        if (dynamicOptions.languages.length === 0) {
            return {
                ...dynamicOptions,
                languages: STORYWEAVER_LANGUAGES_LIST,
            };
        }

        return dynamicOptions;
    }, [books]);

    const fetchBooks = useCallback(async () => {
        try {
            // Don't setup loading state to true if we already have books (background refresh)
            // unless it's a forced refetch where we might want to show something.
            // But for initial load, yes.
            if (books.length === 0) {
                setLoading(true);
            }
            setError(null);

            // Use worker-based progressive loading
            await opdsParser.fetchBooksProgressive(
                (loadedBooks, isComplete) => {
                    // Worker already batches and sends fresh arrays
                    setBooks(loadedBooks);

                    if (loadedBooks.length > 0) {
                        setLoading(false);
                        if (!isComplete && loadedBooks.length > 0) setLoadingMore(true);
                    }

                    if (isComplete) {
                        setLoading(false);
                        setLoadingMore(false);
                    }
                }
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load books';
            setError(errorMessage);
            console.error('Error loading books:', err);
            setLoading(false);
            setLoadingMore(false);
        }
    }, []); // Remove dependency on 'books' to avoid loops, though logic inside handles it

    // Initial fetch
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const value = useMemo(() => ({
        books,
        loading,
        loadingMore,
        error,
        refetch: fetchBooks,
        filterOptions
    }), [books, loading, loadingMore, error, fetchBooks, filterOptions]);

    return (
        <BooksContext.Provider value={value}>
            {children}
        </BooksContext.Provider>
    );
}

export function useBooksContext() {
    const context = useContext(BooksContext);
    if (context === undefined) {
        throw new Error('useBooksContext must be used within a BooksProvider');
    }
    return context;
}
