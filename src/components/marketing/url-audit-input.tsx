"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Link2 } from "lucide-react";

const PLATFORM_HINTS = [
  { label: "TikTok", host: "tiktok.com", color: "#FFFFFF" },
  { label: "YouTube", host: "youtube.com", color: "#FF0000" },
  { label: "Instagram", host: "instagram.com", color: "#E1306C" },
  { label: "Facebook", host: "facebook.com", color: "#1877F2" },
];

function detectPlatform(url: string) {
  const lower = url.toLowerCase();
  return PLATFORM_HINTS.find((p) => lower.includes(p.host));
}

export function UrlAuditInput() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const detected = detectPlatform(url);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    router.push(`/signup?url=${encodeURIComponent(trimmed)}`);
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mx-auto mt-6 w-full max-w-xl"
    >
      <div
        className={`no-lg-glass group relative flex items-center gap-1 rounded-full border bg-card/60 p-1.5 backdrop-blur-xl transition-all focus-within:border-[#EC4899]/60 focus-within:shadow-[0_0_0_4px_rgba(236,72,153,0.15)] ${
          detected ? "border-[#EC4899]/40" : "border-border"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/60">
          {detected ? (
            <span className="text-xs font-bold" style={{ color: detected.color }}>
              {detected.label[0]}
            </span>
          ) : (
            <Link2 className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Colle l'URL de ta vidéo TikTok, YouTube, IG…"
          inputMode="url"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground/70 md:text-base"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#EC4899] via-[#FF8A00] to-[#FF8A00] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#EC4899]/30 transition-transform hover:scale-[1.02] active:scale-100 disabled:opacity-60 md:px-5 md:text-sm"
        >
          {loading ? "..." : "Auditer"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        {detected ? (
          <>
            <span className="font-semibold text-foreground">{detected.label}</span> détecté · audit IA en 60s
          </>
        ) : (
          <>Sans inscription · résultat en 60s · 100% gratuit</>
        )}
      </p>
    </motion.form>
  );
}
