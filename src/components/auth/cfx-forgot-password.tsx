"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CfxField } from "./cfx-auth-form";

export function CfxForgotPasswordForm() {
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
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? "Échec de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00D1FF]/40 bg-gradient-to-br from-[#00D1FF]/20 to-[#00D1FF]/5 shadow-[0_8px_24px_-6px_rgba(0,209,255,0.4)]">
          <CheckCircle2 className="h-6 w-6 text-[#00D1FF]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-cfx text-[26px] md:text-[32px] font-bold tracking-[-0.02em] text-white">
            Email envoyé ✓
          </h1>
          <p className="text-[14px] text-[#A5B4CC]">
            Si <b className="text-white">{email}</b> est associé à un compte, tu recevras un
            lien de réinitialisation dans quelques minutes.
          </p>
        </div>

        <div className="cfx-glass rounded-xl p-4 text-[12.5px]">
          <p className="font-semibold text-white mb-2">Que faire ensuite ?</p>
          <ul className="space-y-2 text-[#A5B4CC]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D1FF] shadow-[0_0_6px_rgba(0,209,255,0.8)]" />
              Vérifie ta boîte mail (et le dossier spam)
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6C63FF] shadow-[0_0_6px_rgba(108,99,255,0.8)]" />
              Clique sur le lien dans l&apos;email (valable 1 heure)
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D6EFD] shadow-[0_0_6px_rgba(13,110,253,0.8)]" />
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
            className="cfx-btn-ghost w-full !justify-center !h-11 !text-[12.5px]"
          >
            Renvoyer le lien à un autre email
          </button>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[12px] text-[#A5B4CC] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#6C63FF]/40 bg-gradient-to-br from-[#6C63FF]/20 to-[#6C63FF]/5 shadow-[0_8px_24px_-6px_rgba(108,99,255,0.4)]">
        <KeyRound className="h-5 w-5 text-[#9189FF]" />
      </div>

      <div className="space-y-2">
        <h1 className="font-cfx text-[26px] md:text-[32px] font-bold tracking-[-0.02em] text-white">
          Mot de passe oublié ?
        </h1>
        <p className="text-[14px] text-[#A5B4CC]">
          Pas de panique. Entre ton email et on t&apos;envoie un lien pour le réinitialiser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6C7A91]">
            Email du compte
          </label>
          <CfxField
            icon={Mail}
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={setEmail}
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="cfx-btn-primary w-full !justify-center !h-12 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Envoyer le lien de réinitialisation
        </button>
      </form>

      <div className="border-t border-white/[0.06] pt-5 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-[#A5B4CC] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
