/**
 * Référentiel central des plateformes monétisables supportées par CreaFix AI.
 *
 * Chaque plateforme inclut :
 *   - Identifiant ISO (utilisé en DB + URLs)
 *   - Nom, couleur de marque, hex
 *   - Programmes de monétisation actifs
 *   - RPM moyen mondial (USD pour 1 000 vues monétisées)
 *   - Fourchette de CPM publicitaire
 *   - Statut : "live" (produit + audit fonctionne) ou "soon" (UI prête, audit à venir)
 */

export type PlatformId =
  | "FACEBOOK"
  | "TIKTOK"
  | "YOUTUBE"
  | "INSTAGRAM"
  | "X"
  | "SNAPCHAT"
  | "TWITCH"
  | "PINTEREST"
  | "LINKEDIN";

export type MonetizationProgram = {
  name: string;
  type: "ads" | "subs" | "tips" | "shop" | "bonus";
  status: "global" | "limited" | "africa-only" | "us-only";
};

export type Platform = {
  id: PlatformId;
  name: string;
  slug: string;
  color: string;          // hex
  bgGradient: string;     // gradient tailwind from-X to-Y
  ringClass: string;
  textClass: string;
  status: "live" | "beta" | "soon";
  category: "video-short" | "video-long" | "image" | "audio-text" | "live-stream";
  programs: MonetizationProgram[];
  baseRpmUsd: number;     // RPM moyen mondial $ / 1 000 vues
  baseCpmUsd: number;     // CPM moyen mondial $ / 1 000 impressions
  /** Pays africains où la monétisation native fonctionne (ISO-2). */
  africaSupported: string[];
};

export const PLATFORMS: Record<PlatformId, Platform> = {
  YOUTUBE: {
    id: "YOUTUBE",
    name: "YouTube",
    slug: "youtube",
    color: "#FF0000",
    bgGradient: "from-red-500 to-red-700",
    ringClass: "ring-red-500/30",
    textClass: "text-red-500 dark:text-red-300",
    status: "live",
    category: "video-long",
    programs: [
      { name: "YouTube Partner Program (Ads)", type: "ads", status: "global" },
      { name: "Shorts Fund / Shorts Ads", type: "ads", status: "global" },
      { name: "Channel Memberships", type: "subs", status: "limited" },
      { name: "Super Chat & Super Stickers", type: "tips", status: "global" },
      { name: "Super Thanks", type: "tips", status: "global" },
      { name: "Merch shelf", type: "shop", status: "limited" },
    ],
    baseRpmUsd: 2.4,
    baseCpmUsd: 7.5,
    africaSupported: ["ZA", "NG", "GH", "EG", "KE", "MA", "SN", "CI"],
  },
  FACEBOOK: {
    id: "FACEBOOK",
    name: "Facebook",
    slug: "facebook",
    color: "#1877F2",
    bgGradient: "from-blue-500 to-blue-700",
    ringClass: "ring-blue-500/30",
    textClass: "text-blue-500 dark:text-blue-300",
    status: "live",
    category: "video-long",
    programs: [
      { name: "In-Stream Ads", type: "ads", status: "global" },
      { name: "Reels Play Bonus", type: "bonus", status: "limited" },
      { name: "Facebook Stars", type: "tips", status: "global" },
      { name: "Subscriptions", type: "subs", status: "limited" },
      { name: "Branded Content (Brand Collabs)", type: "ads", status: "global" },
    ],
    baseRpmUsd: 1.1,
    baseCpmUsd: 4.2,
    africaSupported: ["SN", "CI", "CM", "ML", "NG", "GH", "ZA", "MA", "CD", "KE"],
  },
  INSTAGRAM: {
    id: "INSTAGRAM",
    name: "Instagram",
    slug: "instagram",
    color: "#E1306C",
    bgGradient: "from-pink-500 via-fuchsia-500 to-orange-500",
    ringClass: "ring-pink-500/30",
    textClass: "text-pink-500 dark:text-pink-300",
    status: "live",
    category: "video-short",
    programs: [
      { name: "Reels Play Bonus", type: "bonus", status: "limited" },
      { name: "Subscriptions", type: "subs", status: "limited" },
      { name: "Badges (Live)", type: "tips", status: "global" },
      { name: "Branded Content", type: "ads", status: "global" },
      { name: "Affiliate (US)", type: "shop", status: "us-only" },
    ],
    baseRpmUsd: 1.4,
    baseCpmUsd: 5.0,
    africaSupported: ["NG", "GH", "ZA", "MA"],
  },
  TIKTOK: {
    id: "TIKTOK",
    name: "TikTok",
    slug: "tiktok",
    color: "#000000",
    bgGradient: "from-pink-500 to-cyan-500",
    ringClass: "ring-pink-500/30",
    textClass: "text-pink-500 dark:text-pink-300",
    status: "live",
    category: "video-short",
    programs: [
      { name: "Creator Rewards Program", type: "ads", status: "limited" },
      { name: "TikTok LIVE Gifts", type: "tips", status: "global" },
      { name: "Series", type: "subs", status: "global" },
      { name: "Creator Marketplace (Brand Deals)", type: "ads", status: "global" },
      { name: "TikTok Shop affiliate", type: "shop", status: "limited" },
    ],
    baseRpmUsd: 0.6,
    baseCpmUsd: 3.0,
    africaSupported: ["ZA", "NG", "GH", "MA", "EG"],
  },
  X: {
    id: "X",
    name: "X",
    slug: "x",
    color: "#000000",
    bgGradient: "from-zinc-700 to-zinc-900",
    ringClass: "ring-zinc-500/30",
    textClass: "text-foreground",
    status: "live",
    category: "audio-text",
    programs: [
      { name: "Ads Revenue Share", type: "ads", status: "limited" },
      { name: "Creator Subscriptions", type: "subs", status: "global" },
      { name: "X Tips", type: "tips", status: "global" },
    ],
    baseRpmUsd: 1.2,
    baseCpmUsd: 4.0,
    africaSupported: ["ZA", "NG", "KE"],
  },
  SNAPCHAT: {
    id: "SNAPCHAT",
    name: "Snapchat",
    slug: "snapchat",
    color: "#FFFC00",
    bgGradient: "from-yellow-400 to-yellow-600",
    ringClass: "ring-yellow-500/30",
    textClass: "text-yellow-500 dark:text-yellow-300",
    status: "beta",
    category: "video-short",
    programs: [
      { name: "Spotlight Rewards", type: "bonus", status: "limited" },
      { name: "Snap Stars (creator fund)", type: "ads", status: "limited" },
      { name: "Mid-roll ads", type: "ads", status: "limited" },
    ],
    baseRpmUsd: 0.9,
    baseCpmUsd: 3.5,
    africaSupported: [],
  },
  TWITCH: {
    id: "TWITCH",
    name: "Twitch",
    slug: "twitch",
    color: "#9146FF",
    bgGradient: "from-violet-500 to-purple-700",
    ringClass: "ring-violet-500/30",
    textClass: "text-violet-500 dark:text-violet-300",
    status: "beta",
    category: "live-stream",
    programs: [
      { name: "Subscriptions (Affiliate / Partner)", type: "subs", status: "global" },
      { name: "Bits (cheers)", type: "tips", status: "global" },
      { name: "Ads Revenue", type: "ads", status: "global" },
      { name: "Twitch Drops & sponsorships", type: "ads", status: "limited" },
    ],
    baseRpmUsd: 3.5,
    baseCpmUsd: 10.0,
    africaSupported: ["ZA", "NG"],
  },
  PINTEREST: {
    id: "PINTEREST",
    name: "Pinterest",
    slug: "pinterest",
    color: "#E60023",
    bgGradient: "from-rose-500 to-rose-700",
    ringClass: "ring-rose-500/30",
    textClass: "text-rose-500 dark:text-rose-300",
    status: "beta",
    category: "image",
    programs: [
      { name: "Creator Rewards", type: "bonus", status: "us-only" },
      { name: "Affiliate", type: "shop", status: "global" },
      { name: "Brand partnerships", type: "ads", status: "global" },
    ],
    baseRpmUsd: 0.8,
    baseCpmUsd: 3.0,
    africaSupported: [],
  },
  LINKEDIN: {
    id: "LINKEDIN",
    name: "LinkedIn",
    slug: "linkedin",
    color: "#0A66C2",
    bgGradient: "from-sky-600 to-blue-700",
    ringClass: "ring-sky-500/30",
    textClass: "text-sky-500 dark:text-sky-300",
    status: "soon",
    category: "audio-text",
    programs: [
      { name: "Creator newsletters", type: "subs", status: "limited" },
      { name: "LinkedIn Audio Live tips", type: "tips", status: "limited" },
      { name: "Brand collabs (B2B)", type: "ads", status: "global" },
    ],
    baseRpmUsd: 5.0,
    baseCpmUsd: 12.0,
    africaSupported: ["ZA", "NG"],
  },
};

export const platformList = Object.values(PLATFORMS);

export const livePlatforms = platformList.filter((p) => p.status === "live");
export const betaPlatforms = platformList.filter((p) => p.status === "beta");
export const soonPlatforms = platformList.filter((p) => p.status === "soon");

export function getPlatform(id: PlatformId): Platform {
  return PLATFORMS[id];
}

/**
 * Multiplicateur de RPM relatif au baseRpmUsd, par pays (signal géo).
 * Pays absents : 1.0.
 */
export const COUNTRY_RPM_MULTIPLIER: Record<string, number> = {
  US: 1.0, CA: 0.95, GB: 0.92, AU: 0.90,
  FR: 0.55, DE: 0.6, ES: 0.45, IT: 0.4,
  JP: 0.75, KR: 0.7,
  // Afrique
  ZA: 0.45, NG: 0.20, GH: 0.22, KE: 0.20,
  SN: 0.15, CI: 0.18, CM: 0.15, ML: 0.12,
  MA: 0.30, EG: 0.22, TN: 0.25, DZ: 0.24,
  CD: 0.10, RW: 0.13,
  // LATAM
  BR: 0.30, MX: 0.32, AR: 0.20, CO: 0.22, CL: 0.30, PE: 0.22,
};

export function estimateRevenue(
  platform: PlatformId,
  country: string,
  monthlyViews: number,
): { rpm: number; usd: number } {
  const p = PLATFORMS[platform];
  const mult = COUNTRY_RPM_MULTIPLIER[country.toUpperCase()] ?? 0.3;
  const rpm = p.baseRpmUsd * mult;
  const usd = (monthlyViews / 1000) * rpm;
  return { rpm, usd };
}
