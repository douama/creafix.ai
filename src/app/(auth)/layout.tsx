"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[1fr_1.15fr]">
      {/* Mobile-only top bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo showTagline={false} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Accueil
        </Link>
      </header>

      {/* ───────────────────────  LEFT : form column  ─────────────────────── */}
      <div className="relative flex min-h-screen flex-col bg-[#FAF7F5] dark:bg-[#070913] overflow-hidden">
        {/* Soft modern ambient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -left-20 -top-20 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-[#EC4899]/8 to-transparent blur-3xl"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -right-20 -bottom-20 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-[#1FBEAF]/8 to-transparent blur-3xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,15,15,0.025)_1px,transparent_1px)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
        </div>

        <div className="hidden items-center justify-between px-10 pt-10 lg:flex z-10">
          <Link href="/" aria-label="CreaFix AI" className="transition-transform duration-300 hover:scale-[1.02]">
            <Logo showTagline={false} size={50} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/40 px-3.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-all hover:bg-white/80 hover:text-foreground dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-3 w-3" />
            Accueil
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center px-4 py-8 md:py-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[440px] rounded-3xl border border-black/[0.06] bg-white/70 p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_12px_40px_-12px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0B0F19]/65 dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_12px_40px_-12px_rgba(0,0,0,0.5)]"
          >
            {children}
          </motion.div>
        </main>

        <footer className="hidden items-center justify-between px-10 pb-6 text-[11px] text-muted-foreground lg:flex z-10">
          <span>© {new Date().getFullYear()} CreaFix AI · Made in Africa</span>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Help</Link>
          </div>
        </footer>
      </div>

      {/* ───────────────────────  RIGHT : showcase (desktop only)  ─────────────────────── */}
      <aside
        aria-hidden
        className="relative hidden overflow-hidden bg-[#070913] lg:flex lg:flex-col lg:items-center lg:justify-center"
      >
        {/* Animated glowing mesh gradients */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#EC4899]/18 via-[#FF8A00]/8 to-transparent blur-[120px]"
            animate={{
              x: [0, -30, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -left-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#1FBEAF]/15 via-transparent to-transparent blur-[100px]"
            animate={{
              x: [0, 30, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Subtle glowing lines/grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern bg-[size:30px_30px] opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
        </div>

        {/* Back-to-home top-right */}
        <Link
          href="/"
          className="absolute right-8 top-8 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-bold text-white/90 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à l'accueil
        </Link>

        {/* Centered content */}
        <div className="relative z-10 mx-auto max-w-lg px-10 py-12 text-center text-white flex flex-col items-center justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#EC4899] backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.15)]">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-[#FF8A00]" />
            #1 AI Revenue OS for African creators
          </div>

          {/* Testimonial Quote wrapped in a gorgeous glass card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 relative rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl max-w-md"
          >
            {/* Quote icon watermark */}
            <span className="absolute top-4 left-6 text-7xl font-serif text-white/[0.03] select-none pointer-events-none">“</span>

            <blockquote className="text-balance font-display text-[19px] font-medium leading-relaxed tracking-tight text-white/90 xl:text-[21px]">
              «&nbsp;CreaFix a détecté un shadowban Facebook que je n&apos;avais pas vu. En 9 jours
              ma page était réactivée avec un plan concret.&nbsp;»
            </blockquote>

            <figcaption className="mt-6 flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#FF8A00] text-xs font-bold text-white shadow-lg shadow-[#EC4899]/20 ring-2 ring-white/15">
                IS
              </div>
              <div className="text-left">
                <div className="text-[13px] font-bold text-white">Ibrahim Sow</div>
                <div className="text-[10px] text-white/50 font-medium">
                  Page Facebook actualité · 🇸🇳 Dakar
                </div>
              </div>
            </figcaption>

            {/* Rating */}
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/5 pt-5 text-[11px] text-white/70">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]" viewBox="0 0 20 20">
                    <path d="M10 1l2.6 6h6.4l-5 4.5 1.9 6.5L10 14l-5.9 4 1.9-6.5-5-4.5h6.4z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold text-white">4.9/5</span>
              <span className="text-white/30">·</span>
              <span>Recommandé par les créateurs</span>
            </div>
          </motion.div>

          {/* Mini Dashboard Preview Card */}
          <motion.div
            className="mt-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left shadow-2xl backdrop-blur-md relative overflow-hidden group"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Top glass reflection highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Audit en direct</span>
              </div>
              <span className="rounded-full bg-[#EC4899]/15 px-2 py-0.5 text-[9px] font-bold uppercase text-[#EC4899] ring-1 ring-[#EC4899]/25">
                Alerte de Shadowban résolue
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Statut de la page</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  Actif & Sécurisé
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#1FBEAF] to-emerald-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>

              <div className="pt-3.5 flex items-center justify-between border-t border-white/5">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white/40">RPM Moyen</div>
                  <div className="text-lg font-bold text-white flex items-baseline gap-1">
                    $1.85 
                    <span className="text-[10.5px] font-semibold text-emerald-400">×2.4</span>
                  </div>
                </div>
                {/* Wave SVG Graph */}
                <svg className="w-20 h-8 text-[#1FBEAF]" viewBox="0 0 100 30" fill="none">
                  <path d="M0,25 Q15,10 30,22 T60,5 T90,2 T100,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0,25 Q15,10 30,22 T60,5 T90,2 T100,12 L100,30 L0,30 Z" fill="currentColor" fillOpacity="0.08" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Country flags strip */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2.5 text-2xl">
              <span title="Sénégal">🇸🇳</span>
              <span title="Côte d&apos;Ivoire">🇨🇮</span>
              <span title="Nigéria">🇳🇬</span>
              <span title="Ghana">🇬🇭</span>
              <span title="Cameroun">🇨🇲</span>
              <span title="Maroc">🇲🇦</span>
              <span title="Kenya">🇰🇪</span>
              <span title="Afrique du Sud">🇿🇦</span>
              <span title="Égypte">🇪🇬</span>
            </div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/40">
              9 pays · 5 langues · 1 monnaie : tes revenus
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
