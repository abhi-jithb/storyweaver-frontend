import React, { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StepIndicator } from '../components/StepIndicator';
import { truncateText } from '../utils/formatters';
import { Trash2, Search, ArrowRight, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

export const ReviewSelection: React.FC = () => {
  const { selectedBooks, toggleBook, totalCount } = useCart();
  const navigate = useNavigate();
  const books = Array.from(selectedBooks.values());

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key] || '';
        const bValue = (b as any)[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [books, searchQuery, sortConfig]);

  const summary = useMemo(() => {
    const stats = {
      languages: {} as Record<string, number>,
      levels: {} as Record<string, number>,
      categories: {} as Record<string, number>,
    };

    books.forEach((book) => {
      if (book.language) stats.languages[book.language] = (stats.languages[book.language] || 0) + 1;
      if (book.level) stats.levels[book.level] = (stats.levels[book.level] || 0) + 1;
      if (book.categories) {
        book.categories.forEach((cat) => {
          stats.categories[cat] = (stats.categories[cat] || 0) + 1;
        });
      }
    });

    return {
      languages: Object.entries(stats.languages).sort((a, b) => b[1] - a[1]).slice(0, 5),
      levels: Object.entries(stats.levels).sort((a, b) => b[1] - a[1]).slice(0, 5),
      categories: Object.entries(stats.categories).sort((a, b) => b[1] - a[1]).slice(0, 5),
    };
  }, [books]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (!sortConfig || sortConfig.key !== column) return <ChevronDown size={14} className="opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (books.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-3xl font-black text-gray-900 mb-4">Your selection is empty</h2>
        <p className="text-gray-500 mb-8">Go back to the catalog to choose some stories.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <StepIndicator currentStep={2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: List of Books */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-gray-900">Review Items ({totalCount})</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search in selection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 rounded-xl text-sm transition-all outline-none w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="p-4 w-16">Cover</th>
                      <th className="p-4 cursor-pointer hover:text-primary-600" onClick={() => handleSort('title')}>
                        <div className="flex items-center gap-1">Title <SortIcon column="title" /></div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-primary-600" onClick={() => handleSort('author')}>
                        <div className="flex items-center gap-1">Author <SortIcon column="author" /></div>
                      </th>
                      <th className="p-4">Meta</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <AnimatePresence mode="popLayout">
                      {filteredAndSortedBooks.map((book) => (
                        <motion.tr
                          key={book.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="hover:bg-gray-50/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="w-10 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                              <img src={book.cover} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-bold text-gray-900 line-clamp-1">{book.title}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-600 italic">
                            {truncateText(book.author, 20)}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-[9px] font-bold uppercase">{book.level}</span>
                              <span className="px-2 py-0.5 bg-secondary-50 text-secondary-600 rounded text-[9px] font-bold uppercase">{book.language}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleBook(book)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-primary-500/5 border border-gray-100 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6">Selection Summary</h2>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {summary.languages.map(([lang, count]) => (
                      <div key={lang} className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-700 flex items-center justify-between w-full">
                        <span>{lang}</span>
                        <span className="text-primary-500">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Top Categories</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {summary.categories.map(([cat, count]) => (
                      <span key={cat} className="px-2 py-1 bg-secondary-50 text-secondary-600 rounded-md text-[10px] font-bold">
                        {cat} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between mb-8">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Estimated Cost</span>
                <span className="text-2xl font-black text-gray-900">$0.00</span>
              </div>

              <button
                onClick={() => navigate('/payment')}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-98 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Proceed to Payment <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
