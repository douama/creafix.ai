"use client";

import { useState } from "react";
import { Copy, Check, Twitter, Facebook, MessageCircle, Music2 } from "lucide-react";

export function ShareButtons({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const targets = [
    {
      label: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      color: "#1DA1F2",
    },
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "#1877F2",
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      color: "#25D366",
    },
    {
      label: "TikTok",
      icon: Music2,
      href: `https://www.tiktok.com/`,
      color: "#FF0050",
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {targets.map((t) => {
        const Icon = t.icon;
        return (
          <a
            key={t.label}
            href={t.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 transition-all hover:scale-110"
            style={{ color: t.color }}
            aria-label={`Partager sur ${t.label}`}
            title={`Partager sur ${t.label}`}
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
      <button
        type="button"
        onClick={copyLink}
        className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
          copied
            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-500 dark:text-emerald-300"
            : "border-border bg-background/60 hover:bg-background"
        }`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copié !" : "Copier le lien"}
      </button>
    </div>
  );
}
