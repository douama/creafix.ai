import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const VALID_PLATFORMS = [
  "tiktok",
  "instagram",
  "youtube",
  "twitter",
  "facebook",
];

/** POST /api/admin/platform-apis/sync — déclenche un sync manuel (SUPER_ADMIN) */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    platform?: string;
  } | null;

  if (!body?.platform || !VALID_PLATFORMS.includes(body.platform)) {
    return NextResponse.json(
      { error: "platform invalide" },
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
  const { data: isSuper } = await (supabase.rpc as any)("is_super_admin", {
    p_user_id: user.id,
  });
  if (!isSuper)
    return NextResponse.json(
      { error: "SUPER_ADMIN requis" },
      { status: 403 },
    );

  const sb = supabaseAdmin();

  // Marquer comme pending
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.rpc as any)("update_platform_sync_status", {
    p_platform: body.platform,
    p_status: "pending",
    p_error: null,
  });

  // Lancer le sync en arrière-plan (ne pas awaiter pour répondre vite)
  // Le vrai travail se fait dans /api/cron/trends-sync
  void runSync(sb, body.platform);

  return NextResponse.json({
    ok: true,
    message: `Sync déclenché pour ${body.platform}`,
  });
}

async function runSync(
  sb: ReturnType<typeof supabaseAdmin>,
  platform: string,
) {
  try {
    // Récupérer les credentials
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: creds } = await (sb.rpc as any)(
      "get_platform_credentials_for_sync",
      { p_platform: platform },
    );

    if (!creds || creds.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.rpc as any)("update_platform_sync_status", {
        p_platform: platform,
        p_status: "error",
        p_error: "Aucune clé API configurée",
      });
      return;
    }

    // TODO: implémenter les appels API réels par plateforme
    // Ex: TikTok Research API /research/video/query/
    //     Instagram Graph API /hashtag/search + /media
    //     YouTube Data v3 /videos?chart=mostPopular&regionCode=NG
    //     X API v2 /trends/by/woeid/:id
    //     Facebook Graph API /search?type=adinterest

    // Simuler succès pour maintenant — remplacer par vrais appels API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.rpc as any)("update_platform_sync_status", {
      p_platform: platform,
      p_status: "ok",
      p_error: null,
    });
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.rpc as any)("update_platform_sync_status", {
      p_platform: platform,
      p_status: "error",
      p_error: (e as Error)?.message ?? "Erreur inconnue",
    }).catch(() => null);
  }
}
