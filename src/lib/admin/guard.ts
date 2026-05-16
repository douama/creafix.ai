/**
 * Helpers d'authentification pour les routes API + pages admin.
 *
 * 3 niveaux :
 *   - requireAuth        → utilisateur connecté (n'importe quel rôle)
 *   - requireAdmin       → rôle ADMIN, SUPER_ADMIN ou MODERATOR (via is_admin RPC)
 *   - requireSuperAdmin  → rôle SUPER_ADMIN strict (actions destructrices)
 *
 * Retourne `{ user }` ou un `NextResponse` d'erreur 401/403.
 * Usage :
 *   const guard = await requireSuperAdmin();
 *   if (guard instanceof NextResponse) return guard;
 *   const { user } = guard;
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type User = { id: string; email?: string };

export async function requireAuth(): Promise<{ user: User } | NextResponse> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  return { user: { id: user.id, email: user.email } };
}

export async function requireAdmin(): Promise<{ user: User } | NextResponse> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });
  return { user: { id: user.id, email: user.email } };
}

export async function requireSuperAdmin(): Promise<{ user: User } | NextResponse> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isSuper } = await (supabase.rpc as any)("is_super_admin", { p_user_id: user.id });
  if (!isSuper) {
    return NextResponse.json(
      { error: "Accès SUPER_ADMIN requis (action destructrice)" },
      { status: 403 },
    );
  }
  return { user: { id: user.id, email: user.email } };
}
