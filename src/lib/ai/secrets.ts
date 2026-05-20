/**
 * Récupère les clés API IA (Anthropic, OpenAI, Google) depuis Supabase Vault
 * (chiffré) avec fallback sur process.env. Même pattern que
 * `src/lib/payments/secrets.ts`.
 *
 *   • Vault : chiffrement AES-256-GCM (master key Supabase)
 *   • RPC `monetiq.get_ai_secret` : SECURITY DEFINER + service_role only
 *   • Cache mémoire 60 s pour limiter les hits DB
 *
 * Usage server-only :
 *   const key = await getAiSecret("ANTHROPIC");
 */

import { supabaseAdmin } from "@/lib/supabase/admin";

export type AiProvider = "ANTHROPIC" | "OPENAI" | "GOOGLE";

const ENV_FALLBACK: Record<AiProvider, string> = {
  ANTHROPIC: "ANTHROPIC_API_KEY",
  OPENAI: "OPENAI_API_KEY",
  GOOGLE: "GOOGLE_AI_API_KEY",
};

const CACHE = new Map<AiProvider, { value: string | null; expiresAt: number }>();
const TTL_MS = 60 * 1000;

export async function getAiSecret(provider: AiProvider): Promise<string | null> {
  const cached = CACHE.get(provider);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  let value: string | null = null;

  // 1. Vault DB (prioritaire)
  try {
    const sb = supabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (sb.rpc as any)("get_ai_secret", {
      p_provider: provider,
    });
    if (!error && data && typeof data === "string" && data.length > 0) {
      value = data;
    }
  } catch (e) {
    console.error(`[ai/secrets] DB lookup failed for ${provider}:`, (e as Error).message);
  }

  // 2. Fallback env vars
  if (!value) {
    const envValue = process.env[ENV_FALLBACK[provider]];
    if (envValue && envValue.length > 0) value = envValue;
  }

  CACHE.set(provider, { value, expiresAt: Date.now() + TTL_MS });
  return value;
}

/** Invalide le cache (appelé après set/delete depuis l'admin). */
export function invalidateAiSecretCache(provider?: AiProvider) {
  if (!provider) {
    CACHE.clear();
    return;
  }
  CACHE.delete(provider);
}
