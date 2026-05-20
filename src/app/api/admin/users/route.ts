import { NextResponse } from "next/server";
import { randomBytes, randomInt } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** Rôles privilégiés : seul SUPER_ADMIN peut en créer/promouvoir. */
const PRIVILEGED_ROLES = ["ADMIN", "SUPER_ADMIN", "MODERATOR", "SUPPORT", "ANALYST"];

/**
 * POST /api/admin/users
 *
 * Crée un nouvel utilisateur via Supabase Auth Admin API,
 * email auto-confirmé, et lui attribue un rôle dans user_profiles.
 *
 * Body :
 *   email, full_name, role, password?, plan?, country?
 *
 * Si password absent → password fort auto-généré, retourné dans la réponse
 * pour copie/sauvegarde (visible une seule fois côté client).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    full_name?: string;
    role?: string;
    password?: string;
    plan?: string;
    country?: string;
  } | null;

  if (!body?.email || !body.email.includes("@")) {
    return NextResponse.json({ error: "Email valide requis" }, { status: 400 });
  }

  const allowedRoles = ["CREATOR", "INFLUENCER", "AGENCY", "ADMIN", "SUPER_ADMIN", "MODERATOR", "SUPPORT", "ANALYST"];
  const role = body.role && allowedRoles.includes(body.role) ? body.role : "CREATOR";
  const plan = body.plan && ["FREE", "PRO", "AGENCY"].includes(body.plan) ? body.plan : "FREE";

  // Auth check : un ADMIN peut créer des CREATOR/INFLUENCER/AGENCY.
  // Seul SUPER_ADMIN peut créer/promouvoir des rôles privilégiés
  // (ADMIN, SUPER_ADMIN, MODERATOR, SUPPORT, ANALYST) — anti-escalade.
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

  if (PRIVILEGED_ROLES.includes(role)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: isSuper } = await (supabase.rpc as any)("is_super_admin", { p_user_id: user.id });
    if (!isSuper) {
      return NextResponse.json(
        { error: `Seul un SUPER_ADMIN peut créer/promouvoir un compte avec le rôle "${role}"` },
        { status: 403 },
      );
    }
  }

  // Password : fourni ou auto-généré
  const generatedPwd = body.password ?? generateStrongPassword();
  if (generatedPwd.length < 8) {
    return NextResponse.json({ error: "Password min. 8 caractères" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  // 1. Vérifie si user existe déjà
  const { data: existingList } = await sb.auth.admin.listUsers();
  const existing = existingList?.users?.find((u) => u.email === body.email);

  let userId: string;
  let isNew: boolean;

  if (existing) {
    // Update password + role
    isNew = false;
    userId = existing.id;
    const { error: updErr } = await sb.auth.admin.updateUserById(existing.id, {
      password: generatedPwd,
      email_confirm: true,
      user_metadata: { full_name: body.full_name ?? body.email.split("@")[0], is_admin: role !== "CREATOR" },
    });
    if (updErr) {
      return NextResponse.json({ error: `Échec update user : ${updErr.message}` }, { status: 500 });
    }
  } else {
    // Crée nouveau user (email confirmé d'office)
    isNew = true;
    const { data: created, error: createErr } = await sb.auth.admin.createUser({
      email: body.email,
      password: generatedPwd,
      email_confirm: true,
      user_metadata: { full_name: body.full_name ?? body.email.split("@")[0], is_admin: role !== "CREATOR" },
    });
    if (createErr || !created.user) {
      return NextResponse.json(
        { error: `Échec création user : ${createErr?.message ?? "inconnu"}` },
        { status: 500 },
      );
    }
    userId = created.user.id;
  }

  // 2. Upsert profil avec role + plan + country
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: profileErr } = await (sb.from("user_profiles") as any).upsert(
    {
      id: userId,
      email: body.email,
      full_name: body.full_name ?? body.email.split("@")[0],
      role,
      plan,
      country: body.country ?? null,
      status: "ACTIVE",
    },
    { onConflict: "id" },
  );

  if (profileErr) {
    return NextResponse.json({ error: `Échec upsert profil : ${profileErr.message}` }, { status: 500 });
  }

  // 3. Audit log
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: isNew ? "user.create" : "user.update_credentials",
    target_type: "user_profile",
    target_id: userId,
    meta: { email: body.email, role, plan, by_admin: user.id },
  });

  return NextResponse.json({
    ok: true,
    isNew,
    user: {
      id: userId,
      email: body.email,
      full_name: body.full_name ?? body.email.split("@")[0],
      role,
      plan,
    },
    // ⚠️  Password retourné UNE SEULE FOIS pour copie côté client
    generatedPassword: body.password ? null : generatedPwd,
  });
}

function generateStrongPassword(length = 16): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*-_+=?";
  const all = upper + lower + digits + symbols;

  // Pick a cryptographically secure index in [0, max).
  const pick = (set: string) => set[randomInt(0, set.length)];

  const chars: string[] = [];
  // Garantit au moins 1 de chaque
  chars.push(pick(upper));
  chars.push(pick(lower));
  chars.push(pick(digits));
  chars.push(pick(symbols));
  for (let i = chars.length; i < length; i++) {
    chars.push(pick(all));
  }

  // Fisher–Yates shuffle driven by crypto randomness.
  const rand = randomBytes(chars.length * 4);
  for (let i = chars.length - 1; i > 0; i--) {
    const r = rand.readUInt32BE(i * 4 - 4) % (i + 1);
    [chars[i], chars[r]] = [chars[r], chars[i]];
  }
  return chars.join("");
}
