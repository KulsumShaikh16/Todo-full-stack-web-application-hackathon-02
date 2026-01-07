import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="bg-primary p-4 rounded-[2rem] shadow-2xl shadow-primary/40 animate-pulse">
            <CheckCircle className="w-12 h-12 text-primary-foreground" />
          </div>
          <div className="absolute -inset-4 border border-primary/20 rounded-[2.5rem] animate-spin-slow" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl font-black tracking-tighter text-gradient animate-pulse">FocusFlow</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1 h-1 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
