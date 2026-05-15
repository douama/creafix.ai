"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Eye,
  Flame,
  ShieldOff,
  Music2,
  Clock,
  DollarSign,
  ArrowRight,
} from "lucide-react";

const SCORE_BLOCKS = [
  { label: "Score viral", value: 64, color: "#FF8A00", trend: "+12" },
  { label: "Score RPM", value: 38, color: "#F43F5E", trend: "-18" },
  { label: "Risque shadowban", value: 71, color: "#F43F5E", trend: "+9", invert: true },
  { label: "Engagement", value: 82, color: "#10B981", trend: "+24" },
];

const ISSUES = [
  { icon: Music2, label: "Musique sous copyright", count: 3, severity: "critical" as const },
  { icon: Clock, label: "Watch time sous le seuil", count: 7, severity: "warning" as const },
  { icon: ShieldOff, label: "Portée -68% vs ref. 30j", count: 1, severity: "critical" as const },
  { icon: Eye, label: "Hooks faibles détectés", count: 5, severity: "warning" as const },
  { icon: Flame, label: "Opportunités virales", count: 4, severity: "success" as const },
];

const RECOMMENDATIONS = [
  "Remplace l'audio des 3 vidéos en copyright par des sons trending Sénégal 🇸🇳",
  "Ajoute un hook de 3s sur les vidéos > 15s pour passer le watch time à 52%",
  "Active Reels Play Bonus avant le 25 mai (fenêtre éligibilité)",
  "Republie les 4 contenus à fort potentiel viral à 20h–22h GMT",
];

export function SampleAudit() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-30 blur-3xl" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00C2FF]"
          >
            <Sparkles className="h-3 w-3" /> Audit type
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Voilà ce que tu reçois{" "}
            <span className="gradient-text">en 60 secondes</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            Audit réel généré pour @fatou_tv · TikTok · Dakar 🇸🇳 · 184K abonnés.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="relative mt-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/60 via-card/40 to-card/40 backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[800px] -translate-x-1/2 rounded-full bg-[#7B61FF]/15 blur-3xl" />

          {/* Header bar */}
          <div className="relative flex items-center justify-between border-b border-border/60 bg-background/40 px-5 py-4 md:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-sm font-bold text-white shadow-lg shadow-[#7B61FF]/30">
                FT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-bold md:text-base">@fatou_tv</h3>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  TikTok · 184K abonnés · Dakar 🇸🇳 · audit du 15 mai 2026
                </p>
              </div>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score global</div>
              <div className="mt-0.5 font-display text-2xl font-bold">
                <span className="gradient-text">61</span>
                <span className="text-muted-foreground/60">/100</span>
              </div>
            </div>
          </div>

          {/* Body : 3 columns */}
          <div className="relative grid gap-5 p-5 md:p-7 lg:grid-cols-[1.1fr_1fr_1fr]">
            {/* Col 1: Scores */}
            <div className="space-y-3">
              <SectionTitle>Scores clés</SectionTitle>
              <div className="grid grid-cols-2 gap-2.5">
                {SCORE_BLOCKS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border bg-background/40 p-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span className="truncate">{s.label}</span>
                      <TrendBadge value={s.trend} invert={s.invert} />
                    </div>
                    <div className="mt-1 font-display text-2xl font-bold" style={{ color: s.color }}>
                      {s.value}
                      <span className="text-xs text-muted-foreground/60">/100</span>
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue projection */}
              <div className="mt-3 rounded-xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/[0.08] to-transparent p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <DollarSign className="h-3 w-3 text-[#7B61FF]" />
                  Revenus estimés (30 j)
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold">$240</span>
                  <span className="text-xs text-muted-foreground">actuels</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2 text-emerald-500 dark:text-emerald-300">
                  <ArrowRight className="h-3 w-3" />
                  <span className="font-display text-2xl font-bold">$840</span>
                  <span className="text-xs">après corrections IA</span>
                </div>
              </div>
            </div>

            {/* Col 2: Issues */}
            <div className="space-y-3">
              <SectionTitle>Problèmes détectés</SectionTitle>
              <ul className="space-y-2">
                {ISSUES.map((iss) => {
                  const Icon = iss.icon;
                  const styles = {
                    critical: {
                      iconColor: "#F43F5E",
                      bg: "bg-rose-500/10",
                      border: "border-rose-500/30",
                    },
                    warning: {
                      iconColor: "#FF8A00",
                      bg: "bg-amber-500/10",
                      border: "border-amber-500/30",
                    },
                    success: {
                      iconColor: "#10B981",
                      bg: "bg-emerald-500/10",
                      border: "border-emerald-500/30",
                    },
                  }[iss.severity];

                  return (
                    <li
                      key={iss.label}
                      className={`flex items-center gap-3 rounded-xl border bg-background/40 p-2.5 ${styles.border}`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.bg}`}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: styles.iconColor }} />
                      </div>
                      <div className="min-w-0 flex-1 text-xs">{iss.label}</div>
                      <span
                        className="inline-flex shrink-0 items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: `${styles.iconColor}1A`,
                          color: styles.iconColor,
                        }}
                      >
                        ×{iss.count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Col 3: Recommendations */}
            <div className="space-y-3">
              <SectionTitle>Recommandations IA</SectionTitle>
              <ol className="space-y-2">
                {RECOMMENDATIONS.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border border-border bg-background/40 p-3 text-xs"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{rec}</span>
                  </li>
                ))}
              </ol>

              <a
                href="/signup"
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#7B61FF]/50 bg-gradient-to-r from-[#7B61FF]/15 to-[#00C2FF]/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:from-[#7B61FF]/25 hover:to-[#00C2FF]/25"
              >
                Lancer mon audit personnalisé
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:text-[11px]">
      {children}
    </div>
  );
}

function TrendBadge({ value, invert }: { value: string; invert?: boolean }) {
  const isPositive = value.startsWith("+");
  const good = invert ? !isPositive : isPositive;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1 py-0 text-[9px] font-bold ${
        good
          ? "text-emerald-500 dark:text-emerald-300"
          : "text-rose-500 dark:text-rose-300"
      }`}
    >
      {good ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
      {value}
    </span>
  );
}
