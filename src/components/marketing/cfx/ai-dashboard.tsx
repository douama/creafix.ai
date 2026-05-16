"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Zap,
  Brain,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

/**
 * Section AI Dashboard — feeling Linear / Vercel.
 * Charts animés, KPI floating, activity feed live, gradients AI.
 */
export function CfxAIDashboard() {
  return (
    <section id="dashboard" className="relative py-28 overflow-hidden">
      <div className="container mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="cfx-pill cfx-pill-purple mb-5">
            <Brain className="h-3.5 w-3.5" />
            Le cockpit IA
          </span>
          <h2 className="font-cfx text-[36px] md:text-[48px] leading-[1.05] font-bold tracking-[-0.02em] text-white">
            Un cockpit{" "}
            <span className="cfx-text-gradient">temps réel</span>
            <br />
            pour piloter ton revenu.
          </h2>
          <p className="mt-5 text-[16px] text-[#A5B4CC] max-w-2xl mx-auto">
            5 agents IA travaillent en parallèle pour auditer, optimiser, alerter
            et reformuler ton contenu — chaque seconde, sur chaque plateforme.
          </p>
        </div>

        {/* Dashboard mockup grid */}
        <div className="relative cfx-glass-strong rounded-3xl p-4 md:p-6 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-5 px-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <div className="text-[11px] text-[#6C7A91] font-mono ml-3">
                app.creafix.ai/dashboard
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#A5B4CC]">
              <span className="cfx-live-dot" />
              Sync · il y a 2s
            </div>
          </div>

          {/* Top KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <KpiBig
              icon={DollarSign}
              label="Revenue (30j)"
              value="$ 18 240"
              delta="+24.3%"
              positive
            />
            <KpiBig
              icon={Eye}
              label="Vues totales"
              value="2.4 M"
              delta="+18.1%"
              positive
            />
            <KpiBig
              icon={TrendingUp}
              label="Score viral moy."
              value="87"
              delta="+12 pts"
              positive
            />
            <KpiBig
              icon={Users}
              label="Audience"
              value="184 K"
              delta="+8 412"
              positive
            />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Revenue chart */}
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0B1220]/60 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[12px] uppercase tracking-wider text-[#6C7A91]">
                    Revenue 14j · Multi-plateformes
                  </div>
                  <div className="mt-1 font-cfx text-[24px] font-bold text-white">
                    $ 18 240 <span className="text-[13px] text-[#00D1FF] font-normal">+24%</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {["1J", "7J", "14J", "30J"].map((p, i) => (
                    <span
                      key={p}
                      className={`px-2.5 py-1 rounded-md text-[10.5px] font-medium ${
                        i === 2
                          ? "bg-white/10 text-white"
                          : "text-[#A5B4CC] hover:bg-white/5"
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <AreaChart />

              {/* Legend */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
                <LegendDot color="#00D1FF" label="YouTube" value="$8.4K" />
                <LegendDot color="#6C63FF" label="TikTok" value="$5.2K" />
                <LegendDot color="#0D6EFD" label="Instagram" value="$2.8K" />
                <LegendDot color="#FFFFFF" label="Autres" value="$1.8K" />
              </div>
            </div>

            {/* Live activity feed */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0B1220]/60 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[12px] uppercase tracking-wider text-[#6C7A91]">
                  Activity feed
                </div>
                <span className="cfx-live-dot" />
              </div>
              <LiveFeed />
            </div>
          </div>

          {/* Bottom row : agents + recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
            <AgentsCard />
            <RecommendationsCard />
          </div>
        </div>

        {/* Float CTA below */}
        <div className="mt-12 text-center">
          <a
            href="/signup"
            className="cfx-btn-primary inline-flex"
          >
            Connecter mes comptes & démarrer
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Sous-composants ─── */

function KpiBig({
  icon: Icon,
  label,
  value,
  delta,
  positive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0B1220]/60 p-4 cfx-card-lift">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6C63FF]/20 to-[#00D1FF]/20 border border-white/5 grid place-items-center">
          <Icon className="h-4 w-4 text-[#00D1FF]" />
        </div>
        <span
          className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-md ${
            positive
              ? "bg-[#00D1FF]/10 text-[#00D1FF]"
              : "bg-red-400/10 text-red-300"
          }`}
        >
          {delta}
        </span>
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-wider text-[#6C7A91]">
        {label}
      </div>
      <div className="mt-1 font-cfx text-[26px] font-bold text-white leading-none">
        {value}
      </div>
    </div>
  );
}

function AreaChart() {
  // Mini SVG area chart — 3 series stacked
  return (
    <div className="relative h-44">
      <svg
        viewBox="0 0 400 160"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cfx-area-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00D1FF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#00D1FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cfx-area-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6C63FF" stopOpacity="0.4" />
            <stop offset="1" stopColor="#6C63FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cfx-area-3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D6EFD" stopOpacity="0.35" />
            <stop offset="1" stopColor="#0D6EFD" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[40, 80, 120].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* Area 3 (back) */}
        <path
          d="M 0 130 L 30 120 L 60 125 L 90 110 L 120 115 L 150 100 L 180 105 L 210 90 L 240 95 L 270 80 L 300 85 L 330 70 L 360 75 L 400 60 L 400 160 L 0 160 Z"
          fill="url(#cfx-area-3)"
        />
        {/* Area 2 */}
        <path
          d="M 0 110 L 30 100 L 60 105 L 90 88 L 120 92 L 150 75 L 180 80 L 210 65 L 240 70 L 270 55 L 300 60 L 330 45 L 360 50 L 400 38 L 400 160 L 0 160 Z"
          fill="url(#cfx-area-2)"
        />
        {/* Area 1 (front) */}
        <path
          d="M 0 90 L 30 78 L 60 82 L 90 65 L 120 70 L 150 52 L 180 58 L 210 42 L 240 48 L 270 32 L 300 38 L 330 22 L 360 28 L 400 14 L 400 160 L 0 160 Z"
          fill="url(#cfx-area-1)"
        />
        {/* Stroke top */}
        <path
          d="M 0 90 L 30 78 L 60 82 L 90 65 L 120 70 L 150 52 L 180 58 L 210 42 L 240 48 L 270 32 L 300 38 L 330 22 L 360 28 L 400 14"
          fill="none"
          stroke="#00D1FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 0 6px rgba(0,209,255,0.6))"
        />
      </svg>

      {/* Tooltip */}
      <div className="absolute top-2 right-12 cfx-glass rounded-lg px-2.5 py-1.5 text-[10px]">
        <div className="text-[#6C7A91]">Aujourd'hui</div>
        <div className="text-white font-mono font-bold">$ 1 920</div>
      </div>
    </div>
  );
}

function LegendDot({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
      />
      <span className="text-[#A5B4CC]">{label}</span>
      <span className="text-white font-mono font-medium">{value}</span>
    </div>
  );
}

function LiveFeed() {
  const ITEMS = [
    { color: "#00D1FF", who: "@lagos.tv", what: "Hook reformulé · +18% retention", time: "2s" },
    { color: "#6C63FF", who: "@dakar_creator", what: "RPM YouTube prédit +$0.40", time: "12s" },
    { color: "#0D6EFD", who: "@nairobi_studio", what: "3 vidéos shadow-bannées détectées", time: "47s" },
    { color: "#00D1FF", who: "@abidjan.live", what: "Score viral 87 → 94", time: "1m" },
    { color: "#6C63FF", who: "@accra_brand", what: "Description optimisée SEO", time: "2m" },
    { color: "#0D6EFD", who: "@johannesburg", what: "Thumbnail A/B test lancé", time: "3m" },
  ];

  // Animate appearance
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setVisible((v) => (v >= ITEMS.length ? ITEMS.length : v + 1));
    }, 250);
    return () => clearInterval(id);
  }, [ITEMS.length]);

  return (
    <div className="space-y-2.5">
      {ITEMS.slice(0, visible).map((it, i) => (
        <div
          key={i}
          className="flex items-start gap-2.5 opacity-0 animate-[float_0s_forwards]"
          style={{ animation: "fadeIn 0.4s ease forwards" }}
        >
          <span
            className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0"
            style={{ background: it.color, boxShadow: `0 0 6px ${it.color}` }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] text-white truncate">
              <span className="font-medium">{it.who}</span>
              <span className="text-[#A5B4CC]"> · {it.what}</span>
            </div>
            <div className="text-[10px] text-[#6C7A91]">il y a {it.time}</div>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function AgentsCard() {
  const AGENTS = [
    { name: "Audit Engine", status: "running", icon: Activity, color: "#00D1FF" },
    { name: "Viral Predictor", status: "running", icon: TrendingUp, color: "#6C63FF" },
    { name: "Monetization", status: "running", icon: DollarSign, color: "#0D6EFD" },
    { name: "Anti-Ban Guard", status: "running", icon: Zap, color: "#00D1FF" },
    { name: "Trend Scout", status: "idle", icon: Sparkles, color: "#6C63FF" },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0B1220]/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[12px] uppercase tracking-wider text-[#6C7A91]">
          Agents IA · 5/5 actifs
        </div>
        <Brain className="h-4 w-4 text-[#00D1FF]" />
      </div>
      <div className="space-y-2.5">
        {AGENTS.map((a) => (
          <div
            key={a.name}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="h-7 w-7 rounded-lg grid place-items-center"
                style={{ background: `${a.color}1A`, border: `1px solid ${a.color}40` }}
              >
                <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} />
              </div>
              <span className="text-[12.5px] font-medium text-white">{a.name}</span>
            </div>
            {a.status === "running" ? (
              <span className="flex items-center gap-1.5 text-[10.5px] text-[#00D1FF]">
                <span className="cfx-live-dot scale-75" />
                running
              </span>
            ) : (
              <span className="text-[10.5px] text-[#6C7A91]">idle</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationsCard() {
  const RECS = [
    { title: "Repost ton TikTok #4 sur Reels", impact: "+$240 estimés", color: "#00D1FF" },
    { title: "Republish ta vidéo YouTube de mars", impact: "+12K vues prévues", color: "#6C63FF" },
    { title: "Démarre un live Twitch ce vendredi", impact: "RPM optimal 19h GMT", color: "#0D6EFD" },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0B1220]/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[12px] uppercase tracking-wider text-[#6C7A91]">
          Recommandations IA
        </div>
        <Sparkles className="h-4 w-4 text-[#6C63FF]" />
      </div>
      <div className="space-y-2.5">
        {RECS.map((r, i) => (
          <div
            key={i}
            className="group p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.12] transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-[12.5px] font-medium text-white leading-snug">
                {r.title}
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#6C7A91] group-hover:text-[#00D1FF] flex-shrink-0 mt-0.5" />
            </div>
            <div className="mt-1.5 text-[10.5px] font-medium" style={{ color: r.color }}>
              {r.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
