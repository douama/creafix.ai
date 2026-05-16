import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Settings"
      description="Configuration globale de la plateforme"
      features={[
        "AI Models : clés API (OpenAI, Claude, Gemini, ElevenLabs, Stability)",
        "Pricing : éditer les plans + grilles tarifaires multi-devises",
        "Branding : logo, couleurs, email templates",
        "Feature flags + maintenance mode",
      ]}
    />
  );
}
