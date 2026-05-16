import { CfxForgotPasswordForm } from "@/components/auth/cfx-forgot-password";

export const metadata = {
  title: "Mot de passe oublié · CreaFix AI",
  description: "Reçois un lien pour réinitialiser ton mot de passe CreaFix AI.",
};

export default function ForgotPasswordPage() {
  return <CfxForgotPasswordForm />;
}
