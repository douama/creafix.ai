import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import {
  PlatformApisClient,
  type PlatformConfig,
  type CredentialMeta,
} from "./platform-apis-client";

export const metadata = {
  title: "Platform APIs · African Trend Scanner · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PLATFORM_KEY_DEFS: Record<
  string,
  { name: string; label: string; required: boolean; hint?: string }[]
> = {
  tiktok: [
    {
      name: "TIKTOK_CLIENT_KEY",
      label: "Client Key",
      required: true,
      hint: "TikTok for Developers → Research API app → Client Key",
    },
    {
      name: "TIKTOK_CLIENT_SECRET",
      label: "Client Secret",
      required: true,
    },
    {
      name: "TIKTOK_ACCESS_TOKEN",
      label: "Access Token",
      required: true,
      hint: "Scopes: research.data.basic · research.data.hashtag",
    },
  ],
  instagram: [
    {
      name: "INSTAGRAM_APP_ID",
      label: "App ID",
      required: true,
      hint: "Meta Developers → Instagram Graph API → App ID",
    },
    {
      name: "INSTAGRAM_APP_SECRET",
      label: "App Secret",
      required: true,
    },
    {
      name: "INSTAGRAM_ACCESS_TOKEN",
      label: "Long-lived Access Token",
      required: true,
      hint: "Validité 60 jours — prévoir auto-refresh. Scope: instagram_basic, pages_read_engagement",
    },
  ],
  youtube: [
    {
      name: "YOUTUBE_API_KEY",
      label: "API Key",
      required: true,
      hint: "Google Cloud Console → YouTube Data API v3 → Credentials → API Key",
    },
    {
      name: "YOUTUBE_OAUTH_CLIENT_ID",
      label: "OAuth Client ID",
      required: false,
      hint: "Optionnel — pour quota élevé avec authentification OAuth2",
    },
    {
      name: "YOUTUBE_OAUTH_CLIENT_SECRET",
      label: "OAuth Client Secret",
      required: false,
    },
  ],
  twitter: [
    {
      name: "TWITTER_BEARER_TOKEN",
      label: "Bearer Token",
      required: true,
      hint: "X Developer Portal → Project App → Keys & Tokens → Bearer Token",
    },
    {
      name: "TWITTER_API_KEY",
      label: "API Key (Consumer Key)",
      required: false,
    },
    {
      name: "TWITTER_API_SECRET",
      label: "API Secret (Consumer Secret)",
      required: false,
    },
  ],
  facebook: [
    {
      name: "FACEBOOK_APP_ID",
      label: "App ID",
      required: true,
      hint: "Meta Developers → Dashboard → App ID",
    },
    {
      name: "FACEBOOK_APP_SECRET",
      label: "App Secret",
      required: true,
    },
    {
      name: "FACEBOOK_ACCESS_TOKEN",
      label: "Page Access Token",
      required: true,
      hint: "Token permanent avec scope: pages_read_engagement, pages_read_user_content",
    },
  ],
};

const PLATFORM_META: Record<
  string,
  { label: string; color: string; apiVersion: string }
> = {
  tiktok:    { label: "TikTok Research API", color: "#010101", apiVersion: "v2" },
  instagram: { label: "Instagram Graph API", color: "#E1306C", apiVersion: "v18" },
  youtube:   { label: "YouTube Data v3",     color: "#FF0000", apiVersion: "v3" },
  twitter:   { label: "X API v2",            color: "#1D9BF0", apiVersion: "v2" },
  facebook:  { label: "Facebook Graph API",  color: "#1877F2", apiVersion: "v18" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function AdminPlatformApis() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login/admin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isSuperAdmin } = await (supabase.rpc as any)("is_super_admin", {
    p_user_id: user.id,
  });
  if (!isSuperAdmin) redirect("/admin?error=super_admin_required");

  const sb = supabaseAdmin();
  const [{ data: configsRaw }, { data: credsRaw }] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sb.rpc as any)("list_platform_api_configs"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sb.rpc as any)("list_platform_api_credentials"),
  ]);

  const configs = (configsRaw ?? []) as PlatformConfig[];
  const credentials = (credsRaw ?? []) as CredentialMeta[];

  const platforms = (
    ["tiktok", "instagram", "youtube", "twitter", "facebook"] as const
  ).map((id) => {
    const cfg = configs.find((c) => c.platform === id);
    const meta = PLATFORM_META[id];
    return {
      id,
      label: meta.label,
      color: meta.color,
      apiVersion: meta.apiVersion,
      enabled: cfg?.enabled ?? false,
      countries: cfg?.countries ?? ["CI", "NG", "MA", "CM", "ZA", "SN"],
      lastSyncAt: cfg?.last_sync_at ?? null,
      lastSyncStatus: cfg?.last_sync_status ?? null,
      lastSyncError: cfg?.last_sync_error ?? null,
      keyDefs: PLATFORM_KEY_DEFS[id],
      configuredKeys: credentials.filter((c) => c.platform === id),
    };
  });

  return <PlatformApisClient platforms={platforms} />;
}
