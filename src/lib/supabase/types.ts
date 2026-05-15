/**
 * Types Supabase pour CreaFix AI.
 *
 * Note : les tables vivent dans le schéma Postgres `monetiq` côté serveur,
 * mais on les expose sous la clé TypeScript `public` ici. Pourquoi ?
 * Le client Supabase JS cherche par défaut les types sous `public`. Le runtime
 * est redirigé vers `monetiq` via `db.schema = "monetiq"` dans le constructeur.
 * Découpler les deux évite des génériques compliqués.
 *
 * Régénération automatique recommandée après chaque migration :
 *   npx supabase gen types typescript \
 *     --project-id <ref> --schema monetiq > src/lib/supabase/types.ts
 * (puis renommer la clé du schéma en `public` ou ajuster le custom hook).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type UserRole = "CREATOR" | "INFLUENCER" | "AGENCY" | "ADMIN";
type Plan = "FREE" | "PRO" | "AGENCY";
type Platform = "FACEBOOK" | "TIKTOK" | "INSTAGRAM" | "YOUTUBE";
type AuditStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
type AuditMode = "QUICK" | "COMPLETE" | "AGENCY";
type ContentKind =
  | "IDEA" | "HOOK" | "SCRIPT" | "CAPTION"
  | "THUMBNAIL" | "IMAGE" | "VOICEOVER" | "REEL";
type PaymentProvider =
  | "STRIPE" | "PAYPAL" | "WAVE" | "ORANGE_MONEY"
  | "MTN_MOMO" | "MOOV_MONEY" | "FREE_MONEY" | "PAYDUNYA" | "CINETPAY";
type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          plan: Plan;
          credits: number;
          preferred_lang: string;
          country: string | null;
          preferred_niches: string[] | null;
          created_at: string;
          updated_at: string;
          last_seen_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          plan?: Plan;
          credits?: number;
          preferred_lang?: string;
          country?: string | null;
          preferred_niches?: string[] | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
        Relationships: [];
      };
      social_accounts: {
        Row: {
          id: string;
          user_id: string;
          platform: Platform;
          external_id: string;
          handle: string;
          display_name: string | null;
          avatar_url: string | null;
          country: string | null;
          niche: string | null;
          followers: number;
          is_connected: boolean;
          access_token: string | null;
          refresh_token: string | null;
          scope: string | null;
          token_expires: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          platform: Platform;
          external_id: string;
          handle: string;
          display_name?: string | null;
          avatar_url?: string | null;
          country?: string | null;
          niche?: string | null;
          followers?: number;
          is_connected?: boolean;
          access_token?: string | null;
          refresh_token?: string | null;
          scope?: string | null;
          token_expires?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["social_accounts"]["Insert"]>;
        Relationships: [];
      };
      audits: {
        Row: {
          id: string;
          user_id: string;
          social_account_id: string;
          status: AuditStatus;
          mode: AuditMode;
          score_global: number | null;
          score_monetization: number | null;
          score_viral: number | null;
          score_risk: number | null;
          score_engagement: number | null;
          dimensions: Json | null;
          issues: Json | null;
          recommendations: Json | null;
          estimates: Json | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          social_account_id: string;
          status?: AuditStatus;
          mode?: AuditMode;
          score_global?: number | null;
          score_monetization?: number | null;
          score_viral?: number | null;
          score_risk?: number | null;
          score_engagement?: number | null;
          dimensions?: Json | null;
          issues?: Json | null;
          recommendations?: Json | null;
          estimates?: Json | null;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["audits"]["Insert"]>;
        Relationships: [];
      };
      generated_contents: {
        Row: {
          id: string;
          user_id: string;
          kind: ContentKind;
          prompt: string | null;
          output: Json;
          niche: string | null;
          country: string | null;
          model: string | null;
          tokens: number | null;
          cost: number | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          kind: ContentKind;
          output: Json;
          prompt?: string | null;
          niche?: string | null;
          country?: string | null;
          model?: string | null;
          tokens?: number | null;
          cost?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["generated_contents"]["Insert"]>;
        Relationships: [];
      };
      country_cpm: {
        Row: {
          code: string;
          name: string;
          flag: string;
          currency: string;
          fx_to_usd: number;
          cpm_facebook: number;
          cpm_tiktok: number;
          rpm_facebook: number;
          rpm_tiktok: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          name: string;
          flag: string;
          currency: string;
          fx_to_usd: number;
          cpm_facebook: number;
          cpm_tiktok: number;
          rpm_facebook: number;
          rpm_tiktok: number;
        };
        Update: Partial<Database["public"]["Tables"]["country_cpm"]["Insert"]>;
        Relationships: [];
      };
      agency_clients:  { Row: any; Insert: any; Update: any; Relationships: [] };
      reports:         { Row: any; Insert: any; Update: any; Relationships: [] };
      payments:        { Row: any; Insert: any; Update: any; Relationships: [] };
      subscriptions:   { Row: any; Insert: any; Update: any; Relationships: [] };
      notifications:   { Row: any; Insert: any; Update: any; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      plan: Plan;
      platform: Platform;
      audit_status: AuditStatus;
      audit_mode: AuditMode;
      content_kind: ContentKind;
      payment_provider: PaymentProvider;
      payment_status: PaymentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
