import { Book } from '../types/opds';
import { OPDS_MAIN_URL, CACHE_DURATION } from '../utils/constants';
import { persistenceService } from '../utils/persistence';

interface CacheEntry {
  data: Book[];
  timestamp: number;
}

type SubscriberCallback = (books: Book[], isComplete: boolean, error: string | null) => void;

class OpdsParser {
  private worker: Worker | null = null;
  private isFetching = false;

  // State for Observer Pattern
  private subscribers: Set<SubscriberCallback> = new Set();
  private currentBooks: Book[] = [];
  private isComplete = false;
  private currentError: string | null = null;

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
        const networkBooks = books as Book[];

        // Use a Map to merge while preserving local/manual books
        const bookMap = new Map<string, Book>();

        // 1. Add existing books (preserves local manual ones)
        this.currentBooks.forEach(b => bookMap.set(b.id, b));

        // 2. Add/Overwrite with network books
        networkBooks.forEach(b => bookMap.set(b.id, b));

        this.currentBooks = Array.from(bookMap.values());
        this.isComplete = isComplete;
        this.currentError = null;

        this.notifySubscribers();

        if (isComplete) {
          this.isFetching = false;
          persistenceService.saveBooks(this.currentBooks).catch(console.error);
        }
      } else if (type === 'ERROR') {
        this.isFetching = false;
        this.currentError = error;
        console.error('Worker error:', error);
        this.notifySubscribers();
      }
    };

    return this.worker;
  }

  // Subscribe to updates. Returns unsubscribe function.
  subscribe(callback: SubscriberCallback): () => void {
    this.subscribers.add(callback);

    // Immediately invoke with current state
    callback(this.currentBooks, this.isComplete, this.currentError);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.currentBooks, this.isComplete, this.currentError);
      } catch (err) {
        console.error('Error in subscriber callback:', err);
      }
    });
  }

  // Start the fetching process if not already running
  async init(): Promise<void> {
    // 1. Load from persistence first for immediate display
    try {
      const persistedBooks = await persistenceService.getAllBooks();
      if (persistedBooks.length > 0) {
        this.currentBooks = persistedBooks;
        this.notifySubscribers();
      }
    } catch (err) {
      console.error('Failed to load initially from IndexedDB:', err);
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
