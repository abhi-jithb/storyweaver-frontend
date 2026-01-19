import React, { useMemo, useState, useDeferredValue } from 'react';
import { Book, FilterState } from '../types/opds';
import { BookCard } from './BookCard';
import { searchAlgorithm } from '../services/searchAlgorithm';
import { filterEngine } from '../services/filterEngine';
import { PAGE_SIZE } from '../utils/constants';
import { useCart } from '../context/CartContext';

interface BookGridProps {
  books: Book[];
  filters: FilterState;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, filters }) => {
  const { selectAll, deselectAll, selectedBooks } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const deferredSearch = useDeferredValue(filters.searchQuery);

  const processedBooks = useMemo(() => {
    let result = filterEngine.filterBooks(books, filters);

    const searchTerm = deferredSearch.trim();
    if (searchTerm.length >= 2) {
      const searchResults = searchAlgorithm.search(result, searchTerm);
      result = searchResults.map((r) => r.book);
    }

    return result;
  }, [books, filters, deferredSearch]);

  const allSelectedInView = useMemo(() => {
    if (processedBooks.length === 0) return false;
    return processedBooks.every(book => selectedBooks.has(book.id));
  }, [processedBooks, selectedBooks]);

  const handleSelectAll = () => {
    if (allSelectedInView) {
      deselectAll(processedBooks.map(b => b.id));
    } else {
      selectAll(processedBooks);
    }
  };

  const totalPages = Math.ceil(processedBooks.length / PAGE_SIZE);
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return processedBooks.slice(startIndex, startIndex + PAGE_SIZE);
  }, [processedBooks, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  if (processedBooks.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 text-lg mb-4">📭 No books found</p>
        <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      {/* Bulk Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${allSelectedInView
                ? 'bg-secondary-100 text-secondary-700 border-2 border-secondary-200'
                : 'bg-primary-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-transparent'
              }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${allSelectedInView ? 'bg-secondary-600 border-secondary-600' : 'bg-white border-gray-300'
              }`}>
              {allSelectedInView && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {allSelectedInView ? 'Deselect All Matching' : `Select All ${processedBooks.length} Matching`}
          </button>

          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            {processedBooks.length} books found
          </span>
        </div>

        {selectedBooks.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary-600">
              {selectedBooks.size} selected
            </span>
            <button
              onClick={() => deselectAll(Array.from(selectedBooks.keys()))}
              className="text-xs font-bold text-red-500 hover:text-red-600 underline underline-offset-4"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {/* Responsive Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 flex-1">
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary-500 hover:shadow-md transition-all duration-200 text-sm font-semibold text-gray-700 min-h-[44px] sm:min-h-0 hover:scale-105 disabled:hover:scale-100"
          >
            ← Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
              return pageNum <= totalPages ? (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 sm:px-4 py-2.5 sm:py-2.5 rounded-xl text-sm font-bold min-h-[44px] sm:min-h-0 min-w-[44px] sm:min-w-0 transition-all duration-300 ${currentPage === pageNum
                    ? 'bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white shadow-lg scale-110'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary-400 hover:shadow-md hover:scale-105'
                    }`}
                >
                  {pageNum}
                </button>
              ) : null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary-500 hover:shadow-md transition-all duration-200 text-sm font-semibold text-gray-700 min-h-[44px] sm:min-h-0 hover:scale-105 disabled:hover:scale-100"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
