"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, Wand2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [magicLink, setMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitDisabled =
    loading || !email || (!magicLink && password.length < 6);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      if (magicLink) {
        const next = mode === "signup" ? "/onboarding" : "/dashboard";
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${next}`,
          },
        });
        if (error) throw error;
        toast.success("Lien envoyé ✓", {
          description: `Vérifie ${email} (et les spams).`,
        });
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté ✓");
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
          },
        });
        if (error) throw error;
        toast.success("Compte créé ✓", {
          description: "Vérifie ton email pour confirmer ton adresse.",
        });
      }
    } catch (e: any) {
      const msg = (e?.message ?? "Échec") as string;
      if (msg.toLowerCase().includes("invalid login")) {
        toast.error("Email ou mot de passe incorrect");
      } else if (msg.toLowerCase().includes("already registered")) {
        toast.error("Un compte existe déjà avec cet email", {
          description: "Essaie de te connecter avec ton mot de passe.",
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          {mode === "login" ? "Bon retour 👋" : "Créer ton compte"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Connecte-toi à ton dashboard CreaFix AI."
            : "Lance ton premier audit IA en 60 secondes. Sans carte bancaire."}
        </p>
      </div>

      {/* OAuth row */}
      <OAuthButtons mode={mode} layout="row" />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
          <span className="bg-background px-2 text-muted-foreground">ou par email</span>
        </div>
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field
          icon={Mail}
          type="email"
          placeholder="ton@email.com"
          value={email}
          onChange={setEmail}
          disabled={loading}
          autoComplete="email"
        />

        {!magicLink && (
          <div className="relative">
            <Field
              icon={Lock}
              type={showPwd ? "text" : "password"}
              placeholder={mode === "signup" ? "Mot de passe (min. 6 caractères)" : "Mot de passe"}
              value={password}
              onChange={setPassword}
              disabled={loading}
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
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
        )}

        <Button
          type="submit"
          variant="brand"
          className="h-11 w-full"
          disabled={submitDisabled}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {magicLink
            ? mode === "signup" ? "M'envoyer un lien magique" : "Recevoir le lien de connexion"
            : mode === "signup" ? "Créer mon compte" : "Se connecter"}
        </Button>

        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setMagicLink((v) => !v)}
            className="inline-flex items-center gap-1 text-violet-300 hover:underline"
          >
            <Wand2 className="h-3 w-3" />
            {magicLink ? "Utiliser un mot de passe" : "Lien magique sans mot de passe"}
          </button>
          {mode === "login" && !magicLink && (
            <Link href="/forgot-password" className="hover:text-foreground">
              Mot de passe oublié ?
            </Link>
          )}
        </div>
      </form>

      {/* Footer links */}
      <div className="space-y-3 border-t border-border/60 pt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-violet-300 hover:underline">
                Créer un compte gratuit
              </Link>
            </>
          ) : (
            <>
              Déjà inscrit ?{" "}
              <Link href="/login" className="text-violet-300 hover:underline">
                Se connecter
              </Link>
            </>
          )}
        </p>

        <p className="text-[11px] text-muted-foreground/70">
          Tu es administrateur ?{" "}
          <Link href="/login/admin" className="text-rose-400 hover:underline">
            Accès Admin Panel →
          </Link>
        </p>

        {mode === "signup" && (
          <p className="text-[10px] text-muted-foreground/70">
            En créant un compte, tu acceptes nos{" "}
            <Link href="/legal/terms" className="hover:text-foreground">CGU</Link>
            {" "}et notre{" "}
            <Link href="/legal/privacy" className="hover:text-foreground">politique de confidentialité</Link>.
          </p>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Champ avec icône à gauche
 * ────────────────────────────────────────────────────────────────── */
function Field({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  minLength,
  autoComplete,
}: {
  icon: typeof Mail;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  minLength?: number;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        minLength={minLength}
        autoComplete={autoComplete}
        className="h-11 pl-9 pr-10"
      />
    </div>
  );
}
