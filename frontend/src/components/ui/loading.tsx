import { cn } from '@/lib/utils';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('animate-spin rounded-full h-8 w-8 border-b-2 border-primary', className)} />
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
