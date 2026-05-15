import { BookOpen, MessageCircle, Phone, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Aide & support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          On parle français, wolof, anglais et pidgin. Réponse rapide garantie.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Channel icon={MessageCircle} title="Chat IA" desc="24/7 · réponse instantanée" cta="Ouvrir le chat" />
        <Channel icon={Phone}         title="WhatsApp"    desc="+221 77 000 00 00"        cta="Écrire sur WhatsApp" />
        <Channel icon={Send}          title="Email"        desc="hello@creafix.ai"        cta="Envoyer un email" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Centre d'aide
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {[
            "Connecter une page Facebook",
            "Connecter un compte TikTok",
            "Connecter une chaîne YouTube",
            "Connecter un compte Instagram",
            "Connecter un compte X (Twitter)",
            "Comprendre le score IA",
            "Activer la monétisation YouTube (YPP)",
            "Activer In-Stream Ads Facebook",
            "Devenir éligible TikTok Creator Rewards",
            "Devenir Twitch Affiliate",
            "Payer avec Wave / Orange Money",
            "Mode agence & marque blanche",
            "Confidentialité de mes données",
          ].map((t) => (
            <a
              key={t}
              href="#"
              className="rounded-xl border border-border bg-card/40 px-4 py-3 text-sm hover:bg-card/70"
            >
              → {t}
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Channel({
  icon: Icon,
  title,
  desc,
  cta,
}: {
  icon: any;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
        <Button variant="outline" size="sm" className="w-full">
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}
