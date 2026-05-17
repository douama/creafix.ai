import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback Supabase Auth — gère 3 cas :
 *   1. OAuth (Google/GitHub/etc) : ?code=...&next=...
 *   2. Email confirm avec code PKCE : ?code=...&next=...
 *   3. Email confirm avec token_hash (legacy/magic link) : ?token_hash=...&type=signup
 *
 * En cas d'erreur Supabase (error=, error_code=, error_description=),
 * redirige vers /login?error=... pour affichage user-friendly au lieu de 500.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "signup" | "recovery" | "invite" | "email_change" | null;
  const next = searchParams.get("next") ?? "/dashboard";

  // Erreur retournée par Supabase (ex: token expired, otp expired)
  const errorCode = searchParams.get("error") || searchParams.get("error_code");
  const errorDesc = searchParams.get("error_description");
  if (errorCode) {
    const params = new URLSearchParams({
      error: errorCode,
      ...(errorDesc ? { description: errorDesc } : {}),
    });
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  const supabase = createClient();

  try {
    // CASE 1 & 2 : code PKCE → exchange against session
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
        return NextResponse.redirect(`${origin}/login?error=callback&description=${encodeURIComponent(error.message)}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    // CASE 3 : token_hash (legacy email links)
    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      if (error) {
        console.error("[auth/callback] verifyOtp failed:", error.message);
        return NextResponse.redirect(`${origin}/login?error=verify&description=${encodeURIComponent(error.message)}`);
      }
      const dest = type === "signup" ? "/onboarding" : next;
      return NextResponse.redirect(`${origin}${dest}`);
    }

    // Aucun paramètre exploitable
    console.error("[auth/callback] missing code & token_hash. Query:", Object.fromEntries(searchParams));
    return NextResponse.redirect(`${origin}/login?error=invalid_link`);
  } catch (e: unknown) {
    console.error("[auth/callback] unexpected error:", (e as Error).message);
    return NextResponse.redirect(`${origin}/login?error=internal`);
  }
}
