
import React, { useEffect, useState } from 'react';

export const LoadingSpinner: React.FC = () => {
  const [bookIndex, setBookIndex] = useState(0);

  const bookEmojis = ['📕', '📗', '📘', '📙', '📚', '📖'];
  const messages = [
    '📚 Loading amazing stories...',
    '✨ Finding adventures for you...',
    '🌟 Discovering wonderful books...',
    '📖 Getting ready with great reads...',
    '🎯 Preparing your book collection...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBookIndex((prev) => (prev + 1) % bookEmojis.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100 animate-fadeIn">
      <div className="text-center">
        {/* Animated Books Container */}
        <div className="mb-8">
          <div className="flex justify-center gap-3 mb-6 h-20">
            {bookEmojis.map((emoji, idx) => (
              <div
                key={idx}
                className={`text-4xl transition-all duration-300 transform ${idx === bookIndex
                    ? 'scale-150 translate-y-0'
                    : 'scale-100 translate-y-2'
                  }`}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Animated Loading Bar */}
        <div className="w-64 h-3 bg-white rounded-full overflow-hidden mb-8 shadow-md">
          <div className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full animate-pulse"></div>
        </div>

        {/* Messages */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-2xl font-display font-bold gradient-text animate-fadeIn">
            {messages[messageIndex]}
          </p>
        </div>

        {/* Fun facts */}
        <div className="mt-8 max-w-md">
          <p className="text-sm text-gray-700">
            💡 <span className="font-semibold">Did you know?</span> There are thousands of amazing stories waiting for you!
          </p>
        </div>

        {/* Animated dots */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};