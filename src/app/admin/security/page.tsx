import { supabaseAdmin } from "@/lib/supabase/admin";
import { SecurityClient, type LogRow } from "./security-client";

export const dynamic = "force-dynamic";

async function load() {
  const sb = supabaseAdmin();

  // Logs récents + join avec user_profiles pour avoir l'email de l'actor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: logsData } = await (sb.from("audit_logs") as any)
    .select("id, actor_id, action, target_type, target_id, meta, ip, user_agent, created_at")
    .order("created_at", { ascending: false })
    .limit(200) as { data: LogRow[] | null };

  const actorIds = Array.from(
    new Set((logsData ?? []).map((l) => l.actor_id).filter(Boolean) as string[]),
  );

  let actorMap: Record<string, { email: string; full_name: string | null; role: string | null }> = {};
  if (actorIds.length > 0) {
    const { data: actors } = await sb
      .from("user_profiles")
      .select("id, email, full_name, role")
      .in("id", actorIds);
    actorMap = Object.fromEntries(
      (actors ?? []).map((a) => [
        a.id,
        { email: a.email, full_name: a.full_name, role: a.role },
      ]),
    );
  }

  const logs: LogRow[] = (logsData ?? []).map((l) => ({
    id: l.id,
    actor_id: l.actor_id,
    actor_email: l.actor_id ? actorMap[l.actor_id]?.email ?? null : null,
    actor_name: l.actor_id ? actorMap[l.actor_id]?.full_name ?? null : null,
    actor_role: l.actor_id ? actorMap[l.actor_id]?.role ?? null : null,
    action: l.action,
    target_type: l.target_type,
    target_id: l.target_id,
    meta: l.meta as Record<string, unknown> | null,
    ip: l.ip,
    user_agent: l.user_agent,
    created_at: l.created_at,
  }));

  // Stats
  const stats = {
    total: logs.length,
    actors: new Set(logs.map((l) => l.actor_id).filter(Boolean)).size,
    today: logs.filter(
      (l) => new Date(l.created_at).toDateString() === new Date().toDateString(),
    ).length,
    actions: new Set(logs.map((l) => l.action)).size,
  };

  return { logs, stats };
}

export default async function SecurityPage() {
  const { logs, stats } = await load();
  return <SecurityClient initialLogs={logs} stats={stats} />;
}
