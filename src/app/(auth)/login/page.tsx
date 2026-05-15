import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <Card className="border-border bg-card/60 backdrop-blur-2xl">
      <CardHeader className="space-y-1.5 text-center">
        <CardTitle className="font-display text-2xl">Bon retour 👋</CardTitle>
        <p className="text-sm text-muted-foreground">
          Connecte-toi pour accéder à ton dashboard Monetiq AI.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-violet-300 hover:underline">
            Créer un compte gratuit
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
