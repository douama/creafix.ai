import { LegalShell } from "@/components/marketing/legal-shell";

export const metadata = {
  title: "Mentions légales",
  description: "Informations légales relatives à l'éditeur du site Monetiq AI.",
};

export default function LegalNoticePage() {
  return (
    <LegalShell title="Mentions légales" updatedAt="15 mai 2026" slug="legal">
      <h2>Éditeur du site</h2>
      <ul>
        <li>
          <strong>Raison sociale :</strong> Monetiq AI SARL
        </li>
        <li>
          <strong>Forme juridique :</strong> Société à responsabilité limitée de droit
          sénégalais
        </li>
        <li>
          <strong>Capital social :</strong> 10 000 000 FCFA
        </li>
        <li>
          <strong>Siège social :</strong> Almadies, Dakar — Sénégal
        </li>
        <li>
          <strong>NINEA :</strong> à compléter
        </li>
        <li>
          <strong>RCCM :</strong> à compléter
        </li>
        <li>
          <strong>Email :</strong> <a href="mailto:hello@monetiq.ai">hello@monetiq.ai</a>
        </li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p>Sobé Kandé, cofondateur et CEO.</p>

      <h2>Hébergement</h2>
      <ul>
        <li>
          <strong>Hébergeur applicatif :</strong> Vercel Inc., 440 N Barranca Ave #4133,
          Covina, CA 91723, USA — <a href="https://vercel.com">vercel.com</a>
        </li>
        <li>
          <strong>Base de données et auth :</strong> Supabase Inc., 970 Toa Payoh North,
          #07-04, Singapore 318992 — <a href="https://supabase.com">supabase.com</a>
        </li>
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments composant le site (textes, graphismes, logos, icônes, images,
        sons, vidéos, code, logiciels, organisation, structure et orchestration des agents IA)
        sont la propriété exclusive de Monetiq AI SARL ou de ses concédants. Toute reproduction,
        représentation, modification ou exploitation non autorisée est interdite et engage la
        responsabilité civile et pénale du contrevenant.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans notre{" "}
        <a href="/legal/privacy">politique de confidentialité</a>. Conformément à la loi
        sénégalaise n°2008-12 et au RGPD européen, vous disposez de droits d'accès, de
        rectification, d'effacement, d'opposition et de portabilité sur vos données.
      </p>

      <h2>Cookies</h2>
      <p>
        Voir notre <a href="/legal/cookies">politique cookies</a>.
      </p>

      <h2>Médiation</h2>
      <p>
        En cas de litige non résolu à l'amiable, l'utilisateur consommateur peut recourir à
        une médiation gratuite via les autorités compétentes de son pays.
      </p>

      <h2>Crédits</h2>
      <p>
        Design et développement : équipe Monetiq AI. Iconographie : Lucide. Polices : Inter
        et Sora (Google Fonts).
      </p>
    </LegalShell>
  );
}
