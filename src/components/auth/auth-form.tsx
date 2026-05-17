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
    <div className="space-y-7">
      {/* ── Big gradient title ─────────────────────────────────────────── */}
      <div className="space-y-3 text-center">
        <h1 className="font-display text-[44px] font-bold leading-[1.05] tracking-tight md:text-[56px]">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #EC4899 0%, #FF8A00 55%, #1FBEAF 100%)",
            }}
          >
            {isLogin ? "Login" : "Sign up"}
          </span>
        </h1>
        <p className="text-balance text-[15px] text-muted-foreground md:text-base">
          {isLogin
            ? "to the future of African creator monetization."
            : "today to get 3 free AI audits — no credit card needed."}
        </p>
      </div>

      {/* ── OAuth flat stack ───────────────────────────────────────────── */}
      <OAuthButtons mode={mode} layout="row" />

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/70" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.18em]">
          <span className="bg-[#FAF7F5] px-3 text-muted-foreground dark:bg-background">
            or {isLogin ? "login" : "sign up"} with email
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
          className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-[15px] font-semibold text-white shadow-lg shadow-[#EC4899]/25 transition-all hover:shadow-xl hover:shadow-[#EC4899]/40 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "linear-gradient(120deg, #EC4899 0%, #FF8A00 100%)",
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>
                {magicLink
                  ? isLogin ? "Recevoir mon lien" : "M'envoyer un lien magique"
                  : isLogin ? "Login" : "Create my account"}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setMagicLink((v) => !v)}
            className="inline-flex items-center gap-1 font-semibold text-[#EC4899] hover:underline"
          >
            <Wand2 className="h-3 w-3" />
            {magicLink ? "Use a password" : "Magic link (no password)"}
          </button>
          {isLogin && !magicLink && (
            <Link href="/forgot-password" className="font-semibold hover:text-foreground">
              Forgot password?
            </Link>
          )}
        </div>
      </form>

      {/* ── Footer links ────────────────────────────────────────────────── */}
      <div className="space-y-3 pt-2 text-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-[#EC4899] hover:underline">
                Sign up free
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#EC4899] hover:underline">
                Log in
              </Link>
            </>
          )}
        </p>

        <p className="text-[11px] text-muted-foreground/70">
          Administrator?{" "}
          <Link href="/login/admin" className="font-semibold text-rose-500 hover:underline">
            Admin Panel →
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
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        minLength={minLength}
        autoComplete={autoComplete}
        className="h-12 rounded-full border-border/80 bg-white pl-11 pr-10 text-[14px] shadow-sm focus-visible:border-[#EC4899]/40 focus-visible:ring-[#EC4899]/20 dark:bg-card/40"
      />
    </div>
  );
}
