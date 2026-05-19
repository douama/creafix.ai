import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { active?: boolean } | null;
  if (typeof body?.active !== "boolean") {
    return NextResponse.json({ error: "active (boolean) requis" }, { status: 400 });
  }

  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb.from("coupons") as any).update({ active: body.active }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: body.active ? "coupon.activate" : "coupon.deactivate",
    target_type: "coupon",
    target_id: id,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb.from("coupons") as any).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: "coupon.delete",
    target_type: "coupon",
    target_id: id,
  });

  return NextResponse.json({ ok: true });
}
