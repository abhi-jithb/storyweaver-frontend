import { Book, FilterState, FilterOptions } from '../types/opds';

class FilterEngine {
  filterBooks(books: Book[], filters: FilterState): Book[] {
    return books.filter(
      (book) =>
        this.matchLanguage(book, filters) &&
        this.matchLevel(book, filters) &&
        this.matchCategories(book, filters) &&
        this.matchPublisher(book, filters) &&
        this.matchDate(book, filters)
    );
  }

  private matchLanguage(book: Book, filters: FilterState): boolean {
    if (filters.languages.size === 0) return true;
    return filters.languages.has(book.language);
  }

  private matchLevel(book: Book, filters: FilterState): boolean {
    if (filters.levels.size === 0) return true;
    return book.level ? filters.levels.has(book.level) : false;
  }

  private matchCategories(book: Book, filters: FilterState): boolean {
    if (filters.categories.size === 0) return true;
    return book.categories.some((cat) => filters.categories.has(cat));
  }

  private matchPublisher(book: Book, filters: FilterState): boolean {
    if (filters.publishers.size === 0) return true;
    return book.publisher ? filters.publishers.has(book.publisher) : false;
  }

  private matchDate(book: Book, filters: FilterState): boolean {
    if (!book.publishedDate) return true;

    const bookDate = new Date(book.publishedDate);
    const now = new Date();

    switch (filters.dateFilter) {
      case 'last30days': {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return bookDate >= thirtyDaysAgo;
      }
      case 'lastyear': {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return bookDate >= oneYearAgo;
      }
      case 'newest':
      case 'oldest':
      case 'all':
      default:
        return true;
    }
  }

  sortBooks(books: Book[], dateFilter: string): Book[] {
    const sorted = [...books];

    if (dateFilter === 'newest') {
      sorted.sort(
        (a, b) =>
          new Date(b.publishedDate || 0).getTime() -
          new Date(a.publishedDate || 0).getTime()
      );
    } else if (dateFilter === 'oldest') {
      sorted.sort(
        (a, b) =>
          new Date(a.publishedDate || 0).getTime() -
          new Date(b.publishedDate || 0).getTime()
      );
    }

    return sorted;
  }

  getFilterOptions(books: Book[]): FilterOptions {
    return {
      languages: Array.from(new Set(books.map((b) => b.language)))
        .filter(Boolean)
        .sort(),
      levels: Array.from(
        new Set(
          books
            .map((b) => b.level)
            .filter((level): level is string => Boolean(level))
        )
      ).sort(),
      categories: Array.from(new Set(books.flatMap((b) => b.categories)))
        .filter(Boolean)
        .sort(),
      publishers: Array.from(
        new Set(
          books
            .map((b) => b.publisher)
            .filter((publisher): publisher is string => Boolean(publisher))
        )
      ).sort(),
    };
  }
}

export const filterEngine = new FilterEngine();
