/**
 * Authentication client for custom FastAPI backend
 * Provides signup, signin, logout, and token generation functionality
 */

// Use environment variable for API URL, fallback to localhost for local development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface SignupData {
  email: string;
  password: string;
  name?: string;
}

interface SigninData {
  email: string;
  password: string;
}

interface TokenRequest {
  email: string;
}

interface TokenResponse {
  user_id: string;
  email: string;
  token: string;
  expires_at: number;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
  expires_at: number;
}

interface AuthResult {
  data?: AuthResponse;
  error?: {
    message: string;
  };
}

export const signUp = {
  email: async (data: SignupData): Promise<AuthResult> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          error: {
            message: error.detail || 'Signup failed',
          },
        };
      }

      const authData = await response.json();
      return { data: authData };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'Network error',
        },
      };
    }
  },
};

export const signIn = {
  email: async (data: SigninData): Promise<AuthResult> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          error: {
            message: error.detail || 'Signin failed',
          },
        };
      }

      const authData = await response.json();
      return { data: authData };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'Network error',
        },
      };
    }
  },
};

// New function to get JWT token by email using the backend endpoint
export const getToken = {
  byEmail: async (email: string): Promise<AuthResult> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          error: {
            message: error.detail || 'Token generation failed',
          },
        };
      }

      const tokenData: TokenResponse = await response.json();

      return {
        data: {
          user: {
            id: tokenData.user_id,
            email: tokenData.email,
          },
          token: tokenData.token,
          expires_at: tokenData.expires_at
        }
      };
    } catch (err) {
      return {
        error: {
          message: err instanceof Error ? err.message : 'Network error',
        },
      };
    }
  },
};

export const signOut = async (): Promise<void> => {
  // Client-side logout - just clear local storage
  // The backend logout endpoint exists but is not required for stateless JWT
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};
