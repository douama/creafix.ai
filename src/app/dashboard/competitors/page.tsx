"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Loader2,
  Search,
  Eye,
  Flame,
  DollarSign,
  Target,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  you: string | number;
  them: string | number;
  delta: string;
  good: boolean;
  format?: "score" | "num";
};

type Opportunity = {
  title: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  desc: string;
};

const MOCK_STATS: Stat[] = [
  { label: "Abonnés", you: "184K", them: "412K", delta: "-55%", good: false },
  { label: "Engagement", you: "8.2%", them: "4.6%", delta: "+78%", good: true },
  { label: "Score viral", you: 68, them: 81, delta: "-13", good: false, format: "score" },
  { label: "RPM estimé", you: "$1.80", them: "$2.40", delta: "-25%", good: false },
  { label: "Vues / vidéo", you: "42K", them: "98K", delta: "-57%", good: false },
  { label: "Postings / sem.", you: 4, them: 8, delta: "-50%", good: false },
];

const NICHE_OVERLAP = [
  { niche: "Lifestyle", you: 64, them: 78 },
  { niche: "Finance", you: 18, them: 42 },
  { niche: "Humour", you: 12, them: 6 },
];

const TOP_THEM = [
  { title: "Mon premier million de Naira", views: "1.2M", rpm: "$3.10" },
  { title: "POV : créateur Lagos en 2026", views: "684K", rpm: "$2.40" },
  { title: "L'algo TikTok décodé", views: "412K", rpm: "$1.80" },
];

const OPPORTUNITIES: Opportunity[] = [
  {
    title: "Doubler la fréquence de publication",
    impact: "high",
    effort: "medium",
    desc: "Ils postent 2× plus que toi. Passe de 4 à 7 vidéos/semaine pour combler l'écart de reach.",
  },
  {
    title: "Tester la niche finance Nigeria",
    impact: "high",
    effort: "low",
    desc: "Leur niche #1 (42%) — tu n'es qu'à 18%. CPM ×2.8 sur ton audience locale.",
  },
  {
    title: "Améliorer le hook (3 premières secondes)",
    impact: "medium",
    effort: "low",
    desc: "Leurs hooks ont +27% de watch-through. Utilise le Hook Rewriter pour booster.",
  },
  {
    title: "Activer les Lives 2× par semaine",
    impact: "medium",
    effort: "medium",
    desc: "Ils font 4 lives/mois avec engagement ×3.5. Tu n'en fais aucun actuellement.",
  },
];

export default function CompetitorsPage() {
  const [handle, setHandle] = useState("");
  const [phase, setPhase] = useState<"idle" | "analyzing" | "done">("idle");

  function analyze() {
    if (!handle.trim()) return;
    setPhase("analyzing");
    setTimeout(() => setPhase("done"), 1600);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Competitor Analyzer
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#7B61FF]">
            <Trophy className="h-2.5 w-2.5" />
            Pro
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare ton compte à un concurrent. L&apos;IA détecte les gaps et les
          opportunités prioritaires.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 md:p-6">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            URL ou @handle du concurrent
          </label>
          <div className="mt-2 flex flex-col gap-2 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@tunde_lagos ou https://tiktok.com/@tunde_lagos"
                className="h-11 w-full rounded-xl border border-border bg-background/40 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#7B61FF]/50"
              />
            </div>
            <Button
              variant="brand"
              size="lg"
              onClick={analyze}
              disabled={phase === "analyzing" || !handle.trim()}
              className="md:w-auto"
            >
              {phase === "analyzing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse…
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
            Suggestions :
            {["@tunde_lagos", "@didi_b_ci", "@karim.rabat"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setHandle(s)}
                className="rounded-full border border-border bg-card/40 px-2 py-0.5 transition-colors hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Comparison head */}
            <div className="grid gap-3 md:grid-cols-2">
              <CompetitorCard
                handle="@toi"
                followers="184K"
                platform="TikTok"
                country="🇸🇳 Sénégal"
                gradient="from-[#7B61FF] to-[#00C2FF]"
                badge="Toi"
              />
              <CompetitorCard
                handle="@tunde_lagos"
                followers="412K"
                platform="TikTok"
                country="🇳🇬 Nigeria"
                gradient="from-[#FF8A00] to-[#F43F5E]"
                badge="Concurrent"
              />
            </div>

            {/* Stats compared */}
            <Card>
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-[#7B61FF]" />
                  Comparaison stats
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {MOCK_STATS.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
                    >
                      <div className="flex-1 text-xs">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {s.label}
                        </div>
                        <div className="mt-0.5 flex items-baseline gap-3">
                          <div>
                            <div className="text-[10px] text-muted-foreground">Toi</div>
                            <div className="font-display text-base font-bold">
                              {s.you}
                              {s.format === "score" && (
                                <span className="text-[10px] text-muted-foreground/60">
                                  /100
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-muted-foreground/40">vs</div>
                          <div>
                            <div className="text-[10px] text-muted-foreground">
                              Concurrent
                            </div>
                            <div className="font-display text-base font-bold">
                              {s.them}
                              {s.format === "score" && (
                                <span className="text-[10px] text-muted-foreground/60">
                                  /100
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold",
                          s.good
                            ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-300"
                            : "bg-rose-500/15 text-rose-500 dark:text-rose-300",
                        )}
                      >
                        {s.good ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {s.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Niche overlap + Top videos */}
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Target className="h-3 w-3 text-[#7B61FF]" />
                    Niches comparées
                  </div>
                  <div className="mt-3 space-y-3">
                    {NICHE_OVERLAP.map((n) => (
                      <div key={n.niche}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">{n.niche}</span>
                          <span className="text-muted-foreground">
                            Toi {n.you}% · Eux {n.them}%
                          </span>
                        </div>
                        <div className="mt-1 flex gap-1">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/30">
                            <div
                              className="h-full rounded-full bg-[#7B61FF]"
                              style={{ width: `${n.you}%` }}
                            />
                          </div>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/30">
                            <div
                              className="h-full rounded-full bg-[#FF8A00]"
                              style={{ width: `${n.them}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Flame className="h-3 w-3 text-[#FF8A00]" />
                    Top vidéos du concurrent
                  </div>
                  <ul className="mt-3 space-y-2">
                    {TOP_THEM.map((v) => (
                      <li
                        key={v.title}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF8A00] to-[#F43F5E] text-xs font-bold text-white">
                          <Flame className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{v.title}</div>
                          <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Eye className="h-2.5 w-2.5" />
                              {v.views}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <DollarSign className="h-2.5 w-2.5" />
                              {v.rpm}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Opportunities */}
            <Card>
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-[#10B981]" />
                    Opportunités prioritaires IA
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {OPPORTUNITIES.length} détectées
                  </span>
                </div>

                <ol className="mt-3 space-y-2">
                  {OPPORTUNITIES.map((o, i) => (
                    <motion.li
                      key={o.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-bold">
                            {o.title}
                          </span>
                          <ImpactBadge level={o.impact} kind="impact" />
                          <ImpactBadge level={o.effort} kind="effort" />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{o.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompetitorCard({
  handle, followers, platform, country, gradient, badge,
}: {
  handle: string;
  followers: string;
  platform: string;
  country: string;
  gradient: string;
  badge: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className={cn("pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl", gradient)} />
      <div className="relative flex items-center gap-3">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg", "bg-gradient-to-br", gradient)}>
          <Users className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold">{handle}</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              {badge}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {platform} · {country} · {followers} abonnés
          </p>
        </div>
      </div>
    </div>
  );
}

function ImpactBadge({ level, kind }: { level: "high" | "medium" | "low"; kind: "impact" | "effort" }) {
  const color =
    level === "high"
      ? kind === "impact"
        ? "#10B981"
        : "#F43F5E"
      : level === "medium"
      ? "#FF8A00"
      : kind === "effort"
      ? "#10B981"
      : "#94A3B8";
  return (
    <span
      className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}1A`,
      }}
    >
      {kind === "impact" ? "Impact" : "Effort"} : {level}
    </span>
  );
}
