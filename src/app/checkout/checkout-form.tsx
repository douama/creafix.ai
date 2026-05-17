"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Lock, CreditCard, Smartphone, Globe2, Loader2, ArrowRight } from "lucide-react";
import type { PaymentProviderId } from "@/lib/payments/providers";
import { StripePaymentModal } from "./stripe-payment-modal";

type Provider = {
  id: PaymentProviderId;
  label: string;
  description: string;
  enabled: boolean;
  zones: string[];
  methods: string[];
  color: string;
  emoji: string;
};

type Plan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_monthly_usd: number;
  price_yearly_usd: number | null;
  features: string[];
  credits_included: number;
};

/** Conversion approximative USD → devise locale (utilisée pour CinetPay, Flutterwave, PayDunya). */
const CURRENCY_MAP: Record<PaymentProviderId, { currency: string; usdRate: number; mobileMoneyHint?: boolean }> = {
  STRIPE:       { currency: "USD", usdRate: 1 },
  PAYPAL:       { currency: "USD", usdRate: 1 },
  CINETPAY:     { currency: "XOF", usdRate: 600, mobileMoneyHint: true }, // arrondi multiple de 5
  FLUTTERWAVE:  { currency: "NGN", usdRate: 1500, mobileMoneyHint: true },
  PAYDUNYA:     { currency: "XOF", usdRate: 600, mobileMoneyHint: true },
};

const PROVIDER_META: Record<PaymentProviderId, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; tagline: string }> = {
  STRIPE:      { icon: CreditCard, tagline: "Carte Visa / Mastercard / Amex" },
  PAYPAL:      { icon: Globe2,     tagline: "Compte PayPal ou carte" },
  CINETPAY:    { icon: Smartphone, tagline: "Orange Money · MTN · Moov · Wave" },
  FLUTTERWAVE: { icon: Smartphone, tagline: "M-Pesa · MTN · USSD · Banque" },
  PAYDUNYA:    { icon: Smartphone, tagline: "Wave · Orange · Free · MTN · Moov" },
};

export function CheckoutForm({
  plan, amount, period, providers, userEmail,
}: {
  plan: Plan;
  amount: number;
  period: "month" | "year";
  providers: Provider[];
  userEmail: string;
}) {
  const [selected, setSelected] = useState<PaymentProviderId | null>(null);
  const [phone, setPhone] = useState("");
  const [pending, startTransition] = useTransition();

  // ── Modal Stripe Elements (carte inline) ──
  const [stripeModal, setStripeModal] = useState<{
    clientSecret: string;
    publishableKey: string;
    paymentId: string;
    amount: number;
    currency: string;
  } | null>(null);

  // Affiche seulement les providers actifs (clés API configurées dans Vault)
  const activeProviders = providers.filter((p) => p.enabled);

  function startCheckout() {
    if (!selected) return;
    const cfg = CURRENCY_MAP[selected];
    if (cfg.mobileMoneyHint && !phone.trim()) {
      toast.error("Numéro de téléphone requis pour Mobile Money");
      return;
    }

    // Conversion USD → currency locale
    let convertedAmount = amount * cfg.usdRate;
    if (cfg.currency === "XOF" || cfg.currency === "XAF") {
      convertedAmount = Math.ceil(convertedAmount / 5) * 5;
    } else {
      convertedAmount = Math.round(convertedAmount);
    }

    const description = `CreaFix AI · Plan ${plan.name} (${period === "year" ? "annuel" : "mensuel"})`;

    startTransition(async () => {
      try {
        // ── Stripe : flow inline Elements (modal carte) ──
        if (selected === "STRIPE") {
          const res = await fetch("/api/checkout/stripe/intent", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              amount: convertedAmount,
              currency: cfg.currency,
              description,
              planId: plan.id,
              customerEmail: userEmail,
            }),
          });
          const j = await res.json();
          if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
          setStripeModal({
            clientSecret: j.clientSecret,
            publishableKey: j.publishableKey,
            paymentId: j.paymentId,
            amount: convertedAmount,
            currency: cfg.currency,
          });
          return;
        }

        // ── Autres providers : redirect vers la hosted page ──
        const endpoint = `/api/checkout/${selected.toLowerCase()}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            amount: convertedAmount,
            currency: cfg.currency,
            description,
            planId: plan.id,
            customerEmail: userEmail,
            customerPhone: phone || undefined,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
        if (j.url) {
          window.location.href = j.url;
        } else {
          throw new Error("URL de checkout absente");
        }
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec checkout");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm backdrop-blur md:p-6">
      <div className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5 text-emerald-500" />
        <h2 className="font-display text-lg font-bold tracking-tight">
          Choisis ton moyen de paiement
        </h2>
      </div>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Paiement 100% sécurisé. Aucune carte stockée chez nous.
      </p>

      {/* Provider grid — seulement les providers actifs (clés API configurées) */}
      {activeProviders.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
          Aucun moyen de paiement disponible pour l&apos;instant. Reviens plus tard.
        </div>
      ) : (
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {activeProviders.map((p) => {
            const Icon = PROVIDER_META[p.id].icon;
            const tagline = PROVIDER_META[p.id].tagline;
            const cfg = CURRENCY_MAP[p.id];
            const isActive = selected === p.id;
            const localAmount = cfg.usdRate === 1
              ? `$${amount}`
              : `${Math.ceil((amount * cfg.usdRate) / (cfg.currency === "XOF" || cfg.currency === "XAF" ? 5 : 1)) * (cfg.currency === "XOF" || cfg.currency === "XAF" ? 5 : 1)} ${cfg.currency}`;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                disabled={pending}
                className={[
                  "group relative overflow-hidden rounded-xl border bg-background/40 p-4 text-left transition-all",
                  isActive
                    ? "border-foreground ring-2 ring-foreground/15"
                    : "border-border hover:border-foreground/30",
                ].join(" ")}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-15"
                  style={{ backgroundColor: p.color }}
                />
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-xl border"
                      style={{ backgroundColor: `${p.color}15`, borderColor: `${p.color}40` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: p.color }} />
                    </div>
                    <div>
                      <div className="font-display text-[14px] font-bold">{p.label}</div>
                      <div className="text-[10.5px] text-muted-foreground leading-tight">{tagline}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                    Dispo
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                  <span className="text-[10.5px] text-muted-foreground">
                    Tu paies en {cfg.currency}
                  </span>
                  <span className="font-display text-[13px] font-bold tabular-nums">
                    {localAmount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Money phone input */}
      {selected && CURRENCY_MAP[selected].mobileMoneyHint && (
        <div className="mt-5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Numéro Mobile Money
          </label>
          <div className="mt-1.5 relative">
            <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+221 77 123 45 67"
              className="h-11 w-full rounded-lg border border-border bg-background/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-foreground/30"
              required
            />
          </div>
          <p className="mt-1.5 text-[10.5px] text-muted-foreground">
            Format international (+code pays). Tu recevras une demande de paiement sur ce numéro.
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={startCheckout}
        disabled={!selected || pending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f92c2c] to-[#f15b25] px-5 text-sm font-semibold text-white shadow-lg shadow-[#f15522]/30 transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Payer maintenant
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10.5px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3 w-3" /> 256-bit TLS
        </span>
        <span>·</span>
        <span>Aucune carte stockée</span>
        <span>·</span>
        <span>Annulation 1 clic</span>
      </div>

      {/* Modal Stripe Elements (carte inline) */}
      {stripeModal && (
        <StripePaymentModal
          open={true}
          onClose={() => setStripeModal(null)}
          clientSecret={stripeModal.clientSecret}
          publishableKey={stripeModal.publishableKey}
          paymentId={stripeModal.paymentId}
          amount={stripeModal.amount}
          currency={stripeModal.currency}
          returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/billing`}
        />
      )}
    </div>
  );
}
