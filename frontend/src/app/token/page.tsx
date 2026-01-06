'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getToken } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Key, ArrowLeft } from 'lucide-react';
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
        }, 2000);
      }
    } catch (err) {
      console.error('Token generation error:', err);
      setError(err instanceof Error ? err.message : 'Token generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Get JWT Token</CardTitle>
          <CardDescription>
            Enter your email to generate a JWT authentication token
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!tokenResult ? (
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
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Generating token...' : 'Generate Token'}
              </Button>

              <div className="text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
                  <ArrowLeft size={14} />
                  Back to home
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-md border border-green-200">
                <p className="text-green-800 text-sm font-medium mb-2">Token Generated Successfully!</p>
                <p className="text-green-700 text-xs break-words">
                  {tokenResult.token}
                </p>
                <p className="text-green-700 text-xs mt-2">
                  Expires at: {new Date(tokenResult.expires_at * 1000).toLocaleString()}
                </p>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                You will be redirected to your todos shortly...
              </p>

              <Button
                className="w-full"
                onClick={() => router.push('/todos')}
                variant="outline"
              >
                Go to Todos Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}