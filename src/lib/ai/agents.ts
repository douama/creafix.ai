/**
 * Monetiq AI — Multi-agents orchestrator
 *
 * Chaque agent encapsule un prompt système, un modèle LLM préféré et une logique
 * de scoring/extraction. Les agents sont composés par `runAudit()` pour produire
 * un rapport complet.
 *
 * En production, brancher OpenAI / Anthropic / Gemini via leurs SDK officiels.
 * Pour l'instant, les agents renvoient des résultats simulés mais structurés
 * comme le ferait l'IA, afin que le reste de l'app puisse être testé.
 */

type Platform = "FACEBOOK" | "TIKTOK" | "INSTAGRAM" | "YOUTUBE";

export type AgentName =
  | "audit"
  | "viral"
  | "monetization"
  | "anti-ban"
  | "trend"
  | "thumbnail"
  | "script";

export interface AgentContext {
  platform: Platform;
  handle: string;
  country: string;
  niche?: string;
  followers?: number;
  monthlyViews?: number;
  watchTimeMin?: number;
}

export interface AgentResult<T = unknown> {
  agent: AgentName;
  model: string;
  durationMs: number;
  confidence: number; // 0-100
  data: T;
}

const DEFAULT_MODEL = {
  audit: "claude-opus-4-7",
  viral: "claude-sonnet-4-6",
  monetization: "claude-opus-4-7",
  "anti-ban": "claude-sonnet-4-6",
  trend: "gemini-2.5-flash",
  thumbnail: "gpt-image-1",
  script: "claude-sonnet-4-6",
} as const;

// ─────────────────────────────────────────────
// Agent: AUDIT
// ─────────────────────────────────────────────

export async function auditAgent(ctx: AgentContext): Promise<AgentResult<AuditAgentData>> {
  const start = Date.now();
  // TODO: brancher Claude/OpenAI ici
  const seed = hash(ctx.handle);
  const data: AuditAgentData = {
    scoreGlobal: 50 + (seed % 45),
    dimensions: [
      { name: "Conformité politiques",     score: 70 + ((seed >> 1) % 25) },
      { name: "Qualité vidéo & rétention", score: 60 + ((seed >> 2) % 30) },
      { name: "Engagement authentique",    score: 70 + ((seed >> 3) % 25) },
      { name: "Watch time / CTR",          score: 55 + ((seed >> 4) % 30) },
      { name: "Copyright & musique",       score: 30 + ((seed >> 5) % 60) },
      { name: "Fréquence & calendrier",    score: 60 + ((seed >> 6) % 30) },
      { name: "SEO & métadonnées",         score: 55 + ((seed >> 7) % 35) },
      { name: "Qualité audience",          score: 75 + ((seed >> 8) % 20) },
    ],
    issues: [
      { severity: "high", title: "3 vidéos avec audio sous copyright", scope: "Anti-Ban" },
      { severity: "medium", title: "Watch time insuffisant pour In-Stream Ads", scope: "Monetization" },
      { severity: "low", title: "Hashtags génériques", scope: "SEO" },
    ],
  };
  return wrap("audit", data, start);
}

export interface AuditAgentData {
  scoreGlobal: number;
  dimensions: { name: string; score: number }[];
  issues: { severity: "low" | "medium" | "high"; title: string; scope: string }[];
}

// ─────────────────────────────────────────────
// Agent: VIRAL — détection patterns
// ─────────────────────────────────────────────

export async function viralAgent(
  ctx: AgentContext & { topic?: string },
): Promise<AgentResult<ViralIdea[]>> {
  const start = Date.now();
  const niche = ctx.niche ?? "lifestyle";
  const data: ViralIdea[] = [
    {
      title: `POV : tu es un jeune ${cityFor(ctx.country)}ois et tu découvres ${ctx.topic ?? "le Mobile Money"} pour la 1ère fois`,
      score: 94,
      duration: "0:45",
      niche: `${niche} · humour`,
      hooks: [
        "Tu as déjà essayé ça ? La 3e va te choquer.",
        "Personne ne t'a dit ça avant moi. Regarde bien.",
      ],
    },
    {
      title: `3 erreurs que font 90% des créateurs ${ctx.country}`,
      score: 91,
      duration: "1:10",
      niche,
      hooks: ["Si t'es créateur en Afrique, regarde ça.", "L'erreur n°2 m'a coûté 200K FCFA."],
    },
  ];
  return wrap("viral", data, start);
}

export interface ViralIdea {
  title: string;
  score: number;
  duration: string;
  niche: string;
  hooks: string[];
}

// ─────────────────────────────────────────────
// Agent: MONETIZATION — éligibilité + revenus
// ─────────────────────────────────────────────

export async function monetizationAgent(
  ctx: AgentContext,
): Promise<AgentResult<MonetizationData>> {
  const start = Date.now();
  const data: MonetizationData = {
    eligibleFacebookInStream: false,
    eligibleTikTokRewards: false,
    fbCriteria: { followers: 10_000, watchMin60d: 600, currentWatchMin60d: 513 },
    tikTokCriteria: { followers: 10_000, views30d: 100_000, currentViews30d: 124_000 },
    actions: [
      "Atteindre 87 minutes de watch time supplémentaires sur 60 j",
      "Activer In-Stream Ads dans Meta Business Suite",
      "Lier ton compte créateur TikTok à Creator Rewards Program",
    ],
  };
  return wrap("monetization", data, start);
}

export interface MonetizationData {
  eligibleFacebookInStream: boolean;
  eligibleTikTokRewards: boolean;
  fbCriteria: { followers: number; watchMin60d: number; currentWatchMin60d: number };
  tikTokCriteria: { followers: number; views30d: number; currentViews30d: number };
  actions: string[];
}

// ─────────────────────────────────────────────
// Agent: ANTI-BAN
// ─────────────────────────────────────────────

export async function antiBanAgent(ctx: AgentContext): Promise<AgentResult<AntiBanData>> {
  const start = Date.now();
  const data: AntiBanData = {
    riskScore: 18,
    risks: [
      { type: "copyright", severity: "high", message: "Audio non commercial détecté sur 3 vidéos" },
      { type: "fake_engagement", severity: "low", message: "Pas de signal suspect cette semaine" },
      { type: "sensitive", severity: "low", message: "Conforme aux règles Meta brand safety" },
    ],
  };
  return wrap("anti-ban", data, start);
}

export interface AntiBanData {
  riskScore: number;
  risks: {
    type: "copyright" | "fake_engagement" | "sensitive" | "spam" | "recycled" | "policy";
    severity: "low" | "medium" | "high";
    message: string;
  }[];
}

// ─────────────────────────────────────────────
// Agent: TREND
// ─────────────────────────────────────────────

export async function trendAgent(country: string): Promise<AgentResult<TrendData>> {
  const start = Date.now();
  const data: TrendData = {
    country,
    hashtags: [
      { tag: "#DakarMood", velocity: "+312%", uses: 1_200_000 },
      { tag: "#NaijaJollof", velocity: "+248%", uses: 2_400_000 },
    ],
    sounds: [
      { title: "Afro Drill #4127", uses: 12_400_000 },
      { title: "Amapiano Lagos 2025", uses: 8_900_000 },
    ],
  };
  return wrap("trend", data, start);
}

export interface TrendData {
  country: string;
  hashtags: { tag: string; velocity: string; uses: number }[];
  sounds: { title: string; uses: number }[];
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function wrap<T>(agent: AgentName, data: T, start: number): AgentResult<T> {
  return {
    agent,
    model: DEFAULT_MODEL[agent],
    durationMs: Date.now() - start,
    confidence: 80 + Math.floor(Math.random() * 15),
    data,
  };
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function cityFor(country: string) {
  return (
    {
      SN: "Dakar",
      CI: "Abidjan",
      CM: "Yaoundé",
      ML: "Bamako",
      NG: "Lagos",
      GH: "Accra",
      ZA: "Johannesburg",
      MA: "Casablanca",
      CD: "Kinshasa",
    } as Record<string, string>
  )[country] ?? country;
}

// ─────────────────────────────────────────────
// Orchestrator
// ─────────────────────────────────────────────

export async function runFullAudit(ctx: AgentContext) {
  const [audit, viral, monet, ban, trend] = await Promise.all([
    auditAgent(ctx),
    viralAgent(ctx),
    monetizationAgent(ctx),
    antiBanAgent(ctx),
    trendAgent(ctx.country),
  ]);
  return { audit, viral, monetization: monet, antiBan: ban, trend };
}
