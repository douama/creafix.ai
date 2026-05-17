import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { invalidateSecretCache, getAllKeyNames } from "@/lib/payments/secrets";

type ProviderId = "STRIPE" | "PAYPAL" | "CINETPAY" | "FLUTTERWAVE" | "PAYDUNYA";
const VALID_PROVIDERS: ProviderId[] = ["STRIPE", "PAYPAL", "CINETPAY", "FLUTTERWAVE", "PAYDUNYA"];

/**
 * POST /api/admin/payment-secrets
 * Body : { provider, key_name, value }
 * Auth : SUPER_ADMIN strict (vérifié par la RPC SECURITY DEFINER côté DB).
 * Le chiffrement est fait par Supabase Vault.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    provider?: string; key_name?: string; value?: string;
  } | null;

  if (!body?.provider || !body.key_name || !body.value) {
    return NextResponse.json({ error: "provider, key_name, value requis" }, { status: 400 });
  }

  if (!VALID_PROVIDERS.includes(body.provider as ProviderId)) {
    return NextResponse.json({ error: `Provider invalide : ${body.provider}` }, { status: 400 });
  }
  if (!getAllKeyNames(body.provider as ProviderId).includes(body.key_name)) {
    return NextResponse.json(
      { error: `Clé "${body.key_name}" invalide pour ${body.provider}` },
      { status: 400 },
    );
  }
  // PAYDUNYA_MODE est un toggle "live"/"test" (4 chars) — exempt de la règle min-8.
  // Les autres champs sont des secrets API → min 8 chars pour bloquer les typos.
  const isModeToggle = body.key_name === "PAYDUNYA_MODE";
  if (!isModeToggle && body.value.length < 8) {
    return NextResponse.json({ error: "Clé trop courte (min 8 caractères)" }, { status: 400 });
  }
  if (isModeToggle && body.value !== "live" && body.value !== "test") {
    return NextResponse.json({ error: "PAYDUNYA_MODE doit être exactement 'live' ou 'test'" }, { status: 400 });
  }

  // Auth utilisateur (la RPC re-vérifie SUPER_ADMIN strict côté DB)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)("set_provider_secret", {
    p_provider: body.provider,
    p_key_name: body.key_name,
    p_value: body.value,
  });

  if (error) {
    // Distingue les erreurs perm (403) des erreurs validation/DB (500)
    const msg = error.message ?? "Échec";
    const isAuthErr = msg.includes("SUPER_ADMIN");
    return NextResponse.json(
      { error: msg },
      { status: isAuthErr ? 403 : 500 },
    );
  }

  // Invalide le cache server-side pour forcer re-fetch sur prochain checkout
  invalidateSecretCache(body.provider as ProviderId, body.key_name);

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/admin/payment-secrets?provider=STRIPE&key_name=STRIPE_SECRET_KEY
 */
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const keyName = url.searchParams.get("key_name");

  if (!provider || !keyName) {
    return NextResponse.json({ error: "provider + key_name requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)("delete_provider_secret", {
    p_provider: provider,
    p_key_name: keyName,
  });

  if (error) {
    const msg = error.message ?? "Échec";
    return NextResponse.json({ error: msg }, { status: msg.includes("SUPER_ADMIN") ? 403 : 500 });
  }

  invalidateSecretCache(provider as ProviderId, keyName);
  return NextResponse.json({ ok: true });
}
