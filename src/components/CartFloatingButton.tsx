import React from 'react';
import { useCart } from '../context/CartContext';

interface CartFloatingButtonProps {
    onClick: () => void;
}

export const CartFloatingButton: React.FC<CartFloatingButtonProps> = ({ onClick }) => {
    const { totalCount } = useCart();

    if (totalCount === 0) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] group flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-3 sm:pl-4 sm:pr-6 sm:py-4 rounded-full shadow-2xl hover:shadow-primary-500/40 hover:scale-110 active:scale-95 transition-all duration-500 border-2 border-white/20 backdrop-blur-md animate-bounce-slow"
            aria-label="View Cart"
        >
            <div className="relative">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white text-primary-600 text-[10px] font-black shadow-lg border-2 border-primary-500 animate-fadeIn">
                    {totalCount}
                </span>
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none mt-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5">Selected Books</span>
                <span className="text-sm font-bold">View Selection</span>
            </div>
        </button>
    );
};
