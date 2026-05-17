"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, Key, Trash2, Webhook } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiPage() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiKey = "sk_live_cfx_XXXXXXXXXXXXXXXXXXXXXXXXXXXX";

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">API & Webhooks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Intégrez CreaFix AI dans vos outils. REST + Webhooks, rate limit 1 000 req/h.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-4 w-4" /> Clé API personnelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 p-3">
            <code className="flex-1 font-mono text-sm">
              {show ? apiKey : "sk_live_cfx_••••••••••••••••••••••••••"}
            </code>
            <Button variant="ghost" size="icon" onClick={() => setShow(!show)}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Régénérer la clé
            </Button>
            <Button variant="outline" size="sm">
              + Créer une clé secondaire
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Réservé aux plans Pro et Agence. Ne partage jamais cette clé publiquement.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Démarrage rapide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lancer un audit
            </div>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-border bg-card/60 p-4 text-xs leading-relaxed">{`curl -X POST https://api.creafix.ai/v1/audits \\
  -H "Authorization: Bearer ${show ? apiKey : "sk_live_cfx_..."}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "platform": "TIKTOK",
    "handle": "@moncompte",
    "country": "SN",
    "mode": "COMPLETE"
  }'`}</pre>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Récupérer un audit
            </div>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-border bg-card/60 p-4 text-xs leading-relaxed">{`curl https://api.creafix.ai/v1/audits/aud_xxx \\
  -H "Authorization: Bearer ${show ? apiKey : "sk_live_cfx_..."}"`}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-4 w-4" /> Webhooks
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sois notifié dans Slack, Notion ou ton API à chaque évènement.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              url: "https://hooks.slack.com/services/T01/B02/AbC…",
              events: ["audit.completed", "shadowban.detected"],
              active: true,
            },
            {
              url: "https://api.tonentreprise.com/creafix",
              events: ["trend.new", "audit.completed"],
              active: true,
            },
          ].map((w, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card/40 p-3.5 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-3">
                <code className="truncate font-mono text-xs">{w.url}</code>
                <div className="flex items-center gap-2">
                  <Badge variant={w.active ? "success" : "outline"}>
                    {w.active ? "Actif" : "Pause"}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {w.events.map((e) => (
                  <span
                    key={e}
                    className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-[10px] font-mono"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            + Ajouter un webhook
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Événements disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            {[
              "audit.started",
              "audit.completed",
              "audit.failed",
              "shadowban.detected",
              "shadowban.resolved",
              "viral.score.ready",
              "trend.new",
              "content.repaired",
              "payment.succeeded",
              "subscription.updated",
            ].map((e) => (
              <code
                key={e}
                className="rounded-lg border border-border bg-card/40 px-3 py-1.5 font-mono text-xs"
              >
                {e}
              </code>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rate limits & SDKs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span>Plan Pro</span>
            <span className="font-mono">1 000 requêtes / heure</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span>Plan Agency</span>
            <span className="font-mono">10 000 requêtes / heure</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Plan Enterprise</span>
            <span className="font-mono">Custom</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">Node.js SDK</Badge>
            <Badge variant="outline">Python SDK</Badge>
            <Badge variant="outline">PHP SDK</Badge>
            <Badge variant="outline">Postman collection</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
