"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Flame,
  Coins,
  ShieldAlert,
  TrendingUp,
  Image as ImageIcon,
  FileText,
  Sparkles,
  ArrowUpRight,
  Activity,
} from "lucide-react";

/**
 * "7 Agents IA travaillent pour toi" — version ultra-moderne animée.
 * - Layout asymétrique : hero card (Audit) full-width + 6 cards grille
 * - Framer-motion : stagger entry, hover rotations, count-up
 * - Sparklines SVG animées dans chaque card
 * - Gradient borders rotatifs au hover
 * - Background : particles + orbs colorés
 * - Compteur live "actions/heure" qui s'incrémente
 */

type Agent = {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  name: string;
  role: string;
  desc: string;
  color: string;
  badge: string;
  runs: number;
  spark: number[];
};

const AGENTS: Agent[] = [
  {
    icon: Search,
    name: "Audit Agent",
    role: "Diagnostic",
    desc: "Scanne tes 5 dernières vidéos et identifie les fuites de RPM en 60 secondes.",
    color: "#7B61FF",
    badge: "Analyse",
    runs: 8420,
    spark: [4, 8, 6, 12, 10, 18, 16, 24, 22, 28, 26, 32],
  },
  {
    icon: Flame,
    name: "Viral Score Agent",
    role: "Prédiction",
    desc: "Note ton contenu 0-100 avant publication. Tu publies seulement le top 30%.",
    color: "#f15522",
    badge: "Growth",
    runs: 6230,
    spark: [10, 14, 12, 18, 16, 22, 20, 26, 24, 28, 26, 30],
  },
  {
    icon: Coins,
    name: "Monetization Agent",
    role: "Optimisation",
    desc: "Détecte les vidéos sous-monétisées et te dit exactement comment les fixer.",
    color: "#FF8A00",
    badge: "Revenu",
    runs: 5180,
    spark: [6, 10, 8, 14, 12, 20, 18, 26, 24, 30, 28, 34],
  },
  {
    icon: ShieldAlert,
    name: "Anti-Ban Agent",
    role: "Protection",
    desc: "Surveille TikTok/FB en continu et t'alerte AVANT un shadowban.",
    color: "#E11D48",
    badge: "Sécurité",
    runs: 9540,
    spark: [12, 8, 16, 10, 20, 14, 24, 18, 28, 22, 32, 26],
  },
  {
    icon: TrendingUp,
    name: "Trend Scout",
    role: "Veille",
    desc: "Trouve les sons, hashtags et formats qui marchent dans 9 pays africains.",
    color: "#7B61FF",
    badge: "Tendances",
    runs: 7320,
    spark: [8, 12, 10, 16, 14, 22, 20, 28, 26, 32, 30, 36],
  },
  {
    icon: ImageIcon,
    name: "Thumbnail Agent",
    role: "Création",
    desc: "Génère 8 miniatures A/B-testées et te montre laquelle aura le meilleur CTR.",
    color: "#FF8A00",
    badge: "Création",
    runs: 4120,
    spark: [4, 8, 6, 10, 8, 14, 12, 18, 16, 22, 20, 26],
  },
  {
    icon: FileText,
    name: "Script Agent",
    role: "Création",
    desc: "Réécrit tes hooks faibles + génère 3 variantes de scripts pour Reels/Shorts.",
    color: "#f15522",
    badge: "Création",
    runs: 6840,
    spark: [6, 10, 8, 14, 12, 18, 16, 22, 20, 26, 24, 30],
  },
];

export function SevenAgents() {
  return (
    <section id="agents" className="relative overflow-hidden py-20 md:py-28">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#7B61FF] to-transparent opacity-20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#f15522] to-transparent opacity-20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative">
        <Header />

        {/* Hero card — Audit (premier agent, full-width) */}
        <div className="mt-12">
          <HeroAgentCard agent={AGENTS[0]} />
        </div>

        {/* Grid 6 cards */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.slice(1).map((agent, i) => (
            <AgentCard key={agent.name} agent={agent} index={i + 1} />
          ))}
        </div>

        {/* Live stats footer */}
        <LiveStats />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Header
 * ────────────────────────────────────────────────────────────────── */
function Header() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative inline-flex items-center gap-2 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7B61FF] backdrop-blur"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>7 agents IA travaillent pour toi</span>
        <motion.span
          aria-hidden
          className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[#7B61FF]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-5 font-display text-[1.85rem] font-bold leading-[1.05] tracking-tight text-balance md:text-[2.5rem]"
      >
        Pas un outil.{" "}
        <span className="relative inline-block">
          <span className="text-gradient-orange">Une équipe IA complète.</span>
          <motion.span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-[3px] origin-left rounded-full"
            style={{
              background: "linear-gradient(90deg, #f15522, #FF8A00, #7B61FF)",
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-4 max-w-2xl text-balance text-sm text-muted-foreground md:text-base"
      >
        Pendant que tu dors, 7 agents IA analysent, prédisent, optimisent et
        protègent tes comptes 24/7. Chacun spécialisé dans une discipline précise.
      </motion.p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Hero card (full-width)
 * ────────────────────────────────────────────────────────────────── */
function HeroAgentCard({ agent }: { agent: Agent }) {
  const Icon = agent.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="no-lg-glass group relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-2xl md:p-8 dark:bg-card"
    >
      {/* Gradient ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: agent.color }}
        initial={{ opacity: 0.10 }}
        animate={{ opacity: [0.10, 0.25, 0.10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 -bottom-32 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#7B61FF" }}
        initial={{ opacity: 0.08 }}
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Left : copy + stats */}
        <div>
          <div className="flex items-center gap-3">
            <IconBubble icon={Icon} color={agent.color} size="lg" />
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-[#7B61FF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#7B61FF]">
                Agent #1 · {agent.badge}
              </div>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">
                {agent.name}
              </h3>
            </div>
          </div>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {agent.desc} <span className="text-foreground">Disponible 24/7, multi-plateformes.</span>
          </p>

          {/* Stat row */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Stat label="Exécutions/jour" value={agent.runs} color={agent.color} />
            <div className="h-12 w-px bg-border" />
            <Stat label="Précision" value={97} suffix="%" color="#10B981" />
            <div className="h-12 w-px bg-border" />
            <Stat label="Latence" value={1.2} suffix="s" decimal={1} color="#FF8A00" />
          </div>
        </div>

        {/* Right : sparkline mockup */}
        <div className="relative rounded-2xl border border-border bg-background/40 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Activité 12h
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 dark:text-emerald-300">
              <Activity className="h-3 w-3" />
              Live
            </span>
          </div>
          <BigSparkline points={agent.spark} color={agent.color} />
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Standard card (6 small)
 * ────────────────────────────────────────────────────────────────── */
function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const Icon = agent.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="no-lg-glass group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl dark:bg-card"
    >
      {/* Rotating gradient border on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${agent.color}, transparent 120deg)`,
          padding: "1px",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "spin-slow 4s linear infinite",
        }}
      />

      {/* Background gradient hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl"
        style={{ backgroundColor: agent.color, opacity: 0.15 }}
        whileHover={{ opacity: 0.35, scale: 1.4 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <IconBubble icon={Icon} color={agent.color} size="md" />
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{
              color: agent.color,
              backgroundColor: `${agent.color}15`,
            }}
          >
            {agent.badge}
          </span>
        </div>

        <h3 className="mt-4 font-display text-[15px] font-bold tracking-tight">
          {agent.name}
        </h3>
        <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          {agent.role}
        </div>

        <p className="mt-2.5 min-h-[3.5rem] text-[12.5px] leading-relaxed text-muted-foreground">
          {agent.desc}
        </p>

        {/* Mini sparkline */}
        <div className="mt-3">
          <MiniSparkline points={agent.spark} color={agent.color} />
        </div>

        {/* Status footer */}
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-[10.5px]">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <PulseDot color={agent.color} />
            <span>
              <b className="text-foreground tabular-nums">
                <CountUp value={agent.runs} />
              </b>
              {" "}exécutions/jour
            </span>
          </span>
          <ArrowUpRight
            className="h-3.5 w-3.5 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: agent.color }}
          />
        </div>
      </div>
    </motion.article>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Atoms
 * ────────────────────────────────────────────────────────────────── */

function IconBubble({
  icon: Icon, color, size,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  size: "md" | "lg";
}) {
  const dims = size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const iconDims = size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 6 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`relative ${dims} flex items-center justify-center rounded-2xl shadow-sm`}
      style={{
        backgroundColor: `${color}1A`,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 0 4px ${color}08`,
      }}
    >
      {/* Pulse ring */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-2xl"
        style={{ border: `1.5px solid ${color}` }}
        animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <Icon className={`${iconDims} relative`} style={{ color }} />
    </motion.div>
  );
}

function Stat({
  label, value, suffix, color, decimal,
}: {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  decimal?: number;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold tabular-nums leading-none md:text-3xl" style={{ color }}>
        <CountUp value={value} decimal={decimal} />
        {suffix && <span className="text-base">{suffix}</span>}
      </div>
    </div>
  );
}

function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 2.5], opacity: [0.7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
    </span>
  );
}

function MiniSparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const w = 200;
  const h = 32;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const gradientId = `spark-grad-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Trailing dot */}
      <motion.circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * h}
        r="2.5"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 1.4 }}
      />
    </svg>
  );
}

function BigSparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const w = 280;
  const h = 100;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const gradientId = `bigspark-grad-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-24 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * h}
        r="4"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 1.8 }}
      />
      {/* Pulse ring around last dot */}
      <motion.circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * h}
        r="4"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        initial={{ r: 4, opacity: 0 }}
        whileInView={{ r: [4, 12], opacity: [0.6, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
      />
    </svg>
  );
}

function CountUp({ value, decimal }: { value: number; decimal?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) =>
    decimal
      ? v.toFixed(decimal).replace(".", ",")
      : Math.round(v).toLocaleString("fr-FR"),
  );
  const [text, setText] = useState(decimal ? "0" : "0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });
    const unsub = display.on("change", (v) => setText(String(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, motionValue, value, display]);

  return <span ref={ref}>{text}</span>;
}

/* ──────────────────────────────────────────────────────────────────
 * Live stats footer
 * ────────────────────────────────────────────────────────────────── */
function LiveStats() {
  // Compteur qui s'incrémente toutes les 4s pour la sensation "live"
  const [count, setCount] = useState(14327);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 7) + 2);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-5 py-3"
    >
      <span className="relative flex h-2 w-2">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
          animate={{ scale: [1, 2.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-[12.5px] text-muted-foreground">
        <motion.b
          key={count}
          initial={{ scale: 1.15, color: "#10B981" }}
          animate={{ scale: 1, color: "currentColor" }}
          transition={{ duration: 0.4 }}
          className="text-foreground tabular-nums"
        >
          {count.toLocaleString("fr-FR")}
        </motion.b>
        {" "}actions IA exécutées dans la dernière heure
      </span>
    </motion.div>
  );
}
