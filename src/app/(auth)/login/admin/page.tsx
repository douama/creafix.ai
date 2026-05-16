import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { Shield, Lock } from "lucide-react";

export const metadata = {
  title: "Admin · CreaFix AI",
  description: "Connexion réservée aux administrateurs CreaFix AI.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Card className="border-rose-500/30 bg-gradient-to-br from-rose-500/[0.06] via-card/60 to-card/60 backdrop-blur-2xl shadow-2xl shadow-rose-500/10">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-500/20 to-rose-500/5">
          <Shield className="h-5 w-5 text-rose-500 dark:text-rose-300" />
        </div>
        <div>
          <CardTitle className="font-display text-2xl">Admin Panel</CardTitle>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Accès réservé aux administrateurs CreaFix AI
          </p>
        </div>
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
          <Lock className="h-2.5 w-2.5" />
          Authentification stricte
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <AdminLoginForm />
        <div className="pt-1 text-center text-xs text-muted-foreground">
          Tu es créateur ?{" "}
          <a href="/login" className="text-violet-300 hover:underline">
            Connexion utilisateur →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
