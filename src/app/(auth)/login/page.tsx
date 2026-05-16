import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Connexion · CreaFix AI",
  description: "Connecte-toi à ton dashboard CreaFix AI.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
