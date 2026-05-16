"use client";

import {
  Flame, TrendingUp, Eye, Sparkles, Activity, MapPin, Music2, Hash, Clock,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis,
  RadialBarChart, RadialBar, PolarAngleAxis, Cell,
} from "recharts";

const VIRAL_30D = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  v: Math.round(60 + i * 0.4 + Math.sin(i / 2) * 8),
}));

const TOP_HOOKS = [
  { hook: "POV : tu découvres que tu as un shadowban depuis 3 semaines", score: 94, uses: 1240, country: "🇸🇳" },
  { hook: "Stop. Ton hook actuel te coûte $400 par mois.", score: 91, uses: 982, country: "🇨🇮" },
  { hook: "Personne te le dira mais 80% des créateurs perdent ÇA", score: 88, uses: 712, country: "🇳🇬" },
  { hook: "J'ai testé l'IA qui détecte les fuites de revenus", score: 84, uses: 504, country: "🇲🇦" },
  { hook: "Tu vas pas croire combien j'ai perdu en 30 jours", score: 82, uses: 398, country: "🇨🇲" },
];

const VIRAL_BY_PLATFORM = [
  { platform: "TikTok", score: 78, color: "#FF0050" },
  { platform: "Reels", score: 72, color: "#E1306C" },
  { platform: "YouTube Shorts", score: 68, color: "#FF0000" },
  { platform: "Facebook", score: 54, color: "#1877F2" },
];

const VIRAL_PREDICTIONS = [
  { user: "@fatou_tv", country: "🇸🇳", platform: "TikTok", predicted: 94, actual: 91, accuracy: 97 },
  { user: "@tunde_lagos", country: "🇳🇬", platform: "YouTube", predicted: 81, actual: 78, accuracy: 96 },
  { user: "@karim.rabat", country: "🇲🇦", platform: "Instagram", predicted: 65, actual: 71, accuracy: 92 },
  { user: "@didi_b_ci", country: "🇨🇮", platform: "TikTok", predicted: 88, actual: 92, accuracy: 95 },
];

export default function ViralEnginePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Viral Engine
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF8A00]">
            <Flame className="h-2.5 w-2.5" />
            AI Powered
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Prédiction et amplification virale · IA Gemini 2.5 Pro + ML scoring custom
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Score viral moyen" value="74" suffix="/100" color="#FF8A00" icon={Flame} />
        <Stat label="Vidéos analysées (30j)" value="12.4K" color="#EC4899" icon={Eye} />
        <Stat label="Précision IA" value="94" suffix="%" color="#10B981" icon={Sparkles} />
        <Stat label="Hooks générés" value="3.2K" color="#FF8A00" icon={Activity} />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Score viral global · 30j
            </h2>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VIRAL_30D} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="viralGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF8A00" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#FF8A00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                  formatter={(v) => [`${v}/100`, "Score"]}
                  labelFormatter={(d) => `J-${30 - Number(d)}`}
                />
                <Area type="monotone" dataKey="v" stroke="#FF8A00" strokeWidth={2} fill="url(#viralGrad)" isAnimationActive />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Score par plateforme
          </h2>
          <div className="mt-3 space-y-3">
            {VIRAL_BY_PLATFORM.map((p) => (
              <div key={p.platform}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{p.platform}</span>
                  <b style={{ color: p.color }}>{p.score}/100</b>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted/30">
                  <div className="h-full rounded-full" style={{ width: `${p.score}%`, backgroundColor: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top hooks */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold">
          <Hash className="h-4 w-4 text-[#FF8A00]" />
          Top 5 hooks les plus viraux (30 derniers jours)
        </h2>
        <ul className="mt-4 space-y-2">
          {TOP_HOOKS.map((h, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{
                  background: i === 0 ? "linear-gradient(135deg, #FBBF24, #FF8A00)" :
                              i === 1 ? "linear-gradient(135deg, #94A3B8, #64748B)" :
                              i === 2 ? "linear-gradient(135deg, #92400E, #B45309)" :
                              "linear-gradient(135deg, #EC4899, #FF8A00)"
                }}
              >
                #{i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">“{h.hook}”</p>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{h.country}</span>
                  <span>· {h.uses} utilisations</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-base font-bold" style={{ color: scoreColor(h.score) }}>
                  {h.score}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">viral</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Predictions vs actual */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold">
          <Sparkles className="h-4 w-4 text-[#10B981]" />
          Précision prédictions IA (échantillon)
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="hidden grid-cols-[1.5fr_0.6fr_1fr_1fr_1fr_1fr] gap-3 border-b border-border bg-background/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <div>Créateur</div>
            <div>Pays</div>
            <div>Plateforme</div>
            <div className="text-right">Prédit</div>
            <div className="text-right">Réel</div>
            <div className="text-right">Précision</div>
          </div>
          <ul className="divide-y divide-border/40">
            {VIRAL_PREDICTIONS.map((p) => (
              <li key={p.user} className="grid grid-cols-2 gap-3 px-4 py-3 md:grid-cols-[1.5fr_0.6fr_1fr_1fr_1fr_1fr]">
                <div className="font-display text-sm font-bold">{p.user}</div>
                <div className="text-base">{p.country}</div>
                <div className="hidden text-xs md:block">{p.platform}</div>
                <div className="hidden text-right font-display text-sm md:block" style={{ color: "#FF8A00" }}>
                  {p.predicted}
                </div>
                <div className="hidden text-right font-display text-sm md:block">{p.actual}</div>
                <div className="text-right">
                  <span
                    className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold"
                    style={{
                      color: p.accuracy >= 95 ? "#10B981" : p.accuracy >= 90 ? "#FF8A00" : "#F43F5E",
                      borderColor: `${p.accuracy >= 95 ? "#10B981" : "#FF8A00"}55`,
                      backgroundColor: `${p.accuracy >= 95 ? "#10B981" : "#FF8A00"}1A`,
                    }}
                  >
                    {p.accuracy}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-[#EC4899]/30 bg-[#EC4899]/[0.06] p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#EC4899]" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">Données démo.</b> Le Viral Engine combinera : (1) Hook Rewriter Agent
            (GPT-4.1 / Claude), (2) Trend Scanner Agent (Gemini), (3) ML scoring custom basé sur 10M+ vidéos
            historiques. Score viral live calculable via <code className="rounded bg-background/60 px-1">/api/v1/viral/score</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon, suffix }: {
  label: string; value: string; color: string; icon: typeof Flame; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">
          {value}{suffix && <span className="text-xs text-muted-foreground/60">{suffix}</span>}
        </div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function scoreColor(s: number) {
  if (s >= 90) return "#10B981";
  if (s >= 70) return "#FF8A00";
  return "#F43F5E";
}
