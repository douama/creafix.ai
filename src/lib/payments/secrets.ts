/**
 * Récupère les clés API des providers depuis Supabase Vault (chiffré)
 * en priorité, avec fallback sur process.env si non configuré en DB.
 *
 * - Vault : chiffrement AES-256-GCM avec master key Supabase
 * - RPC `monetiq.get_provider_secret` : SECURITY DEFINER + service_role only
 * - Cache mémoire 60s pour éviter de hit la DB à chaque checkout
 *
 * Usage server-only :
 *   const stripeKey = await getSecret("STRIPE", "STRIPE_SECRET_KEY");
 *   if (!stripeKey) return { error: "Stripe non configuré" };
 */

import { supabaseAdmin } from "@/lib/supabase/admin";

type ProviderId = "STRIPE" | "PAYPAL" | "CINETPAY" | "FLUTTERWAVE" | "PAYDUNYA";

const CACHE = new Map<string, { value: string | null; expiresAt: number }>();
const TTL_MS = 60 * 1000;

export async function getSecret(provider: ProviderId, keyName: string): Promise<string | null> {
  const cacheKey = `${provider}:${keyName}`;
  const cached = CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  let value: string | null = null;

  // 1. Essaie Vault DB (priorité)
  try {
    const sb = supabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (sb.rpc as any)("get_provider_secret", {
      p_provider: provider,
      p_key_name: keyName,
    });
    if (!error && data && typeof data === "string" && data.length > 0) {
      value = data;
    }
  } catch (e) {
    console.error(`[secrets] DB lookup failed for ${cacheKey}:`, (e as Error).message);
  }

  // 2. Fallback env vars (legacy / si jamais le Vault est down)
  if (!value) {
    const envValue = process.env[keyName];
    if (envValue && envValue.length > 0) value = envValue;
  }

  CACHE.set(cacheKey, { value, expiresAt: Date.now() + TTL_MS });
  return value;
}

/** Invalide le cache (utilisé par les routes admin après set/delete) */
export function invalidateSecretCache(provider?: ProviderId, keyName?: string) {
  if (!provider) {
    CACHE.clear();
    return;
  }
  if (keyName) {
    CACHE.delete(`${provider}:${keyName}`);
    return;
  }
  for (const k of CACHE.keys()) {
    if (k.startsWith(`${provider}:`)) CACHE.delete(k);
  }
}

/**
 * Définition complète des clés par provider, basée sur les docs officielles
 * (Stripe Checkout, PayPal Orders v2, CinetPay v2, Flutterwave Standard v3).
 */
export type KeyDef = {
  name: string;          // ex: STRIPE_SECRET_KEY
  label: string;         // libellé humain
  required: boolean;     // bloque l'activation du provider si manquante
  format?: string;       // ex: sk_live_..., FLWSECK-...
  hint?: string;         // où la trouver
};

const KEYS: Record<ProviderId, KeyDef[]> = {
  STRIPE: [
    { name: "STRIPE_SECRET_KEY",      label: "Secret Key",      required: true,  format: "sk_live_…",  hint: "Dashboard Stripe → Developers → API keys" },
    { name: "STRIPE_PUBLISHABLE_KEY", label: "Publishable Key", required: true,  format: "pk_live_…",  hint: "Même endroit dans Stripe Dashboard" },
    { name: "STRIPE_WEBHOOK_SECRET",  label: "Webhook Secret",  required: false, format: "whsec_…",    hint: "Dashboard → Developers → Webhooks → Endpoint → Signing secret. Requis pour vérifier les paiements." },
  ],
  PAYPAL: [
    { name: "PAYPAL_CLIENT_ID",       label: "Client ID",       required: true,  format: "AeA1QIZ… (~80 chars)", hint: "developer.paypal.com → Dashboard → app → API credentials" },
    { name: "PAYPAL_CLIENT_SECRET",   label: "Client Secret",   required: true,  format: "EGnHDxD… (~80 chars)", hint: "Même endroit (live ou sandbox séparés)" },
    { name: "PAYPAL_WEBHOOK_ID",      label: "Webhook ID",      required: false, format: "8PT597… (13 chars)",   hint: "Dashboard → app → Webhooks → ID du webhook. Requis pour vérifier les paiements." },
  ],
  CINETPAY: [
    { name: "CINETPAY_API_KEY",       label: "API Key",         required: true,  format: "~64 chars alphanumériques", hint: "app.cinetpay.com → Intégrations → Vos clés API" },
    { name: "CINETPAY_SITE_ID",       label: "Site ID",         required: true,  format: "numérique (ex: 5874302)",   hint: "Intégrations → Services" },
    { name: "CINETPAY_SECRET_KEY",    label: "Secret Key (HMAC)", required: false, format: "~32 chars",                hint: "Section 'Clé secrète'. Requis pour sécuriser les webhooks (validation x-token HMAC-SHA256)." },
  ],
  FLUTTERWAVE: [
    { name: "FLUTTERWAVE_SECRET_KEY",     label: "Secret Key",     required: true,  format: "FLWSECK-…-X / FLWSECK_TEST-…",  hint: "dashboard.flutterwave.com → Settings → APIs" },
    { name: "FLUTTERWAVE_PUBLIC_KEY",     label: "Public Key",     required: false, format: "FLWPUBK-…-X / FLWPUBK_TEST-…",  hint: "Même endroit. Recommandée pour la consistance front." },
    { name: "FLUTTERWAVE_WEBHOOK_HASH",   label: "Webhook Secret Hash", required: false, format: "Chaîne arbitraire (ex: mySuperSecret_2026)", hint: "Settings → Webhooks → Secret hash. Requis pour vérifier les paiements." },
    { name: "FLUTTERWAVE_ENCRYPTION_KEY", label: "Encryption Key (3DES)", required: false, format: "~24 chars",              hint: "Optionnelle, requise UNIQUEMENT pour les charges directes par carte (pas pour Standard redirect)." },
  ],
  PAYDUNYA: [
    // ── Clé Principale (partagée entre live et test) ──
    { name: "PAYDUNYA_MASTER_KEY",       label: "Clé Principale (Master Key)", required: true,  format: "alphanumérique ~32 chars", hint: "paydunya.com → Intégrations → API & Plugins → Clé Principale (en haut). Identique pour Live et Test." },

    // ── Clés API de Production (utilisées si MODE='live') ──
    { name: "PAYDUNYA_PUBLIC_KEY",       label: "Clé Publique · Production",   required: true,  format: "live_public_…",  hint: "Section 'Clés API de Production' → Clé Publique." },
    { name: "PAYDUNYA_PRIVATE_KEY",      label: "Clé Privée · Production",     required: true,  format: "live_private_…", hint: "Section 'Clés API de Production' → Clé Privée." },
    { name: "PAYDUNYA_TOKEN",            label: "Token · Production",          required: true,  format: "alphanumérique ~24 chars", hint: "Section 'Clés API de Production' → Token." },

    // ── Clés API de Test (utilisées si MODE='test'). Optionnelles si tu ne testes pas en sandbox. ──
    { name: "PAYDUNYA_PUBLIC_KEY_TEST",  label: "Clé Publique · Test",         required: false, format: "test_public_…",  hint: "Section 'Clés API de Test' → Clé Publique. Requise seulement si MODE='test'." },
    { name: "PAYDUNYA_PRIVATE_KEY_TEST", label: "Clé Privée · Test",           required: false, format: "test_private_…", hint: "Section 'Clés API de Test' → Clé Privée. Requise seulement si MODE='test'." },
    { name: "PAYDUNYA_TOKEN_TEST",       label: "Token · Test",                required: false, format: "alphanumérique ~24 chars", hint: "Section 'Clés API de Test' → Token. Requis seulement si MODE='test'." },

    // ── Toggle d'environnement ──
    { name: "PAYDUNYA_MODE",             label: "Mode actif (live | test)",    required: false, format: "live | test", hint: "Choisis quel jeu de clés utiliser. Par défaut 'live' si vide." },
  ],
};

/** Clés minimum pour activer un provider. */
function getRequiredKeyNames(provider: ProviderId): string[] {
  return KEYS[provider].filter((k) => k.required).map((k) => k.name);
}

export async function isProviderEnabled(provider: ProviderId): Promise<boolean> {
  const keys = getRequiredKeyNames(provider);
  for (const k of keys) {
    const v = await getSecret(provider, k);
    if (!v) return false;
  }
  return true;
}

/** Retourne juste les noms des clés requises (back-compat). */
export function getRequiredKeys(provider: ProviderId): string[] {
  return getRequiredKeyNames(provider);
}

/** Liste complète des clés (required + optional) pour l'UI. */
export function getKeyDefinitions(provider: ProviderId): KeyDef[] {
  return KEYS[provider];
}

/** Toutes les clés autorisées pour un provider (whitelist API). */
export function getAllKeyNames(provider: ProviderId): string[] {
  return KEYS[provider].map((k) => k.name);
}
