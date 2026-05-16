import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Affiliate System"
      description="Programme parrainage créateurs africains"
      features={[
        "Création commissions custom (% ou flat fee)",
        "Tracking referrals par code + UTM",
        "Payouts mensuels (Wave, Orange Money, Stripe)",
        "Leaderboard top affiliates par pays",
      ]}
    />
  );
}
