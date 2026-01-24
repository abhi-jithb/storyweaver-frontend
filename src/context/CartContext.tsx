import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Book } from '../types/opds';

interface CartContextType {
    selectedBooks: Map<string, Book>;
    toggleBook: (book: Book) => void;
    selectAll: (books: Book[]) => void;
    deselectAll: (bookIds: string[]) => void;
    clearCart: () => void;
    isBookSelected: (id: string) => boolean;
    totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedBooks, setSelectedBooks] = useState<Map<string, Book>>(new Map());

    const toggleBook = useCallback((book: Book) => {
        setSelectedBooks((prev) => {
            const next = new Map(prev);
            if (next.has(book.id)) {
                next.delete(book.id);
            } else {
                next.set(book.id, book);
            }
            return next;
        });
    }, []);

    const selectAll = useCallback((books: Book[]) => {
        setSelectedBooks((prev) => {
            const next = new Map(prev);
            books.forEach((book) => {
                next.set(book.id, book);
            });
            return next;
        });
    }, []);

    const deselectAll = useCallback((bookIds: string[]) => {
        setSelectedBooks((prev) => {
            const next = new Map(prev);
            bookIds.forEach((id) => {
                next.delete(id);
            });
            return next;
        });
    }, []);

    const clearCart = useCallback(() => {
        setSelectedBooks(new Map());
    }, []);

    const isBookSelected = useCallback((id: string) => {
        return selectedBooks.has(id);
    }, [selectedBooks]);

    const totalCount = useMemo(() => selectedBooks.size, [selectedBooks]);

    const value = useMemo(
        () => ({
            selectedBooks,
            toggleBook,
            selectAll,
            deselectAll,
            clearCart,
            isBookSelected,
            totalCount,
        }),
        [selectedBooks, toggleBook, selectAll, deselectAll, clearCart, isBookSelected, totalCount]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
