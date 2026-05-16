import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata = {
  title: "Admin · CreaFix AI",
  description: "Connexion réservée aux administrateurs CreaFix AI.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
