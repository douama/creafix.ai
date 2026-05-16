import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Créer un compte · CreaFix AI",
  description: "Crée ton compte CreaFix AI et lance ton premier audit IA en 60 secondes.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
