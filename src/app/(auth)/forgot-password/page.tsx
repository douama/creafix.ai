import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Mot de passe oublié · CreaFix AI",
  description: "Reçois un lien pour réinitialiser ton mot de passe CreaFix AI.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
