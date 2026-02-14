import React, { useState, useEffect } from 'react';

interface ImageWithLoaderProps {
    src: string;
    alt: string;
    className?: string;
    thumbnail?: string;
    priority?: boolean;
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
    src,
    alt,
    className = '',
    thumbnail,
    priority = false,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);
    }, [src]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-100">
            {/* Thumbnail or Skeleton */}
            <div
                className={`absolute inset-0 z-0 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
            >
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt=""
                        className={`w-full h-full object-cover filter blur-xl scale-110`}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                )}
            </div>

            {/* Main Image */}
            {!hasError && (
                <img
                    src={src}
                    alt={alt}
                    className={`relative z-10 w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        } ${className}`}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                    loading={priority ? 'eager' : 'lazy'}
                />
            )}

            {/* Error Fallback */}
            {hasError && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                    <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-400 font-medium">No Cover</span>
                </div>
            )}
        </div>
    );
};
