"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Save, Trash2, KeyRound, Lock, AlertTriangle, CheckCircle2,
  Globe2, Eye, EyeOff, Loader2, Shield,
} from "lucide-react";

export type SecretMeta = {
  provider: string;
  key_name: string;
  last4: string;
  updated_at: string;
};

type ProviderWithKeys = {
  id: "STRIPE" | "PAYPAL" | "CINETPAY" | "FLUTTERWAVE";
  label: string;
  description: string;
  enabled: boolean;
  reason?: string;
  zones: string[];
  methods: string[];
  color: string;
  emoji: string;
  requiredKeys: string[];
  configuredKeys: SecretMeta[];
};

export function PaymentSecretsClient({ initial }: { initial: ProviderWithKeys[] }) {
  const [providers, setProviders] = useState(initial);
  const enabled = providers.filter((p) => p.enabled).length;

  function refreshAfterChange(provider: string, keyName: string, last4: string | null) {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== provider) return p;
        const without = p.configuredKeys.filter((k) => k.key_name !== keyName);
        const newKeys = last4
          ? [...without, { provider, key_name: keyName, last4, updated_at: new Date().toISOString() }]
          : without;
        const allRequired = p.requiredKeys.every((k) => newKeys.some((nk) => nk.key_name === k));
        return { ...p, configuredKeys: newKeys, enabled: allRequired, reason: allRequired ? undefined : p.reason };
      }),
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + security badge */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Configuration paiements
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
              <Shield className="h-2.5 w-2.5" />
              SUPER_ADMIN only
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-300">
              {enabled}/{providers.length} actifs
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Les clés sont chiffrées <b>AES-256-GCM</b> dans Supabase Vault. Stockage server-side
            uniquement, jamais transmises au navigateur après saisie.
          </p>
        </div>
      </header>

      {/* Security info card */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15">
            <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-emerald-700 dark:text-emerald-200">
              Stockage chiffré bout-en-bout
            </div>
            <ul className="mt-1.5 grid gap-1 text-[12px] text-emerald-700/80 dark:text-emerald-200/80 md:grid-cols-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                Chiffrement AES-256-GCM (Supabase Vault)
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                Lecture réservée au service_role (côté serveur)
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                Écriture réservée au SUPER_ADMIN strict (RPC)
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                Audit log automatique sur set / delete
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                Affichage masqué (•••••• + 4 derniers chars)
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                RLS bloque l'accès direct à la table de liaison
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Providers */}
      <div className="grid gap-3 md:grid-cols-2">
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} onChange={refreshAfterChange} />
        ))}
      </div>
    </div>
  );
}

function ProviderCard({
  provider, onChange,
}: {
  provider: ProviderWithKeys;
  onChange: (provider: string, keyName: string, last4: string | null) => void;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        provider.enabled
          ? "border-emerald-500/30 bg-emerald-500/[0.03]"
          : "border-amber-500/30 bg-amber-500/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid h-12 w-12 place-items-center rounded-2xl font-display text-lg font-bold text-white shadow-lg"
            style={{ backgroundColor: provider.color }}
          >
            {provider.label[0]}
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">{provider.label}</h2>
            <p className="text-[12px] text-muted-foreground">{provider.description}</p>
          </div>
        </div>
        {provider.enabled ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Actif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-300">
            <AlertTriangle className="h-3 w-3" /> Inactif
          </span>
        )}
      </div>

      {/* Required keys forms */}
      <div className="mt-5 space-y-3">
        {provider.requiredKeys.map((keyName) => {
          const existing = provider.configuredKeys.find((k) => k.key_name === keyName);
          return (
            <SecretField
              key={keyName}
              provider={provider.id}
              keyName={keyName}
              existing={existing}
              onChange={onChange}
            />
          );
        })}
      </div>

      <div className="mt-5 space-y-2 border-t border-border/60 pt-3 text-[11px]">
        <div className="flex items-start gap-1.5 text-muted-foreground">
          <Globe2 className="mt-0.5 h-3 w-3 shrink-0" />
          <div><b className="text-foreground">Zones :</b> {provider.zones.join(" · ")}</div>
        </div>
        <div className="flex items-start gap-1.5 text-muted-foreground">
          <KeyRound className="mt-0.5 h-3 w-3 shrink-0" />
          <div>
            <b className="text-foreground">Webhook URL :</b>{" "}
            <code className="font-mono text-[10.5px]">
              https://creafix-ai.vercel.app/api/webhooks/{provider.id.toLowerCase()}
            </code>
          </div>
        </div>
      </div>
    </article>
  );
}

function SecretField({
  provider, keyName, existing, onChange,
}: {
  provider: string;
  keyName: string;
  existing?: SecretMeta;
  onChange: (provider: string, keyName: string, last4: string | null) => void;
}) {
  const [editing, setEditing] = useState(!existing);
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [pending, startTransition] = useTransition();

  function save() {
    if (value.length < 8) {
      toast.error("Clé trop courte (min 8 caractères)");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/payment-secrets", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ provider, key_name: keyName, value }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
        toast.success(`${keyName} sauvegardée ✓`);
        onChange(provider, keyName, value.slice(-4));
        setValue("");
        setEditing(false);
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  function remove() {
    if (!confirm(`Supprimer la clé ${keyName} de manière définitive ?\n\nLe provider sera désactivé jusqu'à reconfiguration.`)) return;
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/payment-secrets?provider=${encodeURIComponent(provider)}&key_name=${encodeURIComponent(keyName)}`,
          { method: "DELETE" },
        );
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? "Échec");
        }
        toast.success("Clé supprimée");
        onChange(provider, keyName, null);
        setEditing(true);
        setValue("");
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-foreground/80">
          {keyName}
        </label>
        {existing && !editing && (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-2.5 w-2.5" /> Configurée
          </span>
        )}
      </div>

      {existing && !editing ? (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 font-mono text-[12px]">
            <Lock className="h-3 w-3 text-muted-foreground" />
            <span>•••••••••••••••••</span>
            <span className="text-foreground">{existing.last4}</span>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={pending}
            className="rounded-lg border border-border bg-background/40 px-3 py-2 text-[11px] font-semibold hover:bg-background/70 disabled:opacity-50"
          >
            Remplacer
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-500 hover:bg-rose-500/20 disabled:opacity-50"
            title="Supprimer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type={show ? "text" : "password"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Colle ta clé ${keyName} ici…`}
              disabled={pending}
              autoComplete="off"
              spellCheck={false}
              className="h-9 w-full rounded-lg border border-border bg-background/40 pl-3 pr-9 font-mono text-[12px] outline-none transition-colors focus:border-foreground/40"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={pending || value.length < 8}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f92c2c] to-[#f15b25] px-3 text-[11px] font-bold text-white shadow-sm shadow-[#f15522]/30 disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Sauver
          </button>
          {existing && (
            <button
              type="button"
              onClick={() => { setEditing(false); setValue(""); }}
              disabled={pending}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              Annuler
            </button>
          )}
        </div>
      )}
    </div>
  );
}
