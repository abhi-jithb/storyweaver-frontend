import { motion } from 'framer-motion';
import logoImg from '../assets/logo/storyweaver-logo.png';

interface HeroProps {
    bookCount?: number;
    languageCount?: number;
}

export const Hero: React.FC<HeroProps> = ({ bookCount = 0, languageCount = 0 }) => {
    return (
        <div className="relative min-h-[60vh] lg:min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 animate-fadeIn text-white overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                <div className="absolute top-40 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-20 flex flex-col items-center justify-center">
                <div className="text-center animate-slideUp max-w-4xl">
                    {/* Logo */}
                    <motion.img
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        src={logoImg}
                        alt="StoryWeaver"
                        className="h-24 sm:h-32 lg:h-40 w-auto mx-auto mb-8 drop-shadow-2xl"
                    />

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-display font-black text-white mb-6 sm:mb-8 leading-tight drop-shadow-2xl">
                        Discover Stories
                        <br />
                        <span className="inline-block mt-1 sm:mt-2 text-white drop-shadow-2xl">
                            That Inspire Wonder
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-xl lg:text-2xl text-white/95 mb-10 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-lg px-2">
                        Explore thousands of captivating children's books in multiple languages,
                        all free and accessible for young readers everywhere
                    </p>

                    {/* Stats */}
                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, staggerChildren: 0.2 }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 w-full max-w-3xl"
                    >
                        {bookCount > 0 && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl px-4 sm:px-8 py-4 sm:py-6 shadow-xl border border-white/50 flex flex-col items-center justify-center text-center"
                            >
                                <div className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-gray-900 mb-1">
                                    {bookCount.toLocaleString()}+
                                </div>
                                <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-bold tracking-wide uppercase">Stories</div>
                            </motion.div>
                        )}

                        {languageCount > 0 && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl px-4 sm:px-8 py-4 sm:py-6 shadow-xl border border-white/50 flex flex-col items-center justify-center text-center"
                            >
                                <div className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-gray-900 mb-1">
                                    {languageCount}+
                                </div>
                                <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-bold tracking-wide uppercase">Languages</div>
                            </motion.div>
                        )}

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl px-4 sm:px-8 py-4 sm:py-6 shadow-xl border border-white/50 flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1"
                        >
                            <div className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-gray-900 mb-1">
                                100%
                            </div>
                            <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-bold tracking-wide uppercase">Free</div>
                        </motion.div>
                    </motion.div>

                    {/* Scroll Indicator - Hidden on very small screens to save space if needed, or just kept small */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="opacity-80"
                    >
                        <p className="text-white text-[10px] sm:text-sm font-bold mb-2 tracking-widest uppercase">Scroll to Explore</p>
                        <svg
                            className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto drop-shadow-xl"
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
