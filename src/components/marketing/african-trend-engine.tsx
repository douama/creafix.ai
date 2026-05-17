"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { COUNTRY_POOLS, snapshotFor, REFRESH_INTERVAL_MS } from "@/lib/african-trends-pool";

// Legacy type pour le rendu UI (champs identiques au snapshot enrichi).
type Country = {
  id: string;
  flag: string;
  name: string;
  short: string;
  rpm: string;
  growth: string;
  creators: string;
  color: string;
  sounds: { artist: string; track: string; uses: string; momentum: number }[];
  hashtags: { tag: string; volume: string; trend: "up" | "hot" }[];
  schedule: { day: string; hours: string; intensity: number }[];
};


const SOUND_ROTATION_MS = 3800;

/** Calcule combien de minutes se sont écoulées dans le bucket courant (0-3). */
function minutesIntoBucket(nowMs: number): number {
  return Math.floor((nowMs % REFRESH_INTERVAL_MS) / 60_000);
}

export function AfricanTrendEngine() {
  const [selectedId, setSelectedId] = useState(COUNTRY_POOLS[0].id);
  const pool = COUNTRY_POOLS.find((c) => c.id === selectedId) ?? COUNTRY_POOLS[0];

  // Snapshot dynamique (recomputé à chaque tick + au changement de pays).
  // tickMs change toutes les 60s — bucket de 4 min seul détermine si rotation effective.
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const snapshot = useMemo(() => snapshotFor(pool, nowMs), [pool, nowMs]);
  const minsAgo = minutesIntoBucket(nowMs);

  // Country composite : statique (color/flag/name) + dynamique (snapshot)
  const country: Country = useMemo(
    () => ({
      id: pool.id,
      flag: pool.flag,
      name: pool.name,
      short: pool.short,
      color: pool.color,
      rpm: snapshot.rpm,
      growth: snapshot.growth,
      creators: snapshot.creators,
      sounds: snapshot.sounds,
      hashtags: snapshot.hashtags,
      schedule: snapshot.schedule,
    }),
    [pool, snapshot],
  );

  // Rotation des sons trending dans la card (différent du bucket 4-min)
  const [soundIdx, setSoundIdx] = useState(0);
  useEffect(() => {
    setSoundIdx(0);
    const id = setInterval(() => {
      setSoundIdx((i) => (i + 1) % country.sounds.length);
    }, SOUND_ROTATION_MS);
    return () => clearInterval(id);
  }, [country.id, country.sounds.length, snapshot.bucket]);

  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-30 blur-3xl" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FF8A00]"
          >
            <MapPin className="h-3 w-3" /> African Trend Engine
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Le seul outil qui{" "}
            <span className="gradient-text">comprend l&apos;Afrique</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            Sons trending, hashtags, RPM, créneaux par pays — mis à jour
            automatiquement depuis l&apos;écoute de 9 marchés africains.
          </motion.p>
        </div>

        {/* Tabs pays */}
        <div className="mx-auto mt-7 flex max-w-4xl flex-wrap items-center justify-center gap-2">
          {COUNTRY_POOLS.map((c) => {
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
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
                {active && (
                  <motion.span
                    layoutId="country-active-dot"
                    className="ml-0.5 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={country.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-7 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/60 via-card/40 to-card/40 backdrop-blur-2xl"
          >
            <div
              className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[800px] -translate-x-1/2 rounded-full blur-3xl"
              style={{ backgroundColor: `${country.color}26` }}
            />

            {/* Header stats */}
            <div className="relative grid grid-cols-2 gap-3 border-b border-border/60 bg-background/40 p-4 md:grid-cols-4 md:p-6">
              <Stat icon={MapPin} label="Pays" value={country.name} sub={country.short} color={country.color} />
              <Stat icon={TrendingUp} label="RPM moyen" value={country.rpm} sub={country.growth} color={country.color} />
              <Stat icon={Users} label="Créateurs actifs" value={country.creators} sub="actifs 30 j" color={country.color} />
              <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground md:col-span-1">
                <RefreshCcw className="h-3 w-3 animate-spin [animation-duration:4s]" />
                <span>
                  Mis à jour {minsAgo === 0 ? "à l'instant" : `il y a ${minsAgo} min`}
                </span>
              </div>
            </div>

            {/* Body : 3 columns */}
            <div className="relative grid gap-5 p-5 md:p-7 lg:grid-cols-3">
              {/* Sons trending */}
              <div className="space-y-3">
                <SectionTitle icon={Music2} color={country.color}>
                  Sons trending
                </SectionTitle>

                <div className="relative h-[120px] overflow-hidden rounded-xl border border-border bg-background/40 p-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${country.id}-sound-${soundIdx}`}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.35 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg"
                        style={{
                          backgroundColor: `${country.color}1A`,
                          borderColor: `${country.color}66`,
                        }}
                      >
                        <Flame className="h-5 w-5" style={{ color: country.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-display text-sm font-bold">
                          {country.sounds[soundIdx].track}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {country.sounds[soundIdx].artist} · {country.sounds[soundIdx].uses} utilisations
                        </div>
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${country.sounds[soundIdx].momentum}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: country.color }}
                          />
                        </div>
                      </div>
                      <div
                        className="text-right font-display text-base font-bold"
                        style={{ color: country.color }}
                      >
                        {country.sounds[soundIdx].momentum}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Indicateur position */}
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                    {country.sounds.map((_, i) => (
                      <span
                        key={i}
                        className="h-1 rounded-full transition-all"
                        style={{
                          width: i === soundIdx ? 16 : 6,
                          backgroundColor:
                            i === soundIdx ? country.color : "hsl(var(--muted-foreground) / 0.3)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Liste compact des autres */}
                <ul className="space-y-1.5">
                  {country.sounds.map((s, i) => (
                    <li
                      key={`${s.artist}-${s.track}`}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors ${
                        i === soundIdx
                          ? "border-foreground/20 bg-background/70"
                          : "border-border/50 bg-background/30 opacity-70"
                      }`}
                    >
                      <span
                        className="h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: country.color }}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {s.artist} — {s.track}
                      </span>
                      <span className="shrink-0 text-muted-foreground">{s.uses}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hashtags */}
              <div className="space-y-3">
                <SectionTitle icon={Hash} color={country.color}>
                  Hashtags trending
                </SectionTitle>
                <ul className="space-y-2">
                  {country.hashtags.map((h, i) => (
                    <motion.li
                      key={h.tag}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background/40 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold">{h.tag}</span>
                        {h.trend === "hot" && (
                          <span className="inline-flex items-center gap-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
                            <Flame className="h-2.5 w-2.5" />
                            Hot
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {h.volume}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Best posting times */}
              <div className="space-y-3">
                <SectionTitle icon={Clock} color={country.color}>
                  Meilleurs créneaux
                </SectionTitle>
                <div className="space-y-2">
                  {country.schedule.map((s, i) => (
                    <motion.div
                      key={s.day}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="rounded-xl border border-border bg-background/40 p-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-background/80 text-[10px] font-bold uppercase">
                            {s.day}
                          </span>
                          <span className="font-display font-semibold">{s.hours}</span>
                        </div>
                        <span
                          className="font-display text-sm font-bold"
                          style={{ color: country.color }}
                        >
                          {s.intensity}
                        </span>
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.intensity}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + i * 0.04 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: country.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link
                  href="/creators/dashboard/African-Trend-Engine"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-semibold transition-colors hover:opacity-90"
                  style={{
                    borderColor: `${country.color}55`,
                    backgroundColor: `${country.color}1A`,
                    color: country.color,
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  Accès complet à {country.name}
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          +3 pays bientôt : Ghana 🇬🇭, Mali 🇲🇱, RDC 🇨🇩
        </p>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
        style={{
          backgroundColor: `${color}1A`,
          borderColor: `${color}55`,
        }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="font-display text-base font-bold leading-tight">
          {value}
        </div>
        <div className="text-[10px] text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  color,
  children,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:text-[11px]">
      <Icon className="h-3 w-3" style={{ color }} />
      {children}
    </div>
  );
}
