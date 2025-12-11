import { Book, SearchResult } from '../types/opds';
import { SEARCH_WEIGHTS } from '../utils/constants';

class SearchAlgorithm {
  search(books: Book[], query: string): SearchResult[] {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

    const results = books
      .map((book) => ({
        book,
        score: this.calculateScore(book, normalizedQuery, queryTerms),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1000); // Limit results for performance

    return results;
  }

  private calculateScore(book: Book, normalizedQuery: string, queryTerms: string[]): number {
    let score = 0;

    // Title match (highest weight: 0.40)
    const titleMatch = this.calculateMatchStrength(book.title.toLowerCase(), normalizedQuery);
    if (titleMatch > 0) {
      score += SEARCH_WEIGHTS.title * titleMatch;
    }

    // Tags/Categories match (0.12)
    const tagsMatch = book.tags.filter((t) => t.toLowerCase().includes(normalizedQuery)).length;
    if (tagsMatch > 0) {
      score += SEARCH_WEIGHTS.tags * Math.min(1, tagsMatch / 3);
    }

    // Categories match
    const categoriesMatch = book.categories.filter((c) =>
      c.toLowerCase().includes(normalizedQuery)
    ).length;
    if (categoriesMatch > 0) {
      score += SEARCH_WEIGHTS.tags * 0.5 * Math.min(1, categoriesMatch / 2);
    }

    // Summary match (0.05)
    const summaryMatch = this.calculateMatchStrength(book.summary.toLowerCase(), normalizedQuery);
    if (summaryMatch > 0) {
      score += SEARCH_WEIGHTS.synopsis * summaryMatch * 0.5;
    }

    // Author match (0.15)
    const authorMatch = this.calculateMatchStrength(book.author.toLowerCase(), normalizedQuery);
    if (authorMatch > 0) {
      score += SEARCH_WEIGHTS.authors * authorMatch * 0.3;
    }

    // Language match (0.15)
    if (book.language.toLowerCase().includes(normalizedQuery)) {
      score += SEARCH_WEIGHTS.language * 0.2;
    }

    // Publisher match (0.36)
    if (book.publisher?.toLowerCase().includes(normalizedQuery)) {
      score += SEARCH_WEIGHTS.publisher * 0.5;
    }

    // Rating boost (10% increase per rating point)
    if (book.rating && book.rating > 3) {
      score *= 1 + (book.rating / 5) * 0.1;
    }

    return Math.min(score, 1); // Normalize to [0, 1]
  }

  private calculateMatchStrength(text: string, query: string): number {
    // Exact match = 1.0
    if (text === query) return 1.0;

    // Starts with query = 0.8
    if (text.startsWith(query)) return 0.8;

    // Contains query = 0.5
    if (text.includes(query)) return 0.5;

    return 0;
  }
}

export const searchAlgorithm = new SearchAlgorithm();
