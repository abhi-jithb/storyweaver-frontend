import { Book, SearchResult } from '../types/opds';
import { SEARCH_WEIGHTS } from '../utils/constants';

class SearchAlgorithm {
  search(books: Book[], query: string): SearchResult[] {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

    // Filter books that match at least one term in title or tags first
    const results: SearchResult[] = [];

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const score = this.calculateScore(book, normalizedQuery, queryTerms);
      if (score > 0) {
        results.push({ book, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 1000);
  }

  private calculateScore(book: Book, normalizedQuery: string, queryTerms: string[]): number {
    const title = book.title.toLowerCase();

    // Quick exit: if no match in title and no major field contains query
    // This assumes title or tags are the primary search targets
    const titleMatch = this.calculateMatchStrength(title, normalizedQuery);

    let score = 0;
    if (titleMatch > 0) {
      score += SEARCH_WEIGHTS.title * titleMatch;
    }

    // Check tags (optimized loop)
    let tagsMatchCount = 0;
    for (const tag of book.tags) {
      if (tag.toLowerCase().includes(normalizedQuery)) {
        tagsMatchCount++;
      }
    }
    if (tagsMatchCount > 0) {
      score += SEARCH_WEIGHTS.tags * Math.min(1, tagsMatchCount / 3);
    }

    // Check author
    const authorMatch = this.calculateMatchStrength(book.author.toLowerCase(), normalizedQuery);
    if (authorMatch > 0) {
      score += SEARCH_WEIGHTS.authors * authorMatch * 0.3;
    }

    // Check publisher
    if (book.publisher?.toLowerCase().includes(normalizedQuery)) {
      score += SEARCH_WEIGHTS.publisher * 0.5;
    }

    // Boost if score found so far
    if (score > 0) {
      // Small bonus for summary match
      if (book.summary.toLowerCase().includes(normalizedQuery)) {
        score += SEARCH_WEIGHTS.synopsis * 0.1;
      }

      // Rating boost
      if (book.rating && book.rating > 3) {
        score *= (1 + (book.rating / 5) * 0.1);
      }
    }

    return Math.min(score, 1);
  }

  private calculateMatchStrength(text: string, query: string): number {
    if (text === query) return 1.0;
    if (text.startsWith(query)) return 0.8;
    if (text.includes(query)) return 0.5;
    return 0;
  }
}

export const searchAlgorithm = new SearchAlgorithm();
