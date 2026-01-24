import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import logoImg from '../assets/logo/storyweaver-logo.png';

interface HeaderProps {
    bookCount?: number;
    onSearch?: (query: string) => void;
    showSearch?: boolean;
    showMobileFilter?: boolean;
    onToggleFilter?: () => void;
    isFilterOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    bookCount,
    onSearch,
    showSearch = true,
    showMobileFilter = false,
    onToggleFilter,
    isFilterOpen
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <header className="glass-white shadow-lg border-b border-white/20">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-5 sm:py-7">
                {/* Title Row */}
                <div className="flex items-start justify-between mb-5 sm:mb-7 gap-3">
                    <div className="flex-1 min-w-0 flex items-center gap-4">
                        {location.pathname !== '/' && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 -ml-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200"
                                aria-label="Go back"
                            >
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                        )}

                        <div className="min-w-0">
                            <img
                                src={logoImg}
                                alt="StoryWeaver"
                                className="h-12 sm:h-16 md:h-20 w-auto mb-2 object-contain"
                            />
                            <p className="text-gray-700 text-base sm:text-lg mt-2 font-medium leading-relaxed">
                                {bookCount !== undefined
                                    ? `Discover ${bookCount.toLocaleString()} stories in multiple languages`
                                    : 'Reading is for everyone'}
                            </p>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle - Only show if requested */}
                    {showMobileFilter && onToggleFilter && (
                        <button
                            onClick={onToggleFilter}
                            className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all duration-200 mt-2"
                            aria-label={isFilterOpen ? 'Hide filters' : 'Show filters'}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                {showSearch && onSearch && <SearchBar onSearch={onSearch} />}
            </div>
        </header>
    );
};
