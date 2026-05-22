/**
 * Apify provider — récupère les vraies données publiques d'un profil social
 * via les actors Apify Store (run-sync-get-dataset-items API).
 *
 * Pas de SDK : on tape l'API REST directement pour rester léger.
 *
 * Actors par défaut (configurables via env) :
 *   - INSTAGRAM : apify/instagram-profile-scraper
 *   - TIKTOK    : clockworks/tiktok-scraper
 *   - FACEBOOK  : apify/facebook-pages-scraper
 *   - YOUTUBE   : streamers/youtube-scraper
 *
 * Tarif indicatif : ~$0.20 à $1.50 par profil scrapé selon l'actor et la quantité.
 */

import type { PlatformId } from "@/lib/platforms";
import type { ProfileSnapshot, ProfilePost, ScraperResult, PostMediaType } from "../types";
import { computeAggregates } from "../types";

const APIFY_BASE = "https://api.apify.com/v2";
const DEFAULT_TIMEOUT_MS = 90_000;
const MAX_POSTS = 20;

const DEFAULT_ACTORS: Record<PlatformId, string | null> = {
  INSTAGRAM: "apify/instagram-profile-scraper",
  TIKTOK:    "clockworks~tiktok-scraper",
  FACEBOOK:  "apify/facebook-pages-scraper",
  YOUTUBE:   "streamers~youtube-scraper",
  X:         null, // Twitter actor variable — pas activé par défaut
  SNAPCHAT:  null,
  TWITCH:    null,
  PINTEREST: null,
  LINKEDIN:  null,
};

function actorIdFor(platform: PlatformId): string | null {
  const envKey = `APIFY_ACTOR_${platform}`;
  return process.env[envKey] || DEFAULT_ACTORS[platform];
}

function buildInput(platform: PlatformId, handle: string, url: string): Record<string, unknown> {
  switch (platform) {
    case "INSTAGRAM":
      return { usernames: [handle], resultsLimit: MAX_POSTS };
    case "TIKTOK":
      return { profiles: [handle], resultsPerPage: MAX_POSTS, shouldDownloadVideos: false, shouldDownloadCovers: false };
    case "FACEBOOK":
      return { startUrls: [{ url }], resultsLimit: MAX_POSTS };
    case "YOUTUBE":
      return { startUrls: [{ url }], maxResults: MAX_POSTS, maxResultsShorts: 0, maxResultStreams: 0 };
    default:
      return { startUrls: [{ url }], resultsLimit: MAX_POSTS };
  }
}

/** Lance un actor Apify en mode run-sync et retourne les items du dataset. */
async function runActor(
  actorId: string,
  token: string,
  input: Record<string, unknown>,
  timeoutMs: number,
): Promise<unknown[]> {
  // URL-encode l'actor id (ex 'apify/instagram-profile-scraper' → 'apify~instagram-profile-scraper')
  const safeId = actorId.includes("/") ? actorId.replace("/", "~") : actorId;
  const url = `${APIFY_BASE}/acts/${safeId}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=${Math.floor(timeoutMs / 1000)}&memory=1024`;

  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Apify ${res.status}: ${text.slice(0, 300)}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } finally {
    clearTimeout(tid);
  }
}

/* ────────────────────────────────────────────────────────────────────
 * Mappers par plateforme
 *
 * Chaque actor a un schéma de sortie différent. On mappe vers
 * `ProfileSnapshot` en restant tolérant aux variations.
 * ──────────────────────────────────────────────────────────────────── */

function mapInstagram(items: unknown[], handle: string, url: string): Partial<ProfileSnapshot> {
  const first = items[0] as Record<string, unknown> | undefined;
  if (!first) return {};
  const posts = ((first.latestPosts as unknown[]) || []).slice(0, MAX_POSTS);

  return {
    displayName: pickStr(first, "fullName", "full_name"),
    bio: pickStr(first, "biography", "bio"),
    category: pickStr(first, "businessCategoryName", "categoryName"),
    verified: Boolean(first.verified ?? first.isVerified),
    isPrivate: Boolean(first.private ?? first.isPrivate),
    profilePicUrl: pickStr(first, "profilePicUrl", "profilePicUrlHD"),
    followers: pickNum(first, "followersCount", "followers"),
    following: pickNum(first, "followsCount", "following"),
    postsCount: pickNum(first, "postsCount"),
    recentPosts: posts.map((p) => mapInstagramPost(p as Record<string, unknown>)),
  };
}

function mapInstagramPost(p: Record<string, unknown>): ProfilePost {
  const caption = pickStr(p, "caption") ?? "";
  return {
    id: pickStr(p, "id", "shortCode") ?? String(p["id"] ?? Math.random()),
    url: pickStr(p, "url"),
    caption,
    likes: pickNum(p, "likesCount", "likes"),
    comments: pickNum(p, "commentsCount", "comments"),
    views: pickNum(p, "videoViewCount", "videoPlayCount", "views"),
    durationSec: pickNum(p, "videoDuration"),
    postedAt: pickStr(p, "timestamp", "takenAtTimestamp"),
    mediaType: mapMediaType(pickStr(p, "type") ?? pickStr(p, "productType")),
    hashtags: extractHashtags(caption),
    thumbnailUrl: pickStr(p, "displayUrl"),
  };
}

function mapTikTok(items: unknown[], handle: string): Partial<ProfileSnapshot> {
  // clockworks/tiktok-scraper retourne les vidéos avec authorMeta sur chacune
  const videos = items.slice(0, MAX_POSTS);
  const first = videos[0] as Record<string, unknown> | undefined;
  const author = (first?.authorMeta as Record<string, unknown> | undefined) ?? {};

  return {
    displayName: pickStr(author, "nickName", "name") ?? handle,
    bio: pickStr(author, "signature", "bio"),
    verified: Boolean(author.verified),
    isPrivate: Boolean(author.privateAccount),
    profilePicUrl: pickStr(author, "avatar"),
    followers: pickNum(author, "fans", "followers"),
    following: pickNum(author, "following"),
    postsCount: pickNum(author, "video", "videoCount"),
    totalLikes: pickNum(author, "heart", "digg"),
    recentPosts: videos.map((v) => mapTikTokVideo(v as Record<string, unknown>)),
  };
}

function mapTikTokVideo(v: Record<string, unknown>): ProfilePost {
  const text = pickStr(v, "text", "desc") ?? "";
  return {
    id: pickStr(v, "id") ?? String(v.id ?? Math.random()),
    url: pickStr(v, "webVideoUrl", "url"),
    caption: text,
    likes: pickNum(v, "diggCount", "likes"),
    comments: pickNum(v, "commentCount", "comments"),
    shares: pickNum(v, "shareCount", "shares"),
    views: pickNum(v, "playCount", "views"),
    durationSec: pickNum(v, "videoMeta.duration", "videoDuration"),
    postedAt: pickStr(v, "createTimeISO", "createTime"),
    mediaType: "video",
    hashtags: extractHashtags(text),
    thumbnailUrl: pickStr(v, "videoMeta.coverUrl", "cover"),
  };
}

function mapFacebook(items: unknown[], handle: string): Partial<ProfileSnapshot> {
  const first = items[0] as Record<string, unknown> | undefined;
  if (!first) return {};
  const posts = ((first.posts as unknown[]) || []).slice(0, MAX_POSTS);

  return {
    displayName: pickStr(first, "title", "name") ?? handle,
    bio: pickStr(first, "intro", "about", "pageDescription"),
    category: pickStr(first, "categories", "category"),
    verified: Boolean(first.verified ?? first.isVerified),
    profilePicUrl: pickStr(first, "profilePictureUrl", "pageProfilePicture"),
    followers: pickNum(first, "followers", "followersCount", "likes"),
    postsCount: posts.length,
    recentPosts: posts.map((p) => mapFacebookPost(p as Record<string, unknown>)),
  };
}

function mapFacebookPost(p: Record<string, unknown>): ProfilePost {
  const text = pickStr(p, "text", "message", "postText") ?? "";
  return {
    id: pickStr(p, "postId", "id") ?? String(Math.random()),
    url: pickStr(p, "url", "postUrl"),
    caption: text,
    likes: pickNum(p, "likesCount", "likes"),
    comments: pickNum(p, "commentsCount", "comments"),
    shares: pickNum(p, "sharesCount", "shares"),
    views: pickNum(p, "viewsCount", "videoViewCount", "views"),
    postedAt: pickStr(p, "time", "publishedAt"),
    mediaType: mapMediaType(pickStr(p, "type") ?? (p.video ? "video" : "image")),
    hashtags: extractHashtags(text),
    thumbnailUrl: pickStr(p, "thumbnail", "image"),
  };
}

function mapYouTube(items: unknown[], handle: string): Partial<ProfileSnapshot> {
  // streamers/youtube-scraper : un item par vidéo + métadonnées chaîne sur le 1er
  const first = items[0] as Record<string, unknown> | undefined;
  const channel = (first?.channelInfo as Record<string, unknown> | undefined) ?? first ?? {};

  const videos = items.slice(0, MAX_POSTS);

  return {
    displayName: pickStr(channel, "channelName", "channelTitle") ?? handle,
    bio: pickStr(channel, "channelDescription", "description"),
    verified: Boolean(channel.channelVerified),
    profilePicUrl: pickStr(channel, "channelAvatarUrl", "channelThumbnail"),
    followers: pickNum(channel, "numberOfSubscribers", "subscribers"),
    postsCount: pickNum(channel, "channelTotalVideos", "videoCount"),
    totalViews: pickNum(channel, "channelTotalViews"),
    recentPosts: videos.map((v) => mapYouTubeVideo(v as Record<string, unknown>)),
  };
}

function mapYouTubeVideo(v: Record<string, unknown>): ProfilePost {
  const title = pickStr(v, "title") ?? "";
  const desc = pickStr(v, "text", "description") ?? "";
  return {
    id: pickStr(v, "id", "videoId") ?? String(Math.random()),
    url: pickStr(v, "url"),
    caption: title,
    likes: pickNum(v, "likes"),
    comments: pickNum(v, "commentsCount", "comments"),
    views: pickNum(v, "viewCount", "views"),
    durationSec: pickNum(v, "duration"),
    postedAt: pickStr(v, "date", "publishedAt"),
    mediaType: (pickStr(v, "type")?.toLowerCase().includes("short") ? "short" : "video") as PostMediaType,
    hashtags: extractHashtags(`${title}\n${desc}`),
    thumbnailUrl: pickStr(v, "thumbnailUrl"),
  };
}

/* ────────────────────────────────────────────────────────────────────
 * Helpers de mapping tolérants
 * ──────────────────────────────────────────────────────────────────── */

function pickStr(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = readPath(obj, k);
    if (typeof v === "string" && v.length > 0) return v;
    if (typeof v === "number") return String(v);
  }
  return undefined;
}

function pickNum(obj: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = readPath(obj, k);
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number(v.replace(/[,\s]/g, ""));
      if (Number.isFinite(n)) return n;
    }
  }
  return undefined;
}

function readPath(obj: Record<string, unknown>, path: string): unknown {
  if (!path.includes(".")) return obj[path];
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
}

function extractHashtags(text: string): string[] {
  if (!text) return [];
  const m = text.match(/#[\p{L}0-9_]+/gu);
  return m ? m.map((t) => t.toLowerCase()) : [];
}

function mapMediaType(raw: string | undefined): PostMediaType {
  if (!raw) return "unknown";
  const k = raw.toLowerCase();
  if (k.includes("video"))     return "video";
  if (k.includes("reel"))      return "reel";
  if (k.includes("short"))     return "short";
  if (k.includes("carousel") || k.includes("sidecar")) return "carousel";
  if (k.includes("image") || k.includes("photo")) return "image";
  if (k.includes("live"))      return "live";
  if (k.includes("story"))     return "story";
  return "unknown";
}

/* ────────────────────────────────────────────────────────────────────
 * Entrée publique
 * ──────────────────────────────────────────────────────────────────── */

export async function fetchViaApify(
  platform: PlatformId,
  handle: string,
  url: string,
  token: string,
): Promise<ScraperResult> {
  const actor = actorIdFor(platform);
  if (!actor) {
    return {
      snapshot: null,
      dataSource: "simulated",
      error: { code: "NO_PROVIDER", message: `Aucun actor Apify configuré pour ${platform}` },
    };
  }

  const input = buildInput(platform, handle, url);

  let items: unknown[];
  try {
    items = await runActor(actor, token, input, DEFAULT_TIMEOUT_MS);
  } catch (e) {
    const msg = (e as Error).message;
    const code =
      msg.includes("aborted") || msg.includes("timeout") ? "TIMEOUT" :
      msg.includes("429") ? "RATE_LIMIT" :
      msg.includes("404") || msg.includes("not found") ? "NOT_FOUND" :
      "PROVIDER_FAIL";
    return {
      snapshot: null,
      dataSource: "simulated",
      error: { code, message: msg, cause: e },
    };
  }

  if (!items.length) {
    return {
      snapshot: null,
      dataSource: "simulated",
      error: { code: "NOT_FOUND", message: "Le profil n'a renvoyé aucune donnée (privé, inexistant, ou bloqué)" },
    };
  }

  let mapped: Partial<ProfileSnapshot> = {};
  try {
    switch (platform) {
      case "INSTAGRAM": mapped = mapInstagram(items, handle, url); break;
      case "TIKTOK":    mapped = mapTikTok(items, handle); break;
      case "FACEBOOK":  mapped = mapFacebook(items, handle); break;
      case "YOUTUBE":   mapped = mapYouTube(items, handle); break;
      default:
        return {
          snapshot: null,
          dataSource: "simulated",
          error: { code: "NO_PROVIDER", message: `Mapping ${platform} non implémenté` },
        };
    }
  } catch (e) {
    return {
      snapshot: null,
      dataSource: "simulated",
      error: { code: "PROVIDER_FAIL", message: `Mapping ${platform} a échoué: ${(e as Error).message}`, cause: e },
    };
  }

  const snapshot: ProfileSnapshot = {
    platform,
    handle,
    url,
    recentPosts: [],
    source: "apify",
    fetchedAt: new Date().toISOString(),
    ...mapped,
  };
  snapshot.aggregates = computeAggregates(snapshot);

  const partial =
    !snapshot.followers && !snapshot.recentPosts.length;
  if (partial) {
    return {
      snapshot,
      dataSource: "partial",
      error: { code: "PROVIDER_FAIL", message: "Données partielles renvoyées par le scraper" },
    };
  }

  const someMissing = !snapshot.followers || !snapshot.recentPosts.length;
  return {
    snapshot,
    dataSource: someMissing ? "partial" : "real",
  };
}
