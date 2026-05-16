"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type AuthMode = "login" | "signup";
type EmailMode = "magic" | "password";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [emailMode, setEmailMode] = useState<EmailMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState<null | "google" | "facebook" | "email">(null);

  async function signInWithOAuth(provider: "google" | "facebook") {
    setLoading(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${mode === "signup" ? "/onboarding" : "/dashboard"}`,
          ...(provider === "facebook"
            ? { scopes: "email,public_profile,pages_show_list,pages_read_engagement,read_insights" }
            : {}),
        },
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(e.message ?? "Connexion impossible");
      setLoading(null);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading("email");
    const supabase = createClient();

    try {
      if (emailMode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${mode === "signup" ? "/onboarding" : "/dashboard"}`,
          },
        });
        if (error) throw error;
        toast.success(`Lien magique envoyé à ${email}`, {
          description: "Vérifie ta boîte mail (et les spams).",
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
          description: "Vérifie ta boîte mail pour confirmer ton adresse.",
        });
      }
    } catch (e: any) {
      toast.error(e.message ?? "Échec");
    } finally {
      setLoading(null);
    }
  }

  const passwordRequired = emailMode === "password";
  const submitDisabled =
    !!loading || !email || (passwordRequired && password.length < 6);

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="h-11 w-full justify-center gap-2.5"
        disabled={!!loading}
        onClick={() => signInWithOAuth("google")}
      >
        {loading === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 11v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.8-4.1 2.8-7 0-.5 0-1-.1-1.4H12z" />
            <path fill="#4285F4" d="M12 22c2.7 0 5-1 6.3-2.3l-3.1-2.4c-.9.6-2 1-3.2 1-2.5 0-4.5-1.7-5.3-3.9H3.5v2.5A10 10 0 0 0 12 22z" />
            <path fill="#FBBC05" d="M6.7 14.4a6 6 0 0 1 0-4.8V7H3.5a10 10 0 0 0 0 10l3.2-2.5z" />
            <path fill="#34A853" d="M12 6c1.4 0 2.6.5 3.5 1.4l2.6-2.6A10 10 0 0 0 3.5 7l3.2 2.5c.8-2.2 2.8-3.5 5.3-3.5z" />
          </svg>
        )}
        Continuer avec Google
      </Button>

      <Button
        variant="outline"
        className="h-11 w-full justify-center gap-2.5"
        disabled={!!loading}
        onClick={() => signInWithOAuth("facebook")}
      >
        {loading === "facebook" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.6 9.9V15h-2.5v-3h2.5V9.7c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 3h-2.4v6.9A10 10 0 0 0 22 12z" />
          </svg>
        )}
        Continuer avec Facebook
      </Button>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
          ou par email
        </span>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={!!loading}
          autoComplete="email"
        />

        {passwordRequired && (
          <div className="relative">
            <Input
              type={showPwd ? "text" : "password"}
              placeholder={mode === "signup" ? "Mot de passe (min. 6 caractères)" : "Mot de passe"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={!!loading}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPwd ? "Cacher" : "Afficher"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        )}

        <Button type="submit" variant="brand" className="w-full" disabled={submitDisabled}>
          {loading === "email" ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : null}
          {emailMode === "magic"
            ? mode === "signup"
              ? "Recevoir mon lien magique"
              : "Recevoir mon lien de connexion"
            : mode === "signup"
            ? "Créer mon compte"
            : "Se connecter"}
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => setEmailMode((m) => (m === "password" ? "magic" : "password"))}
          className="text-violet-300 hover:underline"
        >
          {emailMode === "password" ? "Utiliser un lien magique" : "Utiliser un mot de passe"}
        </button>
        {mode === "login" && emailMode === "password" && (
          <Link href="/forgot-password" className="hover:text-foreground">
            Mot de passe oublié ?
          </Link>
        )}
      </div>
    </div>
  );
}
