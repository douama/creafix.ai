/**
 * Référentiel central de pricing CreaFix AI — multi-devises.
 *
 * Les prix locaux sont *psychologiquement adaptés* au pouvoir d'achat
 * de chaque marché, pas une conversion FX directe (ex. 29 USD ≈ 17 400 XOF
 * mais on facture 9 900 XOF pour rester accessible aux créateurs africains).
 *
 * Détection : x-vercel-ip-country → currency → prix correspondants.
 * Cookie NEXT_CURRENCY persiste le choix utilisateur si override.
 */

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "XOF"        // Afrique de l'Ouest francophone (8 pays)
  | "XAF"        // Afrique centrale francophone (6 pays)
  | "MAD"        // Maroc
  | "NGN"        // Nigeria
  | "GHS"        // Ghana
  | "ZAR"        // Afrique du Sud
  | "EGP"        // Égypte
  | "DZD"        // Algérie
  | "TND"        // Tunisie
  | "CDF"        // RD Congo
  | "KES"        // Kenya
  | "BRL"        // Brésil
  | "MXN";       // Mexique

export type Plan = "free" | "pro" | "agency" | "enterprise";

export type CurrencyConfig = {
  code: CurrencyCode;
  label: string;
  symbol: string;          // "FCFA" / "DH" / "$" / "€"
  symbolPosition: "before" | "after";
  flag: string;
  locale: string;          // pour Intl.NumberFormat
  pricing: Record<Plan, number>;
  countries: string[];     // ISO-3166 alpha-2
};

/**
 * Prix localisés par devise.
 * "0" pour Free, montant mensuel pour Pro/Agency, 0 pour Enterprise (sur devis).
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    label: "US Dollar",
    symbol: "$",
    symbolPosition: "before",
    flag: "🇺🇸",
    locale: "en-US",
    pricing: { free: 0, pro: 29, agency: 99, enterprise: 0 },
    countries: ["US", "GB", "AU", "NZ", "SG", "HK", "AE", "SA", "IL"],
  },
  EUR: {
    code: "EUR",
    label: "Euro",
    symbol: "€",
    symbolPosition: "after",
    flag: "🇪🇺",
    locale: "fr-FR",
    pricing: { free: 0, pro: 25, agency: 89, enterprise: 0 },
    countries: ["FR", "BE", "DE", "ES", "IT", "PT", "NL", "AT", "IE", "FI", "GR", "LU", "MC", "CH"],
  },
  XOF: {
    code: "XOF",
    label: "Franc CFA Ouest",
    symbol: "FCFA",
    symbolPosition: "after",
    flag: "🇸🇳",
    locale: "fr-FR",
    pricing: { free: 0, pro: 9_900, agency: 49_900, enterprise: 0 },
    countries: ["SN", "CI", "ML", "BF", "NE", "TG", "BJ", "GW"],
  },
  XAF: {
    code: "XAF",
    label: "Franc CFA Centre",
    symbol: "FCFA",
    symbolPosition: "after",
    flag: "🇨🇲",
    locale: "fr-FR",
    pricing: { free: 0, pro: 9_900, agency: 49_900, enterprise: 0 },
    countries: ["CM", "GA", "CG", "TD", "CF", "GQ"],
  },
  MAD: {
    code: "MAD",
    label: "Dirham marocain",
    symbol: "DH",
    symbolPosition: "after",
    flag: "🇲🇦",
    locale: "fr-MA",
    pricing: { free: 0, pro: 159, agency: 799, enterprise: 0 },
    countries: ["MA"],
  },
  NGN: {
    code: "NGN",
    label: "Naira nigérian",
    symbol: "₦",
    symbolPosition: "before",
    flag: "🇳🇬",
    locale: "en-NG",
    pricing: { free: 0, pro: 14_500, agency: 79_900, enterprise: 0 },
    countries: ["NG"],
  },
  GHS: {
    code: "GHS",
    label: "Cedi ghanéen",
    symbol: "GH₵",
    symbolPosition: "before",
    flag: "🇬🇭",
    locale: "en-GH",
    pricing: { free: 0, pro: 199, agency: 999, enterprise: 0 },
    countries: ["GH"],
  },
  ZAR: {
    code: "ZAR",
    label: "Rand sud-africain",
    symbol: "R",
    symbolPosition: "before",
    flag: "🇿🇦",
    locale: "en-ZA",
    pricing: { free: 0, pro: 299, agency: 1_499, enterprise: 0 },
    countries: ["ZA", "NA", "LS", "SZ"],
  },
  EGP: {
    code: "EGP",
    label: "Livre égyptienne",
    symbol: "£E",
    symbolPosition: "before",
    flag: "🇪🇬",
    locale: "ar-EG",
    pricing: { free: 0, pro: 590, agency: 2_990, enterprise: 0 },
    countries: ["EG"],
  },
  DZD: {
    code: "DZD",
    label: "Dinar algérien",
    symbol: "DA",
    symbolPosition: "after",
    flag: "🇩🇿",
    locale: "fr-DZ",
    pricing: { free: 0, pro: 1_990, agency: 9_990, enterprise: 0 },
    countries: ["DZ"],
  },
  TND: {
    code: "TND",
    label: "Dinar tunisien",
    symbol: "DT",
    symbolPosition: "after",
    flag: "🇹🇳",
    locale: "fr-TN",
    pricing: { free: 0, pro: 49, agency: 249, enterprise: 0 },
    countries: ["TN"],
  },
  CDF: {
    code: "CDF",
    label: "Franc congolais",
    symbol: "FC",
    symbolPosition: "after",
    flag: "🇨🇩",
    locale: "fr-CD",
    pricing: { free: 0, pro: 19_900, agency: 99_900, enterprise: 0 },
    countries: ["CD"],
  },
  KES: {
    code: "KES",
    label: "Shilling kenyan",
    symbol: "KSh",
    symbolPosition: "before",
    flag: "🇰🇪",
    locale: "en-KE",
    pricing: { free: 0, pro: 2_990, agency: 14_900, enterprise: 0 },
    countries: ["KE", "TZ", "UG", "RW", "BI"],
  },
  BRL: {
    code: "BRL",
    label: "Real brésilien",
    symbol: "R$",
    symbolPosition: "before",
    flag: "🇧🇷",
    locale: "pt-BR",
    pricing: { free: 0, pro: 99, agency: 499, enterprise: 0 },
    countries: ["BR", "AO", "MZ", "CV", "PT-BR"],
  },
  MXN: {
    code: "MXN",
    label: "Peso mexicain",
    symbol: "MX$",
    symbolPosition: "before",
    flag: "🇲🇽",
    locale: "es-MX",
    pricing: { free: 0, pro: 379, agency: 1_899, enterprise: 0 },
    countries: ["MX", "AR", "CO", "CL", "PE", "VE", "EC", "UY", "PY", "BO"],
  },
};

export const currencyList = Object.values(CURRENCIES);
export const currencyCodes = Object.keys(CURRENCIES) as CurrencyCode[];

/**
 * Résout la devise depuis un code pays ISO.
 * Fallback : USD.
 */
export function resolveCurrencyFromCountry(country: string | null | undefined): CurrencyCode {
  if (!country) return "USD";
  const upper = country.toUpperCase();
  for (const [code, config] of Object.entries(CURRENCIES)) {
    if (config.countries.includes(upper)) return code as CurrencyCode;
  }
  return "USD";
}

export function isValidCurrency(value: string | null | undefined): value is CurrencyCode {
  return !!value && (currencyCodes as readonly string[]).includes(value);
}

/**
 * Formate un prix selon la devise (avec symbole et séparateurs locaux).
 * Exemples :
 *   formatPrice(9900, "XOF")  → "9 900 FCFA"
 *   formatPrice(29, "USD")     → "$29"
 *   formatPrice(159, "MAD")    → "159 DH"
 *   formatPrice(0, "USD")      → "$0"
 */
export function formatPrice(amount: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency];
  const formatted = new Intl.NumberFormat(config.locale, {
    maximumFractionDigits: 0,
  }).format(amount);

  return config.symbolPosition === "before"
    ? `${config.symbol}${formatted}`
    : `${formatted} ${config.symbol}`;
}

/**
 * Récupère le prix d'un plan dans la devise donnée.
 */
export function getPrice(plan: Plan, currency: CurrencyCode): string {
  const amount = CURRENCIES[currency].pricing[plan];
  if (plan === "free") return formatPrice(0, currency);
  if (plan === "enterprise") return "—"; // affiché comme "Custom" via i18n
  return formatPrice(amount, currency);
}

/**
 * Convertit un slug de plan ("PRO", "AGENCY", "FREE", "ENTERPRISE")
 * vers la clé interne (lowercase).
 */
export function slugToPlanKey(slug: string): Plan {
  const lower = slug.toLowerCase();
  if (lower === "pro" || lower === "agency" || lower === "free" || lower === "enterprise") {
    return lower;
  }
  return "pro"; // fallback raisonnable
}

/**
 * Montant numérique localisé d'un plan dans une devise donnée.
 * Période "year" = mensuel × 10 (2 mois offerts sur 12).
 */
export function getLocalizedAmount(
  plan: Plan,
  currency: CurrencyCode,
  period: "month" | "year" = "month",
): number {
  const monthly = CURRENCIES[currency].pricing[plan];
  return period === "year" ? monthly * 10 : monthly;
}
