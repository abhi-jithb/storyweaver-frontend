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

            if (updatedBooks.length > 0 || isComplete) {
                setLoading(false);
            }

            setLoadingMore(!isComplete && updatedBooks.length > 0);
        });

        return () => unsubscribe();
    }, []);

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
