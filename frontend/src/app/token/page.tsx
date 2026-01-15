'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { getToken } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Key, ArrowLeft, CheckCircle, Zap, Shield, Terminal, Copy, ExternalLink, LayoutDashboard } from 'lucide-react';
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
      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const response = await getToken.byEmail(email);

      if (response.error) {
        setError(response.error.message || 'Token generation failed');
        setIsLoading(false);
        return;
      }

      if (response.data) {
        setToken(response.data.token, {
          id: response.data.user.id,
          email: response.data.user.email,
        });

        setTokenResult({
          token: response.data.token,
          expires_at: response.data.expires_at
        });

        setTimeout(() => {
          router.push('/todos');
        }, 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Token generation failed');
    } finally {
      setIsLoading(false);
    }
  };

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
        className="w-full max-w-[540px] z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="bg-zinc-900 border border-white/5 p-4 rounded-3xl shadow-2xl transition-all duration-500"
            >
              <Terminal size={32} className="text-blue-500" />
            </motion.div>
            <div className="space-y-1">
              <span className="text-4xl font-bold tracking-tighter text-white">FocusFlow</span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Developer Operations</p>
            </div>
          </Link>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!tokenResult ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Key size={100} />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">Access Portal</h1>
                  <p className="text-zinc-500 font-medium tracking-tight max-w-[300px]">Provision an encrypted bearer token for API orchestration.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest"
                      >
                        <AlertCircle size={18} />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Account Identity</Label>
                    <Input
                      type="email"
                      placeholder="operative@nexus.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 bg-black/40 border-white/10 focus:border-blue-500/50 rounded-2xl px-6 transition-all text-white placeholder-zinc-700 font-semibold"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Provisioning...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Zap size={18} />
                        <span>Request Bearer Token</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center pt-8 border-t border-white/5">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.2em] group">
                      <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                      Back to Landing
                    </Link>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2 italic">Token Provisioned.</h2>
                  <p className="text-zinc-500 font-medium">Authentication handshake successful.</p>
                </div>

                <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 font-mono group relative">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(tokenResult.token)}
                      className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Live Encryption Active</span>
                  </div>
                  <div className="max-h-[120px] overflow-y-auto scrollbar-hide">
                    <p className="text-[11px] text-blue-400/90 break-all leading-relaxed whitespace-pre-wrap select-all font-semibold">
                      {tokenResult.token}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <span>TTL: 24.00.00H</span>
                    <span>TS: {new Date().getTime()}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-blue-600/10 border border-blue-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Initializing Workspace Environment...</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="h-14 rounded-2xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-xs font-black uppercase tracking-widest transition-all"
                      onClick={() => router.push('/')}
                      variant="outline"
                    >
                      Documentation
                    </Button>
                    <Button
                      className="h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-widest shadow-2xl transition-all"
                      onClick={() => router.push('/todos')}
                    >
                      Enter System
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
