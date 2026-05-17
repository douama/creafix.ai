import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { getProvidersConfig } from "@/lib/payments/providers";
import { getKeyDefinitions } from "@/lib/payments/secrets";
import { PaymentSecretsClient, type SecretMeta } from "./payments-secrets-client";

export const metadata = {
  title: "Paiements · Configuration · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPaymentsConfig() {
  // 1. Auth + SUPER_ADMIN strict (lecture des clés = SUPER_ADMIN only)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login/admin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isSuperAdmin } = await (supabase.rpc as any)("is_super_admin", { p_user_id: user.id });
  if (!isSuperAdmin) redirect("/admin?error=super_admin_required");

  // 2. État des providers + liste des secrets configurés (masqués)
  const providers = await getProvidersConfig();
  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: secretsList } = await (sb.rpc as any)("list_provider_secrets");

  const meta: SecretMeta[] = (secretsList ?? []) as SecretMeta[];

  // Map TOUTES les clés (required + optional) par provider pour l'UI
  const providersWithKeys = providers.map((p) => ({
    ...p,
    keyDefs: getKeyDefinitions(p.id),
    configuredKeys: meta.filter((s) => s.provider === p.id),
  }));

  return <PaymentSecretsClient initial={providersWithKeys} />;
}
