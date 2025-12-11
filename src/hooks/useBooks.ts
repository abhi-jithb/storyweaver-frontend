// src/hooks/useBooks.ts
import { useEffect, useState } from 'react';
import { Book } from '../types/opds';
import { opdsParser } from '../services/opdsParser';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const allBooks = await Promise.race([
          opdsParser.fetchAllBooks(),
          new Promise<Book[]>((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), 10000)
          )
        ]);

        clearTimeout(timeoutId);
        setBooks(allBooks || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load books';
        setError(errorMessage);
        console.error('Error loading books:', err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, loading, error };
}