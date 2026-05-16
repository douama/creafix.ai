import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Support Tickets"
      description="Inbox tickets + WhatsApp inbound"
      features={[
        "Inbox unifiée (email + WhatsApp + in-app)",
        "Assignation aux agents support (workflows Intercom-style)",
        "SLA tracking + AI auto-replies pour Q faciles",
        "Macros + base de connaissance interne",
      ]}
    />
  );
}
