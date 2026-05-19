import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold">Page admin introuvable</h1>
        <p className="text-sm text-muted-foreground">
          Ce module n&apos;existe pas dans le panneau admin.
        </p>
        <div className="pt-2">
          <Button asChild variant="default">
            <Link href="/admin">Retour cockpit admin</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
