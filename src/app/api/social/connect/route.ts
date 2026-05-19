import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { signState, generatePkce, randomNonce } from "@/lib/social/oauth-state";

const schema = z.object({
  platform: z.enum(["FACEBOOK", "TIKTOK", "INSTAGRAM", "YOUTUBE", "X"]),
});

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { platform } = parsed.data;
  const apiVersion = process.env.META_GRAPH_API_VERSION ?? "v21.0";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  // state = nonce aléatoire signé HMAC (anti CSRF / replay)
  const state = signState(randomNonce(), user.id);

  let oauthUrl: string;
  // X (Twitter) exige PKCE — on génère un vrai verifier + challenge S256
  let pkce: { verifier: string; challenge: string } | null = null;

  switch (platform) {
    case "FACEBOOK":
      oauthUrl = `https://www.facebook.com/${apiVersion}/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${baseUrl}/api/social/callback/facebook&scope=pages_show_list,pages_read_engagement,read_insights,pages_read_user_content&response_type=code&state=${encodeURIComponent(state)}`;
      break;
    case "INSTAGRAM":
      oauthUrl = `https://www.facebook.com/${apiVersion}/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${baseUrl}/api/social/callback/instagram&scope=instagram_basic,instagram_manage_insights,pages_show_list&response_type=code&state=${encodeURIComponent(state)}`;
      break;
    case "TIKTOK":
      oauthUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&scope=user.info.basic,video.list&response_type=code&redirect_uri=${baseUrl}/api/social/callback/tiktok&state=${encodeURIComponent(state)}`;
      break;
    case "YOUTUBE":
      oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.YOUTUBE_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${baseUrl}/api/social/callback/youtube`)}&scope=${encodeURIComponent("https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly")}&response_type=code&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`;
      break;
    case "X":
      pkce = generatePkce();
      oauthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${baseUrl}/api/social/callback/x`)}&scope=${encodeURIComponent("tweet.read users.read offline.access")}&state=${encodeURIComponent(state)}&code_challenge=${pkce.challenge}&code_challenge_method=S256`;
      break;
  }

  const res = NextResponse.json({ ok: true, redirectUrl: oauthUrl });

  // Cookies httpOnly courts (10 min) — lus par le callback pour vérifier l'origine
  // de la requête et le PKCE verifier (X).
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/api/social",
    maxAge: 60 * 10,
  };
  res.cookies.set(`oauth_state_${platform.toLowerCase()}`, state, cookieOpts);
  if (pkce) {
    res.cookies.set(`oauth_pkce_${platform.toLowerCase()}`, pkce.verifier, cookieOpts);
  }

  return res;
}
