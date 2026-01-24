import React from 'react';

import { Link } from 'react-router-dom';

import { Book } from '../types/opds';

import { truncateText, formatDate } from '../utils/formatters';
import { useCart } from '../context/CartContext';



interface BookCardProps {

  book: Book;

  score?: number;

}



export const BookCard: React.FC<BookCardProps> = ({ book, score }) => {
  const { toggleBook, isBookSelected } = useCart();
  const isSelected = isBookSelected(book.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBook(book);
  };

  return (
    <Link
      to={`/book/${book.id}`}
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full transform hover:scale-[1.03] hover:-translate-y-2 animate-fadeIn border-2 cursor-pointer ${isSelected ? 'border-primary-500 shadow-xl' : 'border-gray-100'
        }`}
    >
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="text-white text-xs font-black uppercase tracking-widest bg-primary-500/80 backdrop-blur-sm px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                View Details
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-secondary-200 animate-pulse-slow">
            <span className="text-white text-center px-4 text-sm font-medium">No Cover Available</span>
          </div>
        )}

        {/* Selection Checkbox - Top Right */}
        <button
          onClick={handleToggle}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-md ${isSelected
              ? 'bg-primary-500 border-primary-500 scale-110'
              : 'bg-white/70 backdrop-blur-md border-white/50 hover:bg-white hover:scale-110'
            }`}
          aria-label={isSelected ? 'Deselect book' : 'Select book'}
        >
          {isSelected ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>

        {book.level && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-primary-600 shadow-sm border border-primary-100/50 animate-scaleIn">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
            </svg>
            {book.level}
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

        </div>



        {/* Summary */}

        <p className="text-[11px] sm:text-xs text-gray-700 line-clamp-2 flex-1 mb-3 sm:mb-4 leading-relaxed">

          {truncateText(book.summary, 100)}

        </p>



        {/* Action Indicator */}

        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between text-primary-600">

          <span className="text-[10px] font-bold uppercase tracking-widest">Learn More</span>

          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">

            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />

          </svg>

        </div>

      </div>

    </Link>

  );

};