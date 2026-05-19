import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;

  if (!body?.status) {
    return NextResponse.json({ error: "status requis" }, { status: 400 });
  }

  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const sb = supabaseAdmin();
  const updates: Record<string, unknown> = { status: body.status };
  if (body.status === "RESOLVED" || body.status === "CLOSED") {
    updates.resolved_at = new Date().toISOString();
  } else {
    updates.resolved_at = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb.from("support_tickets") as any)
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: `support.status_change`,
    target_type: "support_ticket",
    target_id: id,
    meta: updates,
  });

  return NextResponse.json({ ok: true });
}
