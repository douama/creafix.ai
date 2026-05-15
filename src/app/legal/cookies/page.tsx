import { LegalShell } from "@/components/marketing/legal-shell";

export const metadata = {
  title: "Politique cookies",
  description: "Comment Monetiq AI utilise les cookies et technologies similaires.",
};

const cookies = [
  {
    name: "Cookies essentiels",
    desc: "Strictement nécessaires au fonctionnement (session, sécurité, équilibrage de charge).",
    examples: "sb-access-token, sb-refresh-token, csrf",
    optOut: "Non, ces cookies sont indispensables.",
  },
  {
    name: "Cookies de préférences",
    desc: "Stockent ton thème (clair/sombre), langue préférée, dernière page visitée.",
    examples: "theme, lang, last-visit",
    optOut: "Tu peux les supprimer dans les paramètres de ton navigateur.",
  },
  {
    name: "Cookies analytiques",
    desc: "Statistiques anonymisées d'utilisation pour améliorer le produit.",
    examples: "posthog (anonymisé), error-id",
    optOut: "Désactivables via le bandeau de consentement ou /settings.",
  },
  {
    name: "Cookies marketing",
    desc: "Mesure des campagnes d'acquisition (Meta Pixel, Google Ads).",
    examples: "fbp, _ga (uniquement avec consentement)",
    optOut: "Désactivés par défaut, activables via le bandeau.",
  },
];

export default function CookiesPage() {
  return (
    <LegalShell title="Politique cookies" updatedAt="15 mai 2026" slug="cookies">
      <p>
        Cette page explique quels cookies et technologies similaires Monetiq AI utilise, dans
        quel but, et comment les contrôler.
      </p>

      <h2>Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur ton appareil par le navigateur lorsque
        tu visites un site. Il permet au site de te reconnaître, mémoriser des préférences, ou
        mesurer son audience.
      </p>

      <h2>Catégories de cookies utilisés</h2>
      {cookies.map((c) => (
        <div
          key={c.name}
          className="my-4 rounded-2xl border border-border bg-card/50 p-4 not-prose"
        >
          <div className="font-display text-base font-semibold text-foreground">{c.name}</div>
          <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
          <div className="mt-2 grid gap-1 text-xs">
            <span className="text-muted-foreground">
              <strong className="text-foreground">Exemples :</strong> {c.examples}
            </span>
            <span className="text-muted-foreground">
              <strong className="text-foreground">Opt-out :</strong> {c.optOut}
            </span>
          </div>
        </div>
      ))}

      <h2>Gérer ses préférences</h2>
      <p>Tu peux :</p>
      <ul>
        <li>
          Modifier tes préférences à tout moment via le lien{" "}
          <strong>« Cookies »</strong> en bas de page ;
        </li>
        <li>Bloquer/supprimer les cookies depuis les paramètres de ton navigateur ;</li>
        <li>
          Utiliser des outils comme{" "}
          <a href="https://www.eff.org/privacybadger" target="_blank" rel="noreferrer noopener">
            Privacy Badger
          </a>{" "}
          ou uBlock Origin pour un contrôle plus fin.
        </li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Les cookies essentiels expirent à la fermeture de la session. Les autres cookies ont
        une durée maximale de 13 mois, conformément aux recommandations CNIL et équivalents.
      </p>

      <h2>Contact</h2>
      <p>
        Question sur les cookies ?{" "}
        <a href="mailto:privacy@monetiq.ai">privacy@monetiq.ai</a>.
      </p>
    </LegalShell>
  );
}
