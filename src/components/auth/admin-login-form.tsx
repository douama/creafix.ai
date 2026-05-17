"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, ShieldAlert, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const disabled = loading || !email || password.length < 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Sign in
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error("Authentification échouée");

      // 2. Vérifie le rôle ADMIN via RPC (cast any : RPC custom non typée)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: isAdmin, error: rpcErr } = await (supabase.rpc as any)(
        "is_admin",
        { p_user_id: data.user.id },
      );

      if (rpcErr) {
        await supabase.auth.signOut();
        throw new Error("Impossible de vérifier les droits administrateur");
      }

      if (!isAdmin) {
        await supabase.auth.signOut();
        toast.error("Accès refusé", {
          description: "Ce compte n'a pas les droits administrateur. Utilise /login pour la connexion utilisateur.",
        });
        return;
      }

      // 3. Success
      toast.success("Bienvenue, administrateur 🛡");
      router.push("/admin");
      router.refresh();
    } catch (e: unknown) {
      const msg = (e as Error)?.message ?? "Échec de la connexion";
      if (msg.toLowerCase().includes("invalid login")) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Title block — severe red theme */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/40 bg-gradient-to-br from-rose-500/20 to-rose-500/5">
            <Shield className="h-4 w-4 text-rose-500 dark:text-rose-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground">
              Accès réservé aux administrateurs
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
          <Lock className="h-2.5 w-2.5" />
          Authentification stricte · email + mot de passe
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Email administrateur
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="admin@creafix.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              className="h-11 pl-9"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Mot de passe
          </label>
          <div className="relative">
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
              className="h-11 pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPwd ? "Cacher" : "Afficher"}
              tabIndex={-1}
            >
              {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={disabled}
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
      </form>

      {/* Audit log warning */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3 text-[11px] text-muted-foreground">
        <p>
          🔒 Toutes les actions admin sont tracées dans{" "}
          <code className="rounded bg-background/60 px-1 font-mono">audit_logs</code>{" "}
          (IP, user-agent, timestamp).
        </p>
      </div>

      {/* Switch to user login */}
      <div className="border-t border-border/60 pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Tu n&apos;es pas administrateur ?{" "}
          <Link href="/login" className="text-violet-300 hover:underline">
            Connexion utilisateur →
          </Link>
        </p>
      </div>
    </div>
  );
}
