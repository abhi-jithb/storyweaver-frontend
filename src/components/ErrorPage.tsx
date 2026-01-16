import React from 'react';
import { motion } from 'framer-motion';
import { Home, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import assets from the correct relative path
import nebulaBg from '../assets/404/nebula-bg.png';
import magicalBook from '../assets/404/magical-book.png';
import cosmicFox from '../assets/404/cosmic-fox.png';

interface Props {
    errorCode?: string;
    title?: string;
    description?: string;
    buttonText?: string;
}

const ErrorPage: React.FC<Props> = ({
    errorCode = "404",
    title = "Lost in the Weaver's threads?",
    description = "The page you're looking for hasn't been written yet...",
    buttonText = "Return to Home"
}) => {
    return (
        <div className="relative min-h-screen w-full bg-[#050510] text-white overflow-hidden font-display flex flex-col items-center justify-center">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-60 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${nebulaBg})` }}
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050510]/50 via-transparent to-[#050510]" />

            {/* Animated Glowing Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.2, 0.1],
                    x: [0, -40, 0],
                    y: [0, 60, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-500/10 blur-[150px] rounded-full pointer-events-none"
            />

            {/* Stars/Dust Overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">

                {/* Left Side: Floating Book */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hidden lg:block relative w-1/4"
                >
                    <motion.div
                        animate={{
                            y: [-15, 15, -15],
                            rotate: [-2, 2, -2]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20"
                    >
                        <img
                            src={magicalBook}
                            alt="Magic Book"
                            className="w-full h-auto drop-shadow-[0_0_50px_rgba(217,70,239,0.4)]"
                        />
                        {/* Particle Effects */}
                        <motion.div
                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-4 -left-4"
                        >
                            <Sparkles size={24} className="text-primary-300" />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Center: 404 Text */}
                <div className="flex flex-col items-center text-center space-y-8 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 100 }}
                        className="relative"
                    >
                        <h1 className="text-[10rem] md:text-[14rem] font-display font-black leading-none tracking-tighter bg-gradient-to-b from-white via-white to-primary-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(217,70,239,0.3)]">
                            {errorCode}
                        </h1>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
                            {title}
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto font-medium font-sans">
                            {description}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link
                            to="/"
                            className="group relative inline-flex items-center gap-3 px-10 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-lg shadow-xl hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                            <Home size={22} />
                            <span>{buttonText}</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </motion.div>
                </div>

                {/* Right Side: Mystical Creature */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hidden lg:block relative w-1/4"
                >
                    <motion.div
                        animate={{
                            y: [15, -15, 15],
                            x: [-10, 10, -10]
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20"
                    >
                        <img
                            src={cosmicFox}
                            alt="Mystical Creature"
                            className="w-full h-auto drop-shadow-[0_0_50px_rgba(6,182,212,0.4)]"
                        />
                    </motion.div>
                    {/* Floating Steps */}
                    <div className="absolute -bottom-16 left-0 flex flex-col gap-3 opacity-30">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                                className="w-12 h-2 bg-gradient-to-r from-accent-400 to-transparent rounded-full ml-auto"
                                style={{ marginRight: `${i * 20}px` }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Footer Nav - Site Links */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 w-full flex justify-center gap-8 text-sm font-medium text-gray-400 z-10"
            >
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <Link to="/search" className="hover:text-white transition-colors">Search</Link>
                <a href="https://storyweaver.org.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">StoryWeaver</a>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
