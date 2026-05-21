"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * "7 Agents IA travaillent pour toi" — carousel compact ultra-moderne.
 *
 * Layout : header + carousel horizontal scroll-snap (7 cards uniformes) +
 * arrows + dots indicators. Tout respecte la largeur container landing
 * (1280px). Design : verre glass, gradient borders au hover, sparklines
 * SVG animées, status live pulse, count-up sur stats.
 */

type Agent = {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  name: string;
  role: string;
  desc: string;
  color: string;
  badge: string;
  spark: number[];
  stat: { label: string; value: string };
};

const AGENTS: Agent[] = [
  {
    icon: Search,
    name: "Audit Agent",
    role: "Diagnostic",
    desc: "Scanne tes 5 dernières vidéos et identifie les fuites de RPM en 60 secondes.",
    color: "#EC4899",
    badge: "Analyse",
    spark: [4, 8, 6, 12, 10, 18, 16, 24, 22, 28, 26, 32],
    stat: { label: "Précision", value: "97%" },
  },
  {
    icon: Flame,
    name: "Viral Score",
    role: "Prédiction",
    desc: "Note ton contenu 0-100 avant publication. Tu publies seulement le top 30%.",
    color: "#f15522",
    badge: "Growth",
    spark: [10, 14, 12, 18, 16, 22, 20, 26, 24, 28, 26, 30],
    stat: { label: "Hit-rate", value: "+38%" },
  },
  {
    icon: Coins,
    name: "Monetization",
    role: "Optimisation",
    desc: "Détecte les vidéos sous-monétisées et te dit exactement comment les fixer.",
    color: "#FF8A00",
    badge: "Revenu",
    spark: [6, 10, 8, 14, 12, 20, 18, 26, 24, 30, 28, 34],
    stat: { label: "Lift RPM", value: "×2,4" },
  },
  {
    icon: ShieldAlert,
    name: "Anti-Ban",
    role: "Protection",
    desc: "Surveille TikTok/FB en continu et t'alerte AVANT un shadowban.",
    color: "#E11D48",
    badge: "Sécurité",
    spark: [12, 8, 16, 10, 20, 14, 24, 18, 28, 22, 32, 26],
    stat: { label: "Alertes/24h", value: "12" },
  },
  {
    icon: TrendingUp,
    name: "Trend Scout",
    role: "Veille",
    desc: "Trouve les sons, hashtags et formats qui marchent dans 9 pays africains.",
    color: "#1FBEAF",
    badge: "Tendances",
    spark: [8, 12, 10, 16, 14, 22, 20, 28, 26, 32, 30, 36],
    stat: { label: "Pays", value: "9" },
  },
  {
    icon: ImageIcon,
    name: "Thumbnail",
    role: "Création",
    desc: "Génère 8 miniatures A/B-testées et te montre laquelle aura le meilleur CTR.",
    color: "#A78BFA",
    badge: "Création",
    spark: [4, 8, 6, 10, 8, 14, 12, 18, 16, 22, 20, 26],
    stat: { label: "CTR uplift", value: "+22%" },
  },
  {
    icon: FileText,
    name: "Script Agent",
    role: "Rédaction",
    desc: "Réécrit tes hooks faibles + génère 3 variantes de scripts pour Reels/Shorts.",
    color: "#60A5FA",
    badge: "Rédaction",
    spark: [6, 10, 8, 14, 12, 18, 16, 22, 20, 26, 24, 30],
    stat: { label: "Variantes", value: "3×" },
  },
];

export function SevenAgents() {
  return (
    <section id="agents" className="relative overflow-hidden py-12 md:py-16">
      {/* Background orbs décoratifs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#EC4899] to-transparent opacity-15 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#f15522] to-transparent opacity-15 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative">
        <Header />
        <AgentsCarousel />
        <LiveStats />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Header (badge + titre + subtitle)
 * ────────────────────────────────────────────────────────────────── */
function Header() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative inline-flex items-center gap-2 rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#EC4899] backdrop-blur"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>7 agents IA travaillent pour toi</span>
        <motion.span
          aria-hidden
          className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[#EC4899]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-3 font-display text-[1.55rem] font-bold leading-[1.05] tracking-tight text-balance md:text-[2rem]"
      >
        Pas un outil.{" "}
        <span className="relative inline-block">
          <span className="text-gradient-orange">Une équipe IA complète.</span>
          <motion.span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-[3px] origin-left rounded-full"
            style={{ background: "linear-gradient(90deg, #f15522, #FF8A00, #EC4899)" }}
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
        className="mx-auto mt-3 max-w-2xl text-balance text-[13px] text-muted-foreground md:text-sm"
      >
        Pendant que tu dors, 7 agents IA analysent, prédisent, optimisent et
        protègent tes comptes 24/7. Chacun spécialisé dans une discipline précise.
      </motion.p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * AgentsCarousel — scroll-snap horizontal + arrows + dots
 * ────────────────────────────────────────────────────────────────── */
function AgentsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const recomputeState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / AGENTS.length;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    recomputeState();
    el.addEventListener("scroll", recomputeState, { passive: true });
    window.addEventListener("resize", recomputeState);
    return () => {
      el.removeEventListener("scroll", recomputeState);
      window.removeEventListener("resize", recomputeState);
    };
  }, [recomputeState]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / AGENTS.length;
    el.scrollBy({ left: dir * cardWidth * 1.5, behavior: "smooth" });
  };

  const scrollToIndex = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / AGENTS.length;
    el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="relative mt-7">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent md:w-12" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent md:w-12" />

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 pt-1 md:gap-4"
        style={{ scrollbarWidth: "none" }}
      >
        {AGENTS.map((agent, i) => (
          <AgentCard key={agent.name} agent={agent} index={i} />
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Précédent"
        onClick={() => scrollByCards(-1)}
        disabled={!canScrollLeft}
        className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 shadow-lg backdrop-blur-md transition-all hover:bg-background hover:shadow-xl disabled:opacity-30 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Suivant"
        onClick={() => scrollByCards(1)}
        disabled={!canScrollRight}
        className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 shadow-lg backdrop-blur-md transition-all hover:bg-background hover:shadow-xl disabled:opacity-30 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {AGENTS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Agent ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-gradient-to-r from-[#EC4899] to-[#FF8A00]"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * AgentCard — version compacte uniforme (carousel)
 * ────────────────────────────────────────────────────────────────── */
function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const Icon = agent.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative w-[270px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-transparent p-4 transition-shadow duration-300 hover:shadow-xl md:w-[290px]"
    >
      {/* Gradient border rotatif au hover */}
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

      {/* Glow d'ambiance hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl"
        style={{ backgroundColor: agent.color, opacity: 0.12 }}
        whileHover={{ opacity: 0.3, scale: 1.4 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative">
        {/* Header : icon bubble + badge */}
        <div className="flex items-start justify-between gap-2">
          <IconBubble icon={Icon} color={agent.color} />
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{ color: agent.color, backgroundColor: `${agent.color}15` }}
          >
            {agent.badge}
          </span>
        </div>

        {/* Title + role */}
        <h3 className="mt-3 font-display text-[15px] font-bold leading-tight tracking-tight">
          {agent.name}
        </h3>
        <div className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          Agent #{index + 1} · {agent.role}
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-3 min-h-[3.4rem] text-[11.5px] leading-snug text-muted-foreground">
          {agent.desc}
        </p>

        {/* Sparkline */}
        <div className="mt-2.5">
          <MiniSparkline points={agent.spark} color={agent.color} />
        </div>

        {/* Stat highlight */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-display text-base font-bold tabular-nums" style={{ color: agent.color }}>
            {agent.stat.value}
          </span>
          <span className="text-[9.5px] uppercase tracking-wider text-muted-foreground">
            {agent.stat.label}
          </span>
        </div>

        {/* Footer : status + arrow */}
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
          <span className="flex items-center gap-1.5 text-[10px]">
            <PulseDot color={agent.color} />
            <b className="text-foreground">Prêt · 24/7</b>
          </span>
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: agent.color }}
          />
        </div>
      </div>
    </motion.article>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Atomes
 * ────────────────────────────────────────────────────────────────── */

function IconBubble({
  icon: Icon,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 6 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
      style={{
        backgroundColor: `${color}1A`,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 0 4px ${color}08`,
      }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-xl"
        style={{ border: `1.5px solid ${color}` }}
        animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <Icon className="relative h-4 w-4" style={{ color }} />
    </motion.div>
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
  const h = 28;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const gradientId = `spark-grad-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-full" preserveAspectRatio="none">
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

/* ──────────────────────────────────────────────────────────────────
 * Live stats footer
 * ────────────────────────────────────────────────────────────────── */
function LiveStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-2"
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
        <b className="text-foreground">Système opérationnel</b>
        {" "}— prêt à analyser tes comptes
      </span>
    </motion.div>
  );
}

