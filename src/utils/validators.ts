import { Book } from '../types/opds';

export function isValidBook(data: any): data is Book {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.author === 'string' &&
    typeof data.language === 'string' &&
    Array.isArray(data.categories) &&
    Array.isArray(data.tags)
  );
}

export function validateAndSanitizeBook(book: any): Book {
  const sanitizedCategories = Array.isArray(book.categories)
    ? Array.from(
        new Set(
          book.categories
            .map((c: unknown) => String(c).slice(0, 50))
            .filter((c: unknown): c is string => Boolean(c))
        )
      )
    : [];

  const sanitizedTags = Array.isArray(book.tags)
    ? Array.from(
        new Set(
          book.tags
            .map((t: unknown) => String(t).slice(0, 50))
            .filter((t: unknown): t is string => Boolean(t))
        )
      )
    : [];

  return {
    id: String(book.id || Math.random()),
    title: String(book.title || 'Untitled').slice(0, 200),
    author: String(book.author || 'Unknown').slice(0, 100),
    summary: String(book.summary || '').slice(0, 1000),
    cover: String(book.cover || '').slice(0, 500),
    downloadLink: String(book.downloadLink || '').slice(0, 500),
    language: String(book.language || 'Unknown').slice(0, 50),
    level: book.level ? String(book.level).slice(0, 50) : undefined,
    categories: sanitizedCategories,
    publisher: book.publisher ? String(book.publisher).slice(0, 100) : undefined,
    publishedDate: book.publishedDate ? String(book.publishedDate).slice(0, 10) : undefined,
    rating: typeof book.rating === 'number' ? Math.min(5, Math.max(0, book.rating)) : undefined,
    tags: sanitizedTags,
  };
}