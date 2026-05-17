"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type OAuthProvider = "google" | "facebook";

const PROVIDERS: { id: OAuthProvider; label: string; icon: React.ReactNode }[] = [
  {
    id: "google",
    label: "Google",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 11v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.8-4.1 2.8-7 0-.5 0-1-.1-1.4H12z" />
        <path fill="#4285F4" d="M12 22c2.7 0 5-1 6.3-2.3l-3.1-2.4c-.9.6-2 1-3.2 1-2.5 0-4.5-1.7-5.3-3.9H3.5v2.5A10 10 0 0 0 12 22z" />
        <path fill="#FBBC05" d="M6.7 14.4a6 6 0 0 1 0-4.8V7H3.5a10 10 0 0 0 0 10l3.2-2.5z" />
        <path fill="#34A853" d="M12 6c1.4 0 2.6.5 3.5 1.4l2.6-2.6A10 10 0 0 0 3.5 7l3.2 2.5c.8-2.2 2.8-3.5 5.3-3.5z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: (
      <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.6 9.9V15h-2.5v-3h2.5V9.7c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 3h-2.4v6.9A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
];

const FACEBOOK_SCOPES =
  "email,public_profile,pages_show_list,pages_read_engagement,read_insights";

export function OAuthButtons({
  mode = "login",
  layout = "row",
}: {
  mode?: "login" | "signup";
  layout?: "row" | "stack";
}) {
  const [loading, setLoading] = useState<OAuthProvider | null>(null);

  async function signIn(provider: OAuthProvider) {
    setLoading(provider);
    try {
      const supabase = createClient();
      const next = mode === "signup" ? "/onboarding" : "/dashboard";
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${next}`,
          ...(provider === "facebook" ? { scopes: FACEBOOK_SCOPES } : {}),
        },
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(e.message ?? `Connexion ${provider} impossible`);
      setLoading(null);
    }
  }

  const containerClass = layout === "row" ? "grid grid-cols-2 gap-2" : "space-y-2";

  return (
    <div className={containerClass}>
      {PROVIDERS.map((p) => {
        const isLoading = loading === p.id;
        return (
          <button
            key={p.id}
            type="button"
            disabled={!!loading}
            onClick={() => signIn(p.id)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card/60 text-sm font-semibold transition-all hover:border-foreground/20 hover:bg-card/80 disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : p.icon}
            {layout === "row" ? p.label : `Continuer avec ${p.label}`}
          </button>
        );
      })}
    </div>
  );
}
