import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyState } from "./oauth-state";

/**
 * Helpers partagés par les 5 routes /api/social/callback/{platform}/route.ts.
 *
 * Chaque callback suit le même pattern :
 *   1. Lire `?code=...&state=...` de l'URL
 *   2. Vérifier le state (HMAC + match avec cookie posé par /connect)
 *   3. Échanger code → access_token chez le provider
 *   4. Récupérer le profil (external_id, handle, display_name, avatar_url)
 *   5. Upsert dans monetiq.social_accounts via admin client (RLS bypass)
 *   6. Rediriger vers /dashboard?connect_result=...
 */

export type PlatformKey = "FACEBOOK" | "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "X";

export type CallbackError =
  | "missing_params"
  | "missing_state_cookie"
  | "state_mismatch"
  | "token_exchange_failed"
  | "profile_fetch_failed"
  | "db_insert_failed"
  | "user_denied"
  | "config_missing";

/**
 * Récupère l'user_id à partir du state cookie + valide le state retourné.
 * Le user_id est encodé dans le state (cf. signState).
 */
export function readStateCookie(platform: PlatformKey): string | null {
  return cookies().get(`oauth_state_${platform.toLowerCase()}`)?.value ?? null;
}

export function readPkceCookie(platform: PlatformKey): string | null {
  return cookies().get(`oauth_pkce_${platform.toLowerCase()}`)?.value ?? null;
}

/** Extrait l'user_id du state signé (format: `<nonce>.<userId>.<hmac>`). */
export function extractUserIdFromState(state: string): string | null {
  const parts = state.split(".");
  if (parts.length !== 3) return null;
  return parts[1] || null;
}

/**
 * Valide state retourné par le provider :
 *  - Doit matcher EXACTEMENT celui stocké dans le cookie (anti-CSRF)
 *  - Doit avoir une signature HMAC valide pour l'user_id qu'il déclare
 */
export function validateState(
  returnedState: string,
  platform: PlatformKey,
): { ok: true; userId: string } | { ok: false; error: CallbackError } {
  const cookieState = readStateCookie(platform);
  if (!cookieState) return { ok: false, error: "missing_state_cookie" };
  if (cookieState !== returnedState) return { ok: false, error: "state_mismatch" };

  const userId = extractUserIdFromState(returnedState);
  if (!userId) return { ok: false, error: "state_mismatch" };

  if (!verifyState(returnedState, userId)) return { ok: false, error: "state_mismatch" };

  return { ok: true, userId };
}

/**
 * Upsert d'un compte social. Stratégie : SELECT par (user_id, platform,
 * external_id) → UPDATE si existe, INSERT sinon. Pas de dépendance à une
 * contrainte unique en DB (qui pourrait ne pas exister).
 */
export async function upsertSocialAccount(input: {
  userId: string;
  platform: PlatformKey;
  externalId: string;
  handle: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  followers?: number;
  accessToken?: string | null;
  refreshToken?: string | null;
  scope?: string | null;
  tokenExpiresAt?: Date | null;
}): Promise<{ ok: true } | { ok: false; error: CallbackError; detail?: string }> {
  const sb = supabaseAdmin();
  const now = new Date().toISOString();

  // 1. Look up existing row
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing, error: selErr } = await (sb.from("social_accounts") as any)
    .select("id")
    .eq("user_id", input.userId)
    .eq("platform", input.platform)
    .eq("external_id", input.externalId)
    .maybeSingle();

  if (selErr) return { ok: false, error: "db_insert_failed", detail: selErr.message };

  const payload: Record<string, unknown> = {
    user_id: input.userId,
    platform: input.platform,
    external_id: input.externalId,
    handle: input.handle,
    display_name: input.displayName ?? null,
    avatar_url: input.avatarUrl ?? null,
    followers: input.followers ?? 0,
    is_connected: true,
    access_token: input.accessToken ?? null,
    refresh_token: input.refreshToken ?? null,
    scope: input.scope ?? null,
    token_expires: input.tokenExpiresAt?.toISOString() ?? null,
    updated_at: now,
  };

  if (existing?.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updErr } = await (sb.from("social_accounts") as any)
      .update(payload)
      .eq("id", existing.id);
    if (updErr) return { ok: false, error: "db_insert_failed", detail: updErr.message };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insErr } = await (sb.from("social_accounts") as any)
      .insert({ ...payload, created_at: now });
    if (insErr) return { ok: false, error: "db_insert_failed", detail: insErr.message };
  }

  return { ok: true };
}

/**
 * Construit la redirect URL finale vers /dashboard avec le résultat.
 *
 * Format : /dashboard?connect_result=success:FACEBOOK:@handle
 * ou      /dashboard?connect_result=error:FACEBOOK:state_mismatch
 *
 * Le composant SocialAuthToast lit ce param et affiche un toast.
 */
export function redirectToDashboard(opts: {
  platform: PlatformKey;
  result: "success" | "error";
  handle?: string;
  error?: CallbackError;
}): NextResponse {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const value =
    opts.result === "success"
      ? `success:${opts.platform}:${opts.handle ?? "compte"}`
      : `error:${opts.platform}:${opts.error ?? "unknown"}`;
  const url = `${baseUrl}/dashboard?connect_result=${encodeURIComponent(value)}`;

  const res = NextResponse.redirect(url);
  // Cleanup des cookies courts posés par /connect
  res.cookies.set(`oauth_state_${opts.platform.toLowerCase()}`, "", { path: "/api/social", maxAge: 0 });
  res.cookies.set(`oauth_pkce_${opts.platform.toLowerCase()}`, "", { path: "/api/social", maxAge: 0 });
  return res;
}

/**
 * Wrapper qui standardise le traitement d'une erreur OAuth.
 * Le provider peut renvoyer ?error=access_denied&error_description=...
 */
export function handleProviderError(
  params: URLSearchParams,
  platform: PlatformKey,
): NextResponse | null {
  const error = params.get("error");
  if (!error) return null;
  return redirectToDashboard({
    platform,
    result: "error",
    error: error === "access_denied" ? "user_denied" : "token_exchange_failed",
  });
}

/**
 * Vérifie que les env vars requises pour une plateforme sont set.
 * Utilisé à la fois par /connect (avant de construire l'URL OAuth) et
 * par les callbacks (avant d'échanger le code).
 */
export function isPlatformConfigured(platform: PlatformKey): boolean {
  switch (platform) {
    case "FACEBOOK":
    case "INSTAGRAM":
      return !!(process.env.META_APP_ID && process.env.META_APP_SECRET);
    case "TIKTOK":
      return !!(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET);
    case "YOUTUBE":
      return !!(process.env.YOUTUBE_OAUTH_CLIENT_ID && process.env.YOUTUBE_OAUTH_CLIENT_SECRET);
    case "X":
      return !!(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET);
  }
}
