-- ============================================================================
-- 0007_capture_prod_schema.sql
--
-- Capture du schéma déjà appliqué directement en prod via SQL Editor mais
-- jamais versionné dans le repo (drift documenté dans l'audit du 2026-05-19).
--
-- 18 tables, 14 enums supplémentaires (+ extension de user_role), 7 RPC,
-- 7 triggers, ~25 policies RLS, plus une vingtaine d'indexes.
--
-- IDEMPOTENT : utilise CREATE … IF NOT EXISTS, DO-blocks pour les enums, et
-- DROP POLICY/TRIGGER IF EXISTS avant CREATE pour pouvoir être rejoué sur
-- une DB existante (prod = no-op réelle, fresh CI = construction complète).
--
-- Source : pg_catalog du projet zotvcraialosabpumwrl (eu-west-3) au 2026-05-19.
-- ============================================================================

-- ──────────────────────────────────────────────────────────────────────────
-- 1) Enums : extension de user_role + 14 nouveaux types
-- ──────────────────────────────────────────────────────────────────────────

-- user_role était (CREATOR, INFLUENCER, AGENCY, ADMIN) dans 0001
ALTER TYPE monetiq.user_role ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
ALTER TYPE monetiq.user_role ADD VALUE IF NOT EXISTS 'MODERATOR';
ALTER TYPE monetiq.user_role ADD VALUE IF NOT EXISTS 'SUPPORT';
ALTER TYPE monetiq.user_role ADD VALUE IF NOT EXISTS 'ANALYST';

DO $$ BEGIN CREATE TYPE monetiq.user_status AS ENUM ('ACTIVE','SUSPENDED','BANNED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.agent_category AS ENUM (
  'MONETIZATION','VIRAL','SHADOWBAN','HOOK_REWRITER','TREND_SCANNER','THUMBNAIL','VIDEO_ANALYZER'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.ai_provider AS ENUM (
  'OPENAI','ANTHROPIC','GOOGLE','STABILITY','RUNWAY','ELEVENLABS','PIKA'
); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.api_key_scope AS ENUM ('SANDBOX','PRODUCTION');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.coupon_kind AS ENUM ('PERCENT','FIXED','FREE_PLAN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.moderation_kind AS ENUM ('CONTENT','COMMENT','ACCOUNT','AUDIO','THUMBNAIL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.moderation_severity AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.moderation_status AS ENUM ('PENDING','APPROVED','REJECTED','BANNED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.shadowban_severity AS ENUM ('NONE','LOW','MEDIUM','HIGH','CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.ticket_status AS ENUM ('OPEN','IN_PROGRESS','WAITING_USER','RESOLVED','CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.ticket_priority AS ENUM ('LOW','MEDIUM','HIGH','URGENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.ticket_category AS ENUM ('BILLING','TECHNICAL','ACCOUNT','FEATURE_REQUEST','OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.trend_kind AS ENUM ('SOUND','HASHTAG','NICHE','FORMAT','CHALLENGE','TIMING');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE monetiq.trend_status AS ENUM ('PENDING','APPROVED','REJECTED','ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ──────────────────────────────────────────────────────────────────────────
-- 2) Fonctions de rôle exposées dans `public` (consommées par RLS + RPC admin)
-- ──────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public','monetiq'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM monetiq.user_profiles
    WHERE id = p_user_id AND role = 'SUPER_ADMIN'
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public','monetiq'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM monetiq.user_profiles
    WHERE id = p_user_id AND role::text = p_role
  );
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO anon, authenticated;

-- Wrappers dans monetiq (référencés par les migrations 0004)
CREATE OR REPLACE FUNCTION monetiq.is_super_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public','monetiq'
AS $$ SELECT public.is_super_admin(p_user_id); $$;

CREATE OR REPLACE FUNCTION monetiq.has_role(p_user_id uuid, p_role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public','monetiq'
AS $$ SELECT public.has_role(p_user_id, p_role); $$;

-- ──────────────────────────────────────────────────────────────────────────
-- 3) Tables (ordre = topologie des FK)
-- ──────────────────────────────────────────────────────────────────────────

-- ── ai_agents : registre des agents IA configurables ──
CREATE TABLE IF NOT EXISTS monetiq.ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category monetiq.agent_category NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT true,
  primary_provider monetiq.ai_provider NOT NULL,
  primary_model text NOT NULL,
  fallback_providers jsonb DEFAULT '[]'::jsonb,
  system_prompt text,
  temperature numeric(3,2) DEFAULT 0.7,
  max_tokens integer DEFAULT 4096,
  runs_total integer NOT NULL DEFAULT 0,
  runs_success integer NOT NULL DEFAULT 0,
  runs_failed integer NOT NULL DEFAULT 0,
  avg_cost_usd numeric(10,4) DEFAULT 0,
  avg_latency_ms integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── ai_model_configs : clés API + budgets par provider ──
CREATE TABLE IF NOT EXISTS monetiq.ai_model_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider monetiq.ai_provider NOT NULL UNIQUE,
  api_key_mask text,
  api_key_set boolean NOT NULL DEFAULT false,
  enabled boolean NOT NULL DEFAULT false,
  default_model text,
  monthly_cost_usd numeric(10,4) DEFAULT 0,
  monthly_tokens bigint DEFAULT 0,
  rate_limit_rpm integer DEFAULT 60,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── plans_config : catalogue des plans (FREE/PRO/AGENCY/ENTERPRISE) ──
CREATE TABLE IF NOT EXISTS monetiq.plans_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug monetiq.plan NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  price_monthly_usd numeric(10,2) NOT NULL DEFAULT 0,
  price_yearly_usd numeric(10,2),
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  credits_included integer NOT NULL DEFAULT 0,
  max_audits_monthly integer,
  max_social_accounts integer,
  highlight boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_by uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── testimonials : avis affichés sur landing ──
CREATE TABLE IF NOT EXISTS monetiq.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  country text NOT NULL,
  avatar_url text,
  quote text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  platforms text[] NOT NULL DEFAULT '{}'::text[],
  metric text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── audit_logs : trace des actions admin ──
CREATE TABLE IF NOT EXISTS monetiq.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  meta jsonb DEFAULT '{}'::jsonb,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── coupons : codes promo ──
CREATE TABLE IF NOT EXISTS monetiq.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  kind monetiq.coupon_kind NOT NULL DEFAULT 'PERCENT',
  value numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  applies_to_plan monetiq.plan,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── trends : tendances réseaux sociaux (African Trend Engine) ──
CREATE TABLE IF NOT EXISTS monetiq.trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  platform monetiq.platform NOT NULL,
  kind monetiq.trend_kind NOT NULL,
  title text NOT NULL,
  meta jsonb DEFAULT '{}'::jsonb,
  momentum integer NOT NULL DEFAULT 50,
  uses_count integer DEFAULT 0,
  status monetiq.trend_status NOT NULL DEFAULT 'PENDING',
  source text,
  created_by uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  approved_by uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── moderation_queue : file de modération auto/manuel ──
CREATE TABLE IF NOT EXISTS monetiq.moderation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  social_account_id uuid REFERENCES monetiq.social_accounts(id) ON DELETE SET NULL,
  kind monetiq.moderation_kind NOT NULL,
  severity monetiq.moderation_severity NOT NULL DEFAULT 'MEDIUM',
  status monetiq.moderation_status NOT NULL DEFAULT 'PENDING',
  excerpt text,
  reason text NOT NULL,
  ai_confidence integer,
  flagged_by text NOT NULL,
  meta jsonb DEFAULT '{}'::jsonb,
  resolved_by uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── api_keys : clés API exposées aux clients ──
CREATE TABLE IF NOT EXISTS monetiq.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  scope monetiq.api_key_scope NOT NULL DEFAULT 'SANDBOX',
  key_hash text NOT NULL,
  key_mask text NOT NULL,
  last_used_at timestamptz,
  monthly_calls bigint NOT NULL DEFAULT 0,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── api_usage : log des appels API ──
CREATE TABLE IF NOT EXISTS monetiq.api_usage (
  id bigserial PRIMARY KEY,
  api_key_id uuid REFERENCES monetiq.api_keys(id) ON DELETE CASCADE,
  user_id uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  duration_ms integer,
  ip text,
  user_agent text,
  cost_usd numeric(10,6) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── revenue_reports : agrégats mensuels par user/plateforme ──
CREATE TABLE IF NOT EXISTS monetiq.revenue_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  period_month date NOT NULL,
  platform monetiq.platform,
  country text,
  revenue_usd numeric(12,2) NOT NULL DEFAULT 0,
  rpm_avg numeric(10,4),
  views_total bigint,
  audits_done integer DEFAULT 0,
  recovered_usd numeric(12,2) DEFAULT 0,
  potential_usd numeric(12,2) DEFAULT 0,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, period_month, platform)
);

-- ── shadowban_reports : rapports anti-ban d'un audit ──
CREATE TABLE IF NOT EXISTS monetiq.shadowban_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  social_account_id uuid NOT NULL REFERENCES monetiq.social_accounts(id) ON DELETE CASCADE,
  audit_id uuid REFERENCES monetiq.audits(id) ON DELETE SET NULL,
  severity monetiq.shadowban_severity NOT NULL DEFAULT 'NONE',
  reach_health_pct integer,
  reach_drop_pct integer,
  signals_detected jsonb DEFAULT '[]'::jsonb,
  estimated_loss_usd numeric(10,2),
  recovery_plan jsonb DEFAULT '[]'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── viral_scores : scores viraux prédictifs ──
CREATE TABLE IF NOT EXISTS monetiq.viral_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  audit_id uuid REFERENCES monetiq.audits(id) ON DELETE CASCADE,
  social_account_id uuid REFERENCES monetiq.social_accounts(id) ON DELETE CASCADE,
  content_ref text,
  score integer NOT NULL,
  hook_quality integer,
  watch_time_pct integer,
  predicted_views integer,
  actual_views integer,
  accuracy_pct integer,
  agent_id uuid REFERENCES monetiq.ai_agents(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── user_devices : devices vus par user (sécurité) ──
CREATE TABLE IF NOT EXISTS monetiq.user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  device_type text,
  os text,
  browser text,
  ip text,
  country text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  first_seen_at timestamptz NOT NULL DEFAULT now()
);

-- ── support_tickets ──
CREATE TABLE IF NOT EXISTS monetiq.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  body text NOT NULL,
  status monetiq.ticket_status NOT NULL DEFAULT 'OPEN',
  priority monetiq.ticket_priority NOT NULL DEFAULT 'MEDIUM',
  category monetiq.ticket_category NOT NULL DEFAULT 'OTHER',
  assigned_to uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  channel text NOT NULL DEFAULT 'in_app',
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── support_messages : thread de messages par ticket ──
CREATE TABLE IF NOT EXISTS monetiq.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES monetiq.support_tickets(id) ON DELETE CASCADE,
  author_id uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  is_admin boolean NOT NULL DEFAULT false,
  body text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── affiliate_referrals : programme d'affiliation ──
CREATE TABLE IF NOT EXISTS monetiq.affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES monetiq.user_profiles(id) ON DELETE SET NULL,
  code text NOT NULL,
  commission_pct numeric(5,2) NOT NULL DEFAULT 20.00,
  earned_usd numeric(12,4) NOT NULL DEFAULT 0,
  paid_usd numeric(12,4) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

-- ── payment_provider_secrets : table de liaison clés payment ↔ Vault ──
-- La valeur réelle est dans vault.secrets (chiffrée). Cette table garde
-- juste le mapping (provider, key_name) → secret_id + last4 affichable.
CREATE TABLE IF NOT EXISTS monetiq.payment_provider_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('STRIPE','PAYPAL','CINETPAY','FLUTTERWAVE','PAYDUNYA')),
  key_name text NOT NULL,
  secret_id uuid NOT NULL,
  last4 text NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, key_name)
);

-- ──────────────────────────────────────────────────────────────────────────
-- 4) Indexes
-- ──────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS affil_referrals_affiliate_idx ON monetiq.affiliate_referrals (affiliate_id);
CREATE INDEX IF NOT EXISTS affil_referrals_code_idx ON monetiq.affiliate_referrals (code);
CREATE INDEX IF NOT EXISTS api_keys_hash_idx ON monetiq.api_keys (key_hash);
CREATE INDEX IF NOT EXISTS api_keys_user_idx ON monetiq.api_keys (user_id);
CREATE INDEX IF NOT EXISTS api_usage_created_idx ON monetiq.api_usage (created_at DESC);
CREATE INDEX IF NOT EXISTS api_usage_key_idx ON monetiq.api_usage (api_key_id, created_at DESC);
CREATE INDEX IF NOT EXISTS api_usage_user_idx ON monetiq.api_usage (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON monetiq.audit_logs (action);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON monetiq.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON monetiq.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS coupons_code_active_idx ON monetiq.coupons (code, active);
CREATE INDEX IF NOT EXISTS moderation_queue_severity_idx ON monetiq.moderation_queue (severity);
CREATE INDEX IF NOT EXISTS moderation_queue_status_idx ON monetiq.moderation_queue (status);
CREATE INDEX IF NOT EXISTS revenue_reports_user_month_idx ON monetiq.revenue_reports (user_id, period_month DESC);
CREATE INDEX IF NOT EXISTS shadowban_severity_idx ON monetiq.shadowban_reports (severity);
CREATE INDEX IF NOT EXISTS shadowban_user_idx ON monetiq.shadowban_reports (user_id);
CREATE INDEX IF NOT EXISTS support_messages_ticket_idx ON monetiq.support_messages (ticket_id);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON monetiq.support_tickets (status);
CREATE INDEX IF NOT EXISTS support_tickets_user_idx ON monetiq.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS testimonials_active_sort_idx ON monetiq.testimonials (active, sort_order);
CREATE INDEX IF NOT EXISTS trends_country_kind_idx ON monetiq.trends (country, kind);
CREATE INDEX IF NOT EXISTS trends_status_idx ON monetiq.trends (status);
CREATE INDEX IF NOT EXISTS user_devices_user_idx ON monetiq.user_devices (user_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS viral_scores_audit_idx ON monetiq.viral_scores (audit_id);
CREATE INDEX IF NOT EXISTS viral_scores_user_idx ON monetiq.viral_scores (user_id);

-- ──────────────────────────────────────────────────────────────────────────
-- 5) RLS : enable + policies (DROP-then-CREATE pour idempotence)
-- ──────────────────────────────────────────────────────────────────────────

ALTER TABLE monetiq.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.ai_model_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.plans_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.revenue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.shadowban_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.viral_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.payment_provider_secrets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin only ai_agents" ON monetiq.ai_agents;
CREATE POLICY "admin only ai_agents" ON monetiq.ai_agents FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin only ai_model_configs" ON monetiq.ai_model_configs;
CREATE POLICY "admin only ai_model_configs" ON monetiq.ai_model_configs FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "plans_config public read active" ON monetiq.plans_config;
CREATE POLICY "plans_config public read active" ON monetiq.plans_config FOR SELECT
  USING ((active = true) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "plans_config admin write" ON monetiq.plans_config;
CREATE POLICY "plans_config admin write" ON monetiq.plans_config FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "testimonials_public_read" ON monetiq.testimonials;
CREATE POLICY "testimonials_public_read" ON monetiq.testimonials FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "testimonials_admin_all" ON monetiq.testimonials;
CREATE POLICY "testimonials_admin_all" ON monetiq.testimonials FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin only audit_logs" ON monetiq.audit_logs;
CREATE POLICY "admin only audit_logs" ON monetiq.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin only coupons" ON monetiq.coupons;
CREATE POLICY "admin only coupons" ON monetiq.coupons FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "trends read approved" ON monetiq.trends;
CREATE POLICY "trends read approved" ON monetiq.trends FOR SELECT
  USING ((status = 'APPROVED'::monetiq.trend_status) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "trends admin all" ON monetiq.trends;
CREATE POLICY "trends admin all" ON monetiq.trends FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin only moderation" ON monetiq.moderation_queue;
CREATE POLICY "admin only moderation" ON monetiq.moderation_queue FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "own api_keys" ON monetiq.api_keys;
CREATE POLICY "own api_keys" ON monetiq.api_keys FOR ALL
  USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()))
  WITH CHECK ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "own api_usage" ON monetiq.api_usage;
CREATE POLICY "own api_usage" ON monetiq.api_usage FOR SELECT
  USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "own revenue_reports" ON monetiq.revenue_reports;
CREATE POLICY "own revenue_reports" ON monetiq.revenue_reports FOR SELECT
  USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "own shadowban_reports" ON monetiq.shadowban_reports;
CREATE POLICY "own shadowban_reports" ON monetiq.shadowban_reports FOR SELECT
  USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "own viral_scores" ON monetiq.viral_scores;
CREATE POLICY "own viral_scores" ON monetiq.viral_scores FOR SELECT
  USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "own user_devices" ON monetiq.user_devices;
CREATE POLICY "own user_devices" ON monetiq.user_devices FOR SELECT
  USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "own tickets" ON monetiq.support_tickets;
CREATE POLICY "own tickets" ON monetiq.support_tickets FOR SELECT
  USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "create own ticket" ON monetiq.support_tickets;
CREATE POLICY "create own ticket" ON monetiq.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin update tickets" ON monetiq.support_tickets;
CREATE POLICY "admin update tickets" ON monetiq.support_tickets FOR UPDATE
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "ticket messages access" ON monetiq.support_messages;
CREATE POLICY "ticket messages access" ON monetiq.support_messages FOR SELECT
  USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM monetiq.support_tickets t
      WHERE t.id = support_messages.ticket_id AND t.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "ticket messages create" ON monetiq.support_messages;
CREATE POLICY "ticket messages create" ON monetiq.support_messages FOR INSERT
  WITH CHECK (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM monetiq.support_tickets t
      WHERE t.id = support_messages.ticket_id AND t.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "own affiliate referrals" ON monetiq.affiliate_referrals;
CREATE POLICY "own affiliate referrals" ON monetiq.affiliate_referrals FOR SELECT
  USING ((auth.uid() = affiliate_id) OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin manage affiliate" ON monetiq.affiliate_referrals;
CREATE POLICY "admin manage affiliate" ON monetiq.affiliate_referrals FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "pps_no_direct_access" ON monetiq.payment_provider_secrets;
CREATE POLICY "pps_no_direct_access" ON monetiq.payment_provider_secrets FOR ALL
  USING (false);

-- ──────────────────────────────────────────────────────────────────────────
-- 6) Triggers updated_at
-- ──────────────────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS touch_ai_agents ON monetiq.ai_agents;
CREATE TRIGGER touch_ai_agents BEFORE UPDATE ON monetiq.ai_agents
  FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();

DROP TRIGGER IF EXISTS touch_ai_model_configs ON monetiq.ai_model_configs;
CREATE TRIGGER touch_ai_model_configs BEFORE UPDATE ON monetiq.ai_model_configs
  FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();

DROP TRIGGER IF EXISTS touch_plans_config ON monetiq.plans_config;
CREATE TRIGGER touch_plans_config BEFORE UPDATE ON monetiq.plans_config
  FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();

DROP TRIGGER IF EXISTS touch_trends ON monetiq.trends;
CREATE TRIGGER touch_trends BEFORE UPDATE ON monetiq.trends
  FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();

DROP TRIGGER IF EXISTS touch_moderation_queue ON monetiq.moderation_queue;
CREATE TRIGGER touch_moderation_queue BEFORE UPDATE ON monetiq.moderation_queue
  FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();

DROP TRIGGER IF EXISTS touch_support_tickets ON monetiq.support_tickets;
CREATE TRIGGER touch_support_tickets BEFORE UPDATE ON monetiq.support_tickets
  FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();

-- Trigger spécifique testimonials (utilise une fn dédiée, pas touch_updated_at)
CREATE OR REPLACE FUNCTION monetiq.testimonials_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS testimonials_updated_at_trg ON monetiq.testimonials;
CREATE TRIGGER testimonials_updated_at_trg BEFORE UPDATE ON monetiq.testimonials
  FOR EACH ROW EXECUTE FUNCTION monetiq.testimonials_set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- 7) RPC Vault — secrets paiement
-- ──────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION monetiq.get_provider_secret(p_provider text, p_key_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','monetiq','vault'
AS $$
DECLARE
  v_secret_id uuid;
  v_decrypted text;
BEGIN
  -- Seul service_role peut récupérer la VALEUR (checkouts / webhooks).
  IF current_setting('role') <> 'service_role' THEN
    RAISE EXCEPTION 'Accès service_role requis pour décrypter';
  END IF;

  SELECT secret_id INTO v_secret_id FROM monetiq.payment_provider_secrets
    WHERE provider = p_provider AND key_name = p_key_name;
  IF v_secret_id IS NULL THEN RETURN NULL; END IF;

  SELECT decrypted_secret INTO v_decrypted FROM vault.decrypted_secrets WHERE id = v_secret_id;
  RETURN v_decrypted;
END;
$$;

CREATE OR REPLACE FUNCTION monetiq.set_provider_secret(p_provider text, p_key_name text, p_value text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','monetiq','vault'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_secret_id uuid;
  v_existing record;
  v_is_paydunya_mode boolean := (p_key_name = 'PAYDUNYA_MODE');
  v_is_paypal_env    boolean := (p_key_name = 'PAYPAL_ENV');
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM monetiq.user_profiles WHERE id = v_user_id AND role = 'SUPER_ADMIN'
  ) THEN
    RAISE EXCEPTION 'Accès SUPER_ADMIN requis pour modifier les clés de paiement';
  END IF;

  IF p_provider NOT IN ('STRIPE','PAYPAL','CINETPAY','FLUTTERWAVE','PAYDUNYA') THEN
    RAISE EXCEPTION 'Provider invalide : %', p_provider;
  END IF;

  IF v_is_paydunya_mode THEN
    IF p_value NOT IN ('live','test') THEN
      RAISE EXCEPTION 'PAYDUNYA_MODE doit être ''live'' ou ''test''';
    END IF;
  ELSIF v_is_paypal_env THEN
    IF p_value NOT IN ('live','sandbox') THEN
      RAISE EXCEPTION 'PAYPAL_ENV doit être ''live'' ou ''sandbox''';
    END IF;
  ELSIF length(p_value) < 8 THEN
    RAISE EXCEPTION 'Clé trop courte (min 8 caractères)';
  END IF;

  SELECT * INTO v_existing FROM monetiq.payment_provider_secrets
    WHERE provider = p_provider AND key_name = p_key_name;

  IF FOUND THEN
    PERFORM vault.update_secret(v_existing.secret_id, p_value);
    v_secret_id := v_existing.secret_id;
    UPDATE monetiq.payment_provider_secrets
      SET last4 = right(p_value, 4),
          updated_by = v_user_id,
          updated_at = now()
      WHERE id = v_existing.id;
  ELSE
    v_secret_id := vault.create_secret(
      p_value,
      format('cfx_%s_%s', lower(p_provider), lower(p_key_name)),
      format('CreaFix AI payment key : %s / %s', p_provider, p_key_name)
    );
    INSERT INTO monetiq.payment_provider_secrets (provider, key_name, secret_id, last4, updated_by)
      VALUES (p_provider, p_key_name, v_secret_id, right(p_value, 4), v_user_id);
  END IF;

  INSERT INTO monetiq.audit_logs (actor_id, action, target_type, target_id, meta)
    VALUES (v_user_id, 'payment_secret.set', 'payment_provider_secret', v_secret_id::text,
            jsonb_build_object('provider', p_provider, 'key_name', p_key_name, 'last4', right(p_value, 4)));

  RETURN v_secret_id;
END;
$$;

CREATE OR REPLACE FUNCTION monetiq.delete_provider_secret(p_provider text, p_key_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','monetiq','vault'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_existing record;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM monetiq.user_profiles WHERE id = v_user_id AND role = 'SUPER_ADMIN'
  ) THEN
    RAISE EXCEPTION 'Accès SUPER_ADMIN requis';
  END IF;

  SELECT * INTO v_existing FROM monetiq.payment_provider_secrets
    WHERE provider = p_provider AND key_name = p_key_name;
  IF NOT FOUND THEN RETURN false; END IF;

  DELETE FROM vault.secrets WHERE id = v_existing.secret_id;
  DELETE FROM monetiq.payment_provider_secrets WHERE id = v_existing.id;

  INSERT INTO monetiq.audit_logs (actor_id, action, target_type, target_id, meta)
    VALUES (v_user_id, 'payment_secret.delete', 'payment_provider_secret', v_existing.secret_id::text,
            jsonb_build_object('provider', p_provider, 'key_name', p_key_name));
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION monetiq.list_provider_secrets()
RETURNS TABLE(provider text, key_name text, last4 text, updated_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','monetiq'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM monetiq.user_profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  ) THEN
    RAISE EXCEPTION 'Accès SUPER_ADMIN requis';
  END IF;

  RETURN QUERY
    SELECT s.provider, s.key_name, s.last4, s.updated_at
    FROM monetiq.payment_provider_secrets s
    ORDER BY s.provider, s.key_name;
END;
$$;

-- ──────────────────────────────────────────────────────────────────────────
-- Fin — schéma capturé en intégralité.
-- ──────────────────────────────────────────────────────────────────────────
