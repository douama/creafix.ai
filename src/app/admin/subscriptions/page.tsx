import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Subscriptions"
      description="Plans FREE / CREATOR / PRO / AGENCY"
      features={[
        "MRR live + cohortes mensuelles",
        "Churn / LTV / CAC par plan",
        "Upgrade / downgrade / cancel manuels",
        "Custom AGENCY plans (multi-clients)",
      ]}
    />
  );
}
