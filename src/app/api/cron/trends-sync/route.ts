import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * GET /api/cron/trends-sync
 *
 * Cron Vercel — quotidien (vercel.json → "0 0 * * *"), contraint par le plan
 * Hobby qui n'autorise qu'1 cron/jour. À passer en horaire si upgrade vers Pro.
 *
 * État : collecte des APIs réelles encore TODO (cf. bloc commenté plus bas) —
 * le job met juste à jour les statuts dans platform_api_configs.
 *
 * Auth : CRON_SECRET header (Bearer) — Vercel injecte automatiquement.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    auth !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();

  // Charger toutes les plateformes actives
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: configs, error: cfgErr } = await (sb.rpc as any)(
    "list_platform_api_configs",
  );

  if (cfgErr) {
    return NextResponse.json(
      { error: cfgErr.message },
      { status: 500 },
    );
  }

  const enabled = ((configs ?? []) as {
    platform: string;
    enabled: boolean;
    countries: string[];
  }[]).filter((c) => c.enabled);

  if (enabled.length === 0) {
    return NextResponse.json({
      ok: true,
      message: "Aucune plateforme active",
      synced: 0,
    });
  }

  const results: Record<string, "ok" | "error" | "skipped"> = {};

  for (const cfg of enabled) {
    try {
      // Marquer pending
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.rpc as any)("update_platform_sync_status", {
        p_platform: cfg.platform,
        p_status: "pending",
        p_error: null,
      });

      // Récupérer credentials
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: creds } = await (sb.rpc as any)(
        "get_platform_credentials_for_sync",
        { p_platform: cfg.platform },
      );

      if (!creds || creds.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (sb.rpc as any)("update_platform_sync_status", {
          p_platform: cfg.platform,
          p_status: "error",
          p_error: "Aucune clé API configurée",
        });
        results[cfg.platform] = "skipped";
        continue;
      }

      // TODO: implémenter les collectes réelles
      // Exemple TikTok Research API:
      //   POST https://open.tiktokapis.com/v2/research/video/query/
      //   Headers: Authorization: Bearer {TIKTOK_ACCESS_TOKEN}
      //   Body: { query: { and: [{ field_name: "region_code", ... }] }, ... }
      //
      // Exemple YouTube Data v3:
      //   GET https://www.googleapis.com/youtube/v3/videos
      //   ?part=snippet,statistics&chart=mostPopular&regionCode=NG&key={YOUTUBE_API_KEY}
      //
      // Exemple X API v2 Trending:
      //   GET https://api.twitter.com/2/trends/by/woeid/{woeid}
      //   Headers: Authorization: Bearer {TWITTER_BEARER_TOKEN}
      //
      // Les données collectées seront insérées dans une table african_trend_data
      // et remplaceront les données pool-based dans trend-scanner-client.tsx

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.rpc as any)("update_platform_sync_status", {
        p_platform: cfg.platform,
        p_status: "ok",
        p_error: null,
      });

      results[cfg.platform] = "ok";
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.rpc as any)("update_platform_sync_status", {
        p_platform: cfg.platform,
        p_status: "error",
        p_error: (e as Error)?.message ?? "Erreur inconnue",
      }).catch(() => null);
      results[cfg.platform] = "error";
    }
  }

  const okCount = Object.values(results).filter((v) => v === "ok").length;

  return NextResponse.json({
    ok: true,
    synced: okCount,
    results,
    timestamp: new Date().toISOString(),
  });
}
