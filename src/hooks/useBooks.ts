// src/hooks/useBooks.ts
import { useBooksContext } from '../context/BooksContext';

export function useBooks() {
  return useBooksContext();
}