import { supabaseAdmin } from "@/lib/supabase/admin";
import { SupportClient, type TicketRow } from "./support-client";

export const dynamic = "force-dynamic";

async function load(): Promise<TicketRow[]> {
  const sb = supabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ticketsData } = await (sb.from("support_tickets") as any)
    .select("id, user_id, subject, body, status, priority, category, channel, assigned_to, resolved_at, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(200);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tickets = (ticketsData ?? []) as any[];
  const userIds = Array.from(
    new Set([
      ...tickets.map((t) => t.user_id),
      ...tickets.map((t) => t.assigned_to).filter(Boolean),
    ]),
  );

  let usersMap: Record<string, { email: string; full_name: string | null; country: string | null; plan: string | null }> = {};
  if (userIds.length > 0) {
    const { data: users } = await sb
      .from("user_profiles")
      .select("id, email, full_name, country, plan")
      .in("id", userIds);
    usersMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
  }

  return tickets.map((t) => ({
    id: t.id,
    user_id: t.user_id,
    user_email: usersMap[t.user_id]?.email ?? null,
    user_name: usersMap[t.user_id]?.full_name ?? null,
    user_country: usersMap[t.user_id]?.country ?? null,
    user_plan: usersMap[t.user_id]?.plan ?? null,
    subject: t.subject,
    body: t.body,
    status: t.status,
    priority: t.priority,
    category: t.category,
    channel: t.channel,
    assigned_to: t.assigned_to,
    assigned_email: t.assigned_to ? usersMap[t.assigned_to]?.email ?? null : null,
    resolved_at: t.resolved_at,
    created_at: t.created_at,
    updated_at: t.updated_at,
  }));
}

export default async function SupportAdminPage() {
  const tickets = await load();
  return <SupportClient initialTickets={tickets} />;
}
