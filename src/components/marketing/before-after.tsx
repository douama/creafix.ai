"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

const RESULTS = [
  {
    metric: "Watch time",
    before: "18%",
    after: "52%",
    delta: "+189%",
    color: "#7B61FF",
  },
  {
    metric: "RPM moyen",
    before: "$0.40",
    after: "$2.10",
    delta: "+425%",
    color: "#10B981",
  },
  {
    metric: "Reach (30j)",
    before: "3K",
    after: "180K",
    delta: "+59×",
    color: "#FF8A00",
  },
  {
    metric: "Revenus / mois",
    before: "$120",
    after: "$2 480",
    delta: "+1 967%",
    color: "#00C2FF",
  },
];

export function BeforeAfter() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-300"
          >
            <TrendingUp className="h-3 w-3" /> Résultats réels
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Avant Monetiq AI{" "}
            <span className="gradient-text">vs Après</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            Résultats moyens sur 90 jours pour les créateurs ayant appliqué les
            recommandations IA. Cas réel : @creator_dakar · TikTok · Sénégal.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl"
        >
          <div className="grid grid-cols-[1.2fr_1fr_1fr_0.9fr] items-center gap-3 border-b border-border bg-background/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:px-6 md:text-[11px]">
            <div>Métrique</div>
            <div className="text-center">Avant</div>
            <div className="text-center">Après</div>
            <div className="text-right">Δ</div>
          </div>

          {RESULTS.map((r, i) => (
            <motion.div
              key={r.metric}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="grid grid-cols-[1.2fr_1fr_1fr_0.9fr] items-center gap-3 border-b border-border/50 px-4 py-4 last:border-0 md:px-6"
            >
              <div className="font-display text-sm font-semibold md:text-base">
                {r.metric}
              </div>
              <div className="flex items-center justify-center gap-2 text-center">
                <span className="font-display text-base font-bold text-rose-500/80 line-through decoration-rose-500/40 md:text-lg">
                  {r.before}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <ArrowRight className="hidden h-3.5 w-3.5 text-muted-foreground md:inline" />
                <span
                  className="font-display text-base font-bold md:text-lg"
                  style={{ color: r.color }}
                >
                  {r.after}
                </span>
              </div>
              <div className="text-right">
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold md:text-xs"
                  style={{
                    backgroundColor: `${r.color}1A`,
                    borderColor: `${r.color}66`,
                    color: r.color,
                  }}
                >
                  <TrendingUp className="h-3 w-3" />
                  {r.delta}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          * Résultats individuels variables. Échantillon : 240 créateurs ayant
          complété ≥80% des recommandations IA sur 90 jours.
        </p>
      </div>
    </section>
  );
}
