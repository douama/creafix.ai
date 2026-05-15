import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Client Supabase ADMIN (service_role) — contourne RLS.
 *
 * À utiliser EXCLUSIVEMENT côté serveur (Route Handlers, Server Actions).
 * NE JAMAIS exposer le service_role au browser.
 *
 * Cas d'usage :
 *   - Webhooks paiements (insertions cross-user)
 *   - Crons d'audits batch
 *   - Backfill / opérations administratives
 */
let _adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function supabaseAdmin() {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase admin: SUPABASE_SERVICE_ROLE_KEY et NEXT_PUBLIC_SUPABASE_URL doivent être définis.",
    );
  }

  _adminClient = createClient<Database>(url, key, {
    db: { schema: "monetiq" as "public" },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return _adminClient;
}
