"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Facebook,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Dashboard mockup ultra-moderne — animations + glass + gradients logo.
 * Resp : 3 score cards sur 1 ligne mobile, layout split sur md+.
 */
export function DashboardPreview() {
  const t = useTranslations("preview");

  return (
    <div className="relative">
      {/* Glow ambient derrière la card (decorative) */}
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

      {/* `dark` class forcée : le card reste sombre dans les 2 thèmes,
          donc on force les CSS vars dark pour que text-foreground soit clair */}
      <div className="dark relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#0E0E1A] to-[#1A1230] text-foreground">
        <div className="rounded-[1.4rem] bg-background/40 p-3 backdrop-blur-2xl md:p-7">

          {/* ─── Header card ─── */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/30"
              >
                <Facebook className="h-4 w-4 text-blue-400" />
              </motion.div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold md:text-sm">
                  {t("title")} · <span className="text-foreground">@afroviral.media</span>
                </div>
                <div className="truncate text-[10.5px] text-muted-foreground md:text-xs">
                  {t("subtitle")}
                </div>
              </div>
            </div>

            {/* Live badge animé */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300"
            >
              <span className="relative flex h-1.5 w-1.5">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                  animate={{ scale: [1, 2.5], opacity: [0.7, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {t("live")}
            </motion.div>
          </div>

          {/* ─── 3 Score cards ─── */}
          <div className="mt-4 grid grid-cols-3 gap-2 md:mt-6 md:gap-4">
            <ScoreCard label={t("scoreMonet")} value={72} tone="amber" delay={0} />
            <ScoreCard label={t("scoreViral")} value={84} tone="brand" delay={0.1} />
            <ScoreCard label={t("scoreRisk")} value={18} tone="emerald" delay={0.2} />
          </div>

          {/* ─── Revenue + Recommandations ─── */}
          <div className="mt-3 grid gap-3 md:mt-5 md:grid-cols-2 md:gap-4">
            <RevenueCard
              title={t("revenue")}
              amount="423 500"
              currency="FCFA"
              delta="+38%"
              points={[28, 35, 30, 48, 52, 42, 58, 64, 56, 70, 78, 88]}
            />
            <RecommendationsCard
              title={t("recommendations")}
              items={[
                { icon: CheckCircle2, color: "#10B981", text: t("reco1") },
                { icon: AlertTriangle, color: "#F59E0B", text: t("reco2") },
                { icon: Sparkles, color: "#EC4899", text: t("reco3") },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Score Card avec count-up + animated progress
 * ────────────────────────────────────────────────────────────────── */

const TONE_COLORS: Record<"brand" | "emerald" | "amber" | "rose", string> = {
  brand:   "#EC4899",
  emerald: "#10B981",
  amber:   "#F59E0B",
  rose:    "#F43F5E",
};

function ScoreCard({
  label,
  value,
  tone,
  delay = 0,
}: {
  label: string;
  value: number;
  tone: "brand" | "emerald" | "amber" | "rose";
  delay?: number;
}) {
  const color = TONE_COLORS[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-white/[0.04] p-2.5 backdrop-blur-md transition-shadow hover:shadow-lg md:rounded-2xl md:p-4"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="relative">
        <div className="text-[10px] leading-tight text-muted-foreground md:text-xs">
          {label}
        </div>
        <div className="mt-1 flex items-baseline gap-1 md:gap-2">
          <div className="font-display text-xl font-bold tabular-nums md:text-3xl" style={{ color }}>
            <CountUp value={value} />
          </div>
          <div className="text-[9px] text-muted-foreground md:text-xs">/ 100</div>
        </div>
        <AnimatedBar value={value} color={color} delay={delay + 0.2} />
      </div>
    </motion.div>
  );
}

function AnimatedBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10 md:mt-3 md:h-2">
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Revenue Card avec SVG area chart animé
 * ────────────────────────────────────────────────────────────────── */

function RevenueCard({
  title, amount, currency, delta, points,
}: {
  title: string;
  amount: string;
  currency: string;
  delta: string;
  points: number[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden rounded-xl border border-border bg-white/[0.04] p-3 backdrop-blur-md md:rounded-2xl md:p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-medium text-muted-foreground md:text-sm md:text-foreground">
          {title}
        </div>
        <motion.div
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#EC4899] to-[#FF8A00] px-2 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-pink-500/30 md:text-xs"
        >
          <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" /> {delta}
        </motion.div>
      </div>

      <div className="mt-2 font-display text-2xl font-bold tabular-nums md:mt-3 md:text-3xl">
        <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
          {amount}
        </span>{" "}
        <span className="text-xs text-muted-foreground md:text-base">{currency}</span>
      </div>

      <AreaChart points={points} />
    </motion.div>
  );
}

function AreaChart({ points }: { points: number[] }) {
  const w = 320;
  const h = 80;
  const max = Math.max(...points);
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * (h - 8)}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-14 w-full md:mt-3 md:h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF8A00" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#EC4899" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1FBEAF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rev-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1FBEAF" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#FF8A00" />
        </linearGradient>
      </defs>

      <motion.path
        d={area}
        fill="url(#rev-area)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="url(#rev-line)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * (h - 8)}
        r="4"
        fill="#FF8A00"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 1.8 }}
      />
      {/* Pulse ring sur le dernier point */}
      <motion.circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * (h - 8)}
        r="4"
        fill="none"
        stroke="#FF8A00"
        strokeWidth="1.5"
        initial={{ r: 4, opacity: 0 }}
        whileInView={{ r: [4, 14], opacity: [0.6, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 2 }}
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Recommandations IA card avec stagger items
 * ────────────────────────────────────────────────────────────────── */

function RecommendationsCard({
  title, items,
}: {
  title: string;
  items: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; text: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-border bg-white/[0.04] p-3 backdrop-blur-md md:rounded-2xl md:p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-medium text-muted-foreground md:text-sm md:text-foreground">
          {title}
        </div>
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400 md:h-4 md:w-4" />
        </motion.div>
      </div>

      <ul className="mt-2.5 space-y-2 text-[12.5px] md:mt-3 md:space-y-2.5 md:text-sm">
        {items.map((it, i) => (
          <RecommendationItem key={i} item={it} index={i} />
        ))}
      </ul>
    </motion.div>
  );
}

function RecommendationItem({
  item, index,
}: {
  item: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; text: string };
  index: number;
}) {
  const Icon = item.icon;
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.12 }}
      className="group flex items-start gap-2"
    >
      <div
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}
      >
        <Icon className="h-3 w-3" style={{ color: item.color }} />
      </div>
      <span className="leading-snug">{item.text}</span>
    </motion.li>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * CountUp animated number
 * ────────────────────────────────────────────────────────────────── */

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => Math.round(v).toString());
  const [text, setText] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
    const unsub = display.on("change", (v) => setText(v));
    return () => { controls.stop(); unsub(); };
  }, [inView, motionValue, value, display]);

  return <span ref={ref}>{text}</span>;
}
