import Link from "next/link";
import { ArrowLeft, Sparkles, Zap } from "lucide-react";

export function StubPage({
  title,
  description,
  comingSoon = true,
  features,
}: {
  title: string;
  description: string;
  comingSoon?: boolean;
  features?: string[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Retour au cockpit
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h1>
          {comingSoon && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300">
              <Sparkles className="h-2.5 w-2.5" />
              Bientôt
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/60 via-card/40 to-card/40 p-10 backdrop-blur-2xl">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[#EC4899]/15 blur-3xl" />

        <div className="relative mx-auto max-w-xl text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#EC4899]/40 bg-gradient-to-br from-[#EC4899]/20 to-[#FF8A00]/15">
            <Zap className="h-6 w-6 text-[#EC4899]" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold">Cette section arrive</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            On construit cette partie de l&apos;admin par étapes. Tu peux déjà
            utiliser le cockpit + les routes branchées.
          </p>

          {features && features.length > 0 && (
            <div className="mt-6 grid gap-2 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Ce qui arrive ici :
              </p>
              <ul className="space-y-1.5 text-xs">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EC4899]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
