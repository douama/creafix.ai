import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

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

  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

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
