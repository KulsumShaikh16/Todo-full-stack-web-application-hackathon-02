'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '@/types';
import { formatDateTime, cn } from '@/lib/utils';
import { Check, Trash2, Edit2, X, Clock, Hash, Calendar, ArrowRight } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string) => Promise<void>;
}

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
        'group relative overflow-hidden rounded-2xl border transition-all duration-300',
        todo.completed
          ? 'bg-zinc-900/10 border-white/5 opacity-40'
          : 'bg-zinc-900/40 border-white/10 hover:border-blue-500/30 hover:bg-zinc-900/60 shadow-lg'
      )}
    >
      {/* Active Indicator */}
      {!todo.completed && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}

      <div className="p-4 flex items-start gap-4">
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={cn(
            'mt-1 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center shrink-0',
            todo.completed
              ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
              : 'border-zinc-800 hover:border-blue-500 hover:scale-110 active:scale-90 bg-black/20'
          )}
        >
          {todo.completed && <Check size={12} strokeWidth={4} />}
        </button>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 bg-zinc-800/50 border border-white/10 rounded-lg px-3 py-1 text-base font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-zinc-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  disabled={isUpdating}
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSave}
                    className="p-1 px-2 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase transition-all hover:bg-blue-500 disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 px-2 rounded-lg bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase transition-all hover:bg-zinc-700"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Task ID Badge */}
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[9px] font-bold uppercase tracking-widest">
                    ID #{String(todo.id).padStart(3, '0')}
                  </span>

                  <h3
                    className={cn(
                      'text-base font-semibold tracking-tight break-words transition-all duration-300',
                      todo.completed ? 'text-zinc-600 line-through' : 'text-zinc-100'
                    )}
                  >
                    {todo.title}
                  </h3>
                </div>
              </div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                <Calendar size={10} className="text-zinc-600" />
                {formatDateTime(todo.created_at)}
              </div>
            </div>

            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-blue-400 transition-all"
                title="Edit Task"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all"
                title="Delete Task"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
