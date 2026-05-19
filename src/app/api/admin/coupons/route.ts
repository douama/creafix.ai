import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    code?: string; kind?: string; value?: number;
    max_uses?: number | null; applies_to_plan?: string | null;
    expires_at?: string | null;
  } | null;

  if (!body?.code || !body.kind || !body.value) {
    return NextResponse.json({ error: "code, kind, value requis" }, { status: 400 });
  }

  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sb.from("coupons") as any).insert({
    code: body.code.toUpperCase(),
    kind: body.kind,
    value: body.value,
    max_uses: body.max_uses,
    applies_to_plan: body.applies_to_plan,
    expires_at: body.expires_at,
    active: true,
    created_by: user.id,
  }).select().single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ce code existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: "coupon.create",
    target_type: "coupon",
    target_id: data.id,
    meta: { code: body.code, kind: body.kind, value: body.value },
  });

  return NextResponse.json({ ok: true, coupon: data });
}
