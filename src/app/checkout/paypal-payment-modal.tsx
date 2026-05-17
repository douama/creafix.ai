"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { Loader2, Lock, X } from "lucide-react";

/**
 * Modal PayPal Smart Buttons — paiement inline via popup.
 *
 * Flow :
 *   1. Parent POST /api/checkout/paypal/intent → { orderId, paymentId, clientId, env, currency }
 *   2. Parent passe ces valeurs au modal qui rend les <PayPalButtons>
 *   3. User clique PayPal → popup PayPal s'ouvre, login + confirme
 *   4. onApprove → POST /api/checkout/paypal/capture → DB update → redirect billing
 */
type Props = {
  open: boolean;
  onClose: () => void;
  orderId: string;
  paymentId: string;
  clientId: string;
  currency: string;
  env: "sandbox" | "production";
  amount: number;
  returnUrl: string;
};

export function PaypalPaymentModal(props: Props) {
  if (!props.open) return null;
  return <ModalInner {...props} />;
}

function ModalInner({
  open, onClose, orderId, paymentId, clientId, currency, env, amount, returnUrl,
}: Props) {
  const router = useRouter();
  const [capturing, setCapturing] = useState(false);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paypal-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !capturing) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={capturing}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground disabled:opacity-50"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-border/60 p-5">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <h2 id="paypal-modal-title" className="font-display text-base font-bold tracking-tight">
              Paiement sécurisé · PayPal
            </h2>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Tu vas payer <b className="text-foreground tabular-nums">{amount} {currency}</b>.
            Clique sur le bouton PayPal pour ouvrir la fenêtre de connexion.
          </p>
        </div>

        <div className="space-y-4 p-5">
          {capturing && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-card/60 p-3 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-[#0070BA]" />
              <span>Confirmation du paiement…</span>
            </div>
          )}

          <PayPalScriptProvider
            options={{
              clientId,
              currency,
              intent: "capture",
              components: "buttons",
              ...(env === "sandbox" ? { "data-namespace": "paypalSandbox" } : {}),
            }}
          >
            <PayPalButtons
              disabled={capturing}
              style={{
                layout: "vertical",
                color: "gold",
                shape: "pill",
                label: "pay",
                height: 48,
              }}
              // L'order a déjà été créée côté serveur — on la renvoie au SDK
              createOrder={() => Promise.resolve(orderId)}
              onApprove={async () => {
                setCapturing(true);
                try {
                  const res = await fetch("/api/checkout/paypal/capture", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ orderId, paymentId }),
                  });
                  const j = await res.json();
                  if (!res.ok || !j.ok) {
                    throw new Error(j.error ?? "Capture PayPal échouée");
                  }
                  toast.success("Paiement confirmé ✓");
                  router.push(`${returnUrl}?status=success&pid=${paymentId}&provider=paypal`);
                } catch (e) {
                  toast.error((e as Error).message ?? "Erreur PayPal");
                  setCapturing(false);
                }
              }}
              onCancel={() => {
                toast.info("Paiement PayPal annulé");
              }}
              onError={(err) => {
                const msg = (err as unknown as { message?: string })?.message ?? "inconnue";
                toast.error(`Erreur PayPal : ${msg}`);
              }}
            />
          </PayPalScriptProvider>

          <button
            type="button"
            onClick={onClose}
            disabled={capturing}
            className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
