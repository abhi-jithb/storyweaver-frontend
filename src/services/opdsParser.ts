import { Book } from '../types/opds';
import { OPDS_MAIN_URL, CACHE_DURATION } from '../utils/constants';
import { persistenceService } from '../utils/persistence';

interface CacheEntry {
  data: Book[];
  timestamp: number;
}

class OpdsParser {
  private worker: Worker | null = null;
  private isFetching = false;

  // State for Observer Pattern
  private subscribers: Set<(books: Book[], isComplete: boolean) => void> = new Set();
  private currentBooks: Book[] = [];
  private isComplete = false;

  constructor() { }

  private initWorker() {
    if (this.worker) return this.worker;

    this.worker = new Worker(
      new URL('../workers/opds.worker.ts', import.meta.url),
      { type: 'module' }
    );

    // Set up the persistent message handler
    this.worker.onmessage = (e) => {
      const { type, books, isComplete, error } = e.data;

      if (type === 'PROGRESS') {
        this.currentBooks = books;
        this.isComplete = isComplete;

        // Notify all subscribers
        this.notifySubscribers();

        if (isComplete) {
          this.isFetching = false;
          persistenceService.saveBooks(books);
        }
      } else if (type === 'ERROR') {
        this.isFetching = false;
        console.error('Worker error:', error);
      }
    };

    return this.worker;
  }

  // Subscribe to updates. Returns unsubscribe function.
  subscribe(callback: (books: Book[], isComplete: boolean) => void): () => void {
    this.subscribers.add(callback);

    // Immediately invoke with current state so the component gets latest data right away
    callback(this.currentBooks, this.isComplete);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.currentBooks, this.isComplete);
      } catch (err) {
        console.error('Error in subscriber callback:', err);
      }
    });
  }

  // Start the fetching process if not already running
  async init(): Promise<void> {
    // 1. Load from persistence first for immediate display
    const persistedBooks = await persistenceService.getAllBooks();
    if (persistedBooks.length > 0) {
      this.currentBooks = persistedBooks;
      this.isComplete = false; // We assume there might be updates
      this.notifySubscribers();
    }

    // 2. Start Network Fetch
    if (!this.isFetching) {
      this.startWorkerFetch();
    }
  }

  private startWorkerFetch() {
    if (this.isFetching) return;
    this.isFetching = true;
    this.isComplete = false;

    const worker = this.initWorker();
    worker.postMessage({ type: 'FETCH_ALL', url: OPDS_MAIN_URL });
  }

  // Reload data manually
  async refresh() {
    this.currentBooks = [];
    this.isComplete = false;
    this.notifySubscribers();
    this.startWorkerFetch();
  }

  clearCache(): void {
    this.currentBooks = [];
    this.isComplete = false;
    persistenceService.clearAll();
    console.log('Cache cleared');
  }
}

export const opdsParser = new OpdsParser();
