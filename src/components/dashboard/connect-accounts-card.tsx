"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectAccountsModal } from "./connect-accounts-modal";

export function ConnectAccountsCard({ socialAccountsCount }: { socialAccountsCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ConnectAccountsModal open={open} onOpenChange={setOpen} />

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Plateformes connectées</CardTitle>
            <p className="text-sm text-muted-foreground">
              {socialAccountsCount} compte{socialAccountsCount > 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Ajouter un compte">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(true)}>
            Gérer mes connexions
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
