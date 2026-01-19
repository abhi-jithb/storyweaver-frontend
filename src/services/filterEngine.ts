
import { Book, FilterState, FilterOptions } from '../types/opds';
import { STORYWEAVER_CATEGORIES, mapCategoryToStoryWeaver, STORYWEAVER_LEVELS } from '../utils/storyWeaverCategories';
import { mapLanguageToStoryWeaver } from '../utils/storyWeaverLanguages';

class FilterEngine {
  filterBooks(books: Book[], filters: FilterState): Book[] {
    let filtered = books.filter(
      (book) =>
        this.matchLanguage(book, filters) &&
        this.matchLevel(book, filters) &&
        this.matchCategories(book, filters) &&
        this.matchPublisher(book, filters) &&
        this.matchDate(book, filters)
    );

    // Apply sorting by date
    return this.sortBooks(filtered, filters.dateFilter);
  }

  private matchLanguage(book: Book, filters: FilterState): boolean {
    if (filters.languages.size === 0) return true;

    // Direct match
    if (filters.languages.has(book.language)) return true;

    // Mapped match (from OPDS to StoryWeaver)
    const mappedLanguage = mapLanguageToStoryWeaver(book.language);
    if (mappedLanguage && filters.languages.has(mappedLanguage)) return true;

    return false;
  }

  private matchLevel(book: Book, filters: FilterState): boolean {
    if (filters.levels.size === 0) return true;

    if (!book.level) return false;

    // Direct match
    if (filters.levels.has(book.level)) return true;

    // Mapped match (from OPDS to StoryWeaver level)
    const mappedLevel = this.mapLevelToStoryWeaver(book.level);
    if (mappedLevel && filters.levels.has(mappedLevel)) return true;

    return false;
  }

  private matchCategories(book: Book, filters: FilterState): boolean {
    if (filters.categories.size === 0) return true;

    return book.categories.some((cat) => {
      // Direct match
      if (filters.categories.has(cat)) return true;

      // Mapped match (from OPDS to StoryWeaver)
      const mappedCategory = mapCategoryToStoryWeaver(cat);
      if (mappedCategory && filters.categories.has(mappedCategory)) return true;

      return false;
    });
  }

  private matchPublisher(book: Book, filters: FilterState): boolean {
    if (filters.publishers.size === 0) return true;
    return book.publisher ? filters.publishers.has(book.publisher) : false;
  }

  private matchDate(book: Book, filters: FilterState): boolean {
    // Only filter by date if date-specific filter is selected
    // For 'all', 'newest', 'oldest' - don't filter, just sort
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
      case 'all':
      case 'newest':
      case 'oldest':
      default:
        return true; // Don't filter, will be sorted instead
    }
  }

  private mapLevelToStoryWeaver(level: string): string | null {
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

    // Try exact match first
    if (levelMap[normalized]) {
      return levelMap[normalized];
    }

    // Try partial match
    for (const [key, value] of Object.entries(levelMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return value;
      }
    }

    return null;
  }

  sortBooks(books: Book[], dateFilter: string): Book[] {
    const sorted = [...books];

    switch (dateFilter) {
      case 'newest': {
        sorted.sort(
          (a, b) =>
            new Date(b.publishedDate || 0).getTime() -
            new Date(a.publishedDate || 0).getTime()
        );
        break;
      }
      case 'oldest': {
        sorted.sort(
          (a, b) =>
            new Date(a.publishedDate || 0).getTime() -
            new Date(b.publishedDate || 0).getTime()
        );
        break;
      }
      case 'all':
      default:
        // No sorting, return as-is
        break;
    }

    return sorted;
  }

  getFilterOptions(books: Book[]): FilterOptions {
    // Collect all unique categories and map to StoryWeaver names
    const allCategories = new Set<string>();

    books.forEach((book) => {
      book.categories.forEach((cat) => {
        const mapped = mapCategoryToStoryWeaver(cat);
        if (mapped) {
          allCategories.add(mapped);
        } else {
          allCategories.add(cat);
        }
      });
    });

    // Collect all unique levels and map to StoryWeaver levels
    const allLevels = new Set<string>();

    books.forEach((book) => {
      if (book.level) {
        // Try to map to StoryWeaver level
        const mappedLevel = this.mapLevelToStoryWeaver(book.level);
        if (mappedLevel) {
          allLevels.add(mappedLevel);
        } else {
          allLevels.add(book.level);
        }
      }
    });

    // Collect all unique languages and map to StoryWeaver names
    const allLanguages = new Set<string>();

    books.forEach((book) => {
      const mapped = mapLanguageToStoryWeaver(book.language);
      if (mapped) {
        allLanguages.add(mapped);
      } else {
        allLanguages.add(book.language);
      }
    });

    return {
      languages: Array.from(allLanguages).sort(),
      levels: Array.from(allLevels).sort(),
      categories: STORYWEAVER_CATEGORIES.filter((cat) => allCategories.has(cat)),
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