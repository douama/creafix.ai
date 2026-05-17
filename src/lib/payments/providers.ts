/**
 * CreaFix AI — Configuration des providers de paiement.
 *
 * 5 providers supportés :
 *   - STRIPE        : cartes internationales (Visa, MC, Amex)
 *   - PAYPAL        : compte PayPal + cartes via PayPal
 *   - CINETPAY      : Mobile Money zone CFA (Orange, MTN, Moov, Wave) + cartes
 *   - FLUTTERWAVE   : Mobile Money/cards Naira/KES/ZAR (anglophone Africa)
 *   - PAYDUNYA      : Mobile Money UEMOA (Wave, Orange, Free, MTN, Moov, Expresso) + cartes
 *
 * Status :
 *   - enabled=true  : la clé API est set dans l'env
 *   - enabled=false : clé absente, on l'affiche mais le bouton est désactivé
 *
 * Toutes les clés sont SERVER-SIDE only (jamais exposées au browser).
 */

export type PaymentProviderId = "STRIPE" | "PAYPAL" | "CINETPAY" | "FLUTTERWAVE" | "PAYDUNYA";

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

/** Métadonnées statiques des providers (zones, methods, color, etc.). */
const PROVIDER_META: Omit<ProviderConfig, "enabled" | "reason">[] = [
  {
    id: "STRIPE",
    label: "Stripe",
    description: "Cartes Visa, Mastercard, Amex",
    zones: ["Monde"],
    methods: ["Visa", "Mastercard", "Amex"],
    color: "#635BFF",
    emoji: "💳",
  },
  {
    id: "PAYPAL",
    label: "PayPal",
    description: "Compte PayPal ou carte via PayPal",
    zones: ["Monde"],
    methods: ["PayPal", "Carte"],
    color: "#0070BA",
    emoji: "🟦",
  },
  {
    id: "CINETPAY",
    label: "CinetPay",
    description: "Orange Money, MTN MoMo, Moov, Wave, cartes",
    zones: ["🇨🇮", "🇸🇳", "🇨🇲", "🇧🇫", "🇲🇱", "🇹🇬", "🇧🇯", "🇨🇩"],
    methods: ["Orange Money", "MTN MoMo", "Moov", "Wave", "Visa", "Mastercard"],
    color: "#0FAA52",
    emoji: "🟢",
  },
  {
    id: "FLUTTERWAVE",
    label: "Flutterwave",
    description: "Mobile Money + cartes Naira/KES/ZAR",
    zones: ["🇳🇬", "🇰🇪", "🇿🇦", "🇬🇭", "🇺🇬", "🇪🇬"],
    methods: ["M-Pesa", "MTN MoMo", "Carte", "USSD", "Bank Transfer"],
    color: "#F5A623",
    emoji: "🟧",
  },
  {
    id: "PAYDUNYA",
    label: "PayDunya",
    description: "Wave, Orange Money, Free Money, MTN, Moov, Expresso, cartes",
    zones: ["🇸🇳", "🇨🇮", "🇧🇫", "🇲🇱", "🇹🇬", "🇧🇯"],
    methods: ["Wave", "Orange Money", "Free Money", "MTN MoMo", "Moov", "Expresso", "Visa", "Mastercard"],
    color: "#FF6B35",
    emoji: "🟠",
  },
];

/**
 * Server-only ASYNC : lit l'état d'activation depuis Vault (DB) ou env vars.
 * Async parce que getSecret hit Supabase via le client admin.
 */
export async function getProvidersConfig(): Promise<ProviderConfig[]> {
  const { isProviderEnabled, getRequiredKeys } = await import("./secrets");
  const results: ProviderConfig[] = [];
  for (const meta of PROVIDER_META) {
    const enabled = await isProviderEnabled(meta.id);
    const reason = !enabled
      ? `Clé(s) manquante(s) : ${getRequiredKeys(meta.id).join(", ")}`
      : undefined;
    results.push({ ...meta, enabled, reason });
  }
  return results;
}

/** Version publique (sans le champ `reason` qui détaille quelles clés manquent). */
export async function getProvidersPublic() {
  const cfg = await getProvidersConfig();
  return cfg.map(({ reason: _r, ...rest }) => rest);
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
