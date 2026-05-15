"use client";

import { motion } from "framer-motion";
import {
  AlertOctagon,
  Copy,
  Music,
  Timer,
  UserX,
  Image as ImageIcon,
} from "lucide-react";

const REASONS = [
  {
    icon: Copy,
    title: "Contenu réutilisé",
    desc: "Reposts non originaux, compilations, reuploads. Les algos détectent et plafonnent la monétisation.",
    impact: "-72% reach",
    color: "#F43F5E",
  },
  {
    icon: Timer,
    title: "Watch time faible",
    desc: "Sous le seuil de rétention (< 50% sur TikTok, < 4h/jour sur YouTube). Ineligibilité immédiate.",
    impact: "-100% ads",
    color: "#FF8A00",
  },
  {
    icon: UserX,
    title: "Engagement artificiel",
    desc: "Likes achetés, comptes bot, engagement pods. Détection automatique = suspension monétisation.",
    impact: "Bannissement",
    color: "#F43F5E",
  },
  {
    icon: Music,
    title: "Musique sous copyright",
    desc: "Audio non licencié = revenus reversés au détenteur. Une seule vidéo peut bloquer ton compte.",
    impact: "Revenus → 0",
    color: "#FF8A00",
  },
  {
    icon: ImageIcon,
    title: "Qualité d'upload faible",
    desc: "Résolution sous-optimale, compression visible, audio dégradé. Pénalité algorithmique silencieuse.",
    impact: "-45% CPM",
    color: "#FBBF24",
  },
];

export function Demonetized() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-300"
          >
            <AlertOctagon className="h-3 w-3" /> Pièges de monétisation
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            5 raisons pour lesquelles{" "}
            <span className="gradient-text">tu n&apos;es pas monétisé</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            La plupart des créateurs ignorent au moins 2 de ces pièges. CreaFix
            AI les détecte tous, sur chaque vidéo.
          </motion.p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.article
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-xl"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-35"
                  style={{ backgroundColor: r.color }}
                />

                <div className="relative flex items-start justify-between gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: `${r.color}1A`,
                      borderColor: `${r.color}55`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: r.color }} />
                  </div>
                  <span
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${r.color}1A`,
                      borderColor: `${r.color}55`,
                      color: r.color,
                    }}
                  >
                    {r.impact}
                  </span>
                </div>

                <h3 className="relative mt-4 font-display text-base font-bold leading-tight">
                  {r.title}
                </h3>
                <p className="relative mt-1.5 text-xs text-muted-foreground">
                  {r.desc}
                </p>
              </motion.article>
            );
          })}

          {/* Card finale : CTA */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#7B61FF]/40 bg-gradient-to-br from-[#7B61FF]/[0.1] via-card/40 to-card/40 p-5 text-center backdrop-blur"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#7B61FF]/30 blur-2xl" />
            <div className="relative">
              <h3 className="font-display text-base font-bold leading-tight">
                Vérifie lesquelles te concernent.
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                L&apos;IA scanne tes 30 dernières vidéos et identifie tous les
                pièges qui te coûtent des revenus.
              </p>
              <a
                href="/signup"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#7B61FF]/50 bg-[#7B61FF]/15 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-[#7B61FF]/25"
              >
                Lancer le diagnostic gratuit →
              </a>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
