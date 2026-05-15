import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import {
  defaultLocale,
  isValidLocale,
  resolveLocaleFromAcceptLanguage,
  resolveLocaleFromCountry,
  type Locale,
} from "./config";

/**
 * Résolution de la locale pour chaque requête.
 *
 * Ordre de priorité :
 *   1. Cookie `NEXT_LOCALE` (choix explicite utilisateur)
 *   2. Header `x-vercel-ip-country` (géo-IP côté Vercel)
 *   3. Header `accept-language` (préférence navigateur)
 *   4. Fallback : defaultLocale (en)
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const country = headerStore.get("x-vercel-ip-country");
  const accept = headerStore.get("accept-language");

  let locale: Locale;
  if (isValidLocale(cookieLocale)) {
    locale = cookieLocale;
  } else if (country) {
    locale = resolveLocaleFromCountry(country);
  } else {
    locale = resolveLocaleFromAcceptLanguage(accept) ?? defaultLocale;
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return { locale, messages };
});
