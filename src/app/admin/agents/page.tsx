import { supabaseAdmin } from "@/lib/supabase/admin";
import { AgentsClient, type AgentRow } from "./agents-client";

export const dynamic = "force-dynamic";

async function load(): Promise<AgentRow[]> {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("ai_agents")
    .select("*")
    .order("category");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any;
}

export default async function AgentsPage() {
  const agents = await load();
  return <AgentsClient initialAgents={agents} />;
}
