/**
 * Configuration i18n CreaFix AI.
 * 4 langues supportées : français, anglais, espagnol, portugais.
 */
export const locales = ["fr", "en", "es", "pt"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  pt: "Português",
};

export const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇺🇸",
  es: "🇪🇸",
  pt: "🇵🇹",
};

/**
 * Mapping ISO country code → locale.
 * Source : ISO 3166-1 alpha-2 (Vercel `x-vercel-ip-country`).
 */
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // Francophones
  FR: "fr", BE: "fr", CH: "fr", LU: "fr", MC: "fr",
  CA: "fr", // QC majoritaire — fallback en si user dit autrement
  // Afrique francophone
  SN: "fr", CI: "fr", CM: "fr", ML: "fr", BF: "fr", NE: "fr",
  TG: "fr", BJ: "fr", GA: "fr", GN: "fr", MG: "fr", DZ: "fr",
  TN: "fr", MR: "fr", BI: "fr", RW: "fr", CG: "fr", CD: "fr",
  KM: "fr", DJ: "fr", MA: "fr", SC: "fr", TD: "fr", CF: "fr",
  // Hispanophones
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es",
  VE: "es", EC: "es", BO: "es", UY: "es", PY: "es", CU: "es",
  DO: "es", GT: "es", HN: "es", NI: "es", CR: "es", PA: "es",
  SV: "es", PR: "es", GQ: "es",
  // Lusophones
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt", CV: "pt",
  GW: "pt", ST: "pt", TL: "pt",
  // Anglophones (défaut) — laissés vides, fallback sur defaultLocale
};

export function resolveLocaleFromCountry(country: string | null | undefined): Locale {
  if (!country) return defaultLocale;
  return COUNTRY_TO_LOCALE[country.toUpperCase()] ?? defaultLocale;
}

export function resolveLocaleFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  // Parse "fr-FR,fr;q=0.9,en;q=0.8" → ["fr-FR", "fr", "en"]
  const tags = header
    .split(",")
    .map((t) => t.split(";")[0].trim().toLowerCase());

  for (const tag of tags) {
    const lang = tag.split("-")[0] as Locale;
    if (locales.includes(lang)) return lang;
  }
  return null;
}

export function isValidLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
