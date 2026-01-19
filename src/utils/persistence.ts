import { openDB, IDBPDatabase } from 'idb';
import { Book } from '../types/opds';

const DB_NAME = 'storyweaver_db';
const STORE_NAME = 'books';
const DB_VERSION = 1;

class PersistenceService {
    private dbPromise: Promise<IDBPDatabase<any>> | null = null;

    private getDB() {
        if (!this.dbPromise) {
            this.dbPromise = openDB(DB_NAME, DB_VERSION, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    }
                },
            });
        }
        return this.dbPromise;
    }

    async saveBooks(books: Book[]): Promise<void> {
        try {
            const db = await this.getDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);

            // Using put for bulk upsert
            await Promise.all([
                ...books.map(book => store.put(book)),
                tx.done
            ]);
        } catch (error) {
            console.error('Failed to save books to IndexedDB:', error);
        }
    }

    async getAllBooks(): Promise<Book[]> {
        try {
            const db = await this.getDB();
            return await db.getAll(STORE_NAME);
        } catch (error) {
            console.error('Failed to load books from IndexedDB:', error);
            return [];
        }
    }

    async clearAll(): Promise<void> {
        try {
            const db = await this.getDB();
            await db.clear(STORE_NAME);
        } catch (error) {
            console.error('Failed to clear IndexedDB:', error);
        }
    }
}

export const persistenceService = new PersistenceService();
