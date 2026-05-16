import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="AI Agents Center"
      description="Orchestration des 7 agents IA spécialisés"
      features={[
        "Monetization Agent · Viral Agent · Shadowban Agent",
        "Hook Rewriter · Trend Scanner · Thumbnail · Video Analyzer",
        "Switch provider (Claude / OpenAI / Gemini), fallback, retry",
        "Coûts + token usage par agent (BullMQ queues)",
      ]}
    />
  );
}
