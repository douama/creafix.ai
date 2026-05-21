import {
  isPlatformConfigured,
  upsertSocialAccount,
  validateState,
  redirectToDashboard,
  handleProviderError,
} from "@/lib/social/callback-helpers";

/**
 * OAuth callback Instagram (via Facebook Login for Instagram Business).
 *
 * Flow :
 *  1. Code → access_token (même endpoint que FB)
 *  2. /me/accounts pour récupérer la liste des Pages FB du user
 *  3. Pour chaque Page, GET /{page_id}?fields=instagram_business_account
 *  4. Si une page a un compte IG Business lié, on enregistre ce compte IG
 *  5. Upsert (platform=INSTAGRAM, handle=ig_username)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const providerError = handleProviderError(params, "INSTAGRAM");
  if (providerError) return providerError;

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) {
    return redirectToDashboard({ platform: "INSTAGRAM", result: "error", error: "missing_params" });
  }

  const stateCheck = validateState(state, "INSTAGRAM");
  if (!stateCheck.ok) {
    return redirectToDashboard({ platform: "INSTAGRAM", result: "error", error: stateCheck.error });
  }

  if (!isPlatformConfigured("INSTAGRAM")) {
    return redirectToDashboard({ platform: "INSTAGRAM", result: "error", error: "config_missing" });
  }

  const apiVersion = process.env.META_GRAPH_API_VERSION ?? "v21.0";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "";
  const redirectUri = `${baseUrl}/api/social/callback/instagram`;

  // 1. Token exchange
  type TokenResp = { access_token?: string; expires_in?: number };
  let accessToken: string;
  let expiresAt: Date | null = null;
  try {
    const tokenUrl = new URL(`https://graph.facebook.com/${apiVersion}/oauth/access_token`);
    tokenUrl.searchParams.set("client_id", process.env.META_APP_ID!);
    tokenUrl.searchParams.set("client_secret", process.env.META_APP_SECRET!);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);
    const r = await fetch(tokenUrl.toString(), { cache: "no-store" });
    const j = (await r.json()) as TokenResp;
    if (!r.ok || !j.access_token) {
      return redirectToDashboard({ platform: "INSTAGRAM", result: "error", error: "token_exchange_failed" });
    }
    accessToken = j.access_token;
    if (j.expires_in) expiresAt = new Date(Date.now() + j.expires_in * 1000);
  } catch (e) {
    console.error("[ig callback] token fetch threw", e);
    return redirectToDashboard({ platform: "INSTAGRAM", result: "error", error: "token_exchange_failed" });
  }

  // 2. List pages
  type Page = { id: string; name: string; access_token: string };
  type PagesResp = { data?: Page[] };
  let pages: Page[];
  try {
    const r = await fetch(
      `https://graph.facebook.com/${apiVersion}/me/accounts?access_token=${encodeURIComponent(accessToken)}`,
      { cache: "no-store" },
    );
    const j = (await r.json()) as PagesResp;
    pages = j.data ?? [];
  } catch (e) {
    console.error("[ig callback] /me/accounts threw", e);
    return redirectToDashboard({ platform: "INSTAGRAM", result: "error", error: "profile_fetch_failed" });
  }

  // 3. Pour chaque page, fetch IG business account
  type IgAccount = { id: string; username?: string; name?: string; profile_picture_url?: string; followers_count?: number };
  let igAccount: IgAccount | null = null;
  for (const page of pages) {
    try {
      const r = await fetch(
        `https://graph.facebook.com/${apiVersion}/${page.id}?fields=instagram_business_account&access_token=${encodeURIComponent(page.access_token)}`,
        { cache: "no-store" },
      );
      const j = (await r.json()) as { instagram_business_account?: { id: string } };
      const igId = j.instagram_business_account?.id;
      if (!igId) continue;

      // 4. Fetch IG profile
      const r2 = await fetch(
        `https://graph.facebook.com/${apiVersion}/${igId}?fields=id,username,name,profile_picture_url,followers_count&access_token=${encodeURIComponent(page.access_token)}`,
        { cache: "no-store" },
      );
      const igData = (await r2.json()) as IgAccount;
      if (igData?.id) {
        igAccount = igData;
        break;
      }
    } catch (e) {
      console.warn("[ig callback] page→ig lookup failed", page.id, e);
    }
  }

  if (!igAccount) {
    // L'user a autorisé mais n'a pas de compte IG Business lié à une Page FB
    return redirectToDashboard({ platform: "INSTAGRAM", result: "error", error: "profile_fetch_failed" });
  }

  // 5. Upsert
  const ups = await upsertSocialAccount({
    userId: stateCheck.userId,
    platform: "INSTAGRAM",
    externalId: igAccount.id,
    handle: igAccount.username ?? `ig_${igAccount.id}`,
    displayName: igAccount.name ?? igAccount.username ?? null,
    avatarUrl: igAccount.profile_picture_url ?? null,
    followers: igAccount.followers_count ?? 0,
    accessToken,
    refreshToken: null,
    scope: "instagram_basic,instagram_manage_insights,pages_show_list",
    tokenExpiresAt: expiresAt,
  });
  if (!ups.ok) {
    return redirectToDashboard({ platform: "INSTAGRAM", result: "error", error: "db_insert_failed" });
  }

  return redirectToDashboard({
    platform: "INSTAGRAM",
    result: "success",
    handle: igAccount.username ?? `ig_${igAccount.id}`,
  });
}
