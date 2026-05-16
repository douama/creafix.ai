#!/usr/bin/env node
/**
 * Secrets scanner CreaFix AI — zero-dep, scanne stdin (mode hook) ou
 * tous les fichiers tracked par git (mode CLI).
 *
 * Usage :
 *   pnpm secrets:scan                 # scan complet du repo (sortie code 1 si match)
 *   git diff --cached | secrets-scan  # scan le diff staged (utilisé par pre-commit)
 *
 * Patterns détectés : Anthropic, OpenAI, Google AI, Supabase service_role,
 * Upstash, JWT, AWS, generic high-entropy "secret/token/key=..."
 */

import { execSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { extname } from "node:path";

const PATTERNS = [
  { name: "Anthropic API key",        re: /sk-ant-api\d{2}-[A-Za-z0-9_-]{20,}/g },
  { name: "OpenAI API key",           re: /sk-(?:proj-)?[A-Za-z0-9_-]{40,}/g },
  { name: "Google AI key",            re: /AIza[0-9A-Za-z_-]{35}/g },
  { name: "Supabase service_role",    re: /sb_secret_[A-Za-z0-9_-]{20,}/g },
  { name: "Supabase legacy JWT",      re: /eyJhbGciOiJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g },
  { name: "Upstash REST token",       re: /A[A-Z]{2,4}AAI[A-Za-z0-9_-]{40,}/g },
  { name: "AWS Access Key",           re: /AKIA[0-9A-Z]{16}/g },
  { name: "GitHub PAT",               re: /ghp_[A-Za-z0-9]{36,}/g },
  { name: "Stripe live secret",       re: /sk_live_[A-Za-z0-9]{24,}/g },
  { name: "Stripe live publishable",  re: /pk_live_[A-Za-z0-9]{24,}/g },
  { name: "Generic high-entropy",     re: /(?:secret|password|token|api[_-]?key)\s*[=:]\s*["']([A-Za-z0-9+/=_-]{32,})["']/gi },
];

// Fichiers/dirs à ignorer (même en mode CLI complet)
const IGNORE_EXT = new Set([".lock", ".lockb", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".woff", ".woff2", ".ico", ".pdf", ".mp4"]);
const IGNORE_PATH = [
  /^pnpm-lock\.yaml$/,
  /^package-lock\.json$/,
  /^\.next\//,
  /^node_modules\//,
  /\.env\.example$/,        // contient des placeholders, pas de vrais secrets
  /scripts\/secrets-scan\.mjs$/, // ce fichier lui-même contient les patterns
];

function shouldSkip(path) {
  if (IGNORE_PATH.some((re) => re.test(path))) return true;
  if (IGNORE_EXT.has(extname(path).toLowerCase())) return true;
  return false;
}

function scanContent(content, source) {
  const hits = [];
  for (const { name, re } of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(content)) !== null) {
      // Skip fake/placeholder values
      const raw = m[0];
      if (/x{8,}|YOUR-|CHANGE|EXAMPLE|placeholder/i.test(raw)) continue;
      const lineIdx = content.slice(0, m.index).split("\n").length;
      hits.push({ name, source, line: lineIdx, snippet: raw.slice(0, 20) + "…" });
    }
  }
  return hits;
}

function scanStdin() {
  return new Promise((resolve) => {
    let buf = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (buf += chunk));
    process.stdin.on("end", () => resolve(scanContent(buf, "stdin")));
  });
}

function scanRepo() {
  const files = execSync("git ls-files", { encoding: "utf8" }).trim().split("\n");
  const allHits = [];
  for (const f of files) {
    if (!f || shouldSkip(f)) continue;
    try {
      const st = statSync(f);
      if (st.size > 1_000_000) continue; // skip > 1MB
      const content = readFileSync(f, "utf8");
      const hits = scanContent(content, f);
      if (hits.length) allHits.push(...hits);
    } catch {
      // unreadable / binary
    }
  }
  return allHits;
}

// Mode : --stdin = lit stdin (utilisé par pre-commit hook avec `git diff | scan --stdin`).
// Sans flag = scan complet du repo via `git ls-files`.
const isStdin = process.argv.includes("--stdin");
const hits = isStdin ? await scanStdin() : scanRepo();

if (hits.length === 0) {
  console.log(`✓ secrets-scan : 0 leak détecté (${isStdin ? "stdin" : "repo complet"})`);
  process.exit(0);
}

console.error(`\n✗ secrets-scan : ${hits.length} leak(s) détecté(s)\n`);
for (const h of hits) {
  console.error(`  [${h.name}]`);
  console.error(`    → ${h.source}${h.line ? ":" + h.line : ""}`);
  console.error(`    → ${h.snippet}\n`);
}
console.error("Action : supprime ces valeurs du code et utilise process.env.XXX à la place.");
console.error("Si c'est un faux positif, exclus le fichier dans scripts/secrets-scan.mjs (IGNORE_PATH).\n");
process.exit(1);
