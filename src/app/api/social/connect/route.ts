import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  platform: z.enum(["FACEBOOK", "TIKTOK", "INSTAGRAM", "YOUTUBE", "X"]),
});

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { platform } = parsed.data;
  const apiVersion = process.env.META_GRAPH_API_VERSION ?? "v21.0";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  let oauthUrl: string;

  switch (platform) {
    case "FACEBOOK":
      oauthUrl = `https://www.facebook.com/${apiVersion}/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${baseUrl}/api/social/callback/facebook&scope=pages_show_list,pages_read_engagement,read_insights,pages_read_user_content&response_type=code&state=${user.id}`;
      break;
    case "INSTAGRAM":
      oauthUrl = `https://www.facebook.com/${apiVersion}/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${baseUrl}/api/social/callback/instagram&scope=instagram_basic,instagram_manage_insights,pages_show_list&response_type=code&state=${user.id}`;
      break;
    case "TIKTOK":
      oauthUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&scope=user.info.basic,video.list&response_type=code&redirect_uri=${baseUrl}/api/social/callback/tiktok&state=${user.id}`;
      break;
    case "YOUTUBE":
      oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.YOUTUBE_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${baseUrl}/api/social/callback/youtube`)}&scope=${encodeURIComponent("https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly")}&response_type=code&access_type=offline&prompt=consent&state=${user.id}`;
      break;
    case "X":
      oauthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${baseUrl}/api/social/callback/x`)}&scope=${encodeURIComponent("tweet.read users.read offline.access")}&state=${user.id}&code_challenge=challenge&code_challenge_method=plain`;
      break;
  }

  return NextResponse.json({ ok: true, redirectUrl: oauthUrl });
}
