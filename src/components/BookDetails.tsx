import React, { useMemo, useEffect } from 'react';
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left: Reference-Style Book Card */}
                    <div className="lg:col-span-4 flex flex-col items-center lg:items-start gap-4">
                        <div className="w-full max-w-[320px] bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden group">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <ImageWithLoader
                                    src={book.cover}
                                    thumbnail={book.thumbnail}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority={true}
                                />
                            </div>
                            <div className="bg-primary-600 text-white px-3 py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                                <span>{book.language}</span>
                                {book.level && <span>• {book.level}</span>}
                            </div>
                            <div className="p-4 space-y-1">
                                <h3 className="font-bold text-gray-900 leading-tight">{book.title}</h3>
                                <p className="text-sm text-gray-500">{book.author}</p>
                                <div className="flex items-center gap-1.5 text-primary-600 text-[10px] font-black uppercase mt-2">
                                    <ShieldCheck size={14} className="text-green-500" /> Verified
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-8 mt-2 text-gray-400 font-bold text-sm">
                            <span className="flex items-center gap-2"><Heart size={18} className="text-red-500 fill-red-500" /> {stats.likes}</span>
                            <span className="flex items-center gap-2"><BookIcon size={18} /> {stats.views}</span>
                        </div>
                    </div>

                    {/* Right: Info Area with Correct Font Sizing */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{book.title}</h1>

                                <div className="space-y-1 text-sm md:text-base">
                                    <p className="text-gray-500">Written by <span className="text-primary-600 font-bold hover:underline cursor-pointer">{book.author}</span></p>
                                    <p className="text-gray-500">Illustrated by <span className="text-secondary-600 font-bold hover:underline cursor-pointer">{book.author}</span></p>
                                    <p className="text-gray-500">Published By <span className="text-indigo-600 font-bold cursor-pointer">{book.publisher || 'Pratham Books'}</span></p>
                                </div>

                                <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
                                    <button className="flex items-center gap-2 text-primary-600 text-sm font-bold hover:underline">
                                        <Plus size={18} /> My Bookshelf
                                    </button>
                                    <button className="flex items-center gap-2 text-primary-600 text-sm font-bold hover:underline">
                                        <Share2 size={18} /> Share
                                    </button>
                                    <button className="text-gray-300 hover:text-primary-600"><MoreHorizontal size={18} /></button>
                                </div>

                                {/* Summary: Proper Font Sizing */}
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                                        {book.summary}
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar Actions */}
                            <div className="space-y-4">
                                <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/25 transition-all active:scale-95 text-lg">
                                    Read Story
                                </button>
                                <div className="flex flex-col gap-4 pt-4">
                                    <SidebarLink icon={<Save size={20} />} label="Save to Offline Library" color="text-primary-500" />
                                    <SidebarLink icon={<Languages size={20} />} label="Translate this Story" color="text-secondary-500" />
                                    <SidebarLink icon={<Languages size={20} />} label="Translate Offline" color="text-indigo-500" />
                                    <SidebarLink icon={<Download size={20} />} label="Download" color="text-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* Versions Bar */}
                        <div className="w-full bg-gray-50 rounded-xl border border-gray-100 py-4 px-6 text-center font-bold text-gray-600 text-sm">
                            7 versions available in 7 languages
                        </div>

                        {/* Similar Themes */}
                        <div className="space-y-6 pt-4 text-center lg:text-left">
                            <h3 className="text-xl font-bold text-gray-900">Explore similar themes</h3>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                {['FAMILY', 'GIFT', 'SWEET', 'FOOD', 'SPICY', 'CANDY'].map(tag => (
                                    <span key={tag} className="px-5 py-2 bg-primary-50 text-primary-600 rounded-full text-[11px] font-black tracking-widest hover:bg-primary-100 transition-colors cursor-pointer border border-primary-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const SidebarLink = ({ icon, label, color }: { icon: any, label: string, color: string }) => (
    <button className="flex items-center gap-3 text-primary-600 hover:text-primary-700 transition-colors font-bold text-sm text-left">
        <span className={`${color} flex-shrink-0`}>{icon}</span>
        {label}
    </button>
);