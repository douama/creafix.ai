/**
 * Estimations CPM/RPM par pays africain.
 * Source : moyennes observées 2024-2025, à raffiner par audit IA réel.
 * Valeurs en USD pour 1 000 vues monétisées.
 */
export type AfricanCountry =
  | "SN"
  | "CI"
  | "CM"
  | "ML"
  | "NG"
  | "GH"
  | "ZA"
  | "MA"
  | "CD";

export const COUNTRIES: Record<
  AfricanCountry,
  { name: string; flag: string; currency: "XOF" | "XAF" | "NGN" | "GHS" | "ZAR" | "MAD" | "USD"; fxToUsd: number; cpmFacebook: number; cpmTikTok: number; rpmFacebook: number; rpmTikTok: number }
> = {
  SN: { name: "Sénégal",        flag: "🇸🇳", currency: "XOF", fxToUsd: 600,  cpmFacebook: 1.4, cpmTikTok: 0.8, rpmFacebook: 0.9, rpmTikTok: 0.45 },
  CI: { name: "Côte d'Ivoire",  flag: "🇨🇮", currency: "XOF", fxToUsd: 600,  cpmFacebook: 1.6, cpmTikTok: 0.9, rpmFacebook: 1.0, rpmTikTok: 0.50 },
  CM: { name: "Cameroun",       flag: "🇨🇲", currency: "XAF", fxToUsd: 600,  cpmFacebook: 1.2, cpmTikTok: 0.7, rpmFacebook: 0.8, rpmTikTok: 0.40 },
  ML: { name: "Mali",           flag: "🇲🇱", currency: "XOF", fxToUsd: 600,  cpmFacebook: 1.0, cpmTikTok: 0.6, rpmFacebook: 0.7, rpmTikTok: 0.35 },
  NG: { name: "Nigeria",        flag: "🇳🇬", currency: "NGN", fxToUsd: 1550, cpmFacebook: 1.3, cpmTikTok: 1.0, rpmFacebook: 0.85, rpmTikTok: 0.55 },
  GH: { name: "Ghana",          flag: "🇬🇭", currency: "GHS", fxToUsd: 15,   cpmFacebook: 1.5, cpmTikTok: 0.95, rpmFacebook: 0.95, rpmTikTok: 0.50 },
  ZA: { name: "Afrique du Sud", flag: "🇿🇦", currency: "ZAR", fxToUsd: 18,   cpmFacebook: 3.2, cpmTikTok: 1.8, rpmFacebook: 2.1, rpmTikTok: 1.10 },
  MA: { name: "Maroc",          flag: "🇲🇦", currency: "MAD", fxToUsd: 10,   cpmFacebook: 2.4, cpmTikTok: 1.4, rpmFacebook: 1.6, rpmTikTok: 0.85 },
  CD: { name: "RD Congo",       flag: "🇨🇩", currency: "USD", fxToUsd: 1,    cpmFacebook: 0.9, cpmTikTok: 0.5, rpmFacebook: 0.6, rpmTikTok: 0.30 },
};

/**
 * Multiplicateur niche : certaines niches ont un CPM bien plus élevé.
 */
export const NICHE_MULTIPLIER: Record<string, number> = {
  finance: 2.4,
  business: 2.1,
  crypto: 2.0,
  techIA: 1.9,
  immobilier: 1.8,
  santé: 1.4,
  education: 1.3,
  lifestyle: 1.0,
  football: 0.9,
  humour: 0.85,
  gossip: 0.7,
  musique: 0.8,
};

export function estimateMonthlyRevenue({
  country,
  platform,
  monthlyViews,
  niche = "lifestyle",
  watchTimeMin = 1.2,
}: {
  country: AfricanCountry;
  platform: "facebook" | "tiktok";
  monthlyViews: number;
  niche?: keyof typeof NICHE_MULTIPLIER;
  watchTimeMin?: number;
}) {
  const c = COUNTRIES[country];
  const rpm = platform === "facebook" ? c.rpmFacebook : c.rpmTikTok;
  const mult = NICHE_MULTIPLIER[niche] ?? 1;
  const watchBoost = Math.min(1.6, watchTimeMin / 1.0);
  const usd = (monthlyViews / 1000) * rpm * mult * watchBoost;
  return {
    usd,
    local: usd * c.fxToUsd,
    currency: c.currency,
    country: c.name,
    flag: c.flag,
  };
}
