/**
 * CreaFix AI — Multi-agents orchestrator (Phase D · ultra-performant).
 *
 * 7 agents spécialisés, chacun :
 *   - encapsule un system prompt expert + few-shot
 *   - appelle `chat()` via `cachedChat()` (dedup 60s pour les calls déterministes)
 *   - model routing intelligent (Opus pour raisonnement profond, Sonnet pour
 *     créativité, Haiku pour scans rapides) — optimise coût/latence/qualité
 *   - parse JSON structuré + fallback mock si pas de clé ou parse fail
 *   - track ses métriques dans monetiq.ai_agents (cost/latency/success)
 *   - retry 2× exponentiel sur erreurs transitoires (intégré dans providers.ts)
 *
 * `runFullAudit()` lance les 7 agents en parallèle (~3-8s pour le tout).
 */

import { chat, type ChatResult } from "./providers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ProfileSnapshot } from "@/lib/social/types";
import { getPlaybook } from "./platform-playbooks";

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
  /** Données *réelles* scrappées du profil. Si présent, les agents
   *  basent leur analyse dessus au lieu d'inventer. */
  snapshot?: ProfileSnapshot | null;
}

/* ════════════════════════════════════════════════════════════════════
 * Snapshot formatting — comprime le snapshot en bloc texte injectable
 * dans les prompts LLM (sans noyer Claude sous du JSON brut massif).
 * ════════════════════════════════════════════════════════════════════ */

function formatSnapshotForPrompt(snap: ProfileSnapshot | null | undefined): string | null {
  if (!snap) return null;
  const lines: string[] = [];
  lines.push(`=== DONNÉES RÉELLES DU PROFIL (scrapées via ${snap.source}) ===`);
  lines.push(`URL: ${snap.url}`);
  if (snap.displayName) lines.push(`Nom affiché: ${snap.displayName}`);
  if (snap.bio)         lines.push(`Bio: ${truncate(snap.bio, 240)}`);
  if (snap.category)    lines.push(`Catégorie déclarée: ${snap.category}`);
  if (snap.verified !== undefined) lines.push(`Compte vérifié: ${snap.verified ? "oui" : "non"}`);
  if (snap.followers !== undefined)  lines.push(`Followers: ${snap.followers.toLocaleString("fr-FR")}`);
  if (snap.following !== undefined)  lines.push(`Following: ${snap.following.toLocaleString("fr-FR")}`);
  if (snap.postsCount !== undefined) lines.push(`Total posts: ${snap.postsCount.toLocaleString("fr-FR")}`);
  if (snap.totalLikes !== undefined) lines.push(`Total likes: ${snap.totalLikes.toLocaleString("fr-FR")}`);
  if (snap.totalViews !== undefined) lines.push(`Vues totales chaîne: ${snap.totalViews.toLocaleString("fr-FR")}`);

  const a = snap.aggregates;
  if (a) {
    lines.push(`--- AGRÉGATS POSTS RÉCENTS ---`);
    if (a.avgViews !== undefined)            lines.push(`Vues moyennes/post: ${a.avgViews.toLocaleString("fr-FR")}`);
    if (a.avgLikes !== undefined)            lines.push(`Likes moyens/post: ${a.avgLikes.toLocaleString("fr-FR")}`);
    if (a.avgComments !== undefined)         lines.push(`Commentaires moyens/post: ${a.avgComments.toLocaleString("fr-FR")}`);
    if (a.engagementRatePct !== undefined)   lines.push(`Engagement rate: ${a.engagementRatePct}%`);
    if (a.postFrequencyPerWeek !== undefined) lines.push(`Fréquence: ${a.postFrequencyPerWeek} posts/semaine`);
    if (a.topHashtags?.length)               lines.push(`Top hashtags: ${a.topHashtags.map(h => `${h.tag}(${h.count})`).join(", ")}`);
  }

  if (snap.recentPosts.length) {
    lines.push(`--- ${Math.min(snap.recentPosts.length, 10)} POSTS RÉCENTS (échantillon) ---`);
    snap.recentPosts.slice(0, 10).forEach((p, i) => {
      const stats = [
        p.views !== undefined ? `${p.views.toLocaleString("fr-FR")} vues` : null,
        p.likes !== undefined ? `${p.likes.toLocaleString("fr-FR")} likes` : null,
        p.comments !== undefined ? `${p.comments.toLocaleString("fr-FR")} comm.` : null,
        p.durationSec ? `${p.durationSec}s` : null,
      ].filter(Boolean).join(" · ");
      const cap = truncate(p.caption ?? "(pas de légende)", 140);
      lines.push(`${i + 1}. [${p.mediaType ?? "?"}] ${cap}${stats ? " — " + stats : ""}`);
    });
  }
  return lines.join("\n");
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

export interface AgentResult<T = unknown> {
  agent: AgentName;
  model: string;
  durationMs: number;
  confidence: number;
  data: T;
  /** True si la réponse vient du mock (pas de clé Anthropic ou parse fail). */
  isMock: boolean;
  /** Coût USD de cette run (0 si mock ou cache hit). */
  costUsd: number;
  /** True si la réponse provient du cache request-level. */
  cacheHit: boolean;
}

const AGENT_SLUG: Record<AgentName, string> = {
  audit:          "monetization-agent",
  monetization:   "monetization-agent",
  viral:          "viral-agent",
  "anti-ban":     "shadowban-agent",
  trend:          "trend-scanner-agent",
  thumbnail:      "thumbnail-agent",
  script:         "hook-rewriter-agent",
};

/* ════════════════════════════════════════════════════════════════════
 * Smart model routing — par tâche (coût/latence/qualité)
 * ════════════════════════════════════════════════════════════════════ */

const MODEL_AUDIT      = "claude-opus-4-7";   // raisonnement profond, 8 dimensions
const MODEL_CREATIVE   = "claude-sonnet-4-6"; // viral, thumbnail, script (balance)
const MODEL_ANALYTICAL = "claude-sonnet-4-6"; // monetization (déductions claires)
const MODEL_FAST       = "claude-haiku-4-5";  // anti-ban + trend (scans rapides)

/* ════════════════════════════════════════════════════════════════════
 * Request-level cache — dedup 60s sur calls déterministes (temperature ≤ 0.5)
 *
 * Pour audit/monetization/anti-ban/trend : si le même contexte est ré-audité
 * en rafale (re-run user, ré-affichage page), on évite le re-appel LLM.
 * Pour viral/thumbnail/script (créatif, temperature 0.8+), pas de cache.
 * ════════════════════════════════════════════════════════════════════ */

interface CacheEntry { result: ChatResult; expiresAt: number }
const requestCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;
const CACHE_MAX_ENTRIES = 200;

async function cachedChat(opts: Parameters<typeof chat>[0]): Promise<ChatResult & { cacheHit: boolean }> {
  // Calls créatifs (haute température) : pas de dedup, on veut de la variété.
  if ((opts.temperature ?? 0) > 0.5) {
    const res = await chat(opts);
    return { ...res, cacheHit: false };
  }

  const key = `${opts.provider ?? "ANTHROPIC"}:${opts.model ?? "default"}:${JSON.stringify(opts.messages)}:${opts.temperature ?? 0}:${opts.maxTokens ?? 0}`;
  const now = Date.now();
  const cached = requestCache.get(key);
  if (cached && cached.expiresAt > now) {
    return { ...cached.result, latencyMs: 0, costUsd: 0, cacheHit: true };
  }

  const result = await chat(opts);

  // N'incache que les vraies réponses LLM (pas les mocks ou erreurs)
  if (!result.isMock) {
    requestCache.set(key, { result, expiresAt: now + CACHE_TTL_MS });
    // Purge LRU naïf : si > MAX, drop tout ce qui est expiré
    if (requestCache.size > CACHE_MAX_ENTRIES) {
      for (const [k, v] of requestCache) {
        if (v.expiresAt < now) requestCache.delete(k);
      }
    }
  }

  return { ...result, cacheHit: false };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT 1 : AUDIT GLOBAL (Monetization Agent · OPUS)
 * ════════════════════════════════════════════════════════════════════ */

export interface AuditAgentData {
  scoreGlobal: number;
  dimensions: { name: string; score: number }[];
  issues: { severity: "low" | "medium" | "high"; title: string; scope: string }[];
}

function buildAuditSystemPrompt(platform: Platform): string {
  const pb = getPlaybook(platform);
  return `Tu es un analyste senior de monétisation de contenus sociaux SPÉCIALISÉ ${pb.name}, expert du marché africain (Sénégal, Côte d'Ivoire, Cameroun, Mali, Nigeria, Ghana, Afrique du Sud, Maroc, RD Congo).

Tes recommandations et tes issues DOIVENT refléter les réalités opérationnelles de ${pb.name} — pas une plateforme générique.

=== CONTEXTE ${pb.name.toUpperCase()} : LEVIERS DE VISIBILITÉ ===
${pb.levers}

=== CONTEXTE ${pb.name.toUpperCase()} : RISQUES PRINCIPAUX ===
${pb.risks}

OBLIGATION ABSOLUE : tu DOIS toujours retourner exactement 8 dimensions ET 3 issues ET un scoreGlobal numérique. JAMAIS d'array vide, JAMAIS de scoreGlobal null. C'est non-négociable même si les données sont partielles ou absentes.

Stratégie de notation selon les données disponibles :

CAS A — bloc "=== DONNÉES RÉELLES DU PROFIL ===" présent avec des posts et engagement :
Base les scores STRICTEMENT sur ce que tu observes, en appliquant les leviers ${pb.name} ci-dessus :
- Engagement rate observé → Engagement authentique
- Fréquence posts/semaine → Fréquence & calendrier
- Hashtags réellement utilisés → SEO & métadonnées
- Vues moyennes vs followers → Watch time / CTR
- Bio, légendes → SEO et conformité
- Musique / sons utilisés → Copyright (sévérité variable selon ${pb.name})

CAS B — bloc présent mais DONNÉES PARTIELLES (followers seuls, 0 post visible, bio absente) :
Tu disposes des followers mais pas du contenu. Donne des scores prudents 45-70 estimés par la niche/pays/followers, et SIGNALE explicitement dans la 1ère issue : severity:"medium", title:"Audit limité — profil scrapé partiellement (0 post visible)", scope:"Anti-Ban".

CAS C — AUCUN bloc fourni :
Audit basé sur niche/pays/${pb.name} uniquement. 1ère issue obligatoire : severity:"medium", title:"Audit basé sur estimations — connecter le compte pour analyse approfondie", scope:"Monetization".

Dimensions (toujours ces 8 noms exacts, scores 0-100) :
1. Conformité politiques
2. Qualité vidéo & rétention
3. Engagement authentique
4. Watch time / CTR
5. Copyright & musique
6. Fréquence & calendrier
7. SEO & métadonnées
8. Qualité audience

Issues (toujours 3, triées par sévérité décroissante, FORMULÉES SPÉCIFIQUEMENT POUR ${pb.name}) :
severity = low|medium|high. Scope = Anti-Ban|Monetization|SEO|Engagement.
Les titres doivent mentionner des mécanismes propres à ${pb.name} (ex pour TikTok : "Sons commerciaux non-libres détectés — risque mute Creator Rewards" ; pour YouTube : "CTR thumbnail < 4% sur dernières vidéos — algo arrête de pousser").

Tu DOIS répondre UNIQUEMENT en JSON valide, format strict (jamais vide) :
{
  "scoreGlobal": <0-100, JAMAIS null>,
  "dimensions": [{"name": "<un des 8 ci-dessus>", "score": <0-100>}, ...EXACTEMENT 8 items],
  "issues": [{"severity": "high|medium|low", "title": "<court, factuel, spécifique ${pb.name}>", "scope": "<court>"}, ...EXACTEMENT 3 items]
}`;
}

export async function auditAgent(ctx: AgentContext): Promise<AgentResult<AuditAgentData>> {
  const start = Date.now();
  const userMsg = buildAuditUserMessage(ctx);

  const res = await cachedChat({
    provider: "ANTHROPIC",
    model: MODEL_AUDIT,
    cacheSystem: true,
    json: true,
    temperature: 0.3,
    maxTokens: 1500,
    maxRetries: 2,
    messages: [
      { role: "system", content: buildAuditSystemPrompt(ctx.platform) },
      { role: "user", content: userMsg },
    ],
  });

  const data = parseOrFallback<AuditAgentData>(res, mockAudit(ctx));
  void trackAgentRun("monetization-agent", res, !res.isMock);

  return {
    agent: "audit",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: confidenceFor(res, 94),
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
    cacheHit: res.cacheHit,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT 2 : VIRAL (Sonnet · creative)
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
- score : potentiel viral 0-100 estimé (sois honnête, pas tout à 90+)
- duration : durée optimale (ex "0:45", "1:10")
- niche : niche précise
- hooks : 2 hooks ultra-accrocheurs pour les 3 premières secondes (max 80 char, doivent créer une curiosité gap)

Tu connais les codes culturels locaux : Mobile Money (Wave/OM/MTN/Moov), afrobeats, amapiano, mbalax, coupé-décalé, langues locales (wolof, lingala, pidgin, wolof, bambara), références sportives (LDC d'Afrique, AFCON).

Réponse UNIQUEMENT en JSON valide :
[
  {"title": "...", "score": <0-100>, "duration": "M:SS", "niche": "...", "hooks": ["...", "..."]},
  ... 3 items au total
]`;

export async function viralAgent(
  ctx: AgentContext & { topic?: string },
): Promise<AgentResult<ViralIdea[]>> {
  const start = Date.now();
  const snapshotBlock = formatSnapshotForPrompt(ctx.snapshot);
  const followers = ctx.snapshot?.followers ?? ctx.followers;
  const userMsg = [
    `Créateur: @${ctx.handle} · ${ctx.platform} · pays ${ctx.country} · niche ${ctx.niche ?? "générale"} · ${followers ?? "?"} abonnés${ctx.topic ? ` · sujet à explorer: ${ctx.topic}` : ""}`,
    snapshotBlock ? `\n${snapshotBlock}\n\nInspire-toi des sujets, ton et formats déjà performants chez ce créateur pour générer 3 nouvelles idées dans sa lignée mais avec un potentiel viral supérieur.` : null,
  ].filter(Boolean).join("\n");

  const res = await cachedChat({
    provider: "ANTHROPIC",
    model: MODEL_CREATIVE,
    cacheSystem: true,
    json: true,
    temperature: 0.85,
    maxTokens: 1200,
    maxRetries: 2,
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
    confidence: confidenceFor(res, 88),
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
    cacheHit: res.cacheHit,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT 3 : MONETIZATION (Sonnet · analytical)
 * ════════════════════════════════════════════════════════════════════ */

export interface MonetizationData {
  eligibleFacebookInStream: boolean;
  eligibleTikTokRewards: boolean;
  fbCriteria: { followers: number; watchMin60d: number; currentWatchMin60d: number };
  tikTokCriteria: { followers: number; views30d: number; currentViews30d: number };
  actions: string[];
}

function buildMonetSystemPrompt(platform: Platform): string {
  const pb = getPlaybook(platform);
  return `Tu es un expert monétisation sociale SPÉCIALISÉ ${pb.name}.

Tes 3 actions DOIVENT être spécifiques à ${pb.name} — pas génériques. Mentionne les programmes, seuils et leviers réels de ${pb.name} dans chaque action (pas "augmente ton engagement" mais "active Creator Rewards en publiant 3 vidéos ≥ 1 min cette semaine").

=== PROGRAMMES DE MONÉTISATION ${pb.name.toUpperCase()} (réalité 2024+) ===
${pb.monetization}

Pour ce créateur, estime les critères actuels (basés sur followers et niche), détermine l'éligibilité aux 2 programmes ci-dessous (qui restent les références historiques, peu importe la plateforme audité), puis propose 3 actions concrètes priorisées (impact × effort) AXÉES SUR LES PROGRAMMES ${pb.name} ci-dessus.

Référence historique (à conserver dans le JSON, MÊME pour les autres plateformes pour ne pas casser le schéma de la base) :
- Facebook In-Stream Ads : 10K followers + 600 min watch time / 60j + page éligible
- TikTok Creator Rewards : 10K followers + 100K vues / 30j + vidéos > 1 min

Réponse UNIQUEMENT en JSON valide :
{
  "eligibleFacebookInStream": <bool, true uniquement si plateforme=FACEBOOK et critères atteints>,
  "eligibleTikTokRewards": <bool, true uniquement si plateforme=TIKTOK et critères atteints>,
  "fbCriteria": {"followers": <n>, "watchMin60d": 600, "currentWatchMin60d": <n>},
  "tikTokCriteria": {"followers": <n>, "views30d": 100000, "currentViews30d": <n>},
  "actions": ["<action 1 ${pb.name}>", "<action 2 ${pb.name}>", "<action 3 ${pb.name}>"]
}`;
}

export async function monetizationAgent(ctx: AgentContext): Promise<AgentResult<MonetizationData>> {
  const start = Date.now();
  const snapshotBlock = formatSnapshotForPrompt(ctx.snapshot);
  const followers = ctx.snapshot?.followers ?? ctx.followers ?? 12500;
  const userMsg = [
    `Compte: @${ctx.handle} · ${ctx.platform} · ${ctx.country} · niche ${ctx.niche ?? "?"} · followers ${followers}`,
    snapshotBlock ? `\n${snapshotBlock}\n\nBase les critères d'éligibilité et les actions sur les chiffres réels ci-dessus.` : null,
  ].filter(Boolean).join("\n");

  const res = await cachedChat({
    provider: "ANTHROPIC",
    model: MODEL_ANALYTICAL,
    cacheSystem: true,
    json: true,
    temperature: 0.4,
    maxTokens: 1024,
    maxRetries: 2,
    messages: [
      { role: "system", content: buildMonetSystemPrompt(ctx.platform) },
      { role: "user", content: userMsg },
    ],
  });

  const data = parseOrFallback<MonetizationData>(res, mockMonetization(ctx));
  void trackAgentRun("monetization-agent", res, !res.isMock);

  return {
    agent: "monetization",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: confidenceFor(res, 90),
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
    cacheHit: res.cacheHit,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT 4 : ANTI-BAN (Haiku · fast scan)
 * ════════════════════════════════════════════════════════════════════ */

export interface AntiBanData {
  riskScore: number;
  risks: {
    type: "copyright" | "fake_engagement" | "sensitive" | "spam" | "recycled" | "policy";
    severity: "low" | "medium" | "high";
    message: string;
  }[];
}

function buildAntiBanSystemPrompt(platform: Platform): string {
  const pb = getPlaybook(platform);
  return `Tu es un spécialiste de la détection de shadowban et démonétisation SPÉCIALISÉ ${pb.name}.

Tes messages de risque DOIVENT mentionner des mécanismes spécifiques à ${pb.name}, pas des génériques type "attention copyright".

=== RISQUES DOMINANTS SUR ${pb.name.toUpperCase()} (réalité 2024+) ===
${pb.risks}

Identifie les risques observables sur le compte parmi : copyright audio, fake engagement, contenu sensible, spam, recyclage, violation policy — mais en formulant les messages avec le vocabulaire et les mécanismes de ${pb.name} ci-dessus.

Score de risque global 0-100 (0 = aucun risque, 100 = compte en très grand danger).

Réponse UNIQUEMENT en JSON valide :
{
  "riskScore": <0-100>,
  "risks": [
    {"type": "copyright|fake_engagement|sensitive|spam|recycled|policy", "severity": "low|medium|high", "message": "<court, spécifique ${pb.name}>"},
    ... 3 items
  ]
}`;
}

export async function antiBanAgent(ctx: AgentContext): Promise<AgentResult<AntiBanData>> {
  const start = Date.now();
  const snapshotBlock = formatSnapshotForPrompt(ctx.snapshot);
  const userMsg = [
    `Compte à scanner : @${ctx.handle} · ${ctx.platform} · ${ctx.country}`,
    snapshotBlock ? `\n${snapshotBlock}\n\nIdentifie les risques observables dans les légendes, hashtags et patterns d'engagement réels ci-dessus (ex : pic de likes suspect, hashtags bannis, contenu sensible).` : null,
  ].filter(Boolean).join("\n");

  const res = await cachedChat({
    provider: "ANTHROPIC",
    model: MODEL_FAST,
    cacheSystem: true,
    json: true,
    temperature: 0.2,
    maxTokens: 800,
    maxRetries: 2,
    messages: [
      { role: "system", content: buildAntiBanSystemPrompt(ctx.platform) },
      { role: "user", content: userMsg },
    ],
  });

  const data = parseOrFallback<AntiBanData>(res, mockAntiBan(ctx));
  void trackAgentRun("shadowban-agent", res, !res.isMock);

  return {
    agent: "anti-ban",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: confidenceFor(res, 88),
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
    cacheHit: res.cacheHit,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT 5 : TREND SCANNER (Haiku · fast cultural lookup)
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

  const res = await cachedChat({
    provider: "ANTHROPIC",
    model: MODEL_FAST,
    cacheSystem: true,
    json: true,
    temperature: 0.5,
    maxTokens: 700,
    maxRetries: 2,
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
    confidence: confidenceFor(res, 85),
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
    cacheHit: res.cacheHit,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT 6 : THUMBNAIL (Sonnet · creative — NEW)
 *
 * Génère 8 concepts miniatures A/B-testables avec CTR estimé.
 * Sortie : descriptions précises (couleur fond, accent, expression,
 * archetype, headline) — utilisables soit par un designer humain soit
 * par un générateur d'images (DALL-E, Stability, Midjourney).
 * ════════════════════════════════════════════════════════════════════ */

export interface ThumbnailConcept {
  headline: string;          // texte overlay (≤ 5 mots, MAJUSCULES OK)
  bgColor: string;           // hex
  accentColor: string;       // hex
  emoji: string;             // emoji principal
  faceExpression: string;    // "choquée", "défi", "rire", "victoire"
  archetype: "shock" | "before-after" | "list" | "question" | "challenge" | "reveal" | "money" | "social-proof";
  estimatedCtrLift: number;  // % uplift estimé vs baseline industry (3-5%)
}

const THUMBNAIL_SYSTEM_PROMPT = `Tu es un expert miniatures (thumbnails) YouTube/TikTok/Reels, spécialisé contenu créateurs africains.

Tu génères 8 concepts miniatures A/B-testables variés. Pour chacun :
- headline : texte overlay ≤ 5 mots, punchy, MAJUSCULES OK (ex "JE SUIS RUINÉ", "TON SECRET")
- bgColor + accentColor : hex codes contrastés (ratio ≥ 4.5:1 pour lisibilité mobile)
- emoji : 1 emoji principal qui amplifie l'émotion
- faceExpression : expression faciale dominante (choquée, défi, rire, victoire, etc.)
- archetype : un de [shock, before-after, list, question, challenge, reveal, money, social-proof]
- estimatedCtrLift : % uplift estimé vs baseline (typiquement 3-25%)

Varie les archetypes. N'utilise PAS deux fois le même. Mixe couleurs (warm/cool/neon/pastel).
Pense mobile-first : la miniature doit lire en 80×80px.

Réponse UNIQUEMENT en JSON valide :
[
  {"headline":"...","bgColor":"#RRGGBB","accentColor":"#RRGGBB","emoji":"🔥","faceExpression":"...","archetype":"...","estimatedCtrLift":<n>},
  ... 8 items
]`;

export async function thumbnailAgent(
  ctx: AgentContext & { topic?: string },
): Promise<AgentResult<ThumbnailConcept[]>> {
  const start = Date.now();
  const userMsg = `Créateur : @${ctx.handle} · ${ctx.platform} · ${ctx.country} · niche ${ctx.niche ?? "générale"}${ctx.topic ? ` · sujet vidéo : ${ctx.topic}` : ""}`;

  const res = await cachedChat({
    provider: "ANTHROPIC",
    model: MODEL_CREATIVE,
    cacheSystem: true,
    json: true,
    temperature: 0.8,
    maxTokens: 1500,
    maxRetries: 2,
    messages: [
      { role: "system", content: THUMBNAIL_SYSTEM_PROMPT },
      { role: "user", content: userMsg },
    ],
  });

  const data = parseOrFallback<ThumbnailConcept[]>(res, mockThumbnail(ctx));
  void trackAgentRun("thumbnail-agent", res, !res.isMock);

  return {
    agent: "thumbnail",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: confidenceFor(res, 86),
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
    cacheHit: res.cacheHit,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * AGENT 7 : SCRIPT (Sonnet · creative writing — NEW)
 *
 * Réécrit le hook + génère 3 variantes de script court (~45-60s).
 * Chaque variante : structure beats (timing + ligne + b-roll suggéré) + CTA + tone TTS.
 * ════════════════════════════════════════════════════════════════════ */

export interface ScriptVariant {
  hookRewrite: string;                  // hook punchy 0-3s (≤ 80 char)
  beats: { ts: string; line: string; bRoll: string }[];  // 4-6 beats
  cta: string;                          // 5-15s final
  ttsTone: "energetic" | "calm" | "dramatic" | "casual";
  estimatedRetention: number;           // 0-100 — rétention attendue
}

const SCRIPT_SYSTEM_PROMPT = `Tu es un script writer expert Reels/Shorts/TikTok pour créateurs africains.

Tu produis 3 variantes complètes de script court (~45-60s) à partir d'un sujet/hook donné.

Pour chaque variante :
- hookRewrite : hook 0-3s ultra-punchy (≤ 80 char), crée curiosity gap, MAJUSCULES OK
- beats : 4-6 beats, chacun avec ts (mm:ss start), line (script ≤ 120 char), bRoll (description visuelle ≤ 60 char)
- cta : call-to-action final (≤ 100 char) — abonne / commente / partage
- ttsTone : un de [energetic, calm, dramatic, casual]
- estimatedRetention : % rétention 0-100 attendue (calculé selon la qualité du hook et la progression)

Varie les 3 variantes : un ton energetic short-form, un dramatique storytelling, un casual didactique.
Codes locaux : afrobeats refs, mobile money, langues locales si pertinent, sport.

Réponse UNIQUEMENT en JSON valide :
[
  {
    "hookRewrite":"...",
    "beats":[{"ts":"0:03","line":"...","bRoll":"..."}, ...4-6 items],
    "cta":"...",
    "ttsTone":"...",
    "estimatedRetention":<n>
  },
  ... 3 variantes
]`;

export async function scriptAgent(
  ctx: AgentContext & { topic?: string; existingHook?: string },
): Promise<AgentResult<ScriptVariant[]>> {
  const start = Date.now();
  const userMsg = [
    `Créateur : @${ctx.handle} · ${ctx.platform} · ${ctx.country} · niche ${ctx.niche ?? "générale"}`,
    ctx.topic ? `Sujet vidéo : ${ctx.topic}` : null,
    ctx.existingHook ? `Hook actuel à améliorer : "${ctx.existingHook}"` : null,
    `Génère 3 variantes complètes selon ton system prompt.`,
  ].filter(Boolean).join("\n");

  const res = await cachedChat({
    provider: "ANTHROPIC",
    model: MODEL_CREATIVE,
    cacheSystem: true,
    json: true,
    temperature: 0.85,
    maxTokens: 2000,
    maxRetries: 2,
    messages: [
      { role: "system", content: SCRIPT_SYSTEM_PROMPT },
      { role: "user", content: userMsg },
    ],
  });

  const data = parseOrFallback<ScriptVariant[]>(res, mockScript(ctx));
  void trackAgentRun("hook-rewriter-agent", res, !res.isMock);

  return {
    agent: "script",
    model: res.model,
    durationMs: Date.now() - start,
    confidence: confidenceFor(res, 87),
    data,
    isMock: res.isMock,
    costUsd: res.costUsd,
    cacheHit: res.cacheHit,
  };
}

/* ════════════════════════════════════════════════════════════════════
 * Helpers : prompt building & parsing
 * ════════════════════════════════════════════════════════════════════ */

function buildAuditUserMessage(ctx: AgentContext): string {
  const snapshotBlock = formatSnapshotForPrompt(ctx.snapshot);
  const followers = ctx.snapshot?.followers ?? ctx.followers;
  return [
    `Audit IA pour le compte créateur suivant :`,
    `• Handle: @${ctx.handle}`,
    `• Plateforme: ${ctx.platform}`,
    `• Pays: ${ctx.country}`,
    ctx.niche ? `• Niche: ${ctx.niche}` : null,
    followers ? `• Followers: ${followers.toLocaleString("fr-FR")}` : null,
    ctx.monthlyViews ? `• Vues mensuelles: ${ctx.monthlyViews.toLocaleString("fr-FR")}` : null,
    ctx.watchTimeMin ? `• Watch time 60j: ${ctx.watchTimeMin} min` : null,
    ``,
    snapshotBlock ?? `(Aucune donnée temps-réel disponible — produit un audit basé sur niche/pays et signale-le dans une issue.)`,
    ``,
    `Génère l'audit JSON complet selon ton system prompt.`,
  ].filter(Boolean).join("\n");
}

function parseOrFallback<T>(res: ChatResult, fallback: T): T {
  let parsed: unknown = null;
  if (res.parsed && typeof res.parsed === "object") {
    parsed = res.parsed;
  } else if (res.text) {
    try {
      const match = res.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) parsed = JSON.parse(match[0]);
    } catch { /* swallow */ }
  }

  if (parsed === null || parsed === undefined) return fallback;

  // Si le LLM a renvoyé un objet/array vide ou avec des champs critiques manquants,
  // on merge avec le mock pour garantir une structure complète côté UI.
  return mergeWithFallback(parsed, fallback) as T;
}

/** Merge récursif : prend les clés du LLM si non-null/non-empty, sinon celles du mock.
 *  Empêche que score_global=null ou dimensions=[] ne casse l'UI. */
function mergeWithFallback(llm: unknown, mock: unknown): unknown {
  // Array : si LLM array vide → mock array. Sinon LLM gagne.
  if (Array.isArray(mock)) {
    if (Array.isArray(llm) && llm.length > 0) return llm;
    return mock;
  }
  // Object : merge clé par clé
  if (mock && typeof mock === "object") {
    if (!llm || typeof llm !== "object" || Array.isArray(llm)) return mock;
    const out: Record<string, unknown> = {};
    const llmObj = llm as Record<string, unknown>;
    const mockObj = mock as Record<string, unknown>;
    for (const k of Object.keys(mockObj)) {
      const lv = llmObj[k];
      const mv = mockObj[k];
      if (lv === undefined || lv === null) { out[k] = mv; continue; }
      if (Array.isArray(mv)) { out[k] = mergeWithFallback(lv, mv); continue; }
      if (mv && typeof mv === "object") { out[k] = mergeWithFallback(lv, mv); continue; }
      out[k] = lv;
    }
    // Garde aussi les clés extra du LLM (au cas où)
    for (const k of Object.keys(llmObj)) {
      if (!(k in out)) out[k] = llmObj[k];
    }
    return out;
  }
  // Primitive : LLM gagne si défini
  return llm ?? mock;
}

/** Confidence dynamique : haut si LLM réussit, bas si fallback mock. */
function confidenceFor(res: { isMock: boolean; cacheHit: boolean }, hi: number): number {
  if (res.isMock) return 60;
  // Cache hit = même qualité que l'original
  return hi;
}

/* ════════════════════════════════════════════════════════════════════
 * Metrics tracking — update monetiq.ai_agents après chaque run
 * ════════════════════════════════════════════════════════════════════ */

async function trackAgentRun(slug: string, res: ChatResult, success: boolean): Promise<void> {
  // Skip si cache hit ou mock (pas de vraie consommation)
  if (res.costUsd === 0 && success) return;

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
    const avgCost = ((Number(agent.avg_cost_usd ?? 0) * (total - 1)) + res.costUsd) / total;
    const avgLat  = ((Number(agent.avg_latency_ms ?? 0) * (total - 1)) + res.latencyMs) / total;

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
  const pb = getPlaybook(ctx.platform);
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
    issues: pb.defaultIssues,
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
  const pb = getPlaybook(ctx.platform);
  return {
    eligibleFacebookInStream: ctx.platform === "FACEBOOK" && followers >= 10_000,
    eligibleTikTokRewards: ctx.platform === "TIKTOK" && followers >= 10_000,
    fbCriteria: { followers, watchMin60d: 600, currentWatchMin60d: 513 },
    tikTokCriteria: { followers, views30d: 100_000, currentViews30d: 124_000 },
    actions: pb.defaultMonetActions,
  };
}

function mockAntiBan(ctx?: AgentContext): AntiBanData {
  const pb = getPlaybook(ctx?.platform);
  return {
    riskScore: 18,
    risks: pb.defaultAntibanRisks,
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

function mockThumbnail(ctx: AgentContext): ThumbnailConcept[] {
  const niche = ctx.niche ?? "lifestyle";
  return [
    { headline: "JE SUIS RUINÉ",      bgColor: "#F43F5E", accentColor: "#FCD34D", emoji: "😱", faceExpression: "choquée",  archetype: "shock",         estimatedCtrLift: 18 },
    { headline: "AVANT vs APRÈS",     bgColor: "#1FBEAF", accentColor: "#0F172A", emoji: "⚡", faceExpression: "défi",     archetype: "before-after",  estimatedCtrLift: 14 },
    { headline: "TOP 3 ERREURS",      bgColor: "#0F172A", accentColor: "#FF8A00", emoji: "🚨", faceExpression: "sérieux",  archetype: "list",          estimatedCtrLift: 11 },
    { headline: "POURQUOI TU PERDS ?", bgColor: "#EC4899", accentColor: "#FFFFFF", emoji: "❓", faceExpression: "intriguée", archetype: "question",     estimatedCtrLift: 9  },
    { headline: "RELÈVE LE DÉFI",     bgColor: "#FF8A00", accentColor: "#0F172A", emoji: "🔥", faceExpression: "défi",     archetype: "challenge",     estimatedCtrLift: 12 },
    { headline: "LA VÉRITÉ CACHÉE",   bgColor: "#7C3AED", accentColor: "#FCD34D", emoji: "👀", faceExpression: "curieuse", archetype: "reveal",        estimatedCtrLift: 16 },
    { headline: `500K FCFA · ${niche.toUpperCase()}`, bgColor: "#10B981", accentColor: "#FFFFFF", emoji: "💰", faceExpression: "victoire", archetype: "money", estimatedCtrLift: 13 },
    { headline: "10K LE VEULENT",     bgColor: "#1877F2", accentColor: "#FCD34D", emoji: "🌍", faceExpression: "fier",     archetype: "social-proof",  estimatedCtrLift: 10 },
  ];
}

function mockScript(ctx: AgentContext & { topic?: string }): ScriptVariant[] {
  const topic = ctx.topic ?? "ma technique secrète";
  return [
    {
      hookRewrite: `Si t'es au ${cityFor(ctx.country)}, écoute bien — ça change tout.`,
      beats: [
        { ts: "0:03", line: `Voici ${topic} que personne ne fait.`, bRoll: "close-up visage choqué" },
        { ts: "0:10", line: "Étape 1 : tu fais l'exact opposé de ce que les gens font.", bRoll: "schéma main qui dessine" },
        { ts: "0:22", line: "Étape 2 : tu attends 48h sans publier.", bRoll: "horloge timelapse" },
        { ts: "0:35", line: "Étape 3 : tu lances avec ce hook précis.", bRoll: "phone affiche un hook" },
      ],
      cta: "Si ça t'a aidé, abonne-toi — je sors le détail demain.",
      ttsTone: "energetic",
      estimatedRetention: 78,
    },
    {
      hookRewrite: `J'ai perdu 200K FCFA à cause de ça — apprends de mon erreur.`,
      beats: [
        { ts: "0:03", line: "Voilà ce qui m'est arrivé.", bRoll: "ralenti regard caméra" },
        { ts: "0:12", line: `J'ai cru bien faire avec ${topic}.`, bRoll: "tableau noir avec mots barrés" },
        { ts: "0:25", line: "Mais l'algo a complètement gelé mon compte.", bRoll: "graphique en chute" },
        { ts: "0:40", line: "Voici les 3 signaux à surveiller absolument.", bRoll: "loupe sur écran phone" },
      ],
      cta: "Sauvegarde cette vidéo — tu vas en avoir besoin.",
      ttsTone: "dramatic",
      estimatedRetention: 82,
    },
    {
      hookRewrite: `${topic} expliqué simplement — en 60 secondes.`,
      beats: [
        { ts: "0:03", line: `${topic} c'est quoi exactement ?`, bRoll: "intro texte centré écran" },
        { ts: "0:10", line: "Le principe : on optimise un seul levier à la fois.", bRoll: "icône cible bouge" },
        { ts: "0:25", line: "Exemple concret avec un créateur que je suis.", bRoll: "screenshot insights anonymisé" },
        { ts: "0:42", line: "Résultat : x3 sur les vues monétisées en 30 jours.", bRoll: "graphique croissance" },
      ],
      cta: "Suis-moi pour la méthode complète demain.",
      ttsTone: "casual",
      estimatedRetention: 71,
    },
  ];
}

/* ════════════════════════════════════════════════════════════════════
 * Orchestrator — lance les 7 agents en parallèle (~3-8s vs 30-60s séquentiel)
 * ════════════════════════════════════════════════════════════════════ */

export async function runFullAudit(ctx: AgentContext & { topic?: string }) {
  const [audit, viral, monet, ban, trend, thumbnail, script] = await Promise.all([
    auditAgent(ctx),
    viralAgent(ctx),
    monetizationAgent(ctx),
    antiBanAgent(ctx),
    trendAgent(ctx.country),
    thumbnailAgent(ctx),
    scriptAgent(ctx),
  ]);

  const allAgents = [audit, viral, monet, ban, trend, thumbnail, script];
  const totalCostUsd = allAgents.reduce((s, a) => s + a.costUsd, 0);
  const totalLatencyMs = Math.max(...allAgents.map((a) => a.durationMs));
  const anyMock = allAgents.some((a) => a.isMock);
  const cacheHits = allAgents.filter((a) => a.cacheHit).length;

  // dataSource = "real" si on a un vrai snapshot, sinon "simulated"
  const hasSnapshot = !!ctx.snapshot && (ctx.snapshot.recentPosts.length > 0 || ctx.snapshot.followers !== undefined);
  const dataSource: "real" | "partial" | "simulated" =
    hasSnapshot && ctx.snapshot!.recentPosts.length > 0 && ctx.snapshot!.followers !== undefined
      ? "real"
      : hasSnapshot
        ? "partial"
        : "simulated";

  return {
    audit,
    viral,
    monetization: monet,
    antiBan: ban,
    trend,
    thumbnail,
    script,
    meta: {
      totalCostUsd: Math.round(totalCostUsd * 10000) / 10000,
      totalLatencyMs,
      anyMock,
      cacheHits,
      agentsCount: allAgents.length,
      dataSource,
      snapshotSource: ctx.snapshot?.source,
    },
  };
}

// Exposé pour debug/admin
export { AGENT_SLUG };
