"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Loader2, Lock, Smartphone, X } from "lucide-react";
import {
  WaveIcon,
  OrangeMoneyIcon,
  FreeMoneyIcon,
  ExpressoIcon,
  MtnIcon,
  MoovIcon,
} from "./wallet-icons";

/**
 * Modal PayDunya — sélecteur de wallets mobile money + softpay direct.
 *
 * Flow :
 *   1. Parent POST /api/checkout/paydunya/intent → { token, paymentId }
 *   2. Modal affiche les wallets disponibles selon le pays du tel
 *   3. User clique wallet
 *      - Wave SN : redirect vers wave.com
 *      - Orange SN (new endpoint) : redirect vers om_url/maxit_url côté téléphone
 *      - Free / Expresso / MTN / Moov : prompt USSD/app sur le téléphone
 *      - Orange CI : seul wallet qui demande encore un OTP
 *   4. Modal poll /status toutes les 5s → completed → success + redirect
 */
type WalletId =
  | "WAVE_SN"
  | "ORANGE_SN"
  | "FREE_SN"
  | "EXPRESSO_SN"
  | "ORANGE_CI"
  | "MTN_CI"
  | "MOOV_CI";

type Wallet = {
  id: WalletId;
  name: string;
  Icon: ComponentType<{ className?: string }>;
  color: string;
  needsOtp: boolean;
};

const WALLETS: Wallet[] = [
  { id: "WAVE_SN",     name: "Wave",         Icon: WaveIcon,        color: "#1DC8F2", needsOtp: false },
  { id: "ORANGE_SN",   name: "Orange Money", Icon: OrangeMoneyIcon, color: "#FF7900", needsOtp: false },
  { id: "FREE_SN",     name: "Free Money",   Icon: FreeMoneyIcon,   color: "#CD212A", needsOtp: false },
  { id: "EXPRESSO_SN", name: "Expresso",     Icon: ExpressoIcon,    color: "#E6007E", needsOtp: false },
  { id: "ORANGE_CI",   name: "Orange Money", Icon: OrangeMoneyIcon, color: "#FF7900", needsOtp: true  },
  { id: "MTN_CI",      name: "MTN MoMo",     Icon: MtnIcon,         color: "#FFCC00", needsOtp: false },
  { id: "MOOV_CI",     name: "Moov Money",   Icon: MoovIcon,        color: "#0066CC", needsOtp: false },
];

function walletsForPhone(phone: string): Wallet[] {
  const trimmed = phone.replace(/[\s+]/g, "");
  if (trimmed.startsWith("221")) return WALLETS.filter((w) => w.id.endsWith("_SN"));
  if (trimmed.startsWith("225")) return WALLETS.filter((w) => w.id.endsWith("_CI"));
  return WALLETS.filter((w) => w.id.endsWith("_SN")); // défaut SN
}

type Props = {
  open: boolean;
  onClose: () => void;
  token: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  amount: number;
  currency: string;
  returnUrl: string;
};

export function PaydunyaPaymentModal(props: Props) {
  if (!props.open) return null;
  return <ModalInner {...props} />;
}

function ModalInner({
  onClose, token, paymentId, customerName, customerEmail, phone, amount, currency, returnUrl,
}: Props) {
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [waitingConfirm, setWaitingConfirm] = useState(false);
  const [waitMessage, setWaitMessage] = useState("");
  const [deepLinks, setDeepLinks] = useState<{ om?: string; maxit?: string } | null>(null);

  const availableWallets = walletsForPhone(phone);

  // ── Polling status quand on attend la confirmation ──
  useEffect(() => {
    if (!waitingConfirm) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/checkout/paydunya/status?token=${encodeURIComponent(token)}`);
        const j = await res.json();
        if (cancelled) return;
        if (j.status === "completed") {
          toast.success("Paiement confirmé ✓");
          router.push(`${returnUrl}?status=success&pid=${paymentId}&provider=paydunya`);
        } else if (j.status === "cancelled" || j.status === "failed") {
          toast.error("Paiement refusé ou annulé");
          setWaitingConfirm(false);
          setSubmitting(false);
        }
      } catch {
        // Silent : on continue le polling
      }
    };

    const interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [waitingConfirm, token, paymentId, returnUrl, router]);

  async function pickWallet(w: Wallet) {
    setSelectedWallet(w);
    setOtp("");
    if (!w.needsOtp) {
      // Pas besoin d'OTP : lance softpay direct
      await submit(w, "");
    }
  }

  async function submit(w: Wallet, otpValue: string) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/paydunya/softpay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          wallet: w.id,
          token,
          customerName,
          customerEmail,
          phone,
          otp: otpValue || undefined,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        throw new Error(j.error ?? "Échec softpay");
      }
      // Wave : redirect vers la page hosted wave.com
      if (j.redirectUrl) {
        window.location.href = j.redirectUrl;
        return;
      }
      // Orange Money / Free / Expresso : prompt USSD ou app, on poll le status
      // Si deep-links app fournis (Orange new endpoint), on les affiche en option
      if (j.deepLinks) {
        setDeepLinks(j.deepLinks);
      }
      setWaitMessage(j.message ?? "Confirme sur ton téléphone");
      setWaitingConfirm(true);
    } catch (e) {
      toast.error((e as Error).message ?? "Erreur");
      setSubmitting(false);
      setSelectedWallet(null);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paydunya-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground disabled:opacity-50"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-border/60 p-5">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            <h2 id="paydunya-modal-title" className="font-display text-base font-bold tracking-tight">
              Paiement Mobile Money · PayDunya
            </h2>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Tu vas payer <b className="text-foreground tabular-nums">{amount.toLocaleString("fr-FR")} {currency}</b> depuis <b className="text-foreground">{phone}</b>.
          </p>
        </div>

        <div className="space-y-4 p-5">
          {/* ── Écran 1 : attente confirmation téléphone ── */}
          {waitingConfirm && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Confirme sur ton téléphone</p>
                <p className="mt-1 text-xs text-muted-foreground">{waitMessage}</p>
                {deepLinks && (deepLinks.om || deepLinks.maxit) && (
                  <div className="mt-4 flex flex-col gap-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Ou ouvre directement l&apos;app
                    </p>
                    {deepLinks.om && (
                      <a
                        href={deepLinks.om}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#FF7900]/40 bg-[#FF7900]/10 px-3 py-2 text-xs font-semibold text-[#FF7900] hover:bg-[#FF7900]/15"
                      >
                        Ouvrir Orange Money
                      </a>
                    )}
                    {deepLinks.maxit && (
                      <a
                        href={deepLinks.maxit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-xs font-semibold hover:bg-foreground/10"
                      >
                        Ouvrir Max it
                      </a>
                    )}
                  </div>
                )}
                <p className="mt-3 text-[11px] text-muted-foreground/80">
                  Cette fenêtre se ferme automatiquement dès qu&apos;on reçoit la confirmation.
                </p>
              </div>
            </div>
          )}

          {/* ── Écran 2 : champ OTP (Orange Money / autres) ── */}
          {selectedWallet?.needsOtp && !waitingConfirm && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3 text-xs">
                <Smartphone className="h-4 w-4 shrink-0 text-amber-500" />
                <span>
                  Tape <b className="font-mono">#144*391#</b> sur ton téléphone Orange pour obtenir un code OTP, puis colle-le ici.
                </span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Code OTP (4-6 chiffres)"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-center font-mono text-lg tracking-widest outline-none focus:border-foreground/30"
                autoFocus
              />
              <button
                type="button"
                disabled={!otp || submitting}
                onClick={() => submit(selectedWallet, otp)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#FF8A00] text-sm font-semibold text-white shadow-lg shadow-[#EC4899]/30 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Confirmer le paiement
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedWallet(null); setOtp(""); }}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                ← Choisir un autre wallet
              </button>
            </div>
          )}

          {/* ── Écran 3 : sélecteur wallets ── */}
          {!selectedWallet && !waitingConfirm && (
            <>
              <p className="text-xs text-muted-foreground">
                Choisis ton moyen de paiement Mobile Money :
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {availableWallets.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => pickWallet(w)}
                    disabled={submitting}
                    className="group relative overflow-hidden rounded-xl border border-border bg-background/40 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <w.Icon className="h-10 w-10 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-bold" style={{ color: w.color }}>
                          {w.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {w.needsOtp ? "OTP requis" : "Confirmation app"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Indicateur loader simple quand Wave est en train de redirect ── */}
          {selectedWallet && !selectedWallet.needsOtp && submitting && !waitingConfirm && (
            <div className="flex items-center justify-center gap-2 p-4 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Ouverture de {selectedWallet.name}…
            </div>
          )}

          {!waitingConfirm && (
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              Annuler
            </button>
          )}

          {/* Footer sécurité */}
          <div className="flex items-center justify-center gap-1.5 border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            Paiement sécurisé via PayDunya · Aucune carte stockée
          </div>
        </div>
      </div>
    </div>
  );
}
