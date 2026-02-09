'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, Priority } from '@/types';
import { formatDateTime, cn } from '@/lib/utils';
import { Check, Trash2, Edit2, X, Clock, Hash, Calendar, ArrowRight, Flag, Bell, RefreshCw } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string) => Promise<void>;
}

const priorityColors = {
  [Priority.HIGH]: 'text-red-500 bg-red-500/10 border-red-500/20',
  [Priority.MEDIUM]: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  [Priority.LOW]: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    try {
      await onToggle(todo.id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(todo.id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, editTitle.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        'group relative overflow-hidden rounded-[2rem] border transition-all duration-300',
        todo.completed
          ? 'bg-zinc-900/10 border-white/5 opacity-50'
          : 'bg-zinc-900/30 border-white/10 hover:border-blue-500/20 hover:bg-zinc-900/50 shadow-xl'
      )}
    >
      {/* Dynamic Glow Effect */}
      {!todo.completed && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 blur transition duration-500" />
      )}

      <div className="relative p-6 md:p-8 flex items-start gap-6">
        {/* Toggle Button Container */}
        <div className="flex flex-col items-center gap-4 pt-1">
          <button
            onClick={handleToggle}
            className={cn(
              'w-8 h-8 rounded-full border-2 transition-all duration-500 flex items-center justify-center shrink-0 group/check',
              todo.completed
                ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                : 'border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/30 active:scale-90'
            )}
          >
            {todo.completed ? (
              <Check size={14} strokeWidth={4} />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover/check:bg-blue-500 transition-colors" />
            )}
          </button>

          {!todo.completed && (
            <div className="w-px h-full min-h-[40px] bg-gradient-to-b from-zinc-800 to-transparent opacity-50" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4"
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-white placeholder-zinc-700"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  disabled={isUpdating}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest transition-all hover:bg-blue-500 disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    Deploy
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-3 rounded-xl bg-zinc-800 text-zinc-400 transition-all hover:bg-zinc-700"
                    disabled={isUpdating}
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Priority Indicator */}
                    {todo.priority && (
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-[0.2em] font-mono",
                        priorityColors[todo.priority] || priorityColors[Priority.MEDIUM]
                      )}>
                        <Flag size={8} fill="currentColor" />
                        {todo.priority}
                      </span>
                    )}

                    {/* Completion Status (Mobile) */}
                    {todo.completed && (
                      <span className="md:hidden text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        Mission Secured
                      </span>
                    )}
                  </div>

                  <h3
                    className={cn(
                      'text-xl md:text-2xl font-bold tracking-tight break-words transition-all duration-500',
                      todo.completed ? 'text-zinc-600 line-through' : 'text-zinc-100'
                    )}
                  >
                    {todo.title}
                  </h3>
                </div>

                {/* Sub-Metadata Row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  {/* Tags */}
                  {todo.tags && todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {todo.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/50 border border-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-tighter">
                          <Hash size={10} className="text-zinc-600" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Operational Dates */}
                  <div className="flex flex-wrap items-center gap-4">
                    {todo.due_date && (
                      <div className={cn(
                        "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest font-mono",
                        todo.is_overdue && !todo.completed ? "text-red-500" : "text-zinc-500"
                      )}>
                        <Clock size={12} strokeWidth={2.5} />
                        {formatDateTime(todo.due_date)}
                      </div>
                    )}

                    {todo.reminder_time && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-500/70 uppercase tracking-widest font-mono bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-500/10">
                        <Bell size={12} strokeWidth={2.5} />
                        {formatDateTime(todo.reminder_time)}
                      </div>
                    )}

                    {todo.recurrence_pattern && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest font-mono">
                        <RefreshCw size={12} strokeWidth={2.5} />
                        {todo.recurrence_pattern}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Action Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <Calendar size={12} />
                Initialized: {formatDateTime(todo.created_at)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800/50 text-zinc-500 hover:text-white hover:bg-blue-600 transition-all duration-300"
                title="Modify Parameters"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800/50 text-zinc-500 hover:text-white hover:bg-red-600 transition-all duration-300"
                title="Terminate Mission"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
