"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Client Supabase pour le browser (Client Components).
 * Utilise la publishable/anon key — protégée par RLS.
 */
export function createClient() {
  // Redéfinir navigator.locks si l'environnement lève une SecurityError
  if (typeof window !== "undefined" && window.navigator) {
    try {
      Object.defineProperty(window.navigator, "locks", {
        get() {
          return undefined;
        },
        configurable: true,
      });
    } catch (e) {
      // Ignorer si la redéfinition est interdite
    }
  }

  // Note : types sous clé `public` pour l'inférence TS, schéma Postgres réel = `monetiq`.
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "monetiq" as "public" },
    },
  );
}
