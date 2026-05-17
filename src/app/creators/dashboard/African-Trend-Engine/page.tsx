"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music2,
  Hash,
  Clock,
  TrendingUp,
  MapPin,
  Sparkles,
  Users,
  RefreshCcw,
  Flame,
  Globe,
  ArrowUpRight,
  BarChart3,
  Zap,
} from "lucide-react";
import { COUNTRY_POOLS, snapshotFor } from "@/lib/african-trends-pool";

const HOUR_MS = 60 * 60 * 1000;

type Tab = "sons" | "hashtags" | "creneaux";

function minutesUntilNextHour(nowMs: number): number {
  return 60 - Math.floor((nowMs % HOUR_MS) / 60_000);
}

export default function AfricanTrendEnginePage() {
  const [selectedId, setSelectedId] = useState(COUNTRY_POOLS[0].id);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [activeTab, setActiveTab] = useState<Tab>("sons");

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const pool = COUNTRY_POOLS.find((c) => c.id === selectedId) ?? COUNTRY_POOLS[0];

  // Full snapshot: show all sounds, all hashtags, all slots
  const snapshot = useMemo(
    () =>
      snapshotFor(pool, nowMs, {
        maxSounds: pool.sounds.length,
        maxHashtags: pool.hashtags.length,
        maxSlots: pool.slots.length,
      }),
    [pool, nowMs],
  );

  const minsUntilRefresh = minutesUntilNextHour(nowMs);
  const lastUpdated = new Date(nowMs - (nowMs % HOUR_MS)).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const TABS: { key: Tab; label: string; icon: typeof Music2 }[] = [
    { key: "sons", label: "Sons trending", icon: Music2 },
    { key: "hashtags", label: "Hashtags", icon: Hash },
    { key: "creneaux", label: "Meilleurs créneaux", icon: Clock },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* ─── Header ─── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF8A00]">
              <MapPin className="h-3 w-3" /> African Trend Engine
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live
            </div>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
            Trends africains en temps réel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sons, hashtags et meilleurs créneaux — organisés par pays, mis à jour toutes les heures.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3 py-2 text-[11px] text-muted-foreground">
            <RefreshCcw className="h-3 w-3 animate-spin [animation-duration:6s]" />
            Prochain refresh dans{" "}
            <b className="text-foreground">{minsUntilRefresh} min</b>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Dernière mise à jour : <b className="text-foreground">{lastUpdated}</b>
          </div>
        </div>
      </div>

      {/* ─── Stats overview ─── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { icon: Globe, label: "Marchés couverts", value: `${COUNTRY_POOLS.length}`, sub: "pays africains", color: "#FF8A00" },
          { icon: Music2, label: "Sons analysés", value: `${COUNTRY_POOLS.reduce((a, c) => a + c.sounds.length, 0)}+`, sub: "par pays", color: "#EC4899" },
          { icon: Hash, label: "Hashtags suivis", value: `${COUNTRY_POOLS.reduce((a, c) => a + c.hashtags.length, 0)}+`, sub: "toutes régions", color: "#1FBEAF" },
          { icon: Zap, label: "Refresh interval", value: "1h", sub: "données fraîches", color: "#FBBF24" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
              style={{ backgroundColor: `${stat.color}1A`, borderColor: `${stat.color}44` }}
            >
              <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
              <div className="font-display text-xl font-bold leading-tight">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Country tabs ─── */}
      <div className="flex flex-wrap gap-2">
        {COUNTRY_POOLS.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "text-foreground"
                  : "border-border bg-card/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
              style={
                active
                  ? {
                      backgroundColor: `${c.color}1A`,
                      borderColor: `${c.color}66`,
                      boxShadow: `0 4px 16px -4px ${c.color}33`,
                    }
                  : undefined
              }
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Country panel ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-xl"
        >
          {/* Country header stats */}
          <div
            className="relative border-b border-border/60 bg-gradient-to-r from-card/80 to-card/40 px-5 py-4 md:px-7 md:py-5"
            style={{
              background: `linear-gradient(135deg, ${pool.color}08 0%, transparent 60%)`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-3xl"
              style={{
                background: `linear-gradient(90deg, ${pool.color}99, ${pool.color}33)`,
              }}
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Pays
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-xl">{pool.flag}</span>
                  <span className="font-display text-base font-bold">{pool.name}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">{pool.short}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  RPM moyen
                </div>
                <div className="font-display text-xl font-bold" style={{ color: pool.color }}>
                  {snapshot.rpm}
                </div>
                <div className="text-[10px] text-muted-foreground">{snapshot.growth} ce mois</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Créateurs actifs
                </div>
                <div className="font-display text-xl font-bold">{snapshot.creators}</div>
                <div className="text-[10px] text-muted-foreground">30 derniers jours</div>
              </div>
              <div className="flex items-start justify-end">
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[10px] text-muted-foreground">
                  <RefreshCcw className="h-2.5 w-2.5 animate-spin [animation-duration:4s]" />
                  Actualisé à {lastUpdated}
                </div>
              </div>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex border-b border-border/60 bg-background/20 px-5 md:px-7">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                style={
                  activeTab === tab.key
                    ? { borderColor: pool.color, color: pool.color }
                    : undefined
                }
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5 md:p-7">
            <AnimatePresence mode="wait">
              {activeTab === "sons" && (
                <motion.div
                  key="sons"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                      <Music2 className="h-4 w-4" style={{ color: pool.color }} />
                      Sons trending · {pool.name}
                    </h2>
                    <span className="text-[10px] text-muted-foreground">
                      {snapshot.sounds.length} sons analysés
                    </span>
                  </div>
                  <div className="space-y-2">
                    {snapshot.sounds.map((s, i) => (
                      <motion.div
                        key={`${s.artist}-${s.track}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3.5"
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold tabular-nums"
                          style={{
                            backgroundColor: i < 3 ? `${pool.color}1A` : "transparent",
                            borderColor: i < 3 ? `${pool.color}44` : "hsl(var(--border))",
                            color: i < 3 ? pool.color : "hsl(var(--muted-foreground))",
                          }}
                        >
                          {i + 1}
                        </div>
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${pool.color}14` }}
                        >
                          <Flame className="h-4 w-4" style={{ color: pool.color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-display text-sm font-bold">
                              {s.track}
                            </span>
                            {i === 0 && (
                              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wide text-rose-500">
                                <Flame className="h-2.5 w-2.5" /> #1
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {s.artist} · {s.uses} utilisations
                          </div>
                          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${s.momentum}%` }}
                              transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.04 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: pool.color }}
                            />
                          </div>
                        </div>
                        <div
                          className="shrink-0 font-display text-sm font-bold tabular-nums"
                          style={{ color: pool.color }}
                        >
                          {s.momentum}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "hashtags" && (
                <motion.div
                  key="hashtags"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                      <Hash className="h-4 w-4" style={{ color: pool.color }} />
                      Hashtags trending · {pool.name}
                    </h2>
                    <span className="text-[10px] text-muted-foreground">
                      {snapshot.hashtags.length} hashtags suivis
                    </span>
                  </div>
                  <div className="space-y-2">
                    {snapshot.hashtags.map((h, i) => (
                      <motion.div
                        key={h.tag}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold tabular-nums"
                            style={{
                              backgroundColor: i < 3 ? `${pool.color}18` : "transparent",
                              color: i < 3 ? pool.color : "hsl(var(--muted-foreground))",
                            }}
                          >
                            {i + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display text-sm font-bold">{h.tag}</span>
                              {h.trend === "hot" && (
                                <span className="inline-flex items-center gap-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wide text-rose-500">
                                  <Flame className="h-2.5 w-2.5" /> Hot
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-display text-sm font-bold tabular-nums">
                              {h.volume}
                            </div>
                            <div className="text-[10px] text-muted-foreground">vues</div>
                          </div>
                          <ArrowUpRight
                            className="h-3.5 w-3.5"
                            style={{ color: pool.color }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "creneaux" && (
                <motion.div
                  key="creneaux"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                      <Clock className="h-4 w-4" style={{ color: pool.color }} />
                      Meilleurs créneaux · {pool.name}
                    </h2>
                    <span className="text-[10px] text-muted-foreground">
                      Score d'engagement estimé
                    </span>
                  </div>
                  <div className="space-y-2">
                    {snapshot.schedule.map((s, i) => (
                      <motion.div
                        key={s.day}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.05 }}
                        className="rounded-xl border border-border bg-background/40 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-8 w-10 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold uppercase"
                              style={{
                                backgroundColor: `${pool.color}18`,
                                color: pool.color,
                              }}
                            >
                              {s.day}
                            </span>
                            <div>
                              <div className="font-display text-sm font-semibold">
                                {s.hours}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                heure locale · {pool.short}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className="font-display text-base font-bold"
                              style={{ color: pool.color }}
                            >
                              {s.intensity}
                            </div>
                            <div className="text-[10px] text-muted-foreground">score</div>
                          </div>
                        </div>
                        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.intensity}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + i * 0.05 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: pool.color }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-[#1FBEAF]/30 bg-[#1FBEAF]/8 p-4 text-[12px] text-[#1FBEAF] dark:text-[#1FBEAF]/90">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="h-3.5 w-3.5" /> Conseil IA
                    </div>
                    <p className="mt-1 text-[#1FBEAF]/80">
                      Les créneaux avec un score &gt; 85 génèrent en moyenne{" "}
                      <b className="text-[#1FBEAF]">2,3× plus d'engagement</b> que les publications
                      hors pic.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ─── All countries summary grid ─── */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <BarChart3 className="h-4 w-4" /> Vue d'ensemble — tous les marchés
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRY_POOLS.map((c) => {
            const snap = snapshotFor(c, nowMs, { maxSounds: 3, maxHashtags: 3, maxSlots: 2 });
            const isSelected = c.id === selectedId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedId(c.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`text-left rounded-2xl border p-4 transition-all hover:shadow-md ${
                  isSelected
                    ? "border-opacity-60 shadow-md"
                    : "border-border bg-card/40 hover:border-foreground/20"
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: `${c.color}55`,
                        backgroundColor: `${c.color}0D`,
                        boxShadow: `0 4px 20px -6px ${c.color}33`,
                      }
                    : undefined
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{c.flag}</span>
                    <div>
                      <div className="font-display text-sm font-bold">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.short}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-bold" style={{ color: c.color }}>
                      {snap.rpm}
                    </div>
                    <div className="text-[9px] text-muted-foreground">{snap.growth}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {snap.hashtags.slice(0, 3).map((h) => (
                    <span
                      key={h.tag}
                      className="rounded-full border px-2 py-0.5 text-[9px] font-semibold"
                      style={{
                        borderColor: `${c.color}33`,
                        backgroundColor: `${c.color}0D`,
                        color: c.color,
                      }}
                    >
                      {h.tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground">
                  {snap.sounds[0] && (
                    <span>
                      🎵 {snap.sounds[0].artist} — {snap.sounds[0].track}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Platform connection info ─── */}
      <div className="rounded-2xl border border-border bg-card/30 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <Globe className="h-4 w-4 text-[#1FBEAF]" />
              Sources de données
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Données agrégées depuis les plateformes sociales africaines les plus actives.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["TikTok", "Instagram", "YouTube", "Twitter/X", "Facebook"].map((p) => (
              <span
                key={p}
                className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-[11px] font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: RefreshCcw, label: "Actualisation", value: "Toutes les heures", color: "#1FBEAF" },
            { icon: TrendingUp, label: "Marchés couverts", value: `${COUNTRY_POOLS.length} pays africains`, color: "#EC4899" },
            { icon: Users, label: "Créateurs suivis", value: `${COUNTRY_POOLS.reduce((a, c) => a + c.baseCreators, 0).toLocaleString("fr-FR")}+`, color: "#FF8A00" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-background/30 p-3"
            >
              <item.icon className="h-4 w-4 shrink-0" style={{ color: item.color }} />
              <div>
                <div className="text-[10px] text-muted-foreground">{item.label}</div>
                <div className="text-xs font-semibold">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
