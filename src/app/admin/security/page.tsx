import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="Security Center"
      description="Audit logs, RBAC, 2FA, IP whitelist"
      features={[
        "Audit logs : qui a fait quoi quand (tous les admins)",
        "RBAC granulaire (SUPER_ADMIN / MODERATOR / SUPPORT / ANALYST)",
        "2FA enforcement pour les admins",
        "IP whitelist + session monitoring + suspicious activity alerts",
      ]}
    />
  );
}
