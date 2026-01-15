import { Todo, TodoCreate, TodoUpdate, TodoListResponse } from '@/types';

import { config } from '@/config';

const API_URL = config.apiUrl;

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });
    return this.handleResponse(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      const errorMessage = error.detail || 'An error occurred';

      console.error(`API Error: ${response.status} ${response.url}`, error);

      // Check for token expiration or invalid token errors
      if (response.status === 401 &&
        (errorMessage.toLowerCase().includes('expired') ||
          errorMessage.toLowerCase().includes('invalid token'))) {
        // Clear the expired token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // Redirect to signin page
          window.location.href = '/signin';
        }
        throw new Error('Session expired. Please login again.');
      }

      throw new Error(errorMessage);
    }

    // Handle 204 No Content or empty response body
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (e) {
      console.error('Failed to parse JSON response:', text);
      throw new Error('Invalid server response format');
    }
  }

  // Health check (no auth required)
  async healthCheck(): Promise<{ status: string; version: string }> {
    const response = await fetch(`${API_URL}/health`);
    return this.handleResponse(response);
  }

  // Todo CRUD operations
  async getTasks(): Promise<TodoListResponse> {
    return this.fetch<TodoListResponse>('/api/tasks');
  }

  async getTask(id: number): Promise<Todo> {
    return this.fetch<Todo>(`/api/tasks/${id}`);
  }

  async createTask(data: TodoCreate): Promise<Todo> {
    return this.fetch<Todo>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: TodoUpdate): Promise<Todo> {
    return this.fetch<Todo>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.fetch<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleComplete(id: number): Promise<Todo> {
    return this.fetch<Todo>(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  }
}

export const api = new ApiClient();
