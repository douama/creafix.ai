import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Action = "approve" | "reject" | "archive" | "delete";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { action?: Action } | null;
  if (!body?.action) return NextResponse.json({ error: "action requis" }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

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
