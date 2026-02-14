import React, { useMemo, useState, useDeferredValue, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, FilterState } from '../types/opds';
import { BookCard } from './BookCard';
import { searchAlgorithm } from '../services/searchAlgorithm';
import { filterEngine } from '../services/filterEngine';
import { PAGE_SIZE } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from './LoadingSpinner';
import { useBooksContext } from '../context/BooksContext';
import { exportToCSV } from '../utils/exportUtils';
import { useNotification } from '../context/NotificationContext';
import { AddBookModal } from './AddBookModal';
import { BulkEditModal } from './BulkEditModal';
import { Trash2, Edit2, Download, Plus, CheckSquare, Square, XCircle } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  filters: FilterState;
  loading?: boolean;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, filters, loading }) => {
  const { selectAll, deselectAll, selectedBooks, clearCart } = useCart();
  const { deleteBooks, updateBooks, addBook } = useBooksContext();
  const { showToast } = useNotification();

  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const deferredSearch = useDeferredValue(filters.searchQuery);

  const handleBulkDelete = useCallback(() => {
    if (selectedBooks.size === 0) return;
    const count = selectedBooks.size;
    if (window.confirm(`Are you sure you want to delete ${count} stories?`)) {
      deleteBooks(Array.from(selectedBooks.keys()));
      clearCart();
      showToast(`Successfully deleted ${count} stories`, 'success');
    }
  }, [selectedBooks, deleteBooks, clearCart, showToast]);

  const handleExport = useCallback(() => {
    if (selectedBooks.size === 0) return;
    try {
      exportToCSV(Array.from(selectedBooks.values()));
      showToast(`Exported ${selectedBooks.size} books to CSV`, 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    }
  }, [selectedBooks, showToast]);

  const handleBulkUpdate = useCallback((updates: Partial<Book>) => {
    updateBooks(Array.from(selectedBooks.keys()), updates);
    showToast(`Updated ${selectedBooks.size} stories successfully`, 'success');
    clearCart();
  }, [selectedBooks, updateBooks, clearCart, showToast]);

  const handleAddBook = useCallback((book: Book) => {
    addBook(book);
    showToast(`"${book.title}" added to your collection`, 'success');
  }, [addBook, showToast]);

  // ... (useMemo for processedBooks remains same) ...
  const processedBooks = useMemo(() => {
    let result = filterEngine.filterBooks(books, filters);

    const searchTerm = deferredSearch.trim();
    if (searchTerm.length >= 2) {
      const searchResults = searchAlgorithm.search(result, searchTerm);
      result = searchResults.map((r) => r.book);
    }

    return result;
  }, [books, filters, deferredSearch]);

  // ... (other hooks) ...

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
    if (loading) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <LoadingSpinner />
          <p className="text-gray-400 text-sm mt-4">Searching books...</p>
        </div>
      );
    }

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
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 opacity-50"></div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className={`group flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 transform active:scale-95 ${allSelectedInView
                ? 'bg-secondary-50 text-secondary-700 border-2 border-secondary-200'
                : 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50'
                }`}
            >
              {allSelectedInView ? <CheckSquare size={20} /> : <Square size={20} />}
              <span className="tracking-tight uppercase">
                {allSelectedInView ? 'Deselect All' : `Select All ${processedBooks.length}`}
              </span>
            </button>

            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 leading-tight">Catalog</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {processedBooks.length} Stories Available
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="p-3.5 bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-2xl transition-all border border-gray-100 flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95"
            >
              <Plus size={18} strokeWidth={3} /> Add New
            </button>

            <AnimatePresence>
              {selectedBooks.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="flex items-center gap-3 pl-3 border-l border-gray-200"
                >
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-3.5 bg-secondary-50 text-secondary-700 hover:bg-secondary-100 rounded-2xl transition-all border border-secondary-100 flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95"
                  >
                    <Edit2 size={18} strokeWidth={3} /> Edit
                  </button>
                  <button
                    onClick={handleExport}
                    className="p-3.5 bg-accent-50 text-accent-700 hover:bg-accent-100 rounded-2xl transition-all border border-accent-100 flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95"
                  >
                    <Download size={18} strokeWidth={3} /> CSV
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="p-3.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-2xl transition-all border border-red-100 flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95"
                  >
                    <Trash2 size={18} strokeWidth={3} />
                  </button>
                  <div className="flex flex-col items-end ml-2">
                    <span className="text-lg font-black text-primary-600 leading-tight">{selectedBooks.size}</span>
                    <button
                      onClick={clearCart}
                      className="text-[9px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                      Clear <XCircle size={10} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Responsive Book Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 flex-1"
      >
        {paginatedBooks.map((book, index) => (
          <motion.div
            key={book.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <BookCard
              book={book}
              priority={index < 8}
            />
          </motion.div>
        ))}
      </motion.div>

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
      {/* Modals */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBook}
      />

      <BulkEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleBulkUpdate}
        selectedCount={selectedBooks.size}
      />
    </div>
  );
};
