
import { Book, FilterState, FilterOptions } from '../types/opds';
import { STORYWEAVER_CATEGORIES, mapCategoryToStoryWeaver } from '../utils/storyWeaverCategories';
import { mapLanguageToStoryWeaver } from '../utils/storyWeaverLanguages';

class FilterEngine {
  private levelMappingCache: Map<string, string | null> = new Map();

  filterBooks(books: Book[], filters: FilterState): Book[] {
    const hasLang = filters.languages.size > 0;
    const hasLevel = filters.levels.size > 0;
    const hasCat = filters.categories.size > 0;
    const hasPub = filters.publishers.size > 0;
    const hasDate = filters.dateFilter !== 'all' && filters.dateFilter !== 'newest' && filters.dateFilter !== 'oldest';

    const filtered = books.filter(
      (book) =>
        (!hasLang || this.matchLanguage(book, filters)) &&
        (!hasLevel || this.matchLevel(book, filters)) &&
        (!hasCat || this.matchCategories(book, filters)) &&
        (!hasPub || this.matchPublisher(book, filters)) &&
        (!hasDate || this.matchDate(book, filters))
    );

    return this.sortBooks(filtered, filters.dateFilter);
  }

  private matchLanguage(book: Book, filters: FilterState): boolean {
    if (filters.languages.has(book.language)) return true;
    const mappedLanguage = mapLanguageToStoryWeaver(book.language);
    return !!(mappedLanguage && filters.languages.has(mappedLanguage));
  }

  private matchLevel(book: Book, filters: FilterState): boolean {
    if (!book.level) return false;
    if (filters.levels.has(book.level)) return true;
    const mappedLevel = this.mapLevelToStoryWeaver(book.level);
    return !!(mappedLevel && filters.levels.has(mappedLevel));
  }

  private matchCategories(book: Book, filters: FilterState): boolean {
    return book.categories.some((cat) => {
      if (filters.categories.has(cat)) return true;
      const mappedCategory = mapCategoryToStoryWeaver(cat);
      return !!(mappedCategory && filters.categories.has(mappedCategory));
    });
  }

  private matchPublisher(book: Book, filters: FilterState): boolean {
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
      default:
        return true;
    }
  }

  private mapLevelToStoryWeaver(level: string): string | null {
    if (this.levelMappingCache.has(level)) {
      return this.levelMappingCache.get(level)!;
    }

    const normalized = level.toLowerCase().trim();
    const levelMap: Record<string, string> = {
      'level 1': 'Level 1: Foundations',
      'level1': 'Level 1: Foundations',
      'foundations': 'Level 1: Foundations',
      'beginner': 'Level 1: Foundations',
      'level 2': 'Level 2: Early Reader',
      'level2': 'Level 2: Early Reader',
      'early reader': 'Level 2: Early Reader',
      'early': 'Level 2: Early Reader',
      'level 3': 'Level 3: Intermediate',
      'level3': 'Level 3: Intermediate',
      'intermediate': 'Level 3: Intermediate',
      'level 4': 'Level 4: Advanced Reader',
      'level4': 'Level 4: Advanced Reader',
      'advanced': 'Level 4: Advanced Reader',
      'advanced reader': 'Level 4: Advanced Reader',
    };

    let result: string | null = levelMap[normalized] || null;
    if (!result) {
      for (const [key, value] of Object.entries(levelMap)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          result = value;
          break;
        }
      }
    }

    this.levelMappingCache.set(level, result);
    return result;
  }

  sortBooks(books: Book[], dateFilter: string): Book[] {
    if (dateFilter === 'all' || !dateFilter) return books;

    const sorted = [...books];
    if (dateFilter === 'newest') {
      sorted.sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''));
    } else if (dateFilter === 'oldest') {
      sorted.sort((a, b) => (a.publishedDate || '').localeCompare(b.publishedDate || ''));
    }
    return sorted;
  }

  getFilterOptions(books: Book[]): FilterOptions {
    const languages = new Set<string>();
    const levels = new Set<string>();
    const categories = new Set<string>();
    const publishers = new Set<string>();

    // Optimize: Single pass through books
    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      // Language
      const mappedLang = mapLanguageToStoryWeaver(book.language) || book.language;
      languages.add(mappedLang);

      // Level
      if (book.level) {
        const mappedLevel = this.mapLevelToStoryWeaver(book.level) || book.level;
        levels.add(mappedLevel);
      }

      // Categories
      for (const cat of book.categories) {
        const mappedCat = mapCategoryToStoryWeaver(cat) || cat;
        categories.add(mappedCat);
      }

      // Publisher
      if (book.publisher) publishers.add(book.publisher);
    }

    return {
      languages: Array.from(languages).sort(),
      levels: Array.from(levels).sort(),
      categories: STORYWEAVER_CATEGORIES.filter((cat) => categories.has(cat)) || Array.from(categories).sort(),
      publishers: Array.from(publishers).sort(),
    };
  }
}

export const filterEngine = new FilterEngine();
