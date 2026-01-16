
import React, { useEffect, useState } from 'react';

export const LoadingSpinner: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center z-10 px-6">
        {/* Main Logo/Icon */}
        <div className="mb-12 relative">
          {/* Spinning Book Icon */}
          <div className="relative w-40 h-40 mx-auto">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-8 border-white/20 rounded-full"></div>

            {/* Spinning Gradient Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={`${progress * 2.64} 264`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Book Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-20 h-20 text-white animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 16.93c-3.95-.98-7-5.12-7-9.84V6.3l6-2.25v14.88zm2-14.88l6 2.25v5.79c0 4.72-3.05 8.86-7 9.84V4.05z" />
                <path d="M13 8h3v2h-3V8zm0 3h3v2h-3v-2zm0 3h3v2h-3v-2zM8 8h3v2H8V8zm0 3h3v2H8v-2zm0 3h3v2H8v-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Large Readable Text */}
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white mb-4 leading-tight drop-shadow-2xl animate-slideUp">
            StoryWeaver
          </h1>
          <p className="text-2xl sm:text-3xl text-white/95 font-semibold drop-shadow-lg animate-fadeIn">
            Loading Your Stories...
          </p>
        </div>

        {/* Progress Percentage */}
        <div className="mb-8 animate-scaleIn">
          <div className="text-6xl font-display font-black text-white drop-shadow-2xl mb-2">
            {progress}%
          </div>
          <div className="text-lg text-white/90 font-medium">
            Preparing your book collection
          </div>
        </div>

        {/* Modern Progress Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm shadow-2xl">
            <div
              className="h-full bg-gradient-to-r from-white via-yellow-300 to-white rounded-full shadow-lg transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="relative h-16">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-[float_3s_ease-in-out_infinite]"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>

        {/* Loading Tips */}
        <div className="mt-8 text-white/80 text-sm font-medium animate-fadeIn">
          <p className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Thousands of stories in multiple languages
          </p>
        </div>
      </div>
    </div>
  );
};