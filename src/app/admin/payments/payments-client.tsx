"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CreditCard, DollarSign, CheckCircle2, AlertCircle, Clock, RefreshCcw,
  Filter, ChevronDown, TrendingUp, Loader2, Undo2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PaymentRow = {
  id: string;
  user_id: string;
  user_email: string | null;
  user_country: string | null;
  provider: string;
  external_id: string | null;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
  paid_at: string | null;
};

const STATUS_FILTERS = ["ALL", "SUCCEEDED", "PENDING", "FAILED", "REFUNDED"];
const PROVIDER_FILTERS = ["ALL", "STRIPE", "PAYPAL", "WAVE", "ORANGE_MONEY", "MTN_MOMO", "MOOV_MONEY", "FREE_MONEY", "PAYDUNYA", "CINETPAY"];

const STATUS_META: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  SUCCEEDED: { icon: CheckCircle2,  color: "#10B981" },
  PENDING:   { icon: Clock,         color: "#FF8A00" },
  FAILED:    { icon: AlertCircle,   color: "#F43F5E" },
  REFUNDED:  { icon: RefreshCcw,    color: "#EC4899" },
};

const PROVIDER_COLORS: Record<string, string> = {
  STRIPE: "#635BFF", PAYPAL: "#0070BA", WAVE: "#1DBFFA",
  ORANGE_MONEY: "#FF7900", MTN_MOMO: "#FFCC00", MOOV_MONEY: "#0064FF",
  FREE_MONEY: "#10B981", PAYDUNYA: "#FF8A00", CINETPAY: "#F43F5E",
};

export function PaymentsClient({ initialPayments }: { initialPayments: PaymentRow[] }) {
  const [payments, setPayments] = useState(initialPayments);
  const [refunding, setRefunding] = useState<string | null>(null);

  async function refund(id: string) {
    if (!confirm("Confirmer le remboursement de cette transaction ?")) return;
    setRefunding(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/refund`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: "REFUNDED" } : p)));
      toast.success("Marqué REFUNDED", { description: json.note });
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setRefunding(null);
    }
  }
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [providerFilter, setProviderFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (providerFilter !== "ALL" && p.provider !== providerFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          (p.user_email ?? "").toLowerCase().includes(s) ||
          p.id.toLowerCase().includes(s) ||
          (p.external_id ?? "").toLowerCase().includes(s) ||
          (p.description ?? "").toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [payments, search, statusFilter, providerFilter]);

  const stats = useMemo(() => {
    const succ = payments.filter((p) => p.status === "SUCCEEDED");
    const totalUsd = succ.reduce((s, p) => s + (p.currency === "USD" ? p.amount : 0), 0);
    const totalXof = succ.reduce((s, p) => s + (p.currency === "XOF" ? p.amount : 0), 0);
    return {
      total: payments.length,
      succeeded: succ.length,
      pending: payments.filter((p) => p.status === "PENDING").length,
      failed: payments.filter((p) => p.status === "FAILED").length,
      revenueUsd: totalUsd,
      revenueXof: totalXof,
    };
  }, [payments]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Payments Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stripe + Wave + Orange Money + MTN + PayPal · {payments.length} transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Total transactions" value={stats.total.toString()} color="#EC4899" icon={CreditCard} />
        <Stat label="Réussies" value={stats.succeeded.toString()} color="#10B981" icon={CheckCircle2} />
        <Stat label="En attente" value={stats.pending.toString()} color="#FF8A00" icon={Clock} />
        <Stat label="Échecs" value={stats.failed.toString()} color="#F43F5E" icon={AlertCircle} />
        <Stat
          label="Revenus USD"
          value={`$${stats.revenueUsd.toFixed(0)}`}
          color="#10B981"
          icon={DollarSign}
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
            placeholder="Rechercher email, transaction id…"
            className="h-9 w-full rounded-lg border border-border bg-background/40 pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
          />
        </div>
        <FilterDropdown label="Statut" value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} />
        <FilterDropdown label="Provider" value={providerFilter} options={PROVIDER_FILTERS} onChange={setProviderFilter} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 border-b border-border bg-background/40 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
          <div>User</div>
          <div>Provider</div>
          <div className="text-right">Montant</div>
          <div>Statut</div>
          <div>Date</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Aucune transaction · les paiements apparaitront ici dès le wiring Stripe / Wave
          </div>
        ) : (
          <ul>
            {filtered.map((p) => {
              const meta = STATUS_META[p.status] ?? STATUS_META.PENDING;
              const Icon = meta.icon;
              const provColor = PROVIDER_COLORS[p.provider] ?? "#94A3B8";

              return (
                <li
                  key={p.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/40 px-4 py-3 transition-colors hover:bg-card/30 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:px-5 last:border-0"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p.user_email ?? "user inconnu"}</div>
                    <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                      {p.external_id ?? p.id.slice(0, 8)}
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <span
                      className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: provColor, borderColor: `${provColor}55`, backgroundColor: `${provColor}1A` }}
                    >
                      {p.provider}
                    </span>
                  </div>

                  <div className="hidden text-right font-display text-sm font-bold md:block">
                    {p.currency === "USD" || p.currency === "EUR" ? "$" : ""}
                    {p.amount.toLocaleString("fr-FR")} {p.currency !== "USD" && p.currency !== "EUR" && p.currency}
                  </div>

                  <div className="hidden md:block">
                    <span
                      className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: meta.color, borderColor: `${meta.color}55`, backgroundColor: `${meta.color}1A` }}
                    >
                      <Icon className="h-2.5 w-2.5" />
                      {p.status}
                    </span>
                  </div>

                  <div className="hidden text-[11px] text-muted-foreground md:block">
                    {timeAgo(p.created_at)}
                  </div>

                  <div className="flex items-center justify-end">
                    {p.status === "SUCCEEDED" ? (
                      <button
                        type="button"
                        onClick={() => refund(p.id)}
                        disabled={refunding === p.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 transition-colors hover:bg-rose-500/20 disabled:opacity-50 dark:text-rose-300"
                      >
                        {refunding === p.id ? (
                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        ) : (
                          <Undo2 className="h-2.5 w-2.5" />
                        )}
                        Refund
                      </button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/60">—</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">Wiring backend en attente :</b> les webhooks Stripe / Wave / Orange Money
            doivent être branchés via <code className="rounded bg-background/60 px-1">/api/webhooks/[provider]</code>
            pour que les paiements remontent ici en temps réel. Schéma DB et UI prêts.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon }: {
  label: string; value: string; color: string; icon: typeof CheckCircle2;
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

function FilterDropdown({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-background/70">
        {label}: {value}
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>{opt}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
