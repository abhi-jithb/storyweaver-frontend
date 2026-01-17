import { useBooks } from './hooks/useBooks';
import { useFilters } from './hooks/useFilters';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { BookGrid } from './components/BookGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ErrorBoundary } from './components/ErrorBoundary';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import ErrorPage from './components/ErrorPage';
import { BookDetails } from './components/BookDetails';
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

function MainAppContent() {
  const { books, loading, error } = useBooks();
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

  const [showFilters, setShowFilters] = useState(false);

  // Calculate unique languages for Hero stats
  const languageCount = useMemo(() => {
    const uniqueLanguages = new Set(books.map(book => book.language).filter(Boolean));
    return uniqueLanguages.size;
  }, [books]);

  // Show loading spinner only on initial load (when no books yet)
  if (loading && books.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-scaleIn">
          <h2 className="text-4xl font-display font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-cyan-50 animate-fadeIn">
      {/* Mobile Filter Toggle - Fixed Top Right */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden fixed top-4 right-4 z-[100] bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/50 backdrop-blur-sm"
        aria-label={showFilters ? 'Hide filters' : 'Show filters'}
      >
        {showFilters ? (
          <svg className="w-6 h-6 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        )}
      </button>

      {/* Hero Section */}
      <Hero bookCount={books.length} languageCount={languageCount} />

      {/* Header */}
      <header className="glass-white shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-5 sm:py-7">
          {/* Title Row */}
          <div className="flex items-start justify-between mb-5 sm:mb-7 gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black gradient-text-purple leading-tight mb-2">
                StoryWeaver OPDS
              </h1>
              <p className="text-gray-700 text-base sm:text-lg mt-2 font-medium leading-relaxed">
                {books.length > 0
                  ? `Discover ${books.length.toLocaleString()} stories in multiple languages`
                  : 'Loading book catalog...'}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={updateSearchQuery} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
          {/* Filters - Always visible on desktop, togglable on mobile */}
          <div
            className={`
              ${showFilters ? 'fixed inset-0 bg-black/50 z-40 lg:hidden' : 'hidden'}
            `}
            onClick={() => setShowFilters(false)}
          />

          <div className={`
            w-full lg:w-72 flex-shrink-0 
            lg:relative fixed lg:top-auto top-0 left-0 h-full lg:h-auto z-50 lg:z-auto 
            max-w-sm lg:max-w-none transform transition-transform duration-300 ease-in-out
            ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${!showFilters ? 'hidden lg:block' : 'block'}
          `}>
            <div className="bg-white rounded-r-2xl lg:rounded-2xl border-r lg:border border-gray-200 shadow-2xl lg:shadow-lg h-full lg:h-auto overflow-y-auto custom-scrollbar">
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

          <div className="flex-1 min-w-0">
            <BookGrid books={books} filters={filters} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainAppContent />,
    },
    {
      path: "/search",
      element: <MainAppContent />,
    },
    {
      path: "/book/:bookId",
      element: <PageLayout><BookDetails /></PageLayout>,
    },
    {
      path: "/404",
      element: <ErrorPage />,
    },
    {
      path: "*",
      element: <Navigate to="/404" />,
    },
  ]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );

}

export default App;
