import { Sparkles } from "lucide-react";

const AGENTS = [
  { name: "Audit IA",        color: "#EC4899", desc: "Analyse des 8 dimensions" },
  { name: "Viral IA",        color: "#F97316", desc: "Idées de contenus à fort potentiel" },
  { name: "Monetization IA", color: "#10B981", desc: "Opportunités de revenus" },
  { name: "Anti-Ban IA",     color: "#EF4444", desc: "Détection des risques de démon." },
  { name: "Trend IA",        color: "#8B5CF6", desc: "Hashtags + sons trending" },
  { name: "Thumbnail IA",    color: "#06B6D4", desc: "Concepts A/B-testables" },
  { name: "Script IA",       color: "#F59E0B", desc: "Hooks réécrits + structure" },
];

export default function PlanLoading() {
  return (
    <div className="space-y-7">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-card/40" />
        <div className="flex-1">
          <div className="h-7 w-72 animate-pulse rounded-md bg-card/40" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-card/30" />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-gradient-to-br from-[#EC4899]/[0.06] via-background to-[#F97316]/[0.06] p-8 md:p-12 text-center">
        <div className="relative mx-auto h-14 w-14">
          <div className="absolute inset-0 animate-ping rounded-full bg-[#EC4899]/30" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#F97316]">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">
          Les 7 agents IA prennent le relais
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Analyse approfondie en cours pour générer un plan d&apos;action concret. Ça prend 3-8 secondes.
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a, i) => (
            <div
              key={a.name}
              className="flex items-center gap-2 rounded-xl border border-border bg-card/30 px-3 py-2 text-left"
              style={{ animation: `pulse 1.6s ease-in-out ${i * 0.15}s infinite` }}
            >
              <span
                className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full"
                style={{ backgroundColor: a.color, boxShadow: `0 0 10px ${a.color}` }}
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold">{a.name}</div>
                <div className="truncate text-[10px] text-muted-foreground">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
