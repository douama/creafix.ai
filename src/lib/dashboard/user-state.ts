import { createClient } from "@/lib/supabase/server";

export type UserState = {
  userId: string | null;
  email: string | null;
  fullName: string | null;
  plan: string | null;
  socialAccountsCount: number;
  auditsCount: number;
  paymentsCount: number;
  paymentMethodConfigured: boolean;
  hasData: boolean;
};

/**
 * Renvoie l'état du dashboard pour l'utilisateur courant.
 * Utilisé pour décider d'afficher l'empty state d'onboarding ou les vraies données.
 *
 * `hasData = true` si au moins 1 compte social connecté.
 */
export async function getUserState(): Promise<UserState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      userId: null,
      email: null,
      fullName: null,
      plan: null,
      socialAccountsCount: 0,
      auditsCount: 0,
      paymentsCount: 0,
      paymentMethodConfigured: false,
      hasData: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const [{ data: profile }, { count: socialCount }, { count: auditsCount }, { count: paymentsCount }] =
    await Promise.all([
      sb.from("user_profiles").select("email, full_name, plan").eq("id", user.id).maybeSingle(),
      sb.from("social_accounts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      sb.from("audits").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      sb.from("payments").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]);

  const social = socialCount ?? 0;
  const audits = auditsCount ?? 0;
  const payments = paymentsCount ?? 0;

  return {
    userId: user.id,
    email: profile?.email ?? user.email ?? null,
    fullName: profile?.full_name ?? null,
    plan: profile?.plan ?? "FREE",
    socialAccountsCount: social,
    auditsCount: audits,
    paymentsCount: payments,
    paymentMethodConfigured: payments > 0,
    hasData: social > 0,
  };
}
