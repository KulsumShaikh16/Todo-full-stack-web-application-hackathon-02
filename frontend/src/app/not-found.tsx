'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[120px]" />
            </div>

            <div className="w-full max-w-[500px] text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <span className="text-3xl font-extrabold tracking-tight">FocusFlow</span>
                    </Link>
                </div>

                <div className="glass rounded-[3rem] p-12 md:p-16 relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-background rounded-full flex items-center justify-center border border-white/10 shadow-xl">
                        <Ghost className="w-12 h-12 text-primary animate-bounce" />
                    </div>

                    <h1 className="text-7xl font-black tracking-tighter text-gradient mb-4">404</h1>
                    <h2 className="text-2xl font-bold mb-4">Are you lost?</h2>
                    <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
                        This page has slipped out of flow. Let's get you back to your tasks.
                    </p>

                    <Link href="/">
                        <Button size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-all">
                            <ArrowLeft className="mr-2 w-5 h-5" strokeWidth={3} />
                            Return Home
                        </Button>
                    </Link>
                </div>

                <p className="mt-8 text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-50">
                    FocusFlow &bull; Precision Task Management
                </p>
            </div>
        </div>
    );
}
