"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Save,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export type ModelRow = {
  id: string;
  provider: string;
  api_key_mask: string | null;
  api_key_set: boolean;
  enabled: boolean;
  default_model: string | null;
  monthly_cost_usd: number | null;
  monthly_tokens: number | null;
  rate_limit_rpm: number | null;
  notes: string | null;
  updated_at: string;
};

const PROVIDER_INFO: Record<string, {
  label: string;
  color: string;
  category: "text" | "image" | "voice" | "video";
  models: string[];
  signupUrl: string;
  description: string;
}> = {
  OPENAI: {
    label: "OpenAI", color: "#10A37F", category: "text",
    models: ["gpt-4.1", "gpt-4.1-mini", "gpt-4o", "o1-pro", "dall-e-3"],
    signupUrl: "https://platform.openai.com/api-keys",
    description: "GPT-4.1 + DALL-E 3 · texte, vision, images",
  },
  ANTHROPIC: {
    label: "Anthropic Claude", color: "#D4A373", category: "text",
    models: ["claude-opus-4-7", "claude-sonnet-4-6", "claude-haiku-4-5"],
    signupUrl: "https://console.anthropic.com/settings/keys",
    description: "Claude 4 · raisonnement, code, longs contextes 1M tokens",
  },
  GOOGLE: {
    label: "Google Gemini", color: "#4285F4", category: "text",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-pro-vision"],
    signupUrl: "https://aistudio.google.com/apikey",
    description: "Gemini 2.5 Pro · multimodal vision/audio/vidéo natif",
  },
  STABILITY: {
    label: "Stability AI", color: "#7C3AED", category: "image",
    models: ["stable-diffusion-3.5", "stable-image-ultra"],
    signupUrl: "https://platform.stability.ai/account/keys",
    description: "Stable Diffusion 3.5 · génération images haute qualité",
  },
  RUNWAY: {
    label: "Runway", color: "#000000", category: "video",
    models: ["gen-3-alpha", "gen-3-turbo"],
    signupUrl: "https://runwayml.com/account",
    description: "Gen-3 · génération vidéo IA cinéma-grade",
  },
  ELEVENLABS: {
    label: "ElevenLabs", color: "#00D4FF", category: "voice",
    models: ["eleven-v3", "eleven-turbo-v3"],
    signupUrl: "https://elevenlabs.io/app/settings/api-keys",
    description: "Voix IA multilingue, clonage vocal",
  },
  PIKA: {
    label: "Pika Labs", color: "#FF6B9D", category: "video",
    models: ["pika-2.0", "pika-1.5"],
    signupUrl: "https://pika.art/account/api",
    description: "Génération vidéo IA short-form (TikTok/Reels)",
  },
};

const CATEGORY_LABELS = {
  text: "Texte & Raisonnement",
  image: "Génération d'images",
  voice: "Voix & Audio",
  video: "Vidéo IA",
};

export function ModelsClient({ initialModels }: { initialModels: ModelRow[] }) {
  const [models, setModels] = useState(initialModels);

  const grouped = (Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: models.filter((m) => PROVIDER_INFO[m.provider]?.category === cat),
  }));

  const enabled = models.filter((m) => m.enabled).length;
  const configured = models.filter((m) => m.api_key_set).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          AI Models Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestion des clés API et configuration des modèles IA · {configured}/{models.length} configurés · {enabled} actifs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Providers" value={models.length.toString()} color="#7B61FF" />
        <Stat label="Configurés" value={`${configured}/${models.length}`} color="#10B981" />
        <Stat label="Actifs" value={enabled.toString()} color="#FF8A00" />
        <Stat label="Coût ce mois" value={`$${models.reduce((s, m) => s + Number(m.monthly_cost_usd ?? 0), 0).toFixed(2)}`} color="#FF8A00" />
      </div>

      {/* Security banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">Sécurité :</b> les clés API sont chiffrées au repos (Supabase Vault recommandé en prod).
            Le masque affiché est uniquement les 4 derniers caractères. La clé complète n&apos;est jamais re-renvoyée au browser.
          </p>
        </div>
      </div>

      {/* Grouped by category */}
      {grouped.map((group) => (
        <div key={group.category} className="space-y-3">
          <h2 className="font-display text-base font-bold">
            {group.label}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {group.items.length} provider{group.items.length > 1 ? "s" : ""}
            </span>
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {group.items.map((m) => (
              <ProviderCard
                key={m.id}
                model={m}
                onUpdate={(updated) =>
                  setModels((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProviderCard({
  model,
  onUpdate,
}: {
  model: ModelRow;
  onUpdate: (m: ModelRow) => void;
}) {
  const info = PROVIDER_INFO[model.provider];
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [defaultModel, setDefaultModel] = useState(model.default_model ?? info?.models[0] ?? "");
  const [enabled, setEnabled] = useState(model.enabled);
  const [saving, setSaving] = useState(false);

  if (!info) return null;

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/models/${model.id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey || undefined, // n'envoie pas si vide (garde l'existant)
          enabled,
          default_model: defaultModel,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");

      onUpdate(json.model);
      setApiKey("");
      toast.success(`${info.label} mis à jour`);
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-15 blur-2xl"
        style={{ backgroundColor: info.color }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)` }}
          >
            {info.label[0]}
          </div>
          <div>
            <h3 className="font-display text-sm font-bold">{info.label}</h3>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{info.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {model.api_key_set ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Set
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
              <XCircle className="h-2.5 w-2.5" />
              Vide
            </span>
          )}
        </div>
      </div>

      {/* API Key input */}
      <div className="relative mt-4 space-y-2">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Clé API
        </label>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              model.api_key_set
                ? `Actuelle : ${model.api_key_mask ?? "••••"} (laisse vide pour garder)`
                : "Coller la clé API…"
            }
            className="h-9 w-full rounded-lg border border-border bg-background/40 pl-9 pr-9 font-mono text-xs outline-none placeholder:text-muted-foreground/60 focus:border-foreground/30"
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showKey ? "Cacher" : "Afficher"}
          >
            {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
        <a
          href={info.signupUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-[#7B61FF] hover:underline"
        >
          Obtenir une clé {info.label}
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      {/* Default model */}
      <div className="relative mt-4">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Modèle par défaut
        </label>
        <select
          value={defaultModel}
          onChange={(e) => setDefaultModel(e.target.value)}
          className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background/40 px-3 text-xs outline-none focus:border-foreground/30"
        >
          {info.models.map((mod) => (
            <option key={mod} value={mod}>
              {mod}
            </option>
          ))}
        </select>
      </div>

      {/* Stats + enable toggle */}
      <div className="relative mt-4 grid grid-cols-3 gap-2 text-[10px]">
        <div className="rounded-lg border border-border bg-background/40 p-2 text-center">
          <div className="font-display text-xs font-bold">${Number(model.monthly_cost_usd ?? 0).toFixed(2)}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">$ ce mois</div>
        </div>
        <div className="rounded-lg border border-border bg-background/40 p-2 text-center">
          <div className="font-display text-xs font-bold">{fmt(Number(model.monthly_tokens ?? 0))}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">tokens</div>
        </div>
        <div className="rounded-lg border border-border bg-background/40 p-2 text-center">
          <div className="font-display text-xs font-bold">{model.rate_limit_rpm ?? 0}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">RPM</div>
        </div>
      </div>

      {/* Toggle + save */}
      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer rounded border-border bg-background/40 accent-[#7B61FF]"
          />
          <span className="font-semibold">Activer ce provider</span>
        </label>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#FF8A00] px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
      >
        <Sparkles className="h-4 w-4" style={{ color }} />
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

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
