import React, { useState, useEffect } from 'react';
import { Home, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, Variants, AnimatePresence } from 'framer-motion';

import nebulaBg from '../assets/404/nebula-bg.png';
import magicalBook from '../assets/404/magical-book.png';
import cosmicFox from '../assets/404/cosmic-fox.png';

interface Props {
    errorCode?: string;
    title?: string;
    description?: string;
    buttonText?: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const digitVariants: Variants = {
    hidden: { scale: 0.5, opacity: 0, filter: "blur(10px)", y: 40 },
    visible: {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 90 }
    },
    hover: {
        scale: 1.1,
        filter: "drop-shadow(0 0 20px rgba(217,70,239,0.6))",
        transition: { duration: 0.3 }
    }
};

const ErrorPage: React.FC<Props> = ({
    errorCode = "404",
    title = "Lost in the Weaver's threads?",
    description = "The page you're looking for hasn't been written yet...",
    buttonText = "Return to Home"
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-[#02020a] text-white overflow-hidden font-display flex flex-col items-center justify-center antialiased">

            {/* 1. Deep Space Background - Slow Pan effect */}
            <motion.div
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1.05, opacity: 0.5 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none will-change-transform"
                style={{
                    backgroundImage: `url(${nebulaBg})`,
                    transform: 'translateZ(0)'
                }}
            />

            {/* 2. Atmospheric Overlays */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#02020a] via-transparent to-[#02020a] opacity-90" />
            <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary-900/20 to-transparent" />

            {/* 3. High-Quality Floating Orbs (Using Opacity + Translate only for speed) */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-500/10 blur-[150px] rounded-full pointer-events-none"
            />

            {/* 4. Main Content Container */}
            <AnimatePresence>
                {mounted && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center justify-center gap-12 lg:gap-20 lg:flex-row"
                    >
                        {/* LEFT: MAGICAL BOOK */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
                            className="relative w-1/2 sm:w-1/3 lg:w-1/4 order-2 lg:order-1"
                        >
                            {/* Static Background Glow (No Lag) */}
                            <div className="absolute inset-0 bg-primary-500/20 blur-[60px] rounded-full scale-75" />
                            <motion.div
                                animate={{
                                    y: [-15, 15, -15],
                                    rotate: [-3, 3, -3]
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-20"
                            >
                                <img src={magicalBook} alt="Magic Book" className="w-full h-auto drop-shadow-2xl" />
                                <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -top-4 -left-4 text-primary-300"
                                >
                                    <Sparkles size={32} />
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* CENTER: CONTENT */}
                        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl order-1 lg:order-2">
                            <div className="flex gap-4 sm:gap-6 justify-center">
                                {errorCode.split('').map((digit, idx) => (
                                    <motion.span
                                        key={idx}
                                        variants={digitVariants}
                                        whileHover="hover"
                                        animate={{ y: [0, -15, 0] }}
                                        transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 } }}
                                        className="text-8xl sm:text-9xl md:text-[14rem] font-black leading-none bg-gradient-to-b from-white via-white to-primary-500 bg-clip-text text-transparent select-none drop-shadow-2xl"
                                    >
                                        {digit}
                                    </motion.span>
                                ))}
                            </div>

                            <motion.div variants={digitVariants} className="space-y-4 px-6">
                                <h2 className="text-3xl sm:text-6xl font-bold text-white tracking-tight drop-shadow-md">
                                    {title}
                                </h2>
                                <p className="text-gray-400 text-lg sm:text-2xl max-w-xl mx-auto font-medium">
                                    {description}
                                </p>
                            </motion.div>

                            <motion.div variants={digitVariants}>
                                <Link
                                    to="/"
                                    className="group relative inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-black text-xl shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-primary-500/50 transition-all transform hover:scale-110 active:scale-95"
                                >
                                    <Home className="w-6 h-6" />
                                    <span>{buttonText}</span>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>

                        {/* RIGHT: COSMIC FOX */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}
                            className="relative w-3/5 sm:w-2/3 lg:w-[32%] order-3"
                        >
                            {/* Static Background Glow (No Lag) */}
                            <div className="absolute inset-0 bg-secondary-500/20 blur-[80px] rounded-full scale-90" />
                            <motion.div
                                animate={{
                                    y: [15, -15, 15],
                                    x: [-5, 5, -5]
                                }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <img src={cosmicFox} alt="Cosmic Fox" className="w-full h-auto drop-shadow-2xl" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ErrorPage;