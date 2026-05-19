import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  defaultLocale,
  isValidLocale,
  resolveLocaleFromAcceptLanguage,
  resolveLocaleFromCountry,
  type Locale,
} from "@/i18n/config";
import {
  isValidCurrency,
  resolveCurrencyFromCountry,
  type CurrencyCode,
} from "@/lib/pricing";

/**
 * Middleware CreaFix AI :
 *  - Détecte la locale (cookie > IP-country > Accept-Language) + persiste cookie
 *  - Détecte la devise (cookie > IP-country) + persiste cookie
 *  - Rafraîchit la session Supabase (refresh token)
 *  - Pose les headers de sécurité de base (X-Frame-Options, etc.)
 *
 * NB : la protection auth des segments (/dashboard, /admin, /onboarding, …)
 * est faite côté layout RSC ou page (cf. src/app/admin/layout.tsx). Le
 * middleware ne redirige PAS — il rafraîchit juste la session.
 */
export async function middleware(request: NextRequest) {
  // 1. Détection de la locale + devise via géo-IP
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const cookieCurrency = request.cookies.get("NEXT_CURRENCY")?.value;
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null;
  const accept = request.headers.get("accept-language");

  let locale: Locale;
  if (isValidLocale(cookieLocale)) {
    locale = cookieLocale;
  } else if (country) {
    locale = resolveLocaleFromCountry(country);
  } else {
    locale = resolveLocaleFromAcceptLanguage(accept) ?? defaultLocale;
  }

  let currency: CurrencyCode;
  if (isValidCurrency(cookieCurrency)) {
    currency = cookieCurrency;
  } else {
    currency = resolveCurrencyFromCountry(country);
  }

  // 2. Session Supabase (si configurée)
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = hasSupabase ? await updateSession(request) : NextResponse.next();

  // 3. Persiste cookies si absents (auto-détectés)
  if (!isValidLocale(cookieLocale)) {
    response.cookies.set("NEXT_LOCALE", locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }
  if (!isValidCurrency(cookieCurrency)) {
    response.cookies.set("NEXT_CURRENCY", currency, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }

  // 4. Headers sécurité
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};
