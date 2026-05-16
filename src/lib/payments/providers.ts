/**
 * CreaFix AI — Configuration des providers de paiement.
 *
 * 4 providers supportés :
 *   - STRIPE        : cartes internationales (Visa, MC, Amex)
 *   - PAYPAL        : compte PayPal + cartes via PayPal
 *   - CINETPAY      : Mobile Money zone CFA (Orange, MTN, Moov, Wave) + cartes
 *   - FLUTTERWAVE   : Mobile Money/cards Naira/KES/ZAR (anglophone Africa)
 *
 * Status :
 *   - enabled=true  : la clé API est set dans l'env
 *   - enabled=false : clé absente, on l'affiche mais le bouton est désactivé
 *
 * Toutes les clés sont SERVER-SIDE only (jamais exposées au browser).
 */

export type PaymentProviderId = "STRIPE" | "PAYPAL" | "CINETPAY" | "FLUTTERWAVE";

export type ProviderConfig = {
  id: PaymentProviderId;
  label: string;
  description: string;
  enabled: boolean;
  reason?: string;
  zones: string[];
  methods: string[];
  color: string;
  emoji: string;
};

/** Server-only : lit l'état d'activation depuis les env vars. */
export function getProvidersConfig(): ProviderConfig[] {
  return [
    {
      id: "STRIPE",
      label: "Stripe",
      description: "Cartes Visa, Mastercard, Amex",
      enabled: !!process.env.STRIPE_SECRET_KEY,
      reason: !process.env.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY manquante" : undefined,
      zones: ["Monde"],
      methods: ["Visa", "Mastercard", "Amex"],
      color: "#635BFF",
      emoji: "💳",
    },
    {
      id: "PAYPAL",
      label: "PayPal",
      description: "Compte PayPal ou carte via PayPal",
      enabled: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      reason: !(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
        ? "PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET manquantes"
        : undefined,
      zones: ["Monde"],
      methods: ["PayPal", "Carte"],
      color: "#0070BA",
      emoji: "🟦",
    },
    {
      id: "CINETPAY",
      label: "CinetPay",
      description: "Orange Money, MTN MoMo, Moov, Wave, cartes",
      enabled: !!(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID),
      reason: !(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID)
        ? "CINETPAY_API_KEY + CINETPAY_SITE_ID manquantes"
        : undefined,
      zones: ["🇨🇮", "🇸🇳", "🇨🇲", "🇧🇫", "🇲🇱", "🇹🇬", "🇧🇯", "🇨🇩"],
      methods: ["Orange Money", "MTN MoMo", "Moov", "Wave", "Visa", "Mastercard"],
      color: "#0FAA52",
      emoji: "🟢",
    },
    {
      id: "FLUTTERWAVE",
      label: "Flutterwave",
      description: "Mobile Money + cartes Naira/KES/ZAR",
      enabled: !!process.env.FLUTTERWAVE_SECRET_KEY,
      reason: !process.env.FLUTTERWAVE_SECRET_KEY ? "FLUTTERWAVE_SECRET_KEY manquante" : undefined,
      zones: ["🇳🇬", "🇰🇪", "🇿🇦", "🇬🇭", "🇺🇬", "🇪🇬"],
      methods: ["M-Pesa", "MTN MoMo", "Carte", "USSD", "Bank Transfer"],
      color: "#F5A623",
      emoji: "🟧",
    },
  ];
}

/** Version publique (sans le champ `reason` qui révèle quelles env manquent). */
export function getProvidersPublic() {
  return getProvidersConfig().map(({ reason: _r, ...rest }) => rest);
}

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://creafix-ai.vercel.app";

/** Input commun pour tous les checkouts. */
export type CheckoutInput = {
  userId: string;
  amount: number;        // unité monétaire (ex: 29 USD, 18000 XOF)
  currency: string;      // ex: "USD", "XOF", "NGN"
  description: string;
  planId?: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
};

export type CheckoutResult = {
  redirectUrl: string;
  externalId: string;
  paymentId: string; // monetiq.payments.id
};
