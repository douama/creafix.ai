"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";
import { UrlAuditInput } from "./url-audit-input";
import { PlatformIconBadge } from "@/components/brand/platform-icon";
import type { PlatformId } from "@/lib/platforms";

/**
 * Hero CinetPay-style — light, clean, structuré.
 *
 * Pattern :
 * - Badge pill discret en haut
 * - H1 large avec mot clé surligné orange incliné (.highlight-orange)
 * - Sous-titre clair, 2 lignes max
 * - URL input large (CTA primaire visuel)
 * - 2 CTAs : pill orange + ghost
 * - Trust signals en bullets
 * - Dashboard preview en bas, légère ombre douce (pas de halo aurora)
 * - 4 stats en bandeau
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="container relative">
        {/* Icônes plateformes flottantes — gauche/droite du hero (xl+ uniquement) */}
        <FloatingSocialIcons />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-5xl text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-semibold text-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f15522]" />
            {t("badge")}
          </div>

          {/* H1 avec surligneur orange incliné — signature CinetPay */}
          <h1 className="mt-5 font-display text-[1.9rem] font-bold leading-[1.08] tracking-tight text-balance md:text-[2.75rem] lg:text-5xl">
            {t("titlePart1")}{" "}
            <span className="highlight-orange whitespace-nowrap">{t("titleHighlight")}</span>{" "}
            {t("titlePart2")}
          </h1>

          {/* Sous-titre */}
          <p className="mx-auto mt-5 max-w-4xl text-balance text-base text-muted-foreground md:text-lg">
            {t("subtitle")}
          </p>

          {/* URL input + CTAs */}
          <div className="mt-7">
            <UrlAuditInput />
          </div>

          <div className="mt-5 flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link
              href="/signup"
              className="btn-pill-orange !h-11 !px-4 text-[13px] sm:!h-12 sm:!px-6 sm:text-sm"
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted/40 sm:h-12 sm:px-6 sm:text-sm"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              {t("trustNoCard")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[#f15522]" />
              {t("trustFast")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {t("trustCreators")}
            </span>
          </div>
        </motion.div>

        {/* Dashboard preview — largeur container landing (1280px), pas de cap perso */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12"
        >
          <div className="card-soft overflow-hidden p-1.5 md:p-2">
            <DashboardPreview />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * FloatingSocialIcons — 12 icônes plateformes circulant partout dans le hero
 *
 * Chaque icône a un anchor en % + un chemin (x/y/rotate) unique,
 * désynchronisé, de durée 18-32s. Effet : nuage ambiant fluide qui
 * couvre tout le hero. Opacité réduite + drop-shadow pour rester
 * lisible derrière le texte central.
 *
 * Visible md+ (≥ 768px). Masqué en-dessous pour la perf et l'écran.
 * ────────────────────────────────────────────────────────────────── */

type Orbit = {
  id: PlatformId;
  anchor: { left: string; top: string };
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  path: { x: number[]; y: number[]; rotate: number[] };
};

const ORBITING_PLATFORMS: ReadonlyArray<Orbit> = [
  // ─── Bandeau haut (au-dessus du H1) ───
  { id: "YOUTUBE",   anchor: { left: "5%",  top: "3%"  }, size: 48, duration: 22, delay: 0,   opacity: 0.85,
    path: { x: [0, 60, 30, -20, 0], y: [0, -10, 35, 20, 0], rotate: [0, 8, -5, 3, 0] } },
  { id: "TIKTOK",    anchor: { left: "26%", top: "1%"  }, size: 42, duration: 26, delay: 2,   opacity: 0.75,
    path: { x: [0, -50, 20, 45, 0], y: [0, 35, 55, 15, 0], rotate: [0, -6, 4, -2, 0] } },
  { id: "FACEBOOK",  anchor: { left: "70%", top: "2%"  }, size: 50, duration: 24, delay: 1,   opacity: 0.8,
    path: { x: [0, 40, -35, -15, 0], y: [0, 45, 25, -10, 0], rotate: [0, 5, -3, 6, 0] } },
  { id: "X",         anchor: { left: "92%", top: "5%"  }, size: 44, duration: 20, delay: 3,   opacity: 0.85,
    path: { x: [0, -60, -25, 15, 0], y: [0, 25, -15, 35, 0], rotate: [0, -8, 4, -2, 0] } },

  // ─── Mi-hauteur (sides — proche du H1 mais reste en gutter) ───
  { id: "INSTAGRAM", anchor: { left: "1%",  top: "32%" }, size: 50, duration: 28, delay: 4,   opacity: 0.75,
    path: { x: [0, 55, 30, -10, 0], y: [0, -30, 25, 40, 0], rotate: [0, 6, -4, 3, 0] } },
  { id: "LINKEDIN",  anchor: { left: "95%", top: "34%" }, size: 46, duration: 25, delay: 1.5, opacity: 0.8,
    path: { x: [0, -50, -20, 15, 0], y: [0, 40, -25, 15, 0], rotate: [0, -5, 6, -3, 0] } },
  { id: "SNAPCHAT",  anchor: { left: "3%",  top: "55%" }, size: 44, duration: 30, delay: 5,   opacity: 0.7,
    path: { x: [0, 70, 35, -15, 0], y: [0, -35, 20, 30, 0], rotate: [0, 7, -3, 4, 0] } },
  { id: "PINTEREST", anchor: { left: "93%", top: "56%" }, size: 48, duration: 26, delay: 0.5, opacity: 0.8,
    path: { x: [0, -45, -20, 25, 0], y: [0, 25, -20, 10, 0], rotate: [0, -6, 5, -2, 0] } },

  // ─── Bandeau bas (sous les CTAs, dans le gap avant le dashboard) ───
  { id: "TWITCH",    anchor: { left: "12%", top: "82%" }, size: 44, duration: 23, delay: 2.5, opacity: 0.75,
    path: { x: [0, 45, 20, -25, 0], y: [0, -20, 30, -10, 0], rotate: [0, 4, -6, 3, 0] } },
  { id: "YOUTUBE",   anchor: { left: "82%", top: "84%" }, size: 38, duration: 27, delay: 4.5, opacity: 0.6,
    path: { x: [0, -40, 20, -15, 0], y: [0, -30, 15, 25, 0], rotate: [0, -7, 4, -3, 0] } },
  { id: "TIKTOK",    anchor: { left: "40%", top: "88%" }, size: 36, duration: 21, delay: 6,   opacity: 0.55,
    path: { x: [0, 50, -20, 30, 0], y: [0, 20, -25, 10, 0], rotate: [0, 6, -4, 2, 0] } },
  { id: "INSTAGRAM", anchor: { left: "58%", top: "90%" }, size: 36, duration: 29, delay: 3.5, opacity: 0.6,
    path: { x: [0, -55, 25, -10, 0], y: [0, -20, 25, 15, 0], rotate: [0, -4, 6, -2, 0] } },
];

function FloatingSocialIcons() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[680px] md:block"
    >
      {ORBITING_PLATFORMS.map((p, i) => (
        <motion.div
          key={`${p.id}-${i}`}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: p.opacity, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3 + p.delay * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute"
          style={{ left: p.anchor.left, top: p.anchor.top }}
        >
          <motion.div
            animate={{
              x: p.path.x,
              y: p.path.y,
              rotate: p.path.rotate,
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
            className="drop-shadow-xl"
            style={{ willChange: "transform" }}
          >
            <PlatformIconBadge id={p.id} size={p.size} rounded="rounded-2xl" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
