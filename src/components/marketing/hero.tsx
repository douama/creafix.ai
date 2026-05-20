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
 * FloatingSocialIcons — 9 plateformes en lévitation autour du hero
 * Affiché sur xl+ uniquement (≥ 1280px) pour éviter overlap avec le H1.
 * Utilise PlatformIconBadge (vrais logos, couleurs marque officielles).
 * ────────────────────────────────────────────────────────────────── */

const FLOATING_PLATFORMS: ReadonlyArray<{ id: PlatformId; pos: string; delay: number }> = [
  // Colonne gauche (5)
  { id: "YOUTUBE",   pos: "left-2 top-[4%]",    delay: 0   },
  { id: "INSTAGRAM", pos: "left-16 top-[22%]",  delay: 0.4 },
  { id: "TIKTOK",    pos: "left-0 top-[44%]",   delay: 0.8 },
  { id: "SNAPCHAT",  pos: "left-16 top-[64%]",  delay: 1.2 },
  { id: "TWITCH",    pos: "left-2 top-[84%]",   delay: 1.6 },
  // Colonne droite (4)
  { id: "FACEBOOK",  pos: "right-2 top-[8%]",   delay: 0.2 },
  { id: "LINKEDIN",  pos: "right-16 top-[28%]", delay: 0.6 },
  { id: "X",         pos: "right-0 top-[50%]",  delay: 1.0 },
  { id: "PINTEREST", pos: "right-16 top-[74%]", delay: 1.4 },
];

function FloatingSocialIcons() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[560px] xl:block"
    >
      {FLOATING_PLATFORMS.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.55,
            delay: 0.35 + p.delay * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute ${p.pos}`}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{
              duration: 4.5 + p.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
            className="drop-shadow-xl"
          >
            <PlatformIconBadge id={p.id} size={52} rounded="rounded-2xl" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
