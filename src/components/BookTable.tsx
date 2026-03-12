import React from 'react';
import { Book } from '../types/opds';
import { truncateText } from '../utils/formatters';

interface BookTableProps {
  books: Book[];
  isBookSelected: (id: string) => boolean;
  onToggle: (book: Book) => void;
}

export const BookTable: React.FC<BookTableProps> = ({ books, isBookSelected, onToggle }) => {

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
          <tr>
            <th className="p-4 w-12 text-center">
              {/* Optional master checkbox can go here if needed, but we handle that globally */}
              Select
            </th>
            <th className="p-4">Title</th>
            <th className="p-4">Author</th>
            <th className="p-4">Language</th>
            <th className="p-4">Level</th>
            <th className="p-4">Categories</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {books.map(book => {
            const isSelected = isBookSelected(book.id);
            return (
              <tr 
                key={book.id} 
                className={`hover:bg-primary-50/50 transition-colors cursor-pointer outline-none focus:bg-primary-50/70 ${isSelected ? 'bg-primary-50' : ''}`}
                onClick={() => onToggle(book)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle(book);
                  }
                }}
              >
                <td className="p-4 text-center">
                  <div className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300 text-transparent'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </td>
                <td className="p-4 font-semibold text-gray-900 border-l border-transparent">
                  <div className="flex items-center gap-3">
                    {book.thumbnail && (
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100 hidden sm:block">
                        <img src={book.thumbnail || book.cover} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="line-clamp-2">{truncateText(book.title, 50)}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{truncateText(book.author, 30)}</td>
                <td className="p-4 text-sm text-gray-600">
                  {book.language && (
                    <span className="inline-block px-2 py-1 bg-accent-50 text-accent-700 rounded-md text-xs font-semibold">
                      {book.language}
                    </span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {book.level && (
                    <span className="inline-block px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-semibold">
                      {book.level}
                    </span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  <span className="line-clamp-1">{book.categories?.join(', ') || '-'}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
