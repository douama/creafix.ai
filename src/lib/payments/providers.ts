/**
 * Couche d'abstraction paiements.
 *
 * Stripe / PayPal pour l'international.
 * PayDunya / CinetPay comme agrégateurs Mobile Money :
 *   - Wave, Orange Money, MTN MoMo, Moov Money, Free Money
 * Permet d'avoir une seule intégration côté code pour 7 méthodes locales.
 */

export type PaymentProvider =
  | "stripe"
  | "paypal"
  | "paydunya" // agrégateur : Wave + OM + Moov + Free + MTN
  | "cinetpay" // agrégateur : OM + MTN + Moov + Wave (CI, CM, SN, ML, BF)
  | "wave"     // direct
  | "orange_money"
  | "mtn_momo";

export interface CheckoutInput {
  userId: string;
  amount: number;
  currency: "XOF" | "XAF" | "NGN" | "GHS" | "ZAR" | "MAD" | "USD" | "EUR";
  description: string;
  successUrl: string;
  cancelUrl: string;
  provider: PaymentProvider;
  customerPhone?: string; // requis pour mobile money
}

export interface CheckoutResult {
  redirectUrl: string;
  externalId: string;
}

export async function createCheckout(_input: CheckoutInput): Promise<CheckoutResult> {
  // TODO en prod :
  // - stripe.checkout.sessions.create(...)
  // - paydunya.invoice.create(...)
  // - cinetpay.payment.init(...)
  // - wave / orange / mtn : APIs directes ou via PayDunya
  throw new Error("payments.createCheckout: provider non configuré. Renseigne tes clés dans .env");
}

export async function handleWebhook(_provider: PaymentProvider, _body: unknown, _signature: string) {
  // TODO : vérification signature + idempotence + mise à jour Subscription
  return { ok: true };
}
