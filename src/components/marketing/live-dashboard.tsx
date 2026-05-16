"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts";
import {
  TrendingUp,
  Eye,
  DollarSign,
  Flame,
  Activity,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const REVENUE_30D = [
  { d: 1, v: 18 }, { d: 2, v: 22 }, { d: 3, v: 19 }, { d: 4, v: 26 },
  { d: 5, v: 31 }, { d: 6, v: 28 }, { d: 7, v: 34 }, { d: 8, v: 41 },
  { d: 9, v: 38 }, { d: 10, v: 45 }, { d: 11, v: 52 }, { d: 12, v: 48 },
  { d: 13, v: 56 }, { d: 14, v: 62 }, { d: 15, v: 58 }, { d: 16, v: 67 },
  { d: 17, v: 71 }, { d: 18, v: 78 }, { d: 19, v: 74 }, { d: 20, v: 82 },
  { d: 21, v: 88 }, { d: 22, v: 94 }, { d: 23, v: 91 }, { d: 24, v: 102 },
  { d: 25, v: 108 }, { d: 26, v: 112 }, { d: 27, v: 121 }, { d: 28, v: 128 },
  { d: 29, v: 134 }, { d: 30, v: 142 },
];

const VIRAL_7D = [
  { d: "L", s: 48 }, { d: "M", s: 54 }, { d: "M", s: 62 }, { d: "J", s: 58 },
  { d: "V", s: 71 }, { d: "S", s: 78 }, { d: "D", s: 82 },
];

const TOP_VIDEOS = [
  { title: "Mon premier million de F CFA", views: "324K", rpm: "$2.10", color: "#10B981" },
  { title: "POV : créateur africain en 2026", views: "187K", rpm: "$1.80", color: "#7B61FF" },
  { title: "Comment j'ai battu l'algo TikTok", views: "152K", rpm: "$1.60", color: "#FF8A00" },
  { title: "Live Q&A finance mobile money", views: "98K", rpm: "$1.40", color: "#FF8A00" },
];

export function LiveDashboard() {
  return (
    <section className="relative py-12 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-30 blur-3xl" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#7B61FF]"
          >
            <Activity className="h-3 w-3" /> Dashboard temps réel
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Ton dashboard,{" "}
            <span className="gradient-text">en direct</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            Revenus, vues, score viral, RPM — actualisés en continu pour les 9
            plateformes. Aperçu live d&apos;un compte créateur réel.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="relative mt-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/60 via-card/40 to-card/40 p-5 backdrop-blur-2xl md:p-7"
        >
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[800px] -translate-x-1/2 rounded-full bg-[#7B61FF]/15 blur-3xl" />

          {/* Header */}
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#FF8A00] text-xs font-bold text-white shadow-lg shadow-[#7B61FF]/30">
                AT
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-bold">@amina_tv</h3>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                    <span className="relative flex h-1 w-1">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                      <span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-500" />
                    </span>
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  TikTok · 218K abonnés · Abidjan 🇨🇮
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span>Période :</span>
              <span className="rounded-md border border-border bg-background/40 px-2 py-0.5 font-semibold text-foreground">
                30 derniers jours
              </span>
            </div>
          </div>

          {/* KPI row */}
          <div className="relative mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiCard
              icon={DollarSign}
              label="Revenus"
              base={2840}
              format="usd"
              delta="+24%"
              color="#10B981"
              tickMin={2}
              tickMax={7}
            />
            <KpiCard
              icon={Eye}
              label="Vues totales"
              base={1_240_000}
              format="num"
              delta="+18%"
              color="#FF8A00"
              tickMin={120}
              tickMax={580}
            />
            <KpiCard
              icon={Flame}
              label="Score viral"
              base={82}
              format="score"
              delta="+12"
              color="#FF8A00"
              tickMin={0}
              tickMax={0}
            />
            <KpiCard
              icon={TrendingUp}
              label="RPM moyen"
              base={1.84}
              format="rpm"
              delta="+0.32"
              color="#7B61FF"
              tickMin={0}
              tickMax={0}
            />
          </div>

          {/* Charts row */}
          <div className="relative mt-5 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr]">
            {/* Revenue area chart */}
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Revenus 30 j
                  </div>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="font-display text-xl font-bold">$2 840</span>
                    <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-300">
                      +24% vs M-1
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-3 h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_30D} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                      formatter={(v) => [`$${v}`, "Revenus"]}
                      labelFormatter={(d) => `Jour ${d}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#7B61FF"
                      strokeWidth={2}
                      fill="url(#rev-gradient)"
                      isAnimationActive
                      animationDuration={1400}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score gauge */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background/40 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Score global
              </div>
              <div className="relative mt-2 h-[140px] w-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    data={[{ name: "score", value: 78, fill: "url(#score-gradient)" }]}
                    innerRadius="80%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <defs>
                      <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7B61FF" />
                        <stop offset="50%" stopColor="#FF8A00" />
                        <stop offset="100%" stopColor="#FF8A00" />
                      </linearGradient>
                    </defs>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar
                      dataKey="value"
                      cornerRadius={50}
                      background={{ fill: "hsl(var(--muted) / 0.3)" }}
                      isAnimationActive
                      animationDuration={1400}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-bold">78</span>
                  <span className="text-[10px] text-muted-foreground">/100</span>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-500 dark:text-emerald-300">
                <TrendingUp className="h-3 w-3" />
                +6 cette semaine
              </div>
            </div>

            {/* Viral 7d line + Top videos */}
            <div className="space-y-3">
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Score viral · 7 j
                </div>
                <div className="mt-2 h-[60px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={VIRAL_7D} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="s"
                        stroke="#FF8A00"
                        strokeWidth={2}
                        dot={{ r: 2, fill: "#FF8A00" }}
                        activeDot={{ r: 4 }}
                        isAnimationActive
                        animationDuration={1200}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/40 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-[#FF8A00]" />
                  Top vidéos
                </div>
                <ul className="mt-2 space-y-1.5">
                  {TOP_VIDEOS.slice(0, 3).map((v) => (
                    <li
                      key={v.title}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: v.color }}
                      />
                      <span className="min-w-0 flex-1 truncate" title={v.title}>
                        {v.title}
                      </span>
                      <span className="shrink-0 font-display font-bold" style={{ color: v.color }}>
                        {v.views}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function KpiCard({
  icon: Icon,
  label,
  base,
  format,
  delta,
  color,
  tickMin,
  tickMax,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  base: number;
  format: "usd" | "num" | "score" | "rpm";
  delta: string;
  color: string;
  tickMin: number;
  tickMax: number;
}) {
  const [value, setValue] = useState(base);

  useEffect(() => {
    if (tickMin === 0 && tickMax === 0) return;
    const id = setInterval(() => {
      setValue((v) => v + tickMin + Math.random() * (tickMax - tickMin));
    }, 2200);
    return () => clearInterval(id);
  }, [tickMin, tickMax]);

  const display = (() => {
    switch (format) {
      case "usd":
        return `$${Math.round(value).toLocaleString("fr-FR").replace(/,/g, " ")}`;
      case "num": {
        const n = Math.round(value);
        return n >= 1_000_000
          ? `${(n / 1_000_000).toFixed(2)}M`
          : `${(n / 1000).toFixed(0)}K`;
      }
      case "score":
        return `${Math.round(value)}/100`;
      case "rpm":
        return `$${value.toFixed(2)}`;
    }
  })();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background/40 p-3.5">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="relative flex items-center justify-between gap-2">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg border"
          style={{
            backgroundColor: `${color}1A`,
            borderColor: `${color}55`,
          }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <span
          className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
          style={{
            backgroundColor: `${color}1A`,
            color,
          }}
        >
          <TrendingUp className="h-2.5 w-2.5" />
          {delta}
        </span>
      </div>
      <div className="relative mt-3 font-display text-xl font-bold leading-none md:text-2xl">
        {display}
      </div>
      <div className="relative mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
