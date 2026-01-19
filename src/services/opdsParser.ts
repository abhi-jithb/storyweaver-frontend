import { Book } from '../types/opds';
import { OPDS_MAIN_URL, CACHE_DURATION } from '../utils/constants';
import { persistenceService } from '../utils/persistence';

interface CacheEntry {
  data: Book[];
  timestamp: number;
}

class OpdsParser {
  private cache: Map<string, CacheEntry> = new Map();
  private worker: Worker | null = null;
  private isFetching = false;

  constructor() { }

  private initWorker() {
    if (this.worker) return this.worker;

    // Vite worker import syntax
    this.worker = new Worker(
      new URL('../workers/opds.worker.ts', import.meta.url),
      { type: 'module' }
    );
    return this.worker;
  }

  async fetchAllBooks(): Promise<Book[]> {
    const cached = this.cache.get('all_books');
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const persistedBooks = await persistenceService.getAllBooks();
    if (persistedBooks.length > 0) {
      this.cache.set('all_books', { data: persistedBooks, timestamp: Date.now() });
      this.refreshCacheInBackground();
      return persistedBooks;
    }

    return new Promise((resolve, reject) => {
      this.fetchBooksProgressive((books, isComplete) => {
        if (isComplete) resolve(books);
      }).catch(reject);
    });
  }

  private async refreshCacheInBackground() {
    if (this.isFetching) return;
    try {
      await this.fetchBooksProgressive();
    } catch (err) {
      console.warn('Background refresh failed:', err);
    }
  }

  async fetchBooksProgressive(
    onProgress?: (books: Book[], isComplete: boolean) => void
  ): Promise<Book[]> {
    // 1. Initial Load from Persistence
    const persistedBooks = await persistenceService.getAllBooks();
    if (persistedBooks.length > 0) {
      if (onProgress) onProgress(persistedBooks, false);

      // Still fetch from network to update
      if (!this.isFetching) {
        this.startWorkerFetch(onProgress);
      }
      return persistedBooks;
    }

    // 2. Fresh Start
    return new Promise((resolve) => {
      this.startWorkerFetch((books, isComplete) => {
        if (onProgress) onProgress(books, isComplete);
        if (isComplete) resolve(books);
      });
    });
  }

  private startWorkerFetch(onProgress?: (books: Book[], isComplete: boolean) => void) {
    if (this.isFetching) return;
    this.isFetching = true;

    const worker = this.initWorker();

    worker.onmessage = (e) => {
      const { type, books, isComplete, error } = e.data;

      if (type === 'PROGRESS') {
        if (onProgress) onProgress(books, isComplete);

        if (isComplete) {
          this.isFetching = false;
          this.cache.set('all_books', { data: books, timestamp: Date.now() });
          persistenceService.saveBooks(books);
        }
      } else if (type === 'ERROR') {
        this.isFetching = false;
        console.error('Worker error:', error);
      }
    };

    worker.postMessage({ type: 'FETCH_ALL', url: OPDS_MAIN_URL });
  }

  clearCache(): void {
    this.cache.clear();
    persistenceService.clearAll();
    console.log('Cache cleared');
  }
}

export const opdsParser = new OpdsParser();
