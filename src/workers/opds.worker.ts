import { XMLParser } from 'fast-xml-parser';
import { Book } from '../types/opds';
import { fetchWithRetry, ConcurrencyLimiter } from '../utils/fetchUtils';
import { validateAndSanitizeBook } from '../utils/validators';

const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseTagValue: true,
    isArray: (name) => ['link', 'entry', 'category', 'author'].includes(name),
});

const concurrencyLimiter = new ConcurrencyLimiter(6);

self.onmessage = async (e: MessageEvent) => {
    const { type, url } = e.data;

    if (type === 'FETCH_ALL') {
        try {
            await fetchAllProgressive(url);
        } catch (error: any) {
            self.postMessage({ type: 'ERROR', error: error.message });
        }
    }
};

async function fetchAllProgressive(mainUrl: string) {
    const response = await fetchWithRetry(mainUrl);
    const xml = await response.text();
    const obj = xmlParser.parse(xml);

    const links = extractCatalogLinks(obj.feed?.link || []);
    let allBooks: Book[] = [];
    let completedCount = 0;

    // Batching logic: Send books every 500ms or when we have enough
    let lastEmitTime = Date.now();
    const BATCH_INTERVAL = 500;

    const processCatalog = async (initialLink: any) => {
        let currentUrl = initialLink.href;
        let pageCount = 0;

        while (currentUrl && pageCount < 50) { // Safety break after 50 pages per section
            try {
                const res = await fetchWithRetry(currentUrl);
                const subXml = await res.text();
                const subObj = xmlParser.parse(subXml);

                const entries = subObj.feed?.entry || [];
                const entriesArray = Array.isArray(entries) ? entries : entries ? [entries] : [];

                const books = entriesArray
                    .map((entry: any) => extractBookMetadata(entry, initialLink.title))
                    .filter(Boolean) as Book[];

                allBooks.push(...books);
                // Fix: Don't increment completedCount here, we only do it once per initial link

                // Check for next link
                const feedLinks = subObj.feed?.link || [];
                const nextLink = (Array.isArray(feedLinks) ? feedLinks : [feedLinks])
                    .find((l: any) => l.rel === 'next');

                currentUrl = nextLink ? nextLink.href : null;

                // If relative URL, append to base
                if (currentUrl && !currentUrl.startsWith('http')) {
                    const baseUrl = new URL(initialLink.href).origin;
                    currentUrl = new URL(currentUrl, baseUrl).toString();
                }

                pageCount++;

                const now = Date.now();
                if (now - lastEmitTime > BATCH_INTERVAL) {
                    self.postMessage({
                        type: 'PROGRESS',
                        books: allBooks,
                        isComplete: false
                    });
                    lastEmitTime = now;
                }
            } catch (err) {
                console.error(`Worker failed to fetch page ${pageCount} of ${initialLink.title}:`, err);
                break;
            }
        }

        completedCount++;
        if (completedCount === links.length) {
            self.postMessage({
                type: 'PROGRESS',
                books: allBooks,
                isComplete: true
            });
        }
    };

    await Promise.all(links.map(link =>
        concurrencyLimiter.run(() => processCatalog(link))
    ));
}

function extractCatalogLinks(links: any[]): any[] {
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

function extractBookMetadata(entry: any, language: string): Book | null {
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
        author: extractAuthor(entry.author),
        summary: entry.summary || entry.content || '',
        cover: links.find((l: any) => l.rel === 'http://opds-spec.org/image')?.href || '',
        downloadLink: links.find((l: any) => l.rel?.includes('acquisition'))?.href || '',
        language,
        level: extractLevel(entry),
        categories: extractCategories(entry.category),
        publisher: entry.publisher || entry['dcterms:publisher'] || entry['dc:publisher'],
        publishedDate,
        rating: extractRating(entry),
        tags: extractCategories(entry.category),
    };

    return validateAndSanitizeBook(book);
}

function extractAuthor(author: any): string {
    if (!author) return 'Unknown';
    if (typeof author === 'string') return author;
    if (Array.isArray(author)) {
        return author.map((a) => (typeof a === 'string' ? a : a?.name || '')).join(', ');
    }
    return author?.name || 'Unknown';
}

function extractLevel(entry: any): string | undefined {
    const eduAlign = entry['lrmi:educationalAlignment'] || entry['educationalAlignment'];
    if (eduAlign) {
        const term = eduAlign.targetName || eduAlign.term;
        if (term) {
            if (/^\d+$/.test(term)) return `Level ${term}`;
            return term;
        }
    }

    const categories = entry.category;
    const cats = Array.isArray(categories) ? categories : categories ? [categories] : [];
    const levelCat = cats.find((c: any) =>
        c?.scheme?.toLowerCase()?.includes('level') ||
        c?.label?.toLowerCase()?.includes('level') ||
        c?.term?.toLowerCase()?.includes('level')
    );

    if (levelCat) {
        const term = levelCat.label || levelCat.term;
        if (term) {
            if (/^\d+$/.test(term)) return `Level ${term}`;
            return term;
        }
    }
    return undefined;
}

function extractCategories(categories: any): string[] {
    const cats = Array.isArray(categories) ? categories : categories ? [categories] : [];
    return cats
        .filter((c: any) => c?.term && !c?.scheme?.includes('level'))
        .map((c: any) => c.term)
        .filter((t: string) => t && typeof t === 'string' && t.trim());
}

function extractRating(entry: any): number | undefined {
    const rating = entry.rating || entry['opds:rating'];
    if (!rating) return undefined;
    const num = parseFloat(String(rating));
    return isNaN(num) ? undefined : num;
}
