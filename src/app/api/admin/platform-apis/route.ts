import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_PLATFORMS = [
  "tiktok",
  "instagram",
  "youtube",
  "twitter",
  "facebook",
] as const;

const VALID_KEY_NAMES: Record<string, string[]> = {
  tiktok: [
    "TIKTOK_CLIENT_KEY",
    "TIKTOK_CLIENT_SECRET",
    "TIKTOK_ACCESS_TOKEN",
  ],
  instagram: [
    "INSTAGRAM_APP_ID",
    "INSTAGRAM_APP_SECRET",
    "INSTAGRAM_ACCESS_TOKEN",
  ],
  youtube: [
    "YOUTUBE_API_KEY",
    "YOUTUBE_OAUTH_CLIENT_ID",
    "YOUTUBE_OAUTH_CLIENT_SECRET",
  ],
  twitter: [
    "TWITTER_BEARER_TOKEN",
    "TWITTER_API_KEY",
    "TWITTER_API_SECRET",
  ],
  facebook: [
    "FACEBOOK_APP_ID",
    "FACEBOOK_APP_SECRET",
    "FACEBOOK_ACCESS_TOKEN",
  ],
};

const VALID_COUNTRIES = ["CI", "NG", "MA", "CM", "ZA", "SN"];

function isValidPlatform(p: string): p is (typeof VALID_PLATFORMS)[number] {
  return (VALID_PLATFORMS as readonly string[]).includes(p);
}

/** POST /api/admin/platform-apis — upsert une clé API */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    platform?: string;
    key_name?: string;
    value?: string;
  } | null;

  if (!body?.platform || !body.key_name || !body.value) {
    return NextResponse.json(
      { error: "platform, key_name, value requis" },
      { status: 400 },
    );
  }
  if (!isValidPlatform(body.platform)) {
    return NextResponse.json(
      { error: `Platform invalide : ${body.platform}` },
      { status: 400 },
    );
  }
  if (!VALID_KEY_NAMES[body.platform]?.includes(body.key_name)) {
    return NextResponse.json(
      { error: `Clé "${body.key_name}" invalide pour ${body.platform}` },
      { status: 400 },
    );
  }
  if (body.value.length < 8) {
    return NextResponse.json(
      { error: "Clé trop courte (min 8 caractères)" },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)(
    "upsert_platform_api_credential",
    {
      p_platform: body.platform,
      p_key_name: body.key_name,
      p_value: body.value,
      p_user_id: user.id,
    },
  );

  if (error) {
    const isAuthErr = error.message?.includes("SUPER_ADMIN");
    return NextResponse.json(
      { error: error.message },
      { status: isAuthErr ? 403 : 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

/** PATCH /api/admin/platform-apis — mise à jour config (enabled + countries) */
export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    platform?: string;
    enabled?: boolean;
    countries?: string[];
  } | null;

  if (
    !body?.platform ||
    typeof body.enabled !== "boolean" ||
    !Array.isArray(body.countries)
  ) {
    return NextResponse.json(
      { error: "platform, enabled (boolean), countries (array) requis" },
      { status: 400 },
    );
  }
  if (!isValidPlatform(body.platform)) {
    return NextResponse.json(
      { error: `Platform invalide : ${body.platform}` },
      { status: 400 },
    );
  }
  const countries = body.countries.filter((c) =>
    VALID_COUNTRIES.includes(c),
  );

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)("update_platform_api_config", {
    p_platform: body.platform,
    p_enabled: body.enabled,
    p_countries: countries,
    p_user_id: user.id,
  });

  if (error) {
    const isAuthErr = error.message?.includes("SUPER_ADMIN");
    return NextResponse.json(
      { error: error.message },
      { status: isAuthErr ? 403 : 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/platform-apis?platform=X&key_name=Y */
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get("platform");
  const keyName = url.searchParams.get("key_name");

  if (!platform || !keyName) {
    return NextResponse.json(
      { error: "platform + key_name requis" },
      { status: 400 },
    );
  }
  if (!isValidPlatform(platform)) {
    return NextResponse.json(
      { error: `Platform invalide : ${platform}` },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)(
    "delete_platform_api_credential",
    {
      p_platform: platform,
      p_key_name: keyName,
      p_user_id: user.id,
    },
  );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message?.includes("SUPER_ADMIN") ? 403 : 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
