import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface NotificationContextType {
    showToast: (message: string, type: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, [removeToast]);

    return (
        <NotificationContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-md px-4">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md
                                ${toast.type === 'success' ? 'bg-green-500/90 text-white border-green-400' :
                                    toast.type === 'error' ? 'bg-red-500/90 text-white border-red-400' :
                                        'bg-primary-600/90 text-white border-primary-400'}
                            `}>
                                {toast.type === 'success' && <CheckCircle size={20} />}
                                {toast.type === 'error' && <XCircle size={20} />}
                                {toast.type === 'info' && <Info size={20} />}
                                <p className="text-sm font-bold flex-1">{toast.message}</p>
                                <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
};
