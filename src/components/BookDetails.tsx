import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { LoadingSpinner } from './LoadingSpinner';
import { ImageWithLoader } from './ImageWithLoader';
import {
    Home,
    ChevronRight,
    BookOpen,
    Volume2,
    Download,
    Languages,
    Save,
    Share2,
    MoreHorizontal,
    Plus,
    Heart,
    Book as BookIcon,
    ShieldCheck,
    ExternalLink
} from 'lucide-react';

export const BookDetails: React.FC = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const { books, loading } = useBooks();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [bookId]);

    const book = useMemo(() => books.find((b) => b.id === bookId), [books, bookId]);

    const stats = useMemo(() => ({
        likes: Math.floor(Math.random() * 5000 + 100).toLocaleString(),
        views: Math.floor(Math.random() * 30000 + 500).toLocaleString()
    }), []);

    // SKELETON LOADING STATE
    if (loading && books.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 animate-pulse">
                    <div className="h-4 w-16 bg-gray-100 rounded-full" />
                    <div className="h-4 w-4 bg-gray-50 rounded-full" />
                    <div className="h-4 w-16 bg-gray-100 rounded-full" />
                </div>
                <main className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4 space-y-6 animate-pulse">
                            <div className="w-full aspect-[3/4] bg-gray-200 rounded-2xl shadow-sm" />
                            <div className="h-6 w-1/2 bg-gray-100 rounded mx-auto lg:mx-0" />
                        </div>
                        <div className="lg:col-span-8 space-y-8 animate-pulse">
                            <div className="h-10 bg-gray-200 rounded-xl w-3/4" />
                            <div className="h-32 bg-gray-50 rounded-xl w-full" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className="min-h-screen bg-white font-sans antialiased text-gray-800">
            {/* Breadcrumbs - Matching Reference */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-primary-600 font-bold overflow-x-auto whitespace-nowrap">
                <Link to="/" className="hover:text-primary-700 transition-colors">Home</Link>
                <ChevronRight size={14} className="text-gray-300" />
                <Link to="/" className="hover:text-primary-700">Stories</Link>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-gray-400 truncate font-medium">{book.title}</span>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                >

                    {/* Left: Book Cover & Quick Stats */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-6 w-full max-w-sm mx-auto lg:max-w-none">
                        <motion.div
                            layoutId={`book-cover-${book.id}`}
                            className="w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden group relative"
                        >
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <ImageWithLoader
                                    src={book.cover}
                                    thumbnail={book.thumbnail}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    priority={true}
                                />
                            </div>

                            {/* Floating Language/Level Tag */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                                <span className="bg-white/90 backdrop-blur-md text-primary-600 px-3 py-1 rounded-lg text-xs font-black shadow-lg">
                                    {book.language}
                                </span>
                                {book.level && (
                                    <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                                        Level {book.level}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        <div className="flex w-full justify-between px-4 text-gray-500 font-bold text-sm">
                            <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full"><Heart size={18} className="text-red-500 fill-red-500" /> {stats.likes}</span>
                            <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full"><BookIcon size={18} className="text-blue-500" /> {stats.views}</span>
                        </div>
                    </div>

                    {/* Right: Info Area */}
                    <div className="lg:col-span-8 flex flex-col gap-6 w-full">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-gray-900 mb-4 leading-tight text-center lg:text-left"
                            >
                                {book.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center lg:items-start gap-2 sm:gap-6 text-sm sm:text-base text-gray-600 justify-center lg:justify-start"
                            >
                                <p>By <span className="font-bold text-primary-600 cursor-pointer hover:underline">{book.author}</span></p>
                                <span className="hidden sm:inline text-gray-300">•</span>
                                <p>Publisher <span className="font-bold text-gray-900">{book.publisher || 'Pratham Books'}</span></p>
                            </motion.div>
                        </div>

                        {/* Action Buttons Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-95 text-lg flex items-center justify-center gap-2">
                                <BookOpen size={24} />
                                Read Story
                            </button>
                            <button className="w-full bg-white border-2 border-primary-100 hover:border-primary-500 text-primary-600 hover:text-primary-700 font-bold py-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-lg flex items-center justify-center gap-2">
                                <Plus size={24} />
                                Add to Shelf
                            </button>
                        </div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100"
                        >
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">Synopsis</h3>
                            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                                {book.summary}
                            </p>
                        </motion.div>

                        {/* Additional Actions */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                            <ActionItem icon={<Save />} label="Save Offline" />
                            <ActionItem icon={<Download />} label="Download PDF" />
                            <ActionItem icon={<Share2 />} label="Share" />
                            <ActionItem icon={<Languages />} label="Translate" />
                        </div>

                        {/* Tags */}
                        <div className="space-y-4 pt-4">
                            <h4 className="font-bold text-gray-400 text-sm uppercase tracking-wider text-center lg:text-left">Tags</h4>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                {['FAMILY', 'NATURE', 'ANIMALS', 'FRIENDSHIP', 'LEARNING', 'FUN'].map((tag, i) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + (i * 0.05) }}
                                        className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-bold tracking-wide hover:border-primary-500 hover:text-primary-600 transition-colors cursor-pointer shadow-sm"
                                    >
                                        #{tag}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

const ActionItem = ({ icon, label }: { icon: any, label: string }) => (
    <button className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
        <div className="text-gray-400 group-hover:text-primary-600 group-hover:scale-110 transition-all">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900">{label}</span>
    </button>
);

const SidebarLink = ({ icon, label, color }: { icon: any, label: string, color: string }) => (
    <button className="flex items-center gap-3 text-primary-600 hover:text-primary-700 transition-colors font-bold text-sm text-left">
        <span className={`${color} flex-shrink-0`}>{icon}</span>
        {label}
    </button>
);