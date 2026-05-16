"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Ticket, Plus, Trash2, Loader2, Calendar, CheckCircle2, XCircle,
  Copy, Check, Percent, DollarSign, Gift,
} from "lucide-react";

export type CouponRow = {
  id: string;
  code: string;
  kind: string;
  value: number;
  currency: string;
  max_uses: number | null;
  used_count: number;
  applies_to_plan: string | null;
  expires_at: string | null;
  active: boolean;
  created_at: string;
};

const KIND_META: Record<string, { icon: typeof Percent; label: string; color: string }> = {
  PERCENT:   { icon: Percent,    label: "Pourcentage", color: "#7B61FF" },
  FIXED:     { icon: DollarSign, label: "Montant fixe", color: "#10B981" },
  FREE_PLAN: { icon: Gift,       label: "Plan gratuit", color: "#FF8A00" },
};

export function CouponsClient({ initialCoupons }: { initialCoupons: CouponRow[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [kind, setKind] = useState("PERCENT");
  const [value, setValue] = useState(20);
  const [maxUses, setMaxUses] = useState<number | "">("");
  const [appliesTo, setAppliesTo] = useState("");
  const [expiresIn, setExpiresIn] = useState<number | "">(30);

  const stats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter((c) => c.active && !isExpired(c.expires_at)).length,
    used: coupons.reduce((s, c) => s + c.used_count, 0),
    expired: coupons.filter((c) => isExpired(c.expires_at)).length,
  }), [coupons]);

  async function create() {
    if (!code.trim()) {
      toast.error("Code requis");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          kind,
          value,
          max_uses: maxUses || null,
          applies_to_plan: appliesTo || null,
          expires_at: expiresIn
            ? new Date(Date.now() + Number(expiresIn) * 86400 * 1000).toISOString()
            : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");

      setCoupons((prev) => [json.coupon, ...prev]);
      setCode("");
      setCreating(false);
      toast.success("Coupon créé ✓");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(c: CouponRow) {
    setActing(c.id);
    try {
      const res = await fetch(`/api/admin/coupons/${c.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ active: !c.active }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Échec");
      setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !c.active } : x)));
      toast.success(c.active ? "Coupon désactivé" : "Coupon réactivé");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setActing(null);
    }
  }

  async function deleteCoupon(id: string) {
    if (!confirm("Supprimer ce coupon définitivement ?")) return;
    setActing(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Échec");
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success("Coupon supprimé");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setActing(null);
    }
  }

  function copyCode(c: string) {
    navigator.clipboard.writeText(c);
    setCopied(c);
    toast.success(`Code ${c} copié`);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Coupons & promotions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestion des codes promo · {coupons.length} codes au total
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(!creating)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouveau code
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total codes" value={stats.total} color="#7B61FF" icon={Ticket} />
        <Stat label="Actifs" value={stats.active} color="#10B981" icon={CheckCircle2} />
        <Stat label="Utilisations" value={stats.used} color="#00C2FF" icon={Percent} />
        <Stat label="Expirés" value={stats.expired} color="#94A3B8" icon={Calendar} />
      </div>

      {/* Create form */}
      {creating && (
        <div className="rounded-2xl border border-[#7B61FF]/40 bg-[#7B61FF]/[0.06] p-5">
          <h2 className="font-display text-sm font-bold">Créer un coupon</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Code (auto-uppercase)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ex: LAUNCH50"
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 font-mono text-sm uppercase outline-none focus:border-foreground/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
              >
                <option value="PERCENT">% Réduction</option>
                <option value="FIXED">$ Réduction fixe</option>
                <option value="FREE_PLAN">Plan gratuit</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Valeur ({kind === "PERCENT" ? "%" : "USD"})
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                min={1}
                max={kind === "PERCENT" ? 100 : 9999}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Max utilisations (vide = illimité)
              </label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value ? Number(e.target.value) : "")}
                min={1}
                placeholder="100"
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Plan ciblé (vide = tous)
              </label>
              <select
                value={appliesTo}
                onChange={(e) => setAppliesTo(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
              >
                <option value="">Tous les plans</option>
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
                <option value="AGENCY">AGENCY</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Expire dans (jours)
              </label>
              <input
                type="number"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value ? Number(e.target.value) : "")}
                min={1}
                placeholder="30"
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={create}
            disabled={busy || !code.trim()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Créer le coupon
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        {coupons.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Aucun coupon · click "Nouveau code" pour en créer
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {coupons.map((c) => {
              const kindMeta = KIND_META[c.kind] ?? KIND_META.PERCENT;
              const KindIcon = kindMeta.icon;
              const expired = isExpired(c.expires_at);
              const isFull = c.max_uses != null && c.used_count >= c.max_uses;
              const isUsable = c.active && !expired && !isFull;

              return (
                <li key={c.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                      style={{ backgroundColor: `${kindMeta.color}1A`, borderColor: `${kindMeta.color}55` }}
                    >
                      <KindIcon className="h-4 w-4" style={{ color: kindMeta.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm font-bold">{c.code}</code>
                        <button
                          type="button"
                          onClick={() => copyCode(c.code)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {copied === c.code ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {kindMeta.label}
                        {c.applies_to_plan && ` · Plan ${c.applies_to_plan}`}
                      </div>
                    </div>
                  </div>

                  <div className="hidden text-sm md:block">
                    <span className="font-display text-base font-bold" style={{ color: kindMeta.color }}>
                      {c.value}
                      {c.kind === "PERCENT" ? "%" : ` ${c.currency}`}
                    </span>
                  </div>

                  <div className="hidden text-xs md:block">
                    <span className="font-semibold">{c.used_count}</span>
                    <span className="text-muted-foreground"> / {c.max_uses ?? "∞"}</span>
                  </div>

                  <div className="hidden text-[11px] md:block">
                    {c.expires_at ? (
                      <span className={expired ? "text-rose-500" : "text-muted-foreground"}>
                        {expired ? "Expiré · " : ""}
                        {new Date(c.expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Pas d&apos;expiration</span>
                    )}
                  </div>

                  <div className="hidden md:block">
                    {isUsable ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
                        <XCircle className="h-2.5 w-2.5" />
                        {isFull ? "Épuisé" : expired ? "Expiré" : "Désactivé"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleActive(c)}
                      disabled={acting === c.id}
                      className="rounded-lg border border-border bg-background/40 px-2 py-1 text-[10px] font-semibold transition-colors hover:bg-background/70 disabled:opacity-50"
                    >
                      {acting === c.id ? "..." : c.active ? "Désactiver" : "Activer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(c.id)}
                      disabled={acting === c.id}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background/40 text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon }: {
  label: string; value: number; color: string; icon: typeof Ticket;
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

function isExpired(iso: string | null): boolean {
  if (!iso) return false;
  return new Date(iso).getTime() < Date.now();
}
