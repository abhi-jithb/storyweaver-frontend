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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          {/* Title Row */}
          <div className="flex items-start justify-between mb-4 sm:mb-6 gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                StoryWeaver OPDS
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {books.length > 0
                  ? `Discover ${books.length.toLocaleString()} stories in multiple languages`
                  : 'Loading book catalog...'}
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 font-medium text-sm flex-shrink-0 min-h-[44px]"
              aria-label={showFilters ? 'Hide filters' : 'Show filters'}
            >
              {showFilters ? '✕' : '☰'}
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={updateSearchQuery} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Parent wrapper: flex flex-col md:flex-row */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
          {/* Sidebar Filters - Modal overlay on mobile, sidebar on desktop */}
          {showFilters && (
            <>
              {/* Mobile Overlay */}
              <div 
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setShowFilters(false)}
              />
              {/* Sidebar */}
              <div className="w-full md:w-64 flex-shrink-0 lg:relative fixed lg:top-auto top-0 left-0 h-full lg:h-auto z-50 lg:z-auto max-w-sm lg:max-w-none">
                <div className="bg-white rounded-lg lg:rounded-lg border border-gray-200 shadow-lg lg:shadow-none h-full lg:h-auto overflow-y-auto">
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
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Book Grid - flex-1 to fill remaining space */}
          <div className="flex-1 min-w-0">
            <BookGrid books={books} filters={filters} />
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default App;
