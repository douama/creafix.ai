import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Analytics Center"
      description="KPIs business globaux CreaFix AI"
      features={[
        "MRR / ARR / Churn / CAC / LTV",
        "Conversion funnel (signup → audit → upgrade)",
        "Pays les plus rentables · niches les plus rentables",
        "Cohort retention 30/60/90 jours",
      ]}
    />
  );
}
