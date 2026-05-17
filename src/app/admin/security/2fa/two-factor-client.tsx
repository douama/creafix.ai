"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Shield, ShieldCheck, ShieldAlert, Smartphone, QrCode, Key,
  Loader2, CheckCircle2, XCircle, Copy, Check, ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type EnrollState = {
  factorId: string;
  qrCode: string;   // SVG data URL
  secret: string;
} | null;

type Factor = {
  id: string;
  type: string;
  status: string;
  friendly_name?: string | null;
  created_at: string;
};

export function TwoFactorClient() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollState, setEnrollState] = useState<EnrollState>(null);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  async function refresh() {
    const sb = createClient();
    const { data, error } = await sb.auth.mfa.listFactors();
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all: Factor[] = (data?.all ?? []).map((f: any) => ({
      id: f.id,
      type: f.factor_type,
      status: f.status,
      friendly_name: f.friendly_name,
      created_at: f.created_at,
    }));
    setFactors(all);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function startEnroll() {
    setEnrolling(true);
    try {
      const sb = createClient();
      const { data, error } = await sb.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Admin · ${new Date().toLocaleDateString("fr-FR")}`,
      });
      if (error) throw error;
      if (!data) throw new Error("Pas de données d'enrôlement");
      setEnrollState({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
      toast.success("Scan le QR code avec ton app TOTP");
    } catch (e: any) {
      const msg = e?.message ?? "Échec";
      if (msg.toLowerCase().includes("mfa") && msg.toLowerCase().includes("not enabled")) {
        toast.error("MFA non activé sur Supabase", {
          description: "Active TOTP dans Supabase Dashboard → Authentication → Providers → MFA",
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setEnrolling(false);
    }
  }

  async function verifyAndConfirm() {
    if (!enrollState || otp.length !== 6) {
      toast.error("Code à 6 chiffres requis");
      return;
    }
    setVerifying(true);
    try {
      const sb = createClient();
      const { data: challenge, error: challengeErr } = await sb.auth.mfa.challenge({
        factorId: enrollState.factorId,
      });
      if (challengeErr) throw challengeErr;
      if (!challenge) throw new Error("Challenge failed");

      const { error: verifyErr } = await sb.auth.mfa.verify({
        factorId: enrollState.factorId,
        challengeId: challenge.id,
        code: otp,
      });
      if (verifyErr) throw verifyErr;

      toast.success("2FA activée ✓ Ton compte est maintenant protégé");
      setEnrollState(null);
      setOtp("");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Code invalide");
    } finally {
      setVerifying(false);
    }
  }

  async function unenroll(factorId: string) {
    if (!confirm("Désactiver 2FA ? Tu pourras te re-enrôler à tout moment.")) return;
    try {
      const sb = createClient();
      const { error } = await sb.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      toast.success("2FA désactivée");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Échec");
    }
  }

  function copySecret() {
    if (!enrollState) return;
    navigator.clipboard.writeText(enrollState.secret);
    setSecretCopied(true);
    toast.success("Secret copié");
    setTimeout(() => setSecretCopied(false), 2000);
  }

  const verifiedFactors = factors.filter((f) => f.status === "verified");
  const isProtected = verifiedFactors.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/security"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Retour au Security Center
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Authentification 2 facteurs
          </h1>
          {isProtected ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
              <ShieldCheck className="h-2.5 w-2.5" />
              Activée
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300">
              <ShieldAlert className="h-2.5 w-2.5" />
              Recommandée
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Protège ton compte admin avec un code à 6 chiffres généré par une app TOTP
          (Google Authenticator, 1Password, Authy, Microsoft Authenticator).
        </p>
      </div>

      {/* Status card */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
            isProtected
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-amber-500/40 bg-amber-500/10"
          }`}>
            {isProtected ? (
              <ShieldCheck className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
            ) : (
              <Shield className="h-5 w-5 text-amber-500" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-base font-bold">
              {isProtected ? "Ton compte est protégé" : "Aucune 2FA configurée"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {isProtected
                ? "À chaque connexion admin, tu devras saisir un code TOTP en plus de ton mot de passe."
                : "Activer la 2FA est fortement recommandé pour les comptes admin."}
            </p>
          </div>
        </div>
      </div>

      {/* Factors list */}
      {loading ? (
        <div className="rounded-2xl border border-border bg-card/40 p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : factors.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Facteurs enregistrés
          </h2>
          <ul className="mt-3 space-y-2">
            {factors.map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
                <Smartphone className="h-4 w-4 text-[#EC4899]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{f.friendly_name ?? "TOTP"}</span>
                    {f.status === "verified" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Vérifié
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300">
                        <XCircle className="h-2.5 w-2.5" />
                        En attente
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    Ajouté le {new Date(f.created_at).toLocaleString("fr-FR")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => unenroll(f.id)}
                  className="rounded-lg border border-border bg-background/40 px-3 py-1 text-xs text-rose-500 hover:bg-rose-500/10"
                >
                  Désactiver
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Enroll flow */}
      {!enrollState ? (
        <div className="rounded-2xl border border-[#EC4899]/30 bg-[#EC4899]/[0.06] p-6">
          <div className="flex items-start gap-3">
            <QrCode className="h-5 w-5 shrink-0 text-[#EC4899]" />
            <div className="flex-1">
              <h2 className="font-display text-base font-bold">
                {isProtected ? "Ajouter un autre facteur" : "Activer la 2FA"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Tu vas scanner un QR code avec ton app authenticator. Puis confirmer avec
                un code à 6 chiffres.
              </p>
              <button
                type="button"
                onClick={startEnroll}
                disabled={enrolling}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#EC4899] to-[#FF8A00] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#EC4899]/20 disabled:opacity-50"
              >
                {enrolling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <QrCode className="h-3.5 w-3.5" />}
                Commencer l&apos;enrôlement
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#EC4899]/40 bg-card/40 p-6 backdrop-blur-xl">
          <h2 className="font-display text-base font-bold">Configuration TOTP</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* QR Code */}
            <div className="rounded-xl border border-border bg-white p-4 text-center">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                1. Scan avec ton app
              </div>
              <div
                className="mx-auto mt-3 h-48 w-48"
                dangerouslySetInnerHTML={{ __html: enrollState.qrCode }}
              />
            </div>

            {/* Manual secret */}
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Ou copie ce secret manuellement
                </div>
                <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-border bg-background/40 p-3">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" />
                  <code className="flex-1 truncate font-mono text-xs">
                    {enrollState.secret}
                  </code>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {secretCopied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  2. Entre le code à 6 chiffres de l&apos;app
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="mt-1.5 h-12 w-full rounded-lg border border-border bg-background/40 px-3 text-center font-mono text-lg tracking-[0.4em] outline-none focus:border-foreground/30"
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={verifyAndConfirm}
                disabled={verifying || otp.length !== 6}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {verifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Vérifier & activer
              </button>

              <button
                type="button"
                onClick={() => { setEnrollState(null); setOtp(""); }}
                className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-background/40 px-3 py-2 text-xs hover:bg-background/70"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="text-xs text-muted-foreground">
            <p>
              <b className="text-foreground">Setup requis côté Supabase :</b> active TOTP dans
              Supabase Dashboard → Authentication → Providers → MFA → toggle TOTP enrollment.
            </p>
            <p className="mt-1.5">
              Apps recommandées : <b className="text-foreground">1Password</b>,{" "}
              <b className="text-foreground">Google Authenticator</b>,{" "}
              <b className="text-foreground">Authy</b>,{" "}
              <b className="text-foreground">Microsoft Authenticator</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
