"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  Lock,
  User,
  Copy,
  ExternalLink,
  Award,
  Send,
  Check,
  Loader2,
  Newspaper,
  FileText,
  Layers,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Categories and eligibility criteria checklist items
type ChecklistItem = {
  id: string;
  label: string;
  description: string;
  points: number;
  category: "authenticity" | "completeness" | "notability" | "security";
};

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Authenticity (20%)
  {
    id: "auth-real",
    label: "Entité authentique",
    description: "Le compte représente une personne physique réelle ou une entité légale enregistrée.",
    points: 10,
    category: "authenticity",
  },
  {
    id: "auth-identity",
    label: "Identité correspondante",
    description: "Le nom officiel correspond à vos pièces d'identité officielles (passeport, CNI) ou statuts d'entreprise.",
    points: 10,
    category: "authenticity",
  },
  // Completeness (35%)
  {
    id: "comp-public",
    label: "Compte public & Actif",
    description: "Votre compte est en mode public, possède une biographie remplie et une photo de profil.",
    points: 10,
    category: "completeness",
  },
  {
    id: "comp-bio-link",
    label: "Lien externe valide",
    description: "Le lien en bio pointe vers un site web officiel, un portfolio ou un article de presse majeur.",
    points: 10,
    category: "completeness",
  },
  {
    id: "comp-frequency",
    label: "Publication régulière",
    description: "Vous publiez de manière hebdomadaire (au moins 1 contenu original toutes les 2 semaines).",
    points: 15,
    category: "completeness",
  },
  // Notability & Press (35%)
  {
    id: "not-press",
    label: "3+ Articles de presse",
    description: "Votre profil/nom est mentionné dans au moins 3 sources d'actualités notables et indépendantes (non-payées).",
    points: 15,
    category: "notability",
  },
  {
    id: "not-search",
    label: "Recherches Google significatives",
    description: "Votre nom de créateur ou de marque fait l'objet d'un volume de recherche organique récurrent sur le web.",
    points: 10,
    category: "notability",
  },
  {
    id: "not-other-platform",
    label: "Notoriété cross-plateforme",
    description: "Vous disposez d'un compte validé ou de plus de 50 000 abonnés sur au moins une autre plateforme majeure.",
    points: 10,
    category: "notability",
  },
  // Security (10%)
  {
    id: "sec-2fa",
    label: "Double authentification (2FA)",
    description: "La sécurité en deux étapes est active via application d'authentification (Google Authenticator, etc.).",
    points: 10,
    category: "security",
  },
];

const CATEGORY_LABELS = {
  authenticity: { label: "Authenticité", icon: User, color: "text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/5" },
  completeness: { label: "Complétude", icon: Layers, color: "text-[#10B981] border-[#10B981]/30 bg-[#10B981]/5" },
  notability: { label: "Notoriété & Presse", icon: Newspaper, color: "text-[#EC4899] border-[#EC4899]/30 bg-[#EC4899]/5" },
  security: { label: "Sécurité", icon: Lock, color: "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/5" },
};

// Platforms verification steps
type SubmissionGuide = {
  name: string;
  badgeColor: string;
  icon: string;
  officialLink: string;
  requirements: string[];
  steps: string[];
};

const PLATFORMS: Record<string, SubmissionGuide> = {
  instagram: {
    name: "Instagram",
    badgeColor: "from-[#EC4899] via-[#8B5CF6] to-[#3B82F6]",
    icon: "📸",
    officialLink: "https://help.instagram.com/854227311295302",
    requirements: [
      "Compte public, bio et photo de profil obligatoires",
      "Pièce d'identité officielle avec photo (passeport, permis, CNI)",
      "Preuves de notoriété (articles de presse en lien)",
    ],
    steps: [
      "Accédez à votre profil et appuyez sur l'icône Menu en haut à droite.",
      "Sélectionnez Paramètres et confidentialité.",
      "Faites défiler vers le bas et appuyez sur Type de compte et outils.",
      "Appuyez sur Demander une vérification.",
      "Renseignez votre nom complet, fournissez votre pièce d'identité et ajoutez vos liens de presse.",
      "Appuyez sur Envoyer. La réponse arrive généralement sous 3 à 30 jours.",
    ],
  },
  tiktok: {
    name: "TikTok",
    badgeColor: "from-[#000000] via-[#00F2FE] to-[#FE0979]",
    icon: "🎵",
    officialLink: "https://support.tiktok.com/fr/using-tiktok/growing-your-audience/how-to-get-verified-on-tiktok",
    requirements: [
      "Compte actif au cours des 6 derniers mois",
      "Authentification à double facteur (2FA) activée",
      "Représentation notable (présence dans des actualités vérifiées)",
    ],
    steps: [
      "Dans l'application TikTok, appuyez sur Profil en bas.",
      "Appuyez sur le bouton Menu en haut à droite (3 lignes).",
      "Sélectionnez Paramètres et confidentialité.",
      "Appuyez sur Gérer le compte, puis sur Vérification.",
      "Suivez les instructions à l'écran pour soumettre des preuves de notoriété et d'identité.",
      "Note: TikTok examine minutieusement la couverture média indépendante.",
    ],
  },
  facebook: {
    name: "Facebook",
    badgeColor: "from-[#1877F2] to-[#0A5BE0]",
    icon: "👥",
    officialLink: "https://www.facebook.com/help/1288173394636262",
    requirements: [
      "Profil configuré avec photo de couverture et photo de profil",
      "Pièce d'identité ou justificatif officiel (factures d'entreprise, statuts)",
      "Articles de presse référençant votre page ou profil",
    ],
    steps: [
      "Visitez le Centre d'aide Facebook et recherchez le formulaire 'Demander un badge bleu de vérification'.",
      "Choisissez si vous souhaitez vérifier un profil individuel ou une page.",
      "Sélectionnez la catégorie de votre page (ex: Créateur, Média, Sport).",
      "Sélectionnez votre pays et téléchargez une pièce d'identité officielle claire.",
      "Renseignez la section 'Notoriété' en expliquant pourquoi votre compte est d'intérêt public.",
      "Ajoutez jusqu'à 5 liens d'articles de presse officiels et soumettez la demande.",
    ],
  },
  youtube: {
    name: "YouTube",
    badgeColor: "from-[#FF0000] to-[#C40000]",
    icon: "🎥",
    officialLink: "https://support.google.com/youtube/answer/3046484",
    requirements: [
      "Avoir au moins 100 000 abonnés sur la chaîne",
      "Chaîne authentique (représente le créateur/marque réel)",
      "Chaîne publique et complète (bannière, description, vidéos)",
    ],
    steps: [
      "Connectez-vous à YouTube avec le compte associé à votre chaîne.",
      "Accédez à la page d'aide de YouTube concernant le badge de validation.",
      "Si vous avez 100k abonnés, un bouton 'Demander maintenant' apparaîtra.",
      "Remplissez le formulaire avec l'ID de votre chaîne YouTube.",
      "Soumettez la demande. L'examen prend généralement quelques jours.",
      "Astuce : Si vous n'avez pas encore 100k mais êtes très notoire (ex: vérifié ailleurs), contactez le support créateur.",
    ],
  },
};

export default function VerifyAssistPage() {
  // State for Checklist
  const [checkedItems, setCheckedItems] = useState<string[]>(["auth-real", "comp-public", "sec-2fa"]);
  // State for tabs
  const [activeTab, setActiveTab] = useState<"audit" | "pitch" | "guides">("audit");
  // State for guide sub-tab
  const [activeGuideTab, setActiveGuideTab] = useState<string>("instagram");

  // Pitch Generator Form States
  const [creatorName, setCreatorName] = useState("");
  const [niche, setNiche] = useState("Divertissement / Humour");
  const [keyMilestones, setKeyMilestones] = useState("");
  const [pressAngle, setPressAngle] = useState("Portrait inspirant");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedPitch, setGeneratedPitch] = useState("");
  const [copied, setCopied] = useState(false);

  // Calculate dynamic readiness score
  const score = CHECKLIST_ITEMS.reduce((acc, item) => {
    if (checkedItems.includes(item.id)) {
      return acc + item.points;
    }
    return acc;
  }, 0);

  // Animate progress ring
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Toggle item checking
  const handleToggleItem = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate press pitch
  const handleGeneratePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);
    setGeneratedPitch("");

    const steps = [
      "Analyse de votre profil créateur...",
      "Extraction des jalons et chiffres clés...",
      "Rédaction de l'accroche journalistique (Hook)...",
      "Génération du corps du communiqué de presse...",
      "Optimisation SEO et révision éditoriale...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    const todayStr = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    const dynamicText = `COMMUNIQUÉ DE PRESSE
POUR DIFFUSION IMMÉDIATE

${creatorName.toUpperCase()} RÉVOLUTIONNE L'INDUSTRIE DU CONTENU DANS LA NICHE ${niche.toUpperCase()}

Dakar, le ${todayStr} — Le créateur de contenu et influenceur de premier plan ${creatorName} franchit une étape majeure dans sa trajectoire numérique. Véritable phénomène digital, ${creatorName} s'impose aujourd'hui comme une voix incontournable, inspirant des milliers d'abonnés grâce à un positionnement unique et créatif dans le secteur "${niche}".

Parmi les moments forts et réussites majeures du créateur :
${keyMilestones ? keyMilestones : "• Une croissance organique exceptionnelle et une communauté engagée au quotidien.\n• Des taux d'engagement au-dessus de la moyenne de l'industrie.\n• Un impact culturel fort et une connexion authentique avec l'audience."}

Sous l'angle d'un(e) "${pressAngle}", ce projet met en lumière l'importance grandissante des créateurs indépendants en Afrique francophone et leur rôle de pionniers économiques. Plus qu'un simple créateur, ${creatorName} représente l'avenir de l'économie des créateurs de contenu en Afrique.

---

À propos de ${creatorName} :
${creatorName} est un créateur de contenu spécialisé dans la thématique "${niche}". Suivi activement par une communauté dévouée, le créateur s'attache à produire des vidéos de haute qualité, combinant authenticité, créativité et impact culturel.

Contact Presse :
Nom : Équipe Relations Presse CreaFix AI
Email : press@creafix.ai
Lien Médias : https://creafix.ai/creators/${creatorName.toLowerCase().replace(/\s+/g, "-")}`;

    setGeneratedPitch(dynamicText);
    setIsGenerating(false);
  };

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate automated recommendation text based on score
  const getRecommendation = () => {
    if (score < 40) {
      return {
        text: "Votre score est faible. Concentrez-vous d'abord sur la complétude de vos profils sociaux (bio, liens, activité) et assurez-vous d'activer la double authentification pour protéger vos comptes.",
        variant: "destructive",
      };
    } else if (score < 75) {
      return {
        text: "Bonne progression ! Pour franchir le seuil d'éligibilité des plateformes, vous devez impérativement rassembler des preuves de notoriété (articles de presse) et soumettre des documents officiels cohérents.",
        variant: "warning",
      };
    } else {
      return {
        text: "Excellent score ! Votre profil présente d'excellentes garanties d'éligibilité. Vous êtes prêt à formuler votre demande officielle en utilisant nos guides de soumission ci-dessous.",
        variant: "success",
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Verify Assist
            </h1>
            <Badge variant="brand" className="gap-1 px-2.5 py-0.5 text-[10px] uppercase tracking-wider">
              <BadgeCheck className="h-3 w-3" /> Badge Vérifié
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Auditez votre compte, créez votre dossier de presse IA et accédez aux canaux de certification officiels.
          </p>
        </div>
      </div>

      {/* Main Grid: Left is Info/Readiness, Right is Content Tabs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Readiness Gauge Sidebar Widget */}
        <Card className="flex flex-col justify-between overflow-hidden border-border/80 bg-card/50 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground/90">Score de Préparation</CardTitle>
            <CardDescription>
              Estimation de vos chances d&apos;obtenir le badge bleu officiel.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="h-36 w-36 transform -rotate-90" viewBox="0 0 128 128">
                {/* Background track circle */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-muted/20"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated progress circle with beautiful gradient */}
                <motion.circle
                  cx="64"
                  cy="64"
                  r={radius}
                  strokeWidth="8"
                  fill="transparent"
                  stroke="url(#gradientVerify)"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                {/* Definitions for gradient */}
                <defs>
                  <linearGradient id="gradientVerify" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center percentage label */}
              <div className="absolute flex flex-col items-center justify-center">
                <motion.span 
                  key={score}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display text-3xl font-black text-foreground"
                >
                  {score}%
                </motion.span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Prêt
                </span>
              </div>
            </div>

            {/* AI Recommendation Alert */}
            <div className="mt-6 w-full text-left">
              <div className="rounded-xl border border-white/5 bg-background/30 p-3.5 backdrop-blur-md">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#EC4899]" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Analyse CreaFix AI
                    </div>
                    <p className="mt-1 text-xs text-foreground/80 leading-relaxed">
                      {recommendation.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="border-t border-border/40 bg-muted/20 px-5 py-4 text-xs text-muted-foreground">
            Sélectionnez les critères validés dans l&apos;onglet <b className="text-foreground font-semibold">Audit d&apos;éligibilité</b> pour mettre à jour votre score en temps réel.
          </div>
        </Card>

        {/* Tab-driven Content Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom Tabs Navigation (Sliding Motion Indicator) */}
          <div className="relative flex rounded-xl border border-border bg-card/40 p-1 backdrop-blur-md">
            {[
              { id: "audit", label: "Audit d'Éligibilité", icon: Target },
              { id: "pitch", label: "Générateur de Pitch Presse", icon: Newspaper },
              { id: "guides", label: "Guides par Plateforme", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all duration-300 hover:text-foreground md:text-sm text-muted-foreground"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-lg bg-card shadow-sm border border-border/80"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`relative z-10 h-4 w-4 ${isActive ? "text-[#EC4899]" : "text-muted-foreground/75"}`} />
                  <span className={`relative z-10 ${isActive ? "text-foreground font-bold" : ""}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Render Tab Contents */}
          <AnimatePresence mode="wait">
            {activeTab === "audit" && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Category groupings for checklist */}
                {Object.entries(CATEGORY_LABELS).map(([catKey, catMeta]) => {
                  const CatIcon = catMeta.icon;
                  const categoryItems = CHECKLIST_ITEMS.filter((item) => item.category === catKey);
                  return (
                    <Card key={catKey} className="border-border/60 overflow-hidden bg-card/30">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 bg-muted/10 py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${catMeta.color}`}>
                            <CatIcon className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-sm font-bold tracking-tight text-foreground/90">
                            {catMeta.label}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {categoryItems.filter((i) => checkedItems.includes(i.id)).length} / {categoryItems.length} validés
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-0 divide-y divide-border/20">
                        {categoryItems.map((item) => {
                          const isChecked = checkedItems.includes(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleToggleItem(item.id)}
                              className={`flex items-start gap-4 p-4 transition-all duration-200 cursor-pointer hover:bg-card/70 ${
                                isChecked ? "bg-emerald-500/[0.02]" : ""
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {isChecked ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground/45 transition-colors hover:text-foreground" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-sm font-semibold transition-all ${isChecked ? "text-foreground line-through opacity-75" : "text-foreground/90"}`}>
                                    {item.label}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#EC4899] bg-[#EC4899]/10 px-1.5 py-0.5 rounded-md shrink-0">
                                    +{item.points}%
                                  </span>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </motion.div>
            )}

            {activeTab === "pitch" && (
              <motion.div
                key="pitch"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <Card className="border-border/60 bg-card/30">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-foreground">Générateur de Pitch Relations Presse (RP)</CardTitle>
                    <CardDescription>
                      Les formulaires de vérification officiels requièrent souvent des articles de presse. Utilisez ce générateur IA pour rédiger un communiqué de presse professionnel à envoyer aux médias et journalistes de votre région.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <form onSubmit={handleGeneratePitch} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nom d&apos;artiste / Marque</label>
                          <Input
                            placeholder="ex: Papa Sow, TechAfrique..."
                            value={creatorName}
                            onChange={(e) => setCreatorName(e.target.value)}
                            required
                            className="bg-background/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Niche / Catégorie</label>
                          <select
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="flex h-11 w-full rounded-xl border border-border bg-card/50 px-4 py-2 text-sm ring-offset-background backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-foreground"
                          >
                            <option value="Divertissement / Humour">Divertissement / Humour</option>
                            <option value="Finance / Business / Tech">Finance / Business / Tech</option>
                            <option value="Musique / Danse">Musique / Danse</option>
                            <option value="Cuisine / Lifestyle">Cuisine / Lifestyle</option>
                            <option value="Cinéma / Vlog / Mode">Cinéma / Vlog / Mode</option>
                            <option value="Éducation / Sciences">Éducation / Sciences</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jalons Marquants (Nombre d&apos;abonnés, distinctions, projets clés)</label>
                        <textarea
                          placeholder="ex: Plus grand compte Tech au Sénégal avec 800k abonnés, vainqueur du prix du Meilleur Créateur Web 2025, partenariat officiel avec Orange Sénégal..."
                          value={keyMilestones}
                          onChange={(e) => setKeyMilestones(e.target.value)}
                          rows={3}
                          className="flex w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Angle Editorial pour la Presse</label>
                        <select
                          value={pressAngle}
                          onChange={(e) => setPressAngle(e.target.value)}
                          className="flex h-11 w-full rounded-xl border border-border bg-card/50 px-4 py-2 text-sm ring-offset-background backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-foreground"
                        >
                          <option value="Portrait inspirant (histoire personnelle du créateur)">Portrait inspirant (histoire personnelle)</option>
                          <option value="Lancement d'un nouveau projet ou concept novateur">Lancement d&apos;un nouveau projet</option>
                          <option value="Impact communautaire et culturel fort">Impact communautaire et culturel</option>
                          <option value="Pionnier de l'économie des créateurs locaux">Pionnier de l&apos;économie des créateurs</option>
                        </select>
                      </div>

                      <Button
                        type="submit"
                        variant="brand"
                        className="w-full h-11 relative"
                        disabled={isGenerating || !creatorName.trim()}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Simulation de l&apos;IA : {generationStep + 1}/5</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>Générer mon Pitch de Presse IA</span>
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Generative Typing Progress / Output Block */}
                {isGenerating && (
                  <Card className="border border-purple-500/20 bg-purple-500/[0.01] p-5">
                    <div className="flex flex-col items-center justify-center space-y-3 py-4 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#EC4899]" />
                      <div className="text-sm font-semibold text-foreground/90">
                        {generationStep === 0 && "Analyse de votre profil créateur..."}
                        {generationStep === 1 && "Extraction des jalons et chiffres clés..."}
                        {generationStep === 2 && "Rédaction de l'accroche journalistique (Hook)..."}
                        {generationStep === 3 && "Génération du corps du communiqué de presse..."}
                        {generationStep === 4 && "Optimisation SEO et révision éditoriale..."}
                      </div>
                      <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-[#EC4899]"
                          initial={{ width: "0%" }}
                          animate={{ width: `${(generationStep + 1) * 20}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {generatedPitch && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-[#EC4899]" /> Communiqué de Presse Généré
                      </span>
                      <Button
                        onClick={handleCopyPitch}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold gap-1.5"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" /> Copié !
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copier le pitch
                          </>
                        )}
                      </Button>
                    </div>
                    <Card className="border-border/80 bg-background/50 overflow-hidden shadow-inner">
                      <CardContent className="p-4 md:p-5">
                        <pre className="font-mono text-[11px] md:text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                          {generatedPitch}
                        </pre>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === "guides" && (
              <motion.div
                key="guides"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Platform Selector buttons inside content tab */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PLATFORMS).map(([key, platform]) => {
                    const isSubActive = activeGuideTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveGuideTab(key)}
                        className={`relative flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                          isSubActive
                            ? "bg-card text-foreground border-border shadow-md"
                            : "border-border/50 bg-card/20 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{platform.icon}</span>
                        <span>{platform.name}</span>
                        {isSubActive && (
                          <motion.div
                            layoutId="activeSubGuide"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gradient-to-r from-purple-500 to-[#EC4899]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-tab details card */}
                {Object.entries(PLATFORMS).map(([key, platform]) => {
                  if (activeGuideTab !== key) return null;
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <Card className="border-border/60 bg-card/30">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                              <span>{platform.icon}</span> Guide Officiel {platform.name}
                            </CardTitle>
                            <Button asChild size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5">
                              <a href={platform.officialLink} target="_blank" rel="noopener noreferrer">
                                Canal Officiel <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          </div>
                          <CardDescription>
                            Suivez pas à pas la procédure validée pour demander votre badge sur cette plateforme.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          {/* Requirements */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EC4899] flex items-center gap-1.5">
                              <ShieldAlert className="h-3.5 w-3.5" /> Documents & Critères Prérequis
                            </h4>
                            <ul className="grid gap-2 text-xs md:grid-cols-2">
                              {platform.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2 bg-background/20 p-2.5 rounded-xl border border-border/20">
                                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="text-foreground/80 leading-relaxed">{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Step by step */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] flex items-center gap-1.5">
                              <TrendingUp className="h-3.5 w-3.5" /> Étapes de Soumission (Mobile ou Web)
                            </h4>
                            <ol className="space-y-2">
                              {platform.steps.map((step, idx) => (
                                <li key={idx} className="flex gap-3 text-xs bg-background/30 p-3 rounded-xl border border-border/20 items-start">
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px] border border-primary/20">
                                    {idx + 1}
                                  </span>
                                  <span className="text-foreground/80 leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/[0.03] p-3.5">
                        <Lock className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                        <p className="text-xs text-muted-foreground leading-normal">
                          <b className="text-foreground">Attention aux arnaques :</b> Les plateformes ne facturent jamais de frais pour soumettre une demande de vérification de manière directe. Refusez toute offre externe payante prétendant vous vendre un badge bleu directement.
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
