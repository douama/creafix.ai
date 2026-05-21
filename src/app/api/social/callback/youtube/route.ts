import {
  isPlatformConfigured,
  upsertSocialAccount,
  validateState,
  redirectToDashboard,
  handleProviderError,
} from "@/lib/social/callback-helpers";

/**
 * OAuth callback YouTube (Google OAuth2 + Data API v3).
 *
 * Flow :
 *  1. Code → access_token via POST https://oauth2.googleapis.com/token
 *  2. GET /youtube/v3/channels?part=snippet,statistics&mine=true
 *  3. Upsert (platform=YOUTUBE, handle=channel_title ou customUrl)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const providerError = handleProviderError(params, "YOUTUBE");
  if (providerError) return providerError;

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) {
    return redirectToDashboard({ platform: "YOUTUBE", result: "error", error: "missing_params" });
  }

  const stateCheck = validateState(state, "YOUTUBE");
  if (!stateCheck.ok) {
    return redirectToDashboard({ platform: "YOUTUBE", result: "error", error: stateCheck.error });
  }

  if (!isPlatformConfigured("YOUTUBE")) {
    return redirectToDashboard({ platform: "YOUTUBE", result: "error", error: "config_missing" });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const redirectUri = `${baseUrl}/api/social/callback/youtube`;

  // 1. Token exchange
  type TokenResp = {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
    error?: string;
    error_description?: string;
  };
  let tokens: TokenResp;
  try {
    const body = new URLSearchParams({
      code,
      client_id: process.env.YOUTUBE_OAUTH_CLIENT_ID!,
      client_secret: process.env.YOUTUBE_OAUTH_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      cache: "no-store",
    });
    tokens = (await r.json()) as TokenResp;
    if (!r.ok || !tokens.access_token) {
      console.error("[youtube callback] token exchange failed", tokens.error_description);
      return redirectToDashboard({ platform: "YOUTUBE", result: "error", error: "token_exchange_failed" });
    }
  } catch (e) {
    console.error("[youtube callback] token fetch threw", e);
    return redirectToDashboard({ platform: "YOUTUBE", result: "error", error: "token_exchange_failed" });
  }

  const expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

  // 2. Channel info
  type Channel = {
    id: string;
    snippet?: { title?: string; customUrl?: string; thumbnails?: { default?: { url?: string }; medium?: { url?: string } } };
    statistics?: { subscriberCount?: string };
  };
  type ChannelsResp = { items?: Channel[] };
  let channel: Channel | undefined;
  try {
    const r = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        cache: "no-store",
      },
    );
    const j = (await r.json()) as ChannelsResp;
    channel = j.items?.[0];
    if (!channel?.id) {
      console.error("[youtube callback] no channel returned", j);
      return redirectToDashboard({ platform: "YOUTUBE", result: "error", error: "profile_fetch_failed" });
    }
  } catch (e) {
    console.error("[youtube callback] channels fetch threw", e);
    return redirectToDashboard({ platform: "YOUTUBE", result: "error", error: "profile_fetch_failed" });
  }

  const handle =
    channel.snippet?.customUrl?.replace(/^@/, "") ??
    channel.snippet?.title ??
    `yt_${channel.id}`;
  const followers = channel.statistics?.subscriberCount
    ? parseInt(channel.statistics.subscriberCount, 10)
    : 0;

  // 3. Upsert
  const ups = await upsertSocialAccount({
    userId: stateCheck.userId,
    platform: "YOUTUBE",
    externalId: channel.id,
    handle,
    displayName: channel.snippet?.title ?? null,
    avatarUrl: channel.snippet?.thumbnails?.medium?.url ?? channel.snippet?.thumbnails?.default?.url ?? null,
    followers,
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token ?? null,
    scope: tokens.scope ?? "youtube.readonly yt-analytics.readonly",
    tokenExpiresAt: expiresAt,
  });
  if (!ups.ok) {
    return redirectToDashboard({ platform: "YOUTUBE", result: "error", error: "db_insert_failed" });
  }

  return redirectToDashboard({ platform: "YOUTUBE", result: "success", handle });
}
