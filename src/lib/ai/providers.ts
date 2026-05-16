/**
 * Couche d'abstraction multi-providers pour CreaFix AI.
 *
 * - Anthropic Claude (primary) — utilise @anthropic-ai/sdk si ANTHROPIC_API_KEY est set
 * - OpenAI / Google : structure prête, à brancher quand SDKs installés
 * - Fallback intelligent : si pas de clé, retourne un mock structuré
 *
 * Toujours utiliser prompt caching (Anthropic ephemeral cache_control) sur les
 * system prompts pour les agents qui tournent en boucle (Trend Scanner, Monetization).
 */

import Anthropic from "@anthropic-ai/sdk";

export type LLMProvider = "ANTHROPIC" | "OPENAI" | "GOOGLE";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  provider?: LLMProvider;
  model?: string;
  messages: ChatMessage[];
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  /** Cache le system prompt côté Anthropic (5-min TTL) — utiliser pour prompts > 1024 tokens. */
  cacheSystem?: boolean;
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
}

/* ────────────────────────────────────────────────────────────────────
 * Prix par 1M tokens (input/output) — sync avec docs.anthropic.com
 * À ajuster si Anthropic change les tarifs.
 * ──────────────────────────────────────────────────────────────────── */
const ANTHROPIC_PRICING: Record<string, { in: number; out: number }> = {
  "claude-opus-4-7":     { in: 15.0, out: 75.0 },
  "claude-sonnet-4-6":   { in: 3.0,  out: 15.0 },
  "claude-haiku-4-5":    { in: 0.8,  out: 4.0  },
  "claude-haiku-4-5-20251001": { in: 0.8, out: 4.0 },
};

function priceFor(model: string): { in: number; out: number } {
  return ANTHROPIC_PRICING[model] ?? { in: 3.0, out: 15.0 };
}

/* ────────────────────────────────────────────────────────────────────
 * Anthropic client singleton (lazy)
 * ──────────────────────────────────────────────────────────────────── */
let _anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic | null {
  if (_anthropic) return _anthropic;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  _anthropic = new Anthropic({ apiKey: key });
  return _anthropic;
}

/* ────────────────────────────────────────────────────────────────────
 * Chat principal — multi-provider, structured output, metrics
 * ──────────────────────────────────────────────────────────────────── */
export async function chat(opts: ChatOptions): Promise<ChatResult> {
  const {
    provider = "ANTHROPIC",
    model = "claude-sonnet-4-6",
    messages,
    json = false,
    temperature = 0.5,
    maxTokens = 2048,
    cacheSystem = false,
  } = opts;

  const start = Date.now();

  // ─── Anthropic real call ───
  if (provider === "ANTHROPIC") {
    const client = getAnthropic();
    if (!client) {
      return mockResult({ provider, model, messages, json, latencyMs: 0 });
    }

    const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    try {
      const systemParam = cacheSystem && systemMsg
        ? [{ type: "text" as const, text: systemMsg, cache_control: { type: "ephemeral" as const } }]
        : systemMsg;

      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemParam,
        messages: userMessages,
      });

      const text = response.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("");

      let parsed: unknown;
      if (json) {
        try {
          // Extrait le premier bloc JSON valide du texte
          const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
        } catch {
          // garder text brut, parsed = undefined
        }
      }

      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;
      const price = priceFor(model);
      const costUsd = (inputTokens * price.in + outputTokens * price.out) / 1_000_000;

      return {
        text,
        parsed,
        provider: "ANTHROPIC",
        model,
        inputTokens,
        outputTokens,
        costUsd: Math.round(costUsd * 10000) / 10000,
        latencyMs: Date.now() - start,
        isMock: false,
      };
    } catch (err: unknown) {
      console.error("[ai/providers] Anthropic call failed:", err);
      // Fallback automatique vers mock pour ne pas casser l'app
      return mockResult({ provider, model, messages, json, latencyMs: Date.now() - start });
    }
  }

  // ─── OpenAI / Google : à brancher en Phase E (SDKs non installés) ───
  return mockResult({ provider, model, messages, json, latencyMs: Date.now() - start });
}

/* ────────────────────────────────────────────────────────────────────
 * Mock fallback — réaliste, structuré, type-safe
 * ──────────────────────────────────────────────────────────────────── */
function mockResult({
  provider, model, messages, json, latencyMs,
}: {
  provider: LLMProvider;
  model: string;
  messages: ChatMessage[];
  json?: boolean;
  latencyMs: number;
}): ChatResult {
  const lastUser = messages.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";
  const text = json
    ? `{"mock": true, "reason": "no API key set", "hint": "${lastUser.slice(0, 80)}"}`
    : `[mock ${provider}] ${lastUser.slice(0, 200)}…`;

  return {
    text,
    parsed: json ? { mock: true, reason: "no API key set" } : undefined,
    provider,
    model: model + " (mock)",
    inputTokens: Math.round(lastUser.length / 4),
    outputTokens: Math.round(text.length / 4),
    costUsd: 0,
    latencyMs,
    isMock: true,
  };
}

/* ────────────────────────────────────────────────────────────────────
 * Helpers spécialisés
 * ──────────────────────────────────────────────────────────────────── */

/** Génération d'image — Stability / OpenAI DALL-E (mock pour l'instant). */
export async function generateImage(prompt: string): Promise<{ url: string; isMock: boolean }> {
  void prompt;
  // TODO: brancher Stability / OpenAI Image API
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
