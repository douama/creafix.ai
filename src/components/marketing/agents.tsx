"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Activity,
  Bot,
  CheckCircle2,
  Coins,
  FileText,
  Flame,
  ImageIcon,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AgentKey =
  | "audit"
  | "viral"
  | "monetization"
  | "antiban"
  | "trend"
  | "thumbnail"
  | "script";

type AgentSchema = {
  key: AgentKey;
  icon: LucideIcon;
  short: string;
  category: "analyse" | "creation" | "growth";
  tone: "violet" | "orange" | "rose" | "emerald" | "sky" | "amber" | "fuchsia";
};

const auditSchema: AgentSchema = {
  key: "audit",
  icon: Bot,
  short: "Audit",
  category: "analyse",
  tone: "violet",
};

const othersSchema: AgentSchema[] = [
  { key: "viral",        icon: Flame,       short: "Viral",        category: "growth",  tone: "orange" },
  { key: "monetization", icon: Coins,       short: "Monetization", category: "growth",  tone: "emerald" },
  { key: "antiban",      icon: ShieldAlert, short: "Anti-Ban",     category: "analyse", tone: "rose" },
  { key: "trend",        icon: TrendingUp,  short: "Trend",        category: "analyse", tone: "sky" },
  { key: "thumbnail",    icon: ImageIcon,   short: "Thumbnail",    category: "creation", tone: "fuchsia" },
  { key: "script",       icon: FileText,    short: "Script",       category: "creation", tone: "amber" },
];

const toneRing: Record<AgentSchema["tone"], string> = {
  violet: "from-violet-500/30 to-violet-500/0 ring-violet-500/30",
  orange: "from-orange-500/30 to-orange-500/0 ring-orange-500/30",
  rose: "from-rose-500/30 to-rose-500/0 ring-rose-500/30",
  emerald: "from-emerald-500/30 to-emerald-500/0 ring-emerald-500/30",
  sky: "from-sky-500/30 to-sky-500/0 ring-sky-500/30",
  amber: "from-amber-500/30 to-amber-500/0 ring-amber-500/30",
  fuchsia: "from-fuchsia-500/30 to-fuchsia-500/0 ring-fuchsia-500/30",
};

const toneText: Record<AgentSchema["tone"], string> = {
  violet: "text-violet-500 dark:text-violet-300",
  orange: "text-orange-500 dark:text-orange-300",
  rose: "text-rose-500 dark:text-rose-300",
  emerald: "text-emerald-500 dark:text-emerald-300",
  sky: "text-sky-500 dark:text-sky-300",
  amber: "text-amber-500 dark:text-amber-300",
  fuchsia: "text-fuchsia-500 dark:text-fuchsia-300",
};

export function AgentsShowcase() {
  const t = useTranslations("agents");

  return (
    <section className="relative py-14 md:py-20">
      <div className="absolute inset-0 -z-10 grid-bg opacity-40" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-500 dark:text-violet-200"
          >
            <Bot className="h-3 w-3" /> {t("eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl"
          >
            {t("titlePart1")}
            <br />
            {t("titlePart2")}{" "}
            <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart3")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-sm text-balance text-muted-foreground md:text-base"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {/* Audit Agent — carte hero */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-violet-500/[0.08] via-card to-card p-6 lg:row-span-2"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl opacity-60 transition-opacity group-hover:opacity-100" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between">
                <CategoryBadge category={auditSchema.category} />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500 dark:text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  {t("live")}
                </span>
              </div>

              <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-500 to-orange-500 shadow-2xl shadow-violet-500/40 ring-4 ring-violet-500/20">
                <auditSchema.icon className="h-5 w-5 text-white" />
              </div>

              <h3 className="mt-4 font-display text-xl font-bold tracking-tight">
                {t("audit.name")}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t("audit.desc")}
              </p>

              <div className="mt-auto pt-6">
                <div className="rounded-xl border border-border bg-background/40 p-3.5 backdrop-blur">
                  <div className="font-display text-2xl font-bold leading-none">
                    {t("audit.metric")}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {t("audit.metricLabel")}
                  </div>
                </div>

                <div className="mt-3 flex h-10 items-end gap-1">
                  {[34, 48, 62, 56, 70, 84, 78, 92, 88, 95, 90, 96].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-500/30 to-violet-500"
                      style={{ height: `${v}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.article>

          {/* 6 cartes secondaires */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            {othersSchema.map((a, i) => (
              <AgentCard key={a.key} schema={a} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-border bg-card/40 px-5 py-3 backdrop-blur"
        >
          <span className="flex items-center gap-2 text-xs">
            <Activity className="h-3.5 w-3.5 text-violet-500" />
            <b>{t("footer1")}</b>
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> {t("footer2")}
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t("footer3")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function AgentCard({ schema, index }: { schema: AgentSchema; index: number }) {
  const t = useTranslations("agents");
  const Icon = schema.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-4 backdrop-blur transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card/70 hover:shadow-xl",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
          toneRing[schema.tone],
        )}
      />

      <div className="relative flex items-center justify-between">
        <CategoryBadge category={schema.category} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {schema.short}
        </span>
      </div>

      <div className="relative mt-3 flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ring-1",
            "border-border",
            toneRing[schema.tone],
          )}
        >
          <Icon className={cn("h-4 w-4", toneText[schema.tone])} />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold leading-tight">
            {t(`${schema.key}.name`)}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {t(`${schema.key}.desc`)}
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-3 border-t border-border pt-3">
        <div>
          <div className={cn("font-display text-lg font-bold leading-none", toneText[schema.tone])}>
            {t(`${schema.key}.metric`)}
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {t(`${schema.key}.metricLabel`)}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CategoryBadge({ category }: { category: AgentSchema["category"] }) {
  const t = useTranslations("agents.categories");
  const cls =
    category === "analyse"
      ? "border-sky-500/30 bg-sky-500/10 text-sky-500 dark:text-sky-300"
      : category === "creation"
        ? "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-500 dark:text-fuchsia-300"
        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-300";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        cls,
      )}
    >
      {t(category)}
    </span>
  );
}
