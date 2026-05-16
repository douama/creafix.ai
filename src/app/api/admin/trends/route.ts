import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    country?: string;
    platform?: string;
    kind?: string;
    title?: string;
    momentum?: number;
    status?: string;
  } | null;

  if (!body?.country || !body.platform || !body.kind || !body.title?.trim()) {
    return NextResponse.json({ error: "country, platform, kind, title requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sb.from("trends") as any).insert({
      country: body.country,
      platform: body.platform,
      kind: body.kind,
      title: body.title.trim(),
      momentum: Math.min(100, Math.max(0, body.momentum ?? 50)),
      status: body.status === "APPROVED" ? "APPROVED" : "PENDING",
      created_by: user.id,
      approved_by: body.status === "APPROVED" ? user.id : null,
      source: "Admin manual",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: "trend.create",
    target_type: "trend",
    target_id: data.id,
    meta: { title: data.title, country: data.country },
  });

  return NextResponse.json({ ok: true, trend: data });
}
