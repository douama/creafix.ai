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

type ProviderId = "STRIPE" | "PAYPAL" | "CINETPAY" | "FLUTTERWAVE";

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
 * Helper : un provider est-il actif ?
 * Pour chaque provider, on check ses clés requises.
 */
const REQUIRED_KEYS: Record<ProviderId, string[]> = {
  STRIPE:      ["STRIPE_SECRET_KEY"],
  PAYPAL:      ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET"],
  CINETPAY:    ["CINETPAY_API_KEY", "CINETPAY_SITE_ID"],
  FLUTTERWAVE: ["FLUTTERWAVE_SECRET_KEY"],
};

export async function isProviderEnabled(provider: ProviderId): Promise<boolean> {
  const keys = REQUIRED_KEYS[provider];
  for (const k of keys) {
    const v = await getSecret(provider, k);
    if (!v) return false;
  }
  return true;
}

export function getRequiredKeys(provider: ProviderId): string[] {
  return REQUIRED_KEYS[provider];
}
