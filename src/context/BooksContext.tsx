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
        const dynamicOptions = filterEngine.getFilterOptions(books);
        if (dynamicOptions.languages.length === 0) {
            return {
                ...dynamicOptions,
                languages: STORYWEAVER_LANGUAGES_LIST,
            };
        }
        return dynamicOptions;
    }, [books]);

    useEffect(() => {
        opdsParser.init().catch(console.error);
    }, []);

    const fetchBooks = useCallback(async () => {
        await opdsParser.refresh();
    }, []);

    // Subscribe to updates
    useEffect(() => {
        const unsubscribe = opdsParser.subscribe((updatedBooks, isComplete, fetchError) => {
            if (fetchError) {
                setError(fetchError);
                setLoading(false);
                return;
            }

            setBooks(updatedBooks);

            if (updatedBooks.length > 0 || isComplete) {
                setLoading(false);
            }
            setLoadingMore(!isComplete && updatedBooks.length > 0);
        });

        const safetyTimer = setTimeout(() => {
            setLoading(current => {
                if (current) {
                    console.warn('Load timed out. Releasing loading screen.');
                    return false;
                }
                return current;
            });
        }, 15000);

        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
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
