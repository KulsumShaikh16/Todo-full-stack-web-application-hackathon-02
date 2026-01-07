'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Todo, TodoCreate, TodoUpdate } from '@/types';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { LoadingPage } from '@/components/ui/loading';
import { TodoItem } from '@/components/ui/todo-item';
import { Plus, LogOut, ClipboardList, AlertCircle, Edit2, Trash2, Circle } from 'lucide-react';

export default function TodosPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.getTasks();
      setTodos(response.tasks);
      setTotal(response.total);
      setError('');
    } catch (err) {
      if (err instanceof Error && err.message.includes('401')) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (!authLoading) {
      loadTodos();
    }
  }, [authLoading, loadTodos]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setIsAdding(true);
    try {
      const todo: TodoCreate = { title: newTodoTitle.trim() };
      const created = await api.createTask(todo);
      setTodos([created, ...todos]);
      setTotal(total + 1);
      setNewTodoTitle('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Optimistic update
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

    try {
      const updated = await api.toggleComplete(id);
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      // Revert on failure
      setTodos(todos);
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
    }
  };

  const handleDelete = async (id: number) => {
    // Optimistic update
    const filtered = todos.filter((t) => t.id !== id);
    setTodos(filtered);
    setTotal(total - 1);

    try {
      await api.deleteTask(id);
      setError('');
    } catch (err) {
      // Revert on failure
      setTodos(todos);
      setTotal(total);
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const handleUpdate = async (id: number, title: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    // Optimistic update
    setTodos(todos.map((t) => (t.id === id ? { ...t, title } : t)));

    try {
      const updated = await api.updateTask(id, { title });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      // Revert on failure
      setTodos(todos);
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (authLoading || isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <ClipboardList className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Todo Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold">{user?.email?.split('@')[0] || 'User'}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Premium Account</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
              title="Sign Out"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">You have {todos.filter(t => !t.completed).length} pending tasks for today.</p>
        </div>

        {/* Add todo form */}
        <div className="mb-12 glass rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
          <form onSubmit={handleCreateTodo} className="flex gap-2">
            <Input
              placeholder="Type your next big goal..."
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              disabled={isAdding}
              className="flex-1 h-14 bg-transparent border-none text-lg px-4 focus-visible:ring-0 shadow-none"
            />
            <Button
              type="submit"
              disabled={isAdding || !newTodoTitle.trim()}
              className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Plus size={24} />
            </Button>
          </form>
        </div>

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-8 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {/* Todo list */}
        {todos.length === 0 ? (
          <div className="glass rounded-[2.5rem] py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 border border-primary/20">
              <ClipboardList className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Clear horizon ahead</h3>
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto text-balance">
              Your task list is empty. Take a moment to breathe or plan your next move.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tasks</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Done</span>
                <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-bold">
                  {todos.filter((t) => t.completed).length}
                </span>
              </div>
            </div>
            <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
