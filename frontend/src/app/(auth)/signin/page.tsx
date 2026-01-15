'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingPage } from '@/components/ui/loading';
import { signIn } from '@/lib/auth-client';
import { AlertCircle, ArrowLeft, LogIn, CheckCircle, LayoutDashboard, Sparkles, Shield } from 'lucide-react';
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
      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      if (!password) {
        setError('Please enter your password');
        setIsLoading(false);
        return;
      }

      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      if (result.data?.token && result.data?.user) {
        setToken(result.data.token, {
          id: result.data.user.id,
          email: result.data.user.email,
        });
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
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="bg-blue-600 p-4 rounded-3xl shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] transition-all duration-500"
            >
              <LayoutDashboard size={32} className="text-white" />
            </motion.div>
            <div className="space-y-1">
              <span className="text-4xl font-bold tracking-tighter text-white">FocusFlow</span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Core Authentication</p>
            </div>
          </Link>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield size={120} />
          </div>

          <div className="mb-10 relative">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Session</h1>
            <p className="text-zinc-500 font-medium tracking-tight">Access your high-performance workspace.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6 relative">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Email Pipeline</Label>
              <Input
                type="email"
                placeholder="name@nexus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 bg-black/40 border-white/10 focus:border-blue-500/50 rounded-2xl px-6 transition-all text-white placeholder-zinc-700 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Access Key</Label>
                <Link href="#" className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">Recover Account</Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 bg-black/40 border-white/10 focus:border-blue-500/50 rounded-2xl px-6 transition-all text-white placeholder-zinc-700 font-semibold"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synchronizing...</span>
                </div>
              ) : (
                'Initialize Session'
              )}
            </Button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 space-y-6 text-center relative">
            <p className="text-sm text-zinc-500 font-medium">
              New operative?{' '}
              <Link href="/signup" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
                Apply for Access
              </Link>
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.2em] group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Landing
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
