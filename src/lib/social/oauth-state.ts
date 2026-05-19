import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Helpers OAuth pour `/api/social/connect` et `/api/social/callback/{platform}`.
 *
 * Le `state` est un nonce aléatoire signé HMAC qui permet au callback :
 *   1. de vérifier que la requête vient bien de notre flow (anti-CSRF)
 *   2. de retrouver l'user_id sans cookie supplémentaire (le user_id est dans le payload signé)
 *
 * Format du state : "<nonce>.<userId>.<hmac>"
 *
 * Le secret HMAC est OAUTH_STATE_SECRET (fallback NEXTAUTH_SECRET).
 * NB : si le secret n'est pas défini, la signature reste valide mais
 * triviale à forger — à configurer en prod.
 */

function getSecret(): string {
  return process.env.OAUTH_STATE_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";
}

export function signState(nonce: string, userId: string): string {
  const payload = `${nonce}.${userId}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyState(state: string, expectedUserId: string): boolean {
  const parts = state.split(".");
  if (parts.length !== 3) return false;
  const [nonce, userId, sig] = parts;
  if (userId !== expectedUserId) return false;
  const expected = createHmac("sha256", getSecret()).update(`${nonce}.${userId}`).digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** PKCE S256 : code_verifier (random 32 bytes b64url) → SHA-256 → base64url. */
export function generatePkce() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function randomNonce(bytes = 16): string {
  return randomBytes(bytes).toString("hex");
}
