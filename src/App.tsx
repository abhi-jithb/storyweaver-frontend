import { useState, useEffect, useCallback } from 'react';
import { Book, FilterState } from './types/opds';
import { BookGrid } from './components/BookGrid';
import { FilterSidebar } from './components/FilterSidebar';
import { SearchBar } from './components/SearchBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { filterEngine } from './services/filterEngine';
import { searchAlgorithm } from './services/searchAlgorithm';
import './App.css';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    languages: new Set(),
    levels: new Set(),
    categories: new Set(),
    publishers: new Set(),
    dateFilter: 'all',
    searchQuery: ''
  });

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('YOUR_API_ENDPOINT/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      languages: new Set(),
      levels: new Set(),
      categories: new Set(),
      publishers: new Set(),
      dateFilter: 'all',
      searchQuery: ''
    });
  }, []);

  if (loading) return <div className="p-4">Loading books...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">StoryWeaver</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 flex-shrink-0">
              <FilterSidebar
                books={books}
                filters={filters}
                onLanguageChange={(lang) => handleFilterChange({
                  languages: new Set(filters.languages).add(lang)
                })}
                onLevelChange={(level) => handleFilterChange({
                  levels: new Set(filters.levels).add(level)
                })}
                onCategoryChange={(category) => handleFilterChange({
                  categories: new Set(filters.categories).add(category)
                })}
                onPublisherChange={(publisher) => handleFilterChange({
                  publishers: new Set(filters.publishers).add(publisher)
                })}
                onDateChange={(dateFilter) => handleFilterChange({ dateFilter })}
                onReset={resetFilters}
                hasActiveFilters={
                  filters.languages.size > 0 ||
                  filters.levels.size > 0 ||
                  filters.categories.size > 0 ||
                  filters.publishers.size > 0 ||
                  filters.dateFilter !== 'all' ||
                  !!filters.searchQuery
                }
              />
            </div>

            <div className="flex-1">
              <BookGrid books={books} filters={filters} />
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;