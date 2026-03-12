import React, { useMemo, useState, useDeferredValue, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, FilterState } from '../types/opds';
import { BookCard } from './BookCard';
import { BookTable } from './BookTable';
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
import { Trash2, Edit2, Download, Plus, XCircle, Grid, List, CheckSquare, Square } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  filters: FilterState;
  loading?: boolean;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, filters, loading }) => {
  const { selectAll, deselectAll, selectedBooks, clearCart, isBookSelected, toggleBook } = useCart();
  const { deleteBooks, updateBooks, addBook } = useBooksContext();
  const { showToast } = useNotification();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [viewSelectedOnly, setViewSelectedOnly] = useState(false);
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

  const processedBooks = useMemo(() => {
    let result = filterEngine.filterBooks(books, filters);

    const searchTerm = deferredSearch.trim();
    if (searchTerm.length >= 2) {
      const searchResults = searchAlgorithm.search(result, searchTerm);
      result = searchResults.map((r) => r.book);
    }

    return result;
  }, [books, filters, deferredSearch]);

  const displayedBooks = useMemo(() => {
    if (viewSelectedOnly) {
      return processedBooks.filter(book => selectedBooks.has(book.id));
    }
    return processedBooks;
  }, [processedBooks, viewSelectedOnly, selectedBooks]);

  const totalPages = Math.ceil(displayedBooks.length / pageSize);
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return displayedBooks.slice(startIndex, startIndex + pageSize);
  }, [displayedBooks, currentPage, pageSize]);

  const allPageSelectedInView = useMemo(() => {
    if (paginatedBooks.length === 0) return false;
    return paginatedBooks.every(book => selectedBooks.has(book.id));
  }, [paginatedBooks, selectedBooks]);

  const allSelectedInView = useMemo(() => {
    if (displayedBooks.length === 0) return false;
    return displayedBooks.every(book => selectedBooks.has(book.id));
  }, [displayedBooks, selectedBooks]);

  const handleSelectPage = () => {
    if (allPageSelectedInView) {
      deselectAll(paginatedBooks.map(b => b.id));
    } else {
      selectAll(paginatedBooks);
    }
  };

  const handleSelectAll = () => {
    if (allSelectedInView) {
      deselectAll(displayedBooks.map(b => b.id));
    } else {
      selectAll(displayedBooks);
    }
  };

  // Reset to page 1 and clear selection when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    if (selectedBooks.size > 0) {
      clearCart();
    }
  }, [filters, clearCart, selectedBooks.size]); 

  // Handle page size change separately
  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, viewSelectedOnly]);

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
      {/* Selection Status Bar - Sticky */}
      <div className="flex flex-col gap-4 mb-8 sticky top-24 z-40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/95 backdrop-blur-md rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 gap-4 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 opacity-50"></div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
              <button
                onClick={handleSelectPage}
                title="Select all on this page"
                className={`flex items-center justify-center p-3 rounded-xl transition-all ${allPageSelectedInView ? 'bg-secondary-50 text-secondary-700 border border-secondary-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent'}`}
              >
                {allPageSelectedInView ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
              <button
                onClick={handleSelectAll}
                className={`group flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all duration-300 transform active:scale-95 ${allSelectedInView
                  ? 'bg-secondary-50 text-secondary-700 border-2 border-secondary-200'
                  : 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50'
                }`}
              >
                <span className="tracking-widest uppercase">
                  {allSelectedInView ? 'Deselect All' : `Select All ${displayedBooks.length}`}
                </span>
              </button>
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 leading-tight">Catalog</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {viewSelectedOnly ? `${selectedBooks.size} Selected Items` : `${processedBooks.length} Stories Found`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={18} />
              </button>
            </div>
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
                    onClick={() => setViewSelectedOnly(!viewSelectedOnly)}
                    className={`p-3 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl transition-all border flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 ${viewSelectedOnly ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200'}`}
                  >
                    View Selected ({selectedBooks.size})
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-3 bg-secondary-50 text-secondary-700 hover:bg-secondary-100 rounded-xl transition-all border border-secondary-100 flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95"
                  >
                    <Edit2 size={16} strokeWidth={3} />
                  </button>
                  <button
                    onClick={handleExport}
                    className="p-3 bg-accent-50 text-accent-700 hover:bg-accent-100 rounded-xl transition-all border border-accent-100 flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95"
                  >
                    <Download size={16} strokeWidth={3} />
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="p-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition-all border border-red-100 flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95"
                  >
                    <Trash2 size={16} strokeWidth={3} />
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

      {/* Grid or Table view */}
      {viewMode === 'grid' ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 flex-1"
        >
          {paginatedBooks.map((book, index) => (
            <motion.div key={book.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <BookCard 
                book={book} 
                priority={index < 8} 
                isSelected={isBookSelected(book.id)}
                onToggle={toggleBook}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="mb-6 sm:mb-8 flex-1">
          <BookTable 
            books={paginatedBooks} 
            isBookSelected={isBookSelected}
            onToggle={toggleBook}
          />
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-sm font-semibold text-gray-500">
          Showing <span className="text-gray-900">{displayedBooks.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to <span className="text-gray-900">{Math.min(currentPage * pageSize, displayedBooks.length)}</span> of <span className={`${viewSelectedOnly ? 'text-secondary-600' : 'text-primary-600'} font-bold`}>{displayedBooks.length}</span> {viewSelectedOnly ? 'selected items' : 'stories'}
        </div>
        
        <div className="flex items-center gap-4">
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:border-primary-500 text-sm font-semibold text-gray-700 hover:scale-105 transition-all"
              >
                ←
              </button>

              <div className="flex gap-1 hidden sm:flex">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-primary-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-400'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:border-primary-500 text-sm font-semibold text-gray-700 hover:scale-105 transition-all"
              >
                →
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Per Page</label>
            <select 
              value={pageSize} 
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2 font-semibold"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

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
