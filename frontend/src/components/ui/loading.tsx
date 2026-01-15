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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="bg-blue-600 p-4 rounded-[2rem] shadow-2xl shadow-blue-600/40 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-3xl font-bold tracking-tighter text-white animate-pulse">FocusFlow</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
