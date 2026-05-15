import { LegalShell } from "@/components/marketing/legal-shell";

export const metadata = {
  title: "Conditions générales d'utilisation",
  description: "Les CGU encadrant l'utilisation du service Monetiq AI.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Conditions générales d'utilisation" updatedAt="15 mai 2026" slug="terms">
      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et
        l'utilisation de la plateforme Monetiq AI (le « Service ») éditée par Monetiq AI SARL
        (« Monetiq », « nous »). En créant un compte ou en utilisant le Service, l'utilisateur
        (« vous ») accepte sans réserve les présentes CGU.
      </p>

      <h2>2. Description du Service</h2>
      <p>
        Monetiq AI est une plateforme d'audit IA, d'optimisation et de génération de contenu
        à destination des créateurs sociaux et agences médias. Elle permet notamment :
      </p>
      <ul>
        <li>D'auditer des pages Facebook et comptes TikTok via OAuth officiel ;</li>
        <li>De générer un score de monétisation, des recommandations et un plan d'action ;</li>
        <li>De générer du contenu (idées, scripts, miniatures, voix-off) via IA ;</li>
        <li>D'estimer les revenus publicitaires par pays africain ;</li>
        <li>De gérer plusieurs clients en marque blanche (plan Agence).</li>
      </ul>

      <h2>3. Création et utilisation du compte</h2>
      <p>
        L'inscription nécessite une adresse email valide et l'acceptation des CGU. L'utilisateur
        s'engage à fournir des informations exactes et à maintenir la confidentialité de ses
        identifiants. Toute activité depuis le compte est réputée effectuée par son titulaire.
      </p>

      <h2>4. Données sociales connectées</h2>
      <p>
        Lorsque vous connectez une page Facebook ou un compte TikTok via OAuth, Monetiq accède
        uniquement aux scopes que vous autorisez explicitement (lecture de métriques publiques
        et privées de la page). <strong>Les tokens sont chiffrés en base et jamais partagés
        avec un tiers</strong>. Vous pouvez révoquer l'accès à tout moment depuis votre dashboard
        Meta ou TikTok, ainsi que depuis votre tableau de bord Monetiq.
      </p>

      <h2>5. Abonnements et paiement</h2>
      <p>
        Le Service propose des plans Créateur (gratuit), Pro et Agence. Le paiement est mensuel
        ou annuel, à l'avance. Les moyens acceptés incluent Wave, Orange Money, MTN Mobile
        Money, Moov Money, Free Money, ainsi que les cartes bancaires (via Stripe) et PayPal.
      </p>
      <p>
        Les abonnements se renouvellent automatiquement sauf annulation dans le tableau de
        bord. Aucun remboursement n'est dû sur la période en cours, sauf disposition légale
        contraire.
      </p>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        Monetiq conserve l'intégralité des droits sur le Service, sa marque, ses interfaces,
        son code et son orchestration IA. Vous conservez la propriété de vos contenus uploadés
        et des outputs IA générés à partir de vos prompts, à condition d'avoir un abonnement
        actif. La résiliation de votre compte n'efface pas les contenus que vous avez déjà
        exportés.
      </p>

      <h2>7. Engagements de l'utilisateur</h2>
      <p>L'utilisateur s'engage à ne pas :</p>
      <ul>
        <li>Utiliser le Service à des fins illégales, frauduleuses ou trompeuses ;</li>
        <li>Auditer ou analyser un compte sans en avoir les droits ;</li>
        <li>Revendre l'accès au Service à un tiers en dehors du plan Agence ;</li>
        <li>Tenter de reverse-engineerer, scraper ou contourner les protections techniques ;</li>
        <li>Utiliser le contenu généré pour de la désinformation ou du contenu sensible.</li>
      </ul>

      <h2>8. Disponibilité et SLA</h2>
      <p>
        Le Service vise une disponibilité de 99,9 % en moyenne mensuelle. En cas d'incident, le
        statut public est disponible sur{" "}
        <a href="/status">monetiq.ai/status</a>. Les abonnés Agence bénéficient d'un SLA renforcé
        contractuel.
      </p>

      <h2>9. Responsabilité</h2>
      <p>
        Monetiq fournit le Service « tel quel ». Les estimations de revenus, scores IA et
        recommandations sont fournies à titre indicatif et ne constituent pas un conseil
        financier ou juridique. La responsabilité totale de Monetiq est limitée au montant payé
        par l'utilisateur sur les 12 derniers mois.
      </p>

      <h2>10. Résiliation</h2>
      <p>
        Vous pouvez supprimer votre compte à tout moment depuis vos paramètres. Monetiq peut
        suspendre ou résilier un compte en cas de violation des CGU, après notification quand
        cela est possible.
      </p>

      <h2>11. Droit applicable</h2>
      <p>
        Les présentes CGU sont régies par le droit sénégalais. Tout litige sera soumis aux
        tribunaux compétents de Dakar, sous réserve des dispositions impératives applicables au
        consommateur.
      </p>

      <h2>12. Contact</h2>
      <p>
        Pour toute question relative aux présentes CGU :{" "}
        <a href="mailto:legal@monetiq.ai">legal@monetiq.ai</a>.
      </p>
    </LegalShell>
  );
}
