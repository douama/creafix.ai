"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { platformList, type Platform } from "@/lib/platforms";
import { PlatformIconBadge } from "@/components/brand/platform-icon";
import { cn } from "@/lib/utils";

export function PlatformsSection() {
  const t = useTranslations("platforms");

  return (
    <section id="platforms" className="relative py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00C2FF]"
          >
            <Sparkles className="h-3 w-3" /> {t("eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>{" "}
            {t("titlePart2")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {platformList.map((p, i) => (
            <PlatformCard key={p.id} platform={p} index={i} />
          ))}
        </div>

        {/* Légende status */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t("statusLive")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {t("statusBeta")}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {t("statusSoon")}
          </span>
        </div>
      </div>
    </section>
  );
}

function PlatformCard({ platform, index }: { platform: Platform; index: number }) {
  const t = useTranslations("platforms");
  const statusCls =
    platform.status === "live"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-300"
      : platform.status === "beta"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-300"
        : "border-border bg-card/60 text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-card/70 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <PlatformIconBadge id={platform.id} size={40} rounded="rounded-xl" />
        <div className="flex-1">
          <div className="font-display text-sm font-semibold">{platform.name}</div>
          <div
            className={cn(
              "mt-0.5 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
              statusCls,
            )}
          >
            {platform.status === "live"
              ? t("statusLive")
              : platform.status === "beta"
                ? t("statusBeta")
                : t("statusSoon")}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {platform.programs.slice(0, 3).map((prog) => (
          <div
            key={prog.name}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
            <span className="line-clamp-1">{prog.name}</span>
          </div>
        ))}
        {platform.programs.length > 3 && (
          <div className="text-[10px] text-muted-foreground/70">
            +{platform.programs.length - 3} {t("morePrograms")}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[10px]">
        <span className="text-muted-foreground">RPM&nbsp;moyen</span>
        <span className={cn("font-mono font-semibold", platform.textClass)}>
          ${platform.baseRpmUsd.toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
}

