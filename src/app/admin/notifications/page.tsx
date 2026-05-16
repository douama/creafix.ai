import { supabaseAdmin } from "@/lib/supabase/admin";
import { NotificationsClient, type NotifRow } from "./notifications-client";

export const dynamic = "force-dynamic";

async function load(): Promise<NotifRow[]> {
  const sb = supabaseAdmin();
  const { data: notifsData } = await sb
    .from("notifications")
    .select("id, user_id, type, title, body, read, meta, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const notifs = notifsData ?? [];
  const userIds = Array.from(new Set(notifs.map((n) => n.user_id).filter(Boolean) as string[]));

  let usersMap: Record<string, { email: string; full_name: string | null }> = {};
  if (userIds.length > 0) {
    const { data: users } = await sb
      .from("user_profiles")
      .select("id, email, full_name")
      .in("id", userIds);
    usersMap = Object.fromEntries(
      (users ?? []).map((u) => [u.id, u]),
    );
  }

  return notifs.map((n) => ({
    id: n.id,
    user_id: n.user_id,
    user_email: usersMap[n.user_id]?.email ?? null,
    user_name: usersMap[n.user_id]?.full_name ?? null,
    type: n.type,
    title: n.title,
    body: n.body,
    read: n.read,
    meta: n.meta as Record<string, unknown> | null,
    created_at: n.created_at,
  }));
}

export default async function NotificationsAdminPage() {
  const notifs = await load();
  return <NotificationsClient initialNotifs={notifs} />;
}
