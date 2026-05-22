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

  // Facebook profile.php?id=XXX = profil personnel (pas une Page).
  // L'actor "facebook-pages-scraper" ne récupère que les followers, pas les posts.
  // On flag explicitement pour que l'UI puisse afficher un message clair.
  const isFacebookPersonalProfile =
    platform === "FACEBOOK" && /profile\.php\?id=\d+/i.test(rawInput);

  // Provider 1 : Apify
  const apifyToken = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN;
  if (apifyToken) {
    const t0 = Date.now();
    try {
      const res = await fetchViaApify(platform, handle, url, apifyToken);
      const ms = Date.now() - t0;

      // Annote le snapshot d'un warning si profil perso FB (zéro post est attendu)
      if (isFacebookPersonalProfile && res.snapshot) {
        const warnings = res.snapshot.warnings ?? [];
        warnings.push(
          "URL Facebook de type profil personnel détectée — l'API publique ne retourne que les followers, pas les posts. Pour un audit complet, convertis le compte en Page Facebook ou connecte-toi via OAuth.",
        );
        res.snapshot.warnings = warnings;
      }

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
