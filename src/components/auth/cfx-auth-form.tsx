"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, Wand2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

type Mode = "login" | "signup";

export function CfxAuthForm({ mode }: { mode: Mode }) {
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
    } catch (e: unknown) {
      const msg = (e as Error)?.message ?? "Échec";
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
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-cfx text-[26px] md:text-[32px] font-bold tracking-[-0.02em] text-white">
          {mode === "login" ? "Bon retour 👋" : "Créer ton compte"}
        </h1>
        <p className="text-[14px] text-[#A5B4CC]">
          {mode === "login"
            ? "Connecte-toi à ton dashboard CreaFix AI."
            : "Lance ton premier audit IA en 60 secondes. Sans carte bancaire."}
        </p>
      </div>

      {/* OAuth row */}
      <OAuthButtons mode={mode} layout="row" />

      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.14em]">
          <span className="bg-[#071426] px-3 text-[#6C7A91]">ou par email</span>
        </div>
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <CfxField
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
            <CfxField
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C7A91] hover:text-white transition-colors"
              aria-label={showPwd ? "Cacher" : "Afficher"}
              tabIndex={-1}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={submitDisabled}
          className="cfx-btn-primary w-full !justify-center !h-12 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {magicLink
            ? mode === "signup" ? "M'envoyer un lien magique" : "Recevoir le lien de connexion"
            : mode === "signup" ? "Créer mon compte" : "Se connecter"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>

        <div className="flex items-center justify-between pt-1 text-[12px]">
          <button
            type="button"
            onClick={() => setMagicLink((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[#00D1FF] hover:text-[#5EE3FF] transition-colors"
          >
            <Wand2 className="h-3 w-3" />
            {magicLink ? "Utiliser un mot de passe" : "Lien magique sans mot de passe"}
          </button>
          {mode === "login" && !magicLink && (
            <Link href="/forgot-password" className="text-[#A5B4CC] hover:text-white transition-colors">
              Mot de passe oublié ?
            </Link>
          )}
        </div>
      </form>

      {/* Footer links */}
      <div className="space-y-3 border-t border-white/[0.06] pt-5 text-center">
        <p className="text-[13.5px] text-[#A5B4CC]">
          {mode === "login" ? (
            <>
              Pas encore de compte ?{" "}
              <Link href="/signup" className="font-medium text-[#00D1FF] hover:text-[#5EE3FF]">
                Créer un compte gratuit
              </Link>
            </>
          ) : (
            <>
              Déjà inscrit ?{" "}
              <Link href="/login" className="font-medium text-[#00D1FF] hover:text-[#5EE3FF]">
                Se connecter
              </Link>
            </>
          )}
        </p>

        <p className="text-[11px] text-[#6C7A91]">
          Tu es administrateur ?{" "}
          <Link href="/login/admin" className="text-[#9189FF] hover:text-[#00D1FF]">
            Accès Admin Panel →
          </Link>
        </p>

        {mode === "signup" && (
          <p className="text-[10.5px] text-[#6C7A91] leading-relaxed max-w-xs mx-auto">
            En créant un compte, tu acceptes nos{" "}
            <Link href="/legal/terms" className="text-[#A5B4CC] hover:text-white">CGU</Link>
            {" "}et notre{" "}
            <Link href="/legal/privacy" className="text-[#A5B4CC] hover:text-white">politique de confidentialité</Link>.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Field with cfx styling ─── */
export function CfxField({
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
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6C7A91]" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        minLength={minLength}
        autoComplete={autoComplete}
        className="h-12 w-full pl-10 pr-12 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-[14px] placeholder:text-[#6C7A91] focus:outline-none focus:border-[#0D6EFD] focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(13,110,253,0.18)] transition-all disabled:opacity-50"
      />
    </div>
  );
}
