import React from 'react';
import { Book, FilterState } from '../types/opds';
import { filterEngine } from '../services/filterEngine';
import { DATE_FILTER_OPTIONS } from '../utils/constants';

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
}) => {
  const options = filterEngine.getFilterOptions(books);

  const FilterCheckbox = ({ 
    label, 
    checked, 
    onChange 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: () => void 
  }) => (
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded"
      />
      <span className="ml-2 text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <aside className="w-full lg:w-64 bg-white p-4 border-r border-gray-200 h-auto lg:h-screen lg:overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900"> Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
          >
            Reset
          </button>
        )}
      </div>

      {/* Language Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">Language</h3>
        <div className="space-y-2">
          {options.languages.slice(0, 8).map((lang) => (
            <FilterCheckbox
              key={lang}
              label={lang}
              checked={filters.languages.has(lang)}
              onChange={() => onLanguageChange(lang)}
            />
          ))}
        </div>
        {options.languages.length > 8 && (
          <p className="text-xs text-gray-500 mt-2">+{options.languages.length - 8} more</p>
        )}
      </div>

      {/* Level Filter */}
      {options.levels.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">Reading Level</h3>
          <div className="space-y-2">
            {options.levels.map((level) => (
              <FilterCheckbox
                key={level}
                label={level}
                checked={filters.levels.has(level)}
                onChange={() => onLevelChange(level)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      {options.categories.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">Categories</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {options.categories.slice(0, 10).map((cat) => (
              <FilterCheckbox
                key={cat}
                label={cat}
                checked={filters.categories.has(cat)}
                onChange={() => onCategoryChange(cat)}
              />
            ))}
          </div>
          {options.categories.length > 10 && (
            <p className="text-xs text-gray-500 mt-2">+{options.categories.length - 10} more</p>
          )}
        </div>
      )}

      {/* Publisher Filter */}
      {options.publishers.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">Publishers</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {options.publishers.slice(0, 8).map((pub) => (
              <FilterCheckbox
                key={pub}
                label={pub}
                checked={filters.publishers.has(pub)}
                onChange={() => onPublisherChange(pub)}
              />
            ))}
          </div>
          {options.publishers.length > 8 && (
            <p className="text-xs text-gray-500 mt-2">+{options.publishers.length - 8} more</p>
          )}
        </div>
      )}

      {/* Date Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">Publication Date</h3>
        <select
          value={filters.dateFilter}
          onChange={(e) => onDateChange(e.target.value as FilterState['dateFilter'])}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {DATE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};