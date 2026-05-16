import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Notifications Center"
      description="Alertes, broadcasts, push notifications"
      features={[
        "Broadcast email / push à tous les users (ou segments)",
        "Templates email (welcome, audit ready, shadowban detected)",
        "WhatsApp + SMS via providers africains",
        "Schedule (cron) + A/B testing copy",
      ]}
    />
  );
}
