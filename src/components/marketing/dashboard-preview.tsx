"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Eye,
  Facebook,
  Hash,
  Heart,
  Music2,
  Play,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wand2,
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

          {/* ─── Séparateur "Dashboard complet" ─── */}
          <SectionDivider label="Dashboard complet du créateur" />

          {/* ─── KPIs de performance (4 cards) ─── */}
          <PerformanceKpis />

          {/* ─── Plateformes connectées (9 plateformes) ─── */}
          <ConnectedPlatforms />

          {/* ─── Top contenus + Tendances Afrique ─── */}
          <div className="mt-3 grid gap-3 md:mt-5 md:grid-cols-[1.4fr_1fr] md:gap-4">
            <TopContents />
            <AfricanTrends />
          </div>

          {/* ─── 7 Agents IA + Anti-ban surveillance ─── */}
          <div className="mt-3 grid gap-3 md:mt-5 md:grid-cols-2 md:gap-4">
            <AgentsStatus />
            <AntiBanSurveillance />
          </div>

          {/* ─── CTA bandeau ─── */}
          <DemoCtaStrip />
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

/* ──────────────────────────────────────────────────────────────────
 * Section divider — "Dashboard complet" séparateur visuel
 * ────────────────────────────────────────────────────────────────── */

function SectionDivider({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="mt-5 flex items-center gap-3 md:mt-7"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/10" />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3 w-3 text-[#EC4899]" />
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-white/10" />
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Performance KPIs — 4 cards compact (vues, engagement, abonnés, watch time)
 * ────────────────────────────────────────────────────────────────── */

const PERFORMANCE_KPIS: ReadonlyArray<{
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  delta: string;
  color: string;
}> = [
  { icon: Eye,        label: "Vues (30 j)",      value: "12,4 M",   delta: "+18%",   color: "#FF8A00" },
  { icon: Heart,      label: "Engagement",       value: "8,7%",     delta: "+1,2 pt", color: "#EC4899" },
  { icon: Users,      label: "Abonnés gagnés",   value: "+4 230",   delta: "+22%",   color: "#1FBEAF" },
  { icon: Play,       label: "Temps visionnage", value: "87 245 h", delta: "+15%",   color: "#10B981" },
];

function PerformanceKpis() {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 md:mt-5 md:grid-cols-4 md:gap-3">
      {PERFORMANCE_KPIS.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-xl border border-border bg-white/[0.04] p-2.5 backdrop-blur-md md:rounded-2xl md:p-3.5"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-20 blur-2xl"
            style={{ backgroundColor: kpi.color }}
          />
          <div className="relative flex items-center justify-between gap-2">
            <div
              className="grid h-6 w-6 place-items-center rounded-md border md:h-7 md:w-7 md:rounded-lg"
              style={{ backgroundColor: `${kpi.color}1A`, borderColor: `${kpi.color}55` }}
            >
              <kpi.icon className="h-3 w-3 md:h-3.5 md:w-3.5" style={{ color: kpi.color }} />
            </div>
            <span
              className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold md:text-[10px]"
              style={{ backgroundColor: `${kpi.color}1A`, color: kpi.color }}
            >
              <TrendingUp className="h-2.5 w-2.5" />
              {kpi.delta}
            </span>
          </div>
          <div className="relative mt-2 font-display text-lg font-bold leading-none tabular-nums md:mt-3 md:text-2xl">
            {kpi.value}
          </div>
          <div className="relative mt-1 text-[9.5px] uppercase tracking-wider text-muted-foreground md:text-[10px]">
            {kpi.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Connected platforms — grille des 9 plateformes avec status
 * ────────────────────────────────────────────────────────────────── */

type PlatformStatus = "connected" | "available";
const PLATFORMS: ReadonlyArray<{
  name: string;
  short: string;
  color: string;
  status: PlatformStatus;
  score?: number;
}> = [
  { name: "Facebook",  short: "FB", color: "#1877F2", status: "connected", score: 84 },
  { name: "TikTok",    short: "TT", color: "#EC4899", status: "connected", score: 91 },
  { name: "YouTube",   short: "YT", color: "#FF0033", status: "connected", score: 76 },
  { name: "Instagram", short: "IG", color: "#E1306C", status: "connected", score: 68 },
  { name: "X",         short: "X",  color: "#FFFFFF", status: "connected", score: 62 },
  { name: "Snapchat",  short: "SC", color: "#FFFC00", status: "available" },
  { name: "Twitch",    short: "TW", color: "#9146FF", status: "available" },
  { name: "Pinterest", short: "PT", color: "#E60023", status: "available" },
  { name: "LinkedIn",  short: "IN", color: "#0A66C2", status: "available" },
];

function ConnectedPlatforms() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="relative mt-3 overflow-hidden rounded-xl border border-border bg-white/[0.04] p-3 backdrop-blur-md md:mt-5 md:rounded-2xl md:p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-medium text-muted-foreground md:text-sm md:text-foreground">
          Plateformes connectées
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground">
          <span className="text-emerald-400">5</span> / 9 actives
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-9 md:gap-2.5">
        {PLATFORMS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            whileHover={{ y: -2 }}
            className={`group relative flex flex-col items-center gap-1 rounded-lg border p-2 transition-shadow ${
              p.status === "connected"
                ? "border-white/10 bg-white/[0.05] hover:shadow-md"
                : "border-dashed border-white/10 bg-white/[0.02] opacity-60"
            }`}
          >
            <div
              className="grid h-7 w-7 place-items-center rounded-md text-[10px] font-bold md:h-8 md:w-8"
              style={{
                backgroundColor: `${p.color}22`,
                color: p.color,
                border: `1px solid ${p.color}55`,
              }}
            >
              {p.short}
            </div>
            <div className="text-[9px] font-semibold leading-tight text-foreground/80">
              {p.name}
            </div>
            {p.status === "connected" && typeof p.score === "number" ? (
              <div className="inline-flex items-center gap-0.5 text-[9px] font-bold tabular-nums" style={{ color: p.color }}>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: p.color }} />
                {p.score}
              </div>
            ) : (
              <div className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-muted-foreground">
                <Plus className="h-2.5 w-2.5" />
                Lier
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Top contenus — table compact des 4 meilleurs contenus
 * ────────────────────────────────────────────────────────────────── */

const TOP_CONTENTS: ReadonlyArray<{
  title: string;
  platform: string;
  platformColor: string;
  views: string;
  rpm: string;
  revenue: string;
}> = [
  { title: "Mon premier million de FCFA",     platform: "TT", platformColor: "#EC4899", views: "324 K", rpm: "$2,10", revenue: "$682"  },
  { title: "POV : créateur africain en 2026", platform: "FB", platformColor: "#1877F2", views: "187 K", rpm: "$1,80", revenue: "$337"  },
  { title: "Comment j'ai battu l'algo TikTok",platform: "YT", platformColor: "#FF0033", views: "152 K", rpm: "$3,40", revenue: "$517"  },
  { title: "Live Q&A finance mobile money",   platform: "FB", platformColor: "#1877F2", views: "98 K",  rpm: "$1,40", revenue: "$137"  },
];

function TopContents() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl border border-border bg-white/[0.04] p-3 backdrop-blur-md md:rounded-2xl md:p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground md:text-sm md:text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[#FF8A00]" />
          Top contenus · 30 j
        </div>
        <button className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
          Voir tout <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <ul className="mt-3 space-y-1.5">
        {TOP_CONTENTS.map((c, i) => (
          <motion.li
            key={c.title}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="group grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-white/10 hover:bg-white/[0.03] md:gap-3"
          >
            <span
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[9px] font-bold md:h-7 md:w-7 md:text-[10px]"
              style={{
                backgroundColor: `${c.platformColor}22`,
                color: c.platformColor,
                border: `1px solid ${c.platformColor}55`,
              }}
            >
              {c.platform}
            </span>
            <span className="min-w-0 truncate text-[11.5px] text-foreground/90 md:text-xs" title={c.title}>
              {c.title}
            </span>
            <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground md:text-[11px]">
              {c.views}
            </span>
            <span className="shrink-0 text-right font-display text-[11px] font-bold tabular-nums text-emerald-400 md:text-xs">
              {c.revenue}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Tendances Afrique — hashtags + sons
 * ────────────────────────────────────────────────────────────────── */

const TRENDING_HASHTAGS: ReadonlyArray<{ tag: string; growth: string; volume: string }> = [
  { tag: "afrobeats",      growth: "+128%", volume: "2,4 M" },
  { tag: "mobilemoneyhack",growth: "+96%",  volume: "1,1 M" },
  { tag: "dakarvibes",     growth: "+74%",  volume: "820 K" },
  { tag: "lagostiktok",    growth: "+58%",  volume: "1,8 M" },
  { tag: "africantech",    growth: "+42%",  volume: "640 K" },
];

const TRENDING_SOUNDS: ReadonlyArray<{ title: string; artist: string; uses: string; trend: string }> = [
  { title: "Calm Down (sped up)",      artist: "Rema",         uses: "1,2 M", trend: "+45%" },
  { title: "Unavailable",              artist: "Davido",       uses: "890 K", trend: "+32%" },
  { title: "Africa Riddim",            artist: "DJ AfroBeats", uses: "620 K", trend: "+28%" },
];

function AfricanTrends() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-xl border border-border bg-white/[0.04] p-3 backdrop-blur-md md:rounded-2xl md:p-4"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground md:text-sm md:text-foreground">
        <TrendingUp className="h-3.5 w-3.5 text-[#1FBEAF]" />
        Tendances Afrique
      </div>

      {/* Hashtags */}
      <div className="mt-3">
        <div className="text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          Hashtags
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {TRENDING_HASHTAGS.map((h, i) => (
            <motion.span
              key={h.tag}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              className="inline-flex items-center gap-1 rounded-full border border-[#1FBEAF]/30 bg-[#1FBEAF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1FBEAF]"
              title={`Volume : ${h.volume}`}
            >
              <Hash className="h-2.5 w-2.5" />
              {h.tag}
              <span className="text-emerald-400">{h.growth}</span>
            </motion.span>
          ))}
        </div>
      </div>

      {/* Sons */}
      <div className="mt-3">
        <div className="text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sons populaires
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {TRENDING_SOUNDS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
              className="flex items-center gap-2"
            >
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-[#EC4899]/40 bg-[#EC4899]/15">
                <Music2 className="h-3 w-3 text-[#EC4899]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium text-foreground/90">{s.title}</div>
                <div className="truncate text-[9.5px] text-muted-foreground">{s.artist} · {s.uses} utilisations</div>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                {s.trend}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * 7 Agents IA — status (running / idle / alert)
 * ────────────────────────────────────────────────────────────────── */

type AgentStatus = "running" | "idle" | "alert";
const AGENTS: ReadonlyArray<{
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  status: AgentStatus;
  meta: string;
  color: string;
}> = [
  { name: "Audit",        icon: ShieldCheck, status: "running", meta: "score 78 · à jour", color: "#1FBEAF" },
  { name: "Viral",        icon: Sparkles,    status: "running", meta: "12 idées générées",  color: "#EC4899" },
  { name: "Monetization", icon: DollarSign,  status: "running", meta: "+38% projection",    color: "#10B981" },
  { name: "Anti-ban",     icon: Shield,      status: "alert",   meta: "1 alerte copyright", color: "#F59E0B" },
  { name: "Trend",        icon: TrendingUp,  status: "running", meta: "5 hashtags hot",     color: "#FF8A00" },
  { name: "Thumbnail",    icon: Wand2,       status: "idle",    meta: "prêt · 0 en file",   color: "#A78BFA" },
  { name: "Script",       icon: Bot,         status: "idle",    meta: "prêt · 0 en file",   color: "#60A5FA" },
];

function AgentsStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl border border-border bg-white/[0.04] p-3 backdrop-blur-md md:rounded-2xl md:p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground md:text-sm md:text-foreground">
          <Bot className="h-3.5 w-3.5 text-[#A78BFA]" />
          7 Agents IA
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          5 actifs
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-1.5 md:grid-cols-2 md:gap-2">
        {AGENTS.map((a, i) => (
          <motion.li
            key={a.name}
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5"
          >
            <div
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md border"
              style={{ backgroundColor: `${a.color}1A`, borderColor: `${a.color}55` }}
            >
              <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold leading-tight text-foreground/90">{a.name}</div>
              <div className="truncate text-[9.5px] text-muted-foreground">{a.meta}</div>
            </div>
            <AgentStatusPill status={a.status} />
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function AgentStatusPill({ status }: { status: AgentStatus }) {
  const conf =
    status === "running"
      ? { label: "Live",  bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400 animate-pulse" }
      : status === "alert"
      ? { label: "Alert", bg: "bg-amber-500/15",   text: "text-amber-400",   dot: "bg-amber-400 animate-pulse"   }
      : { label: "Idle",  bg: "bg-white/10",       text: "text-muted-foreground", dot: "bg-muted-foreground"     };
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${conf.bg} ${conf.text}`}>
      <span className={`h-1 w-1 rounded-full ${conf.dot}`} />
      {conf.label}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Anti-ban surveillance — alertes copyright, audio, format
 * ────────────────────────────────────────────────────────────────── */

const ANTI_BAN_EVENTS: ReadonlyArray<{
  level: "warning" | "info" | "ok";
  title: string;
  detail: string;
  when: string;
}> = [
  { level: "warning", title: "Audio sous copyright détecté", detail: "3 vidéos à remplacer pour rester monétisable", when: "il y a 12 min" },
  { level: "info",    title: "Nouvelle politique TikTok",    detail: "Règles musique commerciale — résumé IA dispo",  when: "il y a 2 h"   },
  { level: "ok",      title: "Aucune violation cette semaine", detail: "Compte sain · risque ban 18 / 100",          when: "auj." },
];

function AntiBanSurveillance() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-xl border border-border bg-white/[0.04] p-3 backdrop-blur-md md:rounded-2xl md:p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground md:text-sm md:text-foreground">
          <ShieldAlert className="h-3.5 w-3.5 text-[#F59E0B]" />
          Surveillance anti-ban
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
          Faible risque
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {ANTI_BAN_EVENTS.map((e, i) => {
          const color =
            e.level === "warning" ? "#F59E0B" : e.level === "info" ? "#60A5FA" : "#10B981";
          const Icon =
            e.level === "warning" ? AlertTriangle : e.level === "info" ? Sparkles : CheckCircle2;
          return (
            <motion.li
              key={e.title}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
              className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-2"
            >
              <div
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md border"
                style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
              >
                <Icon className="h-3 w-3" style={{ color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-semibold leading-tight text-foreground/90">{e.title}</div>
                <div className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{e.detail}</div>
              </div>
              <span className="shrink-0 text-[9.5px] text-muted-foreground">{e.when}</span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * CTA strip — bandeau d'incitation en bas
 * ────────────────────────────────────────────────────────────────── */

function DemoCtaStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-[#EC4899]/15 via-[#FF8A00]/10 to-[#1FBEAF]/15 p-3 md:mt-5 md:rounded-2xl md:p-4"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#FF8A00]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[#EC4899]/20 blur-3xl" />
      <div className="relative flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#FF8A00]">
            <Sparkles className="h-3 w-3" />
            Aperçu démo
          </div>
          <div className="mt-1 font-display text-sm font-bold md:text-base">
            Ton vrai dashboard arrive après ton premier audit — gratuit, en 30 secondes.
          </div>
        </div>
        <a
          href="/signup"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#EC4899] to-[#FF8A00] px-4 py-2 text-[12px] font-bold text-white shadow-lg shadow-[#EC4899]/30 transition-transform hover:scale-[1.03]"
        >
          Lancer mon audit
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  );
}
