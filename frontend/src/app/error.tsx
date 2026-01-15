'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCcw, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-destructive/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[120px]" />
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

                <div className="glass rounded-[3rem] p-12 md:p-16 relative border-destructive/20 shadow-destructive/5">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-background rounded-full flex items-center justify-center border border-destructive/20 shadow-xl">
                        <AlertTriangle className="w-12 h-12 text-destructive animate-pulse" />
                    </div>

                    <h1 className="text-4xl font-black tracking-tighter mb-4 text-white">Something went wrong</h1>
                    <p className="text-zinc-400 mb-10 leading-relaxed font-medium">
                        Even the best flows hit a snag. We've logged the error and are working on a fix.
                    </p>

                    <div className="flex flex-col gap-4">
                        <Button
                            size="lg"
                            onClick={reset}
                            className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-all"
                        >
                            <RefreshCcw className="mr-2 w-5 h-5" strokeWidth={3} />
                            Try Again
                        </Button>
                        <Link href="/">
                            <Button size="lg" variant="ghost" className="h-12 px-10 rounded-2xl font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-8 p-4 glass rounded-xl inline-block">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        Error Digest: {error.digest || 'no-digest-available'}
                    </p>
                </div>
            </div>
        </div>
    );
}
