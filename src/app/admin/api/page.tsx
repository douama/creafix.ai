import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="API Management"
      description="Clés API, rate limiting, webhooks"
      features={[
        "API keys (sandbox + production) par user",
        "Rate limits par tier (FREE: 60 req/min, PRO: 600, AGENCY: unlimited)",
        "Webhook deliveries log + replay",
        "API usage analytics + facturation overage",
      ]}
    />
  );
}
