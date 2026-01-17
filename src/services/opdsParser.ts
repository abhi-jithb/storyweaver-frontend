import { XMLParser } from 'fast-xml-parser';
import { Book } from '../types/opds';
import { OPDS_MAIN_URL, CACHE_DURATION } from '../utils/constants';
import { validateAndSanitizeBook } from '../utils/validators';

interface CacheEntry {
  data: Book[];
  timestamp: number;
}

class OpdsParser {
  private cache: Map<string, CacheEntry> = new Map();
  private xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseTagValue: true,
      isArray: (name) => ['link', 'entry', 'category', 'author'].includes(name),
    });
  }

  async fetchAllBooks(): Promise<Book[]> {
    // Check cache first
    const cached = this.cache.get('all_books');
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached books');
      return cached.data;
    }

    try {
      console.log('Fetching OPDS catalog...');
      const mainRes = await fetch(OPDS_MAIN_URL);

      if (!mainRes.ok) {
        throw new Error(`Failed to fetch main catalog: ${mainRes.status}`);
      }

      const mainXml = await mainRes.text();
      const mainObj = this.xmlParser.parse(mainXml);

      const links = this.extractCatalogLinks(mainObj.feed?.link || []);
      console.log(`Found ${links.length} catalog links`);

      const allBooks: Book[] = [];

      for (const langLink of links) {
        try {
          const booksInCatalog = await this.fetchCatalogBooks(langLink);
          allBooks.push(...booksInCatalog);
        } catch (err) {
          console.warn(`Failed to fetch books for ${langLink.title}:`, err);
        }
      }

      // Cache the results
      this.cache.set('all_books', {
        data: allBooks,
        timestamp: Date.now(),
      });

      console.log(`Loaded ${allBooks.length} books total`);
      return allBooks;
    } catch (error) {
      console.error('Error fetching OPDS catalog:', error);
      throw new Error('Failed to load book catalog');
    }
  }

  /**
   * Progressive loading: Loads initial batch immediately, then continues loading in background
   * @param onProgress Callback fired when new books are loaded
   * @param initialBatchSize Number of catalogs to load in initial batch
   * @param batchSize Number of catalogs to load per subsequent batch
   * @param batchDelay Delay between batches in milliseconds
   */
  async fetchBooksProgressive(
    onProgress?: (books: Book[], isComplete: boolean) => void,
    initialBatchSize: number = 8,
    batchSize: number = 5,
    batchDelay: number = 100
  ): Promise<Book[]> {
    // Check cache first
    const cached = this.cache.get('all_books');
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached books');
      if (onProgress) {
        onProgress(cached.data, true);
      }
      return cached.data;
    }

    try {
      console.log('Fetching OPDS catalog (progressive)...');
      const mainRes = await fetch(OPDS_MAIN_URL);

      if (!mainRes.ok) {
        throw new Error(`Failed to fetch main catalog: ${mainRes.status}`);
      }

      const mainXml = await mainRes.text();
      const mainObj = this.xmlParser.parse(mainXml);

      const links = this.extractCatalogLinks(mainObj.feed?.link || []);
      console.log(`Found ${links.length} catalog links`);

      const allBooks: Book[] = [];
      const totalLinks = links.length;

      // Load initial batch immediately
      const initialLinks = links.slice(0, initialBatchSize);
      console.log(`Loading initial batch of ${initialLinks.length} catalogs...`);

      for (const langLink of initialLinks) {
        try {
          const booksInCatalog = await this.fetchCatalogBooks(langLink);
          allBooks.push(...booksInCatalog);
          if (onProgress) {
            onProgress([...allBooks], false);
          }
        } catch (err) {
          console.warn(`Failed to fetch books for ${langLink.title}:`, err);
        }
      }

      console.log(`Initial batch loaded: ${allBooks.length} books`);

      // Load remaining catalogs in batches
      const remainingLinks = links.slice(initialBatchSize);
      if (remainingLinks.length > 0) {
        console.log(`Loading remaining ${remainingLinks.length} catalogs in background...`);

        for (let i = 0; i < remainingLinks.length; i += batchSize) {
          const batch = remainingLinks.slice(i, i + batchSize);

          // Add delay between batches to prevent overwhelming the browser
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, batchDelay));
          }

          // Load batch in parallel
          const batchPromises = batch.map(async (langLink) => {
            try {
              return await this.fetchCatalogBooks(langLink);
            } catch (err) {
              console.warn(`Failed to fetch books for ${langLink.title}:`, err);
              return [];
            }
          });

          const batchResults = await Promise.all(batchPromises);
          const newBooks = batchResults.flat();
          allBooks.push(...newBooks);

          if (onProgress) {
            const isComplete = i + batchSize >= remainingLinks.length;
            onProgress([...allBooks], isComplete);
          }
        }
      }

      // Cache the results
      this.cache.set('all_books', {
        data: allBooks,
        timestamp: Date.now(),
      });

      console.log(`Loaded ${allBooks.length} books total`);
      if (onProgress) {
        onProgress([...allBooks], true);
      }
      return allBooks;
    } catch (error) {
      console.error('Error fetching OPDS catalog:', error);
      throw new Error('Failed to load book catalog');
    }
  }

  private extractCatalogLinks(links: any[]): any[] {
    if (!Array.isArray(links)) {
      links = links ? [links] : [];
    }

    return links.filter(
      (link) =>
        link?.href &&
        link?.title &&
        (link.type?.includes('navigation') ||
          link.type?.includes('acquisition') ||
          link.rel === 'subsection' ||
          link.rel?.includes('navigation'))
    );
  }

  private async fetchCatalogBooks(langLink: any): Promise<Book[]> {
    const res = await fetch(langLink.href);
    if (!res.ok) throw new Error(`Failed to fetch ${langLink.href}`);

    const xml = await res.text();
    const obj = this.xmlParser.parse(xml);

    const entries = obj.feed?.entry || [];
    const entriesArray = Array.isArray(entries) ? entries : entries ? [entries] : [];

    return entriesArray
      .map((entry: any) => this.extractBookMetadata(entry, langLink.title))
      .filter(Boolean) as Book[];
  }

  private extractBookMetadata(entry: any, language: string): Book | null {
    if (!entry?.title) return null;

    const links = Array.isArray(entry.link)
      ? entry.link
      : entry.link
        ? [entry.link]
        : [];

    const publishedDate = (entry.published || entry.updated || entry['dcterms:issued'])
      ? new Date(entry.published || entry.updated || entry['dcterms:issued']).toISOString().split('T')[0]
      : undefined;

    const book: Book = {
      id: entry.id || `book-${Math.random().toString(36).slice(2)}`,
      title: entry.title,
      author: this.extractAuthor(entry.author),
      summary: entry.summary || entry.content || '',
      cover: links.find((l: any) => l.rel === 'http://opds-spec.org/image')?.href || '',
      downloadLink: links.find((l: any) => l.rel?.includes('acquisition'))?.href || '',
      language,
      level: this.extractLevel(entry),
      categories: this.extractCategories(entry.category),
      publisher: entry.publisher || entry['dcterms:publisher'] || entry['dc:publisher'],
      publishedDate,
      rating: this.extractRating(entry),
      tags: this.extractTags(entry.category),
    };

    return validateAndSanitizeBook(book);
  }

  private extractAuthor(author: any): string {
    if (!author) return 'Unknown';
    if (typeof author === 'string') return author;
    if (Array.isArray(author)) {
      return author.map((a) => (typeof a === 'string' ? a : a?.name || '')).join(', ');
    }
    return author?.name || 'Unknown';
  }

  private extractLevel(entry: any): string | undefined {
    // 1. Try lrmi:educationalAlignment (common in StoryWeaver OPDS)
    const eduAlign = entry['lrmi:educationalAlignment'] || entry['educationalAlignment'];
    if (eduAlign) {
      const term = eduAlign.targetName || eduAlign.term;
      if (term) {
        if (/^\d+$/.test(term)) return `Level ${term}`;
        return term;
      }
    }

    // 2. Try category tags
    const categories = entry.category;
    const cats = Array.isArray(categories)
      ? categories
      : categories
        ? [categories]
        : [];

    // Look for category with 'level' in scheme or label
    const levelCat = cats.find((c: any) =>
      c?.scheme?.toLowerCase()?.includes('level') ||
      c?.label?.toLowerCase()?.includes('level') ||
      c?.term?.toLowerCase()?.includes('level')
    );

    if (levelCat) {
      const term = levelCat.label || levelCat.term;
      if (term) {
        // Ensure it starts with 'Level ' for consistency
        if (/^\d+$/.test(term)) return `Level ${term}`;
        return term;
      }
    }

    return undefined;
  }

  private extractCategories(categories: any): string[] {
    const cats = Array.isArray(categories)
      ? categories
      : categories
        ? [categories]
        : [];
    return cats
      .filter((c: any) => c?.term && !c?.scheme?.includes('level'))
      .map((c: any) => c.term)
      .filter((t: string) => t && typeof t === 'string' && t.trim());
  }

  private extractTags(categories: any): string[] {
    return this.extractCategories(categories);
  }

  private extractRating(entry: any): number | undefined {
    const rating = entry.rating || entry['opds:rating'];
    if (!rating) return undefined;
    const num = parseFloat(String(rating));
    return isNaN(num) ? undefined : num;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('Cache cleared');
  }
}

export const opdsParser = new OpdsParser();
