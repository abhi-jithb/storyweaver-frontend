import { useState, useCallback } from 'react';
import { FilterState } from '../types/opds';

const initialFilterState: FilterState = {
  languages: new Set(['English']),
  levels: new Set(),
  categories: new Set(),
  dateFilter: 'all',
  searchQuery: '',
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const updateLanguage = useCallback((language: string) => {
    setFilters((prev) => {
      const updated = new Set(prev.languages);
      updated.has(language) ? updated.delete(language) : updated.add(language);
      return { ...prev, languages: updated };
    });
  }, []);

  const updateLevel = useCallback((level: string) => {
    setFilters((prev) => {
      const updated = new Set(prev.levels);
      updated.has(level) ? updated.delete(level) : updated.add(level);
      return { ...prev, levels: updated };
    });
  }, []);

  const updateCategory = useCallback((category: string) => {
    setFilters((prev) => {
      const updated = new Set(prev.categories);
      updated.has(category) ? updated.delete(category) : updated.add(category);
      return { ...prev, categories: updated };
    });
  }, []);


  const updateDateFilter = useCallback(
    (dateFilter: 'all' | 'newest' | 'oldest' | 'last30days' | 'lastyear') => {
      setFilters((prev) => ({ ...prev, dateFilter }));
    },
    []
  );

  const updateSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const reset = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const hasActiveFilters =
    filters.languages.size > 0 ||
    filters.levels.size > 0 ||
    filters.categories.size > 0 ||
    filters.dateFilter !== 'all' ||
    filters.searchQuery.trim().length > 0;

  return {
    filters,
    updateLanguage,
    updateLevel,
    updateCategory,
    updateDateFilter,
    updateSearchQuery,
    reset,
    hasActiveFilters,
  };
}
