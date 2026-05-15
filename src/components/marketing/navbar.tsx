"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#how", label: "Comment ça marche" },
  { href: "#pricing", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="container">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl border border-border px-4 py-2.5 transition-all",
            scrolled
              ? "bg-background/70 backdrop-blur-xl shadow-xl shadow-black/30"
              : "bg-card/40 backdrop-blur-md",
          )}
        >
          <Link href="/" aria-label="Monetiq AI">
            <Logo />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle className="h-9 w-9" />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild variant="brand" size="sm">
              <Link href="/signup">Essai gratuit</Link>
            </Button>
          </div>

          <button
            className="rounded-lg p-2 md:hidden hover:bg-muted/40"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="mt-2 rounded-2xl border border-border bg-background/90 p-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild variant="brand" size="sm" className="flex-1">
                  <Link href="/signup">Essai gratuit</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
