"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Bot,
  DollarSign,
  Eye,
  Flame,
  Image as ImageIcon,
  ShieldOff,
  Sparkles,
  TrendingUp,
  Wand2,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

export type AgentRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  enabled: boolean;
  primary_provider: string;
  primary_model: string;
  fallback_providers: string[] | null;
  temperature: number | null;
  max_tokens: number | null;
  runs_total: number;
  runs_success: number;
  runs_failed: number;
  avg_cost_usd: number | null;
  avg_latency_ms: number | null;
  updated_at: string;
};

const CATEGORY_META: Record<string, { icon: typeof Bot; color: string }> = {
  MONETIZATION:    { icon: DollarSign, color: "#10B981" },
  VIRAL:           { icon: Flame, color: "#FF8A00" },
  SHADOWBAN:       { icon: ShieldOff, color: "#F43F5E" },
  HOOK_REWRITER:   { icon: Wand2, color: "#EC4899" },
  TREND_SCANNER:   { icon: TrendingUp, color: "#FF8A00" },
  THUMBNAIL:       { icon: ImageIcon, color: "#FBBF24" },
  VIDEO_ANALYZER:  { icon: Eye, color: "#A855F7" },
};

const PROVIDER_META: Record<string, { label: string; color: string }> = {
  OPENAI:     { label: "OpenAI",     color: "#10A37F" },
  ANTHROPIC:  { label: "Anthropic",  color: "#D4A373" },
  GOOGLE:     { label: "Gemini",     color: "#4285F4" },
  STABILITY:  { label: "Stability",  color: "#7C3AED" },
  RUNWAY:     { label: "Runway",     color: "#000000" },
  ELEVENLABS: { label: "ElevenLabs", color: "#00D4FF" },
  PIKA:       { label: "Pika",       color: "#FF6B9D" },
};

export function AgentsClient({ initialAgents }: { initialAgents: AgentRow[] }) {
  const [agents, setAgents] = useState(initialAgents);
  const [toggling, setToggling] = useState<string | null>(null);

  async function toggle(id: string, current: boolean) {
    setToggling(id);
    try {
      const res = await fetch(`/api/admin/agents/${id}/toggle`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled: !current }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Échec");
      }
      setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !current } : a)));
      toast.success(!current ? "Agent activé" : "Agent désactivé");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setToggling(null);
    }
  }

  const enabled = agents.filter((a) => a.enabled).length;
  const totalRuns = agents.reduce((s, a) => s + (a.runs_total ?? 0), 0);
  const successRate = totalRuns > 0
    ? Math.round((agents.reduce((s, a) => s + (a.runs_success ?? 0), 0) / totalRuns) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            AI Agents Center
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#EC4899]">
            <Bot className="h-2.5 w-2.5" />
            {agents.length} agents
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Orchestration des agents IA spécialisés CreaFix · {enabled} actifs · {totalRuns.toLocaleString("fr-FR")} runs totales
        </p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Agents actifs" value={`${enabled}/${agents.length}`} color="#10B981" icon={CheckCircle2} />
        <Stat label="Runs totales" value={totalRuns.toLocaleString("fr-FR")} color="#EC4899" icon={Activity} />
        <Stat label="Taux de succès" value={`${successRate}%`} color="#FF8A00" icon={Sparkles} />
        <Stat label="Coût moyen / run" value={`$${avgCost(agents).toFixed(4)}`} color="#FF8A00" icon={DollarSign} />
      </div>

      {/* Agents grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => {
          const meta = CATEGORY_META[a.category] ?? { icon: Bot, color: "#94A3B8" };
          const Icon = meta.icon;
          const provider = PROVIDER_META[a.primary_provider];
          const isToggling = toggling === a.id;
          const successPct = a.runs_total > 0
            ? Math.round((a.runs_success / a.runs_total) * 100)
            : null;

          return (
            <div
              key={a.id}
              className={`relative overflow-hidden rounded-2xl border bg-card/40 p-5 backdrop-blur-xl transition-all hover:border-foreground/20 hover:shadow-xl ${
                a.enabled ? "border-border" : "border-border/40 opacity-70"
              }`}
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: meta.color }}
              />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{ backgroundColor: `${meta.color}1A`, borderColor: `${meta.color}55` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: meta.color }} />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold leading-tight">{a.name}</h3>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {a.category.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>

                <Toggle
                  checked={a.enabled}
                  disabled={isToggling}
                  loading={isToggling}
                  onChange={() => toggle(a.id, a.enabled)}
                />
              </div>

              <p className="relative mt-3 text-xs text-muted-foreground line-clamp-2">
                {a.description}
              </p>

              {/* Provider + model */}
              <div className="relative mt-4 flex items-center justify-between rounded-lg border border-border bg-background/40 p-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white"
                    style={{ backgroundColor: provider?.color ?? "#94A3B8" }}
                  >
                    {(provider?.label ?? a.primary_provider).slice(0, 1)}
                  </span>
                  <div className="text-xs">
                    <span className="font-semibold">{provider?.label ?? a.primary_provider}</span>
                    <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                      {a.primary_model}
                    </span>
                  </div>
                </div>
                {a.fallback_providers && a.fallback_providers.length > 0 && (
                  <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <span>+{a.fallback_providers.length}</span>
                    <span className="hidden sm:inline">fallback</span>
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="relative mt-3 grid grid-cols-3 gap-2 text-[10px]">
                <Metric icon={Activity} label="Runs" value={fmt(a.runs_total)} color="#EC4899" />
                <Metric
                  icon={successPct !== null ? CheckCircle2 : Clock}
                  label="Succès"
                  value={successPct !== null ? `${successPct}%` : "—"}
                  color="#10B981"
                />
                <Metric
                  icon={DollarSign}
                  label="$ / run"
                  value={a.avg_cost_usd ? `$${Number(a.avg_cost_usd).toFixed(3)}` : "—"}
                  color="#FF8A00"
                />
              </div>

              {/* Temp + max tokens */}
              <div className="relative mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
                <span>temp: <b className="text-foreground">{a.temperature ?? "—"}</b></span>
                <span>max: <b className="text-foreground">{a.max_tokens ?? "—"}</b> tok</span>
                <span>maj: <b className="text-foreground">{new Date(a.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</b></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-[#EC4899]/30 bg-gradient-to-br from-[#EC4899]/[0.08] via-card/40 to-card/40 p-5 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#EC4899]/40 bg-[#EC4899]/15">
            <Sparkles className="h-4 w-4 text-[#EC4899]" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold">Orchestration IA en attente</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Les agents sont configurés mais l&apos;exécution réelle (Claude / OpenAI / Gemini)
              requiert : (1) les clés API dans <code className="rounded bg-background/60 px-1">Settings → AI Models</code>,
              (2) le worker BullMQ + Redis pour gérer la queue, (3) la logique de fallback.
              Phase backend à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label, value, color, icon: Icon,
}: {
  label: string; value: string; color: string; icon: typeof Bot;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="truncate font-display text-lg font-bold leading-none">{value}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon, label, value, color,
}: {
  icon: typeof Bot; label: string; value: string; color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2 text-center">
      <Icon className="mx-auto h-3 w-3" style={{ color }} />
      <div className="mt-0.5 font-display text-xs font-bold">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Toggle({
  checked, disabled, loading, onChange,
}: {
  checked: boolean; disabled?: boolean; loading?: boolean; onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
        checked
          ? "border-emerald-500/50 bg-emerald-500/30"
          : "border-border bg-background/60"
      }`}
    >
      <span
        className={`absolute h-4 w-4 rounded-full transition-all ${
          checked
            ? "left-[22px] bg-emerald-500 shadow-lg shadow-emerald-500/40"
            : "left-1 bg-muted-foreground/60"
        }`}
      >
        {loading && (
          <Loader2 className="absolute inset-0 m-auto h-3 w-3 animate-spin text-white" />
        )}
      </span>
    </button>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function avgCost(agents: AgentRow[]) {
  const valid = agents.filter((a) => a.avg_cost_usd != null);
  if (valid.length === 0) return 0;
  return valid.reduce((s, a) => s + Number(a.avg_cost_usd ?? 0), 0) / valid.length;
}
