/**
 * Playbooks par plateforme — source unique de vérité pour le contexte
 * spécifique-plateforme injecté dans les system prompts des agents IA
 * (audit, monetization, anti-ban) et dans la roadmap 30 jours rendue côté UI.
 *
 * Chaque playbook capture la réalité opérationnelle d'une plateforme :
 *   - Programmes de monétisation actifs + seuils d'éligibilité exacts
 *   - Risques majeurs côté shadowban / démonétisation
 *   - Leviers de visibilité spécifiques au format de la plateforme
 *   - Roadmap par défaut sur 4 semaines, utilisée par l'UI quand le LLM
 *     n'a pas généré de plan complet.
 *
 * Les sections "Problèmes critiques", "Opportunités IA" et "Plan d'action
 * 30 jours" de la page audit deviennent automatiquement plateforme-aware
 * via les prompts (LLM) et le fallback UI (plan 30j).
 */

import type { PlatformId } from "@/lib/platforms";

export type PlatformPlaybook = {
  id: PlatformId;
  name: string;
  /** Programmes de monétisation + seuils — injecté dans MONET_SYSTEM_PROMPT. */
  monetization: string;
  /** Risques shadowban/démonétisation spécifiques — injecté dans ANTIBAN_SYSTEM_PROMPT. */
  risks: string;
  /** Leviers de visibilité/engagement spécifiques au format — injecté dans AUDIT_SYSTEM_PROMPT. */
  levers: string;
  /** Roadmap 30j par défaut quand l'LLM ne couvre pas. */
  actionPlan30d: {
    week1: string[];
    week23: string[];
    week4: string[];
  };
  /** Issues par défaut (mock) — utilisées quand le LLM tombe en fallback. */
  defaultIssues: { severity: "low" | "medium" | "high"; title: string; scope: string }[];
  /** Actions monétisation par défaut (mock) — utilisées quand le LLM tombe en fallback. */
  defaultMonetActions: string[];
  /** Risques anti-ban par défaut (mock) — utilisés quand le LLM tombe en fallback. */
  defaultAntibanRisks: {
    type: "copyright" | "fake_engagement" | "sensitive" | "spam" | "recycled" | "policy";
    severity: "low" | "medium" | "high";
    message: string;
  }[];
};

const FACEBOOK: PlatformPlaybook = {
  id: "FACEBOOK",
  name: "Facebook",
  monetization: [
    "In-Stream Ads : Page éligible avec 10K abonnés + 600 000 minutes de visionnage cumulées sur 60 jours + 5 vidéos actives ≥ 1 min.",
    "Reels Play Bonus : sur invitation uniquement, dépend de la perf des Reels (vues, watch time).",
    "Facebook Stars : Pages ≥ 1K abonnés + résident d'un pays éligible + respect Partner Monetization Policies.",
    "Subscriptions : Pages ≥ 10K abonnés + 50K engagement sur 60j + invité par Meta.",
    "Branded Content (Brand Collabs Manager) : tag obligatoire pour tout partenariat sponsorisé.",
  ].join("\n"),
  risks: [
    "Démonétisation auto sur contenu recyclé tierce-partie (Original Content Policy stricte depuis 2023).",
    "Strikes Community Standards : clickbait, fake news, engagement bait → reach divisé par 5.",
    "Shadowban Page : trop de partages externes vers domaines low-trust.",
    "Music copyright : musique commerciale détectée dans vidéos → blocage régional ou démon.",
  ].join("\n"),
  levers: [
    "Format dominant pour les revenus : vidéos natives 3-10 min (In-Stream Ads payent à partir de 1 min).",
    "Native upload obligatoire (jamais de lien YouTube — réduit reach × 5).",
    "Captions baked-in : 85% des vidéos sont regardées en muet.",
    "Reels 7-30s pour la découverte, complément des vidéos longues pour le revenu.",
    "Engagement le plus rentable : commentaires longs (>10 mots) > partages > likes.",
  ].join("\n"),
  actionPlan30d: {
    week1: [
      "Vérifier l'éligibilité In-Stream Ads dans Meta Business Suite → Monétisation",
      "Supprimer les vidéos repostées tierce-partie (risque Original Content Policy)",
      "Activer la monétisation des Reels dans Creator Studio si éligible",
    ],
    week23: [
      "Publier 2 vidéos natives 3-5 min/semaine (durée minimum pour In-Stream)",
      "Publier 3 Reels 15-30s/semaine pour alimenter la découverte",
      "Faire 1 Live ≥ 4 min/semaine pour activer Stars + monetization Live",
    ],
    week4: [
      "Activer In-Stream Ads via Creator Studio (si seuils 10K + 600K min atteints)",
      "Tester Facebook Stars en Live (CTA fixe : sticker Stars visible 3× par live)",
      "Pitcher 3 marques via Brand Collabs Manager pour 1 partenariat sponsorisé",
    ],
  },
  defaultIssues: [
    { severity: "high",   title: "Vidéos repostées tierce-partie — violation Original Content Policy", scope: "Anti-Ban" },
    { severity: "medium", title: "Watch time 60j insuffisant pour activer In-Stream Ads", scope: "Monetization" },
    { severity: "low",    title: "Aucun lien vers une Page Facebook éligible monétisation", scope: "SEO" },
  ],
  defaultMonetActions: [
    "Vérifier l'éligibilité In-Stream Ads dans Meta Business Suite → Monétisation",
    "Publier 2 vidéos natives 3-5 min/semaine pour cumuler le watch time 60j",
    "Activer Facebook Stars en Live (sticker visible 3× par session)",
  ],
  defaultAntibanRisks: [
    { type: "recycled", severity: "high",   message: "Vidéos repostées détectées — Original Content Policy déclenchée" },
    { type: "copyright", severity: "medium", message: "Musique commerciale dans 2 vidéos — risque blocage régional" },
    { type: "policy",   severity: "low",    message: "Conforme aux standards communautaires Meta cette semaine" },
  ],
};

const INSTAGRAM: PlatformPlaybook = {
  id: "INSTAGRAM",
  name: "Instagram",
  monetization: [
    "Reels Play Bonus : programme sur invitation, suspendu en 2024 dans la plupart des pays — ne plus le compter comme acquis.",
    "Subscriptions : compte Créateur ≥ 10K abonnés + pays éligible (US/EU/UK/BR principalement).",
    "Badges en Live : compte Pro 18+, ≥ 10K abonnés, pays éligible.",
    "Branded Content (Partnership Ads) : aucun seuil, mais tag #ad obligatoire + Brand Partner approval.",
    "Affiliate (commission shop) : US uniquement à date — non disponible en Afrique.",
    "Note : pas d'In-Stream Ads sur Instagram — la monétisation passe surtout par Branded Content et brand deals.",
  ].join("\n"),
  risks: [
    "Shadowban hashtags : utiliser un hashtag banni (ex #beautyblogger longtemps banni) → reach × 0.1 pendant 14j.",
    "Music copyright : musique commerciale OK en Story, BLOQUÉE en Reel pour comptes Pro/Business.",
    "Engagement bait (\"like si tu es d'accord\") → strikes + downranking algo.",
    "Trop de #ad sans Partnership tag officiel → strike + suspension monetization.",
  ].join("\n"),
  levers: [
    "Reels 7-15s avec rétention 100% (boucle parfaite) → boost algo majeur.",
    "Hook visuel obligatoire dans la frame 1 (texte overlay, mouvement, contraste).",
    "Captions 125+ caractères avec question à la fin → 3-5× plus de commentaires.",
    "Carrousels 10 slides : 2× plus de portée que photo unique (algo favorise temps passé).",
    "Hashtags : 5-15 mix niche/local/large — pas plus, sinon downrank.",
  ].join("\n"),
  actionPlan30d: {
    week1: [
      "Convertir le compte en Professionnel (Créateur ou Entreprise) si pas déjà fait",
      "Lier le compte à une Page Facebook (obligatoire pour Branded Content et Badges)",
      "Supprimer les Reels < 1% engagement (drag down du score qualité du compte)",
    ],
    week23: [
      "Publier 4 Reels 7-15s/semaine avec hook frame 1 + sous-titres baked-in",
      "Publier 2 carrousels SEO-friendly/semaine (caption 125+ chars + question finale)",
      "Tenir 2 stories/jour minimum avec sticker interactif (sondage, question, quiz)",
    ],
    week4: [
      "Activer les Badges Live (si éligible) + tenir 1 Live ≥ 30 min/semaine",
      "Configurer Brand Partner tag dans Settings → Branded Content",
      "Pitcher 5 marques en DM avec media kit + tarif story/reel/post",
    ],
  },
  defaultIssues: [
    { severity: "high",   title: "Hashtags potentiellement bannis détectés — reach Reel divisé par 10",     scope: "SEO" },
    { severity: "medium", title: "Musique commerciale dans Reels — risque blocage (autorisée en Story seulement)", scope: "Anti-Ban" },
    { severity: "low",    title: "Compte non lié à une Page Facebook — Badges Live & Branded Content bloqués", scope: "Monetization" },
  ],
  defaultMonetActions: [
    "Convertir en compte Créateur + activer Badges en Live",
    "Configurer Brand Partner tag pour autoriser les Partnership Ads",
    "Construire un media kit + pitcher 5 marques en DM cette semaine",
  ],
  defaultAntibanRisks: [
    { type: "spam",      severity: "high",   message: "Hashtags bannis détectés — vérifier la liste Instagram dans Creator Studio" },
    { type: "copyright", severity: "medium", message: "Musique commerciale dans Reels — autorisée en Story seulement pour comptes Pro" },
    { type: "policy",    severity: "low",    message: "Pas de strikes Community Standards cette semaine" },
  ],
};

const TIKTOK: PlatformPlaybook = {
  id: "TIKTOK",
  name: "TikTok",
  monetization: [
    "Creator Rewards Program : 10K abonnés + 100K vues sur 30j + ≥ 18 ans + vidéos qualifiantes ≥ 1 min (remplace Creator Fund).",
    "TikTok LIVE Gifts : 1K abonnés + 18+ + 30 jours sans violation.",
    "Series (contenu payant) : 10K abonnés + 18+ + compte sans strike récent.",
    "Creator Marketplace : open access, mais brand deals premium à partir de 10K abonnés actifs.",
    "TikTok Shop affiliate : 1K abonnés + pays éligible (US/UK/SEA principalement).",
  ].join("\n"),
  risks: [
    "Copyright audio TRÈS strict : musique commerciale non-libre dans une vidéo pro = vidéo muet ou retirée + drop de reach.",
    "Hashtags bannis (la liste change toutes les semaines) → vidéo invisible dans le For You.",
    "Vidéos recyclées (watermark visible Reels/Shorts/Snap) → score qualité du compte effondré.",
    "Engagement suspect (pic likes anormal) → audit auto + downrank.",
    "Mots-clés sensibles dans captions/audio (CBD, armes, alcool) → exclu monétisation.",
  ].join("\n"),
  levers: [
    "Hook 1-3 secondes critique : 70% des abandons surviennent avant 3s.",
    "Sons trending (page Découvrir) dans les 72h de leur émergence → boost x10 reach.",
    "Sous-titres natifs (TikTok Captions auto) + texte overlay : 80% en muet partout.",
    "Vidéos ≥ 1 min obligatoires pour Creator Rewards (vidéos < 1 min ne payent PAS).",
    "Hashtags : 3-5 max, mix #fyp + 1 niche + 1 local (#senegal, #abidjan…).",
    "Calls-to-comment dans la caption (\"D'accord ? Dis-le en commentaire\") → boost rétention.",
  ].join("\n"),
  actionPlan30d: {
    week1: [
      "Audit musique : supprimer/republier les posts avec sons commerciaux flaggés (Creator Center → Musique)",
      "Optimiser la bio : niche claire + emoji + lien Linktree si compte Pro",
      "Publier 1 vidéo ≥ 1 min sur un son trending (vu sur la page Découvrir des 72h)",
    ],
    week23: [
      "Tenir 3 vidéos ≥ 1 min/semaine (durée minimum pour Creator Rewards)",
      "Baker des sous-titres dans toutes les vidéos + hook visuel dans la frame 1",
      "Tester 1 LIVE de 30+ min par semaine (active la mécanique LIVE Gifts à 1K)",
    ],
    week4: [
      "Activer Creator Rewards dans Creator Center (si 10K abonnés + 100K vues atteints)",
      "Pitcher 3 marques sur Creator Marketplace avec un brief vidéo personnalisé",
      "Tester Series : 1 saison payante 3-5 épisodes sur un sujet niche fort",
    ],
  },
  defaultIssues: [
    { severity: "high",   title: "Sons commerciaux non-libres détectés — risque mute + exclusion Creator Rewards", scope: "Anti-Ban" },
    { severity: "medium", title: "Vidéos < 1 min majoritaires — non éligibles aux Creator Rewards payouts",       scope: "Monetization" },
    { severity: "low",    title: "Hashtags trop génériques (#fyp seul) — diluent le ciblage For You",             scope: "SEO" },
  ],
  defaultMonetActions: [
    "Publier 3 vidéos ≥ 1 min cette semaine pour qualifier au Creator Rewards Program",
    "Tenir 1 LIVE de 30+ min/sem pour activer LIVE Gifts (palier 1K abonnés)",
    "Postuler au Creator Marketplace pour brand deals premium ≥ 10K abonnés",
  ],
  defaultAntibanRisks: [
    { type: "copyright", severity: "high",   message: "Sons commerciaux dans 3 vidéos récentes — risque mute audio + drop reach For You" },
    { type: "recycled",  severity: "medium", message: "Watermarks Reels/Shorts visibles — score qualité TikTok dégradé" },
    { type: "spam",      severity: "low",    message: "Hashtags conformes à la liste autorisée TikTok cette semaine" },
  ],
};

const YOUTUBE: PlatformPlaybook = {
  id: "YOUTUBE",
  name: "YouTube",
  monetization: [
    "YouTube Partner Program (YPP) : 1 000 abonnés + 4 000 heures de visionnage public sur 12 mois OU 10M vues Shorts sur 90j.",
    "Shorts Fund / Shorts Ads Revenue Sharing : depuis 2023, partage de revenus pub Shorts pour membres YPP.",
    "Channel Memberships : 1K abonnés + YPP actif + chaîne non « Made for Kids ».",
    "Super Chat / Super Thanks / Super Stickers : YPP actif + pays éligible.",
    "Merch Shelf : 10K abonnés + YPP actif + revendeur partenaire (Teespring, etc.).",
  ].join("\n"),
  risks: [
    "Content ID claim : musique non-libre détectée → revenus de la vidéo redirigés vers ayant-droit (pas démonétisation, mais 0 revenu).",
    "Strikes copyright : 3 strikes = chaîne supprimée. Strike communautaire = upload bloqué 14j.",
    "Démonétisation auto par sujets « advertiser-unfriendly » (politique, sexualité, violence, gambling).",
    "Reuploadeur tierce-partie : démonétisation channel-wide + risque suspension YPP.",
    "Age-restriction par algo : reach divisé par 4 et exclu Shorts feed.",
  ].join("\n"),
  levers: [
    "CTR thumbnail > 6% (sinon YouTube arrête de pousser la vidéo après 24h).",
    "Retention courbe sans drop W1 (pas de drop > 15% dans les 30 premières secondes).",
    "Description SEO 200+ mots avec mots-clés naturels + 3-5 timestamps cliquables.",
    "End screens chaînés (vidéo précédente + playlist + abonnement) sur 20 dernières secondes.",
    "Shorts ≤ 60s pour exposition + vidéos longues pour le revenu (mix obligatoire 2024+).",
    "Premières 30 secondes : énoncer 3× la promesse, pas d'intro animée.",
  ].join("\n"),
  actionPlan30d: {
    week1: [
      "Auditer Content ID claims dans YouTube Studio → Monétisation (remplacer musique flaggée par YouTube Audio Library)",
      "Refaire 3 thumbnails les plus consultées avec visage + texte fort + couleurs contrastées",
      "Réécrire les descriptions des 5 vidéos top : 200+ mots, timestamps, mots-clés naturels",
    ],
    week23: [
      "Publier 1 vidéo longue (8-15 min) par semaine + 3 Shorts/semaine",
      "Ajouter end screens + cards (chained playlist) sur toutes les vidéos",
      "Tester 2 hooks dans les 30 premières secondes pour identifier le pattern qui retient",
    ],
    week4: [
      "Soumettre dossier YPP (si 1K abonnés + 4K heures OU 10M vues Shorts atteints)",
      "Activer Super Thanks dès YPP validé (CTA verbal à la fin de chaque vidéo)",
      "Planifier 1 série de 4 vidéos sur un mot-clé SEO ciblé (analyse VidIQ/TubeBuddy)",
    ],
  },
  defaultIssues: [
    { severity: "high",   title: "Content ID claims actifs sur 3 vidéos — revenus redirigés vers ayants-droit", scope: "Monetization" },
    { severity: "medium", title: "CTR thumbnails < 4% — algo arrête de pousser les vidéos après 24h",          scope: "SEO" },
    { severity: "low",    title: "Descriptions < 100 mots — opportunité SEO YouTube manquée",                  scope: "SEO" },
  ],
  defaultMonetActions: [
    "Remplacer la musique sous Content ID par la YouTube Audio Library pour récupérer 100% des revenus",
    "Atteindre les 4 000 heures de visionnage / 12 mois pour soumettre le dossier YouTube Partner Program",
    "Activer Super Thanks et Channel Memberships dès validation YPP",
  ],
  defaultAntibanRisks: [
    { type: "copyright", severity: "high",   message: "Content ID claims actifs — revenus redirigés vers ayants-droit (pas démon, mais 0 €)" },
    { type: "policy",    severity: "medium", message: "Sujets sensibles potentiellement advertiser-unfriendly détectés sur 2 vidéos" },
    { type: "spam",      severity: "low",    message: "Comportement abonnement et engagement organique cette semaine" },
  ],
};

const X: PlatformPlaybook = {
  id: "X",
  name: "X (Twitter)",
  monetization: [
    "Ads Revenue Share : abonné X Premium + 500 abonnés + 5M impressions cumulées sur 3 mois.",
    "Creator Subscriptions : 500 abonnés + 18+ + payés mensuel après commission Apple/Google (30%).",
    "Tips : 18+ + compte vérifié + pays éligible (USA, plusieurs EU, peu d'Afrique).",
    "Marketplace brand deals : non officiel — passe par négociation directe (DM, Open to Work).",
  ].join("\n"),
  risks: [
    "Pénalité reach sur tweets contenant un lien externe (X pousse à rester sur la plateforme) → 30-50% de portée en moins.",
    "Détection spam : poster > 50 fois/jour ou patterns répétés → shadowban temporaire.",
    "Agression policy : insultes / harcèlement → suspension + perte Revenue Share.",
    "Fake engagement détecté (achat followers, automatisation) → ban Premium subscription.",
  ].join("\n"),
  levers: [
    "Threads 5-10 tweets : 4× plus d'impressions qu'un tweet unique (algo récompense le temps passé).",
    "Photos/vidéos en attachement : +30% engagement vs tweet texte seul.",
    "Polls : 2× retweets vs tweet normal (algo veut de l'interaction).",
    "Reply rapide (< 1h) sur tweets viraux dans ta niche → exposure piggyback.",
    "Spaces (audio live) hebdo : engagement + niche authority + monétisation directe.",
  ].join("\n"),
  actionPlan30d: {
    week1: [
      "Souscrire X Premium (obligatoire pour Revenue Share)",
      "Optimiser la bio : niche claire + 3 mots-clés + lien (en sachant que le lien réduit la portée)",
      "Auditer les 30 derniers tweets : supprimer ceux contenant un lien externe sans engagement",
    ],
    week23: [
      "Publier 3 threads/semaine (5-10 tweets, hook fort dans le tweet 1)",
      "Tenir 5 tweets/jour minimum (sans contenu identique)",
      "Faire 1 Space de 30 min/semaine sur ta niche pour bâtir autorité",
    ],
    week4: [
      "Activer Revenue Share (si 500 abonnés + 5M impressions atteints, X Studio → Monétisation)",
      "Lancer Creator Subscriptions à 3-5$/mois avec contenu exclusif réel",
      "Booster 1 tweet phare (Promoted) pour test ROI brand awareness",
    ],
  },
  defaultIssues: [
    { severity: "high",   title: "Tweets avec liens externes — pénalité reach 30-50% par l'algo X",      scope: "SEO" },
    { severity: "medium", title: "Sans abonnement X Premium — Revenue Share et badge bleu non actifs", scope: "Monetization" },
    { severity: "low",    title: "Pas de threads (5-10 tweets) — engagement par tweet 4× plus faible",  scope: "Engagement" },
  ],
  defaultMonetActions: [
    "Souscrire X Premium pour débloquer Revenue Share (5M impressions/3 mois requises)",
    "Lancer Creator Subscriptions à 3-5$/mois sur contenu exclusif niche",
    "Tenir 1 Space hebdo pour bâtir autorité + monétisation directe par Tips",
  ],
  defaultAntibanRisks: [
    { type: "spam",            severity: "medium", message: "Tweets avec lien externe sans engagement — possible downrank algo" },
    { type: "fake_engagement", severity: "low",    message: "Pas de patterns suspects sur les retweets cette semaine" },
    { type: "policy",          severity: "low",    message: "Aucune violation hateful conduct détectée" },
  ],
};

const SNAPCHAT: PlatformPlaybook = {
  id: "SNAPCHAT",
  name: "Snapchat",
  monetization: [
    "Spotlight Rewards : programme limité, payouts variables selon performance Spotlight (Snap public ≥ 60 sec).",
    "Snap Stars (creator fund) : sur invitation, requiert audience engagée + contenu original.",
    "Mid-roll ads dans Stories Snap Star (sur invitation).",
  ].join("\n"),
  risks: [
    "Contenu reuploadé d'autres plateformes → exclu Spotlight + pas de payout.",
    "Spam stories répétés → reach divisé.",
    "Content guidelines strictes (nudité même implicite, drogue, armes).",
  ].join("\n"),
  levers: [
    "Spotlight ≥ 60s vertical, sans logo plateforme tierce (sinon exclu payouts).",
    "Snaps story quotidiens (consistance > qualité pour algo Stories).",
    "Stickers + lens AR pour engagement.",
  ].join("\n"),
  actionPlan30d: {
    week1: ["Auditer profil Snap : créer Snap Stars-eligible content sans watermark tiers"],
    week23: ["Publier 5 Spotlights ≥ 60s/semaine sur sujets viraux", "Tenir Story quotidienne 24/7"],
    week4: ["Postuler au programme Snap Stars (formulaire creators.snap.com)"],
  },
  defaultIssues: [
    { severity: "high",   title: "Watermarks tierce-partie sur Spotlights — exclu des payouts",            scope: "Anti-Ban" },
    { severity: "medium", title: "Spotlights < 60s — non éligibles aux Spotlight Rewards",                 scope: "Monetization" },
    { severity: "low",    title: "Story non quotidienne — algo Stories pénalise l'inconstance",            scope: "Engagement" },
  ],
  defaultMonetActions: [
    "Publier 5 Spotlights ≥ 60s/semaine sans watermark pour qualifier aux Rewards",
    "Tenir Story quotidienne pour bâtir audience engagée requise par Snap Stars",
    "Postuler au programme Snap Stars dès audience établie",
  ],
  defaultAntibanRisks: [
    { type: "recycled", severity: "high",   message: "Watermarks TikTok/Reels visibles — Spotlight Rewards bloqués" },
    { type: "policy",   severity: "low",    message: "Contenu conforme aux Community Guidelines Snap" },
    { type: "spam",     severity: "low",    message: "Pas de patterns spam détectés cette semaine" },
  ],
};

const TWITCH: PlatformPlaybook = {
  id: "TWITCH",
  name: "Twitch",
  monetization: [
    "Affiliate Program : 50 followers + 500 minutes stream + 7 jours uniques + 3 viewers moyens (atteint en 1-2 semaines).",
    "Partner Program : 75 viewers moyens sur 30j + 25h stream sur 12j sur 30j (très exigeant).",
    "Bits (cheers) : Affiliate + setup Channel Points.",
    "Subscriptions Tier 1/2/3 : Affiliate, 50-50 split (Tier 1 = ~2.50$/sub net créateur).",
  ].join("\n"),
  risks: [
    "DMCA strikes sur musique stream (musique commerciale = strike → 24h ban → permaban à 3).",
    "Hateful conduct policy violations → ban indefini.",
    "Stream sniping / contenu adult sans tag → ban temporaire.",
  ].join("\n"),
  levers: [
    "Stream consistency : même horaire 3-5×/sem > durée totale.",
    "Just Chatting + chat interactif > silence + gameplay solo.",
    "Raids vers autres streamers de taille similaire → bâtir réseau.",
  ].join("\n"),
  actionPlan30d: {
    week1: ["Setup OBS + scenes pro", "Atteindre Affiliate (50 followers, 7 streams)"],
    week23: ["Stream 4× semaine min 2h consistant horaire fixe", "Activer Channel Points + Bits"],
    week4: ["Pousser vers Partner (75 viewers moyens) via collabs/raids", "Monétiser Tier 1 subs"],
  },
  defaultIssues: [
    { severity: "high",   title: "Musique commerciale détectée en stream — risque DMCA strike + ban 24h", scope: "Anti-Ban" },
    { severity: "medium", title: "Horaires de stream irréguliers — fidélisation viewers compromise",       scope: "Engagement" },
    { severity: "low",    title: "Channel Points / Bits non activés — manque interaction monétisable",     scope: "Monetization" },
  ],
  defaultMonetActions: [
    "Atteindre Affiliate (50 followers + 500 min + 7 jours uniques + 3 viewers moyens)",
    "Maintenir un horaire de stream fixe 4×/semaine min 2h pour fidéliser viewers",
    "Activer Tier 1 Subs + Bits dès Affiliate validé",
  ],
  defaultAntibanRisks: [
    { type: "copyright", severity: "high",   message: "Musique commerciale en stream — DMCA strike imminent (3 = perma-ban)" },
    { type: "policy",    severity: "low",    message: "Hateful conduct: aucune violation détectée" },
    { type: "spam",      severity: "low",    message: "Pas de stream-sniping ni de patterns abusifs" },
  ],
};

const PINTEREST: PlatformPlaybook = {
  id: "PINTEREST",
  name: "Pinterest",
  monetization: [
    "Creator Rewards : US uniquement, payouts par challenge mensuel.",
    "Affiliate links (Amazon, ShareASale) : autorisés sur tous les pins.",
    "Brand partnerships : aucun seuil officiel mais audience qualifiée requise.",
  ].join("\n"),
  risks: [
    "Spam pins (mêmes URL répétées) → suspension compte.",
    "Liens affiliés masqués (bit.ly, etc.) → reach divisé.",
    "Pins sans alt-text → SEO Pinterest plombé.",
  ].join("\n"),
  levers: [
    "Idea Pins 5-7 slides verticaux > pin classique 2024+.",
    "Pin descriptions SEO 100+ mots avec mots-clés naturels.",
    "20-30 pins/jour réparties sur boards thématiques cohérents.",
  ].join("\n"),
  actionPlan30d: {
    week1: ["Créer compte Pro + Rich Pins setup + 5 boards thématiques niche"],
    week23: ["Publier 15 Idea Pins/semaine + 20 pins classiques/jour avec SEO description"],
    week4: ["Tester 3 partenariats affiliate (Amazon, etc.)", "Pitcher 3 marques pour partenariat"],
  },
  defaultIssues: [
    { severity: "high",   title: "Pins sans alt-text ni description SEO — moteur Pinterest aveugle", scope: "SEO" },
    { severity: "medium", title: "Liens raccourcis (bit.ly) sur pins — reach divisé par 2",          scope: "Anti-Ban" },
    { severity: "low",    title: "Pas d'Idea Pins (5-7 slides) — format favorisé 2024+ inutilisé",   scope: "Engagement" },
  ],
  defaultMonetActions: [
    "Ajouter alt-text + description SEO 100+ mots sur tous les pins",
    "Publier 15 Idea Pins verticaux/semaine pour maximiser portée",
    "Lancer 3 campagnes affiliate (Amazon, ShareASale) sans liens raccourcis",
  ],
  defaultAntibanRisks: [
    { type: "spam",   severity: "medium", message: "Liens affiliés raccourcis détectés — pins risquent suspension" },
    { type: "policy", severity: "low",    message: "Contenu conforme aux Pinterest Community Guidelines" },
    { type: "fake_engagement", severity: "low", message: "Aucun pattern de repins automatisés détecté" },
  ],
};

const LINKEDIN: PlatformPlaybook = {
  id: "LINKEDIN",
  name: "LinkedIn",
  monetization: [
    "Creator newsletters : disponible si tu actives Creator Mode + > 150 abonnés (gratuit).",
    "LinkedIn Audio Live tips : limité, sur invitation.",
    "Brand collabs B2B : aucun seuil officiel, mais audience cadre/décideur essentielle.",
  ].join("\n"),
  risks: [
    "Engagement pods détectés → reach divisé par 5.",
    "Liens externes en début de post → algorithm penalise (mettre lien en commentaire).",
    "Cross-posting Twitter/IG visible → algo pénalise contenu non-natif.",
  ].join("\n"),
  levers: [
    "Posts 1000-1500 caractères avec « See more » → 3-5× plus de portée.",
    "Carousels (PDF/document) : 2× plus d'engagement qu'un post texte seul.",
    "Hook ligne 1 + 3 lignes blanches puis le reste → force le clic « See more ».",
    "Commentaires longs sur posts viraux dans ta niche → exposure piggyback.",
  ].join("\n"),
  actionPlan30d: {
    week1: ["Activer Creator Mode + 5 hashtags niche", "Optimiser headline + banner"],
    week23: ["Publier 5 posts/semaine 1000+ chars", "Commenter 10 posts virals/jour"],
    week4: ["Lancer newsletter hebdo (si > 150 abonnés)", "Pitcher 5 brand B2B"],
  },
  defaultIssues: [
    { severity: "high",   title: "Liens externes en début de post — algo LinkedIn pénalise (mettre lien en commentaire)", scope: "SEO" },
    { severity: "medium", title: "Posts < 1000 chars — pas de \"See more\" → portée réduite",                              scope: "Engagement" },
    { severity: "low",    title: "Creator Mode non activé — newsletter et follower count cachés",                          scope: "Monetization" },
  ],
  defaultMonetActions: [
    "Activer Creator Mode + sélectionner 5 hashtags niche pour gain de portée",
    "Tenir 5 posts 1000-1500 caractères/semaine avec hook ligne 1",
    "Lancer une newsletter hebdo dès 150 abonnés pour bâtir audience qualifiée",
  ],
  defaultAntibanRisks: [
    { type: "fake_engagement", severity: "medium", message: "Engagement pods suspectés — LinkedIn divise la portée si détecté" },
    { type: "spam",            severity: "low",    message: "Cross-posting Twitter/IG : algo pénalise les contenus non-natifs" },
    { type: "policy",          severity: "low",    message: "Aucune violation Professional Community Policies" },
  ],
};

const FALLBACK: PlatformPlaybook = {
  id: "FACEBOOK",
  name: "Plateforme générique",
  monetization: "Programmes variables — vérifier l'éligibilité dans le tableau créateur de la plateforme.",
  risks: "Copyright musique, contenu recyclé, engagement bait, violations community standards.",
  levers: "Format natif de la plateforme, captions baked-in, hooks 1-3s, hashtags niche.",
  actionPlan30d: {
    week1: ["Auditer profil et bio", "Supprimer contenu low-performance"],
    week23: ["Tenir un calendrier régulier de publication", "Tester 3 hooks différents"],
    week4: ["Activer les outils de monétisation disponibles", "Pitcher 3 marques"],
  },
  defaultIssues: [
    { severity: "medium", title: "Plateforme non couverte spécifiquement — recommandations génériques", scope: "Monetization" },
    { severity: "low",    title: "Audit basé sur estimations — connecter le compte pour analyse approfondie", scope: "Anti-Ban" },
    { severity: "low",    title: "Hashtags à affiner selon le format natif de la plateforme",            scope: "SEO" },
  ],
  defaultMonetActions: [
    "Auditer le tableau de bord créateur pour vérifier l'éligibilité monétisation",
    "Tenir un calendrier régulier de publication avec format natif",
    "Pitcher 3 marques pour partenariat sponsorisé",
  ],
  defaultAntibanRisks: [
    { type: "copyright", severity: "low", message: "Vérifier la conformité musique sur les derniers posts" },
    { type: "policy",    severity: "low", message: "Pas de violations community standards détectées" },
    { type: "spam",      severity: "low", message: "Pas de patterns suspects cette semaine" },
  ],
};

export const PLAYBOOKS: Record<PlatformId, PlatformPlaybook> = {
  FACEBOOK,
  INSTAGRAM,
  TIKTOK,
  YOUTUBE,
  X,
  SNAPCHAT,
  TWITCH,
  PINTEREST,
  LINKEDIN,
};

export function getPlaybook(platform: PlatformId | string | undefined | null): PlatformPlaybook {
  if (!platform) return FALLBACK;
  return PLAYBOOKS[platform as PlatformId] ?? FALLBACK;
}
