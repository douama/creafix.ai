import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Revenue Engine"
      description="Optimisation RPM et détection des fuites de revenus"
      features={[
        "Revenue Leak Scanner global (toutes plateformes)",
        "RPM benchmarks par pays / niche",
        "Estimation lost revenue / opportunités cachées",
        "Recommandations cross-platform (TikTok→YouTube etc.)",
      ]}
    />
  );
}
