'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Todo, TodoCreate, TodoUpdate } from '@/types';
import {
  Button,
  Input,
} from '@/components/ui';
import { LoadingPage } from '@/components/ui/loading';
import { TodoItem } from '@/components/ui/todo-item';
import { cn } from '@/lib/utils';
import { Plus, LogOut, ClipboardList, AlertCircle, Sparkles, LayoutDashboard, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';

export default function TodosPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

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

    setError('');
    setIsAdding(true);
    console.log('Attempting to create task:', newTodoTitle.trim());

    try {
      const todo: TodoCreate = { title: newTodoTitle.trim() };
      const created = await api.createTask(todo);
      console.log('Task created successfully:', created);
      setTodos([created, ...todos]);
      setTotal(total + 1);
      setNewTodoTitle('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create todo';
      console.error('Task creation failed:', msg);
      setError(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

    try {
      const updated = await api.toggleComplete(id);
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setTodos(todos);
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
    }
  };

  const handleDelete = async (id: number) => {
    const filtered = todos.filter((t) => t.id !== id);
    setTodos(filtered);
    setTotal(total - 1);

    try {
      await api.deleteTask(id);
      setError('');
    } catch (err) {
      setTodos(todos);
      setTotal(total);
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const handleUpdate = async (id: number, title: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setTodos(todos.map((t) => (t.id === id ? { ...t, title } : t)));

    try {
      const updated = await api.updateTask(id, { title });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setTodos(todos);
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  if (authLoading || isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-blue-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-zinc-900 border border-white/10 p-2.5 rounded-xl shadow-2xl">
                <LayoutDashboard size={20} className="text-blue-500" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">FocusFlow</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Professional Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-zinc-200">{user?.name || user?.email?.split('@')[0]}</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Standard Tier</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/chat"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 h-10 transition-all duration-300 shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <Sparkles size={14} />
                <span className="font-bold text-xs uppercase tracking-tight">AI Agent</span>
              </Link>

              <button
                onClick={() => logout()}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Welcome & Stats */}
          <div className="lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Zap size={10} /> Focus Mode Active
                </div>
                <h2 className="text-5xl font-bold tracking-tighter text-white mb-3">
                  Elevate <span className="text-blue-500">Focus.</span><br />
                  Own the <span className="italic text-zinc-400">results.</span>
                </h2>
                <p className="text-zinc-500 font-medium text-lg">
                  You have <span className="text-white font-bold">{activeCount} missions</span> remaining for today.
                </p>
              </div>

              {/* Progress Card */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl min-w-[280px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Global Progress</span>
                  <span className="text-lg font-bold text-white">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Active</span>
                    <span className="text-xl font-bold text-white">{activeCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Done</span>
                    <span className="text-xl font-bold text-emerald-500">{completedCount}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Call to Action */}
            <Link
              href="/chat"
              className="block mb-12 relative group overflow-hidden rounded-[2.5rem]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-500"></div>
              <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/40 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-1">Intelligent Task Orchestration</h3>
                    <p className="text-zinc-400 font-medium">Use AI to generate, optimize, and organize your missions instantly.</p>
                  </div>
                </div>
                <div className="bg-white text-black px-8 py-3 rounded-2xl font-bold text-sm uppercase tracking-tighter hover:bg-zinc-200 transition-colors shadow-2xl active:scale-95">
                  Launch Assistant
                </div>
              </div>
            </Link>

            {/* Task Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
              <div className="flex-1 relative group">
                <form onSubmit={handleCreateTodo} className="relative">
                  <div className="absolute inset-0 bg-blue-600/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none"></div>
                  <input
                    id="objective-input"
                    name="title"
                    placeholder="Initialize new objective..."
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    disabled={isAdding}
                    autoComplete="off"
                    autoFocus
                    className="w-full h-14 bg-zinc-900/60 border border-white/10 rounded-2xl pl-14 pr-32 transition-all focus:border-blue-500/50 focus:bg-zinc-900 text-white font-semibold placeholder-zinc-600 outline-none group-hover:border-white/20 relative z-10"
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none z-20">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                  <Button
                    type="submit"
                    disabled={isAdding || !newTodoTitle.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white border-none rounded-xl px-4 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2 min-w-[100px] justify-center z-20"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Initializing</span>
                      </>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-widest">Add</span>
                    )}
                  </Button>
                </form>
              </div>

              <div className="flex items-center gap-1 p-1 bg-zinc-900/60 border border-white/10 rounded-2xl backdrop-blur-xl">
                {(['all', 'active', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all',
                      filter === f
                        ? 'bg-white text-black shadow-xl scale-105'
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Todo List Header */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Lifecycle Pipeline</span>
                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">{filteredTodos.length} Tasks</span>
              </div>
            </div>

            {/* Todo List */}
            <div className="space-y-3 min-h-[300px]">
              {todos.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900/20 border border-dashed border-white/10 rounded-[3rem] py-24 text-center backdrop-blur-3xl"
                >
                  <div className="mx-auto w-24 h-24 bg-zinc-900/50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                    <ClipboardList className="w-12 h-12 text-zinc-700" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 tracking-tighter uppercase whitespace-pre-wrap">Zero Workspace Objectives</h3>
                  <p className="text-zinc-500 text-lg max-w-sm mx-auto font-medium">
                    Your current workload is optimized. Use the AI Assistant to generate new missions or take a structured break.
                  </p>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-2xl border-t border-white/5 py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">System Online</span>
            </div>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-2">
              <Trophy size={12} className="text-yellow-500/50" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{completedCount} Missions Secured</span>
            </div>
          </div>
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hidden sm:block">
            FocusFlow v2.4.0 — Premium Build
          </div>
        </div>
      </footer>
    </div>
  );
}
