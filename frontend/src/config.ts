/**
 * Shared configuration for the frontend
 */

export const config = {
    // API URL preference:
    // 1. Environment variable (standard for Vercel/Production)
    // 2. Localhost fallback (standard for local development)
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',

    // Better Auth specific config if needed
    authUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
};
