import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Users Management"
      description="Gestion complète des utilisateurs CreaFix AI"
      features={[
        "Table paginée + filtres (plan, pays, role, status)",
        "Actions bulk : ban, suspend, reset credits IA, upgrade plan",
        "Drill-down profil → historique audits + paiements + comptes sociaux",
        "Export CSV des users actifs/inactifs",
      ]}
    />
  );
}
