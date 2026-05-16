"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const NAV = [
  { label: "Produit",   href: "#produit" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Plateformes", href: "#plateformes" },
  { label: "Pricing",   href: "#pricing" },
  { label: "FAQ",       href: "#faq" },
];

export function CfxNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.06] bg-[#071426]/85 backdrop-blur-xl"
          : "border-b border-transparent",
      ].join(" ")}
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#6C63FF] via-[#0D6EFD] to-[#00D1FF] shadow-[0_8px_24px_-6px_rgba(13,110,253,0.5)] transition-transform group-hover:scale-110">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent" />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-white">
            CreaFix<span className="text-[#00D1FF]"> AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-[#A5B4CC] transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-[13.5px] font-medium text-[#A5B4CC] transition-colors hover:text-white"
          >
            Se connecter
          </Link>
          <Link href="/signup" className="cfx-btn-primary !h-10 !text-[13px] !px-5">
            Lancer un audit gratuit
            <span className="text-white/70">→</span>
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white"
          aria-label="Menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#071426]/95 backdrop-blur-2xl">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-[#A5B4CC] hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 mt-3 border-t border-white/[0.06] flex flex-col gap-2">
              <Link
                href="/login"
                className="cfx-btn-ghost w-full !justify-center"
              >
                Se connecter
              </Link>
              <Link href="/signup" className="cfx-btn-primary w-full !justify-center">
                Lancer un audit
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
