import React from 'react';

interface HeroProps {
    bookCount?: number;
    languageCount?: number;
}

export const Hero: React.FC<HeroProps> = ({ bookCount = 0, languageCount = 0 }) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 animate-fadeIn">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                <div className="text-center animate-slideUp">
                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-white mb-6 leading-tight drop-shadow-lg">
                        Discover Stories
                        <br />
                        <span className="inline-block mt-2 text-white drop-shadow-lg">
                            That Inspire Wonder
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl lg:text-2xl text-white mb-10 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                        Explore thousands of captivating children's books in multiple languages,
                        all free and accessible for young readers everywhere
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10">
                        {bookCount > 0 && (
                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-8 py-5 shadow-xl transform hover:scale-105 transition-transform duration-300 border border-white/50">
                                <div className="text-4xl sm:text-5xl font-display font-black gradient-text mb-1">
                                    {bookCount.toLocaleString()}+
                                </div>
                                <div className="text-sm sm:text-base text-gray-700 font-semibold">Stories</div>
                            </div>
                        )}

                        {languageCount > 0 && (
                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-8 py-5 shadow-xl transform hover:scale-105 transition-transform duration-300 border border-white/50">
                                <div className="text-4xl sm:text-5xl font-display font-black gradient-text mb-1">
                                    {languageCount}+
                                </div>
                                <div className="text-sm sm:text-base text-gray-700 font-semibold">Languages</div>
                            </div>
                        )}

                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-8 py-5 shadow-xl transform hover:scale-105 transition-transform duration-300 border border-white/50">
                            <div className="text-4xl sm:text-5xl font-display font-black gradient-text mb-1">
                                100%
                            </div>
                            <div className="text-sm sm:text-base text-gray-700 font-semibold">Free</div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="animate-bounce">
                        <svg
                            className="w-6 h-6 text-white mx-auto drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
