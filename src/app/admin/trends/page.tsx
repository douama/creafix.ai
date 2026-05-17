import { supabaseAdmin } from "@/lib/supabase/admin";
import { TrendsClient, type TrendRow } from "./trends-client";

export const dynamic = "force-dynamic";

async function load(): Promise<TrendRow[]> {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("trends")
    .select("*")
    .order("country")
    .order("momentum", { ascending: false })
    .limit(500);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any;
}

export default async function TrendsAdminPage() {
  const trends = await load();
  return <TrendsClient initialTrends={trends} />;
}
