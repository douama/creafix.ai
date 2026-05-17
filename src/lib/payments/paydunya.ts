/**
 * PayDunya REST client — Checkout Invoice + IPN verification.
 *
 * Doc : https://paydunya.com/developers
 * Endpoints :
 *   - POST {base}/checkout-invoice/create   → returns { token, response_text (invoice_url) }
 *   - GET  {base}/checkout-invoice/confirm/{token} → returns invoice status
 *
 * Headers requis (4) :
 *   PAYDUNYA-MASTER-KEY, PAYDUNYA-PRIVATE-KEY, PAYDUNYA-TOKEN, PAYDUNYA-MODE (live|test)
 *
 * Currency : XOF only (UEMOA).
 */

import { getSecret } from "@/lib/payments/secrets";

type Mode = "live" | "test";

const BASES: Record<Mode, string> = {
  live: "https://app.paydunya.com/api/v1",
  test: "https://app.paydunya.com/sandbox-api/v1",
};

type Headers = {
  "Content-Type": "application/json";
  "PAYDUNYA-MASTER-KEY": string;
  "PAYDUNYA-PRIVATE-KEY": string;
  "PAYDUNYA-TOKEN": string;
  "PAYDUNYA-MODE": Mode;
};

async function loadConfig(): Promise<{ mode: Mode; base: string; headers: Headers } | null> {
  const [master, privateKey, token, modeRaw] = await Promise.all([
    getSecret("PAYDUNYA", "PAYDUNYA_MASTER_KEY"),
    getSecret("PAYDUNYA", "PAYDUNYA_PRIVATE_KEY"),
    getSecret("PAYDUNYA", "PAYDUNYA_TOKEN"),
    getSecret("PAYDUNYA", "PAYDUNYA_MODE"),
  ]);
  if (!master || !privateKey || !token) return null;

  // 1. Si PAYDUNYA_MODE est exactement "live" ou "test" → on respecte le choix user
  // 2. Sinon (vide / valeur invalide) → on auto-détecte depuis le préfixe de la Private Key
  //    (PayDunya formate ses clés `live_private_…` ou `test_private_…`)
  let mode: Mode;
  if (modeRaw === "live" || modeRaw === "test") {
    mode = modeRaw;
  } else if (privateKey.startsWith("test_")) {
    mode = "test";
  } else {
    mode = "live";
  }

  return {
    mode,
    base: BASES[mode],
    headers: {
      "Content-Type": "application/json",
      "PAYDUNYA-MASTER-KEY": master,
      "PAYDUNYA-PRIVATE-KEY": privateKey,
      "PAYDUNYA-TOKEN": token,
      "PAYDUNYA-MODE": mode,
    },
  };
}

export type PaydunyaInvoiceInput = {
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl: string;
  cancelUrl: string;
  callbackUrl: string;
  customData?: Record<string, string | number | null>;
};

export type PaydunyaInvoiceResult =
  | { ok: true; token: string; invoiceUrl: string }
  | { ok: false; error: string };

/**
 * Crée une facture PayDunya et renvoie l'URL de paiement à afficher au user.
 * https://paydunya.com/developers#creer-une-facture
 */
export async function createInvoice(input: PaydunyaInvoiceInput): Promise<PaydunyaInvoiceResult> {
  const cfg = await loadConfig();
  if (!cfg) return { ok: false, error: "PayDunya non configuré" };

  const body = {
    invoice: {
      total_amount: Math.round(input.amount),
      description: input.description,
    },
    store: {
      name: "CreaFix AI",
      tagline: "AI Revenue OS for African Creators",
      website_url: "https://creafix-ai.vercel.app",
    },
    custom_data: {
      user_email: input.customerEmail,
      ...(input.customerPhone ? { user_phone: input.customerPhone } : {}),
      ...(input.customData ?? {}),
    },
    actions: {
      cancel_url: input.cancelUrl,
      return_url: input.returnUrl,
      callback_url: input.callbackUrl,
    },
  };

  try {
    const res = await fetch(`${cfg.base}/checkout-invoice/create`, {
      method: "POST",
      headers: cfg.headers,
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as {
      response_code?: string;
      response_text?: string;
      token?: string;
      description?: string;
    };
    if (data.response_code !== "00" || !data.token || !data.response_text) {
      return { ok: false, error: data.response_text ?? data.description ?? "PayDunya init échouée" };
    }
    return { ok: true, token: data.token, invoiceUrl: data.response_text };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export type PaydunyaConfirmResult = {
  ok: boolean;
  status: "completed" | "pending" | "cancelled" | "failed";
  rawStatus?: string;
  amount?: number;
  customData?: Record<string, unknown>;
  error?: string;
};

/**
 * Vérifie le statut d'une facture par son token.
 * https://paydunya.com/developers#confirmer-le-statut-dune-facture
 *
 * Utilisé par le webhook IPN comme source de vérité (anti-replay) :
 * le webhook seul ne suffit pas — on re-confirme via cette API.
 */
export async function confirmInvoice(token: string): Promise<PaydunyaConfirmResult> {
  const cfg = await loadConfig();
  if (!cfg) return { ok: false, status: "failed", error: "PayDunya non configuré" };

  try {
    const res = await fetch(`${cfg.base}/checkout-invoice/confirm/${encodeURIComponent(token)}`, {
      method: "GET",
      headers: cfg.headers,
    });
    const data = (await res.json()) as {
      response_code?: string;
      response_text?: string;
      status?: string;
      invoice?: { total_amount?: number };
      custom_data?: Record<string, unknown>;
    };
    if (data.response_code !== "00") {
      return { ok: false, status: "failed", error: data.response_text ?? "Confirm failed" };
    }
    const raw = String(data.status ?? "").toLowerCase();
    const status =
      raw === "completed"
        ? "completed"
        : raw === "pending"
          ? "pending"
          : raw === "cancelled"
            ? "cancelled"
            : "failed";
    return {
      ok: true,
      status,
      rawStatus: raw,
      amount: data.invoice?.total_amount,
      customData: data.custom_data,
    };
  } catch (e) {
    return { ok: false, status: "failed", error: (e as Error).message };
  }
}

export async function isConfigured(): Promise<boolean> {
  const cfg = await loadConfig();
  return cfg !== null;
}
