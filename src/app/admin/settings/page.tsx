import { supabaseAdmin } from "@/lib/supabase/admin";
import { ModelsClient, type ModelRow } from "./models-client";

export const dynamic = "force-dynamic";

async function load(): Promise<ModelRow[]> {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("ai_model_configs")
    .select("*")
    .order("provider");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any;
}

export default async function ModelsSettingsPage() {
  const models = await load();
  return <ModelsClient initialModels={models} />;
}
