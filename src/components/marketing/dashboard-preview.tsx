"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Bot,
  Building2,
  CheckCircle2,
  Code2,
  CreditCard,
  FileBarChart2,
  Flame,
  HelpCircle,
  LayoutDashboard,
  Moon,
  Plug,
  Search,
  Settings,
  ShieldOff,
  Sparkles,
  TrendingUp,
  Wand2,
  type LucideIcon,
} from "lucide-react";

/**
 * Dashboard mockup ultra-moderne — réplique visuelle du vrai /dashboard
 * (sidebar + topbar + welcome + 3 setup steps + outils disponibles).
 * Aucune logique métier : juste un aperçu produit pour le landing.
 */
export function DashboardPreview() {
  return (
    <div className="relative">
      {/* Glow ambient (decorative) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 30% 20%, rgba(236,72,153,0.30), transparent 60%), " +
            "radial-gradient(ellipse 40% 35% at 80% 80%, rgba(255,138,0,0.25), transparent 60%), " +
            "radial-gradient(ellipse 35% 30% at 10% 90%, rgba(31,190,175,0.22), transparent 60%)",
        }}
      />

      {/* Conic gradient border subtil */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-40"
        style={{
          background: "conic-gradient(from 0deg, #1FBEAF, #EC4899, #FF8A00, #1FBEAF)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* `dark` forcé : la card reste sombre dans les 2 thèmes */}
      <div className="dark relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#0E0E1A] to-[#1A1230] text-foreground">
        <div className="rounded-[1.4rem] bg-background/40 backdrop-blur-2xl">
          <TopbarMock />
          <div className="flex">
            <SidebarMock />
            <main className="min-w-0 flex-1 space-y-4 p-3 md:space-y-5 md:p-5">
              <WelcomeCard />
              <StepsRow />
              <ToolsRow />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Topbar — search + Nouvel audit + theme + bell + user chip
 * ────────────────────────────────────────────────────────────────── */

function TopbarMock() {
  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b border-white/10 bg-background/60 px-3 backdrop-blur-xl md:h-16 md:px-5">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
        <div className="flex h-8 w-full items-center rounded-lg border border-white/10 bg-white/[0.04] pl-8 pr-3 text-[11px] text-muted-foreground md:h-10 md:rounded-xl md:pl-9 md:text-xs">
          <span className="truncate">Rechercher un compte, une vidéo, une recommandation…</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {/* Nouvel audit pill */}
        <div className="hidden items-center gap-1 rounded-full bg-gradient-to-r from-[#EC4899] to-[#FF8A00] px-3 py-1.5 text-[11px] font-bold text-white shadow-lg shadow-[#EC4899]/30 md:inline-flex">
          <Sparkles className="h-3 w-3" />
          Nouvel audit
        </div>

        {/* Theme toggle */}
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] md:h-10 md:w-10 md:rounded-xl">
          <Moon className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
        </div>

        {/* Bell */}
        <div className="relative grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] md:h-10 md:w-10 md:rounded-xl">
          <Bell className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </div>

        {/* User chip */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2 md:gap-2 md:pr-3">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#FF8A00] text-[9px] font-bold text-white md:h-7 md:w-7 md:text-[10px]">
            KJ
          </div>
          <div className="hidden text-left leading-tight md:block">
            <div className="text-[11px] font-semibold">keurjob</div>
            <div className="text-[8.5px] uppercase tracking-wider text-muted-foreground">FREE · Creator</div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Sidebar — replica compacte du vrai sidebar (4 sections + upgrade card)
 * ────────────────────────────────────────────────────────────────── */

type NavItem = { label: string; icon: LucideIcon; active?: boolean };
type NavSection = { title: string; items: ReadonlyArray<NavItem> };

const NAV: ReadonlyArray<NavSection> = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, active: true },
      { label: "Analytics", icon: Activity },
      { label: "AI Audit",  icon: Search },
    ],
  },
  {
    title: "WOW AI",
    items: [
      { label: "Viral Lab",         icon: Flame },
      { label: "Revenue Predictor", icon: TrendingUp },
      { label: "Trend Scanner",     icon: Sparkles },
      { label: "Shadowban Guard",   icon: ShieldOff },
      { label: "AI Studio",         icon: Wand2 },
      { label: "AI Agents",         icon: Bot },
    ],
  },
  {
    title: "Pro",
    items: [
      { label: "Reports",         icon: FileBarChart2 },
      { label: "Agency Mode",     icon: Building2 },
      { label: "API & Webhooks",  icon: Code2 },
      { label: "Billing",         icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Settings", icon: Settings },
      { label: "Support",  icon: HelpCircle },
    ],
  },
];

function SidebarMock() {
  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-white/10 bg-background/40 lg:flex">
      {/* Logo */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#EC4899] via-[#FF8A00] to-[#1FBEAF] shadow-lg shadow-[#EC4899]/30">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight">
            CREA<span className="text-[#EC4899]">FIX</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 pb-2">
        {NAV.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="px-2 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade card */}
      <div className="m-2 rounded-xl border border-[#EC4899]/30 bg-gradient-to-br from-[#EC4899]/15 to-[#FF8A00]/10 p-3">
        <div className="text-[9px] font-semibold uppercase tracking-wider text-[#EC4899]">
          Free Plan
        </div>
        <div className="mt-1 text-[11px] leading-snug">
          Passe en <b>Pro</b> pour des audits illimités.
        </div>
        <div className="mt-2 grid h-7 place-items-center rounded-md bg-foreground text-[10px] font-semibold text-background">
          Upgrade · $29 / mo →
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ item }: { item: NavItem }) {
  const { icon: Icon, label, active } = item;
  return (
    <div
      className={`group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[11.5px] transition-colors ${
        active
          ? "bg-white/[0.06] text-foreground"
          : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-[#EC4899]" : "text-muted-foreground"}`} />
      <span className="truncate">{label}</span>
      {active && <span className="ml-auto h-1 w-1 rounded-full bg-[#EC4899]" />}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Welcome card — "Bienvenue 👋" + progress 33%
 * ────────────────────────────────────────────────────────────────── */

function WelcomeCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#EC4899]/[0.07] via-white/[0.02] to-white/[0.02] p-4 md:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#EC4899]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#FF8A00]/12 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-1 rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#EC4899]">
          <Sparkles className="h-2.5 w-2.5" />
          Bienvenue sur CreaFix AI
        </div>

        <h2 className="mt-2.5 font-display text-xl font-bold tracking-tight md:text-2xl">
          Bienvenue <span className="inline-block">👋</span>
        </h2>
        <p className="mt-1.5 max-w-xl text-[11.5px] leading-snug text-muted-foreground md:text-xs">
          Ton dashboard est vierge — c&apos;est normal. Suis ces 3 étapes pour commencer à monétiser
          avec l&apos;IA. Tu auras accès à tes vraies données dès que tu connectes tes comptes.
        </p>

        <ProgressBar percent={33} stepsDone={1} stepsTotal={3} />
      </div>
    </motion.section>
  );
}

function ProgressBar({ percent, stepsDone, stepsTotal }: { percent: number; stepsDone: number; stepsTotal: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setWidth(percent), 250);
    return () => clearTimeout(id);
  }, [percent]);
  return (
    <div className="mt-4 max-w-sm">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Setup · {stepsDone} / {stepsTotal} étapes</span>
        <span className="font-semibold text-foreground">{percent}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(120deg, #EC4899, #FF8A00, #1FBEAF)" }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Steps row — 3 cartes setup (Connect / Payment / Audit)
 * ────────────────────────────────────────────────────────────────── */

type Step = {
  index: number;
  done: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  accent: string;
};

const STEPS: ReadonlyArray<Step> = [
  {
    index: 1, done: false, icon: Plug,
    title: "Connecte tes comptes & pages",
    description: "TikTok, Facebook, YouTube, Instagram… ajoute les plateformes que tu monétises pour activer l'analyse IA.",
    cta: "Connecter mes comptes", accent: "#EC4899",
  },
  {
    index: 2, done: true, icon: CreditCard,
    title: "Configure tes moyens de paiement",
    description: "Stripe, PayPal, CinetPay, Flutterwave — ajoute ton mode de paiement pour activer ton plan et facturer tes clients.",
    cta: "Modifier", accent: "#FF8A00",
  },
  {
    index: 3, done: false, icon: Sparkles,
    title: "Lance ton premier audit IA",
    description: "60 secondes pour scanner ta page, détecter shadowban, score viral et plan de récupération personnalisé.",
    cta: "Lancer mon 1er audit", accent: "#1FBEAF",
  },
];

function StepsRow() {
  return (
    <section className="grid gap-3 md:grid-cols-3 md:gap-4">
      {STEPS.map((step, i) => (
        <StepCardMock key={step.index} step={step} delay={i * 0.08} />
      ))}
    </section>
  );
}

function StepCardMock({ step, delay }: { step: Step; delay: number }) {
  const { icon: Icon, title, description, cta, done, accent, index } = step;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col rounded-xl border bg-white/[0.03] p-3.5 transition-shadow hover:shadow-lg md:rounded-2xl md:p-5 ${
        done ? "border-emerald-500/40" : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg border md:h-11 md:w-11 md:rounded-xl"
          style={{
            backgroundColor: `${accent}1A`,
            borderColor: `${accent}55`,
            color: accent,
          }}
        >
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground md:text-[10px]">
            Étape {index}
          </span>
          {done && (
            <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Done
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-3 text-[13px] font-semibold tracking-tight md:mt-4 md:text-base">
        {title}
      </h3>
      <p className="mt-1 flex-1 text-[11px] leading-snug text-muted-foreground md:mt-1.5 md:text-sm">
        {description}
      </p>

      <div
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold transition-transform group-hover:translate-x-0.5 md:mt-4 md:text-sm md:gap-1.5"
        style={{ color: accent }}
      >
        {cta}
        <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Tools row — "Disponible dès maintenant" + 3 quick links
 * ────────────────────────────────────────────────────────────────── */

const TOOLS: ReadonlyArray<{ title: string; desc: string }> = [
  { title: "RPM Predictor",  desc: "Estime tes revenus par pays / plateforme / niche" },
  { title: "Trend Scanner",  desc: "Sons + hashtags trending en Afrique, mis à jour quotidiennement" },
  { title: "Viral Lab",      desc: "Génère des hooks viraux avec l'IA" },
];

function ToolsRow() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 md:rounded-2xl md:p-5"
    >
      <h3 className="font-display text-[13px] font-bold tracking-tight md:text-base">
        Disponible dès maintenant
      </h3>
      <p className="mt-0.5 text-[10.5px] text-muted-foreground md:text-xs">
        Pas besoin de connecter tes comptes pour tester ces outils.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 md:gap-2.5">
        {TOOLS.map((tool, i) => (
          <QuickLinkMock key={tool.title} title={tool.title} desc={tool.desc} delay={0.2 + i * 0.06} />
        ))}
      </div>
    </motion.section>
  );
}

function QuickLinkMock({ title, desc, delay }: { title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -1 }}
      className="group flex items-start gap-2.5 rounded-lg border border-white/10 bg-background/40 p-2.5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gradient-to-br from-[#EC4899]/20 to-[#FF8A00]/15 text-[#EC4899]">
        <Sparkles className="h-3 w-3" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-[11.5px] font-semibold md:text-xs">
          {title}
          <ArrowRight className="h-2.5 w-2.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
        <div className="mt-0.5 text-[10px] leading-snug text-muted-foreground md:text-[11px]">
          {desc}
        </div>
      </div>
    </motion.div>
  );
}
