import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

/**
 * Bandeau "données démo" pour les pages qui affichent encore des stats statiques
 * (analytics, anti-ban, agents, audits) tant que l'utilisateur n'a pas connecté de comptes.
 */
export function DemoBanner() {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4 text-sm md:flex-row md:items-center md:gap-4 md:p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 dark:text-amber-300">
        <Info className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="font-semibold">
          Données d&apos;exemple — connecte tes comptes pour voir tes vraies métriques
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Tout ce qui est affiché ci-dessous est une démonstration. Ton dashboard sera personnalisé
          dès que tu auras connecté au moins une plateforme.
        </p>
      </div>
      <Link
        href="/dashboard/settings?tab=connections"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-amber-500"
      >
        Connecter mes comptes
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
