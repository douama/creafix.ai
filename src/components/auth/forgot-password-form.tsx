"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
      <div className="space-y-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
          <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-300" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Email envoyé ✓
          </h1>
          <p className="text-sm text-muted-foreground">
            Si <b className="text-foreground">{email}</b> est associé à un compte, tu recevras un
            lien de réinitialisation dans quelques minutes.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/40 p-4 text-xs">
          <p className="font-semibold">Que faire ensuite ?</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
              Vérifie ta boîte mail (et le dossier spam)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
              Click sur le lien dans l&apos;email (valable 1 heure)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
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
            className="w-full rounded-xl border border-border bg-card/40 px-4 py-2 text-xs font-semibold transition-colors hover:bg-card/70"
          >
            Renvoyer le lien à un autre email
          </button>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-1 rounded-xl px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#EC4899]/40 bg-gradient-to-br from-[#EC4899]/20 to-[#EC4899]/5">
        <KeyRound className="h-5 w-5 text-[#EC4899]" />
      </div>

      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Mot de passe oublié ?
        </h1>
        <p className="text-sm text-muted-foreground">
          Pas de panique. Entre ton email et on t&apos;envoie un lien pour le réinitialiser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Email du compte
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              autoFocus
              className="h-11 pl-9"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="brand"
          className="h-11 w-full"
          disabled={loading || !email}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          Envoyer le lien de réinitialisation
        </Button>
      </form>

      <div className="border-t border-border/60 pt-4 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
