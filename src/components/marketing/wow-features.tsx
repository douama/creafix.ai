"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
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

type WowKey = "shadowban" | "viral" | "rpm" | "trend" | "repair";

type WowSchema = {
  key: WowKey;
  icon: LucideIcon;
  tone: "violet" | "electric" | "orange" | "rose" | "emerald";
  span?: "wide" | "default";
  visual?: "signal" | "globe";
};

const wowSchema: WowSchema[] = [
  { key: "shadowban", icon: ShieldOff,   tone: "rose",     span: "wide", visual: "signal" },
  { key: "viral",     icon: Flame,       tone: "orange" },
  { key: "rpm",       icon: TrendingUp,  tone: "emerald" },
  { key: "trend",     icon: Globe2,      tone: "electric", visual: "globe" },
  { key: "repair",    icon: Wand2,       tone: "violet" },
];

const toneClasses: Record<
  WowSchema["tone"],
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
  const t = useTranslations("wow");

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
            <Sparkles className="h-3 w-3" /> {t("eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart2")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {wowSchema.map((f, i) => (
            <WowCard key={f.key} schema={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WowCard({ schema, index }: { schema: WowSchema; index: number }) {
  const t = useTranslations("wow");
  const tc = useTranslations("common");
  const tone = toneClasses[schema.tone];
  const isWide = schema.span === "wide";
  const Icon = schema.icon;

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
          tone.gradient,
        )}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              tone.text,
            )}
            style={{
              borderColor: "currentColor",
              backgroundColor: "color-mix(in srgb, currentColor 10%, transparent)",
            }}
          >
            {t(`${schema.key}.badge`)}
          </span>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ring-2 ring-offset-2 ring-offset-background transition-transform group-hover:scale-110", tone.icon, tone.ring)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>

        <h3 className="mt-5 font-display text-xl font-bold leading-tight md:text-2xl">
          {t(`${schema.key}.title`)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t(`${schema.key}.desc`)}
        </p>

        <ul className="mt-4 space-y-1.5">
          {(["bullet1", "bullet2", "bullet3"] as const).map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <span
                className={cn("mt-1 h-1 w-1 shrink-0 rounded-full", tone.text)}
                style={{ backgroundColor: "currentColor" }}
              />
              <span>{t(`${schema.key}.${b}`)}</span>
            </li>
          ))}
        </ul>

        {/* Visuel signal (shadowban wide uniquement) */}
        {isWide && schema.visual === "signal" && (
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
          </div>
        )}

        {/* Drapeaux pour African Trend Engine */}
        {schema.visual === "globe" && (
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
            <div className={cn("font-display text-xl font-bold leading-none", tone.text)}>
              {t(`${schema.key}.metric`)}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {t(`${schema.key}.metricLabel`)}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <Eye className="h-3 w-3" /> {tc("learnMore")}
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
