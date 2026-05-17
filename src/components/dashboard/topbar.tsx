"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/60 px-4 backdrop-blur-xl md:px-8">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Rechercher un compte, une vidéo, une recommandation…"
            className="h-10 w-full rounded-xl border border-border bg-card/40 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="brand" className="hidden md:inline-flex">
          <Link href="/dashboard/audits/new">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Nouvel audit
          </Link>
        </Button>
        <ThemeToggle />
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/40 hover:bg-card/70">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
