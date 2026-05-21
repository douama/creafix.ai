import {
  isPlatformConfigured,
  upsertSocialAccount,
  validateState,
  redirectToDashboard,
  handleProviderError,
  readPkceCookie,
} from "@/lib/social/callback-helpers";

/**
 * OAuth callback X (Twitter v2 + PKCE).
 *
 * Flow :
 *  1. Lit le code_verifier depuis le cookie oauth_pkce_x (posé par /connect)
 *  2. Code + verifier → access_token via POST https://api.twitter.com/2/oauth2/token
 *     (Basic auth: client_id:client_secret en base64)
 *  3. GET /2/users/me?user.fields=username,name,profile_image_url,public_metrics
 *  4. Upsert (platform=X, handle=username)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const providerError = handleProviderError(params, "X");
  if (providerError) return providerError;

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) {
    return redirectToDashboard({ platform: "X", result: "error", error: "missing_params" });
  }

  const stateCheck = validateState(state, "X");
  if (!stateCheck.ok) {
    return redirectToDashboard({ platform: "X", result: "error", error: stateCheck.error });
  }

  if (!isPlatformConfigured("X")) {
    return redirectToDashboard({ platform: "X", result: "error", error: "config_missing" });
  }

  const verifier = readPkceCookie("X");
  if (!verifier) {
    console.error("[x callback] PKCE verifier cookie missing");
    return redirectToDashboard({ platform: "X", result: "error", error: "missing_state_cookie" });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const redirectUri = `${baseUrl}/api/social/callback/x`;

  // 1. Token exchange
  type TokenResp = {
    token_type?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    error?: string;
    error_description?: string;
  };
  let tokens: TokenResp;
  try {
    const basic = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`,
    ).toString("base64");
    const body = new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: process.env.TWITTER_CLIENT_ID!,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    });
    const r = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: body.toString(),
      cache: "no-store",
    });
    tokens = (await r.json()) as TokenResp;
    if (!r.ok || !tokens.access_token) {
      console.error("[x callback] token exchange failed", tokens.error_description);
      return redirectToDashboard({ platform: "X", result: "error", error: "token_exchange_failed" });
    }
  } catch (e) {
    console.error("[x callback] token fetch threw", e);
    return redirectToDashboard({ platform: "X", result: "error", error: "token_exchange_failed" });
  }

  const expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

  // 2. User info
  type UserResp = {
    data?: {
      id: string;
      username?: string;
      name?: string;
      profile_image_url?: string;
      public_metrics?: { followers_count?: number };
    };
  };
  let user: NonNullable<UserResp["data"]>;
  try {
    const r = await fetch(
      "https://api.twitter.com/2/users/me?user.fields=username,name,profile_image_url,public_metrics",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        cache: "no-store",
      },
    );
    const j = (await r.json()) as UserResp;
    if (!j.data?.id) {
      console.error("[x callback] /users/me missing id", j);
      return redirectToDashboard({ platform: "X", result: "error", error: "profile_fetch_failed" });
    }
    user = j.data;
  } catch (e) {
    console.error("[x callback] user fetch threw", e);
    return redirectToDashboard({ platform: "X", result: "error", error: "profile_fetch_failed" });
  }

  // 3. Upsert
  const ups = await upsertSocialAccount({
    userId: stateCheck.userId,
    platform: "X",
    externalId: user.id,
    handle: user.username ?? `x_${user.id}`,
    displayName: user.name ?? null,
    avatarUrl: user.profile_image_url ?? null,
    followers: user.public_metrics?.followers_count ?? 0,
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token ?? null,
    scope: tokens.scope ?? "tweet.read users.read offline.access",
    tokenExpiresAt: expiresAt,
  });
  if (!ups.ok) {
    return redirectToDashboard({ platform: "X", result: "error", error: "db_insert_failed" });
  }

  return redirectToDashboard({
    platform: "X",
    result: "success",
    handle: user.username ?? `x_${user.id}`,
  });
}
