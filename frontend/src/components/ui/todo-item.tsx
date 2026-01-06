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
    <Card className={cn('transition-all', todo.completed && 'opacity-60')}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm"
              autoFocus
              disabled={isUpdating}
            />
          ) : (
            <CardTitle
              className={cn(
                'text-lg flex-1 transition-all',
                todo.completed && 'line-through text-muted-foreground'
              )}
            >
              {todo.title}
            </CardTitle>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggle}
              className={cn(
                'p-2 rounded-full transition-colors',
                todo.completed
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              )}
              title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.completed ? <Check size={16} /> : <Circle size={16} />}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {todo.description && (
          <p className={cn('text-sm text-muted-foreground mb-3', todo.completed && 'line-through')}>
            {todo.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created: {formatDateTime(todo.created_at)}</span>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isUpdating}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isUpdating}>
                  <X size={14} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
