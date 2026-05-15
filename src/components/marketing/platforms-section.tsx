"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Activity, Clock, Sparkles, TrendingUp } from "lucide-react";
import { platformList, type Platform } from "@/lib/platforms";
import { PlatformIconBadge } from "@/components/brand/platform-icon";
import { cn } from "@/lib/utils";

export function PlatformsSection() {
  const t = useTranslations("platforms");

  // Trier par RPM décroissant
  const sorted = [...platformList].sort((a, b) => b.baseRpmUsd - a.baseRpmUsd);
  const maxRpm = sorted[0].baseRpmUsd;
  const avgRpm = sorted.reduce((s, p) => s + p.baseRpmUsd, 0) / sorted.length;
  const liveCount = platformList.filter((p) => p.status === "live").length;
  const betaCount = platformList.filter((p) => p.status === "beta").length;
  const soonCount = platformList.filter((p) => p.status === "soon").length;

  return (
    <section id="platforms" className="relative py-10 md:py-14">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-40 blur-3xl" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00C2FF]"
          >
            <Sparkles className="h-3 w-3" /> {t("eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>{" "}
            {t("titlePart2")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            {t("subtitle")}
          </motion.p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <b className="text-foreground">{liveCount}</b> Live
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <b className="text-foreground">{betaCount}</b> Beta
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <b className="text-foreground">{soonCount}</b> Bientôt
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-[#7B61FF]" />
              RPM moyen <b className="text-foreground">${avgRpm.toFixed(2)}</b>
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p, i) => (
            <PlatformCard
              key={p.id}
              platform={p}
              index={i}
              maxRpm={maxRpm}
              isTop={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformCard({
  platform, index, maxRpm, isTop,
}: {
  platform: Platform; index: number; maxRpm: number; isTop: boolean;
}) {
  const t = useTranslations("platforms");
  const rpmShare = (platform.baseRpmUsd / maxRpm) * 100;

  const statusConfig = {
    live: {
      cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-300",
      label: t("statusLive"),
      dot: "bg-emerald-500",
    },
    beta: {
      cls: "border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-300",
      label: t("statusBeta"),
      dot: "bg-amber-500",
    },
    soon: {
      cls: "border-border bg-card/60 text-muted-foreground",
      label: t("statusSoon"),
      dot: "bg-muted-foreground/60",
    },
  }[platform.status];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card/40 p-4 backdrop-blur transition-all duration-300",
        isTop
          ? "border-amber-400/40 bg-gradient-to-br from-amber-400/[0.06] via-card to-card hover:border-amber-400/60"
          : "border-border hover:border-foreground/20 hover:bg-card/70",
        "hover:-translate-y-0.5 hover:shadow-xl",
      )}
    >
      {isTop && (
        <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-300">
          <Sparkles className="h-2.5 w-2.5" /> Top RPM
        </div>
      )}

      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: platform.color }}
      />

      <div className="relative flex items-start gap-3">
        <PlatformIconBadge
          id={platform.id}
          size={44}
          rounded="rounded-xl"
          className="shrink-0 transition-transform group-hover:scale-110"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-bold leading-tight">
            {platform.name}
          </h3>
          <div
            className={cn(
              "mt-1 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
              statusConfig.cls,
            )}
          >
            {platform.status === "live" ? (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", statusConfig.dot)} />
              </span>
            ) : (
              <span className={cn("inline-flex h-1.5 w-1.5 rounded-full", statusConfig.dot)} />
            )}
            {statusConfig.label}
          </div>
        </div>
      </div>

      <div className="relative mt-3 flex flex-wrap gap-1">
        {platform.programs.slice(0, 3).map((prog) => (
          <span
            key={prog.name}
            className="inline-flex items-center rounded-md border border-border bg-background/60 px-1.5 py-0.5 text-[9px] text-muted-foreground"
            title={prog.name}
          >
            {prog.name.length > 22 ? prog.name.slice(0, 20) + "…" : prog.name}
          </span>
        ))}
        {platform.programs.length > 3 && (
          <span className="inline-flex items-center rounded-md border border-dashed border-border bg-transparent px-1.5 py-0.5 text-[9px] text-muted-foreground/70">
            +{platform.programs.length - 3}
          </span>
        )}
      </div>

      <div className="relative mt-4 border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            RPM moyen
          </span>
          <span
            className="font-display text-lg font-bold leading-none"
            style={{ color: platform.color === "#FFFFFF" || platform.color === "#000000" ? undefined : platform.color }}
          >
            ${platform.baseRpmUsd.toFixed(2)}
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/30">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${rpmShare}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              backgroundImage:
                platform.color === "#FFFFFF" || platform.color === "#000000"
                  ? "linear-gradient(90deg, #7B61FF80, #7B61FF)"
                  : `linear-gradient(90deg, ${platform.color}80, ${platform.color})`,
            }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[9px] text-muted-foreground">
          <span>{platform.africaSupported.length} pays Afrique</span>
          <span>
            <Activity className="mr-0.5 inline h-2.5 w-2.5" />
            {platform.programs.length} programmes
          </span>
        </div>
      </div>
    </motion.article>
  );
}
