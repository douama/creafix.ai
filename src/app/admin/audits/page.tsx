import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="AI Audits Center"
      description="Stockage et inspection de tous les audits IA"
      features={[
        "Liste de tous les audits (PENDING / RUNNING / COMPLETED / FAILED)",
        "Détail par audit : scores, issues, recommandations, dimensions",
        "Replay d'audit, debug LLM",
        "Anomalies + erreurs IA",
      ]}
    />
  );
}
