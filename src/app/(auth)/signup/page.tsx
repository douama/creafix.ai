import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <Card className="border-border bg-card/60 backdrop-blur-2xl">
      <CardHeader className="space-y-1.5 text-center">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
          <Sparkles className="h-3 w-3" /> Audit IA gratuit · sans carte
        </div>
        <CardTitle className="mt-3 font-display text-2xl">
          Crée ton compte CreaFix AI
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          60 secondes pour débloquer ton plan de monétisation.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AuthForm mode="signup" />
        <p className="text-center text-xs text-muted-foreground">
          En continuant, tu acceptes nos{" "}
          <Link href="/legal/terms" className="underline">CGU</Link> et notre{" "}
          <Link href="/legal/privacy" className="underline">politique de confidentialité</Link>.
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Tu as déjà un compte ?{" "}
          <Link href="/login" className="text-violet-300 hover:underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
