// src/hooks/useBooks.ts
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Book, FilterOptions } from '../types/opds';
import { opdsParser } from '../services/opdsParser';
import { filterEngine } from '../services/filterEngine';
import { STORYWEAVER_LANGUAGES_LIST } from '../utils/storyWeaverLanguages';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Task 1: Dynamic OPDS Fetch & Fallback
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
      setLoading(true);
      setError(null);

      // Use worker-based progressive loading
      await opdsParser.fetchBooksProgressive(
        (loadedBooks, isComplete) => {
          // Worker already batches and sends fresh arrays
          setBooks(loadedBooks);

          if (loadedBooks.length > 0) {
            setLoading(false);
            if (!isComplete) setLoadingMore(true);
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
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, loadingMore, error, refetch: fetchBooks, filterOptions };
}