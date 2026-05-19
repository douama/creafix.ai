import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

type Action = "approve" | "reject" | "ban";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { action?: Action } | null;
  if (!body?.action) return NextResponse.json({ error: "action requis" }, { status: 400 });

  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const sb = supabaseAdmin();
  const newStatus = body.action === "approve" ? "APPROVED" : body.action === "reject" ? "REJECTED" : "BANNED";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb.from("moderation_queue") as any)
    .update({
      status: newStatus,
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: `moderation.${body.action}`,
    target_type: "moderation_queue",
    target_id: id,
  });

  return NextResponse.json({ ok: true });
}
