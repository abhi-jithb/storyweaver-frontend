import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { LoadingSpinner } from './LoadingSpinner';
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
    Eye,
    Heart,
    ExternalLink,
    ShieldCheck
} from 'lucide-react';

export const BookDetails: React.FC = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const { books, loading } = useBooks();

    const book = useMemo(() => {
        return books.find((b) => b.id === bookId);
    }, [books, bookId]);

    if (loading && books.length === 0) {
        return <LoadingSpinner />;
    }

    if (!book) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Book not found</h2>
                <Link to="/" className="text-primary-600 hover:underline flex items-center gap-2">
                    <Home size={18} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500 font-medium overflow-x-auto whitespace-nowrap">
                <Link to="/" className="hover:text-primary-600 flex items-center gap-1">
                    <Home size={16} /> Home
                </Link>
                <ChevronRight size={14} />
                <Link to="/" className="hover:text-primary-600">Stories</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 truncate">{book.title}</span>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Cover & Quick Stats */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-6">
                        <div className="relative group w-full max-w-[320px] lg:max-w-none">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Level Overlay Badge */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                    <div className="bg-primary-500/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-black tracking-widest uppercase inline-block shadow-lg mb-2">
                                        {book.language} - {book.level || 'Level 1'}
                                    </div>
                                    <h3 className="text-lg font-bold leading-tight line-clamp-2">{book.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <ShieldCheck size={14} className="text-green-400" />
                                        <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">Verified</span>
                                    </div>
                                </div>
                            </div>

                            {/* Engagement Stats Overlay (Simulated) */}
                            <div className="flex justify-center gap-8 mt-6 text-gray-500 font-bold text-sm">
                                <div className="flex items-center gap-2">
                                    <Heart size={20} className="text-red-500 fill-red-500" />
                                    <span>{(Math.random() * 5000 + 100).toFixed(0)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={20} className="text-blue-500" />
                                    <span>{(Math.random() * 30000 + 500).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Interaction Icons */}
                        <div className="flex items-center gap-4 w-full justify-center lg:justify-start">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-bold">
                                <Plus size={18} /> My Bookshelf
                            </button>
                            <button className="p-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                                <Share2 size={18} />
                            </button>
                            <button className="p-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Metadata & Actions */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                                {book.title}
                            </h1>

                            <div className="space-y-2 text-base sm:text-lg">
                                <p className="text-gray-600">
                                    Written by <span className="text-primary-600 font-bold hover:underline cursor-pointer">{book.author}</span>
                                </p>
                                <p className="text-gray-600">
                                    Illustrated by <span className="text-secondary-600 font-bold hover:underline cursor-pointer">{book.author}</span>
                                </p>
                                {book.publisher && (
                                    <p className="text-gray-600">
                                        Published By <span className="text-accent-600 font-bold hover:underline cursor-pointer">{book.publisher}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <button
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-8 rounded-xl text-xl shadow-xl shadow-primary-500/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    onClick={() => window.open(book.downloadLink, '_blank')}
                                >
                                    <BookOpen size={24} />
                                    Read Story
                                </button>
                                <button className="w-full bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-black py-4 px-8 rounded-xl text-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                    <Volume2 size={24} />
                                    Readalong
                                </button>

                                <div className="pt-6">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Summary</h4>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {book.summary}
                                    </p>
                                </div>
                            </div>

                            {/* Vertical Sidebar Actions */}
                            <div className="w-full sm:w-64 space-y-2 border-l border-gray-100 sm:pl-8">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all text-sm font-bold">
                                    <Save size={18} className="text-primary-500" />
                                    Save to Offline Library
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all text-sm font-bold">
                                    <Languages size={18} className="text-secondary-500" />
                                    Translate this Story
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all text-sm font-bold">
                                    <Languages size={18} className="text-accent-500" />
                                    Translate Offline
                                </button>
                                <a
                                    href={book.downloadLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all text-sm font-bold"
                                >
                                    <Download size={18} className="text-green-500" />
                                    Download
                                </a>
                            </div>
                        </div>

                        {/* Versions & Tags */}
                        <div className="pt-12 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-primary-300 transition-all">
                                    <div>
                                        <h4 className="text-lg font-black text-gray-900 line-clamp-1">55 versions available in 49 languages</h4>
                                        <p className="text-sm text-gray-500 mt-1 font-medium">Explore alternative translations</p>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-secondary-300 transition-all">
                                    <div>
                                        <h4 className="text-lg font-black text-gray-900 line-clamp-1">This story is a part of 1 Reading List</h4>
                                        <p className="text-sm text-gray-500 mt-1 font-medium">Discover related collections</p>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-secondary-500 transition-colors" />
                                </div>
                            </div>

                            {/* Similar Themes */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-gray-900 text-center lg:text-left">Explore similar themes</h3>
                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    {book.tags.length > 0 ? book.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
                                        >
                                            {tag}
                                        </span>
                                    )) : (
                                        ['TASTE', 'CURIOUS', 'ASK', 'QUESTIONS', 'OBSERVATION', 'LEARN', 'CHILDHOOD'].map(tag => (
                                            <span
                                                key={tag}
                                                className="px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
                                            >
                                                {tag}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Footer Branding */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-12 border-t border-gray-100">
                                <div className="text-center md:text-left">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Published By</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center p-2">
                                            {/* Placeholder for Pratham Logo */}
                                            <BookOpen size={32} className="text-primary-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-900">{book.publisher || 'Pratham Books'}</h4>
                                            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                                www.prathambooks.org <ExternalLink size={12} />
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="max-w-md text-center md:text-right">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Supported By</h4>
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                                        "{book.title}" has been published on StoryWeaver by Pratham Books. The development of this book was supported by various contributors and partners.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
