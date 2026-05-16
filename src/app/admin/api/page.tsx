"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Code2, KeyRound, Activity, Webhook, Shield, Eye, EyeOff, Copy, Check,
  Trash2, Plus, Loader2, Sparkles, AlertCircle, Zap,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip,
} from "recharts";

type ApiKey = {
  id: string;
  name: string;
  scope: "sandbox" | "production";
  user: string;
  user_email: string;
  key_mask: string;
  last_used: string | null;
  rpm: number;
  monthly_calls: number;
  created_at: string;
};

const MOCK_KEYS: ApiKey[] = [
  {
    id: "key-1",
    name: "Backend prod",
    scope: "production",
    user: "Sobé K.",
    user_email: "sobekande@gmail.com",
    key_mask: "sk_prod_…wXY7",
    last_used: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    rpm: 84,
    monthly_calls: 142_300,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "key-2",
    name: "Mobile app iOS",
    scope: "production",
    user: "Sobé K.",
    user_email: "sobekande@gmail.com",
    key_mask: "sk_prod_…aB12",
    last_used: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    rpm: 42,
    monthly_calls: 68_400,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: "key-3",
    name: "Sandbox dev",
    scope: "sandbox",
    user: "Sobé K.",
    user_email: "sobekande@gmail.com",
    key_mask: "sk_test_…42dd",
    last_used: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    rpm: 0,
    monthly_calls: 1_240,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
];

const RATE_LIMITS = [
  { plan: "FREE", rpm: 60, monthly: 1_000, color: "#94A3B8" },
  { plan: "PRO", rpm: 600, monthly: 50_000, color: "#7B61FF" },
  { plan: "AGENCY", rpm: 6_000, monthly: 500_000, color: "#FF8A00" },
];

const WEBHOOKS = [
  { url: "https://api.creafix.ai/webhooks/audit-complete", events: ["audit.completed"], status: "active", deliveries: 1240, last_delivery: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { url: "https://api.creafix.ai/webhooks/payment-success", events: ["payment.succeeded"], status: "active", deliveries: 348, last_delivery: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { url: "https://hooks.slack.com/services/T0/B0/xxx", events: ["user.signup", "subscription.upgrade"], status: "active", deliveries: 84, last_delivery: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
];

const USAGE_30D = Array.from({ length: 30 }, (_, i) => ({
  d: i + 1,
  v: Math.round(2_000 + i * 180 + Math.sin(i / 3) * 800),
}));

export default function ApiAdminPage() {
  const [keys, setKeys] = useState(MOCK_KEYS);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScope, setNewKeyScope] = useState<"sandbox" | "production">("sandbox");
  const [busy, setBusy] = useState(false);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
    toast.success("Copié");
  }

  function deleteKey(id: string) {
    if (!confirm("Supprimer cette clé API ?")) return;
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("Clé supprimée");
  }

  function createKey() {
    if (!newKeyName.trim()) {
      toast.error("Nom requis");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const newK: ApiKey = {
        id: `key-${Date.now()}`,
        name: newKeyName,
        scope: newKeyScope,
        user: "Sobé K.",
        user_email: "sobekande@gmail.com",
        key_mask: `sk_${newKeyScope === "sandbox" ? "test" : "prod"}_…${Math.random().toString(36).slice(-4)}`,
        last_used: null,
        rpm: 0,
        monthly_calls: 0,
        created_at: new Date().toISOString(),
      };
      setKeys((prev) => [newK, ...prev]);
      setNewKeyName("");
      setCreating(false);
      setBusy(false);
      toast.success("Clé créée");
    }, 500);
  }

  const totalCalls = keys.reduce((s, k) => s + k.monthly_calls, 0);
  const activeRpm = keys.reduce((s, k) => s + k.rpm, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            API Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Clés API, rate limits, webhooks · {keys.length} clés actives
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(!creating)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouvelle clé
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Clés actives" value={keys.length.toString()} color="#7B61FF" icon={KeyRound} />
        <Stat label="Calls / min" value={activeRpm.toString()} color="#10B981" icon={Activity} />
        <Stat label="Calls / mois" value={fmt(totalCalls)} color="#00C2FF" icon={Zap} />
        <Stat label="Webhooks" value={WEBHOOKS.length.toString()} color="#FF8A00" icon={Webhook} />
      </div>

      {/* Usage chart */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              API calls · 30 derniers jours
            </h2>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-xl font-bold">{fmt(USAGE_30D.reduce((s, p) => s + p.v, 0))}</span>
              <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-300">
                +24% vs M-1
              </span>
            </div>
          </div>
          <Activity className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="mt-3 h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={USAGE_30D} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C2FF" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#00C2FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                formatter={(v) => [fmt(Number(v)), "calls"]}
                labelFormatter={(d) => `J-${30 - Number(d)}`}
              />
              <Area type="monotone" dataKey="v" stroke="#00C2FF" strokeWidth={2} fill="url(#apiGrad)" isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Create form */}
      {creating && (
        <div className="rounded-2xl border border-[#7B61FF]/40 bg-[#7B61FF]/[0.06] p-5">
          <h2 className="font-display text-sm font-bold">Créer une nouvelle clé API</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-[2fr_1fr_auto]">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Nom de la clé (ex: Backend prod, Mobile iOS)"
              className="h-10 rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
            />
            <select
              value={newKeyScope}
              onChange={(e) => setNewKeyScope(e.target.value as "sandbox" | "production")}
              className="h-10 rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
            >
              <option value="sandbox">Sandbox</option>
              <option value="production">Production</option>
            </select>
            <button
              type="button"
              onClick={createKey}
              disabled={busy || !newKeyName.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Créer
            </button>
          </div>
        </div>
      )}

      {/* API Keys */}
      <div>
        <h2 className="mb-3 font-display text-sm font-bold">Clés API</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
          <ul className="divide-y divide-border/40">
            {keys.map((k) => {
              const isRevealed = revealed === k.id;
              const fullKey = `${k.key_mask.split("…")[0]}…${k.key_mask.split("…")[1]}`;

              return (
                <li key={k.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold">{k.name}</span>
                      <span
                        className={`inline-flex items-center rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider ${
                          k.scope === "production"
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {k.scope}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <code className="rounded bg-background/60 px-1.5 py-0.5 font-mono">
                        {isRevealed ? fullKey : k.key_mask}
                      </code>
                      <button
                        type="button"
                        onClick={() => setRevealed(isRevealed ? null : k.id)}
                        className="hover:text-foreground"
                      >
                        {isRevealed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copy(k.key_mask, k.id)}
                        className="hover:text-foreground"
                      >
                        {copied === k.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{k.user_email}</span>
                      <span>· {k.rpm} rpm</span>
                      <span>· {fmt(k.monthly_calls)} calls / mois</span>
                      {k.last_used && <span>· dernière {timeAgo(k.last_used)}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteKey(k.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/40 text-rose-500 transition-colors hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Rate limits */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold">
          <Shield className="h-4 w-4 text-[#7B61FF]" />
          Rate limits par plan
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {RATE_LIMITS.map((rl) => (
            <div key={rl.plan} className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl"
              style={{ borderColor: `${rl.color}33` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-bold">{rl.plan}</span>
                <Sparkles className="h-3.5 w-3.5" style={{ color: rl.color }} />
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requests / min</span>
                  <span className="font-display font-bold" style={{ color: rl.color }}>
                    {fmt(rl.rpm)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quota mensuel</span>
                  <span className="font-display font-bold">{fmt(rl.monthly)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold">
          <Webhook className="h-4 w-4 text-[#FF8A00]" />
          Webhooks configurés
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
          <ul className="divide-y divide-border/40">
            {WEBHOOKS.map((w, i) => (
              <li key={i} className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <Webhook className="h-3.5 w-3.5 text-emerald-500" />
                  <code className="truncate font-mono text-[11px]">{w.url}</code>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-emerald-500">
                    {w.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <div className="flex flex-wrap gap-1">
                    {w.events.map((e) => (
                      <span key={e} className="rounded bg-background/60 px-1.5 py-0 font-mono">{e}</span>
                    ))}
                  </div>
                  <span>· {fmt(w.deliveries)} deliveries · dernière {timeAgo(w.last_delivery)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">UI mockée :</b> tables <code className="rounded bg-background/60 px-1">api_keys</code>
            + <code className="rounded bg-background/60 px-1">webhooks</code> à créer.
            Rate limiting via Upstash Redis ou Vercel Edge Config en Phase D.
            JWT validation à brancher dans <code className="rounded bg-background/60 px-1">/api/v1/*</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon }: {
  label: string; value: string; color: string; icon: typeof Code2;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">{value}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
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
  return `${Math.floor(diff / 86400)} j`;
}
