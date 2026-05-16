"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Layers, Save, Loader2, Crown, X, Plus, CheckCircle2,
  DollarSign, Sparkles, Eye, EyeOff,
} from "lucide-react";

export type PlanRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_monthly_usd: number;
  price_yearly_usd: number | null;
  features: string[];
  credits_included: number;
  max_audits_monthly: number | null;
  max_social_accounts: number | null;
  highlight: boolean;
  active: boolean;
  sort_order: number;
  updated_at: string;
};

const SLUG_COLORS: Record<string, string> = {
  FREE: "#94A3B8",
  PRO: "#7B61FF",
  AGENCY: "#FF8A00",
};

export function PlansClient({ initialPlans }: { initialPlans: PlanRow[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<PlanRow | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(p: PlanRow) {
    setEditing(p.id);
    setDraft({ ...p, features: [...p.features] });
  }

  function cancelEdit() {
    setEditing(null);
    setDraft(null);
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/plans/${draft.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          description: draft.description,
          price_monthly_usd: draft.price_monthly_usd,
          price_yearly_usd: draft.price_yearly_usd,
          features: draft.features,
          credits_included: draft.credits_included,
          max_audits_monthly: draft.max_audits_monthly,
          max_social_accounts: draft.max_social_accounts,
          highlight: draft.highlight,
          active: draft.active,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Échec");

      setPlans((prev) => prev.map((p) => (p.id === draft.id ? draft : p)));
      setEditing(null);
      setDraft(null);
      toast.success(`Plan ${draft.name} sauvegardé ✓`);
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(p: PlanRow) {
    try {
      const res = await fetch(`/api/admin/plans/${p.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Échec");
      setPlans((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !p.active } : x)));
      toast.success(p.active ? "Plan désactivé" : "Plan réactivé");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Subscription Plans
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Live editable
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Édite les prix, features et limites de chaque plan en direct. Les changements
          s&apos;appliquent immédiatement sur le pricing public.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const color = SLUG_COLORS[p.slug] ?? "#94A3B8";
          const isEditing = editing === p.id;
          const data = isEditing && draft ? draft : p;

          return (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-2xl border bg-card/40 p-5 backdrop-blur-xl transition-all ${
                p.highlight ? "border-[#7B61FF]/50 shadow-lg shadow-[#7B61FF]/10" : "border-border"
              }`}
            >
              {p.highlight && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  <Crown className="h-2.5 w-2.5" />
                  Most popular
                </span>
              )}

              {!p.active && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
                  <EyeOff className="h-2.5 w-2.5" />
                  Désactivé
                </span>
              )}

              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {p.slug[0]}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setDraft({ ...data, name: e.target.value })}
                    className="flex-1 rounded border border-border bg-background/40 px-2 py-1 font-display text-base font-bold outline-none focus:border-foreground/30"
                  />
                ) : (
                  <h3 className="font-display text-base font-bold">{data.name}</h3>
                )}
                <span className="font-mono text-[10px] text-muted-foreground">{p.slug}</span>
              </div>

              {/* Description */}
              {isEditing ? (
                <textarea
                  value={data.description ?? ""}
                  onChange={(e) => setDraft({ ...data, description: e.target.value })}
                  rows={2}
                  className="mt-3 w-full rounded border border-border bg-background/40 px-2 py-1 text-xs outline-none focus:border-foreground/30"
                />
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">{data.description}</p>
              )}

              {/* Pricing */}
              <div className="mt-4 space-y-2">
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Prix mensuel
                  </div>
                  {isEditing ? (
                    <input
                      type="number"
                      value={data.price_monthly_usd}
                      onChange={(e) => setDraft({ ...data, price_monthly_usd: Number(e.target.value) })}
                      min={0}
                      step={1}
                      className="mt-1 w-full bg-transparent font-display text-2xl font-bold outline-none"
                    />
                  ) : (
                    <div className="mt-1 font-display text-2xl font-bold">
                      <span style={{ color }}>${data.price_monthly_usd}</span>
                      <span className="text-xs text-muted-foreground">/mois</span>
                    </div>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Prix annuel (optionnel)
                  </div>
                  {isEditing ? (
                    <input
                      type="number"
                      value={data.price_yearly_usd ?? ""}
                      onChange={(e) => setDraft({
                        ...data,
                        price_yearly_usd: e.target.value ? Number(e.target.value) : null,
                      })}
                      min={0}
                      placeholder="—"
                      className="mt-1 w-full bg-transparent font-display text-lg font-bold outline-none"
                    />
                  ) : (
                    <div className="mt-1 font-display text-lg font-bold">
                      {data.price_yearly_usd != null ? `$${data.price_yearly_usd}/an` : "—"}
                    </div>
                  )}
                </div>
              </div>

              {/* Limits */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                <NumberField
                  label="Crédits"
                  value={data.credits_included}
                  isEditing={isEditing}
                  onChange={(v) => setDraft({ ...data, credits_included: v ?? 0 })}
                />
                <NumberField
                  label="Audits/mois"
                  value={data.max_audits_monthly}
                  isEditing={isEditing}
                  onChange={(v) => setDraft({ ...data, max_audits_monthly: v })}
                  nullable
                />
                <NumberField
                  label="Comptes sociaux"
                  value={data.max_social_accounts}
                  isEditing={isEditing}
                  onChange={(v) => setDraft({ ...data, max_social_accounts: v })}
                  nullable
                />
              </div>

              {/* Features */}
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Features ({data.features.length})
                </div>
                <ul className="mt-1.5 space-y-1.5">
                  {data.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <Sparkles className="mt-0.5 h-2.5 w-2.5 shrink-0" style={{ color }} />
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={f}
                            onChange={(e) => {
                              const next = [...data.features];
                              next[i] = e.target.value;
                              setDraft({ ...data, features: next });
                            }}
                            className="flex-1 rounded border border-border bg-background/40 px-2 py-0.5 text-xs outline-none focus:border-foreground/30"
                          />
                          <button
                            type="button"
                            onClick={() => setDraft({ ...data, features: data.features.filter((_, j) => j !== i) })}
                            className="text-muted-foreground hover:text-rose-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <span>{f}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...data, features: [...data.features, "Nouvelle feature"] })}
                    className="mt-2 inline-flex items-center gap-1 rounded border border-dashed border-border bg-background/40 px-2 py-1 text-[10px] hover:bg-background/70"
                  >
                    <Plus className="h-3 w-3" />
                    Ajouter feature
                  </button>
                )}
              </div>

              {/* Toggle highlight + actions */}
              {isEditing && (
                <label className="mt-4 flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={data.highlight}
                    onChange={(e) => setDraft({ ...data, highlight: e.target.checked })}
                    className="h-3.5 w-3.5 cursor-pointer rounded border-border accent-[#7B61FF]"
                  />
                  <span>Marquer comme "Most popular"</span>
                </label>
              )}

              <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={save}
                      disabled={saving}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Sauvegarder
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg border border-border bg-background/40 px-3 py-2 text-xs font-semibold hover:bg-background/70"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-2 text-xs font-semibold hover:bg-background/70"
                    >
                      Éditer
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      className="rounded-lg border border-border bg-background/40 px-3 py-2 text-xs"
                      title={p.active ? "Désactiver" : "Réactiver"}
                    >
                      {p.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </button>
                  </>
                )}
              </div>

              <div className="mt-2 text-[10px] text-muted-foreground">
                Maj {new Date(p.updated_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-[#7B61FF]/30 bg-[#7B61FF]/[0.06] p-4">
        <div className="flex items-start gap-3">
          <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-[#7B61FF]" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">Live editing :</b> les changements s&apos;appliquent immédiatement.
            Pour que les nouveaux prix soient visibles sur la landing publique, le composant{" "}
            <code className="rounded bg-background/60 px-1">PricingTable</code> doit fetch{" "}
            <code className="rounded bg-background/60 px-1">monetiq.plans_config</code> au lieu d&apos;utiliser
            les valeurs hardcodées de <code className="rounded bg-background/60 px-1">src/lib/pricing.ts</code>.
            Migration prochaine session.
          </p>
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, isEditing, onChange, nullable }: {
  label: string;
  value: number | null;
  isEditing: boolean;
  onChange: (v: number | null) => void;
  nullable?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2 text-center">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {isEditing ? (
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          placeholder={nullable ? "∞" : "0"}
          className="mt-0.5 w-full bg-transparent text-center font-display text-sm font-bold outline-none"
        />
      ) : (
        <div className="mt-0.5 font-display text-sm font-bold">
          {value ?? "∞"}
        </div>
      )}
    </div>
  );
}
