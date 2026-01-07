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

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'An error occurred');
    }
    return response.json();
  }

  // Health check (no auth required)
  async healthCheck(): Promise<{ status: string; version: string }> {
    const response = await fetch(`${API_URL}/health`);
    return this.handleResponse(response);
  }

  // Todo CRUD operations
  async getTasks(): Promise<TodoListResponse> {
    const response = await fetch(`${API_URL}/api/tasks`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getTask(id: number): Promise<Todo> {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createTask(data: TodoCreate): Promise<Todo> {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateTask(id: number, data: TodoUpdate): Promise<Todo> {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'An error occurred');
    }
  }

  async toggleComplete(id: number): Promise<Todo> {
    const response = await fetch(`${API_URL}/api/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const api = new ApiClient();
