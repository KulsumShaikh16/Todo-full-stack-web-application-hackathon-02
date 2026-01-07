// Helper to strip trailing slash
const cleanUrl = (url: string | undefined): string => {
    if (!url) return '';
    const trimmed = url.trim();
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

export const config = {
    // API URL preference:
    // 1. Environment variable (standard for Vercel/Production)
    // 2. Localhost fallback (standard for local development)
    apiUrl: cleanUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'),

    // Better Auth specific config if needed
    authUrl: cleanUrl(process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'),
};
