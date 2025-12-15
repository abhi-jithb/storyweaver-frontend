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
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        inputMode="search"
        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Search books"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg font-bold"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};