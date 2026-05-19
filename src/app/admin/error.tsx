"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin:error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium text-destructive">Erreur admin</p>
        <h1 className="text-2xl font-semibold">Action impossible</h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "Une erreur est survenue dans le panneau admin."}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70">ID : {error.digest}</p>
        )}
        <div className="flex justify-center gap-2 pt-2">
          <Button onClick={reset} variant="default">Réessayer</Button>
          <Button onClick={() => (window.location.href = "/admin")} variant="outline">
            Cockpit admin
          </Button>
        </div>
      </div>
    </div>
  );
}
