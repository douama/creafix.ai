import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSecret } from "@/lib/payments/secrets";
import { confirmInvoice } from "@/lib/payments/paydunya";

/**
 * PayDunya IPN (callback_url) — double-vérification avec re-confirm API.
 *
 * PayDunya signe le payload avec SHA512(PAYDUNYA_MASTER_KEY) → champ `hash`.
 * On vérifie le hash puis on re-confirme via l'API officielle (source de vérité).
 *
 * Le payload est en form-urlencoded (pas JSON). Champs utiles :
 *   data[invoice][token], data[status], hash, data[custom_data][payment_id]
 *
 * Doc : https://paydunya.com/developers#mettre-en-place-l-ipn-paydunya
 */
export async function POST(request: Request) {
  const masterKey = await getSecret("PAYDUNYA", "PAYDUNYA_MASTER_KEY");
  if (!masterKey) {
    return NextResponse.json({ error: "PayDunya non configuré" }, { status: 503 });
  }

  let payload: Record<string, unknown> = {};
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  } else {
    const form = await request.formData();
    for (const [k, v] of form.entries()) {
      // PayDunya envoie certains champs en JSON sérialisé dans le form-data
      const str = v.toString();
      if (str.startsWith("{") || str.startsWith("[")) {
        try {
          payload[k] = JSON.parse(str);
          continue;
        } catch {
          /* fallthrough */
        }
      }
      payload[k] = str;
    }
  }

  const data = (payload.data ?? {}) as {
    invoice?: { token?: string; total_amount?: number };
    status?: string;
    custom_data?: { payment_id?: string };
  };
  const receivedHash = payload.hash ? String(payload.hash) : "";
  const token = data.invoice?.token;
  const localPaymentId = data.custom_data?.payment_id;

  if (!token) {
    return NextResponse.json({ error: "invoice.token manquant" }, { status: 400 });
  }

  // ─── 1. Vérification du hash (SHA-512 de la master key) ────────────
  const expectedHash = createHash("sha512").update(masterKey).digest("hex");
  if (receivedHash && receivedHash !== expectedHash) {
    console.error("[paydunya] hash invalide pour token:", token);
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }
  if (!receivedHash) {
    console.warn("[paydunya] webhook reçu sans hash — vérification API only");
  }

  // ─── 2. Re-confirmation via API (source de vérité, anti-replay) ────
  const confirm = await confirmInvoice(token);
  if (!confirm.ok) {
    return NextResponse.json({ error: confirm.error ?? "Confirm failed" }, { status: 502 });
  }

  // ─── 3. Update DB ──────────────────────────────────────────────────
  const sb = supabaseAdmin();
  const updates: Record<string, unknown> = {};
  if (confirm.status === "completed") {
    updates.status = "SUCCEEDED";
    updates.paid_at = new Date().toISOString();
  } else if (confirm.status === "cancelled" || confirm.status === "failed") {
    updates.status = "FAILED";
  }
  // "pending" → on ne touche pas (déjà PENDING)

  if (Object.keys(updates).length > 0) {
    // Préférence : update par notre UUID local (custom_data.payment_id),
    // fallback sur external_id = token PayDunya
    if (localPaymentId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any).update(updates).eq("id", String(localPaymentId));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any).update(updates).eq("external_id", token);
    }
  }

  return NextResponse.json({ received: true });
}
