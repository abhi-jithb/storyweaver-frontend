
import React, { useMemo, useState, useDeferredValue } from 'react';
import { Book, FilterState } from '../types/opds';
import { filterEngine } from '../services/filterEngine';
import { DATE_FILTER_OPTIONS } from '../utils/constants';
import { STORYWEAVER_LANGUAGES_LIST, getLanguageNativeName } from '../utils/storyWeaverLanguages';
import { STORYWEAVER_LEVELS } from '../utils/storyWeaverCategories';

interface FilterSidebarProps {
  books: Book[];
  filters: FilterState;
  onLanguageChange: (language: string) => void;
  onLevelChange: (level: string) => void;
  onCategoryChange: (category: string) => void;
  onPublisherChange: (publisher: string) => void;
  onDateChange: (date: FilterState['dateFilter']) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  onClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  books,
  filters,
  onLanguageChange,
  onLevelChange,
  onCategoryChange,
  onPublisherChange,
  onDateChange,
  onReset,
  hasActiveFilters,
  onClose,
}) => {
  const options = filterEngine.getFilterOptions(books);
  const [expandedSections, setExpandedSections] = useState({
    languages: true,
    levels: true,
    categories: true,
    publishers: false,
  });
  const [languageSearch, setLanguageSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const deferredLanguageSearch = useDeferredValue(languageSearch);
  const deferredCategorySearch = useDeferredValue(categorySearch);

  const filteredLanguages = useMemo(() => {
    const search = deferredLanguageSearch.toLowerCase();
    // Show all StoryWeaver languages, just filtered by the search text
    return STORYWEAVER_LANGUAGES_LIST.filter((lang) =>
      lang.toLowerCase().includes(search)
    );
  }, [deferredLanguageSearch]);

  const filteredCategories = useMemo(() => {
    const search = deferredCategorySearch.toLowerCase();
    return options.categories.filter((cat) => cat.toLowerCase().includes(search));
  }, [deferredCategorySearch, options.categories]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterCheckbox = ({
    label,
    checked,
    onChange,
    isCategory = false,
  }: {
    label: string;
    checked: boolean;
    onChange: () => void;
    isCategory?: boolean;
  }) => (
    <label className="flex items-center cursor-pointer group py-2 px-2 sm:py-1 rounded-md hover:bg-gray-50 transition-colors min-h-[44px] sm:min-h-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 sm:w-4 sm:h-4 text-blue-600 rounded cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex-shrink-0"
      />
      <span
        className={`ml-2.5 sm:ml-2.5 text-sm group-hover:text-blue-600 transition-colors ${
          checked ? 'text-blue-700 font-medium' : 'text-gray-700'
        }`}
      >
        {label}
      </span>
    </label>
  );

  const FilterSection = ({
    title,
    icon,
    children,
    sectionKey,
  }: {
    title: string;
    icon: string;
    children: React.ReactNode;
    sectionKey: keyof typeof expandedSections;
  }) => (
    <div className="mb-4 last:mb-0 flex flex-col">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full hover:text-blue-600 transition-colors mb-2 py-2 sm:py-1.5 flex-shrink-0 min-h-[44px] sm:min-h-0"
      >
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
          <span className="text-base sm:text-lg">{icon}</span>
          {title}
        </h3>
        <span
          className={`text-gray-500 text-sm sm:text-xs transition-transform duration-200 flex-shrink-0 ${
            expandedSections[sectionKey] ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
      {expandedSections[sectionKey] && <div className="space-y-1">{children}</div>}
    </div>
  );

  return (
    <aside className="w-full bg-white border-r border-gray-200 shadow-sm h-full lg:h-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-3 sm:px-4 pt-4 pb-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-lg sm:text-xl">🔍</span>
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs bg-red-100 text-red-700 px-2 sm:px-3 py-1.5 rounded-md hover:bg-red-200 transition-colors font-medium min-h-[36px]"
            >
              Reset
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700 p-2 min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Close filters"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-3 sm:px-4 py-4">

        {/* Language Filter - Takes significant space */}
        <FilterSection title="Language" icon="🌐" sectionKey="languages">
          <input
            type="text"
            value={languageSearch}
            onChange={(e) => setLanguageSearch(e.target.value)}
            placeholder="Search language..."
            className="w-full mb-2 px-3 py-2.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex-shrink-0 min-h-[44px] sm:min-h-0"
          />
          <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
          {filteredLanguages.map((lang) => {
            const nativeName = getLanguageNativeName(lang);
            const displayName = nativeName !== lang ? `${lang} (${nativeName})` : lang;

            return (
              <FilterCheckbox
                key={lang}
                label={displayName}
                checked={filters.languages.has(lang)}
                onChange={() => onLanguageChange(lang)}
              />
            );
          })}
          </div>
        </FilterSection>

        {/* Level Filter - UPDATED WITH OFFICIAL STORYWEAVER LEVELS */}
        {options.levels.length > 0 && (
          <FilterSection title="Reading Level" icon="📚" sectionKey="levels">
            <div className="space-y-1 flex-shrink-0">
            {STORYWEAVER_LEVELS.map((level) => {
              // Check if this level is in our books
              const hasBooks = options.levels.some(
                (bookLevel) => bookLevel.toLowerCase() === level.toLowerCase()
              );

              if (!hasBooks) return null; // Don't show levels we don't have

              return (
                <FilterCheckbox
                  key={level}
                  label={level}
                  checked={filters.levels.has(level)}
                  onChange={() => onLevelChange(level)}
                />
              );
            })}
            </div>
            {options.levels.length === 0 && (
              <p className="text-xs text-gray-500 italic">
                No reading levels available
              </p>
            )}
          </FilterSection>
        )}

        {/* Category Filter - Takes remaining space */}
        {options.categories.length > 0 && (
          <FilterSection title="Categories" icon="📂" sectionKey="categories">
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search category..."
              className="w-full mb-2 px-3 py-2.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex-shrink-0 min-h-[44px] sm:min-h-0"
            />
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
            {filteredCategories.map((cat) => (
              <FilterCheckbox
                key={cat}
                label={cat}
                checked={filters.categories.has(cat)}
                onChange={() => onCategoryChange(cat)}
                isCategory={true}
              />
            ))}
            </div>
          </FilterSection>
        )}

        {/* Publisher Filter */}
        {options.publishers.length > 0 && (
          <FilterSection title="Publishers" icon="🏢" sectionKey="publishers">
            <div className="space-y-1 flex-shrink-0 max-h-32 overflow-y-auto custom-scrollbar">
            {options.publishers.slice(0, 10).map((pub) => (
              <FilterCheckbox
                key={pub}
                label={pub}
                checked={filters.publishers.has(pub)}
                onChange={() => onPublisherChange(pub)}
              />
            ))}
            </div>
            {options.publishers.length > 10 && (
              <p className="text-xs text-gray-500 mt-2">
                +{options.publishers.length - 10} more
              </p>
            )}
          </FilterSection>
        )}

        {/* Date Filter */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base flex items-center gap-2">
            <span className="text-lg">📅</span>
            Publication Date
          </h3>
          <select
            value={filters.dateFilter}
            onChange={(e) => {
              const value = e.target.value as FilterState['dateFilter'];
              console.log('Date filter changed to:', value); // Debug log
              onDateChange(value);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 sm:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:border-blue-300 transition-colors min-h-[44px] sm:min-h-0"
          >
            {DATE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1.5 italic">
            {filters.dateFilter === 'all' && 'Showing all books'}
            {filters.dateFilter === 'newest' && 'Newest books first'}
            {filters.dateFilter === 'oldest' && 'Oldest books first'}
            {filters.dateFilter === 'last30days' && 'Books from last 30 days'}
            {filters.dateFilter === 'lastyear' && 'Books from last year'}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          <p className="font-semibold mb-1 flex items-center gap-1">
            <span>💡</span>
            <span>Tip:</span>
          </p>
          <p>Click multiple filters to narrow down your search!</p>
        </div>
      </div>
    </aside>
  );
};