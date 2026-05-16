import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Payments Management"
      description="Stripe + Wave + Orange Money + MTN + PayPal"
      features={[
        "Tous les paiements (succeeded / pending / failed / refunded)",
        "Refunds, gestion litiges, retry webhooks",
        "Coupons promo + churn analytics",
        "Reconciliation cross-provider (Stripe vs CinetPay vs PayDunya)",
      ]}
    />
  );
}
