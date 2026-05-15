import { cookies, headers } from "next/headers";
import {
  isValidCurrency,
  resolveCurrencyFromCountry,
  type CurrencyCode,
} from "@/lib/pricing";

/**
 * Résout la devise courante côté serveur (RSC).
 * Ordre : cookie > IP-country > USD.
 */
export async function getCurrency(): Promise<CurrencyCode> {
  const cookieStore = await cookies();
  const cookieCurrency = cookieStore.get("NEXT_CURRENCY")?.value;
  if (isValidCurrency(cookieCurrency)) return cookieCurrency;

  const headerStore = await headers();
  const country =
    headerStore.get("x-vercel-ip-country") ??
    headerStore.get("cf-ipcountry") ??
    null;

  return resolveCurrencyFromCountry(country);
}
