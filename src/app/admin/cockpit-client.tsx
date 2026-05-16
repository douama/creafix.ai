"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  CreditCard,
  DollarSign,
  Globe2,
  Activity,
  Layers,
  TrendingUp,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { LiveFeed } from "@/components/admin/live-feed";

type Kpis = {
  users: number;
  audits: number;
  auditsToday: number;
  subs: number;
  payments: number;
  revenue: number;
  socials: number;
  countries: number;
};

type RecentUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  plan: string | null;
  country: string | null;
  created_at: string;
};

type RecentAudit = {
  id: string;
  status: string;
  mode: string;
  score_global: number | null;
  started_at: string;
};

// Série mocked pour la sparkline (à remplacer par vraie agrégation Supabase plus tard)
const TREND_30D = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  v: Math.round(8 + i * 0.4 + Math.sin(i / 3) * 4),
}));

export function CockpitClient({
  kpis,
  recent,
}: {
  kpis: Kpis;
  recent: { users: RecentUser[]; audits: RecentAudit[] };
}) {
  const KPI_CARDS = [
    { label: "Users actifs", value: fmt(kpis.users), icon: Users, color: "#7B61FF", delta: kpis.users > 0 ? "live" : "—" },
    { label: "Audits totaux", value: fmt(kpis.audits), icon: Search, color: "#00C2FF", delta: `+${kpis.auditsToday} aujourd'hui` },
    { label: "Abonnements", value: fmt(kpis.subs), icon: Layers, color: "#FF8A00", delta: "MRR" },
    { label: "Revenus encaissés", value: `$${fmt(kpis.revenue)}`, icon: DollarSign, color: "#10B981", delta: `${kpis.payments} paiements` },
    { label: "Comptes sociaux", value: fmt(kpis.socials), icon: Activity, color: "#F43F5E", delta: "connectés" },
    { label: "Pays couverts", value: fmt(kpis.countries), icon: Globe2, color: "#FBBF24", delta: "Afrique" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Cockpit Admin
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
              <Sparkles className="h-2.5 w-2.5" />
              Super Admin
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Bienvenue sur le centre de contrôle CreaFix AI · données live Supabase
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold text-emerald-500 dark:text-emerald-300">
            All systems operational
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {KPI_CARDS.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: k.color }}
              />
              <div className="relative flex items-center justify-between">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg border"
                  style={{ backgroundColor: `${k.color}1A`, borderColor: `${k.color}55` }}
                >
                  <Icon className="h-4 w-4" style={{ color: k.color }} />
                </div>
              </div>
              <div className="relative mt-3 font-display text-2xl font-bold leading-none">
                {k.value}
              </div>
              <div className="relative mt-1 flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>{k.label}</span>
                <span style={{ color: k.color }}>{k.delta}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Croissance utilisateurs · 30 j
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold">{kpis.users}</span>
                <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-300">
                  données mockées
                </span>
              </div>
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_30D} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="users-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(v) => [v, "Users"]}
                  labelFormatter={(d) => `J-${30 - Number(d)}`}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#7B61FF"
                  strokeWidth={2}
                  fill="url(#users-grad)"
                  isAnimationActive
                  animationDuration={1400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Quick actions
          </div>
          <div className="mt-3 space-y-2">
            <ActionRow icon={Users} label="Gérer les utilisateurs" href="/admin/users" color="#7B61FF" />
            <ActionRow icon={Search} label="Audits IA récents" href="/admin/audits" color="#00C2FF" />
            <ActionRow icon={CreditCard} label="Paiements & abos" href="/admin/payments" color="#10B981" />
            <ActionRow icon={Activity} label="Agents IA" href="/admin/agents" color="#FF8A00" />
          </div>
        </div>
      </div>

      {/* Live feed (Supabase Realtime) */}
      <LiveFeed />

      {/* Recent feeds */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent users */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-5 py-3">
            <h2 className="font-display text-sm font-bold">Derniers users</h2>
            <a href="/admin/users" className="text-[11px] text-muted-foreground hover:text-foreground">
              Tout voir →
            </a>
          </div>
          {recent.users.length === 0 ? (
            <EmptyState label="Aucun utilisateur encore" icon={Users} />
          ) : (
            <ul className="divide-y divide-border/40">
              {recent.users.map((u) => (
                <li key={u.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-[10px] font-bold text-white">
                    {(u.full_name ?? u.email).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-xs font-semibold">
                        {u.full_name ?? u.email}
                      </span>
                      <RoleBadge role={u.role} />
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      {u.email} {u.country && `· ${u.country}`}
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {timeAgo(u.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent audits */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-5 py-3">
            <h2 className="font-display text-sm font-bold">Audits récents</h2>
            <a href="/admin/audits" className="text-[11px] text-muted-foreground hover:text-foreground">
              Tout voir →
            </a>
          </div>
          {recent.audits.length === 0 ? (
            <EmptyState label="Aucun audit lancé" icon={Search} />
          ) : (
            <ul className="divide-y divide-border/40">
              {recent.audits.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                  <StatusIcon status={a.status} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold">
                      Audit #{a.id.slice(0, 8)}
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      Mode {a.mode} ·{" "}
                      {a.score_global ? `Score ${a.score_global}/100` : "en cours"}
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {timeAgo(a.started_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  label,
  href,
  color,
}: {
  icon: typeof Users;
  label: string;
  href: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-background/40 p-2.5 transition-all hover:border-foreground/20 hover:bg-background/70"
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <span className="flex-1 text-xs font-semibold">{label}</span>
      <span className="text-[10px] text-muted-foreground group-hover:text-foreground">→</span>
    </a>
  );
}

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return null;
  const colors: Record<string, string> = {
    ADMIN: "#F43F5E",
    AGENCY: "#7B61FF",
    INFLUENCER: "#FF8A00",
    CREATOR: "#10B981",
  };
  const color = colors[role] ?? "#94A3B8";
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider"
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}1A`,
      }}
    >
      {role}
    </span>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "COMPLETED")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />;
  if (status === "FAILED") return <AlertCircle className="h-4 w-4 text-rose-500" />;
  return <Clock className="h-4 w-4 text-muted-foreground" />;
}

function EmptyState({
  label,
  icon: Icon,
}: {
  label: string;
  icon: typeof Users;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
      <Icon className="h-6 w-6 text-muted-foreground/40" />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(iso: string) {
  const date = new Date(iso);
  const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "à l'instant";
  if (diffSec < 3600) return `il y a ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `il y a ${Math.floor(diffSec / 3600)} h`;
  return `il y a ${Math.floor(diffSec / 86400)} j`;
}
