import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { ModelsClient, type ModelRow } from "./models-client";

export const metadata = {
  title: "Modèles IA · Settings · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function load(): Promise<ModelRow[]> {
  const sb = supabaseAdmin();
  const { data } = await sb.from("ai_model_configs").select("*").order("provider");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any;
}

export default async function ModelsSettingsPage() {
  // Layout already checks is_admin; this page requires the stricter SUPER_ADMIN.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login/admin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isSuperAdmin } = await (supabase.rpc as any)("is_super_admin", {
    p_user_id: user.id,
  });
  if (!isSuperAdmin) redirect("/admin?error=super_admin_required");

  const models = await load();
  return <ModelsClient initialModels={models} />;
}
