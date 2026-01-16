import { motion } from 'framer-motion';

interface HeroProps {
    bookCount?: number;
    languageCount?: number;
}

export const Hero: React.FC<HeroProps> = ({ bookCount = 0, languageCount = 0 }) => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 animate-fadeIn text-white">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
                <div className="text-center animate-slideUp max-w-4xl">
                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-display font-black text-white mb-8 leading-tight drop-shadow-2xl">
                        Discover Stories
                        <br />
                        <span className="inline-block mt-2 text-white drop-shadow-2xl">
                            That Inspire Wonder
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl lg:text-2xl text-white/95 mb-12 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                        Explore thousands of captivating children's books in multiple languages,
                        all free and accessible for young readers everywhere
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-16 px-4">
                        {bookCount > 0 && (
                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-6 sm:px-10 py-5 sm:py-6 shadow-2xl transform hover:scale-110 transition-transform duration-300 border border-white/50 min-w-[140px] sm:min-w-[180px]">
                                <div className="text-3xl sm:text-5xl font-display font-black text-black mb-1">
                                    {bookCount.toLocaleString()}+
                                </div>
                                <div className="text-sm sm:text-base text-gray-700 font-bold tracking-wide">Stories</div>
                            </div>
                        )}

                        {languageCount > 0 && (
                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-6 sm:px-10 py-5 sm:py-6 shadow-2xl transform hover:scale-110 transition-transform duration-300 border border-white/50 min-w-[140px] sm:min-w-[180px]">
                                <div className="text-3xl sm:text-5xl font-display font-black text-black mb-1">
                                    {languageCount}+
                                </div>
                                <div className="text-sm sm:text-base text-gray-700 font-bold tracking-wide">Languages</div>
                            </div>
                        )}

                        <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-6 sm:px-10 py-5 sm:py-6 shadow-2xl transform hover:scale-110 transition-transform duration-300 border border-white/50 min-w-[140px] sm:min-w-[180px]">
                            <div className="text-3xl sm:text-5xl font-display font-black text-black mb-1">
                                100%
                            </div>
                            <div className="text-sm sm:text-base text-gray-700 font-bold tracking-wide">Free</div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="opacity-80"
                    >
                        <p className="text-white text-sm font-bold mb-3 tracking-widest uppercase">Scroll to Explore</p>
                        <svg
                            className="w-8 h-8 text-white mx-auto drop-shadow-xl"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7" />
                        </svg>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
