import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="mt-1 text-sm text-muted-foreground">Compte, langue, notifications, sécurité.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Prénom"><Input defaultValue="Sobé" /></Field>
            <Field label="Nom"><Input defaultValue="K." /></Field>
            <Field label="Email"><Input defaultValue="sobekande@gmail.com" /></Field>
            <Field label="Téléphone"><Input defaultValue="+221 77 000 00 00" /></Field>
            <Field label="Pays"><Input defaultValue="Sénégal" /></Field>
            <Field label="Langue préférée"><Input defaultValue="Français" /></Field>
          </div>
          <div className="flex justify-end">
            <Button variant="brand">Enregistrer</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Ton préféré pour les scripts">
            <Input defaultValue="Direct, conversationnel, avec wolofismes occasionnels" />
          </Field>
          <Field label="Niches préférées">
            <Input defaultValue="Finance, lifestyle, humour" />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Authentification à deux facteurs</div>
              <div className="text-xs text-muted-foreground">Recommandé</div>
            </div>
            <Button variant="outline" size="sm">Activer</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Sessions actives</div>
              <div className="text-xs text-muted-foreground">2 appareils connectés</div>
            </div>
            <Button variant="ghost" size="sm">Gérer</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-rose-300">Supprimer mon compte</div>
              <div className="text-xs text-muted-foreground">Action irréversible</div>
            </div>
            <Button variant="destructive" size="sm">Supprimer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}
