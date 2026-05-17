"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Key,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Shield,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Globe2,
  Clock,
  XCircle,
  Activity,
} from "lucide-react";

export type PlatformConfig = {
  platform: string;
  enabled: boolean;
  countries: string[];
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
};

export type CredentialMeta = {
  platform: string;
  key_name: string;
  last4: string;
  updated_at: string;
};

type KeyDef = {
  name: string;
  label: string;
  required: boolean;
  hint?: string;
};

type PlatformData = {
  id: string;
  label: string;
  color: string;
  apiVersion: string;
  enabled: boolean;
  countries: string[];
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastSyncError: string | null;
  keyDefs: KeyDef[];
  configuredKeys: CredentialMeta[];
};

const COUNTRIES = [
  { code: "CI", label: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "NG", label: "Nigeria",        flag: "🇳🇬" },
  { code: "MA", label: "Maroc",          flag: "🇲🇦" },
  { code: "CM", label: "Cameroun",       flag: "🇨🇲" },
  { code: "ZA", label: "Afrique du Sud", flag: "🇿🇦" },
  { code: "SN", label: "Sénégal",        flag: "🇸🇳" },
];

const PLATFORM_ABBR: Record<string, string> = {
  tiktok: "TT", instagram: "IG", youtube: "YT", twitter: "X", facebook: "FB",
};

function isFullyConfigured(p: PlatformData) {
  return p.keyDefs
    .filter((d) => d.required)
    .every((d) => p.configuredKeys.some((c) => c.key_name === d.name));
}

export function PlatformApisClient({
  platforms: initial,
}: {
  platforms: PlatformData[];
}) {
  const [platforms, setPlatforms] = useState(initial);
  const enabledCount = platforms.filter((p) => p.enabled).length;
  const configuredCount = platforms.filter(isFullyConfigured).length;

  function updatePlatform(id: string, update: Partial<PlatformData>) {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...update } : p)),
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Platform APIs
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
              <Shield className="h-2.5 w-2.5" />
              SUPER_ADMIN only
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#1FBEAF]/30 bg-[#1FBEAF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1FBEAF]">
              {enabledCount}/5 actifs
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-500 dark:text-violet-300">
              {configuredCount}/5 configurés
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure les credentials API pour alimenter l&apos;African Trend
            Scanner en données réelles. Collecte automatique toutes les heures
            via cron.
          </p>
        </div>
      </header>

      {/* Security notice */}
      <div className="rounded-2xl border border-[#1FBEAF]/30 bg-[#1FBEAF]/[0.03] p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1FBEAF]/15">
            <Lock className="h-4 w-4 text-[#1FBEAF]" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-[#1FBEAF]">
              African Trend Scanner — Collecte de données réelles
            </div>
            <ul className="mt-2 grid gap-1 text-[12px] text-muted-foreground md:grid-cols-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#1FBEAF]" />
                Clés stockées côté serveur uniquement (jamais exposées au browser)
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#1FBEAF]" />
                Valeurs protégées par RLS service_role strict
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#1FBEAF]" />
                Écriture/suppression réservées au SUPER_ADMIN (RPC)
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#1FBEAF]" />
                Cron{" "}
                <code className="rounded bg-muted/40 px-1 font-mono">
                  /api/cron/trends-sync
                </code>{" "}
                · toutes les heures
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Platform cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {platforms.map((p) => (
          <PlatformCard
            key={p.id}
            platform={p}
            onUpdate={(u) => updatePlatform(p.id, u)}
          />
        ))}
      </div>

      {/* Sync overview */}
      <SyncOverview platforms={platforms} />
    </div>
  );
}

function PlatformCard({
  platform: p,
  onUpdate,
}: {
  platform: PlatformData;
  onUpdate: (u: Partial<PlatformData>) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [syncing, setSyncing] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const credentialsOk = isFullyConfigured(p);
  const requiredKeys = p.keyDefs.filter((d) => d.required);

  function toggleEnabled() {
    if (!credentialsOk && !p.enabled) {
      toast.error(
        "Configure d'abord les clés API obligatoires avant d'activer.",
      );
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/platform-apis", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            platform: p.id,
            enabled: !p.enabled,
            countries: p.countries,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
        onUpdate({ enabled: !p.enabled });
        toast.success(
          `${p.label} ${!p.enabled ? "activé ✓" : "désactivé"}`,
        );
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  function toggleCountry(code: string) {
    const newList = p.countries.includes(code)
      ? p.countries.filter((c) => c !== code)
      : [...p.countries, code];
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/platform-apis", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            platform: p.id,
            enabled: p.enabled,
            countries: newList,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
        onUpdate({ countries: newList });
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  async function triggerSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/platform-apis/sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform: p.id }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
      toast.success(`Sync déclenché pour ${p.label}`);
      onUpdate({
        lastSyncStatus: "pending",
        lastSyncAt: new Date().toISOString(),
      });
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? "Échec du sync");
    } finally {
      setSyncing(false);
    }
  }

  function refreshKey(keyName: string, last4: string | null) {
    const without = p.configuredKeys.filter((c) => c.key_name !== keyName);
    const newKeys = last4
      ? [
          ...without,
          {
            platform: p.id,
            key_name: keyName,
            last4,
            updated_at: new Date().toISOString(),
          },
        ]
      : without;
    const newAllRequired = requiredKeys.every((d) =>
      newKeys.some((c) => c.key_name === d.name),
    );
    onUpdate({
      configuredKeys: newKeys,
      enabled: newAllRequired ? p.enabled : false,
    });
  }

  const cardBorder =
    p.enabled && credentialsOk
      ? "border-emerald-500/30 bg-emerald-500/[0.02]"
      : credentialsOk
        ? "border-amber-500/30 bg-amber-500/[0.02]"
        : "border-border bg-card/30";

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 transition-colors ${cardBorder}`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-display text-sm font-bold text-white shadow-lg"
            style={{
              backgroundColor:
                p.color === "#010101" ? "#2a2a2a" : p.color,
            }}
          >
            {PLATFORM_ABBR[p.id] ?? p.id.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">{p.label}</h2>
            <p className="text-[11px] text-muted-foreground">
              API {p.apiVersion} · {requiredKeys.length} clés requises
            </p>
          </div>
        </div>
        <div className="shrink-0">
          {p.enabled && credentialsOk ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> Actif
            </span>
          ) : credentialsOk ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-300">
              <AlertTriangle className="h-3 w-3" /> Inactif
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-300">
              <Key className="h-3 w-3" /> Non configuré
            </span>
          )}
        </div>
      </div>

      {/* Sync status */}
      <SyncStatus
        platform={p}
        onSync={triggerSync}
        syncing={syncing}
        credentialsOk={credentialsOk}
      />

      {/* Credentials */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Clés API
          </span>
          <span className="text-[11px] text-muted-foreground">
            {p.configuredKeys.length}/{p.keyDefs.length} configurées
          </span>
        </div>
        {p.keyDefs.map((def) => {
          const existing = p.configuredKeys.find(
            (c) => c.key_name === def.name,
          );
          return (
            <SecretField
              key={def.name}
              platform={p.id}
              def={def}
              existing={existing}
              onChange={refreshKey}
            />
          );
        })}
      </div>

      {/* Countries */}
      <div className="mt-4 border-t border-border/60 pt-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          onClick={() => setShowCountries((v) => !v)}
        >
          <span className="flex items-center gap-1.5">
            <Globe2 className="h-3 w-3" />
            Pays collectés ({p.countries.length}/6)
          </span>
          <span className="text-[10px]">{showCountries ? "▲" : "▼"}</span>
        </button>
        {showCountries && (
          <div className="mt-3 flex flex-wrap gap-2">
            {COUNTRIES.map((c) => {
              const active = p.countries.includes(c.code);
              return (
                <button
                  key={c.code}
                  type="button"
                  disabled={pending}
                  onClick={() => toggleCountry(c.code)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors disabled:opacity-50 ${
                    active
                      ? "border-[#1FBEAF]/50 bg-[#1FBEAF]/15 text-[#1FBEAF]"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {c.flag} {c.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Enable / Disable toggle */}
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-[12px] text-muted-foreground">
          {credentialsOk
            ? "Clés configurées — prêt à activer"
            : "Configure les clés API pour activer"}
        </span>
        <button
          type="button"
          disabled={pending || (!credentialsOk && !p.enabled)}
          onClick={toggleEnabled}
          className={`inline-flex h-9 items-center gap-2 rounded-xl border px-4 text-[12px] font-bold transition-all disabled:opacity-40 ${
            p.enabled
              ? "border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
              : "border-[#1FBEAF]/30 bg-[#1FBEAF]/10 text-[#1FBEAF] hover:bg-[#1FBEAF]/20"
          }`}
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : p.enabled ? (
            <ToggleRight className="h-3.5 w-3.5" />
          ) : (
            <ToggleLeft className="h-3.5 w-3.5" />
          )}
          {p.enabled ? "Désactiver" : "Activer"}
        </button>
      </div>
    </article>
  );
}

function SyncStatus({
  platform: p,
  onSync,
  syncing,
  credentialsOk,
}: {
  platform: PlatformData;
  onSync: () => void;
  syncing: boolean;
  credentialsOk: boolean;
}) {
  const syncBtn = credentialsOk && p.enabled && (
    <button
      type="button"
      onClick={onSync}
      disabled={syncing}
      className="ml-auto inline-flex items-center gap-1 rounded-lg border border-[#1FBEAF]/30 bg-[#1FBEAF]/10 px-2.5 py-1 text-[10px] font-bold text-[#1FBEAF] hover:bg-[#1FBEAF]/20 disabled:opacity-50"
    >
      {syncing ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <RefreshCw className="h-3 w-3" />
      )}
      Sync
    </button>
  );

  if (!p.lastSyncAt && !p.lastSyncStatus) {
    return (
      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Clock className="h-3 w-3 shrink-0" />
        <span>Jamais synchronisé</span>
        {syncBtn}
      </div>
    );
  }

  const isOk = p.lastSyncStatus === "ok";
  const isErr = p.lastSyncStatus === "error";
  const colorClass = isOk
    ? "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-600 dark:text-emerald-300"
    : isErr
      ? "border-rose-500/20 bg-rose-500/[0.05] text-rose-600 dark:text-rose-300"
      : "border-amber-500/20 bg-amber-500/[0.05] text-amber-600 dark:text-amber-300";
  const StatusIcon = isOk ? CheckCircle2 : isErr ? XCircle : Activity;

  const timeAgo = p.lastSyncAt
    ? new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
        Math.round(
          (new Date(p.lastSyncAt).getTime() - Date.now()) / 60000,
        ),
        "minute",
      )
    : null;

  return (
    <div
      className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] ${colorClass}`}
    >
      <StatusIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="font-semibold">
        {isOk
          ? "Sync OK"
          : isErr
            ? "Erreur sync"
            : "En cours…"}
      </span>
      {timeAgo && (
        <span className="text-muted-foreground">· {timeAgo}</span>
      )}
      {p.lastSyncError && (
        <span className="ml-1 truncate opacity-80">{p.lastSyncError}</span>
      )}
      {syncBtn}
    </div>
  );
}

function SyncOverview({ platforms }: { platforms: PlatformData[] }) {
  const hasAny = platforms.some((p) => p.lastSyncAt || p.lastSyncStatus);
  if (!hasAny) return null;

  return (
    <div className="rounded-2xl border border-border bg-card/30 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-[#1FBEAF]" />
        <span className="font-display text-sm font-bold">
          Vue d&apos;ensemble des syncs
        </span>
        <span className="text-[11px] text-muted-foreground">
          · cron toutes les heures
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {platforms.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                p.lastSyncStatus === "ok"
                  ? "bg-emerald-500"
                  : p.lastSyncStatus === "error"
                    ? "bg-rose-500"
                    : p.lastSyncStatus === "pending"
                      ? "animate-pulse bg-amber-500"
                      : "bg-muted"
              }`}
            />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {PLATFORM_ABBR[p.id] ?? p.id}
            </span>
            <span className="text-[9px] text-muted-foreground">
              {p.enabled ? "ON" : "OFF"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecretField({
  platform,
  def,
  existing,
  onChange,
}: {
  platform: string;
  def: KeyDef;
  existing?: CredentialMeta;
  onChange: (keyName: string, last4: string | null) => void;
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
        const res = await fetch("/api/admin/platform-apis", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            platform,
            key_name: def.name,
            value,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
        toast.success(`${def.label} sauvegardée ✓`);
        onChange(def.name, value.slice(-4));
        setValue("");
        setEditing(false);
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  function remove() {
    if (
      !confirm(
        `Supprimer la clé ${def.label} ?\n\nCela peut désactiver la plateforme.`,
      )
    )
      return;
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/platform-apis?platform=${encodeURIComponent(platform)}&key_name=${encodeURIComponent(def.name)}`,
          { method: "DELETE" },
        );
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? "Échec");
        }
        toast.success("Clé supprimée");
        onChange(def.name, null);
        setEditing(true);
        setValue("");
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] font-bold text-foreground">
              {def.label}
            </label>
            {def.required ? (
              <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-300">
                Obligatoire
              </span>
            ) : (
              <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                Optionnelle
              </span>
            )}
          </div>
          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
            {def.name}
          </div>
          {def.hint && (
            <p className="mt-1 text-[10.5px] leading-snug text-muted-foreground">
              {def.hint}
            </p>
          )}
        </div>
        {existing && !editing && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-2.5 w-2.5" /> OK
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
              placeholder="Colle ta clé ici…"
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
              {show ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={pending || value.length < 8}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1FBEAF] to-[#17a79a] px-3 text-[11px] font-bold text-white shadow-sm shadow-[#1FBEAF]/30 disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Sauver
          </button>
          {existing && (
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setValue("");
              }}
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
