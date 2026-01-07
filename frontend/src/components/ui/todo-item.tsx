'use client';

import { useState } from 'react';
import { Todo } from '@/types';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { formatDateTime, cn } from '@/lib/utils';
import { Check, Trash2, Edit2, X, Circle } from 'lucide-react';

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
    if (!confirm('Are you sure you want to delete this task?')) return;
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
    <div className={cn(
      'group glass rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]',
      todo.completed && 'bg-white/40 dark:bg-slate-900/40 opacity-70'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <button
            onClick={handleToggle}
            className={cn(
              'mt-1 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center shrink-0',
              todo.completed
                ? 'bg-success border-success text-success-foreground'
                : 'border-muted-foreground/30 hover:border-primary'
            )}
            title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed && <Check size={14} strokeWidth={3} />}
          </button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-lg font-semibold focus:ring-0 mb-1"
                autoFocus
                disabled={isUpdating}
              />
            ) : (
              <h3
                className={cn(
                  'text-lg font-semibold break-words transition-all mb-1',
                  todo.completed && 'line-through text-muted-foreground/60'
                )}
              >
                {todo.title}
              </h3>
            )}

            {todo.description && (
              <p className={cn(
                'text-sm text-muted-foreground mb-3 break-words',
                todo.completed && 'line-through opacity-50'
              )}>
                {todo.description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {formatDateTime(todo.created_at)}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="text-xs h-7 px-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="text-xs h-7 w-7 p-0 rounded-lg"
                    >
                      <X size={14} />
                    </Button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                      title="Edit task"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
