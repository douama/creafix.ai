"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Plug,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ConnectAccountsModal } from "./connect-accounts-modal";

type Step = {
  id: string;
  done: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href?: string;
  onClick?: () => void;
  accent: string;
};

type EmptyOnboardingProps = {
  fullName: string | null;
  socialConnected: boolean;
  paymentConfigured: boolean;
  firstAuditDone: boolean;
};

export function EmptyOnboarding({
  fullName,
  socialConnected,
  paymentConfigured,
  firstAuditDone,
}: EmptyOnboardingProps) {
  const [connectOpen, setConnectOpen] = useState(false);

  const steps: Step[] = [
    {
      id: "connect",
      done: socialConnected,
      icon: Plug,
      title: "Connecte tes comptes & pages",
      description:
        "TikTok, Facebook, YouTube, Instagram… ajoute les plateformes que tu monétises pour activer l'analyse IA.",
      cta: socialConnected ? "Gérer mes comptes" : "Connecter mes comptes",
      onClick: () => setConnectOpen(true),
      accent: "#EC4899",
    },
    {
      id: "payment",
      done: paymentConfigured,
      icon: CreditCard,
      title: "Configure tes moyens de paiement",
      description:
        "Stripe, PayPal, CinetPay, Flutterwave — ajoute ton mode de paiement pour activer ton plan et facturer tes clients.",
      cta: paymentConfigured ? "Modifier" : "Configurer maintenant",
      href: "/dashboard/billing",
      accent: "#FF8A00",
    },
    {
      id: "audit",
      done: firstAuditDone,
      icon: Sparkles,
      title: "Lance ton premier audit IA",
      description:
        "60 secondes pour scanner ta page, détecter shadowban, score viral et plan de récupération personnalisé.",
      cta: firstAuditDone ? "Voir mes audits" : "Lancer mon 1er audit",
      href: firstAuditDone ? "/dashboard/audits" : "/dashboard/audits/new",
      accent: "#1FBEAF",
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const progress = Math.round((completed / steps.length) * 100);

  return (
    <div className="space-y-6">
      <ConnectAccountsModal open={connectOpen} onOpenChange={setConnectOpen} />

      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#EC4899]/[0.06] via-card to-card p-6 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#EC4899]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FF8A00]/12 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EC4899]">
            <Sparkles className="h-3 w-3" />
            Bienvenue sur CreaFix AI
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {fullName ? `Bienvenue ${fullName.split(" ")[0]} 👋` : "Bienvenue 👋"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Ton dashboard est vierge — c&apos;est normal. Suis ces 3 étapes pour commencer à monétiser
            avec l&apos;IA. Tu auras accès à tes vraies données dès que tu connectes tes comptes.
          </p>

          {/* Progress bar */}
          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Setup · {completed} / {steps.length} étapes</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-card/60">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(120deg, #EC4899, #FF8A00, #1FBEAF)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 setup steps */}
      <section className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <StepCard key={step.id} step={step} index={i + 1} />
        ))}
      </section>

      {/* What's available right now */}
      <section className="rounded-2xl border border-border bg-card/40 p-5 md:p-6">
        <h2 className="font-display text-lg font-bold tracking-tight">
          Disponible dès maintenant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pas besoin de connecter tes comptes pour tester ces outils.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink href="/dashboard/revenue" title="RPM Predictor" desc="Estime tes revenus par pays / plateforme / niche" />
          <QuickLink href="/dashboard/trends" title="Trend Scanner" desc="Sons + hashtags trending en Afrique en temps réel" />
          <QuickLink href="/dashboard/generator" title="Viral Lab" desc="Génère des hooks viraux avec l'IA" />
        </div>
      </section>
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const { icon: Icon, title, description, cta, href, onClick, done, accent } = step;

  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border"
          style={{
            backgroundColor: `${accent}1A`,
            borderColor: `${accent}55`,
            color: accent,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Étape {index}
          </span>
          {done && (
            <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Done
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{description}</p>

      <div
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
        style={{ color: accent }}
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </>
  );

  const cardClass = `group relative flex flex-col rounded-2xl border bg-card/40 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
    done ? "border-emerald-500/40" : "border-border hover:border-foreground/20"
  }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={`${cardClass} text-left w-full`}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href!} className={cardClass}>
      {inner}
    </Link>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-border bg-background/40 p-3 transition-colors hover:border-foreground/20 hover:bg-card/60"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#EC4899]/15 to-[#FF8A00]/15 text-[#EC4899]">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          {title}
          <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{desc}</div>
      </div>
    </Link>
  );
}
