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
  RefreshCw,
  Trophy,
  Activity,
  Plus,
  ClipboardList,
  AlertCircle,
  Sparkles,
  Zap,
  Flag,
  Hash,
  Clock,
  Bell
} from 'lucide-react';

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
    <div className="relative min-h-screen p-6 lg:p-12 max-w-7xl mx-auto">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Main Command Center Header */}
      <header className="mb-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Protocol Active</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] select-none">
              Control<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">Center.</span>
            </h1>

            <p className="text-zinc-500 font-medium text-lg leading-relaxed max-w-md">
              Optimizing your tactical objectives. Currently tracking <span className="text-white font-bold">{activeCount} pending missions</span>.
            </p>
          </motion.div>

          {/* Efficiency Hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group lg:w-[400px] w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 backdrop-blur-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-2 font-mono">Mission Success Rate</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">{Math.round(progress)}%</span>
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Optimal</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-inner">
                  <Zap size={24} className="text-blue-500" />
                </div>
              </div>

              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden mb-10 p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-1">Missions</span>
                  <span className="text-2xl font-black text-white">{todos.length}</span>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-1">Secured</span>
                  <span className="text-2xl font-black text-emerald-500">{completedCount}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Task Creation Console */}
      <section className="mb-24">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-transparent rounded-[2.5rem] opacity-50 blur-sm" />
          <div className="relative bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-8 lg:p-12 backdrop-blur-xl">
            <form onSubmit={handleCreateTodo} className="space-y-8">
              <div className="flex flex-col lg:flex-row items-end gap-6">
                <div className="flex-1 w-full space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono ml-4">Initialize Objective</label>
                  <input
                    type="text"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="Enter mission parameters..."
                    className="w-full bg-black/40 border border-white/10 rounded-3xl px-8 py-5 text-xl font-bold text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAdding || !newTodoTitle.trim()}
                  className="w-full lg:w-auto h-[68px] px-12 bg-white text-black rounded-3xl font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black group shadow-xl"
                >
                  <Plus className="inline-block mr-2 group-hover:rotate-90 transition-transform" size={20} strokeWidth={3} />
                  Deploy
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono ml-4">Priority</label>
                  <PriorityPicker value={newTodoPriority} onChange={setNewTodoPriority} disabled={isAdding} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono ml-4">Categorization</label>
                  <TagInput value={newTodoTags} onChange={setNewTodoTags} disabled={isAdding} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono ml-4">Timeline</label>
                  <input
                    type="datetime-local"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-3.5 text-xs text-zinc-400 focus:text-white transition-colors font-mono"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono ml-4">Intelligence</label>
                  <div className="flex items-center gap-2 px-6 py-3.5 bg-blue-600/5 border border-blue-500/20 rounded-2xl text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] cursor-pointer hover:bg-blue-600/10 transition-colors">
                    <Sparkles size={14} /> AI Optimized
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Operational Matrix (Missions) */}
      <section>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4 bg-zinc-900/60 p-1.5 border border-white/10 rounded-[2rem] backdrop-blur-xl w-full md:w-auto">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'flex-1 md:flex-none px-10 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500',
                  filter === f
                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/40 scale-105'
                    : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] font-mono">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {filteredTodos.length} Visible
            </span>
            <div className="w-px h-4 bg-zinc-800" />
            <span>Operational Mode v2.5.0</span>
          </div>
        </div>

        <div className="relative min-h-[400px]">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
            >
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}

          {todos.length === 0 && !isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/20 border border-dashed border-white/10 rounded-[4rem] py-32 text-center"
            >
              <div className="mx-auto w-24 h-24 bg-zinc-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center mb-8 text-zinc-700">
                <ClipboardList size={40} />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">WORKSPACE CLEAR</h3>
              <p className="text-zinc-500 text-lg max-w-sm mx-auto font-medium">All strategic objectives have been neutralized. Awaiting new mission parameters.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
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
      </section>
    </div>
  );
}
