import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-scaleIn transform">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 font-display">{title}</h3>
                <p className="text-gray-600 mb-8 font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    Sounds Good!
                </button>
            </div>
        </div>
    );
};
