// Todo types matching backend API
export interface Todo {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoListResponse {
  tasks: Todo[];
  total: number;
}

export interface TodoCreate {
  title: string;
  description?: string | null;
}

export interface TodoUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

// Auth types (JWT-based)
export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  setToken: (token: string | null, user?: User | null) => void;
  logout: () => void;
}

// API Error types
export interface ApiError {
  detail: string;
  error_code?: string;
}

// Environment variables
export interface Env {
  NEXT_PUBLIC_API_URL: string;
}
