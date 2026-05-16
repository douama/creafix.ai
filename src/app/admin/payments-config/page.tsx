import { getProvidersConfig } from "@/lib/payments/providers";
import { CheckCircle2, AlertTriangle, Globe2, Lock } from "lucide-react";

export const metadata = {
  title: "Configuration paiements · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPaymentsConfig() {
  const providers = getProvidersConfig();
  const enabled = providers.filter((p) => p.enabled).length;

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Configuration paiements
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
            {enabled}/{providers.length} actifs
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Les clés API sont configurées via les variables d'environnement Vercel.
          Cette page affiche le statut en lecture seule.
        </p>
      </header>

      {/* Providers status */}
      <div className="grid gap-3 md:grid-cols-2">
        {providers.map((p) => (
          <article
            key={p.id}
            className={`relative overflow-hidden rounded-2xl border p-5 ${
              p.enabled
                ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                : "border-amber-500/30 bg-amber-500/[0.03]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl font-display text-lg font-bold text-white shadow-lg"
                  style={{ backgroundColor: p.color }}
                >
                  {p.label[0]}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold">{p.label}</h2>
                  <p className="text-[12px] text-muted-foreground">{p.description}</p>
                </div>
              </div>
              {p.enabled ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Configuré
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-300">
                  <AlertTriangle className="h-3 w-3" />
                  Manquant
                </span>
              )}
            </div>

            {!p.enabled && p.reason && (
              <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[12px] text-amber-700 dark:text-amber-200">
                <b>Action requise :</b> ajoute{" "}
                <code className="rounded bg-background/40 px-1 py-0.5 font-mono text-[11px]">
                  {p.reason}
                </code>{" "}
                dans les variables d'environnement Vercel.
              </div>
            )}

            <div className="mt-4 space-y-2.5 text-[12px]">
              <div className="flex items-start gap-2">
                <Globe2 className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                <div>
                  <span className="font-semibold text-foreground">Zones : </span>
                  <span className="text-muted-foreground">{p.zones.join(" · ")}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-semibold text-foreground mr-1">Méthodes : </span>
                  {p.methods.map((m) => (
                    <span
                      key={m}
                      className="rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
              Endpoint checkout :{" "}
              <code className="font-mono">/api/checkout/{p.id.toLowerCase()}</code>
              <br />
              Endpoint webhook :{" "}
              <code className="font-mono">/api/webhooks/{p.id.toLowerCase()}</code>
            </div>
          </article>
        ))}
      </div>

      {/* Setup doc */}
      <details className="rounded-2xl border border-border bg-card/40 p-5 open:bg-card/60">
        <summary className="cursor-pointer font-display text-base font-bold">
          📘 Variables d'environnement requises (Vercel)
        </summary>
        <div className="mt-4 space-y-3 font-mono text-[11.5px] leading-relaxed">
          <div>
            <div className="text-[#635BFF]"># Stripe</div>
            <div>STRIPE_SECRET_KEY=sk_live_xxx</div>
            <div>STRIPE_WEBHOOK_SECRET=whsec_xxx</div>
          </div>
          <div>
            <div className="text-[#0070BA"># PayPal</div>
            <div>PAYPAL_CLIENT_ID=xxx</div>
            <div>PAYPAL_CLIENT_SECRET=xxx</div>
            <div>PAYPAL_ENV=live  # ou sandbox</div>
            <div>PAYPAL_WEBHOOK_ID=xxx</div>
          </div>
          <div>
            <div className="text-[#0FAA52]"># CinetPay</div>
            <div>CINETPAY_API_KEY=xxx</div>
            <div>CINETPAY_SITE_ID=xxx</div>
          </div>
          <div>
            <div className="text-[#F5A623]"># Flutterwave</div>
            <div>FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxx</div>
            <div>FLUTTERWAVE_WEBHOOK_HASH=xxx  # optionnel mais recommandé</div>
          </div>
          <div>
            <div className="text-muted-foreground"># Commun</div>
            <div>NEXT_PUBLIC_APP_URL=https://creafix-ai.vercel.app</div>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 text-[12px] text-blue-700 dark:text-blue-300">
          ⚙️ Après avoir ajouté les variables, redéploie l'app pour qu'elles soient prises en compte.
        </div>
      </details>
    </div>
  );
}
