import { LegalShell } from "@/components/marketing/legal-shell";

export const metadata = {
  title: "Politique de confidentialité",
  description: "Comment CreaFix AI traite et protège vos données personnelles.",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Politique de confidentialité" updatedAt="15 mai 2026" slug="privacy">
      <p>
        Cette politique explique comment CreaFix AI SARL (« nous ») collecte, utilise et protège
        les données personnelles des utilisateurs du Service. Elle s'applique en complément du
        RGPD européen, de la loi sénégalaise n°2008-12 sur la protection des données personnelles
        et de toute législation équivalente dans les pays d'utilisation.
      </p>

      <h2>1. Responsable de traitement</h2>
      <p>
        CreaFix AI SARL, dont le siège est situé Almadies, Dakar (Sénégal), est responsable
        du traitement des données collectées via le Service. Contact :{" "}
        <a href="mailto:privacy@creafix.ai">privacy@creafix.ai</a>.
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons les catégories suivantes :</p>
      <ul>
        <li>
          <strong>Données d'inscription</strong> : nom, email, téléphone (optionnel), mot de
          passe haché, langue, pays.
        </li>
        <li>
          <strong>Données sociales</strong> via OAuth Meta et TikTok : identifiants de page,
          métriques publiques et privées, audience, contenus publiés.
        </li>
        <li>
          <strong>Données d'usage</strong> : pages visitées, actions effectuées, IP anonymisée,
          user-agent.
        </li>
        <li>
          <strong>Données de paiement</strong> : moyen utilisé, montants, devises. Nous ne
          stockons jamais les numéros de carte (déléqué à Stripe / PayPal / agrégateurs).
        </li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <ul>
        <li>Fourniture du Service (audit IA, génération, estimation revenus) ;</li>
        <li>Gestion du compte et de la facturation ;</li>
        <li>Amélioration produit (analytics anonymisées) ;</li>
        <li>Communication transactionnelle (rapport prêt, alerte anti-ban) ;</li>
        <li>Communication marketing (avec consentement, désinscription en un clic).</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Selon les cas : exécution du contrat (Service souscrit), consentement (newsletter,
        cookies non essentiels), obligation légale (facturation), intérêt légitime (lutte
        contre la fraude).
      </p>

      <h2>5. Destinataires</h2>
      <p>
        Vos données ne sont jamais vendues. Elles peuvent être partagées avec :
      </p>
      <ul>
        <li>Nos sous-traitants techniques (hébergement Supabase, paiements, observabilité) ;</li>
        <li>Les fournisseurs IA utilisés en arrière-plan, dans le cadre strict de la requête
          (les contenus ne sont jamais utilisés pour entraîner des modèles tiers) ;</li>
        <li>Les autorités, sur réquisition légale uniquement.</li>
      </ul>

      <h2>6. Durée de conservation</h2>
      <ul>
        <li>Données de compte : tant que le compte existe, plus 12 mois après suppression ;</li>
        <li>Audits et contenus générés : 24 mois glissants ou suppression sur demande ;</li>
        <li>Factures : 10 ans (obligation légale).</li>
      </ul>

      <h2>7. Sécurité</h2>
      <ul>
        <li>Chiffrement TLS 1.3 en transit pour toutes les connexions ;</li>
        <li>Chiffrement au repos sur les bases Postgres (AES-256) ;</li>
        <li>Tokens OAuth chiffrés via pgcrypto ;</li>
        <li>Row Level Security (RLS) — vos données sont isolées au niveau base ;</li>
        <li>Authentification à deux facteurs disponible ;</li>
        <li>Audits de sécurité indépendants annuels.</li>
      </ul>

      <h2>8. Vos droits</h2>
      <p>Vous disposez à tout moment des droits suivants :</p>
      <ul>
        <li><strong>Accès</strong> : obtenir copie de vos données ;</li>
        <li><strong>Rectification</strong> : corriger des données inexactes ;</li>
        <li><strong>Suppression</strong> : effacer votre compte et vos données ;</li>
        <li><strong>Portabilité</strong> : récupérer vos données dans un format réutilisable ;</li>
        <li><strong>Opposition</strong> : refuser certains traitements (marketing notamment) ;</li>
        <li><strong>Réclamation</strong> auprès de l'autorité de contrôle (CDP au Sénégal).</li>
      </ul>
      <p>
        Pour exercer vos droits :{" "}
        <a href="mailto:privacy@creafix.ai">privacy@creafix.ai</a> — réponse sous 30 jours.
      </p>

      <h2>9. Transferts internationaux</h2>
      <p>
        Certains sous-traitants peuvent traiter des données hors Afrique (UE, États-Unis). Ces
        transferts s'appuient sur des clauses contractuelles types et des garanties techniques
        (chiffrement, minimisation).
      </p>

      <h2>10. Modifications</h2>
      <p>
        Cette politique peut évoluer. Toute modification substantielle vous sera notifiée par
        email au moins 30 jours avant son entrée en vigueur.
      </p>
    </LegalShell>
  );
}
