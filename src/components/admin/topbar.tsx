"use client";

import { Bell, Command, Search } from "lucide-react";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/60 px-4 backdrop-blur-xl md:px-8">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher user, audit, agent…"
            className="h-9 w-full rounded-lg border border-border bg-card/40 pl-8 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/30"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 inline-flex h-5 -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-background/60 px-1.5 text-[10px] font-medium text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300 md:inline-flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          All systems
        </span>

        <ThemeToggle />

        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 transition-colors hover:bg-card/70"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <UserMenu variant="admin" />
      </div>
    </header>
  );
}
