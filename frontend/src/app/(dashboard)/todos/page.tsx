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
import { Plus, LogOut, ClipboardList, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">My Todos</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email || 'User'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Add todo form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleCreateTodo} className="flex gap-4">
              <Input
                placeholder="What needs to be done?"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                disabled={isAdding}
                className="flex-1"
              />
              <Button type="submit" disabled={isAdding || !newTodoTitle.trim()}>
                {isAdding ? (
                  'Adding...'
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    Add Todo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-4 rounded-md bg-destructive/10 text-destructive">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Todo list */}
        {todos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No todos yet</h3>
              <p className="text-muted-foreground">
                Add your first todo above to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>{total} {total === 1 ? 'task' : 'tasks'}</span>
              <span>
                {todos.filter((t) => t.completed).length} completed
              </span>
            </div>
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
        )}
      </main>
    </div>
  );
}
