import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  defaultLocale,
  isValidLocale,
  resolveLocaleFromAcceptLanguage,
  resolveLocaleFromCountry,
  type Locale,
} from "@/i18n/config";

/**
 * Middleware CreaFix AI :
 *  - Détecte la locale (cookie > IP-country > Accept-Language)
 *  - Rafraîchit la session Supabase
 *  - Protège /dashboard si non authentifié
 *  - Headers de sécurité de base
 */
export async function middleware(request: NextRequest) {
  // 1. Détection de la locale
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
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

  // 2. Session Supabase (si configurée)
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = hasSupabase ? await updateSession(request) : NextResponse.next();

  // 3. Si le cookie locale n'existait pas, on l'écrit (auto-détecté)
  if (!isValidLocale(cookieLocale)) {
    response.cookies.set("NEXT_LOCALE", locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 an
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
