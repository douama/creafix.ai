"use client";

import { useMemo, useState } from "react";
import {
  Search, Activity, CheckCircle2, AlertCircle, Clock,
  Eye, Flame, ShieldOff, DollarSign, TrendingUp, Filter,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type AuditRow = {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  user_country: string | null;
  platform: string | null;
  handle: string | null;
  followers: number | null;
  status: string;
  mode: string;
  score_global: number | null;
  score_monetization: number | null;
  score_viral: number | null;
  score_risk: number | null;
  score_engagement: number | null;
  started_at: string;
  completed_at: string | null;
};

const STATUS_FILTERS = ["ALL", "PENDING", "RUNNING", "COMPLETED", "FAILED"];
const PLATFORM_FILTERS = ["ALL", "TIKTOK", "FACEBOOK", "INSTAGRAM", "YOUTUBE", "X", "SNAPCHAT", "TWITCH"];

const STATUS_META: Record<string, { icon: typeof Activity; color: string; label: string }> = {
  PENDING:   { icon: Clock,         color: "#94A3B8", label: "En attente" },
  RUNNING:   { icon: Activity,      color: "#FF8A00", label: "En cours" },
  COMPLETED: { icon: CheckCircle2,  color: "#10B981", label: "Terminé" },
  FAILED:    { icon: AlertCircle,   color: "#F43F5E", label: "Échec" },
};

export function AuditsClient({ initialAudits }: { initialAudits: AuditRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initialAudits.filter((a) => {
      if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
      if (platformFilter !== "ALL" && a.platform !== platformFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          (a.user_email ?? "").toLowerCase().includes(s) ||
          (a.user_name ?? "").toLowerCase().includes(s) ||
          (a.handle ?? "").toLowerCase().includes(s) ||
          a.id.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [initialAudits, search, statusFilter, platformFilter]);

  const stats = useMemo(() => ({
    total: initialAudits.length,
    completed: initialAudits.filter((a) => a.status === "COMPLETED").length,
    running: initialAudits.filter((a) => a.status === "RUNNING").length,
    failed: initialAudits.filter((a) => a.status === "FAILED").length,
    avgScore: (() => {
      const completed = initialAudits.filter((a) => a.score_global != null);
      if (completed.length === 0) return null;
      return Math.round(
        completed.reduce((s, a) => s + (a.score_global ?? 0), 0) / completed.length,
      );
    })(),
  }), [initialAudits]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          AI Audits Center
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tous les audits IA générés · {initialAudits.length} entrées (limite 200)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Total" value={stats.total} color="#7B61FF" icon={Search} />
        <Stat label="Terminés" value={stats.completed} color="#10B981" icon={CheckCircle2} />
        <Stat label="En cours" value={stats.running} color="#FF8A00" icon={Activity} />
        <Stat label="Échecs" value={stats.failed} color="#F43F5E" icon={AlertCircle} />
        <Stat
          label="Score moyen"
          value={stats.avgScore ?? 0}
          color="#00C2FF"
          icon={TrendingUp}
          suffix={stats.avgScore != null ? "/100" : ""}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-xl">
        <div className="relative min-w-[200px] flex-1">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher email, handle, audit ID…"
            className="h-9 w-full rounded-lg border border-border bg-background/40 pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
          />
        </div>
        <FilterDropdown label="Statut" value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} />
        <FilterDropdown label="Plateforme" value={platformFilter} options={PLATFORM_FILTERS} onChange={setPlatformFilter} />
      </div>

      {/* Audits list */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Aucun audit trouvé · les utilisateurs n&apos;ont pas encore lancé d&apos;audit
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((a) => {
              const meta = STATUS_META[a.status] ?? STATUS_META.PENDING;
              const Icon = meta.icon;
              const isOpen = expanded === a.id;
              const duration = a.completed_at
                ? Math.round((new Date(a.completed_at).getTime() - new Date(a.started_at).getTime()) / 1000)
                : null;

              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : a.id)}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-card/60"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                      style={{ backgroundColor: `${meta.color}1A`, borderColor: `${meta.color}55` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: meta.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold">
                          {a.handle ?? `Audit ${a.id.slice(0, 8)}`}
                        </span>
                        {a.platform && (
                          <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            {a.platform}
                          </span>
                        )}
                        {a.score_global != null && (
                          <span
                            className="inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0 text-[10px] font-bold"
                            style={{
                              color: scoreColor(a.score_global),
                              borderColor: `${scoreColor(a.score_global)}55`,
                              backgroundColor: `${scoreColor(a.score_global)}1A`,
                            }}
                          >
                            {a.score_global}/100
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="truncate">{a.user_email ?? "user inconnu"}</span>
                        {a.user_country && <span>· {a.user_country}</span>}
                        {a.followers != null && <span>· {fmt(a.followers)} abos</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden text-[11px] text-muted-foreground md:inline">
                        {timeAgo(a.started_at)}
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border/40 bg-background/30 p-5">
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                        <ScoreCard label="Global" value={a.score_global} icon={TrendingUp} color="#7B61FF" />
                        <ScoreCard label="Monétisation" value={a.score_monetization} icon={DollarSign} color="#10B981" />
                        <ScoreCard label="Viral" value={a.score_viral} icon={Flame} color="#FF8A00" />
                        <ScoreCard label="Risque" value={a.score_risk} icon={ShieldOff} color="#F43F5E" invert />
                        <ScoreCard label="Engagement" value={a.score_engagement} icon={Eye} color="#00C2FF" />
                      </div>
                      <div className="mt-4 grid gap-2 text-[11px] md:grid-cols-3">
                        <Detail label="Audit ID" value={a.id} mono />
                        <Detail label="User ID" value={a.user_id} mono />
                        <Detail label="Mode" value={a.mode} />
                        <Detail label="Démarré" value={new Date(a.started_at).toLocaleString("fr-FR")} />
                        <Detail
                          label="Terminé"
                          value={a.completed_at ? new Date(a.completed_at).toLocaleString("fr-FR") : "—"}
                        />
                        <Detail
                          label="Durée"
                          value={duration != null ? `${duration}s` : "—"}
                        />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  label, value, color, icon: Icon, suffix,
}: { label: string; value: number; color: string; icon: typeof Activity; suffix?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">
          {value}
          {suffix && <span className="text-xs text-muted-foreground/60">{suffix}</span>}
        </div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function FilterDropdown({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-background/70">
        {label}: {value}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ScoreCard({
  label, value, icon: Icon, color, invert,
}: { label: string; value: number | null; icon: typeof Activity; color: string; invert?: boolean }) {
  const display = value ?? "—";
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3 text-center">
      <Icon className="mx-auto h-3.5 w-3.5" style={{ color }} />
      <div className="mt-1 font-display text-base font-bold" style={{ color }}>
        {display}
        {value != null && <span className="text-[9px] text-muted-foreground/60">/100</span>}
      </div>
      <div className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 truncate ${mono ? "font-mono text-[10px]" : ""}`} title={value}>
        {value}
      </div>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 75) return "#10B981";
  if (score >= 50) return "#FF8A00";
  return "#F43F5E";
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
