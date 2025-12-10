export const OPDS_MAIN_URL = process.env.VITE_OPDS_URL || 
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

export const DATE_FILTER_OPTIONS = [
  { label: 'All Time', value: 'all' as const },
  { label: 'Newest First', value: 'newest' as const },
  { label: 'Oldest First', value: 'oldest' as const },
  { label: 'Last 30 Days', value: 'last30days' as const },
  { label: 'Last Year', value: 'lastyear' as const },
];