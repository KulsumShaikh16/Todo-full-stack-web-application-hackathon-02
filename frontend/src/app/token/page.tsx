'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getToken } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Key, ArrowLeft, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

export default function TokenPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenResult, setTokenResult] = useState<{ token: string; expires_at: number } | null>(null);
  const { setToken } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTokenResult(null);

    try {
      // Validate email
      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Call backend token generation endpoint
      const response = await getToken.byEmail(email);

      if (response.error) {
        setError(response.error.message || 'Token generation failed');
        setIsLoading(false);
        return;
      }

      if (response.data) {
        // Set the token in auth context
        setToken(response.data.token, {
          id: response.data.user.id,
          email: response.data.user.email,
        });

        // Show the generated token
        setTokenResult({
          token: response.data.token,
          expires_at: response.data.expires_at
        });

        // Redirect to todos after a short delay
        setTimeout(() => {
          router.push('/todos');
        }, 3000);
      }
    } catch (err) {
      console.error('Token generation error:', err);
      setError(err instanceof Error ? err.message : 'Token generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">FocusFlow</span>
          </Link>
        </div>

        <div className="glass rounded-[2.5rem] p-8 md:p-10">
          {!tokenResult ? (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Key className="w-4 h-4 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">Developer Access</h1>
                </div>
                <p className="text-muted-foreground">Generate a secure JWT token for API integration or quick login.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive animate-in shake duration-500">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Account Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 bg-transparent border-white/10 focus:border-primary/50 rounded-xl px-4 transition-all"
                  />
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap size={18} />
                      <span>Generate Access Token</span>
                    </div>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-white/5">
                  <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest group">
                    <ArrowLeft size={12} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-6 border border-success/20">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Token Ready</h2>
                <p className="text-muted-foreground">Successfully authenticated via email.</p>
              </div>

              <div className="p-5 bg-slate-950/40 rounded-2xl border border-white/5 font-mono">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">JWT Bearer Token</span>
                  <span className="text-[10px] font-bold text-success uppercase tracking-widest">Active</span>
                </div>
                <p className="text-xs text-blue-400 break-all leading-relaxed whitespace-pre-wrap select-all">
                  {tokenResult.token}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-muted-foreground">
                    Expires: {new Date(tokenResult.expires_at * 1000).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs font-medium text-muted-foreground">Auto-redirecting to dashboard in 3s...</p>
                </div>
                <Button
                  className="w-full h-12 rounded-xl"
                  onClick={() => router.push('/todos')}
                  variant="outline"
                >
                  Enter FocusFlow Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}