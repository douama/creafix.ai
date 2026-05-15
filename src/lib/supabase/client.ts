"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Client Supabase pour le browser (Client Components).
 * Utilise la publishable/anon key — protégée par RLS.
 */
export function createClient() {
  // Note : types sous clé `public` pour l'inférence TS, schéma Postgres réel = `monetiq`.
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "monetiq" as "public" },
    },
  );
}
