"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  Flame,
  Globe2,
  Sparkles,
  TrendingUp,
  Wand2,
  ShieldOff,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WowFeature = {
  icon: LucideIcon;
  badge: string;
  title: string;
  desc: string;
  bullets: string[];
  metric: { value: string; label: string };
  tone: "violet" | "electric" | "orange" | "rose" | "emerald";
  span?: "wide" | "default";
  visual?: "signal" | "globe" | "score" | "repair";
};

const wowFeatures: WowFeature[] = [
  {
    icon: ShieldOff,
    badge: "Exclusif",
    title: "Shadowban Detector",
    desc:
      "Détection automatique des baisses anormales de reach, contenus bloqués, et signaux faibles côté TikTok et Facebook avant que tu ne réalises le problème.",
    bullets: [
      "Détecte 12 signatures de shadowban distinctes",
      "Compare ton reach à ta baseline 30 jours",
      "Alerte WhatsApp + email en moins de 2 h",
    ],
    metric: { value: "12 signaux", label: "détectés" },
    tone: "rose",
    span: "wide",
    visual: "signal",
  },
  {
    icon: Flame,
    badge: "Avant publication",
    title: "Viral Score AI",
    desc:
      "Un score de viralité de 0 à 100 calculé avant même de poster ta vidéo — pour ne plus jamais perdre une journée sur un flop.",
    bullets: [
      "Analyse hook, thumbnail, durée, hashtags",
      "Benchmark sur 10M+ vidéos historiques",
      "Recommandations actionnables en 1 clic",
    ],
    metric: { value: "0-100", label: "score viral" },
    tone: "orange",
    visual: "score",
  },
  {
    icon: TrendingUp,
    badge: "Prédictif",
    title: "RPM Predictor",
    desc:
      "Prédis exactement combien chaque vidéo va générer, par pays, avant de la publier. Optimise tes thumbnails et titres pour le RPM, pas juste les vues.",
    bullets: [
      "Modèle entraîné sur les CPM réels par pays",
      "Comparaison side-by-side Facebook vs TikTok",
      "Simulateur What-If : niche, pays, audience",
    ],
    metric: { value: "±15%", label: "marge d'erreur" },
    tone: "emerald",
    visual: "score",
  },
  {
    icon: Globe2,
    badge: "Made in Africa",
    title: "African Trend Engine",
    desc:
      "Le seul moteur de tendances réellement entraîné sur les contenus africains. Hashtags, sons et formats — par pays, en temps réel.",
    bullets: [
      "Refresh toutes les 15 minutes",
      "9 pays : SN, CI, CM, ML, NG, GH, ZA, MA, CD",
      "Détection des trends naissantes",
    ],
    metric: { value: "9 pays", label: "couverts" },
    tone: "electric",
    visual: "globe",
  },
  {
    icon: Wand2,
    badge: "Auto-fix",
    title: "AI Content Repair",
    desc:
      "L'IA corrige automatiquement tes hooks faibles, ta mauvaise rétention, tes CTA mous et tes sous-titres mal calés — en un seul clic.",
    bullets: [
      "Re-génère un hook plus accrocheur",
      "Réécrit le script pour la rétention",
      "Régénère des sous-titres précis & burned-in",
    ],
    metric: { value: "1 clic", label: "réparation auto" },
    tone: "violet",
    visual: "repair",
  },
];

const toneClasses: Record<
  WowFeature["tone"],
  { gradient: string; icon: string; text: string; ring: string }
> = {
  violet: {
    gradient: "from-[#7B61FF]/30 to-[#7B61FF]/0",
    icon: "from-[#7B61FF] to-[#5a3dff]",
    text: "text-[#7B61FF]",
    ring: "ring-[#7B61FF]/30",
  },
  electric: {
    gradient: "from-[#00C2FF]/30 to-[#00C2FF]/0",
    icon: "from-[#00C2FF] to-[#0099cc]",
    text: "text-[#00C2FF]",
    ring: "ring-[#00C2FF]/30",
  },
  orange: {
    gradient: "from-[#FF8A00]/30 to-[#FF8A00]/0",
    icon: "from-[#FF8A00] to-[#d97400]",
    text: "text-[#FF8A00]",
    ring: "ring-[#FF8A00]/30",
  },
  rose: {
    gradient: "from-rose-500/30 to-rose-500/0",
    icon: "from-rose-500 to-rose-700",
    text: "text-rose-500 dark:text-rose-300",
    ring: "ring-rose-500/30",
  },
  emerald: {
    gradient: "from-emerald-500/30 to-emerald-500/0",
    icon: "from-emerald-500 to-emerald-700",
    text: "text-emerald-500 dark:text-emerald-300",
    ring: "ring-emerald-500/30",
  },
};

export function WowFeatures() {
  return (
    <section id="wow" className="relative py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF8A00]"
          >
            <Sparkles className="h-3 w-3" /> 5 features qui changent la donne
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Pendant que tes concurrents <span className="gradient-text">postent à l'aveugle</span>, toi tu sais.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            5 outils IA inédits, conçus pour anticiper, corriger et amplifier — pas juste mesurer.
          </motion.p>
        </div>

        <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {wowFeatures.map((f, i) => (
            <WowCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WowCard({ feature, index }: { feature: WowFeature; index: number }) {
  const t = toneClasses[feature.tone];
  const isWide = feature.span === "wide";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur transition-all duration-300",
        "hover:-translate-y-1 hover:border-foreground/20 hover:bg-card/70 hover:shadow-2xl",
        isWide ? "sm:col-span-2 lg:col-span-4" : "sm:col-span-1 lg:col-span-2",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-90",
          t.gradient,
        )}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              t.text,
              "border-current/30 bg-current/10",
            )}
            style={{
              borderColor: "currentColor",
              borderWidth: "1px",
              opacity: 0.9,
            }}
          >
            <span style={{ opacity: 1, color: "currentColor" }}>{feature.badge}</span>
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ring-2 ring-offset-2 ring-offset-background transition-transform group-hover:scale-110"
            style={{
              backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
            }}
          >
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", t.icon, t.ring)}>
              <feature.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <h3 className="mt-5 font-display text-xl font-bold leading-tight md:text-2xl">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>

        <ul className="mt-4 space-y-1.5">
          {feature.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className={cn("mt-1 h-1 w-1 shrink-0 rounded-full", t.text)} style={{ backgroundColor: "currentColor" }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Visuel propre à chaque carte wide */}
        {isWide && feature.visual === "signal" && (
          <div className="mt-auto pt-5">
            <div className="flex h-10 items-end gap-1">
              {[88, 92, 85, 90, 78, 65, 48, 32, 22, 18, 14, 12, 16, 24, 38].map((v, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm bg-gradient-to-t",
                    i < 6
                      ? "from-emerald-500/30 to-emerald-500"
                      : "from-rose-500/30 to-rose-500",
                  )}
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span className="text-emerald-500">Reach normal</span>
              <span className="text-rose-500">↓ Anomalie détectée</span>
            </div>
          </div>
        )}

        {feature.visual === "globe" && (
          <div className="mt-auto pt-4">
            <div className="flex flex-wrap gap-1">
              {["🇸🇳", "🇨🇮", "🇨🇲", "🇲🇱", "🇳🇬", "🇬🇭", "🇿🇦", "🇲🇦", "🇨🇩"].map((flag) => (
                <span
                  key={flag}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-card/60 text-[11px] transition-transform hover:scale-110"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <div className={cn("font-display text-xl font-bold leading-none", t.text)}>
              {feature.metric.value}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {feature.metric.label}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <Eye className="h-3 w-3" /> En savoir plus
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
