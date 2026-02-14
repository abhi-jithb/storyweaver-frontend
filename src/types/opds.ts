export interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  cover: string;
  thumbnail?: string;
  downloadLink: string;
  language: string;
  level?: string;
  categories: string[];
  publisher?: string;
  publishedDate?: string;
  rating?: number;
  tags: string[];
}

export interface FilterState {
  languages: Set<string>;
  levels: Set<string>;
  categories: Set<string>;
  dateFilter: 'all' | 'newest' | 'oldest' | 'last30days' | 'lastyear';
  searchQuery: string;
}

export interface SearchResult {
  book: Book;
  score: number;
}

export interface FilterOptions {
  languages: string[];
  levels: string[];
  categories: string[];
}
""