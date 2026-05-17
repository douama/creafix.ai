"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";
import { UrlAuditInput } from "./url-audit-input";

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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl text-center"
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

        {/* Dashboard preview — ombre douce CinetPay style, pas d'aurora */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-12 max-w-5xl"
        >
          <div className="card-soft overflow-hidden p-1.5 md:p-2">
            <DashboardPreview />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
