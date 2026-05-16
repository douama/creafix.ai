"use client";

import { motion } from "framer-motion";
import { Check, X, Trophy } from "lucide-react";

type Cell = boolean | "partial";

const FEATURES: { label: string; us: Cell; tt: Cell; meta: Cell; yt: Cell }[] = [
  { label: "Audit IA monétisation", us: true, tt: false, meta: false, yt: false },
  { label: "Détection shadowban", us: true, tt: false, meta: false, yt: false },
  { label: "Prédiction RPM par pays", us: true, tt: false, meta: false, yt: "partial" },
  { label: "Données Afrique localisées", us: true, tt: false, meta: false, yt: false },
  { label: "Multi-plateformes (9)", us: true, tt: false, meta: false, yt: false },
  { label: "Score viral pré-publication", us: true, tt: false, meta: false, yt: false },
  { label: "Recommandations IA actionnables", us: true, tt: "partial", meta: "partial", yt: "partial" },
  { label: "Mobile Money support", us: true, tt: false, meta: false, yt: false },
];

const COLS = [
  { key: "us" as const, name: "CreaFix AI", highlight: true },
  { key: "tt" as const, name: "TikTok Studio", highlight: false },
  { key: "meta" as const, name: "Meta CS", highlight: false },
  { key: "yt" as const, name: "YouTube Studio", highlight: false },
];

export function Comparison() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#EC4899]"
          >
            <Trophy className="h-3 w-3" /> Comparatif
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Pourquoi CreaFix AI{" "}
            <span className="gradient-text">change la donne</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            Les outils natifs te montrent ce que tu fais. CreaFix AI te dit ce
            qu&apos;il faut faire — et combien tu vas gagner.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] items-center gap-2 border-b border-border bg-background/40 px-3 py-3 md:px-5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:text-[11px]">
              Fonctionnalité
            </div>
            {COLS.map((col) => (
              <div
                key={col.key}
                className={`text-center text-[10px] font-bold uppercase tracking-wider md:text-xs ${
                  col.highlight
                    ? "text-[#EC4899]"
                    : "text-muted-foreground"
                }`}
              >
                {col.name}
              </div>
            ))}
          </div>

          {FEATURES.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] items-center gap-2 border-b border-border/50 px-3 py-3 last:border-0 md:px-5"
            >
              <div className="text-xs font-medium md:text-sm">{row.label}</div>
              {COLS.map((col) => (
                <div key={col.key} className="flex justify-center">
                  <CellMark
                    value={row[col.key]}
                    highlight={col.highlight}
                  />
                </div>
              ))}
            </div>
          ))}
        </motion.div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Sources : docs officielles TikTok Studio, Meta Creator Studio,
          YouTube Studio. À jour mai 2026.
        </p>
      </div>
    </section>
  );
}

function CellMark({ value, highlight }: { value: Cell; highlight: boolean }) {
  if (value === true) {
    return (
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
          highlight
            ? "bg-emerald-500/15 ring-1 ring-emerald-500/40"
            : "bg-emerald-500/10"
        }`}
      >
        <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted/20">
      <X className="h-3.5 w-3.5 text-muted-foreground/60" />
    </span>
  );
}
