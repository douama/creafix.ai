"use client";

import {
  DollarSign, TrendingUp, AlertTriangle, Sparkles, ShieldOff,
  Music2, Eye, ArrowUpRight,
} from "lucide-react";
import {
  Area, AreaChart, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from "recharts";

const REVENUE_30D = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  recovered: Math.round(800 + i * 80 + Math.sin(i / 3) * 200),
  potential: Math.round(2400 + i * 120 + Math.sin(i / 4) * 300),
}));

const TOP_LEAKS = [
  { reason: "Audio sous copyright", impact: 12480, accounts: 84, color: "#F43F5E" },
  { reason: "Watch time < seuil monétisation", impact: 8920, accounts: 142, color: "#FF8A00" },
  { reason: "Hashtags bannis", impact: 5640, accounts: 67, color: "#FBBF24" },
  { reason: "Hook faible (< 3s retention)", impact: 4280, accounts: 198, color: "#7B61FF" },
  { reason: "Vidéos < 60s sous-monétisées", impact: 3120, accounts: 92, color: "#FF8A00" },
];

const RPM_BY_COUNTRY = [
  { country: "Maroc", flag: "🇲🇦", current: 2.4, optimal: 3.1, gap: 29 },
  { country: "Afrique du Sud", flag: "🇿🇦", current: 2.2, optimal: 2.9, gap: 32 },
  { country: "Nigeria", flag: "🇳🇬", current: 1.8, optimal: 2.4, gap: 33 },
  { country: "Sénégal", flag: "🇸🇳", current: 1.4, optimal: 1.8, gap: 29 },
  { country: "Côte d'Ivoire", flag: "🇨🇮", current: 1.2, optimal: 1.6, gap: 33 },
  { country: "Cameroun", flag: "🇨🇲", current: 1.0, optimal: 1.4, gap: 40 },
];

const NICHE_RPM = [
  { niche: "Finance", rpm: 4.2, color: "#10B981" },
  { niche: "Tech", rpm: 3.8, color: "#FF8A00" },
  { niche: "Business", rpm: 3.4, color: "#7B61FF" },
  { niche: "Lifestyle", rpm: 1.8, color: "#FF8A00" },
  { niche: "Humour", rpm: 1.4, color: "#F43F5E" },
  { niche: "Mode", rpm: 1.2, color: "#FBBF24" },
];

export default function RevenueEnginePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Revenue Engine
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
            <DollarSign className="h-2.5 w-2.5" />
            Leak Scanner
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Détection des fuites de revenus + optimisation RPM par pays/niche/plateforme
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Revenus récupérés" value="$34.4K" color="#10B981" icon={ArrowUpRight} delta="+22%" />
        <Stat label="Fuites détectées" value="$67.8K" color="#F43F5E" icon={AlertTriangle} delta="-18%" />
        <Stat label="Comptes optimisés" value="1 247" color="#7B61FF" icon={Sparkles} />
        <Stat label="RPM moyen Afrique" value="$1.78" color="#FF8A00" icon={DollarSign} />
      </div>

      {/* Recovered vs potential */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Revenus récupérés vs potentiels · 30 j
            </h2>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-emerald-500 dark:text-emerald-300">
                ${REVENUE_30D.reduce((s, p) => s + p.recovered, 0).toLocaleString("fr-FR")}
              </span>
              <span className="text-xs text-muted-foreground">
                / ${REVENUE_30D.reduce((s, p) => s + p.potential, 0).toLocaleString("fr-FR")} potentiels
              </span>
            </div>
          </div>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="mt-3 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_30D} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="recoveredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="potentialGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                formatter={(v, name) => [`$${Number(v).toLocaleString("fr-FR")}`, name === "recovered" ? "Récupérés" : "Potentiels"]}
              />
              <Area type="monotone" dataKey="potential" stroke="#7B61FF" strokeWidth={1.5} fill="url(#potentialGrad)" isAnimationActive />
              <Area type="monotone" dataKey="recovered" stroke="#10B981" strokeWidth={2} fill="url(#recoveredGrad)" isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top leak reasons */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold">
          <AlertTriangle className="h-4 w-4 text-[#F43F5E]" />
          Top fuites de revenus · 30 j
        </h2>
        <ul className="mt-4 space-y-2">
          {TOP_LEAKS.map((leak) => {
            const max = TOP_LEAKS[0].impact;
            const pct = (leak.impact / max) * 100;
            return (
              <li key={leak.reason} className="rounded-xl border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldOff className="h-3.5 w-3.5" style={{ color: leak.color }} />
                    <span className="text-sm font-semibold">{leak.reason}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-bold" style={{ color: leak.color }}>
                      -${leak.impact.toLocaleString("fr-FR")}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {leak.accounts} comptes touchés
                    </div>
                  </div>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted/30">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: leak.color }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* RPM by country + niche */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold">
            <DollarSign className="h-4 w-4 text-[#10B981]" />
            RPM par pays · gap optimal
          </h2>
          <ul className="mt-4 space-y-2">
            {RPM_BY_COUNTRY.map((c) => (
              <li key={c.country} className="flex items-center gap-3 text-xs">
                <span className="text-base">{c.flag}</span>
                <span className="w-24 font-semibold">{c.country}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/30">
                      <div
                        className="h-full rounded-full bg-[#10B981]"
                        style={{ width: `${(c.current / c.optimal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className="w-12 text-right text-muted-foreground">${c.current}</span>
                <span className="w-12 text-right font-display font-bold text-emerald-500">${c.optimal}</span>
                <span className="w-12 text-right text-[10px] font-bold text-amber-500">+{c.gap}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold">
            <Eye className="h-4 w-4 text-[#7B61FF]" />
            Top niches RPM (Afrique)
          </h2>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={NICHE_RPM} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <XAxis dataKey="niche" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                  formatter={(v) => [`$${v}`, "RPM"]}
                />
                <Bar dataKey="rpm" radius={[6, 6, 0, 0]} isAnimationActive>
                  {NICHE_RPM.map((n) => (
                    <Cell key={n.niche} fill={n.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/[0.06] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">Données démo.</b> Le Revenue Engine agrège : (1) Monetization Agent
            (Claude / GPT) pour analyses RPM, (2) Shadowban Agent pour les pertes invisibles, (3) données CPM/RPM
            réelles seedées par pays. Calcul automatique des revenus perdus + recommandations actionnables.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon, delta }: {
  label: string; value: string; color: string; icon: typeof DollarSign; delta?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: color }} />
      <div className="relative flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border"
          style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        {delta && (
          <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0 text-[10px] font-bold"
            style={{ color, backgroundColor: `${color}1A` }}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="relative mt-3 font-display text-xl font-bold leading-none">{value}</div>
      <div className="relative mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
