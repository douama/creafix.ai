"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Lock, Mail, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || password.length < 6) {
      toast.error("Email et mot de passe (min. 6 caractères) requis");
      return;
    }
    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Tente la connexion
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInErr) throw signInErr;
      if (!signInData.user) throw new Error("Auth failed");

      // 2. Vérifie le rôle ADMIN via RPC is_admin
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: isAdmin, error: rpcErr } = await (supabase.rpc as any)("is_admin", {
        p_user_id: signInData.user.id,
      });

      if (rpcErr) {
        await supabase.auth.signOut();
        throw new Error("Impossible de vérifier le rôle admin");
      }

      if (!isAdmin) {
        // User valide mais pas admin → sign out immédiat
        await supabase.auth.signOut();
        toast.error("Accès refusé · Ce compte n'a pas les droits administrateur", {
          description: "Utilise /login pour la connexion utilisateur normale.",
        });
        setLoading(false);
        return;
      }

      // 3. Success
      toast.success("Bienvenue, administrateur 🛡");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      const msg = e?.message ?? "Échec de la connexion";
      // Messages plus user-friendly
      if (msg.toLowerCase().includes("invalid login")) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.error(msg);
      }
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Email administrateur
        </label>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="admin@creafix.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Mot de passe
        </label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type={showPwd ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            autoComplete="current-password"
            className="pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPwd ? "Cacher" : "Afficher"}
          >
            {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !email || password.length < 6}
        className="h-11 w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-rose-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Vérification…
          </>
        ) : (
          <>
            <ShieldAlert className="mr-2 h-4 w-4" />
            Accéder au panneau admin
          </>
        )}
      </Button>

      <p className="pt-1 text-center text-[11px] text-muted-foreground">
        🔒 Toutes les actions admin sont tracées dans <code className="rounded bg-background/60 px-1">audit_logs</code>
      </p>
    </form>
  );
}
