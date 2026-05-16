"use client";

import { useEffect, useState } from "react";
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

const COUNTRIES: Country[] = [
  {
    id: "sn",
    flag: "🇸🇳",
    name: "Sénégal",
    short: "Dakar",
    rpm: "$1.80",
    growth: "+34%",
    creators: "2 480",
    color: "#FF8A00",
    sounds: [
      { artist: "Wally B. Seck", track: "Naari", uses: "412K", momentum: 92 },
      { artist: "ISS 814", track: "Bayil", uses: "284K", momentum: 78 },
      { artist: "Sidiki Diabaté", track: "Diarabi", uses: "196K", momentum: 64 },
      { artist: "Ngaaka Blindé", track: "Mama Africa", uses: "152K", momentum: 58 },
    ],
    hashtags: [
      { tag: "#dakartwitter", volume: "1.2M", trend: "hot" },
      { tag: "#senegal2026", volume: "840K", trend: "up" },
      { tag: "#mbalax", volume: "612K", trend: "up" },
      { tag: "#tiktokdakar", volume: "498K", trend: "up" },
    ],
    schedule: [
      { day: "Lun", hours: "20h–22h", intensity: 88 },
      { day: "Mer", hours: "19h–21h", intensity: 76 },
      { day: "Ven", hours: "21h–23h", intensity: 94 },
      { day: "Dim", hours: "18h–20h", intensity: 82 },
    ],
  },
  {
    id: "ci",
    flag: "🇨🇮",
    name: "Côte d'Ivoire",
    short: "Abidjan",
    rpm: "$1.60",
    growth: "+42%",
    creators: "1 920",
    color: "#FF8A00",
    sounds: [
      { artist: "Didi B", track: "Lou Pra", uses: "528K", momentum: 96 },
      { artist: "Suspect 95", track: "Banyam", uses: "362K", momentum: 84 },
      { artist: "Tam Sir", track: "Coup du marteau", uses: "248K", momentum: 71 },
      { artist: "Roseline Layo", track: "Femme du forgeron", uses: "184K", momentum: 62 },
    ],
    hashtags: [
      { tag: "#abidjantiktok", volume: "1.8M", trend: "hot" },
      { tag: "#coupedecaler", volume: "920K", trend: "up" },
      { tag: "#civ225", volume: "742K", trend: "up" },
      { tag: "#zouglou", volume: "412K", trend: "up" },
    ],
    schedule: [
      { day: "Mar", hours: "19h–21h", intensity: 82 },
      { day: "Jeu", hours: "20h–22h", intensity: 90 },
      { day: "Sam", hours: "21h–00h", intensity: 96 },
      { day: "Dim", hours: "17h–19h", intensity: 74 },
    ],
  },
  {
    id: "ng",
    flag: "🇳🇬",
    name: "Nigeria",
    short: "Lagos",
    rpm: "$2.40",
    growth: "+58%",
    creators: "8 760",
    color: "#10B981",
    sounds: [
      { artist: "Davido", track: "Awuke", uses: "1.4M", momentum: 98 },
      { artist: "Asake", track: "Lonely at the Top", uses: "892K", momentum: 91 },
      { artist: "Burna Boy", track: "Higher", uses: "682K", momentum: 84 },
      { artist: "Rema", track: "Hehehe", uses: "548K", momentum: 78 },
    ],
    hashtags: [
      { tag: "#nigeriatiktok", volume: "3.2M", trend: "hot" },
      { tag: "#afrobeats", volume: "2.4M", trend: "hot" },
      { tag: "#lagoslife", volume: "1.6M", trend: "up" },
      { tag: "#9jatwitter", volume: "1.1M", trend: "up" },
    ],
    schedule: [
      { day: "Lun", hours: "21h–23h", intensity: 86 },
      { day: "Mer", hours: "20h–22h", intensity: 78 },
      { day: "Ven", hours: "22h–01h", intensity: 98 },
      { day: "Sam", hours: "19h–21h", intensity: 88 },
    ],
  },
  {
    id: "ma",
    flag: "🇲🇦",
    name: "Maroc",
    short: "Rabat",
    rpm: "$3.10",
    growth: "+27%",
    creators: "3 240",
    color: "#7B61FF",
    sounds: [
      { artist: "ElGrandeToto", track: "Madrid", uses: "624K", momentum: 89 },
      { artist: "Inkonnu", track: "Mafia", uses: "412K", momentum: 76 },
      { artist: "Hatim Ammor", track: "Galbi Habba", uses: "284K", momentum: 68 },
      { artist: "Manal", track: "Slay", uses: "198K", momentum: 60 },
    ],
    hashtags: [
      { tag: "#maroctiktok", volume: "1.6M", trend: "hot" },
      { tag: "#darija", volume: "920K", trend: "up" },
      { tag: "#casablancalife", volume: "612K", trend: "up" },
      { tag: "#raimaroc", volume: "384K", trend: "up" },
    ],
    schedule: [
      { day: "Lun", hours: "21h–00h", intensity: 84 },
      { day: "Mer", hours: "22h–01h", intensity: 78 },
      { day: "Ven", hours: "23h–02h", intensity: 92 },
      { day: "Sam", hours: "20h–22h", intensity: 86 },
    ],
  },
  {
    id: "cm",
    flag: "🇨🇲",
    name: "Cameroun",
    short: "Douala",
    rpm: "$1.40",
    growth: "+31%",
    creators: "1 480",
    color: "#F43F5E",
    sounds: [
      { artist: "Locko", track: "Margo", uses: "286K", momentum: 82 },
      { artist: "Mr Leo", track: "Partout", uses: "184K", momentum: 70 },
      { artist: "Daphne", track: "Calee", uses: "148K", momentum: 64 },
      { artist: "Salatiel", track: "Anita", uses: "112K", momentum: 56 },
    ],
    hashtags: [
      { tag: "#camerountiktok", volume: "780K", trend: "up" },
      { tag: "#makossa", volume: "412K", trend: "up" },
      { tag: "#237", volume: "362K", trend: "up" },
      { tag: "#doualalife", volume: "284K", trend: "up" },
    ],
    schedule: [
      { day: "Mar", hours: "20h–22h", intensity: 80 },
      { day: "Jeu", hours: "21h–23h", intensity: 86 },
      { day: "Sam", hours: "19h–21h", intensity: 90 },
      { day: "Dim", hours: "18h–20h", intensity: 72 },
    ],
  },
  {
    id: "za",
    flag: "🇿🇦",
    name: "Afrique du Sud",
    short: "Johannesburg",
    rpm: "$2.90",
    growth: "+45%",
    creators: "4 120",
    color: "#FBBF24",
    sounds: [
      { artist: "Tyla", track: "Water (Remix)", uses: "1.1M", momentum: 94 },
      { artist: "DJ Maphorisa", track: "Bambolelo", uses: "428K", momentum: 81 },
      { artist: "Uncle Waffles", track: "Tanzania", uses: "324K", momentum: 76 },
      { artist: "Kabza De Small", track: "Imithandazo", uses: "262K", momentum: 68 },
    ],
    hashtags: [
      { tag: "#sazn", volume: "1.4M", trend: "hot" },
      { tag: "#amapiano", volume: "1.2M", trend: "hot" },
      { tag: "#joburglife", volume: "684K", trend: "up" },
      { tag: "#mzansi", volume: "498K", trend: "up" },
    ],
    schedule: [
      { day: "Lun", hours: "19h–22h", intensity: 82 },
      { day: "Mer", hours: "20h–22h", intensity: 78 },
      { day: "Ven", hours: "21h–00h", intensity: 92 },
      { day: "Sam", hours: "18h–20h", intensity: 84 },
    ],
  },
];

const SOUND_ROTATION_MS = 3800;

export function AfricanTrendEngine() {
  const [selectedId, setSelectedId] = useState(COUNTRIES[0].id);
  const country = COUNTRIES.find((c) => c.id === selectedId) ?? COUNTRIES[0];

  // Rotation des sons trending
  const [soundIdx, setSoundIdx] = useState(0);
  useEffect(() => {
    setSoundIdx(0);
    const id = setInterval(() => {
      setSoundIdx((i) => (i + 1) % country.sounds.length);
    }, SOUND_ROTATION_MS);
    return () => clearInterval(id);
  }, [country.id, country.sounds.length]);

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
          {COUNTRIES.map((c) => {
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
                <RefreshCcw className="h-3 w-3" />
                <span>Mis à jour il y a 4 min</span>
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

                <a
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-semibold transition-colors"
                  style={{
                    borderColor: `${country.color}55`,
                    backgroundColor: `${country.color}1A`,
                    color: country.color,
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  Accès complet à {country.name}
                </a>
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
