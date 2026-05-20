"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  ShieldAlert,
  Flame,
  DollarSign,
  Eye,
  Sparkles,
  Zap,
} from "lucide-react";

type Event = {
  id: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  text: string;
  flag?: string;
  time: string;
  color: string;
};

const FEED: Event[] = [
  { id: 1, icon: TrendingUp, text: "@fatou_tv a augmenté son RPM de +43% en 14j", flag: "🇸🇳", time: "il y a 2 min", color: "#10B981" },
  { id: 2, icon: ShieldAlert, text: "Shadowban détecté sur 3 comptes Facebook actifs", flag: "🇨🇮", time: "il y a 4 min", color: "#F43F5E" },
  { id: 3, icon: Flame, text: "Nouveau son viral repéré : afrobeats fusion", flag: "🇳🇬", time: "il y a 6 min", color: "#FF8A00" },
  { id: 4, icon: DollarSign, text: "@karim.rabat a récupéré $480 de revenus perdus", flag: "🇲🇦", time: "il y a 8 min", color: "#EC4899" },
  { id: 5, icon: Eye, text: "+12 400 vues prédites sur la prochaine vidéo de @amina_dakar", flag: "🇸🇳", time: "il y a 11 min", color: "#FF8A00" },
  { id: 6, icon: Zap, text: "@chris_abidjan : score viral 87/100 sur sa dernière vidéo", flag: "🇨🇮", time: "il y a 13 min", color: "#FF8A00" },
  { id: 7, icon: TrendingUp, text: "Niche finance mobile money explose au Cameroun", flag: "🇨🇲", time: "il y a 16 min", color: "#10B981" },
  { id: 8, icon: ShieldAlert, text: "47 vidéos avec copyright détectées et corrigées aujourd'hui", time: "il y a 18 min", color: "#F43F5E" },
  { id: 9, icon: DollarSign, text: "@tunde_lagos : CPM passé de $0.40 à $2.10 en 21j", flag: "🇳🇬", time: "il y a 22 min", color: "#EC4899" },
  { id: 10, icon: Sparkles, text: "Meilleur créneau Dakar mis à jour : 20h–22h", flag: "🇸🇳", time: "il y a 25 min", color: "#FF8A00" },
];

const VISIBLE = 4;
const ROTATION_MS = 2200;

export function LiveActivity() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % FEED.length);
    }, ROTATION_MS);
    return () => clearInterval(id);
  }, []);

  const visible = Array.from({ length: VISIBLE }, (_, i) => FEED[(offset + i) % FEED.length]);

  return (
    <section className="relative overflow-hidden py-10 md:py-14">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-25 blur-3xl" />

      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-300"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Live · {FEED.length} événements/min
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
            >
              Ce qui se passe{" "}
              <span className="gradient-text">en ce moment</span> sur CreaFix AI.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 text-sm text-muted-foreground md:text-base"
            >
              Exemples de signaux détectés par CreaFix AI — ton feed s&apos;active
              après ton 1er audit.
            </motion.p>
          </div>

          <div
            className="relative max-h-[320px] overflow-hidden rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-xl md:p-4"
            aria-live="polite"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background to-transparent"
              aria-hidden
            />

            <ul className="relative space-y-2">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((e) => {
                  const Icon = e.icon;
                  return (
                    <motion.li
                      key={e.id}
                      layout
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-3 transition-colors hover:border-foreground/20"
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                        style={{
                          backgroundColor: `${e.color}1A`,
                          borderColor: `${e.color}55`,
                        }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: e.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug md:text-sm">
                          {e.flag && <span className="mr-1">{e.flag}</span>}
                          {e.text}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {e.time}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
