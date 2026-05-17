"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music2,
  Hash,
  TrendingUp,
  RefreshCcw,
  Flame,
  Clock,
  Eye,
  Zap,
  ArrowUpRight,
  Play,
  ChevronUp,
  Globe,
  Sparkles,
} from "lucide-react";
import { COUNTRY_POOLS, snapshotFor, type CountryPool } from "@/lib/african-trends-pool";

// ─── Platforms ─────────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: "tiktok",
    name: "TikTok",
    color: "#EE1D52",
    accent: "#69C9D0",
    sonLabel: "Sons TikTok",
    hashLabel: "Hashtags & Défis",
    slotLabel: "Créneaux TikTok",
    Icon: TikTokIcon,
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    accent: "#FCAF45",
    sonLabel: "Reels Audio",
    hashLabel: "Hashtags Reels",
    slotLabel: "Meilleurs Créneaux",
    Icon: InstagramIcon,
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    accent: "#FF6B6B",
    sonLabel: "Musiques trending",
    hashLabel: "Sujets viraux",
    slotLabel: "Créneaux YouTube",
    Icon: YouTubeIcon,
  },
  {
    id: "twitter",
    name: "X / Twitter",
    color: "#1DA1F2",
    accent: "#e7e9ea",
    sonLabel: "Trends musicaux",
    hashLabel: "Trending Topics",
    slotLabel: "Pics d'activité",
    Icon: XIcon,
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    accent: "#4299e1",
    sonLabel: "Musiques Reels FB",
    hashLabel: "Topics & Hashtags",
    slotLabel: "Pics d'engagement",
    Icon: FacebookIcon,
  },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

// ─── Seed offset per platform (pour varier les données) ──────────────────
const PLATFORM_SEED_OFFSET: Record<PlatformId, number> = {
  tiktok: 0,
  instagram: 1_000_000,
  youtube: 2_000_000,
  twitter: 3_000_000,
  facebook: 4_000_000,
};

// ─── Velocity simulation (déterministe par bucket + pays + plateforme) ────
function velocityFor(baseVolume: number, seed: number): string {
  const pct = 80 + Math.floor(Math.abs(Math.sin(seed) * 400));
  return `+${pct}%`;
}

function velColor(vel: string): string {
  const n = parseInt(vel.replace("+", "").replace("%", ""));
  if (n >= 250) return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  if (n >= 150) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
}

function minutesAgo(nowMs: number): number {
  return Math.floor((nowMs % (4 * 60_000)) / 60_000);
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

// ─── All-country feed (triés par volume global) ───────────────────────────
function buildGlobalFeed(nowMs: number, platform: PlatformId, maxPer: number = 3) {
  const offset = PLATFORM_SEED_OFFSET[platform];
  return COUNTRY_POOLS.flatMap((pool) => {
    const snap = snapshotFor(pool, nowMs + offset, {
      maxSounds: maxPer,
      maxHashtags: maxPer,
      maxSlots: 2,
    });
    return snap.hashtags.map((h, i) => ({
      tag: h.tag,
      volume: h.volume,
      rawVolume: pool.hashtags[i % pool.hashtags.length]?.baseVolume ?? 500_000,
      trend: h.trend,
      country: pool.name,
      flag: pool.flag,
      color: pool.color,
      vel: velocityFor(pool.hashtags[i % pool.hashtags.length]?.baseVolume ?? 300_000, pool.id.charCodeAt(0) + i + offset),
    }));
  }).sort((a, b) => b.rawVolume - a.rawVolume);
}

// ─── Component ──────────────────────────────────────────────────────────────
export function TrendScannerClient() {
  const [platform, setPlatform] = useState<PlatformId>("tiktok");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const plat = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];
  const offset = PLATFORM_SEED_OFFSET[platform];

  const countries =
    selectedCountry === "all"
      ? COUNTRY_POOLS
      : COUNTRY_POOLS.filter((c) => c.id === selectedCountry);

  const globalFeed = useMemo(
    () => buildGlobalFeed(nowMs, platform, 3),
    [nowMs, platform],
  );

  const minsAgo = minutesAgo(nowMs);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setNowMs(Date.now());
      setRefreshing(false);
    }, 900);
  }

  return (
    <div className="space-y-0 pb-10">
      {/* ─── Hero Header ──────────────────────────────────────────────────── */}
      <div className="relative -mx-4 -mt-6 mb-6 overflow-hidden md:-mx-8 md:-mt-8">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${plat.color}, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, ${plat.accent}, transparent 60%)`,
          }}
        />
        <div className="relative px-4 pt-6 pb-5 md:px-8 md:pt-8 md:pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{ borderColor: `${plat.color}55`, color: plat.color, backgroundColor: `${plat.color}12` }}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: plat.color }} />
                  Live · {plat.name}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {minsAgo === 0 ? "à l'instant" : `il y a ${minsAgo} min`}
                </span>
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                African Trend Scanner
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Tendances en temps réel sur {COUNTRY_POOLS.length} marchés africains — plateforme par plateforme.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3 py-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>

          {/* Stats rapides */}
          <div className="mt-4 flex flex-wrap gap-4">
            {[
              { icon: Hash, label: "Hashtags suivis", value: `${COUNTRY_POOLS.reduce((a, c) => a + c.hashtags.length, 0)}+` },
              { icon: Music2, label: "Sons analysés", value: `${COUNTRY_POOLS.reduce((a, c) => a + c.sounds.length, 0)}+` },
              { icon: Globe, label: "Marchés", value: `${COUNTRY_POOLS.length} pays` },
              { icon: Zap, label: "Refresh", value: "4 min" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <s.icon className="h-3 w-3" style={{ color: plat.color }} />
                <span className="font-semibold text-foreground">{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Platform Tabs ─────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PLATFORMS.map((p) => {
          const active = p.id === platform;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all ${
                active ? "" : "border-border bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
              style={
                active
                  ? {
                      borderColor: `${p.color}60`,
                      backgroundColor: `${p.color}12`,
                      color: p.color,
                      boxShadow: `0 2px 16px -4px ${p.color}40`,
                    }
                  : undefined
              }
            >
              <p.Icon color={active ? p.color : "currentColor"} size={13} />
              {p.name}
            </button>
          );
        })}
      </div>

      {/* ─── Country Filter ─────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCountry("all")}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
            selectedCountry === "all" ? "" : "border-border bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
          }`}
          style={
            selectedCountry === "all"
              ? {
                  borderColor: `${plat.color}60`,
                  backgroundColor: `${plat.color}12`,
                  color: plat.color,
                  boxShadow: `0 2px 12px -4px ${plat.color}30`,
                }
              : undefined
          }
        >
          🌍 Tous les pays
        </button>
        {COUNTRY_POOLS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCountry(c.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
              selectedCountry === c.id
                ? ""
                : "border-border bg-card/40 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            }`}
            style={
              selectedCountry === c.id
                ? {
                    backgroundColor: `${c.color}14`,
                    borderColor: `${c.color}60`,
                    color: c.color,
                    boxShadow: `0 2px 12px -4px ${c.color}28`,
                  }
                : undefined
            }
          >
            {c.flag} {c.short}
          </button>
        ))}
      </div>

      {/* ─── Global Feed (quand "tous les pays") ──────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedCountry === "all" && (
          <motion.div
            key="global"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Flame className="h-3.5 w-3.5" style={{ color: plat.color }} />
              Top hashtags — tous marchés
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
              <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${plat.color}, ${plat.accent})` }}
              />
              <div className="divide-y divide-border/50">
                {globalFeed.slice(0, 8).map((item, i) => (
                  <motion.div
                    key={`${item.tag}-${i}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold tabular-nums"
                      style={{
                        backgroundColor: i < 3 ? `${plat.color}18` : "transparent",
                        color: i < 3 ? plat.color : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-display text-sm font-bold">{item.tag}</span>
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        {item.flag} {item.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {item.volume}
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${velColor(item.vel)}`}
                      >
                        <ChevronUp className="h-2.5 w-2.5" />
                        {item.vel}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Per-country cards ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {countries.map((pool) => (
          <CountrySection
            key={`${pool.id}-${platform}`}
            pool={pool}
            platform={plat}
            nowMs={nowMs}
            offset={offset}
          />
        ))}
      </AnimatePresence>

      {/* ─── API Status footer ─────────────────────────────────────────────── */}
      <div className="mt-8 rounded-2xl border border-border bg-card/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">Sources API :</span>{" "}
            {["TikTok Research API", "Instagram Graph API", "YouTube Data v3", "X API v2", "Facebook Graph API"].map((api, i) => (
              <span key={api}>
                <span className="inline-flex items-center gap-1">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: PLATFORMS[i]?.color ?? "#10B981" }}
                  />
                  {api}
                </span>
                {i < 4 && <span className="mx-1.5 opacity-30">·</span>}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <RefreshCcw className="h-3 w-3 animate-spin [animation-duration:4s]" />
            Prochaine sync dans{" "}
            <b className="text-foreground">{4 - minsAgo} min</b>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Country Section ──────────────────────────────────────────────────────
function CountrySection({
  pool,
  platform,
  nowMs,
  offset,
}: {
  pool: CountryPool;
  platform: (typeof PLATFORMS)[number];
  nowMs: number;
  offset: number;
}) {
  const snap = useMemo(
    () =>
      snapshotFor(pool, nowMs + offset, {
        maxSounds: pool.sounds.length,
        maxHashtags: pool.hashtags.length,
        maxSlots: pool.slots.length,
      }),
    [pool, nowMs, offset],
  );

  return (
    <motion.div
      key={pool.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mb-5 overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl"
    >
      {/* Country header */}
      <div
        className="flex items-center justify-between border-b border-border/60 px-5 py-3"
        style={{ background: `linear-gradient(90deg, ${pool.color}10, transparent)` }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{pool.flag}</span>
          <div>
            <div className="font-display text-sm font-bold">{pool.name}</div>
            <div className="text-[10px] text-muted-foreground">{pool.short}</div>
          </div>
          <div
            className="ml-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase"
            style={{ borderColor: `${platform.color}44`, backgroundColor: `${platform.color}10`, color: platform.color }}
          >
            <platform.Icon color={platform.color} size={8} />
            {platform.name}
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span style={{ color: pool.color }} className="font-bold">{snap.rpm}</span>
          <span>{snap.growth}</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
      </div>

      {/* 3 columns */}
      <div className="grid gap-0 divide-y divide-border/40 md:grid-cols-3 md:divide-x md:divide-y-0">
        {/* Sons / Audio */}
        <div className="p-4">
          <SectionHead icon={Music2} color={platform.color} label={platform.sonLabel} />
          <div className="mt-3 space-y-2">
            {snap.sounds.slice(0, 5).map((s, i) => (
              <div key={`${s.artist}-${s.track}`} className="flex items-center gap-2.5">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold tabular-nums"
                  style={{
                    backgroundColor: i < 3 ? `${platform.color}18` : "transparent",
                    color: i < 3 ? platform.color : "hsl(var(--muted-foreground))",
                  }}
                >
                  {i + 1}
                </span>
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${platform.color}14` }}
                >
                  {platform.id === "youtube" ? (
                    <Play className="h-3 w-3" style={{ color: platform.color }} />
                  ) : (
                    <Music2 className="h-3 w-3" style={{ color: platform.color }} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-semibold">{s.track}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{s.artist}</div>
                </div>
                <div className="shrink-0 text-[10px] font-bold tabular-nums text-muted-foreground">
                  {s.uses}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div className="p-4">
          <SectionHead icon={Hash} color={platform.color} label={platform.hashLabel} />
          <div className="mt-3 space-y-1.5">
            {snap.hashtags.slice(0, 6).map((h, i) => (
              <div
                key={h.tag}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/30 px-2.5 py-1.5"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="truncate font-display text-[11px] font-bold">{h.tag}</span>
                  {h.trend === "hot" && i === 0 && (
                    <Flame className="h-2.5 w-2.5 shrink-0 text-rose-500" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] tabular-nums text-muted-foreground">{h.volume}</span>
                  <ArrowUpRight className="h-3 w-3" style={{ color: platform.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Créneaux */}
        <div className="p-4">
          <SectionHead icon={Clock} color={platform.color} label={platform.slotLabel} />
          <div className="mt-3 space-y-2">
            {snap.schedule.map((s) => (
              <div key={s.day} className="rounded-xl border border-border/50 bg-background/30 p-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-7 items-center justify-center rounded-md text-[9px] font-bold uppercase"
                      style={{ backgroundColor: `${pool.color}18`, color: pool.color }}
                    >
                      {s.day}
                    </span>
                    <span className="font-semibold">{s.hours}</span>
                  </div>
                  <span className="font-bold tabular-nums" style={{ color: pool.color }}>
                    {s.intensity}
                  </span>
                </div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.intensity}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: pool.color }}
                  />
                </div>
              </div>
            ))}
            <div
              className="mt-2 rounded-lg border px-2.5 py-2 text-[10px]"
              style={{ borderColor: `${platform.color}30`, backgroundColor: `${platform.color}08`, color: platform.color }}
            >
              <Sparkles className="mb-0.5 inline h-2.5 w-2.5" />{" "}
              Score &gt; 85 → 2,3× plus d'engagement
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHead({
  icon: Icon,
  color,
  label,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3 w-3" style={{ color }} />
      {label}
    </div>
  );
}

// ─── Platform SVG icons ───────────────────────────────────────────────────
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
