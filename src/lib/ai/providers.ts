/**
 * Couche d'abstraction multi-providers pour CreaFix AI — avec orchestration et fallback.
 *
 * - Anthropic Claude (primary)
 * - OpenAI GPT (fallback 1)
 * - Google Gemini (fallback 2)
 * - Fallback intelligent : si tous les providers échouent OU si aucune clé, retourne un mock
 *
 * Chaque appel essaie le provider primary, puis cascade automatiquement sur
 * les fallbacks en cas d'erreur (rate limit, timeout, API error).
 *
 * Retry exponential backoff intégré pour les erreurs transitoires.
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type LLMProvider = "ANTHROPIC" | "OPENAI" | "GOOGLE";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  provider?: LLMProvider;
  /** Fallback providers à essayer si le primary échoue. Default: ['OPENAI', 'GOOGLE'] */
  fallbacks?: LLMProvider[];
  model?: string;
  messages: ChatMessage[];
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  /** Cache le system prompt côté Anthropic (5-min TTL). */
  cacheSystem?: boolean;
  /** Nombre max de retries par provider sur erreurs transitoires. Default: 1 */
  maxRetries?: number;
}

export interface ChatResult {
  text: string;
  parsed?: unknown;
  provider: LLMProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  latencyMs: number;
  isMock: boolean;
  /** Liste des providers essayés avant succès (utile pour debug). */
  attemptedProviders?: LLMProvider[];
}

/* ────────────────────────────────────────────────────────────────────
 * Pricing par 1M tokens
 * ──────────────────────────────────────────────────────────────────── */
const PRICING: Record<string, { in: number; out: number }> = {
  // Anthropic
  "claude-opus-4-7":           { in: 15.0, out: 75.0 },
  "claude-sonnet-4-6":         { in: 3.0,  out: 15.0 },
  "claude-haiku-4-5":          { in: 0.8,  out: 4.0  },
  "claude-haiku-4-5-20251001": { in: 0.8,  out: 4.0  },
  // OpenAI
  "gpt-4.1":         { in: 2.0, out: 8.0 },
  "gpt-4.1-mini":    { in: 0.4, out: 1.6 },
  "gpt-4o":          { in: 2.5, out: 10.0 },
  // Google Gemini
  "gemini-2.5-pro":   { in: 1.25, out: 5.0 },
  "gemini-2.5-flash": { in: 0.075, out: 0.30 },
};

function priceFor(model: string): { in: number; out: number } {
  return PRICING[model] ?? { in: 3.0, out: 15.0 };
}

/* ────────────────────────────────────────────────────────────────────
 * Clients singletons (lazy)
 * ──────────────────────────────────────────────────────────────────── */
let _anthropic: Anthropic | null = null;
let _openai: OpenAI | null = null;
let _google: GoogleGenerativeAI | null = null;

function getAnthropic(): Anthropic | null {
  if (_anthropic) return _anthropic;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  _anthropic = new Anthropic({ apiKey: key });
  return _anthropic;
}

function getOpenAI(): OpenAI | null {
  if (_openai) return _openai;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  _openai = new OpenAI({ apiKey: key });
  return _openai;
}

function getGoogle(): GoogleGenerativeAI | null {
  if (_google) return _google;
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) return null;
  _google = new GoogleGenerativeAI(key);
  return _google;
}

/** Mapping default model par provider. */
const DEFAULT_MODELS: Record<LLMProvider, string> = {
  ANTHROPIC: "claude-sonnet-4-6",
  OPENAI:    "gpt-4.1-mini",
  GOOGLE:    "gemini-2.5-flash",
};

/* ────────────────────────────────────────────────────────────────────
 * Chat — orchestrator avec fallback automatique
 * ──────────────────────────────────────────────────────────────────── */
export async function chat(opts: ChatOptions): Promise<ChatResult> {
  const {
    provider = "ANTHROPIC",
    fallbacks = ["OPENAI", "GOOGLE"],
    messages,
    json = false,
    temperature = 0.5,
    maxTokens = 2048,
    cacheSystem = false,
    maxRetries = 1,
  } = opts;

  // Construit l'ordre des providers à essayer
  const order = [provider, ...fallbacks.filter((p) => p !== provider)];
  const attempted: LLMProvider[] = [];

  for (const p of order) {
    attempted.push(p);
    const model = opts.model && order[0] === p ? opts.model : DEFAULT_MODELS[p];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const start = Date.now();
      try {
        const res = await callProvider(p, model, messages, {
          json, temperature, maxTokens, cacheSystem,
        });
        return { ...res, latencyMs: Date.now() - start, attemptedProviders: attempted };
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? "unknown";
        console.warn(`[ai/providers] ${p}/${model} attempt ${attempt + 1} failed:`, msg);
        if (attempt < maxRetries) {
          // exponential backoff: 200ms, 400ms, 800ms...
          await sleep(200 * Math.pow(2, attempt));
          continue;
        }
        // Sort de la boucle attempt, essaie le prochain provider
        break;
      }
    }
  }

  // Tous les providers ont échoué → mock
  console.error("[ai/providers] All providers failed:", attempted);
  return mockResult({ provider, model: DEFAULT_MODELS[provider], messages, json, attempted });
}

/* ────────────────────────────────────────────────────────────────────
 * Provider-specific calls
 * ──────────────────────────────────────────────────────────────────── */
async function callProvider(
  provider: LLMProvider,
  model: string,
  messages: ChatMessage[],
  opts: { json: boolean; temperature: number; maxTokens: number; cacheSystem: boolean },
): Promise<Omit<ChatResult, "latencyMs" | "attemptedProviders">> {
  switch (provider) {
    case "ANTHROPIC": return callAnthropic(model, messages, opts);
    case "OPENAI":    return callOpenAI(model, messages, opts);
    case "GOOGLE":    return callGoogle(model, messages, opts);
  }
}

async function callAnthropic(
  model: string,
  messages: ChatMessage[],
  opts: { json: boolean; temperature: number; maxTokens: number; cacheSystem: boolean },
): Promise<Omit<ChatResult, "latencyMs" | "attemptedProviders">> {
  const client = getAnthropic();
  if (!client) throw new Error("ANTHROPIC_API_KEY missing");

  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const userMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const systemParam = opts.cacheSystem && systemMsg
    ? [{ type: "text" as const, text: systemMsg, cache_control: { type: "ephemeral" as const } }]
    : systemMsg;

  const response = await client.messages.create({
    model,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
    system: systemParam,
    messages: userMessages,
  });

  const text = response.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");

  const parsed = opts.json ? extractJson(text) : undefined;
  const price = priceFor(model);
  const costUsd =
    (response.usage.input_tokens * price.in + response.usage.output_tokens * price.out) / 1_000_000;

  return {
    text, parsed,
    provider: "ANTHROPIC", model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    costUsd: round4(costUsd),
    isMock: false,
  };
}

async function callOpenAI(
  model: string,
  messages: ChatMessage[],
  opts: { json: boolean; temperature: number; maxTokens: number; cacheSystem: boolean },
): Promise<Omit<ChatResult, "latencyMs" | "attemptedProviders">> {
  const client = getOpenAI();
  if (!client) throw new Error("OPENAI_API_KEY missing");

  const response = await client.chat.completions.create({
    model,
    temperature: opts.temperature,
    max_tokens: opts.maxTokens,
    response_format: opts.json ? { type: "json_object" } : undefined,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const text = response.choices[0]?.message?.content ?? "";
  const parsed = opts.json ? extractJson(text) : undefined;
  const usage = response.usage ?? { prompt_tokens: 0, completion_tokens: 0 };
  const price = priceFor(model);
  const costUsd =
    (usage.prompt_tokens * price.in + usage.completion_tokens * price.out) / 1_000_000;

  return {
    text, parsed,
    provider: "OPENAI", model,
    inputTokens: usage.prompt_tokens,
    outputTokens: usage.completion_tokens,
    costUsd: round4(costUsd),
    isMock: false,
  };
}

async function callGoogle(
  model: string,
  messages: ChatMessage[],
  opts: { json: boolean; temperature: number; maxTokens: number; cacheSystem: boolean },
): Promise<Omit<ChatResult, "latencyMs" | "attemptedProviders">> {
  const client = getGoogle();
  if (!client) throw new Error("GOOGLE_AI_API_KEY missing");

  const systemInstruction = messages.find((m) => m.role === "system")?.content;
  const userParts = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: m.content }],
    }));

  const genModel = client.getGenerativeModel({
    model,
    systemInstruction,
    generationConfig: {
      temperature: opts.temperature,
      maxOutputTokens: opts.maxTokens,
      ...(opts.json ? { responseMimeType: "application/json" } : {}),
    },
  });

  const result = await genModel.generateContent({ contents: userParts });
  const text = result.response.text();
  const parsed = opts.json ? extractJson(text) : undefined;

  const usage = result.response.usageMetadata ?? { promptTokenCount: 0, candidatesTokenCount: 0 };
  const price = priceFor(model);
  const costUsd =
    ((usage.promptTokenCount ?? 0) * price.in + (usage.candidatesTokenCount ?? 0) * price.out) / 1_000_000;

  return {
    text, parsed,
    provider: "GOOGLE", model,
    inputTokens: usage.promptTokenCount ?? 0,
    outputTokens: usage.candidatesTokenCount ?? 0,
    costUsd: round4(costUsd),
    isMock: false,
  };
}

/* ────────────────────────────────────────────────────────────────────
 * Mock fallback
 * ──────────────────────────────────────────────────────────────────── */
function mockResult(args: {
  provider: LLMProvider;
  model: string;
  messages: ChatMessage[];
  json?: boolean;
  attempted?: LLMProvider[];
}): ChatResult {
  const lastUser = args.messages.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";
  const text = args.json
    ? `{"mock": true, "reason": "all providers failed or missing keys"}`
    : `[mock] ${lastUser.slice(0, 200)}…`;

  return {
    text,
    parsed: args.json ? { mock: true, reason: "all providers failed or missing keys" } : undefined,
    provider: args.provider,
    model: args.model + " (mock)",
    inputTokens: Math.round(lastUser.length / 4),
    outputTokens: Math.round(text.length / 4),
    costUsd: 0,
    latencyMs: 0,
    isMock: true,
    attemptedProviders: args.attempted ?? [args.provider],
  };
}

/* ────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────── */
function extractJson(text: string): unknown {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    // Tente d'extraire un bloc JSON dans du texte non strict
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}

/** Génération d'image — placeholder (Stability/DALL-E à wirer si besoin). */
export async function generateImage(prompt: string): Promise<{ url: string; isMock: boolean }> {
  void prompt;
  return { url: "/placeholder-thumbnail.png", isMock: true };
}

/** Check si au moins un provider IA est configuré. */
export function hasAnyProvider(): boolean {
  return (
    !!process.env.ANTHROPIC_API_KEY ||
    !!process.env.OPENAI_API_KEY ||
    !!process.env.GOOGLE_AI_API_KEY
  );
}

/** Liste les providers configurés (utile pour /admin/settings status). */
export function configuredProviders(): LLMProvider[] {
  const result: LLMProvider[] = [];
  if (process.env.ANTHROPIC_API_KEY) result.push("ANTHROPIC");
  if (process.env.OPENAI_API_KEY) result.push("OPENAI");
  if (process.env.GOOGLE_AI_API_KEY) result.push("GOOGLE");
  return result;
}
