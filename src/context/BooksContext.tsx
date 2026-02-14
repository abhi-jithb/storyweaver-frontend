import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo, useCallback } from 'react';
import { Book, FilterOptions } from '../types/opds';
import { opdsParser } from '../services/opdsParser';
import { persistenceService } from '../utils/persistence';
import { filterEngine } from '../services/filterEngine';
import { STORYWEAVER_LANGUAGES_LIST } from '../utils/storyWeaverLanguages';

interface BooksContextType {
    books: Book[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    filterOptions: FilterOptions;
    addBook: (book: Book) => void;
    updateBooks: (ids: string[], updates: Partial<Book>) => void;
    deleteBooks: (ids: string[]) => void;
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

    // Start fetching immediately when the module loads (singleton)
    // This ensures data fetching starts before the component even mounts
    useEffect(() => {
        opdsParser.init().catch(console.error);
    }, []);

    const fetchBooks = useCallback(async () => {
        await opdsParser.refresh();
    }, []);

    // Subscribe to updates
    useEffect(() => {
        const unsubscribe = opdsParser.subscribe((updatedBooks, isComplete) => {
            setBooks(updatedBooks);

            // Wait until we have a decent number of books (e.g., 20) or fetching is fully complete
            // This prevents the "empty" or "pop-in" feel if the first batch is small
            if (updatedBooks.length >= 20 || isComplete) {
                setLoading(false);
            }

            // Only show "loading more" if we have dismissed the main loader but are still fetching
            setLoadingMore(!isComplete && (updatedBooks.length >= 20 || isComplete));
        });

        return () => unsubscribe();
    }, []);

    const addBook = useCallback((book: Book) => {
        setBooks((prev) => [book, ...prev]);
        persistenceService.saveBooks([book]);
    }, []);

    const updateBooks = useCallback((ids: string[], updates: Partial<Book>) => {
        setBooks((prev) => {
            const updatedBooksToPersist: Book[] = [];
            const nextBooks = prev.map((book) => {
                if (ids.includes(book.id)) {
                    const updated = { ...book, ...updates };
                    updatedBooksToPersist.push(updated);
                    return updated;
                }
                return book;
            });
            persistenceService.saveBooks(updatedBooksToPersist);
            return nextBooks;
        });
    }, []);

    const deleteBooks = useCallback((ids: string[]) => {
        setBooks((prev) => prev.filter((book) => !ids.includes(book.id)));
        persistenceService.deleteBooks(ids);
    }, []);

    const value = useMemo(() => ({
        books,
        loading,
        loadingMore,
        error,
        refetch: fetchBooks,
        filterOptions,
        addBook,
        updateBooks,
        deleteBooks
    }), [books, loading, loadingMore, error, fetchBooks, filterOptions, addBook, updateBooks, deleteBooks]);

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
