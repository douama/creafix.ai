import { ShieldCheck, Lock, Globe2, Smartphone } from "lucide-react";
import { getProvidersPublic } from "@/lib/payments/providers";

/**
 * Section "Moyens de paiement acceptés" — visuel de confiance.
 * Affiche les 4 providers avec leur status (active/inactive selon env vars).
 */
export function PaymentMethods() {
  const providers = getProvidersPublic();

  return (
    <section className="relative py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
            <Lock className="h-3 w-3" />
            Paiement sécurisé
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
            Payez comme vous voulez,{" "}
            <span className="text-gradient-orange">d'où vous voulez</span>.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            4 méthodes de paiement, 14+ pays africains supportés. Cartes
            internationales, Mobile Money, ou PayPal — vous choisissez.
          </p>
        </div>

        {/* Grid des 4 providers */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((p) => (
            <div
              key={p.id}
              className={`no-lg-glass relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-card ${
                p.enabled ? "" : "opacity-70"
              }`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl"
                style={{ backgroundColor: p.color }}
              />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl font-bold text-white shadow-sm"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.label[0]}
                  </div>
                  {p.enabled ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                      Bientôt
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-base font-bold tracking-tight">
                  {p.label}
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.methods.slice(0, 3).map((m) => (
                    <span
                      key={m}
                      className="rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground"
                    >
                      {m}
                    </span>
                  ))}
                  {p.methods.length > 3 && (
                    <span className="rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                      +{p.methods.length - 3}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-border/60 pt-2.5 text-[10px] text-muted-foreground">
                  <Globe2 className="h-3 w-3" />
                  {p.zones.join(" · ")}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border border-border bg-card/40 px-6 py-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-emerald-500" />
            PCI-DSS Level 1
          </span>
          <span className="opacity-40">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Smartphone className="h-3 w-3 text-[#FF8A00]" />
            Orange Money · MTN MoMo · Wave
          </span>
          <span className="opacity-40">·</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Annulable en 1 clic
          </span>
        </div>
      </div>
    </section>
  );
}
