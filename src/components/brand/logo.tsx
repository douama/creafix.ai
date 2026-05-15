import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-xl gradient-brand opacity-90 blur-[2px]" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-primary/40">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
            <path
              d="M4 16L9 7L12 12L15 9L20 16"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          </svg>
        </div>
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-bold tracking-tight">
            Monetiq <span className="gradient-text">AI</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Africa Edition
          </span>
        </div>
      )}
    </div>
  );
}
