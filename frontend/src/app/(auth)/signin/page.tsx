'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingPage } from '@/components/ui/loading';
import { signIn } from '@/lib/auth-client';
import { AlertCircle, ArrowLeft, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isLoading: authLoading, setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/todos');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email
      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Validate password
      if (!password) {
        setError('Please enter your password');
        setIsLoading(false);
        return;
      }

      // Call Better Auth signin
      const response = await signIn.email({
        email,
        password,
      });

      if (response.error) {
        setError(response.error.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Set auth state with token and user
      if (response.data?.token && response.data?.user) {
        const token = response.data.token;
        const user = {
          id: response.data.user.id,
          email: response.data.user.email,
        };
        setToken(token, user);

        // Redirect to todos
        router.push('/todos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your todos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Or get a JWT token with your email:{' '}
                <Link href="/token" className="text-primary hover:underline">
                  Generate Token
                </Link>
              </p>
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
                <ArrowLeft size={14} />
                Back to home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
