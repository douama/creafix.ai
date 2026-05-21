import {
  isPlatformConfigured,
  upsertSocialAccount,
  validateState,
  redirectToDashboard,
  handleProviderError,
} from "@/lib/social/callback-helpers";

/**
 * OAuth callback TikTok (v2 API).
 *
 * Flow :
 *  1. Code → access_token via POST https://open.tiktokapis.com/v2/oauth/token/
 *  2. GET /v2/user/info/ avec fields=open_id,union_id,avatar_url,display_name,username
 *  3. Upsert (platform=TIKTOK, handle=username)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const providerError = handleProviderError(params, "TIKTOK");
  if (providerError) return providerError;

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) {
    return redirectToDashboard({ platform: "TIKTOK", result: "error", error: "missing_params" });
  }

  const stateCheck = validateState(state, "TIKTOK");
  if (!stateCheck.ok) {
    return redirectToDashboard({ platform: "TIKTOK", result: "error", error: stateCheck.error });
  }

  if (!isPlatformConfigured("TIKTOK")) {
    return redirectToDashboard({ platform: "TIKTOK", result: "error", error: "config_missing" });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const redirectUri = `${baseUrl}/api/social/callback/tiktok`;

  // 1. Token exchange
  type TokenResp = {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    refresh_expires_in?: number;
    scope?: string;
    open_id?: string;
    error?: string;
    error_description?: string;
  };
  let tokens: TokenResp;
  try {
    const body = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });
    const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: body.toString(),
      cache: "no-store",
    });
    tokens = (await r.json()) as TokenResp;
    if (!r.ok || !tokens.access_token) {
      console.error("[tiktok callback] token exchange failed", tokens.error_description);
      return redirectToDashboard({ platform: "TIKTOK", result: "error", error: "token_exchange_failed" });
    }
  } catch (e) {
    console.error("[tiktok callback] token fetch threw", e);
    return redirectToDashboard({ platform: "TIKTOK", result: "error", error: "token_exchange_failed" });
  }

  const expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

  // 2. User info
  type UserInfo = {
    data?: {
      user?: {
        open_id?: string;
        union_id?: string;
        avatar_url?: string;
        display_name?: string;
        username?: string;
      };
    };
  };
  let user: NonNullable<NonNullable<UserInfo["data"]>["user"]>;
  try {
    const r = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        cache: "no-store",
      },
    );
    const j = (await r.json()) as UserInfo;
    if (!j.data?.user?.open_id) {
      console.error("[tiktok callback] user info missing open_id", j);
      return redirectToDashboard({ platform: "TIKTOK", result: "error", error: "profile_fetch_failed" });
    }
    user = j.data.user;
  } catch (e) {
    console.error("[tiktok callback] user info fetch threw", e);
    return redirectToDashboard({ platform: "TIKTOK", result: "error", error: "profile_fetch_failed" });
  }

  // 3. Upsert
  const ups = await upsertSocialAccount({
    userId: stateCheck.userId,
    platform: "TIKTOK",
    externalId: user.open_id!,
    handle: user.username ?? `tt_${user.open_id}`,
    displayName: user.display_name ?? null,
    avatarUrl: user.avatar_url ?? null,
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token ?? null,
    scope: tokens.scope ?? "user.info.basic,video.list",
    tokenExpiresAt: expiresAt,
  });
  if (!ups.ok) {
    return redirectToDashboard({ platform: "TIKTOK", result: "error", error: "db_insert_failed" });
  }

  return redirectToDashboard({
    platform: "TIKTOK",
    result: "success",
    handle: user.username ?? `tt_${user.open_id}`,
  });
}
