// Vite exposes env vars on import.meta.env (process.env is undefined in the browser)
export const OPDS_MAIN_URL =
  import.meta.env.VITE_OPDS_URL ||
  'https://storage.googleapis.com/story-weaver-e2e-production/catalog/catalog.xml';

export const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in ms

export const SEARCH_WEIGHTS = {
  title: 0.40,
  publisher: 0.36,
  tags: 0.12,
  authors: 0.15,
  language: 0.15,
  synopsis: 0.05,
};

export const PAGE_SIZE = 20;

// Progressive loading configuration
export const INITIAL_CATALOGS_TO_LOAD = 8; // Load first 8 catalogs immediately
export const CATALOGS_PER_BATCH = 5; // Load remaining catalogs in batches of 5
export const BATCH_DELAY_MS = 100; // Delay between batches to prevent overwhelming the browser

export const DATE_FILTER_OPTIONS = [
  { label: 'All Time', value: 'all' as const },
  { label: 'Newest First', value: 'newest' as const },
  { label: 'Oldest First', value: 'oldest' as const },
  { label: 'Last 30 Days', value: 'last30days' as const },
  { label: 'Last Year', value: 'lastyear' as const },
];