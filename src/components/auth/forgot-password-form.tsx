"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard/settings?reset=1`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Email envoyé ✓");
    } catch (e: any) {
      toast.error(e?.message ?? "Échec de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-7">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
            <CheckCircle2 className="h-7 w-7 text-emerald-500 dark:text-emerald-300" />
          </div>
        </div>

        <div className="space-y-3 text-center">
          <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-tight md:text-[48px]">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #10B981 0%, #1FBEAF 100%)",
              }}
            >
              Check your inbox
            </span>
          </h1>
          <p className="text-balance text-[15px] text-muted-foreground">
            Si <b className="text-foreground">{email}</b> est associé à un compte, tu recevras
            un lien de réinitialisation dans quelques minutes.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-4 text-xs shadow-sm dark:bg-card/40">
          <p className="font-semibold">Que faire ensuite ?</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
              Vérifie ta boîte mail (et le dossier spam)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
              Click sur le lien dans l&apos;email (valable 1 heure)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
              Tu seras redirigé vers la création d&apos;un nouveau mot de passe
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="w-full rounded-full border border-border/80 bg-white px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-card/70 dark:bg-card/40"
          >
            Renvoyer le lien à un autre email
          </button>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-1 rounded-full px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-[44px] font-bold leading-[1.05] tracking-tight md:text-[56px]">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #EC4899 0%, #FF8A00 55%, #1FBEAF 100%)",
            }}
          >
            Reset
          </span>
        </h1>
        <p className="text-balance text-[15px] text-muted-foreground">
          your password — we&apos;ll email you a secure link to choose a new one.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            autoFocus
            className="h-12 rounded-full border-border/80 bg-white pl-11 pr-4 text-[14px] shadow-sm focus-visible:border-[#EC4899]/40 focus-visible:ring-[#EC4899]/20 dark:bg-card/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-[15px] font-semibold text-white shadow-lg shadow-[#EC4899]/25 transition-all hover:shadow-xl hover:shadow-[#EC4899]/40 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "linear-gradient(120deg, #EC4899 0%, #FF8A00 100%)",
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Send reset link</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
