// src/hooks/useBooks.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { Book } from '../types/opds';
import { opdsParser } from '../services/opdsParser';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return { books, loading, loadingMore, error, refetch: fetchBooks };
}