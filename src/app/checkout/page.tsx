import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getProvidersPublic } from "@/lib/payments/providers";
import { CheckoutForm } from "./checkout-form";

export const metadata = {
  title: "Checkout · CreaFix AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ plan?: string; period?: "month" | "year" }>;

type PlanRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_monthly_usd: number;
  price_yearly_usd: number | null;
  features: string[];
  credits_included: number;
  active: boolean;
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const slug = (sp.plan ?? "PRO").toUpperCase();
  const period = sp.period === "year" ? "year" : "month";

  // Auth requise
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=/checkout?plan=${slug}&period=${period}`);

  // Lit le plan via admin client
  const admin = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: plan } = await (admin.from("plans_config") as any)
    .select("id, slug, name, description, price_monthly_usd, price_yearly_usd, features, credits_included, active")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!plan) {
    return (
      <div className="container mx-auto max-w-2xl py-20">
        <h1 className="font-display text-2xl font-bold">Plan introuvable</h1>
        <p className="mt-2 text-muted-foreground">
          Le plan « {slug} » n'existe pas ou est désactivé.
        </p>
        <Link href="/pricing" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour aux tarifs
        </Link>
      </div>
    );
  }

  // Free plan : pas de paiement nécessaire, redirige
  if (Number(plan.price_monthly_usd) === 0) redirect("/dashboard?welcome=free");

  const providers = getProvidersPublic();
  const amount = period === "year"
    ? Number(plan.price_yearly_usd ?? plan.price_monthly_usd) * 12
    : Number(plan.price_monthly_usd);

  return (
    <div className="container mx-auto max-w-5xl py-10 md:py-16">
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Retour aux tarifs
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left : provider picker */}
        <CheckoutForm
          plan={plan as PlanRow}
          amount={amount}
          period={period}
          providers={providers}
          userEmail={user.email ?? ""}
        />

        {/* Right : summary */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm backdrop-blur">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Récapitulatif
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
              {plan.name}
            </h2>
            {plan.description && (
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                {plan.description}
              </p>
            )}

            <div className="mt-5 flex items-baseline gap-1.5 border-y border-border py-4">
              <span className="font-display text-3xl font-bold tabular-nums">${amount}</span>
              <span className="text-[13px] text-muted-foreground">
                / {period === "year" ? "an" : "mois"}
              </span>
            </div>

            <ul className="mt-4 space-y-2 text-[13px]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span><b>{plan.credits_included.toLocaleString("fr-FR")}</b> crédits IA / {period === "year" ? "an" : "mois"}</span>
              </li>
              {plan.features?.slice(0, 6).map((f: string) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-[11.5px] text-emerald-700 dark:text-emerald-300">
              ✓ Annulable en 1 clic depuis ton dashboard. Aucun engagement.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
