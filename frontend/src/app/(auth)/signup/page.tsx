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
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
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
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight mb-2">Create Account</h1>
                        <p className="text-muted-foreground">Start your journey to peak productivity.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive animate-in shake duration-500">
                                <AlertCircle size={18} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-11 bg-transparent border-white/10 focus:border-primary/50 rounded-xl px-4 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11 bg-transparent border-white/10 focus:border-primary/50 rounded-xl px-4 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" title="Password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="h-11 bg-transparent border-white/10 focus:border-primary/50 rounded-xl px-4 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" title="Confirm Password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm Password *</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="h-11 bg-transparent border-white/10 focus:border-primary/50 rounded-xl px-4 transition-all"
                            />
                        </div>

                        <Button type="submit" className="w-full h-12 mt-4 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                'Create FocusFlow Account'
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 space-y-4 text-center">
                        <p className="text-sm text-muted-foreground font-medium">
                            Already have an account?{' '}
                            <Link href="/signin" className="text-primary font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                        <div className="flex flex-col items-center gap-2">
                            <Link href="/token" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                                API Token
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
