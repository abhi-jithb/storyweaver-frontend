import { useBooks } from './hooks/useBooks';
import { useFilters } from './hooks/useFilters';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { BookGrid } from './components/BookGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { useState } from 'react';

function App() {
  const { books, loading, loadingMore, error } = useBooks();
  const {
    filters,
    updateLanguage,
    updateLevel,
    updateCategory,
    updatePublisher,
    updateDateFilter,
    updateSearchQuery,
    reset,
    hasActiveFilters,
  } = useFilters();

  const [showFilters, setShowFilters] = useState(true);

  // Show loading spinner only on initial load (when no books yet)
  if (loading && books.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
             Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                StoryWeaver OPDS
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {books.length > 0
                  ? `Discover ${books.length.toLocaleString()} stories in multiple languages`
                  : 'Loading book catalog...'}
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              {showFilters ? '✕ Hide' : '☰ Show'} Filters
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={updateSearchQuery} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200">
                <FilterSidebar
                  books={books}
                  filters={filters}
                  onLanguageChange={updateLanguage}
                  onLevelChange={updateLevel}
                  onCategoryChange={updateCategory}
                  onPublisherChange={updatePublisher}
                  onDateChange={updateDateFilter}
                  onReset={reset}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </div>
          )}

          {/* Book Grid */}
          <div className="flex-1">
            <BookGrid books={books} filters={filters} />
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default App;
