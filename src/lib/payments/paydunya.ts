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
  const master = await getSecret("PAYDUNYA", "PAYDUNYA_MASTER_KEY");
  if (!master) return null;

  // Toggle MODE explicite ("live"/"test"). Défaut : "live".
  const modeRaw = await getSecret("PAYDUNYA", "PAYDUNYA_MODE");
  const mode: Mode = modeRaw === "test" ? "test" : "live";

  // Pioche le trio (Private Key + Token) correspondant au mode actif.
  // En live : PAYDUNYA_PRIVATE_KEY + PAYDUNYA_TOKEN
  // En test : PAYDUNYA_PRIVATE_KEY_TEST + PAYDUNYA_TOKEN_TEST
  const suffix = mode === "test" ? "_TEST" : "";
  const [privateKey, token] = await Promise.all([
    getSecret("PAYDUNYA", `PAYDUNYA_PRIVATE_KEY${suffix}`),
    getSecret("PAYDUNYA", `PAYDUNYA_TOKEN${suffix}`),
  ]);
  if (!privateKey || !token) return null;

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

/* ──────────────────────────────────────────────────────────────────
 * SOFTPAY — paiement direct mobile money (sans redirect hosted page)
 * Doc : https://paydunya.com/developers#paiement-sur-place-softpay
 *
 * Chaque wallet a son endpoint dédié sous /api/v1/softpay/{slug}.
 * Phone format : sans + ni espaces (ex: "770000000" pour le Sénégal).
 * ────────────────────────────────────────────────────────────────── */

export type WalletId =
  | "WAVE_SN"
  | "ORANGE_SN"
  | "FREE_SN"
  | "EXPRESSO_SN"
  | "ORANGE_CI"
  | "MTN_CI"
  | "MOOV_CI";

const WALLET_SLUGS: Record<WalletId, string> = {
  WAVE_SN:     "wave-senegal",
  ORANGE_SN:   "new-orange-money-senegal", // OTP supprimé, retourne om_url/maxit_url
  FREE_SN:     "free-money-senegal",
  EXPRESSO_SN: "expresso-senegal",
  ORANGE_CI:   "orange-money-ci",
  MTN_CI:      "mtn-ci",
  MOOV_CI:     "moov-ci",
};

export type SoftpayInput = {
  wallet: WalletId;
  token: string;          // invoice token from createInvoice()
  customerName: string;
  customerEmail: string;
  phone: string;          // format local sans + (ex: "770000000")
  otp?: string;           // requis pour Orange Money / Free Money / MTN / Moov
};

export type SoftpayResult =
  | {
      ok: true;
      message: string;
      redirectUrl?: string;
      deepLinks?: { om?: string; maxit?: string };
    }
  | { ok: false; error: string };

/**
 * Charge un wallet mobile money via PayDunya softpay.
 * - Wave : redirect vers wave.com (URL retournée dans `redirectUrl`)
 * - Orange/Free/MTN/Moov : prompt USSD sur le téléphone → status devient "completed"
 */
export async function softpay(input: SoftpayInput): Promise<SoftpayResult> {
  const cfg = await loadConfig();
  if (!cfg) return { ok: false, error: "PayDunya non configuré" };

  const slug = WALLET_SLUGS[input.wallet];
  if (!slug) return { ok: false, error: `Wallet inconnu : ${input.wallet}` };

  // Chaque endpoint a un body unique (préfixé par le nom du wallet).
  // Voir https://paydunya.com/developers#paiement-sur-place-softpay
  let body: Record<string, string>;
  switch (input.wallet) {
    case "WAVE_SN":
      body = {
        wave_senegal_fullName: input.customerName,
        wave_senegal_email: input.customerEmail,
        wave_senegal_phone: input.phone,
        wave_senegal_payment_token: input.token,
      };
      break;
    case "ORANGE_SN":
      // New endpoint: pas d'OTP, retourne om_url/maxit_url pour redirect vers app
      body = {
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        phone_number: input.phone,
        invoice_token: input.token,
      };
      break;
    case "FREE_SN":
      body = {
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        phone_number: input.phone,
        payment_token: input.token,
      };
      break;
    case "EXPRESSO_SN":
      body = {
        expresso_sn_fullName: input.customerName,
        expresso_sn_email: input.customerEmail,
        expresso_sn_phone: input.phone,
        payment_token: input.token,
      };
      break;
    case "ORANGE_CI":
      body = {
        orange_money_ci_customer_fullname: input.customerName,
        orange_money_ci_email: input.customerEmail,
        orange_money_ci_phone_number: input.phone,
        orange_money_ci_otp: input.otp ?? "",
        payment_token: input.token,
      };
      break;
    case "MTN_CI":
      body = {
        mtn_ci_customer_fullname: input.customerName,
        mtn_ci_email: input.customerEmail,
        mtn_ci_phone_number: input.phone,
        payment_token: input.token,
      };
      break;
    case "MOOV_CI":
      body = {
        moov_ci_customer_fullname: input.customerName,
        moov_ci_email: input.customerEmail,
        moov_ci_phone_number: input.phone,
        payment_token: input.token,
      };
      break;
  }

  try {
    const res = await fetch(`${cfg.base}/softpay/${slug}`, {
      method: "POST",
      headers: cfg.headers,
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as {
      success?: boolean;
      message?: string;
      url?: string;        // Wave : URL hosted wave.com — redirect cross-device OK
      om_url?: string;     // Orange Money (new endpoint) : deep-link app OM
      maxit_url?: string;  // Orange Money (new endpoint) : deep-link app Maxit
      response_text?: string;
    };
    if (data.success === false) {
      return { ok: false, error: data.message ?? data.response_text ?? "Échec softpay" };
    }
    // Seul Wave retourne une URL hosted qu'on peut redirect en cross-device.
    // om_url/maxit_url sont des deep-links app utiles seulement sur mobile —
    // on les passe au front qui décide d'afficher un bouton "Ouvrir l'app".
    return {
      ok: true,
      message: data.message ?? "Demande envoyée — confirme sur ton téléphone",
      redirectUrl: data.url,
      deepLinks: data.om_url || data.maxit_url
        ? { om: data.om_url, maxit: data.maxit_url }
        : undefined,
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Wallets disponibles selon le préfixe du numéro de téléphone. */
export function walletsForPhone(phone: string): WalletId[] {
  const trimmed = phone.replace(/[\s+]/g, "");
  if (trimmed.startsWith("221")) return ["WAVE_SN", "ORANGE_SN", "FREE_SN", "EXPRESSO_SN"];
  if (trimmed.startsWith("225")) return ["ORANGE_CI", "MTN_CI", "MOOV_CI"];
  // Par défaut on propose les wallets SN les plus communs
  return ["WAVE_SN", "ORANGE_SN", "FREE_SN", "EXPRESSO_SN"];
}

