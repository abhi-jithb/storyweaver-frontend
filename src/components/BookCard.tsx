import React from 'react';
import { Book } from '../types/opds';
import { truncateText, formatDate } from '../utils/formatters';

interface BookCardProps {
  book: Book;
  score?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, score }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full transform hover:scale-[1.03] hover:-translate-y-2 animate-fadeIn border border-gray-100">
      {/* Book Cover */}
      <div className="relative bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 h-48 overflow-hidden">
        {book.cover ? (
          <>
            <img
              src={book.cover}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '';
              }}
            />
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-secondary-200 animate-pulse-slow">
            <span className="text-white text-center px-4 text-sm font-medium">No Cover Available</span>
          </div>
        )}
        {score && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-scaleIn">
            Match: {Math.round(score * 100)}%
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 font-display group-hover:text-primary-600 transition-colors duration-300">
          {truncateText(book.title, 60)}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
          by <span className="font-semibold text-secondary-600">{truncateText(book.author, 30)}</span>
        </p>

        {/* Metadata with Icons */}
        <div className="text-[10px] sm:text-xs text-gray-600 space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
          {book.language && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{book.language}</span>
            </div>
          )}
          {book.level && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{book.level}</span>
            </div>
          )}
          {book.publishedDate && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(book.publishedDate)}</span>
            </div>
          )}
        </div>

        {/* Summary */}
        <p className="text-[11px] sm:text-xs text-gray-700 line-clamp-2 flex-1 mb-3 sm:mb-4 leading-relaxed">
          {truncateText(book.summary, 100)}
        </p>

        {/* Tags */}
        {book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {book.tags.slice(0, 2).map((tag, index) => (
              <span
                key={tag}
                className={`
                  text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium
                  transition-all duration-300 hover:scale-105
                  ${index === 0
                    ? 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 hover:shadow-glow-sm'
                    : 'bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700 hover:shadow-cyan-glow'
                  }
                `}
              >
                {truncateText(tag, 15)}
              </span>
            ))}
          </div>
        )}

        {/* Download Button */}
        {book.downloadLink && (
          <a
            href={book.downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              relative w-full 
              bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 
              hover:from-primary-600 hover:via-secondary-600 hover:to-accent-600
              text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl 
              text-xs sm:text-sm transition-all duration-300 text-center
              shadow-md hover:shadow-xl
              transform hover:scale-[1.02]
              overflow-hidden
              group/btn
            "
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </span>
          </a>
        )}
      </div>
    </div>
  );
};