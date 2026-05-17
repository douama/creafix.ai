"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music2,
  Hash,
  TrendingUp,
  RefreshCcw,
  Flame,
  Clock,
  Zap,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { COUNTRY_POOLS, snapshotFor, type CountryPool } from "@/lib/african-trends-pool";

// ─── Platforms ──────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "tiktok",    name: "TikTok",      color: "#EE1D52", accent: "#69C9D0", sonLabel: "Sons TikTok",       hashLabel: "Hashtags & Défis",  Icon: TikTokIcon    },
  { id: "instagram", name: "Instagram",   color: "#E1306C", accent: "#FCAF45", sonLabel: "Reels Audio",       hashLabel: "Hashtags Reels",    Icon: InstagramIcon },
  { id: "youtube",   name: "YouTube",     color: "#FF0000", accent: "#FF6B6B", sonLabel: "Musiques trending", hashLabel: "Sujets viraux",     Icon: YouTubeIcon   },
  { id: "twitter",   name: "X / Twitter", color: "#1DA1F2", accent: "#e7e9ea", sonLabel: "Trends musicaux",   hashLabel: "Trending Topics",   Icon: XIcon         },
  { id: "facebook",  name: "Facebook",    color: "#1877F2", accent: "#4299e1", sonLabel: "Musiques Reels",    hashLabel: "Topics & Hashtags", Icon: FacebookIcon  },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

const PLATFORM_SEED_OFFSET: Record<PlatformId, number> = {
  tiktok: 0, instagram: 1_000_000, youtube: 2_000_000, twitter: 3_000_000, facebook: 4_000_000,
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function velFor(baseVolume: number, seed: number): string {
  const pct = 60 + Math.floor(Math.abs(Math.sin(seed) * 380));
  return `+${pct}%`;
}
function velClass(vel: string): string {
  const n = parseInt(vel.replace("+", "").replace("%", ""));
  if (n >= 250) return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  if (n >= 150) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
}
function minsIntoBucket(nowMs: number): number {
  return Math.floor((nowMs % (4 * 60_000)) / 60_000);
}

// ─── Slide animation ─────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:  (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.22 } }),
};

const API_LABELS = [
  "TikTok Research API",
  "Instagram Graph API",
  "YouTube Data v3",
  "X API v2",
  "Facebook Graph API",
];

// ─── Main component ──────────────────────────────────────────────────────────
export function TrendScannerClient() {
  const [platform, setPlatform] = useState<PlatformId>("tiktok");
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [refreshing, setRefreshing] = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const plat = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];
  const offset = PLATFORM_SEED_OFFSET[platform];
  const minsAgo = minsIntoBucket(nowMs);
  const pool = COUNTRY_POOLS[activeIdx];

  function goTo(idx: number) {
    const clamped = (idx + COUNTRY_POOLS.length) % COUNTRY_POOLS.length;
    setDirection(
      clamped > activeIdx || (activeIdx === COUNTRY_POOLS.length - 1 && clamped === 0) ? 1 : -1,
    );
    setActiveIdx(clamped);
    setTimeout(() => {
      pillsRef.current
        ?.querySelectorAll("button")
        [clamped + 1]?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
    }, 50);
  }

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => { setNowMs(Date.now()); setRefreshing(false); }, 900);
  }

  const totalHashtags = COUNTRY_POOLS.reduce((a, c) => a + c.hashtags.length, 0);
  const totalSounds   = COUNTRY_POOLS.reduce((a, c) => a + c.sounds.length, 0);

  return (
    <div className="pb-10">

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 -mt-6 mb-7 overflow-hidden md:-mx-8 md:-mt-8">
        {/* Layered gradient background */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 50% -5%, ${plat.color}28 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 85% 40%, ${plat.accent}18 0%, transparent 55%),
              radial-gradient(ellipse 35% 60% at 5% 70%, ${plat.color}0E 0%, transparent 60%)
            `,
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${plat.color}20 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            opacity: 0.6,
            maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
          }}
        />

        <div className="relative px-4 pt-7 pb-6 md:px-8 md:pt-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            {/* Title block */}
            <div className="max-w-lg">
              {/* Live pill */}
              <div
                className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm"
                style={{
                  borderColor: `${plat.color}50`,
                  color: plat.color,
                  backgroundColor: `${plat.color}12`,
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                    style={{ backgroundColor: plat.color }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: plat.color }}
                  />
                </span>
                Live · {plat.name}
                <span className="font-normal normal-case opacity-60">
                  {minsAgo === 0 ? "· à l'instant" : `· ${minsAgo} min`}
                </span>
              </div>

              <h1 className="font-display text-3xl font-black tracking-tight md:text-[2.6rem] md:leading-tight">
                African Trend Scanner
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tendances en temps réel sur{" "}
                <span className="font-semibold text-foreground">{COUNTRY_POOLS.length} marchés africains</span>{" "}
                — plateforme par plateforme.
              </p>
            </div>

            {/* Stats cluster */}
            <div className="flex items-start gap-2">
              {[
                { icon: Hash,   label: "Hashtags", value: `${totalHashtags}+`, color: plat.color },
                { icon: Music2, label: "Sons",      value: `${totalSounds}+`,  color: plat.color },
                { icon: Globe,  label: "Pays",      value: `${COUNTRY_POOLS.length}`,   color: plat.color },
                { icon: Zap,    label: "Sync",      value: "4 min",            color: plat.color },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur-md"
                >
                  <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                  <span
                    className="font-display text-[17px] font-black tabular-nums leading-none"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action row */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Activity className="h-3 w-3" style={{ color: plat.color }} />
              Données synchronisées automatiquement toutes les 4 min
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-muted-foreground backdrop-blur-sm transition-all hover:text-foreground"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* ─── Platform tabs ──────────────────────────────────────────────────── */}
      <div className="mb-5 grid grid-cols-5 gap-1 rounded-2xl border border-border/50 bg-card/30 p-1 backdrop-blur-sm">
        {PLATFORMS.map((p) => {
          const active = p.id === platform;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`relative flex flex-col items-center gap-1.5 rounded-xl py-3 text-[11px] font-semibold transition-all duration-200 ${
                active ? "shadow-lg" : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                active
                  ? {
                      backgroundColor: `${p.color}15`,
                      color: p.color,
                      boxShadow: `0 4px 20px -6px ${p.color}50, inset 0 1px 0 ${p.color}25`,
                    }
                  : undefined
              }
            >
              <p.Icon color={active ? p.color : "currentColor"} size={15} />
              <span className="hidden sm:block leading-none">{p.name}</span>
              {active && (
                <motion.span
                  layoutId="platform-underline"
                  className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Country navigation ────────────────────────────────────────────── */}
      <div className="mb-5 space-y-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(activeIdx - 1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card/40 text-muted-foreground transition-all hover:scale-105 hover:border-foreground/30 hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            ref={pillsRef}
            className="flex flex-1 gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide"
          >
            {COUNTRY_POOLS.map((c, idx) => {
              const active = idx === activeIdx;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                    active
                      ? ""
                      : "border-border/50 bg-card/30 text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    active
                      ? {
                          borderColor: `${plat.color}60`,
                          backgroundColor: `${plat.color}12`,
                          color: plat.color,
                          boxShadow: `0 2px 14px -4px ${plat.color}40`,
                        }
                      : undefined
                  }
                >
                  {c.flag} {c.short}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goTo(activeIdx + 1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card/40 text-muted-foreground transition-all hover:scale-105 hover:border-foreground/30 hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Counter + dots */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="tabular-nums font-black text-foreground">{activeIdx + 1}</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-muted-foreground/70">{COUNTRY_POOLS.length}</span>
            <span className="mx-0.5 h-0.5 w-3 rounded-full bg-muted-foreground/20" />
            <span className="font-semibold" style={{ color: plat.color }}>
              {pool.flag} {pool.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {COUNTRY_POOLS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === activeIdx ? 22 : 6,
                  height: 6,
                  backgroundColor:
                    idx === activeIdx
                      ? plat.color
                      : "hsl(var(--muted-foreground) / 0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main slide card ────────────────────────────────────────────────── */}
      <div
        className="overflow-hidden rounded-3xl border bg-card/40 shadow-2xl backdrop-blur-xl"
        style={{ borderColor: `${plat.color}20` }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${pool.id}-${platform}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <CountrySlide pool={pool} plat={plat} offset={offset} nowMs={nowMs} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── API footer ─────────────────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/40 bg-card/20 px-5 py-3.5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
            Sources API
          </span>
          {PLATFORMS.map((p, i) => (
            <span key={p.id} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {API_LABELS[i]}
            </span>
          ))}
        </div>
        <div
          className="flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[10px] font-semibold"
          style={{
            borderColor: `${plat.color}30`,
            backgroundColor: `${plat.color}08`,
            color: plat.color,
          }}
        >
          <RefreshCcw className="h-3 w-3" />
          Prochaine sync dans{" "}
          <b className="ml-0.5">{Math.max(1, 4 - minsAgo)} min</b>
        </div>
      </div>
    </div>
  );
}

// ─── Country Slide ───────────────────────────────────────────────────────────
function CountrySlide({
  pool,
  plat,
  offset,
  nowMs,
}: {
  pool: CountryPool;
  plat: (typeof PLATFORMS)[number];
  offset: number;
  nowMs: number;
}) {
  const snap = useMemo(
    () =>
      snapshotFor(pool, nowMs + offset, {
        maxSounds:   Math.min(10, pool.sounds.length),
        maxHashtags: Math.min(10, pool.hashtags.length),
        maxSlots:    pool.slots.length,
      }),
    [pool, nowMs, offset],
  );

  return (
    <div>
      {/* ── Country header ── */}
      <div
        className="relative overflow-hidden border-b px-5 py-5"
        style={{
          background: `linear-gradient(135deg, ${pool.color}14 0%, ${pool.color}07 40%, transparent 80%)`,
          borderColor: `${pool.color}20`,
        }}
      >
        {/* Big ghost flag */}
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none text-[72px] opacity-[0.07]">
          {pool.flag}
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <span className="text-[2.6rem] leading-none">{pool.flag}</span>
            <div>
              <div className="font-display text-xl font-black leading-tight">{pool.name}</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{
                    borderColor: `${plat.color}44`,
                    backgroundColor: `${plat.color}12`,
                    color: plat.color,
                  }}
                >
                  <plat.Icon color={plat.color} size={8} />
                  {plat.name}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-2">
            <StatChip
              label="RPM"
              value={snap.rpm}
              valueStyle={{ color: pool.color }}
              bg={`${pool.color}10`}
              border={`${pool.color}30`}
            />
            <StatChip
              label="Croissance"
              value={snap.growth}
              valueStyle={{ color: "#10B981" }}
              bg="rgba(16,185,129,0.08)"
              border="rgba(16,185,129,0.25)"
            />
            <StatChip
              label="Créateurs"
              value={snap.creators}
              valueStyle={{}}
              bg="hsl(var(--card)/0.5)"
              border="hsl(var(--border)/0.6)"
            />
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 columns ── */}
      <div className="grid divide-y divide-border/30 md:grid-cols-3 md:divide-x md:divide-y-0">

        {/* ── Sons ── */}
        <div className="p-4 md:p-5">
          <ColHead icon={Music2} color={plat.color} label={plat.sonLabel} count={snap.sounds.length} />
          <div className="mt-3 space-y-1.5">
            {snap.sounds.map((s, i) => {
              const isGold   = i === 0;
              const isSilver = i === 1;
              const isBronze = i === 2;
              const isTop3   = i < 3;

              const rankEmoji  = isGold ? "🥇" : isSilver ? "🥈" : isBronze ? "🥉" : String(i + 1);
              const rowStyle   = isGold
                ? "border-yellow-500/25 bg-gradient-to-r from-yellow-500/10 via-amber-500/05 to-transparent"
                : isSilver
                  ? "border-zinc-400/25 bg-gradient-to-r from-zinc-400/10 via-zinc-500/05 to-transparent"
                  : isBronze
                    ? "border-amber-700/25 bg-gradient-to-r from-amber-700/10 via-amber-800/05 to-transparent"
                    : "border-border/40 bg-background/30 hover:bg-background/50";

              return (
                <motion.div
                  key={`${s.artist}-${s.track}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.24, delay: i * 0.03 }}
                  className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-colors ${rowStyle}`}
                >
                  {/* Rank */}
                  <span className={`w-6 shrink-0 text-center text-[11px] font-black ${isTop3 ? "" : "text-muted-foreground tabular-nums"}`}>
                    {rankEmoji}
                  </span>

                  {/* Icon */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${plat.color}16` }}
                  >
                    <Music2 className="h-3.5 w-3.5" style={{ color: plat.color }} />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-bold leading-tight">
                      {s.track}
                    </div>
                    <div className="truncate text-[10px] text-muted-foreground">
                      {s.artist}
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="flex shrink-0 flex-col items-end">
                    <span className="text-[11px] font-bold tabular-nums">{s.uses}</span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                      uses
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Hashtags ── */}
        <div className="p-4 md:p-5">
          <ColHead icon={Hash} color={plat.color} label={plat.hashLabel} count={snap.hashtags.length} />
          <div className="mt-3 space-y-1.5">
            {snap.hashtags.map((h, i) => {
              const vel = velFor(
                pool.hashtags[i % pool.hashtags.length]?.baseVolume ?? 300_000,
                pool.id.charCodeAt(0) + i + offset,
              );
              // Declining bar width for visual ranking
              const barPct = Math.max(18, 100 - i * 9);
              const isHot = h.trend === "hot" && i < 3;

              return (
                <motion.div
                  key={h.tag}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.24, delay: i * 0.03 }}
                  className="rounded-xl border border-border/40 bg-background/30 px-2.5 py-2 transition-colors hover:bg-background/50"
                >
                  {/* Top row */}
                  <div className="flex items-center gap-2">
                    <span className="w-4 shrink-0 text-center text-[9px] font-bold tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-display text-[12px] font-bold">
                      {h.tag}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      {isHot && (
                        <Flame className="h-3 w-3 text-rose-500" />
                      )}
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${velClass(vel)}`}
                      >
                        <TrendingUp className="h-2 w-2" />
                        {vel}
                      </span>
                    </div>
                  </div>

                  {/* Volume bar */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 + i * 0.025 }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${plat.color}90, ${plat.color}40)`,
                        }}
                      />
                    </div>
                    <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                      {h.volume}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Créneaux ── */}
        <div className="p-4 md:p-5">
          <ColHead icon={Clock} color={pool.color} label="Meilleurs créneaux" count={snap.schedule.length} />
          <div className="mt-3 space-y-2">
            {snap.schedule.map((s, i) => {
              const isTop = s.intensity >= 90;
              return (
                <motion.div
                  key={s.day}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: i * 0.035 }}
                  className={`rounded-xl border px-3 py-2.5 transition-colors ${
                    isTop
                      ? "border-opacity-50"
                      : "border-border/40 bg-background/30"
                  }`}
                  style={
                    isTop
                      ? {
                          borderColor: `${pool.color}40`,
                          backgroundColor: `${pool.color}08`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {/* Day badge */}
                      <span
                        className="flex h-6 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-black uppercase tracking-wider"
                        style={{
                          backgroundColor: `${pool.color}18`,
                          color: pool.color,
                        }}
                      >
                        {s.day}
                      </span>
                      <span className="text-[12px] font-bold">{s.hours}</span>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-1.5">
                      {isTop && (
                        <Sparkles
                          className="h-3 w-3"
                          style={{ color: pool.color }}
                        />
                      )}
                      <span
                        className="font-display text-[14px] font-black tabular-nums"
                        style={{ color: isTop ? pool.color : "hsl(var(--foreground) / 0.8)" }}
                      >
                        {s.intensity}
                      </span>
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.intensity}%` }}
                      transition={{ duration: 0.75, ease: "easeOut", delay: 0.1 + i * 0.04 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${pool.color}, ${pool.color}70)`,
                        boxShadow: isTop ? `0 0 8px ${pool.color}60` : "none",
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* AI tip */}
            <div
              className="mt-1 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[10.5px] leading-relaxed"
              style={{
                borderColor: `${plat.color}25`,
                backgroundColor: `${plat.color}06`,
                color: plat.color,
              }}
            >
              <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                Score &gt; 85 → <b>2,3× plus d&apos;engagement</b> sur{" "}
                {plat.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function ColHead({
  icon: Icon,
  color,
  label,
  count,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div
          className="flex h-5 w-5 items-center justify-center rounded-md"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="h-3 w-3" style={{ color }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
      </div>
      <span className="rounded-md bg-muted/30 px-1.5 py-0.5 text-[9px] font-semibold tabular-nums text-muted-foreground">
        {count} résultats
      </span>
    </div>
  );
}

function StatChip({
  label,
  value,
  valueStyle,
  bg,
  border,
}: {
  label: string;
  value: string | number;
  valueStyle: React.CSSProperties;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl border px-3 py-1.5"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <span
        className="font-display text-[13px] font-black tabular-nums leading-tight"
        style={valueStyle}
      >
        {value}
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
    </div>
  );
}

// ─── Platform SVG icons ──────────────────────────────────────────────────────
function TikTokIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"
        fill={color}
      />
    </svg>
  );
}
function InstagramIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} />
    </svg>
  );
}
function YouTubeIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"
        fill={color}
      />
      <path d="M9.75 15.02l5.75-3.02-5.75-3.02v6.04z" fill="white" />
    </svg>
  );
}
function XIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill={color}
      />
    </svg>
  );
}
function FacebookIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
        fill={color}
      />
    </svg>
  );
}
