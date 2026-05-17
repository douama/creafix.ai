import { type CurrencyCode } from "@/lib/pricing";

/**
 * Résout la devise courante côté serveur.
 * Tarification unifiée en USD pour tous les marchés.
 */
export async function getCurrency(): Promise<CurrencyCode> {
  return "USD";
}
