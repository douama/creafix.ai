"use client";

import { useEffect, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Loader2, Lock, X } from "lucide-react";

/**
 * Modal Stripe Elements — formulaire de carte inline (au lieu du redirect
 * vers la Stripe Checkout hosted page).
 *
 * Flow :
 *   1. Parent fetch POST /api/checkout/stripe/intent → { clientSecret, publishableKey, paymentId }
 *   2. Parent passe ces 3 valeurs au modal qui charge Stripe.js + monte <Elements>
 *   3. User saisit sa carte dans <PaymentElement> et clique "Payer"
 *   4. stripe.confirmPayment() avec return_url → succès → redirect /dashboard/billing
 */
type Props = {
  open: boolean;
  onClose: () => void;
  clientSecret: string;
  publishableKey: string;
  paymentId: string;
  amount: number;
  currency: string;
  returnUrl: string;
};

export function StripePaymentModal(props: Props) {
  if (!props.open) return null;
  return <ModalInner {...props} />;
}

function ModalInner({ open, onClose, clientSecret, publishableKey, paymentId, amount, currency, returnUrl }: Props) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stripe-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-card/80 hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-border/60 p-5">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <h2 id="stripe-modal-title" className="font-display text-base font-bold tracking-tight">
              Paiement sécurisé · Stripe
            </h2>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Tu vas payer <b className="text-foreground tabular-nums">{amount} {currency}</b>.
            Aucune donnée carte stockée chez nous.
          </p>
        </div>

        <div className="p-5">
          {stripePromise ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#EC4899",
                    borderRadius: "10px",
                    fontFamily: "system-ui, sans-serif",
                  },
                },
              }}
            >
              <PaymentForm onClose={onClose} returnUrl={returnUrl} paymentId={paymentId} />
            </Elements>
          ) : (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentForm({
  onClose,
  returnUrl,
  paymentId,
}: {
  onClose: () => void;
  returnUrl: string;
  paymentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${returnUrl}?status=success&pid=${paymentId}&provider=stripe`,
        },
      });
      // En cas de succès Stripe redirige déjà via return_url ; on n'arrive ici qu'en cas d'erreur.
      if (error) {
        toast.error(error.message ?? "Paiement refusé");
      }
    } catch (e) {
      toast.error((e as Error).message ?? "Erreur paiement");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#FF8A00] px-5 text-sm font-semibold text-white shadow-lg shadow-[#EC4899]/30 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirmation…
          </>
        ) : (
          <>
            <Lock className="h-3.5 w-3.5" />
            Payer maintenant
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="w-full text-center text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        Annuler
      </button>
    </form>
  );
}
