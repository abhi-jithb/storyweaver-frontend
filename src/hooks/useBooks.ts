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
        const allBooks = await opdsParser.fetchAllBooks();
        setBooks(allBooks);
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
