
import React, { useMemo, useState, useDeferredValue, memo } from 'react';
import { FilterState, FilterOptions } from '../types/opds';
import { DATE_FILTER_OPTIONS } from '../utils/constants';
import { getLanguageNativeName } from '../utils/storyWeaverLanguages';
import { STORYWEAVER_LEVELS } from '../utils/storyWeaverCategories';

// --- Shared Components Moved Outside (Prevents Re-mounting) ---

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const FilterCheckbox = memo(({
  label,
  checked,
  onChange,
}: FilterCheckboxProps) => (
  <label className="flex items-center cursor-pointer group py-2 px-3 sm:py-1.5 rounded-lg hover:bg-primary-50 transition-all duration-200 min-h-[44px] sm:min-h-0">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 sm:w-4 sm:h-4 text-primary-600 rounded cursor-pointer focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 flex-shrink-0 accent-primary-600"
    />
    <span
      className={`ml-2.5 sm:ml-2.5 text-sm group-hover:text-primary-700 transition-colors ${checked ? 'text-primary-700 font-semibold' : 'text-gray-700'
        }`}
    >
      {label}
    </span>
  </label>
));

FilterCheckbox.displayName = 'FilterCheckbox';

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterSection = memo(({
  title,
  icon,
  children,
  isOpen,
  onToggle,
}: FilterSectionProps) => (
  <div className="mb-4 last:mb-0 flex flex-col">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full hover:text-blue-600 transition-colors mb-2 py-2 sm:py-1.5 flex-shrink-0 min-h-[44px] sm:min-h-0"
    >
      <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <span
        className={`text-gray-500 text-sm sm:text-xs transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''
          }`}
      >
        ▼
      </span>
    </button>
    {isOpen && <div className="space-y-1">{children}</div>}
  </div>
));

FilterSection.displayName = 'FilterSection';


interface FilterSidebarProps {
  filterOptions: FilterOptions; // Task 2: Dynamic options prop
  filters: FilterState;
  onLanguageChange: (language: string) => void;
  onLevelChange: (level: string) => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (date: FilterState['dateFilter']) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  onClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterOptions: options, // Rename to options for easier usage
  filters,
  onLanguageChange,
  onLevelChange,
  onCategoryChange,
  onDateChange,
  onReset,
  hasActiveFilters,
  onClose,
}) => {
  // Removed internal filterEngine.getFilterOptions call - using passed prop

  const [expandedSections, setExpandedSections] = useState({
    languages: true,
    levels: true,
    categories: true,
  });
  const [languageSearch, setLanguageSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Use deferred values for heavy filtering operations
  const deferredLanguageSearch = useDeferredValue(languageSearch);
  const deferredCategorySearch = useDeferredValue(categorySearch);

  const filteredLanguages = useMemo(() => {
    const search = deferredLanguageSearch.toLowerCase();
    // Task 2: Use dynamic options.languages instead of static list
    return options.languages.filter((lang) =>
      lang.toLowerCase().includes(search)
    );
  }, [deferredLanguageSearch, options.languages]);

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

  return (
    <aside className="w-full bg-white border-r border-gray-200 shadow-sm h-full lg:h-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-4 sm:px-5 pt-5 pb-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50 sticky top-0 z-10">
        <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 font-display">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold min-h-[36px] shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Reset
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-primary-600 p-2 min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-white rounded-lg transition-all"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-3 sm:px-4 py-4">

        {/* Language Filter */}
        <FilterSection
          title="Language"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          isOpen={expandedSections.languages}
          onToggle={() => toggleSection('languages')}
        >
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

        {/* Level Filter */}
        {options.levels.length > 0 && (
          <FilterSection
            title="Reading Level"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            isOpen={expandedSections.levels}
            onToggle={() => toggleSection('levels')}
          >
            <div className="space-y-1 flex-shrink-0">
              {STORYWEAVER_LEVELS.map((level) => {
                const hasBooks = options.levels.some(
                  (bookLevel) => bookLevel.toLowerCase() === level.toLowerCase()
                );

                if (!hasBooks) return null;

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
          </FilterSection>
        )}

        {/* Category Filter */}
        {options.categories.length > 0 && (
          <FilterSection
            title="Categories"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}
            isOpen={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
          >
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
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Date Filter */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Publication Date
          </h3>
          <select
            value={filters.dateFilter}
            onChange={(e) => {
              const value = e.target.value as FilterState['dateFilter'];
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
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          <p className="font-semibold mb-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Tip:</span>
          </p>
          <p>Click multiple filters to narrow down your search!</p>
        </div>
      </div>
    </aside>
  );
};
