import { useBooks } from './hooks/useBooks';
import { useFilters } from './hooks/useFilters';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { BookGrid } from './components/BookGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ErrorBoundary } from './components/ErrorBoundary';
import { createBrowserRouter, RouterProvider, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import ErrorPage from './components/ErrorPage';
import { BookDetails } from './components/BookDetails';
// Removed unused BrowserRouter import
import ScrollToTop from './components/ScrollToTop';
import { CartProvider, useCart } from './context/CartContext';
import { CartFloatingButton } from './components/CartFloatingButton';
import { CartSidebar } from './components/CartSidebar';
import { SuccessPopup } from './components/SuccessPopup';
import logoImg from './assets/logo/storyweaver-logo.png';

function MainAppContent() {
  const { books, loading, loadingMore, error, filterOptions } = useBooks(); // Task 1 & 2: Get dynamic options
  const location = useLocation();
  // ...
  const navigate = useNavigate();
  const {
    filters,
    updateLanguage,
    updateLevel,
    updateCategory,
    updateDateFilter,
    updateSearchQuery,
    reset,
    hasActiveFilters,
  } = useFilters();

  const { totalCount, clearCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = useCallback(() => {
    console.log('Initiating download for selected books...');
    // In a real app, this would trigger the actual API call
    setShowCart(false);
    setShowSuccess(true);
    clearCart();
  }, [clearCart]);

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
            <div className="flex-1 min-w-0 flex items-center gap-4">
              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200"
                  aria-label="Go back"
                >
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}


              <div className="min-w-0">
                <img
                  src={logoImg}
                  alt="StoryWeaver"
                  className="h-12 sm:h-16 md:h-20 w-auto mb-2 object-contain"
                />
                <p className="text-gray-700 text-base sm:text-lg mt-2 font-medium leading-relaxed">
                  {books.length > 0
                    ? `Discover ${books.length.toLocaleString()} stories in multiple languages`
                    : 'Loading book catalog...'}
                </p>
              </div>
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
                filterOptions={filterOptions} // Task 2: Pass dynamic options
                filters={filters}
                onLanguageChange={updateLanguage}
                onLevelChange={updateLevel}
                onCategoryChange={updateCategory}
                onDateChange={updateDateFilter}
                onReset={reset}
                hasActiveFilters={hasActiveFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <BookGrid
              books={books}
              filters={filters}
              loading={loading || loadingMore}
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* Cart Components */}
      <CartFloatingButton onClick={() => setShowCart(true)} />
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Request Received!"
        message={`We've started preparing your ${totalCount} selected stories. You'll be notified as soon as the PDF downloads are ready.`}
      />
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
      element: (
        <>
          <ScrollToTop /> {/* Reset scroll on home */}
          <MainAppContent />
        </>
      ),
    },
    {
      path: "/search",
      element: (
        <>
          <ScrollToTop />
          <MainAppContent />
        </>
      ),
    },
    {
      path: "/book/:bookId",
      element: (
        <>
          <ScrollToTop />
          <PageLayout><BookDetails /></PageLayout>
        </>
      ),
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
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
