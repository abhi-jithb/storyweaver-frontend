import React, { useMemo, useState, useDeferredValue } from 'react';
import { Book, FilterState } from '../types/opds';
import { BookCard } from './BookCard';
import { searchAlgorithm } from '../services/searchAlgorithm';
import { filterEngine } from '../services/filterEngine';
import { PAGE_SIZE } from '../utils/constants';

interface BookGridProps {
  books: Book[];
  filters: FilterState;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, filters }) => {
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
    <div className="flex-1">
      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
          >
            ← Prev
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
              return pageNum <= totalPages ? (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
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
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
