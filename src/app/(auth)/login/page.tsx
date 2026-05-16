import { CfxAuthForm } from "@/components/auth/cfx-auth-form";

export const metadata = {
  title: "Connexion · CreaFix AI",
  description: "Connecte-toi à ton dashboard CreaFix AI.",
};

export default function LoginPage() {
  return <CfxAuthForm mode="login" />;
}
