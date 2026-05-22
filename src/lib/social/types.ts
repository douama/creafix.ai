/**
 * Types partagés pour le scraping des profils sociaux.
 *
 * Un `ProfileSnapshot` est la photographie *réelle* d'un compte créateur
 * au moment de l'audit. Il alimente les prompts Claude pour que l'analyse
 * soit basée sur des données vraies (et plus sur des hallucinations).
 */

import type { PlatformId } from "@/lib/platforms";

export type PostMediaType = "video" | "image" | "carousel" | "live" | "short" | "reel" | "story" | "text" | "unknown";

export interface ProfilePost {
  id: string;
  url?: string;
  caption?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  durationSec?: number;
  postedAt?: string;          // ISO 8601
  mediaType?: PostMediaType;
  hashtags?: string[];
  thumbnailUrl?: string;
}

export interface ProfileSnapshot {
  platform: PlatformId;
  handle: string;             // normalisé sans le @
  url: string;                // URL canonique du profil
  displayName?: string;
  bio?: string;
  category?: string;          // catégorie/niche déclarée par la plateforme
  verified?: boolean;
  isPrivate?: boolean;
  profilePicUrl?: string;
  followers?: number;
  following?: number;
  postsCount?: number;
  totalLikes?: number;        // TikTok
  totalViews?: number;        // YouTube channel total
  recentPosts: ProfilePost[]; // jusqu'à 20 derniers posts/vidéos
  /** Métriques agrégées calculées à partir de recentPosts */
  aggregates?: {
    avgLikes?: number;
    avgComments?: number;
    avgViews?: number;
    engagementRatePct?: number;     // (avg likes + comments) / followers × 100
    postFrequencyPerWeek?: number;
    topHashtags?: { tag: string; count: number }[];
  };
  /** Provider qui a fourni la donnée (apify, native-api, etc.) */
  source: "apify" | "graph-api" | "youtube-data-api" | "tiktok-display-api" | "html-fetch" | "simulated";
  /** Erreurs partielles non-bloquantes (ex: posts récupérés mais pas bio) */
  warnings?: string[];
  fetchedAt: string;          // ISO
}

export type DataSource = "real" | "partial" | "simulated";

export interface ScraperError {
  code: "NO_PROVIDER" | "NO_KEY" | "PROVIDER_FAIL" | "NOT_FOUND" | "PRIVATE" | "RATE_LIMIT" | "TIMEOUT" | "INVALID_HANDLE";
  message: string;
  cause?: unknown;
}

export interface ScraperResult {
  snapshot: ProfileSnapshot | null;
  dataSource: DataSource;
  error?: ScraperError;
}

/* ────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────── */

/** Calcule les agrégats à partir des posts récupérés. */
export function computeAggregates(snapshot: ProfileSnapshot): ProfileSnapshot["aggregates"] {
  const posts = snapshot.recentPosts;
  if (!posts.length) return undefined;

  const sum = (key: keyof ProfilePost) =>
    posts.reduce((acc, p) => acc + (typeof p[key] === "number" ? (p[key] as number) : 0), 0);

  const avgLikes = Math.round(sum("likes") / posts.length);
  const avgComments = Math.round(sum("comments") / posts.length);
  const viewsSum = sum("views");
  const avgViews = viewsSum > 0 ? Math.round(viewsSum / posts.length) : undefined;

  const followers = snapshot.followers ?? 0;
  const engagementRatePct =
    followers > 0 ? Math.round(((avgLikes + avgComments) / followers) * 1000) / 10 : undefined;

  // Fréquence : on prend (post le + récent) − (post le + ancien) sur n posts
  let postFrequencyPerWeek: number | undefined;
  const dated = posts.filter((p) => p.postedAt).map((p) => new Date(p.postedAt!).getTime());
  if (dated.length >= 2) {
    const newest = Math.max(...dated);
    const oldest = Math.min(...dated);
    const spanDays = Math.max(1, (newest - oldest) / 86400000);
    postFrequencyPerWeek = Math.round((dated.length / spanDays) * 7 * 10) / 10;
  }

  // Top hashtags
  const tagCount = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.hashtags ?? []) {
      const norm = t.toLowerCase().replace(/^#/, "");
      if (!norm) continue;
      tagCount.set(norm, (tagCount.get(norm) ?? 0) + 1);
    }
  }
  const topHashtags = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag: `#${tag}`, count }));

  return {
    avgLikes,
    avgComments,
    avgViews,
    engagementRatePct,
    postFrequencyPerWeek,
    topHashtags: topHashtags.length ? topHashtags : undefined,
  };
}

/** Normalise un handle ou URL en (handle, url canonique). */
export function normalizeHandle(platform: PlatformId, input: string): { handle: string; url: string } {
  const raw = input.trim();
  // URL ?
  let handle = raw;
  let url = raw;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      const segments = u.pathname.split("/").filter(Boolean);
      // ex /@moncompte → moncompte
      handle = segments[0]?.replace(/^@/, "") || raw;
      if (platform === "YOUTUBE" && segments[0]?.startsWith("@")) handle = segments[0].slice(1);
      url = raw;
    } catch {
      /* swallow, garde raw */
    }
  } else {
    handle = raw.replace(/^@/, "");
    url = buildProfileUrl(platform, handle);
  }

  return { handle, url };
}

function buildProfileUrl(platform: PlatformId, handle: string): string {
  switch (platform) {
    case "FACEBOOK":  return `https://www.facebook.com/${handle}`;
    case "INSTAGRAM": return `https://www.instagram.com/${handle}/`;
    case "TIKTOK":    return `https://www.tiktok.com/@${handle}`;
    case "YOUTUBE":   return `https://www.youtube.com/@${handle}`;
    case "X":         return `https://x.com/${handle}`;
    case "SNAPCHAT":  return `https://www.snapchat.com/add/${handle}`;
    case "TWITCH":    return `https://www.twitch.tv/${handle}`;
    case "PINTEREST": return `https://www.pinterest.com/${handle}/`;
    case "LINKEDIN":  return `https://www.linkedin.com/in/${handle}`;
    default:          return handle;
  }
}
