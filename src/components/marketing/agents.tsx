"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  CheckCircle2,
  Coins,
  FileText,
  Flame,
  ImageIcon,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Agent = {
  icon: LucideIcon;
  name: string;
  short: string;
  desc: string;
  model: string;
  metric: { value: string; label: string };
  category: "analyse" | "creation" | "growth";
  tone: "violet" | "orange" | "rose" | "emerald" | "sky" | "amber" | "fuchsia";
};

const audit: Agent = {
  icon: Bot,
  name: "Audit Agent",
  short: "Audit",
  desc: "Analyse 40+ signaux de conformité Facebook & TikTok pour produire un score IA sur 100 et identifier précisément ce qui bloque ta monétisation.",
  model: "Claude Opus 4.7",
  metric: { value: "96%", label: "précision détection" },
  category: "analyse",
  tone: "violet",
};

const others: Agent[] = [
  {
    icon: Flame,
    name: "Viral Agent",
    short: "Viral",
    desc: "Détecte les patterns viraux par pays et niche, prédit les hooks gagnants.",
    model: "Claude Sonnet 4.6",
    metric: { value: "+340%", label: "vues moyennes" },
    category: "growth",
    tone: "orange",
  },
  {
    icon: Coins,
    name: "Monetization Agent",
    short: "Monetization",
    desc: "Optimise RPM, CPM et éligibilité aux programmes In-Stream Ads et Creator Rewards.",
    model: "Claude Opus 4.7",
    metric: { value: "×2.4", label: "RPM moyen" },
    category: "growth",
    tone: "emerald",
  },
  {
    icon: ShieldAlert,
    name: "Anti-Ban Agent",
    short: "Anti-Ban",
    desc: "Prédit et neutralise les risques de bannissement avant publication.",
    model: "Claude Sonnet 4.6",
    metric: { value: "24/7", label: "surveillance" },
    category: "analyse",
    tone: "rose",
  },
  {
    icon: TrendingUp,
    name: "Trend Agent",
    short: "Trend",
    desc: "Tendances africaines temps réel — sons, hashtags, formats par pays.",
    model: "Gemini 2.5 Flash",
    metric: { value: "9", label: "pays surveillés" },
    category: "analyse",
    tone: "sky",
  },
  {
    icon: ImageIcon,
    name: "Thumbnail Agent",
    short: "Thumbnail",
    desc: "Génère 6 miniatures optimisées CTR avec A/B testing intégré.",
    model: "GPT-Image-1",
    metric: { value: "+22%", label: "CTR moyen" },
    category: "creation",
    tone: "fuchsia",
  },
  {
    icon: FileText,
    name: "Script Agent",
    short: "Script",
    desc: "Hooks, scripts courts, CTA et légendes optimisées SEO multilingue.",
    model: "Claude Sonnet 4.6",
    metric: { value: "12s", label: "génération" },
    category: "creation",
    tone: "amber",
  },
];

const toneRing: Record<Agent["tone"], string> = {
  violet: "from-violet-500/30 to-violet-500/0 ring-violet-500/30",
  orange: "from-orange-500/30 to-orange-500/0 ring-orange-500/30",
  rose: "from-rose-500/30 to-rose-500/0 ring-rose-500/30",
  emerald: "from-emerald-500/30 to-emerald-500/0 ring-emerald-500/30",
  sky: "from-sky-500/30 to-sky-500/0 ring-sky-500/30",
  amber: "from-amber-500/30 to-amber-500/0 ring-amber-500/30",
  fuchsia: "from-fuchsia-500/30 to-fuchsia-500/0 ring-fuchsia-500/30",
};

const toneText: Record<Agent["tone"], string> = {
  violet: "text-violet-500 dark:text-violet-300",
  orange: "text-orange-500 dark:text-orange-300",
  rose: "text-rose-500 dark:text-rose-300",
  emerald: "text-emerald-500 dark:text-emerald-300",
  sky: "text-sky-500 dark:text-sky-300",
  amber: "text-amber-500 dark:text-amber-300",
  fuchsia: "text-fuchsia-500 dark:text-fuchsia-300",
};

const categoryLabel: Record<Agent["category"], string> = {
  analyse: "Analyse",
  creation: "Création",
  growth: "Croissance",
};

export function AgentsShowcase() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10 grid-bg opacity-40" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-500 dark:text-violet-200"
          >
            <Bot className="h-3 w-3" /> Multi-agents IA · orchestrés
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl"
          >
            7 cerveaux IA spécialisés.
            <br />
            Une seule mission : <span className="gradient-text">tes revenus</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-balance text-muted-foreground"
          >
            Powered by Claude Opus 4.7, GPT-5, Gemini 2.5 et ElevenLabs. Chaque agent est
            ultra spécialisé — l'orchestrateur les fait collaborer en arrière-plan.
          </motion.p>
        </div>

        {/* Layout bento : hero + 6 cartes */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-5 lg:grid-cols-3">
          {/* Audit Agent — carte hero (1 colonne, 2 rangées) */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-violet-500/[0.08] via-card to-card p-7 lg:row-span-2"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl opacity-60 transition-opacity group-hover:opacity-100" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between">
                <CategoryBadge category={audit.category} />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-500 dark:text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              </div>

              <div className="mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-500 to-orange-500 shadow-2xl shadow-violet-500/40 ring-4 ring-violet-500/20">
                <audit.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">
                {audit.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {audit.desc}
              </p>

              <div className="mt-auto pt-8">
                <div className="flex items-end justify-between gap-4 rounded-2xl border border-border bg-background/40 p-4 backdrop-blur">
                  <div>
                    <div className="font-display text-3xl font-bold leading-none">
                      {audit.metric.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {audit.metric.label}
                    </div>
                  </div>
                  <ModelChip model={audit.model} />
                </div>

                {/* Mini-viz : barres de signal */}
                <div className="mt-4 flex h-12 items-end gap-1">
                  {[34, 48, 62, 56, 70, 84, 78, 92, 88, 95, 90, 96].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-500/30 to-violet-500"
                      style={{ height: `${v}%` }}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                  <span>40 signaux analysés</span>
                  <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3" /> confiance 96%
                  </span>
                </div>
              </div>
            </div>
          </motion.article>

          {/* 6 cartes secondaires en grille 2×3 sur les 2 colonnes restantes */}
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            {others.map((a, i) => (
              <AgentCard key={a.name} agent={a} index={i} />
            ))}
          </div>
        </div>

        {/* Footer info : orchestration */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-2xl border border-border bg-card/40 px-6 py-4 backdrop-blur"
        >
          <span className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-violet-500" />
            <b>Orchestration</b> via Claude Agent SDK
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-amber-500" /> Prompt caching activé · –90% coûts
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Outputs structurés JSON
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card/70 hover:shadow-xl",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
          toneRing[agent.tone],
        )}
      />

      <div className="relative flex items-center justify-between">
        <CategoryBadge category={agent.category} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {agent.short}
        </span>
      </div>

      <div className="relative mt-4 flex items-start gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ring-1",
            "border-border",
            toneRing[agent.tone],
          )}
        >
          <agent.icon className={cn("h-5 w-5", toneText[agent.tone])} />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold leading-tight">{agent.name}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{agent.desc}</p>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div>
          <div className={cn("font-display text-xl font-bold leading-none", toneText[agent.tone])}>
            {agent.metric.value}
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {agent.metric.label}
          </div>
        </div>
        <ModelChip model={agent.model} compact />
      </div>
    </motion.article>
  );
}

function CategoryBadge({ category }: { category: Agent["category"] }) {
  const cls =
    category === "analyse"
      ? "border-sky-500/30 bg-sky-500/10 text-sky-500 dark:text-sky-300"
      : category === "creation"
        ? "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-500 dark:text-fuchsia-300"
        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-300";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        cls,
      )}
    >
      {categoryLabel[category]}
    </span>
  );
}

function ModelChip({ model, compact = false }: { model: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2 py-1 backdrop-blur",
        compact ? "text-[10px]" : "text-xs",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-500 to-orange-500" />
      <span className="font-mono font-medium text-foreground/80">{model}</span>
    </div>
  );
}
