import { supabaseAdmin } from "@/lib/supabase/admin";
import { ModerationClient, type ModerationItem } from "./moderation-client";

export const dynamic = "force-dynamic";

async function load(): Promise<ModerationItem[]> {
  const sb = supabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rowsData } = await (sb.from("moderation_queue") as any)
    .select("id, user_id, kind, severity, status, excerpt, reason, ai_confidence, flagged_by, meta, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (rowsData ?? []) as any[];
  const userIds = Array.from(new Set(rows.map((r) => r.user_id).filter(Boolean)));

  let usersMap: Record<string, { email: string; full_name: string | null; country: string | null }> = {};
  if (userIds.length > 0) {
    const { data: users } = await sb
      .from("user_profiles")
      .select("id, email, full_name, country")
      .in("id", userIds);
    usersMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
  }

  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    severity: r.severity,
    status: r.status,
    excerpt: r.excerpt ?? "",
    reason: r.reason,
    ai_confidence: r.ai_confidence ?? 0,
    flagged_by: r.flagged_by,
    user_handle: r.user_id ? `@${usersMap[r.user_id]?.email?.split("@")[0] ?? "user"}` : "@anonymous",
    user_email: r.user_id ? usersMap[r.user_id]?.email ?? null : null,
    user_country: r.user_id ? usersMap[r.user_id]?.country ?? null : null,
    created_at: r.created_at,
  }));
}

export default async function ModerationAdminPage() {
  const items = await load();
  return <ModerationClient initialItems={items} />;
}
