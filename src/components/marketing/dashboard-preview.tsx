"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Facebook,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="glow-ring absolute inset-0 rounded-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#0E0E1A] to-[#1A1230] p-1">
        <div className="rounded-[1.4rem] bg-background/40 p-5 backdrop-blur-2xl md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/30">
                <Facebook className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold">Audit IA · @afroviral.media</div>
                <div className="text-xs text-muted-foreground">Page Facebook · 184K abonnés · Sénégal</div>
              </div>
            </div>
            <Badge variant="success" className="gap-1">
              <Activity className="h-3 w-3" /> Live · 1 min
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ScoreCard label="Score monétisation" value={72} tone="amber" />
            <ScoreCard label="Score viral" value={84} tone="brand" />
            <ScoreCard label="Risque ban" value={18} tone="emerald" invert />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Revenus estimés (30 j)</div>
                <Badge variant="brand" className="gap-1">
                  <TrendingUp className="h-3 w-3" /> +38%
                </Badge>
              </div>
              <div className="mt-3 font-display text-3xl font-bold">
                423 500 <span className="text-base text-muted-foreground">FCFA</span>
              </div>
              <div className="mt-3 grid grid-cols-12 items-end gap-1">
                {[28, 35, 30, 48, 52, 42, 58, 64, 56, 70, 78, 88].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-t-sm bg-gradient-to-t from-violet-500/30 to-orange-400/80"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Recommandations IA</div>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Activer In-Stream Ads — éligibilité atteinte à 96%</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <span>3 vidéos avec audio sous copyright à remplacer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                  <span>Nouvelle niche détectée : <b>finance mobile money</b> · CPM ×2.4</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  tone,
  invert = false,
}: {
  label: string;
  value: number;
  tone: "brand" | "emerald" | "amber" | "rose";
  invert?: boolean;
}) {
  const displayValue = invert ? value : value;
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="font-display text-3xl font-bold">{displayValue}</div>
        <div className="text-xs text-muted-foreground">/ 100</div>
      </div>
      <Progress value={displayValue} tone={tone} className="mt-3" />
    </div>
  );
}
