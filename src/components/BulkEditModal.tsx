import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Globe, BarChart, Tag, Save } from 'lucide-react';
import { Book } from '../types/opds';

interface BulkEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updates: Partial<Book>) => void;
    selectedCount: number;
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({ isOpen, onClose, onUpdate, selectedCount }) => {
    const [updates, setUpdates] = useState<Partial<Book>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(updates);
        onClose();
        setUpdates({});
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary-500 to-primary-500"></div>
                            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 font-display">
                                <Edit3 className="text-secondary-600 w-8 h-8" strokeWidth={3} /> Bulk Edit
                            </h2>
                            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-2xl transition-all shadow-sm border border-gray-100 active:scale-90">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="bg-secondary-50/50 p-6 rounded-3xl border border-secondary-100/50 flex items-center gap-5 shadow-inner">
                                <div className="h-16 w-16 rounded-2xl bg-secondary-500 flex items-center justify-center text-white font-black text-2xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                                    {selectedCount}
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 text-lg">Books Selected</p>
                                    <p className="text-xs text-secondary-600 font-black uppercase tracking-widest">Applying changes to all</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={16} className="text-accent-500" /> Change Language
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-accent-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                        placeholder="Enter new language..."
                                        onChange={(e) => setUpdates({ ...updates, language: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                        <BarChart size={16} className="text-primary-500" /> New Reading Level
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                        placeholder="Enter new level..."
                                        onChange={(e) => setUpdates({ ...updates, level: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                        <Tag size={16} className="text-purple-500" /> Add Categories
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                        placeholder="Comma separated categories..."
                                        onChange={(e) => setUpdates({ ...updates, categories: e.target.value.split(',').map(c => c.trim()) })}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 font-medium italic text-center px-4">
                                Leave fields empty if you don't want to change those values.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-8 py-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black text-lg transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 px-12 py-5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-secondary-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Save size={24} strokeWidth={3} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
