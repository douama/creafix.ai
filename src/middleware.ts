import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Middleware CreaFix AI :
 *  - Rafraîchit la session Supabase à chaque navigation
 *  - Redirige vers /login si la route /dashboard est demandée sans session
 *  - Ajoute les headers de sécurité de base
 */
export async function middleware(request: NextRequest) {
  // Délègue à Supabase si les vars sont présentes
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = hasSupabase
    ? await updateSession(request)
    : NextResponse.next();

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
