"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  Brain,
  Building2,
  Coins,
  FileBarChart2,
  Globe,
  PlayCircle,
  ShieldAlert,
  Smartphone,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "violet"
  | "rose"
  | "emerald"
  | "amber"
  | "sky"
  | "orange"
  | "fuchsia"
  | "indigo"
  | "teal";

type FeatureKey =
  | "audit" | "antiban" | "score" | "ideas" | "generator"
  | "estimate" | "agency" | "reports" | "mobile";

const featureSchema: { key: FeatureKey; icon: LucideIcon; tone: Tone }[] = [
  { key: "audit",     icon: Brain,         tone: "violet" },
  { key: "antiban",   icon: ShieldAlert,   tone: "rose" },
  { key: "score",     icon: TrendingUp,    tone: "emerald" },
  { key: "ideas",     icon: Sparkles,      tone: "amber" },
  { key: "generator", icon: PlayCircle,    tone: "sky" },
  { key: "estimate",  icon: Coins,         tone: "orange" },
  { key: "agency",    icon: Building2,     tone: "fuchsia" },
  { key: "reports",   icon: FileBarChart2, tone: "indigo" },
  { key: "mobile",    icon: Smartphone,    tone: "teal" },
];

const toneClasses: Record<
  Tone,
  { text: string; ring: string; gradient: string; iconBg: string; signalFrom: string; signalTo: string }
> = {
  violet: {
    text: "text-violet-500 dark:text-violet-300",
    ring: "ring-violet-500/30",
    gradient: "from-violet-500/25 to-violet-500/0",
    iconBg: "from-violet-500 to-violet-700",
    signalFrom: "from-violet-500/30",
    signalTo: "to-violet-500",
  },
  rose: {
    text: "text-rose-500 dark:text-rose-300",
    ring: "ring-rose-500/30",
    gradient: "from-rose-500/25 to-rose-500/0",
    iconBg: "from-rose-500 to-rose-700",
    signalFrom: "from-rose-500/30",
    signalTo: "to-rose-500",
  },
  emerald: {
    text: "text-emerald-500 dark:text-emerald-300",
    ring: "ring-emerald-500/30",
    gradient: "from-emerald-500/25 to-emerald-500/0",
    iconBg: "from-emerald-500 to-emerald-700",
    signalFrom: "from-emerald-500/30",
    signalTo: "to-emerald-500",
  },
  amber: {
    text: "text-amber-500 dark:text-amber-300",
    ring: "ring-amber-500/30",
    gradient: "from-amber-500/25 to-amber-500/0",
    iconBg: "from-amber-500 to-orange-600",
    signalFrom: "from-amber-500/30",
    signalTo: "to-amber-500",
  },
  sky: {
    text: "text-sky-500 dark:text-sky-300",
    ring: "ring-sky-500/30",
    gradient: "from-sky-500/25 to-sky-500/0",
    iconBg: "from-sky-500 to-blue-600",
    signalFrom: "from-sky-500/30",
    signalTo: "to-sky-500",
  },
  orange: {
    text: "text-orange-500 dark:text-orange-300",
    ring: "ring-orange-500/30",
    gradient: "from-orange-500/25 to-orange-500/0",
    iconBg: "from-orange-500 to-rose-500",
    signalFrom: "from-orange-500/30",
    signalTo: "to-orange-500",
  },
  fuchsia: {
    text: "text-fuchsia-500 dark:text-fuchsia-300",
    ring: "ring-fuchsia-500/30",
    gradient: "from-fuchsia-500/25 to-fuchsia-500/0",
    iconBg: "from-fuchsia-500 to-purple-600",
    signalFrom: "from-fuchsia-500/30",
    signalTo: "to-fuchsia-500",
  },
  indigo: {
    text: "text-indigo-500 dark:text-indigo-300",
    ring: "ring-indigo-500/30",
    gradient: "from-indigo-500/25 to-indigo-500/0",
    iconBg: "from-indigo-500 to-blue-700",
    signalFrom: "from-indigo-500/30",
    signalTo: "to-indigo-500",
  },
  teal: {
    text: "text-teal-500 dark:text-teal-300",
    ring: "ring-teal-500/30",
    gradient: "from-teal-500/25 to-teal-500/0",
    iconBg: "from-teal-500 to-emerald-600",
    signalFrom: "from-teal-500/30",
    signalTo: "to-teal-500",
  },
};

export function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="relative py-10 md:py-14">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground"
          >
            <Globe className="h-3 w-3" /> {t("eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            {t("titlePart1")}{" "}
            <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart2")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Grille 3 colonnes égales — 9 features = 3 × 3 parfait */}
        <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureSchema.map((f, i) => (
            <FeatureCard key={f.key} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: { key: FeatureKey; icon: LucideIcon; tone: Tone };
  index: number;
}) {
  const t = useTranslations("features");
  const tc = useTranslations("common");
  const tone = toneClasses[feature.tone];
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-card/70 hover:shadow-xl",
      )}
    >
      {/* Glow tonal */}
      <div
        className={cn(
          "pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-gradient-to-br opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-80",
          tone.gradient,
        )}
      />

      {/* Numéro fantôme */}
      <span className="pointer-events-none absolute right-4 top-3 font-display text-5xl font-bold leading-none opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.10]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform group-hover:scale-105",
              tone.iconBg,
              "ring-2 ring-offset-2 ring-offset-background",
              tone.ring,
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="text-right">
            <div className={cn("font-display text-lg font-bold leading-none", tone.text)}>
              {t(`${feature.key}.metric`)}
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {t(`${feature.key}.metricLabel`)}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-display text-base font-semibold leading-snug md:text-lg">
            {t(`${feature.key}.title`)}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {t(`${feature.key}.desc`)}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          <span>{tc("learnMore")}</span>
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.div>
  );
}
