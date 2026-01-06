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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Todo App</h1>
          <div className="flex items-center gap-4">
            <Link href="/token">
              <Button variant="outline">Get Token</Button>
            </Link>
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="text-center py-20">
          <h2 className="text-5xl font-bold tracking-tight text-foreground mb-6">
            Manage your tasks with <span className="text-primary">ease</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A simple, fast, and secure todo application that helps you stay organized
            and productive. Sign in to get started or generate a JWT token.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin">
              <Button size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/token">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Get JWT Token
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 py-16">
          <Card>
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Simple & Clean</CardTitle>
              <CardDescription>
                An intuitive interface that makes task management effortless
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Secure</CardTitle>
              <CardDescription>
                JWT-based authentication keeps your data safe and isolated
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Fast</CardTitle>
              <CardDescription>
                Built with Next.js for lightning-fast performance
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="py-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-8">
            Sign in with your credentials or generate a JWT token to access your todos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin">
              <Button size="lg">Sign In</Button>
            </Link>
            <Link href="/token">
              <Button size="lg" variant="outline">Get Token</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
