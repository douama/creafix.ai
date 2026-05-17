"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Lock, Smartphone, Loader2, ArrowRight, Info } from "lucide-react";
import type { PaymentProviderId } from "@/lib/payments/providers";
import { formatPrice, type CurrencyCode } from "@/lib/pricing";
import { StripePaymentModal } from "./stripe-payment-modal";
import { PaypalPaymentModal } from "./paypal-payment-modal";
import { PaydunyaPaymentModal } from "./paydunya-payment-modal";

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

/* ── Cartes provider : on n'affiche QUE les méthodes, pas le gateway ── */
type ProviderCard = {
  title: string;
  subtitle: string;
  badges?: string[];
  mobileMoneyHint?: boolean;
};

const PROVIDER_CARDS: Record<PaymentProviderId, ProviderCard> = {
  STRIPE: {
    title: "Carte bancaire",
    subtitle: "Visa · Mastercard · Amex",
    badges: ["VISA", "MC", "AMEX"],
  },
  PAYPAL: {
    title: "PayPal",
    subtitle: "Compte PayPal ou carte",
    badges: ["PAYPAL"],
  },
  PAYDUNYA: {
    title: "Mobile Money",
    subtitle: "Wave · Orange · Free · Expresso",
    badges: ["WAVE", "OM", "FREE", "EXPRESSO"],
    mobileMoneyHint: true,
  },
  CINETPAY: {
    title: "Mobile Money",
    subtitle: "Orange · MTN · Moov · Wave",
    badges: ["WAVE", "OM", "MTN", "MOOV"],
    mobileMoneyHint: true,
  },
  FLUTTERWAVE: {
    title: "Banque & Mobile",
    subtitle: "M-Pesa · MTN · USSD · Banque",
    badges: ["MPESA", "MTN"],
    mobileMoneyHint: true,
  },
};

/* ── Logos de marques moyens de paiement (inline SVG, CSP-safe) ── */
function BrandBadge({ kind }: { kind: string }) {
  const base =
    "inline-flex h-5 items-center justify-center rounded-[4px] px-1.5 text-[8.5px] font-extrabold tracking-tight";
  switch (kind) {
    case "VISA":
      return (
        <span
          className={`${base} bg-white text-[#1A1F71] ring-1 ring-black/5`}
          aria-label="Visa"
        >
          VISA
        </span>
      );
    case "MC":
      return (
        <span
          className={`${base} bg-white text-[#EB001B] ring-1 ring-black/5`}
          aria-label="Mastercard"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span className="relative inline-flex h-3 w-5 items-center">
            <span className="absolute left-0 h-3 w-3 rounded-full bg-[#EB001B]" />
            <span className="absolute right-0 h-3 w-3 rounded-full bg-[#F79E1B]" />
          </span>
        </span>
      );
    case "AMEX":
      return (
        <span
          className={`${base} bg-[#2E77BC] text-white tracking-wide`}
          aria-label="American Express"
        >
          AMEX
        </span>
      );
    case "PAYPAL":
      return (
        <span
          className={`${base} bg-white text-[#003087] ring-1 ring-black/5 italic`}
          aria-label="PayPal"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
        >
          <span className="text-[#003087]">Pay</span>
          <span className="text-[#0070BA]">Pal</span>
        </span>
      );
    case "WAVE":
      return (
        <span
          className={`${base} bg-[#1DC8F2] text-white`}
          aria-label="Wave"
        >
          Wave
        </span>
      );
    case "OM":
      return (
        <span
          className={`${base} bg-[#FF7900] text-white`}
          aria-label="Orange Money"
        >
          OM
        </span>
      );
    case "FREE":
      return (
        <span
          className={`${base} bg-[#CD212A] text-white italic`}
          aria-label="Free Money"
        >
          free
        </span>
      );
    case "EXPRESSO":
      return (
        <span
          className={`${base} bg-[#E6007E] text-white`}
          aria-label="Expresso"
        >
          e
        </span>
      );
    case "MTN":
      return (
        <span
          className={`${base} bg-[#FFCC00] text-[#003F87]`}
          aria-label="MTN"
        >
          MTN
        </span>
      );
    case "MOOV":
      return (
        <span
          className={`${base} bg-[#0066CC] text-white`}
          aria-label="Moov"
        >
          MOOV
        </span>
      );
    case "MPESA":
      return (
        <span
          className={`${base} bg-[#00A859] text-white`}
          aria-label="M-Pesa"
        >
          M-Pesa
        </span>
      );
    default:
      return null;
  }
}

export function CheckoutForm({
  plan,
  amount,
  currency,
  xofAmount,
  period,
  providers,
  userEmail,
}: {
  plan: Plan;
  amount: number;
  currency: CurrencyCode;
  xofAmount: number;
  period: "month" | "year";
  providers: Provider[];
  userEmail: string;
}) {
  const [selected, setSelected] = useState<PaymentProviderId | null>(null);
  const [phone, setPhone] = useState("");
  const [pending, startTransition] = useTransition();

  const [stripeModal, setStripeModal] = useState<{
    clientSecret: string;
    publishableKey: string;
    paymentId: string;
    amount: number;
    currency: string;
  } | null>(null);

  const [paypalModal, setPaypalModal] = useState<{
    orderId: string;
    paymentId: string;
    clientId: string;
    currency: string;
    env: "sandbox" | "production";
    amount: number;
  } | null>(null);

  const [paydunyaModal, setPaydunyaModal] = useState<{
    token: string;
    paymentId: string;
    customerName: string;
    customerEmail: string;
    phone: string;
    amount: number;
    currency: string;
  } | null>(null);

  const activeProviders = providers.filter((p) => p.enabled);

  function startCheckout() {
    if (!selected) return;
    const card = PROVIDER_CARDS[selected];
    if (card?.mobileMoneyHint && !phone.trim()) {
      toast.error("Numéro de téléphone requis pour Mobile Money");
      return;
    }

    const description = `CreaFix AI · Plan ${plan.name} (${period === "year" ? "annuel" : "mensuel"})`;

    startTransition(async () => {
      try {
        // ── STRIPE : devise utilisateur, modal Elements inline ──
        if (selected === "STRIPE") {
          const res = await fetch("/api/checkout/stripe/intent", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              amount,
              currency,
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
            amount,
            currency,
          });
          return;
        }

        // ── PAYPAL : devise utilisateur, Smart Buttons popup ──
        if (selected === "PAYPAL") {
          const res = await fetch("/api/checkout/paypal/intent", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              amount,
              currency,
              description,
              planId: plan.id,
            }),
          });
          const j = await res.json();
          if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
          setPaypalModal({
            orderId: j.orderId,
            paymentId: j.paymentId,
            clientId: j.clientId,
            currency: j.currency,
            env: j.env,
            amount,
          });
          return;
        }

        // ── PAYDUNYA : XOF forcé (seule devise UEMOA) ──
        if (selected === "PAYDUNYA") {
          const res = await fetch("/api/checkout/paydunya/intent", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              amount: xofAmount,
              description,
              planId: plan.id,
              customerPhone: phone,
            }),
          });
          const j = await res.json();
          if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
          setPaydunyaModal({
            token: j.token,
            paymentId: j.paymentId,
            customerName: j.customerName,
            customerEmail: j.customerEmail,
            phone,
            amount: xofAmount,
            currency: "XOF",
          });
          return;
        }

        // ── Autres providers : hosted page redirect ──
        const endpoint = `/api/checkout/${selected.toLowerCase()}`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            amount,
            currency,
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

  const selectedCard = selected ? PROVIDER_CARDS[selected] : null;
  const showPaydunyaCurrencyHint = selected === "PAYDUNYA" && currency !== "XOF";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 shadow-[0_8px_30px_-12px_rgba(31,190,175,0.18)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1FBEAF] via-[#EC4899] to-[#FF8A00]" />

      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#1FBEAF]/15 to-[#EC4899]/15 ring-1 ring-[#1FBEAF]/30">
            <Lock className="h-3.5 w-3.5 text-[#1FBEAF]" />
          </span>
          <div>
            <h2 className="font-display text-[17px] font-bold leading-tight tracking-tight md:text-lg">
              Choisis ton moyen de paiement
            </h2>
            <p className="text-[11.5px] text-muted-foreground">
              Paiement chiffré bout-en-bout · Aucune carte stockée
            </p>
          </div>
        </div>

        {/* ─── Grille providers ─── */}
        {activeProviders.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
            Aucun moyen de paiement disponible. Reviens plus tard.
          </div>
        ) : (
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {activeProviders.map((p) => {
              const card = PROVIDER_CARDS[p.id];
              if (!card) return null;
              const isActive = selected === p.id;
              const displayAmount =
                p.id === "PAYDUNYA" ? formatPrice(xofAmount, "XOF") : formatPrice(amount, currency);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  disabled={pending}
                  className={[
                    "group relative overflow-hidden rounded-xl border bg-background/40 p-3.5 text-left transition-all duration-200",
                    isActive
                      ? "border-[#EC4899] shadow-[0_0_0_3px_rgba(236,72,153,0.12)]"
                      : "border-border hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  {/* Halo gradient quand sélectionné */}
                  {isActive && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#EC4899]/25 to-[#FF8A00]/15 blur-2xl"
                    />
                  )}

                  <div className="relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-display text-[14.5px] font-bold leading-tight tracking-tight">
                          {card.title}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">
                          {card.subtitle}
                        </div>
                      </div>
                      {isActive ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EC4899] text-white">
                          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                          Dispo
                        </span>
                      )}
                    </div>

                    {/* Badges méthodes */}
                    {card.badges && card.badges.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1">
                        {card.badges.map((b) => (
                          <BrandBadge key={b} kind={b} />
                        ))}
                      </div>
                    )}

                    {/* Footer : montant local */}
                    <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                      <span className="text-[10.5px] text-muted-foreground">
                        Tu paies
                      </span>
                      <span className="font-display text-[13px] font-extrabold tabular-nums">
                        {displayAmount}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ─── Notice devise XOF pour PayDunya ─── */}
        {showPaydunyaCurrencyHint && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3 text-[11.5px] text-amber-700 dark:text-amber-300">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Mobile Money est facturé en{" "}
              <b>{formatPrice(xofAmount, "XOF")}</b> (Franc CFA UEMOA), équivalent
              à {formatPrice(amount, currency)}.
            </p>
          </div>
        )}

        {/* ─── Mobile Money phone input ─── */}
        {selectedCard?.mobileMoneyHint && (
          <div className="mt-5">
            <label className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Numéro Mobile Money
            </label>
            <div className="relative mt-1.5">
              <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 123 45 67"
                className="h-12 w-full rounded-xl border border-border bg-background/40 pl-10 pr-3 text-sm outline-none transition-all focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/15"
                required
              />
            </div>
            <p className="mt-1.5 text-[10.5px] text-muted-foreground">
              Format international (+code pays). Tu recevras une demande de paiement sur ce numéro.
            </p>
          </div>
        )}

        {/* ─── CTA brand gradient ─── */}
        <button
          type="button"
          onClick={startCheckout}
          disabled={!selected || pending}
          className="group relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#EC4899] via-[#FF8A00] to-[#FF8A00] px-5 text-sm font-bold text-white shadow-[0_10px_30px_-12px_rgba(236,72,153,0.6)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {/* Shimmer effect */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]"
          />
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Payer maintenant
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {/* Trust bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-emerald-500" /> 256-bit TLS
          </span>
          <span className="text-border">·</span>
          <span>Aucune carte stockée</span>
          <span className="text-border">·</span>
          <span>Annulation 1 clic</span>
          <span className="text-border">·</span>
          <span>Conforme PCI-DSS</span>
        </div>
      </div>

      {/* ─── Modals ─── */}
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
      {paypalModal && (
        <PaypalPaymentModal
          open={true}
          onClose={() => setPaypalModal(null)}
          orderId={paypalModal.orderId}
          paymentId={paypalModal.paymentId}
          clientId={paypalModal.clientId}
          currency={paypalModal.currency}
          env={paypalModal.env}
          amount={paypalModal.amount}
          returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/billing`}
        />
      )}
      {paydunyaModal && (
        <PaydunyaPaymentModal
          open={true}
          onClose={() => setPaydunyaModal(null)}
          token={paydunyaModal.token}
          paymentId={paydunyaModal.paymentId}
          customerName={paydunyaModal.customerName}
          customerEmail={paydunyaModal.customerEmail}
          phone={paydunyaModal.phone}
          amount={paydunyaModal.amount}
          currency={paydunyaModal.currency}
          returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/billing`}
        />
      )}
    </div>
  );
}
