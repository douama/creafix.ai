import { NextResponse } from "next/server";
import {
  upsertSocialAccount,
  validateState,
  redirectToDashboard,
  PlatformKey,
} from "@/lib/social/callback-helpers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const platform = params.get("platform") as PlatformKey;
  const state = params.get("state");

  if (!platform || !state) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // Valider le state avec le cookie pour conserver la logique de sécurité
  const stateCheck = validateState(state, platform);
  if (!stateCheck.ok) {
    return redirectToDashboard({ platform, result: "error", error: stateCheck.error });
  }

  // Données de simulation pour chaque plateforme
  const handles: Record<PlatformKey, string> = {
    TIKTOK: "creafix_tiktok",
    INSTAGRAM: "creafix_insta",
    YOUTUBE: "CreaFixTV",
    FACEBOOK: "CreaFixPage",
    X: "CreaFixX",
  };
  
  const displayNames: Record<PlatformKey, string> = {
    TIKTOK: "CreaFix TikTok Tester",
    INSTAGRAM: "CreaFix Instagram Tester",
    YOUTUBE: "CreaFix YouTube Channel",
    FACEBOOK: "CreaFix Facebook Page",
    X: "CreaFix X Account",
  };

  const followersCount: Record<PlatformKey, number> = {
    TIKTOK: 125000,
    INSTAGRAM: 42000,
    YOUTUBE: 105000,
    FACEBOOK: 89000,
    X: 18000,
  };

  const handle = handles[platform] || "creafix_user";
  const displayName = displayNames[platform] || "CreaFix User";
  const followers = followersCount[platform] || 10000;
  const externalId = `mock_${platform.toLowerCase()}_${stateCheck.userId.slice(0, 8)}`;

  // Enregistrer le compte de test dans la table social_accounts via l'admin client
  const ups = await upsertSocialAccount({
    userId: stateCheck.userId,
    platform,
    externalId,
    handle,
    displayName,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${handle}`,
    followers,
    accessToken: "mock_access_token",
    refreshToken: "mock_refresh_token",
    scope: "mock_scope",
    tokenExpiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000), // Expiré dans 1 an
  });

  if (!ups.ok) {
    return redirectToDashboard({ platform, result: "error", error: "db_insert_failed" });
  }

  return redirectToDashboard({
    platform,
    result: "success",
    handle,
  });
}
