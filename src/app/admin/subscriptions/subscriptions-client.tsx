"use client";

import { useMemo, useState } from "react";
import {
  Layers, DollarSign, TrendingUp, AlertCircle, CheckCircle2,
  Filter, ChevronDown, Calendar, XCircle,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SubRow = {
  id: string;
  user_id: string;
  user_email: string | null;
  user_country: string | null;
  plan: string;
  provider: string;
  external_id: string | null;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  monthly_usd: number;
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "#94A3B8", PRO: "#EC4899", AGENCY: "#FF8A00",
};

const STATUS_FILTERS = ["ALL", "active", "trialing", "past_due", "cancelled", "expired"];
const PLAN_FILTERS = ["ALL", "FREE", "PRO", "AGENCY"];

export function SubscriptionsClient({
  subs,
  stats,
  byPlan,
  planDist,
}: {
  subs: SubRow[];
  stats: {
    total: number; active: number; mrr: number; arr: number;
    cancelling: number; churned: number; avgRev: number;
  };
  byPlan: { plan: string; count: number; mrr: number }[];
  planDist: { plan: string; count: number }[];
}) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return subs.filter((s) => {
      if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
      if (planFilter !== "ALL" && s.plan !== planFilter) return false;
      return true;
    });
  }, [subs, statusFilter, planFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Subscriptions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plans FREE / PRO / AGENCY · MRR ${stats.mrr.toFixed(2)} · ARR ${stats.arr.toFixed(0)}
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        <Stat label="Total subs" value={stats.total.toString()} color="#EC4899" icon={Layers} />
        <Stat label="Actives" value={stats.active.toString()} color="#10B981" icon={CheckCircle2} />
        <Stat label="MRR" value={`$${stats.mrr.toFixed(0)}`} color="#EC4899" icon={DollarSign} />
        <Stat label="ARR" value={`$${stats.arr.toFixed(0)}`} color="#10B981" icon={TrendingUp} />
        <Stat label="ARPU" value={`$${stats.avgRev.toFixed(1)}`} color="#FF8A00" icon={DollarSign} />
        <Stat label="Churn 30j" value={stats.churned.toString()} color="#F43F5E" icon={XCircle} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="MRR par plan">
          {byPlan.length === 0 ? (
            <EmptyChart label="Aucun abonnement actif" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPlan} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <XAxis dataKey="plan" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(v) => [`$${v}`, "MRR"]}
                />
                <Bar dataKey="mrr" radius={[6, 6, 0, 0]} isAnimationActive>
                  {byPlan.map((p) => (
                    <Cell key={p.plan} fill={PLAN_COLORS[p.plan] ?? "#94A3B8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Distribution users par plan">
          {planDist.length === 0 ? (
            <EmptyChart label="Aucun user" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDist}
                  dataKey="count"
                  nameKey="plan"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  isAnimationActive
                >
                  {planDist.map((p) => (
                    <Cell key={p.plan} fill={PLAN_COLORS[p.plan] ?? "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-xl">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <FilterDropdown label="Statut" value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} />
        <FilterDropdown label="Plan" value={planFilter} options={PLAN_FILTERS} onChange={setPlanFilter} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-3 border-b border-border bg-background/40 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
          <div>User</div>
          <div>Plan</div>
          <div>Statut</div>
          <div>Provider</div>
          <div className="text-right">MRR</div>
          <div>Renew le</div>
          <div>Créé</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Aucun abonnement · les subs apparaîtront ici dès que les paiements Stripe / Wave seront wired
          </div>
        ) : (
          <ul>
            {filtered.map((s) => (
              <li
                key={s.id}
                className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/40 px-4 py-3 transition-colors hover:bg-card/30 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] md:px-5 last:border-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{s.user_email ?? "user inconnu"}</div>
                  <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                    {s.external_id ?? s.id.slice(0, 8)}
                  </div>
                </div>

                <div className="hidden md:block">
                  <PlanBadge plan={s.plan} />
                </div>

                <div className="hidden md:block">
                  <StatusBadge status={s.status} cancelling={s.cancel_at_period_end} />
                </div>

                <div className="hidden text-xs font-semibold md:block">{s.provider}</div>

                <div className="hidden text-right font-display text-sm font-bold md:block">
                  ${s.monthly_usd}
                </div>

                <div className="hidden text-[11px] text-muted-foreground md:block">
                  {new Date(s.current_period_end).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                </div>

                <div className="hidden text-[11px] text-muted-foreground md:block">
                  {timeAgo(s.created_at)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon }: {
  label: string; value: string; color: string; icon: typeof Layers;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="truncate font-display text-base font-bold leading-none">{value}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="mt-3 h-[200px]">{children}</div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
      {label}
    </div>
  );
}

function FilterDropdown({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-background/70">
        {label}: {value}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>{opt}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const color = PLAN_COLORS[plan] ?? "#94A3B8";
  return (
    <span className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
    >
      {plan}
    </span>
  );
}

function StatusBadge({ status, cancelling }: { status: string; cancelling: boolean }) {
  if (cancelling) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300">
        <Calendar className="h-2.5 w-2.5" />
        Cancelling
      </span>
    );
  }
  const colors: Record<string, string> = {
    active: "#10B981", trialing: "#FF8A00", past_due: "#FF8A00",
    cancelled: "#94A3B8", canceled: "#94A3B8", expired: "#94A3B8",
  };
  const color = colors[status] ?? "#94A3B8";
  return (
    <span className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
    >
      {status}
    </span>
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
