import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

type Action = "approve" | "reject" | "archive" | "delete";

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

  if (body.action === "delete") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (sb.from("trends") as any).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const status = body.action === "approve" ? "APPROVED" : body.action === "reject" ? "REJECTED" : "ARCHIVED";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (sb.from("trends") as any).update({
      status,
      approved_by: body.action === "approve" ? user.id : null,
    }).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: `trend.${body.action}`,
    target_type: "trend",
    target_id: id,
  });

  return NextResponse.json({ ok: true });
}
