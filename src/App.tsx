import { useBooks } from './hooks/useBooks';
import { useFilters } from './hooks/useFilters';
import { FilterSidebar } from './components/FilterSidebar';
import { BookGrid } from './components/BookGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ErrorBoundary } from './components/ErrorBoundary';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate, ScrollRestoration } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import ErrorPage from './components/ErrorPage';
import { BookDetails } from './components/BookDetails';
// Native ScrollRestoration handles transitions between pages seamlessly
import { CartProvider } from './context/CartContext';
import { CartFloatingButton } from './components/CartFloatingButton';
import { CartSidebar } from './components/CartSidebar';
import { Header } from './components/Header';
import { BooksProvider } from './context/BooksContext';
import { NotificationProvider } from './context/NotificationContext';
import { ReviewSelection } from './pages/ReviewSelection';
import { Payment } from './pages/Payment';
import { DownloadPage } from './pages/DownloadPage';

function MainAppContent() {
  const { books, loading, error, filterOptions } = useBooks();
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

  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleCheckout = useCallback(() => {
    setShowCart(false);
    navigate('/review-selection');
  }, [navigate]);

  const languageCount = useMemo(() => {
    const uniqueLanguages = new Set(books.map(book => book.language).filter(Boolean));
    return uniqueLanguages.size;
  }, [books]);

  if (loading && books.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="relative min-h-[60vh] lg:min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white overflow-hidden">
        <div className="text-center max-w-md bg-white rounded-3xl shadow-2xl p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-cyan-50">
      <Hero bookCount={books.length} languageCount={languageCount} />

      <Header
        bookCount={books.length}
        onSearch={updateSearchQuery}
        showMobileFilter={true}
        onToggleFilter={() => setShowFilters(!showFilters)}
        isFilterOpen={showFilters}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
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
                filterOptions={filterOptions}
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
              loading={loading}
            />
          </div>
        </div>
      </div>

      <Footer />

      <CartFloatingButton onClick={() => setShowCart(true)} />
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <Header showSearch={false} />
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
          <ScrollRestoration />
          <MainAppContent />
        </>
      ),
    },
    {
      path: "/catalog",
      element: <Navigate to="/" />,
    },
    {
      path: "/review-selection",
      element: (
        <>
          <ScrollRestoration />
          <PageLayout><ReviewSelection /></PageLayout>
        </>
      ),
    },
    {
      path: "/payment",
      element: (
        <>
          <ScrollRestoration />
          <PageLayout><Payment /></PageLayout>
        </>
      ),
    },
    {
      path: "/download",
      element: (
        <>
          <ScrollRestoration />
          <PageLayout><DownloadPage /></PageLayout>
        </>
      ),
    },
    {
      path: "/book/:bookId",
      element: (
        <>
          <ScrollRestoration />
          <PageLayout><BookDetails /></PageLayout>
        </>
      ),
    },
    {
      path: "/404",
      element: (
        <>
          <ScrollRestoration />
          <ErrorPage />
        </>
      ),
    },
    {
      path: "*",
      element: (
        <>
          <ScrollRestoration />
          <ErrorPage />
        </>
      ),
    },
  ]);

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <BooksProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </BooksProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
