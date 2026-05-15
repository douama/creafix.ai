"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  Flame,
  DollarSign,
  Eye,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Action = {
  id: string;
  title: string;
  desc: string;
  impact: "high" | "medium";
  duration: string;
  category: "viral" | "rpm" | "shadowban" | "audience";
  done?: boolean;
};

const HORIZONS = [
  { id: "30", label: "30 jours", color: "#10B981" },
  { id: "60", label: "60 jours", color: "#FF8A00" },
  { id: "90", label: "90 jours", color: "#7B61FF" },
];

const PLANS: Record<string, Action[]> = {
  "30": [
    {
      id: "30-1",
      title: "Remplacer 3 audios sous copyright",
      desc: "Bloque +$120/mois de revenus. Utilise les sons trending Sénégal proposés par le Trend Engine.",
      impact: "high",
      duration: "1h",
      category: "shadowban",
    },
    {
      id: "30-2",
      title: "Re-hook les 7 vidéos low watch-time",
      desc: "Passe le watch time de 47% à 52% pour activer la monétisation complète.",
      impact: "high",
      duration: "3h",
      category: "viral",
    },
    {
      id: "30-3",
      title: "Activer Reels Play Bonus",
      desc: "Éligibilité atteinte à 96%. Fenêtre de validation jusqu'au 25 mai.",
      impact: "high",
      duration: "15 min",
      category: "rpm",
    },
    {
      id: "30-4",
      title: "Publier 4 fois par semaine au lieu de 2",
      desc: "Compense le -68% de portée vs ta référence 30 jours.",
      impact: "medium",
      duration: "ongoing",
      category: "audience",
    },
  ],
  "60": [
    {
      id: "60-1",
      title: "Tester la niche finance mobile money",
      desc: "Nouvelle niche détectée par l'IA. CPM ×2.4 sur ton audience Sénégal/Côte d'Ivoire.",
      impact: "high",
      duration: "2 semaines",
      category: "rpm",
    },
    {
      id: "60-2",
      title: "Lancer 2 Lives par semaine",
      desc: "Engagement ×3.5 vs vidéos préenregistrées. Best slot : 20h-22h Dakar.",
      impact: "medium",
      duration: "ongoing",
      category: "audience",
    },
    {
      id: "60-3",
      title: "Optimiser 12 hooks avec le Hook Rewriter IA",
      desc: "Cible : score viral moyen 75+/100 sur l'ensemble de tes contenus.",
      impact: "high",
      duration: "1 semaine",
      category: "viral",
    },
    {
      id: "60-4",
      title: "Étendre à Instagram Reels",
      desc: "Repurpose ton top 10 TikTok. RPM moyen Reels Bonus +35%.",
      impact: "medium",
      duration: "1 semaine",
      category: "rpm",
    },
  ],
  "90": [
    {
      id: "90-1",
      title: "Lancer une niche secondaire (Business / Finance)",
      desc: "Diversifie pour atteindre les $1500/mois target. CPM finance ×2.8.",
      impact: "high",
      duration: "1 mois",
      category: "rpm",
    },
    {
      id: "90-2",
      title: "Premier sponsoring marque locale",
      desc: "Avec 184K abonnés et engagement 8.2%, tu es dans le top 8% des comptes sponsorisables Sénégal.",
      impact: "high",
      duration: "2 semaines",
      category: "audience",
    },
    {
      id: "90-3",
      title: "Créer une formation digitale (info-produit)",
      desc: "Monétiser ton audience hors algos. Cible : 2-3% conversion = +$400/mois récurrent.",
      impact: "high",
      duration: "1 mois",
      category: "rpm",
    },
    {
      id: "90-4",
      title: "Atteindre 250K abonnés",
      desc: "Avec +200 abos/jour soutenu, target réaliste. Active aussi YouTube Shorts.",
      impact: "medium",
      duration: "ongoing",
      category: "audience",
    },
  ],
};

const TARGET = { current: 240, target: 1500, horizon: 90 };

const CATEGORY_META: Record<Action["category"], { icon: typeof Flame; color: string; label: string }> = {
  viral: { icon: Flame, color: "#FF8A00", label: "Viral" },
  rpm: { icon: DollarSign, color: "#10B981", label: "RPM" },
  shadowban: { icon: Eye, color: "#F43F5E", label: "Shadowban" },
  audience: { icon: TrendingUp, color: "#7B61FF", label: "Audience" },
};

export default function ActionPlansPage() {
  const [horizon, setHorizon] = useState("30");
  const [done, setDone] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setDone((d) => {
      const next = new Set(d);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const actions = PLANS[horizon];
  const doneCount = actions.filter((a) => done.has(a.id)).length;
  const pct = Math.round((doneCount / actions.length) * 100);

  const allActions = Object.values(PLANS).flat();
  const allDone = allActions.filter((a) => done.has(a.id)).length;
  const globalPct = Math.round((allDone / allActions.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Action Plans
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#10B981]">
            <Target className="h-2.5 w-2.5" />
            Personnalisé
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan IA généré depuis ton dernier audit. Coche les actions au fur et à
          mesure pour suivre ta progression.
        </p>
      </div>

      {/* Goal banner */}
      <Card>
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] shadow-lg shadow-[#7B61FF]/30">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Objectif {TARGET.horizon} jours
                </div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold">
                    ${TARGET.current}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-display text-2xl font-bold gradient-text">
                    ${TARGET.target}
                  </span>
                  <span className="text-xs text-muted-foreground">/mois</span>
                </div>
              </div>
            </div>

            <div className="min-w-[200px] flex-1 md:max-w-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progression globale</span>
                <span className="font-display font-bold">{globalPct}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${globalPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00C2FF]"
                />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                {allDone} / {allActions.length} actions complétées
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horizon tabs */}
      <div className="flex flex-wrap gap-2">
        {HORIZONS.map((h) => {
          const active = h.id === horizon;
          const horizonActions = PLANS[h.id];
          const horizonDone = horizonActions.filter((a) => done.has(a.id)).length;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => setHorizon(h.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
                active
                  ? "text-foreground shadow-lg"
                  : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
              )}
              style={
                active
                  ? {
                      backgroundColor: `${h.color}1A`,
                      borderColor: `${h.color}66`,
                      boxShadow: `0 8px 24px -8px ${h.color}44`,
                    }
                  : undefined
              }
            >
              <Clock className="h-3.5 w-3.5" style={active ? { color: h.color } : undefined} />
              {h.label}
              <span
                className="ml-1 rounded-full px-1.5 py-0 text-[10px] font-bold"
                style={{
                  backgroundColor: `${h.color}1A`,
                  color: h.color,
                }}
              >
                {horizonDone}/{horizonActions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Actions list */}
      <Card>
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Lightbulb className="h-3 w-3 text-[#FF8A00]" />
              Actions {HORIZONS.find((h) => h.id === horizon)?.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {doneCount}/{actions.length} · {pct}%
            </div>
          </div>

          <ol className="mt-4 space-y-2">
            {actions.map((a, i) => {
              const meta = CATEGORY_META[a.category];
              const Icon = meta.icon;
              const checked = done.has(a.id);
              return (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border bg-background/40 p-4 transition-all",
                    checked ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-border",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(a.id)}
                    className="mt-0.5 shrink-0"
                    aria-label={checked ? "Décocher" : "Cocher comme terminé"}
                  >
                    {checked ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/50 transition-colors hover:text-foreground" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "font-display text-sm font-bold leading-tight md:text-base",
                          checked && "line-through opacity-60",
                        )}
                      >
                        {a.title}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          color: meta.color,
                          borderColor: `${meta.color}55`,
                          backgroundColor: `${meta.color}1A`,
                        }}
                      >
                        <Icon className="h-2.5 w-2.5" />
                        {meta.label}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider",
                          a.impact === "high"
                            ? "text-emerald-500 dark:text-emerald-300"
                            : "text-muted-foreground",
                        )}
                      >
                        Impact {a.impact}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {a.duration}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/[0.06] to-transparent p-3">
            <Sparkles className="h-4 w-4 shrink-0 text-[#7B61FF]" />
            <p className="text-xs text-muted-foreground">
              <b className="text-foreground">Plan régénéré à chaque audit.</b>{" "}
              L&apos;IA réajuste les priorités selon ta progression et les données live.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
