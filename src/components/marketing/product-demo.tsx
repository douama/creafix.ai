"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock, Sparkles, Maximize2 } from "lucide-react";

/**
 * Section vidéo produit — player avec thumbnail + chapters.
 * Quand `videoUrl` est fourni (Loom/YouTube/Vimeo embed), l'iframe remplace le poster.
 * Sinon : poster cliquable + chapters statiques (placeholder pour upload futur).
 */

type Chapter = { time: string; title: string; seconds: number };

const CHAPTERS: Chapter[] = [
  { time: "00:00", title: "Pourquoi tes vidéos ne paient pas", seconds: 0 },
  { time: "00:45", title: "Démo du scan IA en 60s", seconds: 45 },
  { time: "01:30", title: "Détection shadowban", seconds: 90 },
  { time: "02:15", title: "Sons trending par pays", seconds: 135 },
  { time: "03:00", title: "Projection revenus", seconds: 180 },
];

const STATS = [
  { label: "Durée", value: "3:42" },
  { label: "Vues", value: "12 480" },
  { label: "Note", value: "4.9/5" },
];

// TODO: une fois la vidéo enregistrée (Loom/YouTube), mets l'URL ici.
// Exemple Loom : "https://www.loom.com/embed/abc123"
// Exemple YouTube : "https://www.youtube.com/embed/dQw4w9WgXcQ"
const VIDEO_URL: string | null = null;

export function ProductDemo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-12 md:py-16">
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
            <Play className="h-3 w-3" /> Démo produit
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Vois CreaFix AI{" "}
            <span className="gradient-text">en action</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            3 min 42 pour comprendre comment l&apos;IA récupère $400+/mois
            invisibles sur tes pages.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-[1.6fr_1fr]"
        >
          {/* Player */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-card/40 backdrop-blur-xl">
            {playing && VIDEO_URL ? (
              <iframe
                src={`${VIDEO_URL}?autoplay=1`}
                title="Démo CreaFix AI"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse at 30% 40%, rgba(236,72,153,0.25), transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(0,194,255,0.20), transparent 60%), linear-gradient(135deg, #0F1320, #0B0F19)",
                  }}
                />
                <div className="absolute inset-0 grid-bg opacity-30" />

                {/* Faux dashboard overlay */}
                <div className="absolute inset-x-8 top-8 grid grid-cols-3 gap-2">
                  {[
                    { label: "Score viral", value: "78", color: "#FF8A00" },
                    { label: "RPM", value: "$2.10", color: "#10B981" },
                    { label: "Revenue", value: "$2 840", color: "#EC4899" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-border/60 bg-background/50 p-2.5 backdrop-blur-md"
                    >
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </div>
                      <div
                        className="mt-0.5 font-display text-base font-bold"
                        style={{ color: s.color }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Play button */}
                <button
                  type="button"
                  onClick={() => VIDEO_URL && setPlaying(true)}
                  disabled={!VIDEO_URL}
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label="Lire la démo"
                >
                  <div className="group relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#EC4899]/40" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#FF8A00] shadow-[0_20px_60px_-10px_rgba(236,72,153,0.7)] transition-transform group-hover:scale-110">
                      <Play className="h-7 w-7 fill-white text-white" />
                    </div>
                  </div>
                </button>

                {/* Bottom bar */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/95 to-transparent px-5 pb-4 pt-12">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-semibold">3:42</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">CreaFix AI v2.0</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    {!VIDEO_URL && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-300">
                        <Sparkles className="h-2.5 w-2.5" />
                        Bientôt
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label="Plein écran"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Chapters + stats */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Chapitres
              </div>
              <ol className="mt-3 space-y-1.5">
                {CHAPTERS.map((c, i) => (
                  <li
                    key={c.time}
                    className="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-[#EC4899]/30 hover:bg-[#EC4899]/5"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {c.time}
                    </span>
                    <span className="flex-1 text-xs leading-tight">{c.title}</span>
                    <span className="text-[10px] text-muted-foreground/70">
                      #{i + 1}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card/40 p-3 text-center backdrop-blur-xl"
                >
                  <div className="font-display text-base font-bold">{s.value}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
