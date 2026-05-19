"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitch } from "@/components/locale-switch";
import { UserMenu } from "@/components/auth/user-menu";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const links = [
    { href: "/features", label: t("features") },
    { href: "#how", label: t("how") },
    { href: "/pricing", label: t("pricing") },
    { href: "/faq", label: t("faq") },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled ? "py-1.5" : "py-2.5",
      )}
    >
      <div className="container">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-1.5 transition-all glass-chrome glass-refract",
            scrolled && "shadow-lg",
          )}
        >
          <Link href="/" aria-label="CreaFix AI" className="flex items-center">
            <Logo showTagline={false} size={44} />
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
            <LocaleSwitch />
            <ThemeToggle className="h-9 w-9" />
            {user === undefined ? (
              <div className="h-8 w-24 animate-pulse rounded-full bg-muted/40" />
            ) : user ? (
              <UserMenu />
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">{tc("login")}</Link>
                </Button>
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-gradient-to-r from-[#f92c2c] to-[#f15b25] px-4 text-xs font-semibold text-white shadow-md shadow-[#f15522]/25 transition-transform hover:scale-[1.02]"
                >
                  {tc("signup")}
                </Link>
              </>
            )}
          </div>

          <button
            className="rounded-lg p-2 md:hidden hover:bg-muted/40"
            aria-label={t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="mt-2 rounded-2xl glass-thick p-4 md:hidden">
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
              <div className="mt-2 flex items-center gap-2">
                <LocaleSwitch />
                <ThemeToggle className="h-9 w-9" />
              </div>
              <div className="mt-2">
                {user ? (
                  <UserMenu />
                ) : (
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href="/login">{tc("login")}</Link>
                    </Button>
                    <Button asChild variant="brand" size="sm" className="flex-1">
                      <Link href="/signup">{tc("signup")}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
