"use client";

import { useMemo, useState } from "react";
import {
  Lock,
  Activity,
  Users,
  Calendar,
  Filter,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  User,
  Bot,
  Sparkles,
  KeyRound,
  Trash2,
  Ban,
  CheckCircle2,
  Crown,
  RefreshCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type LogRow = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_name: string | null;
  actor_role: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  meta: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

const ACTION_META: Record<string, { icon: typeof Activity; color: string; label: string }> = {
  "user.suspend":   { icon: ShieldAlert, color: "#FF8A00", label: "User suspendu" },
  "user.unsuspend": { icon: CheckCircle2,color: "#10B981", label: "Suspension levée" },
  "user.ban":       { icon: Ban,         color: "#F43F5E", label: "User banni" },
  "user.reset":     { icon: RefreshCcw,  color: "#EC4899", label: "Credits reset" },
  "user.upgrade":   { icon: Crown,       color: "#FBBF24", label: "User upgrade" },
  "agent.enable":   { icon: Bot,         color: "#10B981", label: "Agent activé" },
  "agent.disable":  { icon: Bot,         color: "#94A3B8", label: "Agent désactivé" },
  "ai_model.update":{ icon: KeyRound,    color: "#EC4899", label: "AI Model mis à jour" },
  "trend.create":   { icon: Sparkles,    color: "#FF8A00", label: "Trend créé" },
  "trend.approve":  { icon: CheckCircle2,color: "#10B981", label: "Trend approuvé" },
  "trend.reject":   { icon: ShieldAlert, color: "#F43F5E", label: "Trend rejeté" },
  "trend.archive":  { icon: Trash2,      color: "#94A3B8", label: "Trend archivé" },
  "trend.delete":   { icon: Trash2,      color: "#F43F5E", label: "Trend supprimé" },
};

export function SecurityClient({
  initialLogs,
  stats,
}: {
  initialLogs: LogRow[];
  stats: { total: number; actors: number; today: number; actions: number };
}) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const availableActions = useMemo(() => {
    return Array.from(new Set(initialLogs.map((l) => l.action))).sort();
  }, [initialLogs]);

  const filtered = useMemo(() => {
    return initialLogs.filter((l) => {
      if (actionFilter !== "ALL" && l.action !== actionFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          l.action.toLowerCase().includes(s) ||
          (l.actor_email ?? "").toLowerCase().includes(s) ||
          (l.target_id ?? "").toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [initialLogs, search, actionFilter]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Security Center
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
            <Lock className="h-2.5 w-2.5" />
            Audit logs
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Toutes les actions admin tracées en temps réel · {initialLogs.length} entrées affichées (limite 200)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total logs" value={stats.total} color="#EC4899" icon={Activity} />
        <Stat label="Acteurs uniques" value={stats.actors} color="#FF8A00" icon={Users} />
        <Stat label="Aujourd'hui" value={stats.today} color="#10B981" icon={Calendar} />
        <Stat label="Types d'actions" value={stats.actions} color="#FF8A00" icon={Sparkles} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-xl">
        <div className="relative min-w-[200px] flex-1">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher action, email, target_id…"
            className="h-9 w-full rounded-lg border border-border bg-background/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground/30"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-background/70">
            Action: {actionFilter}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
            <DropdownMenuItem onClick={() => setActionFilter("ALL")}>
              Toutes les actions
            </DropdownMenuItem>
            {availableActions.map((a) => (
              <DropdownMenuItem key={a} onClick={() => setActionFilter(a)}>
                {a}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logs list */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Aucun log trouvé
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((l) => {
              const meta = ACTION_META[l.action] ?? {
                icon: Activity,
                color: "#94A3B8",
                label: l.action,
              };
              const Icon = meta.icon;
              const isOpen = expanded === l.id;

              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : l.id)}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-card/60"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        backgroundColor: `${meta.color}1A`,
                        borderColor: `${meta.color}55`,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: meta.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold">
                          {meta.label}
                        </span>
                        <span className="hidden font-mono text-[10px] text-muted-foreground md:inline">
                          {l.action}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <User className="h-2.5 w-2.5" />
                        <span className="truncate">
                          {l.actor_name ?? l.actor_email ?? "système"}
                        </span>
                        {l.target_type && (
                          <>
                            <span>·</span>
                            <span className="font-mono">{l.target_type}</span>
                            {l.target_id && (
                              <span className="hidden font-mono md:inline">
                                {l.target_id.slice(0, 8)}…
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden text-[11px] text-muted-foreground md:inline">
                        {timeAgo(l.created_at)}
                      </span>
                      <ChevronRight
                        className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border/40 bg-background/30 px-5 py-3">
                      <div className="grid gap-3 text-[11px] md:grid-cols-2">
                        <DetailRow label="ID log" value={l.id} mono />
                        <DetailRow label="Date" value={new Date(l.created_at).toLocaleString("fr-FR")} />
                        <DetailRow label="Actor ID" value={l.actor_id} mono />
                        <DetailRow label="Actor role" value={l.actor_role} />
                        <DetailRow label="Action" value={l.action} mono />
                        <DetailRow label="Target type" value={l.target_type} mono />
                        <DetailRow label="Target ID" value={l.target_id} mono />
                        {l.ip && <DetailRow label="IP" value={l.ip} mono />}
                      </div>
                      {l.meta && Object.keys(l.meta).length > 0 && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                            Métadonnées (JSON)
                          </summary>
                          <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-[10px]">
                            {JSON.stringify(l.meta, null, 2)}
                          </pre>
                        </details>
                      )}
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
  label, value, color, icon: Icon,
}: { label: string; value: number; color: string; icon: typeof Activity }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">{value}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 truncate ${mono ? "font-mono text-[10px]" : ""}`} title={value ?? ""}>
        {value ?? "—"}
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
