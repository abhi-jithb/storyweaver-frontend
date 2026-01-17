import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search books by title, author, or category...',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    // Debounce search (wait 300ms after user stops typing)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      const trimmed = query.trim();
      // Skip heavy search until at least 2 characters to keep typing smooth
      if (trimmed.length < 2) {
        onSearch('');
        return;
      }
      onSearch(trimmed);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
          <svg
            className={`w-5 h-5 transition-all duration-300 ${isFocused ? 'text-primary-600' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          inputMode="search"
          className={`
            w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 
            bg-white
            rounded-xl sm:rounded-2xl
            text-sm sm:text-base font-medium text-gray-900
            transition-all duration-300
            placeholder:text-gray-400
            outline-none
            ${isFocused
              ? 'border-2 border-primary-500 shadow-xl ring-4 ring-primary-100'
              : 'border-2 border-gray-200 shadow-md hover:border-gray-300'
            }
          `}
          aria-label="Search books"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     text-gray-400 hover:text-primary-600 
                     transition-all duration-200 hover:scale-110
                     min-h-[44px] min-w-[44px] flex items-center justify-center
                     hover:rotate-90 z-10"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};