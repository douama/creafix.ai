"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, Wand2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

  const isLogin = mode === "login";

  return (
    <div className="space-y-6">
      {/* ── Big gradient title ─────────────────────────────────────────── */}
      <div className="space-y-2.5 text-center">
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#EC4899] via-[#FF8A00] to-[#1FBEAF]"
          >
            {isLogin ? "Connexion" : "Créer un compte"}
          </span>
        </h1>
        <p className="text-balance text-[14px] text-muted-foreground/80 md:text-[15px]">
          {isLogin
            ? "Connecte-toi à ton dashboard CreaFix AI et booste tes revenus."
            : "Rejoins CreaFix AI aujourd'hui et reçois 3 audits gratuits."}
        </p>
      </div>

      {/* ── OAuth flat stack ───────────────────────────────────────────── */}
      <OAuthButtons mode={mode} layout="row" />

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/[0.06] dark:border-white/[0.06]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.18em]">
          <span className="bg-[#FAF7F5] px-3 text-muted-foreground/70 dark:bg-[#0B0F19]">
            ou avec votre email
          </span>
        </div>
      </div>

      {/* ── Email form ─────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field
          icon={Mail}
          type="email"
          placeholder="your@email.com"
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
              placeholder={isLogin ? "Mot de passe" : "Mot de passe (min. 6 caractères)"}
              value={password}
              onChange={setPassword}
              disabled={loading}
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
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

        <button
          type="submit"
          disabled={submitDisabled}
          className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl text-[14px] font-semibold text-white shadow-lg shadow-[#EC4899]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#EC4899]/25 disabled:pointer-events-none disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #EC4899 0%, #FF8A00 100%)",
          }}
        >
          {/* Subtle button shine effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />

          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="relative z-10">
                {magicLink
                  ? isLogin ? "Recevoir mon lien magique" : "M'envoyer un lien magique"
                  : isLogin ? "Se connecter" : "Créer mon compte"}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 relative z-10" />
            </>
          )}
        </button>

        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground/80">
          <button
            type="button"
            onClick={() => setMagicLink((v) => !v)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#EC4899] transition-colors hover:text-[#FF8A00]"
          >
            <Wand2 className="h-3 w-3" />
            {magicLink ? "Se connecter par mot de passe" : "Connexion par lien magique"}
          </button>
          {isLogin && !magicLink && (
            <Link href="/forgot-password" className="font-semibold transition-colors hover:text-foreground">
              Mot de passe oublié ?
            </Link>
          )}
        </div>
      </form>

      {/* ── Footer links ────────────────────────────────────────────────── */}
      <div className="space-y-2.5 pt-2 text-center border-t border-black/[0.04] dark:border-white/[0.04]">
        <p className="text-[13px] text-muted-foreground/80">
          {isLogin ? (
            <>
              Pas encore de compte ?{" "}
              <Link href="/signup" className="font-semibold text-[#EC4899] transition-colors hover:text-[#FF8A00]">
                Créer un compte gratuit
              </Link>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <Link href="/login" className="font-semibold text-[#EC4899] transition-colors hover:text-[#FF8A00]">
                Se connecter
              </Link>
            </>
          )}
        </p>

        <p className="text-[11px] text-muted-foreground/60">
          Administrateur ?{" "}
          <Link href="/login/admin" className="font-semibold text-rose-500 transition-colors hover:text-rose-600">
            Espace Admin →
          </Link>
        </p>

        {!isLogin && (
          <p className="px-4 text-[10px] leading-relaxed text-muted-foreground/70">
            By creating an account, you agree to our{" "}
            <Link href="/legal/terms" className="underline hover:text-foreground">Terms</Link>
            {" "}and{" "}
            <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Field with left icon
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <Icon 
        className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? "text-[#EC4899]" : "text-muted-foreground/70"
        }`} 
      />
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        minLength={minLength}
        autoComplete={autoComplete}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="h-12 rounded-2xl border-black/[0.08] bg-white/40 pl-11 pr-10 text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-300 focus-visible:border-[#EC4899]/40 focus-visible:bg-white focus-visible:ring-[#EC4899]/10 dark:border-white/[0.08] dark:bg-white/[0.03] dark:focus-visible:bg-[#070913]/60"
      />
    </div>
  );
}
