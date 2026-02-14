import React, { useEffect, useState } from 'react';
import logoImg from '../assets/logo/storyweaver-logo.png';

export const LoadingSpinner: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const totalDuration = 9000; // 9 seconds
    const increment = 100 / (totalDuration / 50);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          return 100;
        }
        return prev + increment;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/25 rounded-lg shadow-lg animate-book-fly"
              style={{
                width: `${40 + i * 3}px`,
                height: `${50 + i * 4}px`,
                left: `${i * 8}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${6 + i * 0.3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-20 w-full max-w-2xl mx-auto text-center">
          <img
            src={logoImg}
            alt="StoryWeaver"
            className="h-24 sm:h-32 w-auto mx-auto mb-12 drop-shadow-2xl animate-pulse"
          />
          <div className="relative mx-auto w-96 h-96 mb-16">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 384 384">
              <circle
                cx="192"
                cy="192"
                r="165"
                fill="none"
                stroke="url(#bookRing)"
                strokeWidth="16"
                strokeDasharray={`${progress * 5.2} 520`}
                strokeLinecap="round"
                className="transition-all duration-1000 origin-center"
              />
              <defs>
                <linearGradient id="bookRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative w-72 h-80 mx-auto mt-8 animate-book-stack">
              <div
                className="absolute bottom-0 left-8 w-56 h-32 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-2xl border-4 border-white/50 rotate-[-2deg] animate-book-bounce"
                style={{ animationDelay: '0s' }}
              >
                <div className="absolute inset-0 bg-white/70 rounded-2xl shadow-inner" style={{ clipPath: 'inset(0 20% 0 0)' }} />
              </div>

              <div
                className="absolute bottom-12 left-12 w-52 h-28 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl border-4 border-white/50 rotate-[1deg] animate-book-bounce"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="absolute inset-0 bg-white/80 rounded-2xl shadow-inner" style={{ clipPath: 'inset(0 30% 0 0)' }} />
              </div>

              <div
                className={`absolute bottom-24 left-20 w-48 h-24 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-2xl border-4 border-white/60 rotate-[0.5deg] transition-all duration-1000 animate-book-bounce ${progress > 30 ? 'animate-book-open' : ''}`}
                style={{ animationDelay: '0.6s' }}
              >
                <div className="absolute left-0 inset-y-0 w-1/3 bg-white/90 rounded-l-2xl shadow-inner" />
                <div className="absolute right-0 inset-y-0 w-2/3 bg-gradient-to-r from-yellow-200/80 to-orange-100/60 rounded-r-2xl shadow-inner flex items-center justify-center p-2">
                  <span className="text-2xl animate-pulse">📚</span>
                </div>
              </div>

              {progress > 70 && (
                <>
                  <div className="absolute top-10 left-1/4 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-sparkle" style={{ animationDelay: '0s' }} />
                  <div className="absolute top-16 right-1/4 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-sparkle" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute bottom-20 left-1/2 w-5 h-5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-sparkle" style={{ animationDelay: '0.4s' }} />
                </>
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-7xl font-black text-white drop-shadow-2xl bg-white/20 backdrop-blur-xl px-8 py-4 rounded-3xl shadow-2xl border-4 border-white/60">
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto p-6">
            <div className="h-4 bg-white/40 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl border-2 border-white/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 rounded-3xl shadow-glow transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-fast" />
              </div>
            </div>
          </div>

          {isComplete && (
            <div className="mt-12">
              <div className="text-4xl font-black text-white drop-shadow-2xl animate-bounce">
                Ready for Storytime! ✨
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes book-fly {
          0% { 
            transform: translateY(100vh) rotate(0deg) scale(0.5); 
            opacity: 0; 
          }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { 
            transform: translateY(-20vh) translateX(60vw) rotate(720deg) scale(1.2); 
            opacity: 0; 
          }
        }
        @keyframes book-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes book-open {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        @keyframes sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { opacity: 1; transform: scale(1); }
          100% { transform: scale(1.5) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmer-fast {
          0% { transform: translateX(-100%) skewX(-25deg); }
          100% { transform: translateX(120%) skewX(-25deg); }
        }
        @keyframes book-stack {
          0% { transform: scale(0.95) rotate(-1deg); }
          50% { transform: scale(1.02) rotate(1deg); }
          100% { transform: scale(0.95) rotate(-1deg); }
        }
        .shadow-glow {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
        }
        .animate-book-fly { animation: book-fly 8s linear infinite; }
        .animate-book-bounce { animation: book-bounce 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; }
        .animate-book-open { animation: book-open 2s ease-out forwards; }
        .animate-sparkle { animation: sparkle 1.5s infinite; }
        .animate-shimmer-fast { animation: shimmer-fast 1.5s infinite; }
        .animate-book-stack { animation: book-stack 4s ease-in-out infinite; }
      `}</style>
    </>
  );
};
