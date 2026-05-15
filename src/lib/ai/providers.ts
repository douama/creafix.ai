/**
 * Couche d'abstraction pour les fournisseurs IA.
 *
 * Branche ici Claude (Anthropic), GPT (OpenAI), Gemini (Google),
 * ElevenLabs (voix), Runway (vidéo), Stability (images).
 *
 * Le pattern : chaque fonction reçoit un prompt + contraintes,
 * et retourne du contenu typé. Le caller (agent) ne doit JAMAIS
 * dépendre d'un fournisseur spécifique.
 */

export type LLMProvider = "anthropic" | "openai" | "google";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat({
  provider = "anthropic",
  model,
  messages,
  json = false,
}: {
  provider?: LLMProvider;
  model: string;
  messages: ChatMessage[];
  json?: boolean;
}): Promise<string> {
  // TODO en production :
  // - Anthropic : new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY}).messages.create(...)
  // - OpenAI    : new OpenAI({apiKey: process.env.OPENAI_API_KEY}).chat.completions.create(...)
  // - Google    : new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY).getGenerativeModel(...)
  //
  // Toujours utiliser :
  // - prompt caching (Anthropic ephemeral cache_control sur le system prompt)
  // - structured outputs (json = true) pour parsing fiable
  // - retry exponential backoff

  void provider;
  void model;
  void messages;
  void json;

  throw new Error(
    "ai/providers.chat() pas encore branché. Configure ANTHROPIC_API_KEY, OPENAI_API_KEY ou GOOGLE_AI_API_KEY.",
  );
}

export async function generateImage(_prompt: string): Promise<string> {
  throw new Error("ai/providers.generateImage() pas encore branché (Stability / DALL-E / Imagen).");
}

export async function generateVoice(_text: string, _voice: string): Promise<ArrayBuffer> {
  throw new Error("ai/providers.generateVoice() pas encore branché (ElevenLabs).");
}

export async function generateVideo(_prompt: string): Promise<string> {
  throw new Error("ai/providers.generateVideo() pas encore branché (Runway).");
}
