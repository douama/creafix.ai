import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Content Moderation"
      description="Détection NSFW, spam, fake engagement, contenus interdits"
      features={[
        "OpenAI Moderation + Gemini Moderation en parallèle",
        "Queue de validation manuelle (Approve / Reject / Ban)",
        "Auto-flag des accounts suspects",
        "Logs des violations + actions admin",
      ]}
    />
  );
}
