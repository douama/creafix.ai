import {
  isPlatformConfigured,
  upsertSocialAccount,
  validateState,
  redirectToDashboard,
  handleProviderError,
} from "@/lib/social/callback-helpers";

/**
 * OAuth callback Facebook (Graph API v21).
 *
 * Flow :
 *  1. Reçoit ?code & ?state
 *  2. Échange code → short-lived access_token
 *  3. Échange short-lived → long-lived (60 jours)
 *  4. Fetch /me?fields=id,name → external_id + display_name
 *  5. Upsert dans social_accounts (platform=FACEBOOK, handle=fb_<id>)
 *  6. Redirect /dashboard?connect_result=...
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  // 1. Provider error (user denied, etc.)
  const providerError = handleProviderError(params, "FACEBOOK");
  if (providerError) return providerError;

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) {
    return redirectToDashboard({ platform: "FACEBOOK", result: "error", error: "missing_params" });
  }

  // 2. State + user
  const stateCheck = validateState(state, "FACEBOOK");
  if (!stateCheck.ok) {
    return redirectToDashboard({ platform: "FACEBOOK", result: "error", error: stateCheck.error });
  }

  // 3. Env vars
  if (!isPlatformConfigured("FACEBOOK")) {
    return redirectToDashboard({ platform: "FACEBOOK", result: "error", error: "config_missing" });
  }

  const apiVersion = process.env.META_GRAPH_API_VERSION ?? "v21.0";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const redirectUri = `${baseUrl}/api/social/callback/facebook`;

  // 4. Code → short-lived token
  const tokenUrl = new URL(`https://graph.facebook.com/${apiVersion}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", process.env.META_APP_ID!);
  tokenUrl.searchParams.set("client_secret", process.env.META_APP_SECRET!);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);

  type FbTokenResp = { access_token?: string; expires_in?: number; error?: { message: string } };
  let shortToken: string;
  let expiresAt: Date | null = null;
  try {
    const r = await fetch(tokenUrl.toString(), { cache: "no-store" });
    const j = (await r.json()) as FbTokenResp;
    if (!r.ok || !j.access_token) {
      console.error("[fb callback] token exchange failed", j.error?.message);
      return redirectToDashboard({ platform: "FACEBOOK", result: "error", error: "token_exchange_failed" });
    }
    shortToken = j.access_token;
    if (j.expires_in) expiresAt = new Date(Date.now() + j.expires_in * 1000);
  } catch (e) {
    console.error("[fb callback] token fetch threw", e);
    return redirectToDashboard({ platform: "FACEBOOK", result: "error", error: "token_exchange_failed" });
  }

  // 5. Short → long-lived (60 jours) — meilleur DX
  let longToken = shortToken;
  try {
    const exchUrl = new URL(`https://graph.facebook.com/${apiVersion}/oauth/access_token`);
    exchUrl.searchParams.set("grant_type", "fb_exchange_token");
    exchUrl.searchParams.set("client_id", process.env.META_APP_ID!);
    exchUrl.searchParams.set("client_secret", process.env.META_APP_SECRET!);
    exchUrl.searchParams.set("fb_exchange_token", shortToken);
    const r = await fetch(exchUrl.toString(), { cache: "no-store" });
    const j = (await r.json()) as FbTokenResp;
    if (r.ok && j.access_token) {
      longToken = j.access_token;
      if (j.expires_in) expiresAt = new Date(Date.now() + j.expires_in * 1000);
    }
  } catch {
    // Pas grave : on garde le short-lived (1-2h)
  }

  // 6. Profil
  type FbMe = { id: string; name?: string; picture?: { data?: { url?: string } } };
  let me: FbMe;
  try {
    const r = await fetch(
      `https://graph.facebook.com/${apiVersion}/me?fields=id,name,picture.type(large)&access_token=${encodeURIComponent(longToken)}`,
      { cache: "no-store" },
    );
    me = (await r.json()) as FbMe;
    if (!me?.id) {
      console.error("[fb callback] /me missing id", me);
      return redirectToDashboard({ platform: "FACEBOOK", result: "error", error: "profile_fetch_failed" });
    }
  } catch (e) {
    console.error("[fb callback] /me fetch threw", e);
    return redirectToDashboard({ platform: "FACEBOOK", result: "error", error: "profile_fetch_failed" });
  }

  // 7. Upsert
  const ups = await upsertSocialAccount({
    userId: stateCheck.userId,
    platform: "FACEBOOK",
    externalId: me.id,
    handle: me.name ?? `fb_${me.id}`,
    displayName: me.name ?? null,
    avatarUrl: me.picture?.data?.url ?? null,
    accessToken: longToken,
    refreshToken: null,
    scope: "pages_show_list,pages_read_engagement,read_insights,pages_read_user_content",
    tokenExpiresAt: expiresAt,
  });
  if (!ups.ok) {
    console.error("[fb callback] db upsert failed", ups.detail);
    return redirectToDashboard({ platform: "FACEBOOK", result: "error", error: "db_insert_failed" });
  }

  return redirectToDashboard({
    platform: "FACEBOOK",
    result: "success",
    handle: me.name ?? `fb_${me.id}`,
  });
}
