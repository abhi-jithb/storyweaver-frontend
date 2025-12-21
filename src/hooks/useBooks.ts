// src/hooks/useBooks.ts
import { useEffect, useState, useRef } from 'react';
import { Book } from '../types/opds';
import { opdsParser } from '../services/opdsParser';
import { INITIAL_CATALOGS_TO_LOAD, CATALOGS_PER_BATCH, BATCH_DELAY_MS } from '../utils/constants';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialBatchLoaded = useRef(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        initialBatchLoaded.current = false;
        
        // Use progressive loading: show initial books quickly, then load rest in background
        await opdsParser.fetchBooksProgressive(
          (loadedBooks, isComplete) => {
            setBooks([...loadedBooks]);
            
            // After initial batch is loaded, show UI but continue loading
            if (!isComplete && !initialBatchLoaded.current) {
              initialBatchLoaded.current = true;
              setLoading(false);
              setLoadingMore(true);
            }
            
            // When all books are loaded, mark as complete
            if (isComplete) {
              setLoading(false);
              setLoadingMore(false);
            }
          },
          INITIAL_CATALOGS_TO_LOAD,
          CATALOGS_PER_BATCH,
          BATCH_DELAY_MS
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load books';
        setError(errorMessage);
        console.error('Error loading books:', err);
        setBooks([]);
        setLoading(false);
        setLoadingMore(false);
        initialBatchLoaded.current = false;
      }
    };

    fetchBooks();
  }, []);

  return { books, loading, loadingMore, error };
}