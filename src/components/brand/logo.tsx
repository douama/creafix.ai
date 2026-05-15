import { cn } from "@/lib/utils";

export function Logo({
  className,
  withText = true,
  showTagline = true,
}: {
  className?: string;
  withText?: boolean;
  showTagline?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-xl gradient-brand opacity-80 blur-[3px]" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-primary/40">
          {/* Logo CreaFix : clé/spanner stylisée + spark IA */}
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
            <path
              d="M14.7 6.3a3 3 0 0 0-4.2 3.6L4 16.4 7.6 20l6.5-6.5a3 3 0 0 0 3.6-4.2l-2 2-1.4-1.4 2-2z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 4l1.2 2.4L19.6 7.6 17.2 8.8 16 11.2l-1.2-2.4L12.4 7.6 14.8 6.4z"
              fill="currentColor"
              opacity="0.95"
            />
          </svg>
        </div>
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-bold tracking-tight">
            CreaFix <span className="gradient-text">AI</span>
          </span>
          {showTagline && (
            <span className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Fix · Scale · Earn
            </span>
          )}
        </div>
      )}
    </div>
  );
}
