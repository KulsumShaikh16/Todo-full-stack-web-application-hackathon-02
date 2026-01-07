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
import { AlertCircle, ArrowLeft, LogIn, CheckCircle } from 'lucide-react';
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting sign in via custom auth-client...");

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
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Set auth state with token and user
      if (result.data?.token && result.data?.user) {
        const token = result.data.token;
        const user = {
          id: result.data.user.id,
          email: result.data.user.email,
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
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">FocusFlow</span>
          </Link>
        </div>

        <div className="glass rounded-[2rem] p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to resume your flow state.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive animate-in shake duration-500">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-transparent border-white/10 focus:border-primary/50 rounded-xl px-4 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" title="Password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-transparent border-white/10 focus:border-primary/50 rounded-xl px-4 transition-all"
              />
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In to FocusFlow'
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 space-y-4 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              New to FocusFlow?{' '}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </p>
            <div className="flex flex-col items-center gap-2">
              <Link href="/token" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                Need an API Token?
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                <ArrowLeft size={12} strokeWidth={3} />
                Back to Landing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
