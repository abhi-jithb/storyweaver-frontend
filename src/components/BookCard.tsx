import React from 'react';
import { Book } from '../types/opds';
import { truncateText, formatDate } from '../utils/formatters';

interface BookCardProps {
  book: Book;
  score?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, score }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Book Cover */}
      <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 h-48 overflow-hidden">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-center px-4 text-sm">No Cover Available</span>
          </div>
        )}
        {score && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Match: {Math.round(score * 100)}%
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
          {truncateText(book.title, 60)}
        </h3>

        <p className="text-xs text-gray-600 mb-2">
          by <span className="font-medium">{truncateText(book.author, 30)}</span>
        </p>

        {/* Metadata */}
        <div className="text-xs text-gray-500 space-y-0.5 mb-3">
          {book.language && <p>📍 {book.language}</p>}
          {book.level && <p>📚 {book.level}</p>}
          {book.publishedDate && <p>📅 {formatDate(book.publishedDate)}</p>}
          {book.rating && (
            <p>
              ⭐ {book.rating.toFixed(1)}/5
            </p>
          )}
        </div>

        {/* Summary */}
        <p className="text-xs text-gray-700 line-clamp-2 flex-1 mb-3">
          {truncateText(book.summary, 100)}
        </p>

        {/* Tags */}
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                {truncateText(tag, 15)}
              </span>
            ))}
            {book.tags.length > 2 && (
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">
                +{book.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Download Button */}
        {book.downloadLink && (
          <a
            href={book.downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded text-xs transition-colors duration-200 text-center"
          >
             Download
          </a>
        )}
      </div>
    </div>
  );
};