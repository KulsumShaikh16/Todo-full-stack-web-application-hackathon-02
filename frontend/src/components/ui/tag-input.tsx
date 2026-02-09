'use client';

import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TagInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
}

export function TagInput({ value, onChange, disabled }: TagInputProps) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.trim() && !value.includes(input.trim().toLowerCase())) {
                if (value.length >= 10) return; // Limit to 10 tags
                onChange([...value, input.trim().toLowerCase()]);
                setInput('');
            }
        } else if (e.key === 'Backspace' && !input && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-zinc-900/40 border border-white/5 rounded-xl min-h-[48px] focus-within:border-blue-500/30 transition-colors">
            <Tag size={14} className="text-zinc-500 ml-1" />
            <AnimatePresence mode="popLayout">
                {value.map((tag) => (
                    <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wide group"
                    >
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            disabled={disabled}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                        >
                            <X size={10} />
                        </button>
                    </motion.span>
                ))}
            </AnimatePresence>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? "Add tags..." : ""}
                disabled={disabled}
                className="flex-1 bg-transparent border-none text-xs text-white placeholder-zinc-600 focus:outline-none min-w-[60px]"
            />
        </div>
    );
}
