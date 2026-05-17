import { supabaseAdmin } from "@/lib/supabase/admin";
import { UsersClient, type UserRow } from "./users-client";

export const dynamic = "force-dynamic";

async function loadUsers(): Promise<UserRow[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("user_profiles")
    .select("id, email, full_name, role, plan, credits, country, status, created_at, last_seen_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("loadUsers:", error);
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any;
}

export default async function UsersPage() {
  const users = await loadUsers();
  return <UsersClient initialUsers={users} />;
}
