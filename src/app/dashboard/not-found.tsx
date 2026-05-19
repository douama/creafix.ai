import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold">Page introuvable</h1>
        <p className="text-sm text-muted-foreground">
          Cette section du dashboard n&apos;existe pas ou a été déplacée.
        </p>
        <div className="pt-2">
          <Button asChild variant="default">
            <Link href="/dashboard">Retour cockpit</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
