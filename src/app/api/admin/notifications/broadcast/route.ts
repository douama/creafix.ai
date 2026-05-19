import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    title?: string;
    body?: string;
    channel?: string;
    segment?: string;
  } | null;

  if (!body?.title?.trim()) {
    return NextResponse.json({ error: "Titre requis" }, { status: 400 });
  }
  // Borne hard pour éviter abus / payload énorme
  if (body.title.length > 200) {
    return NextResponse.json({ error: "Titre max 200 caractères" }, { status: 400 });
  }
  if (body.body && body.body.length > 2000) {
    return NextResponse.json({ error: "Corps max 2000 caractères" }, { status: 400 });
  }

  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const sb = supabaseAdmin();

  // Récupère les target users selon segment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = (sb.from("user_profiles") as any).select("id");
  switch (body.segment) {
    case "free": q = q.eq("plan", "FREE"); break;
    case "pro": q = q.in("plan", ["PRO", "AGENCY"]); break;
    case "agency": q = q.eq("plan", "AGENCY"); break;
    case "africa":
      q = q.in("country", ["SN", "CI", "CM", "ML", "BF", "NE", "TG", "BJ", "GA", "GN", "MA", "DZ"]);
      break;
    case "active_30d": {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400 * 1000).toISOString();
      q = q.gte("last_seen_at", thirtyDaysAgo);
      break;
    }
    // "all" or default → no filter
  }

  const { data: targets, error: targErr } = await q;
  if (targErr) {
    return NextResponse.json({ error: targErr.message }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetUsers = (targets ?? []) as any[];

  if (targetUsers.length === 0) {
    return NextResponse.json({ ok: true, count: 0, preview: null });
  }

  // Insert une notification pour chaque user (in_app)
  const rows = targetUsers.map((u) => ({
    user_id: u.id,
    type: "broadcast",
    title: body.title!.trim(),
    body: body.body?.trim() ?? null,
    read: false,
    meta: { channel: body.channel ?? "in_app", segment: body.segment ?? "all", broadcast_by: user.id },
  }));

  // Insert par batches de 500 pour éviter les timeouts
  const BATCH = 500;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insErr } = await (sb.from("notifications") as any).insert(batch);
    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }
  }

  // Audit log
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: "notification.broadcast",
    target_type: "broadcast",
    target_id: null,
    meta: { count: targetUsers.length, segment: body.segment, channel: body.channel, title: body.title },
  });

  // Récupère la première notif insérée pour preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: latestNotif } = await (sb.from("notifications") as any)
    .select("*")
    .eq("title", body.title.trim())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    count: targetUsers.length,
    preview: latestNotif
      ? {
          ...latestNotif,
          user_email: null,
          user_name: null,
        }
      : null,
  });
}
