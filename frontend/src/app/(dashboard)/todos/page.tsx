'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Todo, TodoCreate, TodoUpdate, Priority } from '@/types';
import {
  Button,
  Input,
  PriorityPicker,
  TagInput,
} from '@/components/ui';
import { LoadingPage } from '@/components/ui/loading';
import { TodoItem } from '@/components/ui/todo-item';
import { cn } from '@/lib/utils';
import {
  Plus,
  LogOut,
  ClipboardList,
  AlertCircle,
  Sparkles,
  LayoutDashboard,
  Trophy,
  Zap,
  Flag,
  Hash,
  Clock,
  Bell,
  RefreshCw
} from 'lucide-react';
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

  const [newTodoPriority, setNewTodoPriority] = useState<Priority>(Priority.MEDIUM);
  const [newTodoTags, setNewTodoTags] = useState<string[]>([]);
  const [newTodoDueDate, setNewTodoDueDate] = useState<string>('');
  const [newTodoReminder, setNewTodoReminder] = useState<string>('');
  const [newTodoRecurrence, setNewTodoRecurrence] = useState<string>('');

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setError('');
    setIsAdding(true);

    try {
      const todo: TodoCreate = {
        title: newTodoTitle.trim(),
        priority: newTodoPriority,
        tags: newTodoTags,
        due_date: newTodoDueDate ? new Date(newTodoDueDate).toISOString() : null,
        reminder_time: newTodoReminder ? new Date(newTodoReminder).toISOString() : null,
        recurrence_pattern: newTodoRecurrence || null,
      };

      const created = await api.createTask(todo);
      setTodos([created, ...todos]);
      setTotal(total + 1);

      // Reset form
      setNewTodoTitle('');
      setNewTodoPriority(Priority.MEDIUM);
      setNewTodoTags([]);
      setNewTodoDueDate('');
      setNewTodoReminder('');
      setNewTodoRecurrence('');
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

    // Optimistic update
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
            {/* Dashboard Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-20 group"
            >
              {/* Floating Ambient Glow */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-600/30 transition-all duration-1000" />
              <div className="absolute top-0 -right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-blue-500/20 backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Neural Link Established</span>
                  </div>

                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] select-none">
                    Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">Center.</span><br />
                    <span className="italic text-zinc-800 group-hover:text-zinc-700 transition-colors duration-700">Forge the future.</span>
                  </h2>

                  <p className="text-zinc-500 font-medium text-lg md:text-xl max-w-xl leading-relaxed">
                    Welcome back, <span className="text-white font-bold">{user?.name || 'Operator'}</span>.
                    Your mission protocol is active with <span className="text-blue-500 font-black">{activeCount} pending objectives</span>.
                  </p>
                </div>

                {/* Tactical Stats Card */}
                <div className="relative group/stats">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] opacity-20 blur-xl group-hover/stats:opacity-40 transition duration-1000" />
                  <div className="relative bg-black/60 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl w-full lg:w-[380px] overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Trophy size={120} />
                    </div>

                    <div className="flex items-end justify-between mb-8">
                      <div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-2 font-mono">Mission Success Rate</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black text-white tracking-tighter">{Math.round(progress)}%</span>
                          <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">Optimal</span>
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-inner">
                        <Zap size={24} className="text-blue-500" />
                      </div>
                    </div>

                    <div className="relative w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-8 border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/20 transition-colors">
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.1em]">Objectives</span>
                        <span className="text-2xl font-black text-white">{todos.length}</span>
                      </div>
                      <div className="flex flex-col gap-1 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/20 transition-colors">
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.1em]">Secured</span>
                        <span className="text-2xl font-black text-emerald-500">{completedCount}</span>
                      </div>
                    </div>
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

            {/* Task Controls - Enhanced Creation Form */}
            <div className="mb-12">
              <div className="relative group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl transition-all hover:bg-zinc-900/60 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-2xl">
                <form onSubmit={handleCreateTodo} className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        id="objective-input"
                        name="title"
                        placeholder="Initialize new objective..."
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        disabled={isAdding}
                        autoComplete="off"
                        className="w-full bg-transparent border-none text-xl md:text-2xl text-white font-bold placeholder-zinc-700 focus:outline-none py-2"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isAdding || !newTodoTitle.trim()}
                      className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 h-12 transition-all disabled:opacity-50 active:scale-95 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20"
                    >
                      {isAdding ? 'Initializing...' : 'Add Mission'}
                    </Button>
                  </div>

                  {/* Options Stack */}
                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono">
                          <Flag size={10} /> Priority
                        </span>
                        <PriorityPicker
                          value={newTodoPriority}
                          onChange={setNewTodoPriority}
                          disabled={isAdding}
                        />
                      </div>

                      <div className="hidden md:block w-px h-8 bg-zinc-800" />

                      <div className="flex flex-col gap-2 flex-1">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono">
                          <Hash size={10} /> Tag Categorization
                        </span>
                        <TagInput
                          value={newTodoTags}
                          onChange={setNewTodoTags}
                          disabled={isAdding}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono">
                          <Clock size={10} /> Due Date
                        </span>
                        <input
                          type="datetime-local"
                          value={newTodoDueDate}
                          onChange={(e) => setNewTodoDueDate(e.target.value)}
                          className="bg-black/30 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono">
                          <Bell size={10} /> Alert Pulse
                        </span>
                        <input
                          type="datetime-local"
                          value={newTodoReminder}
                          onChange={(e) => setNewTodoReminder(e.target.value)}
                          className="bg-black/30 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-1.5 font-mono">
                          <RefreshCw size={10} /> Frequency
                        </span>
                        <select
                          value={newTodoRecurrence}
                          onChange={(e) => setNewTodoRecurrence(e.target.value)}
                          className="bg-black/30 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all cursor-pointer font-mono appearance-none"
                        >
                          <option value="">None</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="flex bg-zinc-900/60 p-1 border border-white/10 rounded-2xl backdrop-blur-xl w-full md:w-auto">
                {(['all', 'active', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300',
                      filter === f
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-105'
                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] font-mono">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  {filteredTodos.length} Objectives Filtered
                </span>
                <div className="w-px h-4 bg-zinc-800" />
                <span>Sync v2.5.1 Alpha</span>
              </div>
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

          {/* Mission Grid */}
          <div className="relative min-h-[400px]">
            {/* Visual Guideline */}
            <div className="absolute left-[-40px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-zinc-800/50 to-transparent hidden xl:block" />

            {todos.length === 0 && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/10 border border-white/5 rounded-[4rem] py-32 text-center backdrop-blur-3xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                  <div className="mx-auto w-24 h-24 bg-zinc-900/80 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10 shadow-2xl transition-transform group-hover:scale-110 duration-500">
                    <Sparkles className="w-10 h-10 text-blue-500/40" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">SECURE WORKSPACE</h3>
                  <p className="text-zinc-500 text-lg max-w-sm mx-auto font-medium leading-relaxed">
                    All objectives have been successfully targeted and neutralized. Systems are holding at 100% efficiency.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-6">
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
      </main>

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
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] hidden sm:block font-mono">
            FocusFlow v2.5.0 — Ultra Premium Build
          </div>
        </div>
      </footer>
    </div >
  );
}
