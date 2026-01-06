'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingPage } from '@/components/ui/loading';
import { signUp } from '@/lib/auth-client';
import { AlertCircle, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
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
            // Validate passwords match
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setIsLoading(false);
                return;
            }

            // Validate password length
            if (password.length < 8) {
                setError('Password must be at least 8 characters');
                setIsLoading(false);
                return;
            }

            // Validate email
            if (!email.includes('@')) {
                setError('Please enter a valid email address');
                setIsLoading(false);
                return;
            }

            // Call Better Auth signup
            const response = await signUp.email({
                email,
                password,
                name: name || undefined,
            });

            if (response.error) {
                setError(response.error.message || 'Signup failed');
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
            console.error('Signup error:', err);
            setError(err instanceof Error ? err.message : 'Signup failed');
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
                        <UserPlus className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                    <CardDescription>
                        Sign up to start managing your todos
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
                            <Label htmlFor="name">Name (optional)</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
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
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </Button>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href="/signin" className="text-primary hover:underline">
                                    Sign in
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
