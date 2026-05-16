/**
 * PayPal REST API client — pas de SDK requis.
 * Doc : https://developer.paypal.com/docs/api/overview/
 */

import { getSecret } from "./secrets";

const PAYPAL_BASE = process.env.PAYPAL_ENV === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const id = await getSecret("PAYPAL", "PAYPAL_CLIENT_ID");
  const secret = await getSecret("PAYPAL", "PAYPAL_CLIENT_SECRET");
  if (!id || !secret) throw new Error("PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET manquantes");

  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const { access_token } = await res.json();
  return access_token;
}

export type PaypalOrder = {
  id: string;
  status: string;
  links: { rel: string; href: string; method: string }[];
};

export async function createOrder(args: {
  amount: number;
  currency: string;
  description: string;
  paymentId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<PaypalOrder> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: args.paymentId,
        description: args.description,
        amount: { currency_code: args.currency, value: args.amount.toFixed(2) },
      }],
      application_context: {
        return_url: args.successUrl,
        cancel_url: args.cancelUrl,
        user_action: "PAY_NOW",
        brand_name: "CreaFix AI",
      },
    }),
  });
  if (!res.ok) throw new Error(`PayPal createOrder failed: ${await res.text()}`);
  return res.json();
}

export async function captureOrder(orderId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`PayPal capture failed: ${await res.text()}`);
  return res.json();
}

export async function verifyWebhook(headers: Headers, rawBody: string): Promise<boolean> {
  const webhookId = await getSecret("PAYPAL", "PAYPAL_WEBHOOK_ID");
  if (!webhookId) return false;
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    }),
  });
  if (!res.ok) return false;
  const { verification_status } = await res.json();
  return verification_status === "SUCCESS";
}
