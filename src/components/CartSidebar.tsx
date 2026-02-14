import React from 'react';
import { useCart } from '../context/CartContext';
import { truncateText } from '../utils/formatters';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

import { motion, AnimatePresence } from 'framer-motion';

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
    const { selectedBooks, toggleBook, clearCart, totalCount } = useCart();
    const books = Array.from(selectedBooks.values());

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[160] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                            <div>
                                <h2 className="text-2xl font-display font-black text-gray-900">Your Selection</h2>
                                <p className="text-sm text-gray-500 font-medium">
                                    {totalCount} {totalCount === 1 ? 'book' : 'books'} ready for download
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Book List */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {books.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No books selected</h3>
                                    <p className="text-sm text-gray-500 max-w-[200px]">
                                        Browse the catalog and add books you'd like to download.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {books.map((book) => (
                                            <motion.div
                                                key={book.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                className="group flex gap-4 p-3 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-300 overflow-hidden"
                                            >
                                                <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                    {book.cover ? (
                                                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 text-center p-1">
                                                            No Cover
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <h4 className="text-sm font-bold text-gray-900 truncate mb-1">
                                                        {book.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 font-medium">by {truncateText(book.author, 20)}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleBook(book)}
                                                    className="self-center p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Remove item"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {books.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        onClick={clearCart}
                                        className="text-red-500 font-bold hover:text-red-600 py-2"
                                    >
                                        Clear All
                                    </button>
                                    <div className="text-right">
                                        <span className="text-gray-500 font-medium">Total Books: </span>
                                        <span className="text-lg font-black text-gray-900">{totalCount}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-98 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <span>Download Selected</span>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                <p className="text-[10px] text-center text-gray-400 font-medium px-4">
                                    Large downloads may take a moment to process. You will receive a notification once the PDF files are ready.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
