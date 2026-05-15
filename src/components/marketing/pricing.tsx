import { getCurrency } from "@/lib/currency-server";
import { PricingTable } from "./pricing-table";

/**
 * Server Component : résout la devise via cookies/IP côté serveur,
 * puis délègue le rendu au client component <PricingTable>.
 */
export async function Pricing() {
  const currency = await getCurrency();
  return <PricingTable currency={currency} />;
}
