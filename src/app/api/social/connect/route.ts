import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  platform: z.enum(["FACEBOOK", "TIKTOK"]),
  handle: z.string().min(1),
  // En prod : pas de handle nu — OAuth flow renvoie un code + state
  oauthCode: z.string().optional(),
});

/**
 * Démarre / finalise la connexion d'un compte social.
 *
 * Flux Facebook (Meta Graph) :
 *   1. Front redirige vers https://www.facebook.com/{API_VERSION}/dialog/oauth
 *      avec scopes : pages_show_list, pages_read_engagement, read_insights
 *   2. Callback récupère le `code`, l'échange contre un access_token (long-lived)
 *   3. Stocke dans SocialAccount (chiffré côté DB de préférence)
 *
 * Flux TikTok (Display API) :
 *   1. Redirect vers https://www.tiktok.com/v2/auth/authorize/
 *      avec scopes : user.info.basic, video.list, video.upload
 *   2. Échange code -> token via /v2/oauth/token/
 */
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { platform } = parsed.data;
  const apiVersion = process.env.META_GRAPH_API_VERSION ?? "v21.0";

  const oauthUrl =
    platform === "FACEBOOK"
      ? `https://www.facebook.com/${apiVersion}/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.NEXTAUTH_URL}/api/social/callback/facebook&scope=pages_show_list,pages_read_engagement,read_insights,pages_read_user_content&response_type=code`
      : `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&scope=user.info.basic,video.list&response_type=code&redirect_uri=${process.env.NEXTAUTH_URL}/api/social/callback/tiktok`;

  return NextResponse.json({ ok: true, redirectUrl: oauthUrl });
}
