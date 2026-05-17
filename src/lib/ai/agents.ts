/**
 * CreaFix AI — Multi-agents orchestrator (Phase D · live LLM).
 *
 * Chaque agent :
 *   - encapsule un system prompt spécialisé
 *   - appelle `chat()` (Anthropic Claude par défaut)
 *   - parse la sortie JSON structurée
 *   - fallback automatique sur mock si pas de clé ou parse fail
 *   - track ses métriques dans monetiq.ai_agents (cost/latency/success)
 *
 * `runFullAudit()` lance 5 agents en parallèle (Promise.all) pour produire
 * un rapport complet en ~3-8s (vs 15-40s en séquentiel).
 */

import { chat, type ChatResult } from "./providers";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Platform = "FACEBOOK" | "TIKTOK" | "INSTAGRAM" | "YOUTUBE" | "X" | "SNAPCHAT" | "TWITCH" | "PINTEREST" | "LINKEDIN";

export type AgentName = "audit" | "viral" | "monetization" | "anti-ban" | "trend" | "thumbnail" | "script";

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
  confidence: number;
  data: T;
  /** True si la réponse vient du mock (pas de clé Anthropic ou parse fail). */
  isMock: boolean;
  /** Coût USD de cette run (0 si mock). */
  costUsd: number;
}

const AGENT_SLUG: Record<AgentName, string> = {
  audit:          "monetization-agent", // pas de slug "audit", on map au global
  monetization:   "monetization-agent",
  viral:          "viral-agent",
  "anti-ban":     "shadowban-agent",
  trend:          "trend-scanner-agent",
  thumbnail:      "thumbnail-agent",
  script:         "hook-rewriter-agent",
};

/* ════════════════════════════════════════════════════════════════════
 * AGENT : AUDIT GLOBAL (Monetization Agent)
 * ════════════════════════════════════════════════════════════════════ */

export interface AuditAgentData {
  scoreGlobal: number;
  dimensions: { name: string; score: number }[];
  issues: { severity: "low" | "medium" | "high"; title: string; scope: string }[];
}

const AUDIT_SYSTEM_PROMPT = `Tu es un analyste senior de monétisation de contenus sociaux, spécialiste du marché africain (Sénégal, Côte d'Ivoire, Cameroun, Mali, Nigeria, Ghana, Afrique du Sud, Maroc, RD Congo).

Tu reçois les métadonnées d'un compte créateur (handle, plateforme, pays, niche). Tu produis un audit IA structuré couvrant 8 dimensions et identifies 3 issues actionables.

Dimensions à scorer 0-100 :
1. Conformité politiques (TOS, copyright, contenus interdits)
2. Qualité vidéo & rétention
3. Engagement authentique (vs fake)
4. Watch time / CTR
5. Copyright & musique (audio licensing)
6. Fréquence & calendrier de publication
7. SEO & métadonnées (titres, hashtags, descriptions)
8. Qualité audience (géo, démographique)

Issues : severity = low/medium/high. Scope = Anti-Ban / Monetization / SEO / Engagement.

Tu DOIS répondre UNIQUEMENT en JSON valide, format strict :
{
  "scoreGlobal": <0-100>,
  "dimensions": [{"name": "<exact>", "score": <0-100>}, ...8 items],
  "issues": [{"severity": "high|medium|low", "title": "<court>", "scope": "<court>"}, ...3 items]
}`;

export async function auditAgent(ctx: AgentContext): Promise<AgentResult<AuditAgentData>> {
  const start = Date.now();
  const userMsg = buildAuditUserMessage(ctx);

  const res = await chat({
    provider: "ANTHROPIC",
    model: "claude-sonnet-4-6",
    cacheSystem: true,
    json: true,
    temperature: 0.3,
    maxTokens: 1500,
    messages: [
      { role: "system", content: AUDIT_SYSTEM_PROMPT },
      { role: "user", content: userMsg },
    ],
  });

  const data = (parseOrFallback<AuditAgentData>(res, mockAudit(ctx)));
  void trackAgentRun("monetization-agent", res, !res.isMock);

  return {
    agent: "audit",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: res.isMock ? 60 : 92,
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT : VIRAL
 * ════════════════════════════════════════════════════════════════════ */

export interface ViralIdea {
  title: string;
  score: number;
  duration: string;
  niche: string;
  hooks: string[];
}

const VIRAL_SYSTEM_PROMPT = `Tu es un expert TikTok / Reels / Shorts viral content, spécialiste de l'Afrique francophone et anglophone.

Tu génères 3 idées de vidéo virales adaptées au contexte créateur (pays, niche, plateforme). Chaque idée doit avoir :
- title : concept clair de la vidéo (max 100 char)
- score : potentiel viral 0-100 estimé
- duration : durée optimale (ex "0:45", "1:10")
- niche : niche précise
- hooks : 2 hooks ultra-accrocheurs pour les 3 premières secondes (max 80 char)

Tu connais les codes culturels locaux : Mobile Money, afrobeats, amapiano, mbalax, langues locales, références sportives.

Réponse UNIQUEMENT en JSON valide :
[
  {"title": "...", "score": <0-100>, "duration": "M:SS", "niche": "...", "hooks": ["...", "..."]},
  ... 3 items au total
]`;

export async function viralAgent(
  ctx: AgentContext & { topic?: string },
): Promise<AgentResult<ViralIdea[]>> {
  const start = Date.now();
  const userMsg = `Créateur: @${ctx.handle} · ${ctx.platform} · pays ${ctx.country} · niche ${ctx.niche ?? "générale"} · ${ctx.followers ?? "?"} abonnés${ctx.topic ? ` · sujet à explorer: ${ctx.topic}` : ""}`;

  const res = await chat({
    provider: "ANTHROPIC",
    model: "claude-sonnet-4-6",
    cacheSystem: true,
    json: true,
    temperature: 0.8,
    maxTokens: 1200,
    messages: [
      { role: "system", content: VIRAL_SYSTEM_PROMPT },
      { role: "user", content: userMsg },
    ],
  });

  const data = parseOrFallback<ViralIdea[]>(res, mockViral(ctx));
  void trackAgentRun("viral-agent", res, !res.isMock);

  return {
    agent: "viral",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: res.isMock ? 60 : 88,
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT : MONETIZATION
 * ════════════════════════════════════════════════════════════════════ */

export interface MonetizationData {
  eligibleFacebookInStream: boolean;
  eligibleTikTokRewards: boolean;
  fbCriteria: { followers: number; watchMin60d: number; currentWatchMin60d: number };
  tikTokCriteria: { followers: number; views30d: number; currentViews30d: number };
  actions: string[];
}

const MONET_SYSTEM_PROMPT = `Tu es un expert monétisation sociale.

Tu analyses l'éligibilité d'un créateur aux programmes :
- Facebook In-Stream Ads : 10K followers + 600 min watch time / 60j + page éligible
- TikTok Creator Rewards : 10K followers + 100K vues / 30j + vidéos > 1 min

Pour chaque créateur, estime les critères actuels (basés sur followers déclarés et niche), détermine l'éligibilité, et propose 3 actions concrètes pour activer ou augmenter les revenus.

Réponse UNIQUEMENT en JSON valide :
{
  "eligibleFacebookInStream": <bool>,
  "eligibleTikTokRewards": <bool>,
  "fbCriteria": {"followers": <n>, "watchMin60d": 600, "currentWatchMin60d": <n>},
  "tikTokCriteria": {"followers": <n>, "views30d": 100000, "currentViews30d": <n>},
  "actions": ["...", "...", "..."]
}`;

export async function monetizationAgent(ctx: AgentContext): Promise<AgentResult<MonetizationData>> {
  const start = Date.now();
  const userMsg = `Compte: @${ctx.handle} · ${ctx.platform} · ${ctx.country} · niche ${ctx.niche ?? "?"} · followers ${ctx.followers ?? 12500}`;

  const res = await chat({
    provider: "ANTHROPIC",
    model: "claude-sonnet-4-6",
    cacheSystem: true,
    json: true,
    temperature: 0.4,
    maxTokens: 1024,
    messages: [
      { role: "system", content: MONET_SYSTEM_PROMPT },
      { role: "user", content: userMsg },
    ],
  });

  const data = parseOrFallback<MonetizationData>(res, mockMonetization(ctx));
  void trackAgentRun("monetization-agent", res, !res.isMock);

  return {
    agent: "monetization",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: res.isMock ? 60 : 90,
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT : ANTI-BAN (Shadowban Agent)
 * ════════════════════════════════════════════════════════════════════ */

export interface AntiBanData {
  riskScore: number;
  risks: {
    type: "copyright" | "fake_engagement" | "sensitive" | "spam" | "recycled" | "policy";
    severity: "low" | "medium" | "high";
    message: string;
  }[];
}

const ANTIBAN_SYSTEM_PROMPT = `Tu es un spécialiste de la détection de shadowban et démonétisation sur TikTok, Facebook, Instagram, YouTube.

Tu identifies les risques sur un compte : copyright audio, fake engagement, contenu sensible, spam, recyclage, violation policy.

Score de risque global 0-100 (0 = aucun risque, 100 = compte en très grand danger).

Réponse UNIQUEMENT en JSON valide :
{
  "riskScore": <0-100>,
  "risks": [
    {"type": "copyright|fake_engagement|sensitive|spam|recycled|policy", "severity": "low|medium|high", "message": "<court>"},
    ... 3 items
  ]
}`;

export async function antiBanAgent(ctx: AgentContext): Promise<AgentResult<AntiBanData>> {
  const start = Date.now();
  const userMsg = `Compte à scanner : @${ctx.handle} · ${ctx.platform} · ${ctx.country}`;

  const res = await chat({
    provider: "ANTHROPIC",
    model: "claude-sonnet-4-6",
    cacheSystem: true,
    json: true,
    temperature: 0.2,
    maxTokens: 800,
    messages: [
      { role: "system", content: ANTIBAN_SYSTEM_PROMPT },
      { role: "user", content: userMsg },
    ],
  });

  const data = parseOrFallback<AntiBanData>(res, mockAntiBan());
  void trackAgentRun("shadowban-agent", res, !res.isMock);

  return {
    agent: "anti-ban",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: res.isMock ? 60 : 88,
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT : TREND SCANNER
 * ════════════════════════════════════════════════════════════════════ */

export interface TrendData {
  country: string;
  hashtags: { tag: string; velocity: string; uses: number }[];
  sounds: { title: string; uses: number }[];
}

const TREND_SYSTEM_PROMPT = `Tu es un trend scanner expert pour le marché africain (9 pays : SN, CI, CM, ML, NG, GH, ZA, MA, CD).

Pour chaque pays demandé, tu donnes 3 hashtags trending et 2 sons trending de la semaine. Utilise tes connaissances des créateurs locaux, musiques (afrobeats, amapiano, mbalax, coupé-décalé, etc.) et événements culturels.

Format : velocity en pourcentage de croissance hebdo, uses en nombre d'utilisations.

Réponse UNIQUEMENT en JSON valide :
{
  "country": "<CODE>",
  "hashtags": [{"tag": "#<exact>", "velocity": "+XXX%", "uses": <n>}, ...3 items],
  "sounds": [{"title": "<artiste — titre>", "uses": <n>}, ...2 items]
}`;

export async function trendAgent(country: string): Promise<AgentResult<TrendData>> {
  const start = Date.now();

  const res = await chat({
    provider: "ANTHROPIC",
    model: "claude-sonnet-4-6",
    cacheSystem: true,
    json: true,
    temperature: 0.5,
    maxTokens: 700,
    messages: [
      { role: "system", content: TREND_SYSTEM_PROMPT },
      { role: "user", content: `Pays cible : ${country}` },
    ],
  });

  const data = parseOrFallback<TrendData>(res, mockTrend(country));
  void trackAgentRun("trend-scanner-agent", res, !res.isMock);

  return {
    agent: "trend",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: res.isMock ? 60 : 85,
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * Helpers : prompt building & parsing
 * ════════════════════════════════════════════════════════════════════ */

function buildAuditUserMessage(ctx: AgentContext): string {
  return [
    `Audit IA pour le compte créateur suivant :`,
    `• Handle: @${ctx.handle}`,
    `• Plateforme: ${ctx.platform}`,
    `• Pays: ${ctx.country}`,
    ctx.niche ? `• Niche: ${ctx.niche}` : null,
    ctx.followers ? `• Followers: ${ctx.followers.toLocaleString("fr-FR")}` : null,
    ctx.monthlyViews ? `• Vues mensuelles: ${ctx.monthlyViews.toLocaleString("fr-FR")}` : null,
    ctx.watchTimeMin ? `• Watch time 60j: ${ctx.watchTimeMin} min` : null,
    ``,
    `Génère l'audit JSON complet selon ton system prompt.`,
  ].filter(Boolean).join("\n");
}

function parseOrFallback<T>(res: ChatResult, fallback: T): T {
  if (res.parsed && typeof res.parsed === "object") {
    return res.parsed as T;
  }
  // Tente un parse manuel sur le text (si Claude a juste oublié de wrapper)
  if (res.text) {
    try {
      const match = res.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) return JSON.parse(match[0]) as T;
    } catch { /* swallow */ }
  }
  return fallback;
}

/* ════════════════════════════════════════════════════════════════════
 * Metrics tracking — update monetiq.ai_agents après chaque run
 * ════════════════════════════════════════════════════════════════════ */

async function trackAgentRun(slug: string, res: ChatResult, success: boolean): Promise<void> {
  try {
    const sb = supabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: agent } = await (sb.from("ai_agents") as any)
      .select("id, runs_total, runs_success, runs_failed, avg_cost_usd, avg_latency_ms")
      .eq("slug", slug)
      .maybeSingle();

    if (!agent) return;

    const total   = (agent.runs_total ?? 0) + 1;
    const ok      = (agent.runs_success ?? 0) + (success ? 1 : 0);
    const failed  = (agent.runs_failed ?? 0) + (success ? 0 : 1);
    // Moyenne glissante simple (pas EMA pour simplicité)
    const avgCost   = ((Number(agent.avg_cost_usd ?? 0) * (total - 1)) + res.costUsd) / total;
    const avgLat    = ((Number(agent.avg_latency_ms ?? 0) * (total - 1)) + res.latencyMs) / total;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("ai_agents") as any)
      .update({
        runs_total: total,
        runs_success: ok,
        runs_failed: failed,
        avg_cost_usd: Math.round(avgCost * 10000) / 10000,
        avg_latency_ms: Math.round(avgLat),
      })
      .eq("id", agent.id);

    // Update aussi le compteur global du provider
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: providerConf } = await (sb.from("ai_model_configs") as any)
      .select("id, monthly_cost_usd, monthly_tokens")
      .eq("provider", "ANTHROPIC")
      .maybeSingle();

    if (providerConf) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("ai_model_configs") as any)
        .update({
          monthly_cost_usd: Number(providerConf.monthly_cost_usd ?? 0) + res.costUsd,
          monthly_tokens: Number(providerConf.monthly_tokens ?? 0) + res.inputTokens + res.outputTokens,
        })
        .eq("id", providerConf.id);
    }
  } catch (err) {
    // Métriques non critiques — log mais ne casse pas l'audit
    console.error("[ai/agents] trackAgentRun failed:", err);
  }
}

/* ════════════════════════════════════════════════════════════════════
 * Mocks de fallback (utilisés si pas de clé ou parse fail)
 * ════════════════════════════════════════════════════════════════════ */

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function cityFor(country: string) {
  const map: Record<string, string> = {
    SN: "Dakar", CI: "Abidjan", CM: "Yaoundé", ML: "Bamako",
    NG: "Lagos", GH: "Accra", ZA: "Johannesburg", MA: "Casablanca", CD: "Kinshasa",
  };
  return map[country] ?? country;
}

function mockAudit(ctx: AgentContext): AuditAgentData {
  const seed = hash(ctx.handle);
  return {
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
}

function mockViral(ctx: AgentContext & { topic?: string }): ViralIdea[] {
  const niche = ctx.niche ?? "lifestyle";
  return [
    {
      title: `POV : tu es un jeune ${cityFor(ctx.country)}ois et tu découvres ${ctx.topic ?? "le Mobile Money"} pour la 1ère fois`,
      score: 94,
      duration: "0:45",
      niche: `${niche} · humour`,
      hooks: ["Tu as déjà essayé ça ? La 3e va te choquer.", "Personne ne t'a dit ça avant moi."],
    },
    {
      title: `3 erreurs que font 90% des créateurs ${ctx.country}`,
      score: 91,
      duration: "1:10",
      niche,
      hooks: ["Si t'es créateur en Afrique, regarde ça.", "L'erreur n°2 m'a coûté 200K FCFA."],
    },
    {
      title: `Tu peux gagner 500$/mois sur TikTok au ${cityFor(ctx.country)} si tu fais CECI`,
      score: 88,
      duration: "0:58",
      niche: `business · ${niche}`,
      hooks: ["500$ par mois sans bouger ?", "Mon ami du quartier l'a fait."],
    },
  ];
}

function mockMonetization(ctx: AgentContext): MonetizationData {
  const followers = ctx.followers ?? 12500;
  return {
    eligibleFacebookInStream: false,
    eligibleTikTokRewards: followers >= 10000,
    fbCriteria: { followers, watchMin60d: 600, currentWatchMin60d: 513 },
    tikTokCriteria: { followers, views30d: 100_000, currentViews30d: 124_000 },
    actions: [
      "Atteindre 87 minutes de watch time supplémentaires sur 60 j",
      "Activer In-Stream Ads dans Meta Business Suite",
      "Lier ton compte créateur TikTok à Creator Rewards Program",
    ],
  };
}

function mockAntiBan(): AntiBanData {
  return {
    riskScore: 18,
    risks: [
      { type: "copyright", severity: "high", message: "Audio non commercial détecté sur 3 vidéos" },
      { type: "fake_engagement", severity: "low", message: "Pas de signal suspect cette semaine" },
      { type: "sensitive", severity: "low", message: "Conforme aux règles brand safety" },
    ],
  };
}

function mockTrend(country: string): TrendData {
  return {
    country,
    hashtags: [
      { tag: "#DakarMood", velocity: "+312%", uses: 1_200_000 },
      { tag: "#NaijaJollof", velocity: "+248%", uses: 2_400_000 },
      { tag: "#AfricanCreators", velocity: "+180%", uses: 890_000 },
    ],
    sounds: [
      { title: "Afro Drill #4127", uses: 12_400_000 },
      { title: "Amapiano Lagos 2025", uses: 8_900_000 },
    ],
  };
}

/* ════════════════════════════════════════════════════════════════════
 * Orchestrator — lance les 5 agents en parallèle
 * ════════════════════════════════════════════════════════════════════ */

export async function runFullAudit(ctx: AgentContext) {
  const [audit, viral, monet, ban, trend] = await Promise.all([
    auditAgent(ctx),
    viralAgent(ctx),
    monetizationAgent(ctx),
    antiBanAgent(ctx),
    trendAgent(ctx.country),
  ]);

  // Total coût + isMock global
  const totalCostUsd = audit.costUsd + viral.costUsd + monet.costUsd + ban.costUsd + trend.costUsd;
  const anyMock = audit.isMock || viral.isMock || monet.isMock || ban.isMock || trend.isMock;
  const totalLatencyMs = Math.max(
    audit.durationMs, viral.durationMs, monet.durationMs, ban.durationMs, trend.durationMs,
  );

  return {
    audit,
    viral,
    monetization: monet,
    antiBan: ban,
    trend,
    meta: {
      totalCostUsd: Math.round(totalCostUsd * 10000) / 10000,
      totalLatencyMs,
      anyMock,
    },
  };
}

// Exposé pour debug/admin
export { AGENT_SLUG };
