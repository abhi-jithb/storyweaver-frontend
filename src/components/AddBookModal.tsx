import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Book as BookIcon, User, Globe, BarChart, FileText, Image as ImageIcon, Tag } from 'lucide-react';
import { Book } from '../types/opds';

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (book: Book) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [categoryString, setCategoryString] = useState('');
    const [formData, setFormData] = useState<Partial<Book>>({
        title: '',
        author: '',
        language: '',
        level: '',
        summary: '',
        cover: '',
        categories: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBook: Book = {
            ...formData,
            id: `manual-${Date.now()}`,
            categories: categoryString.split(',').map(c => c.trim()).filter(Boolean),
        } as Book;
        onAdd(newBook);
        onClose();
        setFormData({ title: '', author: '', language: '', level: '', summary: '', cover: '', categories: [] });
        setCategoryString('');
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
                        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>
                            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 font-display">
                                <Plus className="text-primary-600 w-8 h-8" strokeWidth={3} /> Add Story
                            </h2>
                            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-2xl transition-all shadow-sm border border-gray-100 active:scale-90">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                        <BookIcon size={16} className="text-primary-500" /> Title
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                        placeholder="e.g. The Brave Little Fox"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                        <User size={16} className="text-secondary-500" /> Author
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                        placeholder="Author Name"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={16} className="text-accent-500" /> Language
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-accent-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                        placeholder="English, Spanish, etc."
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                        <BarChart size={16} className="text-orange-500" /> Reading Level
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                        placeholder="Level 1, Beginner, etc."
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon size={16} className="text-blue-500" /> Cover Image URL
                                </label>
                                <input
                                    type="url"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                    placeholder="https://example.com/cover.jpg"
                                    value={formData.cover}
                                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                    <Tag size={16} className="text-purple-500" /> Categories
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner"
                                    placeholder="Adventure, Animals, Magic (comma separated)"
                                    value={categoryString}
                                    onChange={(e) => setCategoryString(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={16} className="text-emerald-500" /> Summary
                                </label>
                                <textarea
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl transition-all outline-none font-medium shadow-inner min-h-[120px]"
                                    placeholder="Write a short description..."
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-8 py-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black text-lg transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 px-12 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Plus size={24} strokeWidth={3} /> Create Story
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
