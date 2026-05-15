"use client";

import { motion } from "framer-motion";
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

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tone: Tone;
  metric?: string;
  metricLabel?: string;
  span?: "default" | "wide";
  visual?: "signal" | "map" | "none";
};

const features: Feature[] = [
  {
    icon: Brain,
    title: "Audit IA Facebook & TikTok",
    desc:
      "Analyse profonde de chaque page — 40+ signaux : conformité, watch time, CTR, rétention, copyright.",
    tone: "violet",
    metric: "40+",
    metricLabel: "signaux analysés",
    span: "wide",
    visual: "signal",
  },
  {
    icon: ShieldAlert,
    title: "IA Anti-Ban",
    desc: "Prédit les risques de bannissement et démonétisation avant publication.",
    tone: "rose",
    metric: "24/7",
    metricLabel: "surveillance",
  },
  {
    icon: TrendingUp,
    title: "Score monétisation IA",
    desc: "Un score sur 100. Compare-toi aux meilleurs créateurs de ton pays.",
    tone: "emerald",
    metric: "96%",
    metricLabel: "précision",
  },
  {
    icon: Sparkles,
    title: "Idées virales Afrique",
    desc: "Hooks, scripts, légendes adaptés à ton pays et ta niche.",
    tone: "amber",
    metric: "+340%",
    metricLabel: "vues moyennes",
  },
  {
    icon: PlayCircle,
    title: "Générateur de contenu",
    desc: "Images, voix-off, sous-titres et miniatures générés en quelques secondes.",
    tone: "sky",
    metric: "<5s",
    metricLabel: "génération",
  },
  {
    icon: Coins,
    title: "Estimation revenus FCFA",
    desc:
      "CPM/RPM réels par pays : Sénégal, CI, Cameroun, Mali, Nigeria, Ghana, Maroc, RDC, RSA.",
    tone: "orange",
    metric: "9",
    metricLabel: "pays africains",
    span: "wide",
    visual: "map",
  },
  {
    icon: Building2,
    title: "Mode Agence",
    desc: "Multi-clients, marque blanche, rapports PDF personnalisés, branding agence.",
    tone: "fuchsia",
    metric: "∞",
    metricLabel: "clients gérés",
  },
  {
    icon: FileBarChart2,
    title: "Rapports IA premium",
    desc: "Roadmap croissance, checklist éligibilité, graphiques exportables.",
    tone: "indigo",
    metric: "PDF",
    metricLabel: "exportable",
  },
  {
    icon: Smartphone,
    title: "Optimisé mobile & low data",
    desc: "Pensé pour les créateurs mobiles et les connexions faibles.",
    tone: "teal",
    metric: "App",
    metricLabel: "Flutter à venir",
  },
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
  return (
    <section id="features" className="relative py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground"
          >
            <Globe className="h-3 w-3" /> Pensé pour l'Afrique
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Tout ce qu'il te faut pour{" "}
            <span className="gradient-text">débloquer ta monétisation</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            9 outils conçus avec et pour les créateurs africains — réunis dans une seule
            plateforme.
          </motion.p>
        </div>

        {/* Grille bento : 6 colonnes. Wide = col-span-4, normal = col-span-2 */}
        <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const t = toneClasses[feature.tone];
  const isWide = feature.span === "wide";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-card/70 hover:shadow-xl",
        isWide ? "sm:col-span-2 lg:col-span-4" : "lg:col-span-2",
      )}
    >
      {/* Glow tonal */}
      <div
        className={cn(
          "pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-gradient-to-br opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-80",
          t.gradient,
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
              t.iconBg,
              "ring-2 ring-offset-2 ring-offset-background",
              t.ring,
            )}
          >
            <feature.icon className="h-5 w-5 text-white" />
          </div>
          {feature.metric && (
            <div className="text-right">
              <div className={cn("font-display text-lg font-bold leading-none", t.text)}>
                {feature.metric}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {feature.metricLabel}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="font-display text-base font-semibold leading-snug md:text-lg">
            {feature.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
        </div>

        {/* Visual mini pour cartes wide */}
        {isWide && feature.visual === "signal" && (
          <div className="mt-auto pt-4">
            <div className="flex h-9 items-end gap-1">
              {[34, 48, 62, 56, 70, 84, 78, 92, 88, 95, 90, 96, 88, 92, 80, 94, 72, 88].map(
                (v, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-sm bg-gradient-to-t opacity-80 transition-opacity group-hover:opacity-100",
                      t.signalFrom,
                      t.signalTo,
                    )}
                    style={{ height: `${v}%` }}
                  />
                ),
              )}
            </div>
          </div>
        )}

        {isWide && feature.visual === "map" && (
          <div className="mt-auto pt-4">
            <div className="flex flex-wrap gap-1.5">
              {["🇸🇳", "🇨🇮", "🇨🇲", "🇲🇱", "🇳🇬", "🇬🇭", "🇿🇦", "🇲🇦", "🇨🇩"].map((flag, i) => (
                <span
                  key={i}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-base transition-transform hover:scale-110"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          <span>En savoir plus</span>
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.div>
  );
}
