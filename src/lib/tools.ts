/**
 * Définitions des pages d'outils SEO programmatiques.
 * Chaque tool a une page publique /tools/[slug] optimisée pour le référencement.
 */

export type Tool = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  ctaLabel: string;
  benefits: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: "shadowban" | "monetization" | "rpm" | "trends";
  emoji: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "tiktok-monetization-checker",
    title: "TikTok Monetization Checker",
    h1: "Vérifie en 60s pourquoi ton TikTok n'est pas monétisé",
    description:
      "Outil IA gratuit qui audite ton compte TikTok et détecte tous les blocages de monétisation : éligibilité Creator Fund, watch time, contenus à risque, opportunités RPM.",
    inputLabel: "URL ou @handle TikTok",
    inputPlaceholder: "@ton_compte ou https://tiktok.com/@ton_compte",
    ctaLabel: "Lancer le scan TikTok",
    benefits: [
      {
        title: "Éligibilité Creator Fund",
        desc: "Score live de ton éligibilité aux programmes monétisation TikTok (Creator Rewards, Effect House, Live Gifts).",
      },
      {
        title: "Watch time analysis",
        desc: "Diagnostic du watch time sur tes 30 dernières vidéos avec seuils par pays africain.",
      },
      {
        title: "Détection contenus à risque",
        desc: "Identifie les vidéos qui plafonnent ta monétisation (copyright, NSFW, low-quality).",
      },
      {
        title: "Prédiction RPM par pays",
        desc: "Calcule ton RPM potentiel selon ton audience géographique (Sénégal, Nigeria, Maroc…).",
      },
    ],
    faq: [
      {
        q: "Combien de temps prend le scan ?",
        a: "Le scan IA prend 45 à 60 secondes. Il analyse tes 30 dernières vidéos, ton historique d'engagement et les signaux de l'algorithme TikTok.",
      },
      {
        q: "Quels critères TikTok exige pour monétiser ?",
        a: "TikTok Creator Rewards exige : 18 ans minimum, 10 000 abonnés, 100 000 vues sur 30 jours, vidéos originales de 1 minute minimum, respect des règles communautaires.",
      },
      {
        q: "Pourquoi mon compte TikTok n'est pas monétisé en Afrique ?",
        a: "Le Creator Rewards Program est progressivement déployé en Afrique. Sénégal, Côte d'Ivoire, Nigeria, Maroc et Afrique du Sud ont accès aux Live Gifts. Le RPM ads dépend du pays de ton audience.",
      },
    ],
    metaTitle: "TikTok Monetization Checker · Audit gratuit IA · CreaFix AI",
    metaDescription:
      "Vérifie en 60s pourquoi ton compte TikTok n'est pas monétisé. Audit IA gratuit : Creator Fund, watch time, contenus à risque, RPM par pays africain.",
    keywords: [
      "TikTok monetization checker",
      "TikTok Creator Fund Afrique",
      "vérifier monétisation TikTok",
      "RPM TikTok par pays",
      "audit TikTok IA",
    ],
    category: "monetization",
    emoji: "🎵",
  },
  {
    slug: "facebook-shadowban-checker",
    title: "Facebook Shadowban Checker",
    h1: "Détecte si ta page Facebook est shadowban en 30s",
    description:
      "Outil IA qui détecte les shadowbans et limitations algorithmiques sur ta page Facebook : portée réduite, démonétisation cachée, contenus bloqués.",
    inputLabel: "URL ou nom de ta page Facebook",
    inputPlaceholder: "facebook.com/ta_page ou nom exact",
    ctaLabel: "Scanner ma page Facebook",
    benefits: [
      {
        title: "12 signatures de shadowban",
        desc: "L'IA détecte les patterns de shadowban Meta (reach drop, reach plateau, post limit, comment shadowban).",
      },
      {
        title: "Reach Health Score",
        desc: "Score 0-100 de la santé algorithmique de ta page comparée à ta moyenne historique 30 jours.",
      },
      {
        title: "Détection démonétisation",
        desc: "Identifie les vidéos In-Stream qui ne génèrent plus d'ad revenue malgré l'éligibilité.",
      },
      {
        title: "Plan de récupération",
        desc: "Recommandations IA actionnables pour sortir d'un shadowban en 7 à 21 jours.",
      },
    ],
    faq: [
      {
        q: "Qu'est-ce qu'un shadowban Facebook ?",
        a: "Un shadowban est une limitation invisible de ta portée par l'algorithme Meta. Tes posts sont moins distribués sans notification officielle. Causes : contenus signalés, fake engagement, copyright, spam.",
      },
      {
        q: "Comment sortir d'un shadowban ?",
        a: "Stop tout posting 48-72h, supprime les contenus à risque, varie tes formats, augmente les Lives, désactive les automations. Le shadowban dure typiquement 14-21 jours.",
      },
      {
        q: "Le checker est-il vraiment gratuit ?",
        a: "Oui, le diagnostic basique est 100% gratuit, sans carte bancaire. Le plan de récupération détaillé nécessite un compte CreaFix AI gratuit.",
      },
    ],
    metaTitle: "Facebook Shadowban Checker · Détection IA gratuite · CreaFix AI",
    metaDescription:
      "Détecte en 30s si ta page Facebook est shadowban. Audit IA : 12 signatures détectées, Reach Health Score, plan de récupération.",
    keywords: [
      "Facebook shadowban checker",
      "détecter shadowban Facebook",
      "page Facebook portée baisse",
      "démonétisation Facebook",
      "reach Facebook diminue",
    ],
    category: "shadowban",
    emoji: "🛡️",
  },
  {
    slug: "creator-rpm-calculator",
    title: "Creator RPM Calculator Africa",
    h1: "Calcule ton RPM réel par pays africain en 10s",
    description:
      "Estime ton RPM (revenu pour 1 000 vues) selon ton pays cible. Données réelles 2026 pour Sénégal, Nigeria, Côte d'Ivoire, Maroc, Afrique du Sud, Cameroun, Ghana, Mali, RDC.",
    inputLabel: "Pays principal de ton audience",
    inputPlaceholder: "Sélectionne ton pays cible",
    ctaLabel: "Calculer mon RPM",
    benefits: [
      {
        title: "RPM réel par pays",
        desc: "Données 2026 mises à jour : Sénégal $1.80, Nigeria $2.40, Maroc $3.10, Afrique du Sud $2.90, Côte d'Ivoire $1.60.",
      },
      {
        title: "Multi-plateformes",
        desc: "Compare le RPM TikTok, YouTube, Facebook, Instagram, X, Twitch sur le même pays.",
      },
      {
        title: "Projection revenus 30j",
        desc: "Estime tes revenus mensuels selon tes vues moyennes et ta géographie d'audience.",
      },
      {
        title: "Opportunités niches",
        desc: "Identifie les niches à RPM élevé : finance (×2.8), tech (×2.1), business (×1.9) vs lifestyle.",
      },
    ],
    faq: [
      {
        q: "Qu'est-ce que le RPM ?",
        a: "Le RPM (Revenue Per Mille) est le revenu généré pour 1 000 vues monétisées. Il dépend du pays, de la niche, du format et de la plateforme.",
      },
      {
        q: "Pourquoi le RPM est-il bas en Afrique ?",
        a: "Le CPM advertiser est plus bas en Afrique vs USA/Europe car les annonceurs paient moins pour cibler ces marchés. Mais les niches business/tech/finance ont des RPM compétitifs.",
      },
      {
        q: "Comment augmenter mon RPM ?",
        a: "Cible audiences à fort pouvoir d'achat (diaspora, expat), produit niches haut RPM, optimise watch time complet, active formats premium (Lives, longs YT, Reels Bonus).",
      },
    ],
    metaTitle: "RPM Calculator Afrique · Estime tes revenus créateur · CreaFix AI",
    metaDescription:
      "Calcule ton RPM réel par pays africain en 10s. Données 2026 : Sénégal, Nigeria, Maroc, Côte d'Ivoire. Multi-plateformes.",
    keywords: [
      "RPM calculator Afrique",
      "RPM TikTok Sénégal",
      "RPM YouTube Nigeria",
      "revenu créateur Afrique",
      "calcul revenus TikTok",
    ],
    category: "rpm",
    emoji: "💰",
  },
  {
    slug: "africa-tiktok-trends",
    title: "Africa TikTok Trends 2026",
    h1: "Tous les TikTok trends Afrique en temps réel",
    description:
      "Sons, hashtags, niches et créneaux trending dans 9 pays africains. Mise à jour hebdomadaire par l'IA CreaFix.",
    inputLabel: "Choisis ton pays africain",
    inputPlaceholder: "Sélectionne un pays",
    ctaLabel: "Voir les trends de mon pays",
    benefits: [
      {
        title: "Sons trending par pays",
        desc: "Top 10 musiques utilisées par les créateurs TikTok au Sénégal, Nigeria, Côte d'Ivoire, Maroc, etc.",
      },
      {
        title: "Hashtags hot 2026",
        desc: "Hashtags à fort momentum local : #dakartwitter, #abidjantiktok, #afrobeats, #amapiano, #darija.",
      },
      {
        title: "Niches montantes",
        desc: "Finance mobile money, fintech, e-commerce wave, business Afrique : niches à fort RPM identifiées.",
      },
      {
        title: "Best posting times",
        desc: "Créneaux de publication optimaux par pays : 20-22h Dakar, 21-23h Lagos, 22h-01h Rabat.",
      },
    ],
    faq: [
      {
        q: "À quelle fréquence sont mis à jour les trends ?",
        a: "Les sons et hashtags sont mis à jour quotidiennement, les niches et créneaux toutes les semaines, basés sur le scan des comptes performants par pays.",
      },
      {
        q: "Quels pays africains sont couverts ?",
        a: "9 pays : Sénégal 🇸🇳, Côte d'Ivoire 🇨🇮, Nigeria 🇳🇬, Cameroun 🇨🇲, Maroc 🇲🇦, Afrique du Sud 🇿🇦, Ghana 🇬🇭 (bientôt), Mali 🇲🇱 (bientôt), RDC 🇨🇩 (bientôt).",
      },
      {
        q: "Comment utiliser un son trending ?",
        a: "Sur TikTok, clique sur le son d'une vidéo trending → 'Utiliser ce son' → enregistre ton contenu. La fenêtre virale dure 7 à 14 jours en moyenne.",
      },
    ],
    metaTitle: "Africa TikTok Trends 2026 · Sons & hashtags par pays · CreaFix AI",
    metaDescription:
      "Tous les TikTok trends Afrique 2026 en temps réel : sons, hashtags, niches, créneaux pour Sénégal, Nigeria, Côte d'Ivoire, Maroc.",
    keywords: [
      "TikTok trends Afrique",
      "sons trending Sénégal",
      "hashtags trending Nigeria",
      "Africa TikTok 2026",
      "trends afrobeats TikTok",
    ],
    category: "trends",
    emoji: "🔥",
  },
  {
    slug: "instagram-reels-bonus-checker",
    title: "Instagram Reels Bonus Eligibility",
    h1: "Vérifie ton éligibilité au programme Reels Play Bonus",
    description:
      "Outil gratuit qui vérifie si ton compte Instagram est éligible au programme Reels Play Bonus Meta. Détecte les blocages et propose un plan d'activation.",
    inputLabel: "URL ou @handle Instagram",
    inputPlaceholder: "@ton_compte_ig",
    ctaLabel: "Vérifier mon éligibilité Reels",
    benefits: [
      {
        title: "Score d'éligibilité 0-100",
        desc: "Diagnostic complet des critères Meta : âge, abonnés, engagement, originalité, conformité.",
      },
      {
        title: "Pays africains supportés",
        desc: "Le programme Reels Play Bonus est dispo au Nigeria, Maroc, Afrique du Sud, Kenya. Roll-out progressif Sénégal, CI.",
      },
      {
        title: "Plan d'activation",
        desc: "Étapes IA pour activer le bonus si ton score est entre 70-95% (les comptes au-dessus de 95% sont automatiquement éligibles).",
      },
      {
        title: "Projection revenus Reels",
        desc: "Estime tes revenus Reels Bonus selon ton volume de vues et ton pays.",
      },
    ],
    faq: [
      {
        q: "Qu'est-ce que le Reels Play Bonus ?",
        a: "Programme Meta qui paie les créateurs Instagram pour les vues sur leurs Reels, indépendamment des ads. Activé sur invitation, basé sur la performance.",
      },
      {
        q: "Le bonus existe-t-il en Afrique ?",
        a: "Oui, le programme Reels Play Bonus est actif au Nigeria, Maroc, Afrique du Sud, Kenya. D'autres pays sont en roll-out (Sénégal, Côte d'Ivoire, Ghana).",
      },
      {
        q: "Combien rapporte le programme ?",
        a: "Très variable selon le marché : $0.02 à $0.05 par 1000 vues Reels en Afrique. Top créateurs peuvent gagner $1000-5000/mois sur ce programme seul.",
      },
    ],
    metaTitle: "Instagram Reels Bonus Checker · Éligibilité gratuite · CreaFix AI",
    metaDescription:
      "Vérifie ton éligibilité au programme Reels Play Bonus Meta. Score 0-100, pays africains supportés, plan d'activation.",
    keywords: [
      "Instagram Reels Bonus",
      "Reels Play Bonus Afrique",
      "Meta Reels monétisation",
      "Instagram payout Afrique",
      "éligibilité Reels Bonus",
    ],
    category: "monetization",
    emoji: "📸",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
