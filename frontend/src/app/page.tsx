'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, Zap } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <CheckCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">FocusFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="/token" className="text-sm font-medium hover:text-primary transition-colors">API Token</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/signin">
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Zap className="w-3 h-3" />
              <span>THE FUTURE OF TASK MANAGEMENT</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Manage your tasks with <br />
              <span className="text-gradient">unmatched ease</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              FocusFlow is a minimalist, secure, and lightning-fast task management system
              designed for high-performance teams and individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signin">
                <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/25 hover:scale-105 transition-transform duration-200">
                  Join FocusFlow
                </Button>
              </Link>
              <Link href="/token" className="text-sm font-semibold flex items-center gap-2 hover:text-primary transition-colors group">
                Looking for the API?
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass group hover:border-primary/40 transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl mb-3">Simple & Intuitive</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  A distraction-free interface designed to keep you in flow state,
                  making task management feel like a breeze.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass group hover:border-primary/40 transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <Shield className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl mb-3">Enterprise Security</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Your data is protected with industry-standard JWT encryption and
                  Better Auth infrastructure.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass group hover:border-primary/40 transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <Zap className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl mb-3">Ultra Fast</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Built on Next.js 14 and edge computing, ensuring 0ms lag
                  when switching between your tasks.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto glass rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl" />
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Ready to elevate your focus?</h3>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of users who have streamlined their day with FocusFlow.
            </p>
            <Link href="/signin">
              <Button size="lg" className="h-14 px-12 text-lg shadow-lg shadow-primary/20">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 mt-12 bg-slate-950/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-60">
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">FocusFlow</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; 2024 FocusFlow Inc. Crafted with precision for high performance.
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
