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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2
        }
    }
};

const digitVariants = {
    hidden: {
        scale: 0.5,
        opacity: 0,
        filter: "blur(12px)",
        y: 20
    },
    visible: {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
            type: "spring" as const,
            damping: 15,
            stiffness: 100
        }
    },
    hover: {
        scale: 1.1,
        filter: "drop-shadow(0 0 25px rgba(217,70,239,0.8))",
        transition: { duration: 0.3 }
    }
};

const ErrorPage: React.FC<Props> = ({
    errorCode = "404",
    title = "Lost in the Weaver's threads?",
    description = "The page you're looking for hasn't been written yet...",
    buttonText = "Return to Home"
}) => {
    return (
        <div className="relative min-h-screen w-full bg-[#02020a] text-white overflow-hidden font-display flex flex-col items-center justify-center">
            {/* Background Image with Deep Overlay */}
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 0.5 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url(${nebulaBg})` }}
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#02020a] via-transparent to-[#02020a] opacity-80" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#02020a] via-transparent to-[#02020a] opacity-40" />

            {/* Pulsing Light Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.4, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary-600/10 blur-[150px] rounded-full pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/3 right-1/4 w-[700px] h-[700px] bg-secondary-600/10 blur-[180px] rounded-full pointer-events-none"
            />

            {/* Stars/Dust Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)', backgroundSize: '80px 80px' }} />

            {/* Main Content Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-7xl px-4 sm:px-6 pt-12 pb-32 flex flex-col items-center justify-center gap-10 lg:gap-24 lg:flex-row"
            >

                {/* Left Side: Floating Book */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                    }}
                    className="relative w-1/2 sm:w-1/3 lg:w-1/4 max-w-[200px] lg:max-w-none order-2 lg:order-1"
                >
                    <motion.div
                        animate={{
                            y: [-15, 15, -15],
                            rotate: [-5, 5, -5],
                            filter: ["drop-shadow(0 0 15px rgba(217,70,239,0.2))", "drop-shadow(0 0 40px rgba(217,70,239,0.5))", "drop-shadow(0 0 15px rgba(217,70,239,0.2))"]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20"
                    >
                        <img
                            src={magicalBook}
                            alt="Magic Book"
                            className="w-full h-auto"
                        />
                        <motion.div
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-4 -left-4 lg:-top-8 lg:-left-8"
                        >
                            <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-primary-300" />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Center: Split 404 Text */}
                <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 lg:space-y-12 max-w-3xl order-1 lg:order-2">
                    <div className="flex gap-2 sm:gap-4 md:gap-8 justify-center perspective-[1000px]">
                        {errorCode.split('').map((digit, idx) => (
                            <motion.span
                                key={idx}
                                variants={digitVariants}
                                whileHover="hover"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    y: {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: idx * 0.2
                                    }
                                }}
                                className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[16rem] font-display font-black leading-none px-2 bg-gradient-to-b from-white via-white/90 to-primary-500 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(217,70,239,0.4)] cursor-default select-none"
                            >
                                {digit}
                            </motion.span>
                        ))}
                    </div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 30, filter: "blur(10px)", scale: 0.95 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                                scale: 1,
                                transition: { duration: 1, ease: "easeOut", delay: 0.5 }
                            }
                        }}
                        className="space-y-3 sm:space-y-6 px-4"
                    >
                        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white drop-shadow-sm">
                            {title}
                        </h2>
                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.8, delay: 0.8 }
                                }
                            }}
                            className="text-gray-400 text-base sm:text-xl lg:text-2xl max-w-lg mx-auto font-medium font-sans leading-relaxed"
                        >
                            {description}
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                        }}
                    >
                        <Link
                            to="/"
                            className="group relative inline-flex items-center gap-2 sm:gap-4 px-8 py-4 sm:px-12 sm:py-6 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white font-black text-base sm:text-xl shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 sm:hover:scale-110 sm:hover:rotate-1"
                        >
                            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span>{buttonText}</span>
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </motion.div>
                </div>

                {/* Right Side: Mystical Creature */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
                    }}
                    className="relative w-4/5 sm:w-2/3 lg:w-[35%] max-w-[450px] lg:max-w-none order-3"
                >
                    <motion.div
                        animate={{
                            y: [15, -15, 15],
                            x: [-10, 10, -10],
                            rotate: [5, -5, 5],
                            filter: ["drop-shadow(0 0 15px rgba(6,182,212,0.2))", "drop-shadow(0 0 40px rgba(6,182,212,0.5))", "drop-shadow(0 0 15px rgba(6,182,212,0.2))"]
                        }}
                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20"
                    >
                        <img
                            src={cosmicFox}
                            alt="Mystical Creature"
                            className="w-full h-auto"
                        />
                    </motion.div>
                    {/* Floating Steps */}
                    <div className="absolute -bottom-12 sm:-bottom-20 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 flex flex-col gap-2 sm:gap-4 opacity-40">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{
                                    opacity: [0.3, 0.7, 0.3],
                                    x: [0, 5, 0]
                                }}
                                transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
                                className="w-10 h-2 sm:w-16 sm:h-3 bg-gradient-to-r from-accent-400 to-transparent rounded-full lg:ml-auto shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                style={{ marginInline: i === 2 ? '0' : 'auto', marginRight: i * 15 + 'px' }}
                            />
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Footer Nav - Site Links */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-6 left-0 right-0 w-full flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-gray-400/80 z-20 px-4"
            >
                <Link to="/" className="hover:text-white transition-all hover:scale-105 px-2 py-1">Home</Link>
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                <Link to="/search" className="hover:text-white transition-all hover:scale-105 px-2 py-1">Search</Link>
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                <a href="https://storyweaver.org.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all hover:scale-105 px-2 py-1">StoryWeaver</a>
            </motion.div>
        </div>
    );
};

export default ErrorPage;
