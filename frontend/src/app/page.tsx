'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, Zap, Sparkles, LayoutDashboard, Terminal, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/todos');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient">FocusFlow</span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="/token" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">API</Link>
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/signin">
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/signin">
              <Button className="bg-white text-black hover:bg-zinc-200 shadow-xl px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-10"
            >
              <Sparkles className="w-3 h-3" />
              <span>Enhanced with AI Intelligence</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 leading-[0.95]"
            >
              Master Focus. <br />
              <span className="text-blue-600">Own Results.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-14 leading-relaxed font-medium"
            >
              FocusFlow is a premium, AI-orchestrated task management platform designed for the next generation of high-performance developers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/signin">
                <Button size="lg" className="h-16 px-12 text-sm font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] rounded-2xl group active:scale-95 transition-all">
                  Join Workspace
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/token" className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-500 hover:text-white transition-colors py-4">
                <Terminal size={16} />
                Access Developer API
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles size={28} />}
              title="AI Orchestration"
              description="Harness the power of AI to generate, organize, and prioritize your missions through natural language."
            />
            <FeatureCard
              icon={<Shield size={28} />}
              title="Enterprise Grade"
              description="Architected with JWT encryption and robust infrastructure to ensure your workspace remains private and secure."
            />
            <FeatureCard
              icon={<Zap size={28} />}
              title="Hyper Fast"
              description="Engineered on Next.js 14 and Neon DB for sub-100ms latency across all global operations."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto relative overflow-hidden rounded-[3rem] border border-white/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-3xl"></div>
            <div className="relative p-12 md:p-24 text-center">
              <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 italic">Optimize your pipeline now.</h3>
              <p className="text-lg text-zinc-400 mb-12 max-w-xl mx-auto font-medium">
                The most advanced task management interface ever built for developers. 100% free while in beta.
              </p>
              <Link href="/signin">
                <Button size="lg" className="h-16 px-12 text-sm font-bold uppercase tracking-widest bg-white text-black hover:bg-zinc-200 shadow-2xl rounded-2xl active:scale-95 transition-all">
                  Initialize FocusFlow
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-16 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 opacity-80">
            <div className="bg-zinc-800 p-1.5 rounded-lg">
              <LayoutDashboard size={16} />
            </div>
            <span className="font-bold tracking-tight text-lg">FocusFlow</span>
          </div>
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] text-center">
            &copy; 2026 FOCUSFLOW CORE OPERATIONS. CRAFTED FOR PERFORMANCE.
          </div>
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <Link href="#" className="hover:text-blue-500 transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-blue-500 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-blue-500 transition-colors">Legal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl group hover:border-blue-500/30 transition-all duration-500"
    >
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-2xl">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-400 transition-colors">
        {description}
      </p>
    </motion.div>
  );
}
