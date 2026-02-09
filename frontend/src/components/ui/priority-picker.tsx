'use client';

import { Priority } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PriorityPickerProps {
    value: Priority;
    onChange: (value: Priority) => void;
    disabled?: boolean;
}

const priorities = [
    { value: Priority.HIGH, label: 'High', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { value: Priority.MEDIUM, label: 'Medium', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { value: Priority.LOW, label: 'Low', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
];

export function PriorityPicker({ value, onChange, disabled }: PriorityPickerProps) {
    return (
        <div className="flex items-center gap-2">
            {priorities.map((p) => (
                <button
                    key={p.value}
                    type="button"
                    onClick={() => onChange(p.value)}
                    disabled={disabled}
                    className={cn(
                        'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-200',
                        value === p.value
                            ? `${p.bg} ${p.border} ${p.color} shadow-lg scale-105`
                            : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-800'
                    )}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
}
