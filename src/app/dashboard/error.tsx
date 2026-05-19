"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log côté client — Sentry capturera automatiquement si configuré
    console.error("[dashboard:error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">Erreur</p>
        <h1 className="text-2xl font-semibold">Quelque chose s&apos;est mal passé</h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "Une erreur inattendue est survenue sur cette section du dashboard."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70">ID erreur : {error.digest}</p>
        )}
        <div className="flex justify-center gap-2 pt-2">
          <Button onClick={reset} variant="default">Réessayer</Button>
          <Button onClick={() => (window.location.href = "/dashboard")} variant="outline">
            Retour cockpit
          </Button>
        </div>
      </div>
    </div>
  );
}
