"use client";

import {
  Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, Search, DollarSign, Layers, TrendingUp, BarChart3,
} from "lucide-react";

type Data = {
  totals: {
    users: number; audits: number; subs: number; payments: number; mrr: number;
  };
  dailyUsers: { d: string; v: number }[];
  dailyAudits: { d: string; v: number }[];
  dailyRevenue: { d: string; v: number }[];
  byCountry: { key: string; count: number }[];
  byPlan: { key: string; count: number }[];
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "#94A3B8", PRO: "#7B61FF", AGENCY: "#FF8A00",
};

const COUNTRY_FLAGS: Record<string, string> = {
  SN: "🇸🇳", CI: "🇨🇮", NG: "🇳🇬", CM: "🇨🇲", MA: "🇲🇦",
  ZA: "🇿🇦", GH: "🇬🇭", ML: "🇲🇱", CD: "🇨🇩",
};

export function AnalyticsClient({ data }: { data: Data }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Analytics Center
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          KPIs business CreaFix AI · données live Supabase
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi label="Users totaux" value={data.totals.users.toLocaleString("fr-FR")} icon={Users} color="#7B61FF" />
        <Kpi label="Audits totaux" value={data.totals.audits.toLocaleString("fr-FR")} icon={Search} color="#FF8A00" />
        <Kpi label="Abos actifs" value={data.totals.subs.toLocaleString("fr-FR")} icon={Layers} color="#FF8A00" />
        <Kpi label="Paiements" value={data.totals.payments.toLocaleString("fr-FR")} icon={DollarSign} color="#10B981" />
        <Kpi label="MRR (30j)" value={`$${data.totals.mrr.toFixed(0)}`} icon={TrendingUp} color="#F43F5E" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Croissance users · 30j" color="#7B61FF">
          <AreaChart data={data.dailyUsers} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7B61FF" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#7B61FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="d" hide />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Users"]} />
            <Area type="monotone" dataKey="v" stroke="#7B61FF" strokeWidth={2} fill="url(#usersGrad)" isAnimationActive />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Audits / jour · 30j" color="#FF8A00">
          <BarChart data={data.dailyAudits} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <XAxis dataKey="d" hide />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "Audits"]} />
            <Bar dataKey="v" fill="#FF8A00" radius={[4, 4, 0, 0]} isAnimationActive />
          </BarChart>
        </ChartCard>

        <ChartCard title="Revenus / jour · 30j ($)" color="#10B981">
          <AreaChart data={data.dailyRevenue} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="d" hide />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}`, "Revenus"]} />
            <Area type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} fill="url(#revGrad)" isAnimationActive />
          </AreaChart>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top pays */}
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold">Top pays · users</h2>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          {data.byCountry.length === 0 ? (
            <p className="mt-6 text-center text-xs text-muted-foreground">Aucune donnée</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.byCountry.slice(0, 9).map((c) => {
                const flag = COUNTRY_FLAGS[c.key] ?? "🏳";
                const max = data.byCountry[0]?.count || 1;
                const pct = (c.count / max) * 100;
                return (
                  <li key={c.key} className="flex items-center gap-3 text-xs">
                    <span className="text-base">{flag}</span>
                    <span className="w-12 font-mono">{c.key}</span>
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted/30">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#7B61FF] to-[#FF8A00]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-semibold">{c.count}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Plans pie */}
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold">Distribution des plans</h2>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          {data.byPlan.length === 0 ? (
            <p className="mt-6 text-center text-xs text-muted-foreground">Aucune donnée</p>
          ) : (
            <div className="mt-4 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.byPlan}
                    dataKey="count"
                    nameKey="key"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    isAnimationActive
                  >
                    {data.byPlan.map((p) => (
                      <Cell key={p.key} fill={PLAN_COLORS[p.key] ?? "#94A3B8"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label, value, icon: Icon, color,
}: {
  label: string; value: string; icon: typeof Users; color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="relative flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border"
          style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <div>
          <div className="font-display text-lg font-bold leading-none">{value}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title, color, children,
}: { title: string; color: string; children: React.ReactElement }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <div className="mt-3 h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
};
