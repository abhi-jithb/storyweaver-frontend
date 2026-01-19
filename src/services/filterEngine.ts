
import { Book, FilterState, FilterOptions } from '../types/opds';
import { STORYWEAVER_CATEGORIES, mapCategoryToStoryWeaver } from '../utils/storyWeaverCategories';
import { mapLanguageToStoryWeaver } from '../utils/storyWeaverLanguages';

class FilterEngine {
  private levelMappingCache: Map<string, string | null> = new Map();

  filterBooks(books: Book[], filters: FilterState): Book[] {
    const hasLang = filters.languages.size > 0;
    const hasLevel = filters.levels.size > 0;
    const hasCat = filters.categories.size > 0;
    const hasDate = filters.dateFilter !== 'all' && filters.dateFilter !== 'newest' && filters.dateFilter !== 'oldest';

    const filtered = books.filter(
      (book) =>
        (!hasLang || this.matchLanguage(book, filters)) &&
        (!hasLevel || this.matchLevel(book, filters)) &&
        (!hasCat || this.matchCategories(book, filters)) &&
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
    // Task 3: Check against strict levels (Level 1-4)
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
    // Task 3: Strict Levels 1-4
    const levelMap: Record<string, string> = {
      'level 1': 'Level 1',
      'level1': 'Level 1',
      'foundations': 'Level 1',
      'beginner': 'Level 1',
      'level 2': 'Level 2',
      'level2': 'Level 2',
      'early reader': 'Level 2',
      'early': 'Level 2',
      'level 3': 'Level 3',
      'level3': 'Level 3',
      'intermediate': 'Level 3',
      'level 4': 'Level 4',
      'level4': 'Level 4',
      'advanced': 'Level 4',
      'advanced reader': 'Level 4',
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

    // Optimize: Single pass through books
    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      // Language
      const mappedLang = mapLanguageToStoryWeaver(book.language) || book.language;
      languages.add(mappedLang);

      // Level
      if (book.level) {
        const mappedLevel = this.mapLevelToStoryWeaver(book.level);
        // Task 3: Only include valid filtered levels (Level 1-4)
        if (mappedLevel) {
          levels.add(mappedLevel);
        }
      }

      // Categories
      for (const cat of book.categories) {
        const mappedCat = mapCategoryToStoryWeaver(cat) || cat;
        categories.add(mappedCat);
      }
    }

    // Task 3: Ensure levels are sorted correctly
    const validLevels = ['Level 1', 'Level 2', 'Level 3', 'Level 4'];
    const sortedLevels = Array.from(levels).sort((a, b) => {
      return validLevels.indexOf(a) - validLevels.indexOf(b);
    });

    return {
      languages: Array.from(languages).sort(),
      levels: sortedLevels,
      categories: STORYWEAVER_CATEGORIES.filter((cat) => categories.has(cat)) || Array.from(categories).sort(),
    };
  }
}

export const filterEngine = new FilterEngine();
