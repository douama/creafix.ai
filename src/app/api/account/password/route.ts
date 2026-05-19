import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

/**
 * POST /api/account/password
 * Body: { new_password: string }
 * Change le mot de passe de l'utilisateur authentifié.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Anti brute-force : bucket "login" (5/min) sur l'identifiant user.
  const rl = await rateLimit("login", user.id);
  if (!rl.success) return rateLimitResponse(rl);

  const body = (await request.json().catch(() => null)) as { new_password?: string } | null;
  if (!body?.new_password || body.new_password.length < 8) {
    return NextResponse.json({ error: "Mot de passe min. 8 caractères" }, { status: 400 });
  }

  // updateUser fonctionne avec le cookie session de l'utilisateur courant
  const { error } = await supabase.auth.updateUser({ password: body.new_password });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
