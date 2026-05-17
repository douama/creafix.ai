import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getProvidersPublic } from "@/lib/payments/providers";
import { getCurrency } from "@/lib/currency-server";
import {
  CURRENCIES,
  formatPrice,
  getLocalizedAmount,
  slugToPlanKey,
} from "@/lib/pricing";
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

  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=/checkout?plan=${slug}&period=${period}`);

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
          Le plan « {slug} » n&apos;existe pas ou est désactivé.
        </p>
        <Link href="/pricing" className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour aux tarifs
        </Link>
      </div>
    );
  }

  if (Number(plan.price_monthly_usd) === 0) redirect("/dashboard?welcome=free");

  // ─── Devise localisée (IP → cookie → USD) ───
  const currency = await getCurrency();
  const planKey = slugToPlanKey(plan.slug);
  const amount = getLocalizedAmount(planKey, currency, period);

  // PayDunya force XOF (seule devise UEMOA supportée)
  const xofAmount = getLocalizedAmount(planKey, "XOF", period);

  const providers = await getProvidersPublic();
  const currencyConfig = CURRENCIES[currency];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Halo gradient de fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(236,72,153,0.18),transparent_70%),radial-gradient(40%_50%_at_80%_10%,rgba(255,138,0,0.12),transparent_60%)]"
      />
      <div className="container mx-auto max-w-5xl py-8 md:py-14">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Retour aux tarifs
        </Link>

        {/* Header titre */}
        <div className="mt-5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#1FBEAF]/30 bg-[#1FBEAF]/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#1FBEAF]">
            <Sparkles className="h-3 w-3" /> Checkout sécurisé
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
            Active ton plan{" "}
            <span className="bg-gradient-to-r from-[#EC4899] via-[#FF8A00] to-[#FF8A00] bg-clip-text text-transparent">
              {plan.name}
            </span>
          </h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Tarif détecté depuis ta zone : <span className="font-semibold text-foreground">{currencyConfig.label}</span>{" "}
            <span className="text-muted-foreground/80">({currency} {currencyConfig.flag})</span>. Tu peux changer la
            devise depuis la page tarifs.
          </p>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_380px] lg:gap-6">
          {/* ── Colonne gauche : sélecteur providers ── */}
          <CheckoutForm
            plan={plan as PlanRow}
            amount={amount}
            currency={currency}
            xofAmount={xofAmount}
            period={period}
            providers={providers}
            userEmail={user.email ?? ""}
          />

          {/* ── Colonne droite : récap sticky ── */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 shadow-[0_8px_30px_-12px_rgba(236,72,153,0.18)] backdrop-blur-xl">
              {/* Liseré gradient en haut */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1FBEAF] via-[#EC4899] to-[#FF8A00]" />

              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Récapitulatif
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
                  </div>
                </div>

                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                  {plan.name}
                </h2>
                {plan.description && (
                  <p className="mt-1.5 text-[13px] text-muted-foreground">
                    {plan.description}
                  </p>
                )}

                {/* Prix principal */}
                <div className="mt-5 border-y border-border/60 py-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-[28px] font-extrabold leading-none tracking-tight tabular-nums md:text-[32px]">
                      {formatPrice(amount, currency)}
                    </span>
                    <span className="text-[12.5px] text-muted-foreground">
                      / {period === "year" ? "an" : "mois"}
                    </span>
                  </div>
                  {period === "year" && (
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Soit {formatPrice(Math.round(amount / 12), currency)} / mois
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="mt-4 space-y-2 text-[13px]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span>
                      <b className="tabular-nums">
                        {plan.credits_included.toLocaleString("fr-FR")}
                      </b>{" "}
                      crédits IA / {period === "year" ? "an" : "mois"}
                    </span>
                  </li>
                  {plan.features?.slice(0, 6).map((f: string) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Trust signal */}
                <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-[11.5px] text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" /> Annulable en 1 clic
                  </div>
                  <p className="mt-1 text-emerald-700/80 dark:text-emerald-300/80">
                    Aucun engagement. Tu gardes l&apos;accès jusqu&apos;à la fin de la période payée.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
