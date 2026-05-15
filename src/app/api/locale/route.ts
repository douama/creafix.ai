import { NextResponse } from "next/server";
import { isValidLocale } from "@/i18n/config";

/**
 * POST /api/locale  { locale: "fr" | "en" | "es" | "pt" }
 * Persiste le choix utilisateur dans le cookie NEXT_LOCALE.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const locale = body?.locale;

  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return response;
}
