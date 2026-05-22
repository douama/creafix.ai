/**
 * Entrée publique du scraper : récupère un `ProfileSnapshot` réel.
 *
 * Dispatch : pour l'instant on a un seul provider (Apify). L'interface est
 * conçue pour pouvoir en ajouter d'autres (Bright Data, ScrapingBee,
 * APIs natives une fois le user OAuth-connecté).
 *
 * Si aucun provider n'est configuré ou que le scrape échoue, on renvoie
 * `dataSource: 'simulated'` — l'audit basculera alors sur les heuristiques
 * Claude classiques (avec un badge UI clair).
 */

import type { PlatformId } from "@/lib/platforms";
import type { ScraperResult } from "./types";
import { normalizeHandle } from "./types";
import { fetchViaApify } from "./providers/apify";

export async function fetchProfileSnapshot(
  platform: PlatformId,
  rawInput: string,
): Promise<ScraperResult> {
  const { handle, url } = normalizeHandle(platform, rawInput);

  if (!handle) {
    return {
      snapshot: null,
      dataSource: "simulated",
      error: { code: "INVALID_HANDLE", message: "Handle ou URL vide" },
    };
  }

  // Provider 1 : Apify
  const apifyToken = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN;
  if (apifyToken) {
    const t0 = Date.now();
    try {
      const res = await fetchViaApify(platform, handle, url, apifyToken);
      const ms = Date.now() - t0;
      if (res.snapshot) {
        console.info(`[scraper/apify] ${platform} @${handle} → ${res.dataSource} in ${ms}ms (followers=${res.snapshot.followers ?? "?"}, posts=${res.snapshot.recentPosts.length})`);
        return res;
      }
      console.warn(`[scraper/apify] ${platform} @${handle} fallback simulated (${res.error?.code}: ${res.error?.message}) in ${ms}ms`);
      return res;
    } catch (e) {
      console.error(`[scraper/apify] crash:`, e);
      return {
        snapshot: null,
        dataSource: "simulated",
        error: { code: "PROVIDER_FAIL", message: (e as Error).message, cause: e },
      };
    }
  }

  // Aucun provider configuré → audit simulé
  return {
    snapshot: null,
    dataSource: "simulated",
    error: {
      code: "NO_KEY",
      message: "Aucun token de scraping configuré (set APIFY_TOKEN pour activer les vraies données)",
    },
  };
}
