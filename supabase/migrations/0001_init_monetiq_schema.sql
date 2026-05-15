-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Monetiq AI — Migration initiale                              ║
-- ║                                                                ║
-- ║  À appliquer dans le projet Supabase "Monetiq AI" :          ║
-- ║    Dashboard → SQL Editor → New query → coller → Run         ║
-- ║                                                                ║
-- ║  Le schéma est isolé dans `monetiq` (pas dans `public`).     ║
-- ║  RLS activé partout, policies basées sur auth.uid().         ║
-- ╚══════════════════════════════════════════════════════════════╝

CREATE SCHEMA IF NOT EXISTS monetiq;
COMMENT ON SCHEMA monetiq IS 'SaaS Monetiq AI — Audit IA de monétisation Facebook/TikTok pour créateurs africains';

-- ──────────────────────────────────────────────
-- Types énumérés
-- ──────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE monetiq.user_role        AS ENUM ('CREATOR','INFLUENCER','AGENCY','ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monetiq.plan             AS ENUM ('FREE','PRO','AGENCY');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monetiq.platform         AS ENUM ('FACEBOOK','TIKTOK','INSTAGRAM','YOUTUBE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monetiq.audit_status     AS ENUM ('PENDING','RUNNING','COMPLETED','FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monetiq.audit_mode       AS ENUM ('QUICK','COMPLETE','AGENCY');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monetiq.content_kind     AS ENUM ('IDEA','HOOK','SCRIPT','CAPTION','THUMBNAIL','IMAGE','VOICEOVER','REEL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monetiq.payment_provider AS ENUM ('STRIPE','PAYPAL','WAVE','ORANGE_MONEY','MTN_MOMO','MOOV_MONEY','FREE_MONEY','PAYDUNYA','CINETPAY');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monetiq.payment_status   AS ENUM ('PENDING','SUCCEEDED','FAILED','REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ──────────────────────────────────────────────
-- TABLES
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS monetiq.user_profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL,
  full_name       text,
  phone           text,
  avatar_url      text,
  role            monetiq.user_role NOT NULL DEFAULT 'CREATOR',
  plan            monetiq.plan      NOT NULL DEFAULT 'FREE',
  credits         integer           NOT NULL DEFAULT 50,
  preferred_lang  text              NOT NULL DEFAULT 'fr',
  country         text,
  preferred_niches text[],
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  last_seen_at    timestamptz
);
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON monetiq.user_profiles (email);

CREATE TABLE IF NOT EXISTS monetiq.social_accounts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  platform        monetiq.platform NOT NULL,
  external_id     text NOT NULL,
  handle          text NOT NULL,
  display_name    text,
  avatar_url      text,
  country         text,
  niche           text,
  followers       integer NOT NULL DEFAULT 0,
  is_connected    boolean NOT NULL DEFAULT true,
  access_token    text,
  refresh_token   text,
  scope           text,
  token_expires   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform, external_id)
);
CREATE INDEX IF NOT EXISTS social_accounts_user_idx ON monetiq.social_accounts (user_id);

CREATE TABLE IF NOT EXISTS monetiq.audits (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  social_account_id   uuid NOT NULL REFERENCES monetiq.social_accounts(id) ON DELETE CASCADE,
  status              monetiq.audit_status NOT NULL DEFAULT 'PENDING',
  mode                monetiq.audit_mode   NOT NULL DEFAULT 'COMPLETE',
  score_global        integer,
  score_monetization  integer,
  score_viral         integer,
  score_risk          integer,
  score_engagement    integer,
  dimensions          jsonb,
  issues              jsonb,
  recommendations     jsonb,
  estimates           jsonb,
  started_at          timestamptz NOT NULL DEFAULT now(),
  completed_at        timestamptz
);
CREATE INDEX IF NOT EXISTS audits_user_idx   ON monetiq.audits (user_id);
CREATE INDEX IF NOT EXISTS audits_status_idx ON monetiq.audits (status);

CREATE TABLE IF NOT EXISTS monetiq.generated_contents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  kind        monetiq.content_kind NOT NULL,
  prompt      text,
  output      jsonb NOT NULL,
  niche       text,
  country     text,
  model       text,
  tokens      integer,
  cost        numeric(10,4),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gen_contents_user_kind_idx ON monetiq.generated_contents (user_id, kind);

CREATE TABLE IF NOT EXISTS monetiq.agency_clients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_user_id  uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  name            text NOT NULL,
  email           text,
  country         text,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS agency_clients_agency_idx ON monetiq.agency_clients (agency_user_id);

CREATE TABLE IF NOT EXISTS monetiq.reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  audit_id    uuid REFERENCES monetiq.audits(id) ON DELETE SET NULL,
  title       text NOT NULL,
  url         text,
  pages       integer NOT NULL DEFAULT 1,
  type        text NOT NULL,
  branded     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reports_user_idx ON monetiq.reports (user_id);

CREATE TABLE IF NOT EXISTS monetiq.payments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  provider    monetiq.payment_provider NOT NULL,
  external_id text,
  amount      numeric(12,2) NOT NULL,
  currency    text NOT NULL DEFAULT 'XOF',
  status      monetiq.payment_status NOT NULL DEFAULT 'PENDING',
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  paid_at     timestamptz
);
CREATE INDEX IF NOT EXISTS payments_user_idx ON monetiq.payments (user_id);

CREATE TABLE IF NOT EXISTS monetiq.subscriptions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid UNIQUE NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  plan                  monetiq.plan NOT NULL,
  provider              monetiq.payment_provider NOT NULL,
  external_id           text,
  status                text NOT NULL DEFAULT 'active',
  current_period_end    timestamptz NOT NULL,
  cancel_at_period_end  boolean NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monetiq.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES monetiq.user_profiles(id) ON DELETE CASCADE,
  type        text NOT NULL,
  title       text NOT NULL,
  body        text,
  read        boolean NOT NULL DEFAULT false,
  meta        jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON monetiq.notifications (user_id, read);

CREATE TABLE IF NOT EXISTS monetiq.country_cpm (
  code          text PRIMARY KEY,
  name          text NOT NULL,
  flag          text NOT NULL,
  currency      text NOT NULL,
  fx_to_usd     numeric(10,4) NOT NULL,
  cpm_facebook  numeric(10,4) NOT NULL,
  cpm_tiktok    numeric(10,4) NOT NULL,
  rpm_facebook  numeric(10,4) NOT NULL,
  rpm_tiktok    numeric(10,4) NOT NULL,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TRIGGERS
-- ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION monetiq.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = monetiq, public
AS $$
BEGIN
  INSERT INTO monetiq.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_monetiq ON auth.users;
CREATE TRIGGER on_auth_user_created_monetiq
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION monetiq.handle_new_user();

CREATE OR REPLACE FUNCTION monetiq.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS touch_user_profiles    ON monetiq.user_profiles;
CREATE TRIGGER touch_user_profiles    BEFORE UPDATE ON monetiq.user_profiles    FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();
DROP TRIGGER IF EXISTS touch_social_accounts  ON monetiq.social_accounts;
CREATE TRIGGER touch_social_accounts  BEFORE UPDATE ON monetiq.social_accounts  FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();
DROP TRIGGER IF EXISTS touch_subscriptions    ON monetiq.subscriptions;
CREATE TRIGGER touch_subscriptions    BEFORE UPDATE ON monetiq.subscriptions    FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();
DROP TRIGGER IF EXISTS touch_country_cpm      ON monetiq.country_cpm;
CREATE TRIGGER touch_country_cpm      BEFORE UPDATE ON monetiq.country_cpm      FOR EACH ROW EXECUTE FUNCTION monetiq.touch_updated_at();

-- ──────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────

ALTER TABLE monetiq.user_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.social_accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.audits              ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.generated_contents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.agency_clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.payments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.subscriptions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.notifications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetiq.country_cpm         ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own profile select" ON monetiq.user_profiles;
CREATE POLICY "own profile select" ON monetiq.user_profiles
  FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "own profile update" ON monetiq.user_profiles;
CREATE POLICY "own profile update" ON monetiq.user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "own social_accounts" ON monetiq.social_accounts;
CREATE POLICY "own social_accounts" ON monetiq.social_accounts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own audits" ON monetiq.audits;
CREATE POLICY "own audits" ON monetiq.audits
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own contents" ON monetiq.generated_contents;
CREATE POLICY "own contents" ON monetiq.generated_contents
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own agency clients" ON monetiq.agency_clients;
CREATE POLICY "own agency clients" ON monetiq.agency_clients
  FOR ALL USING (auth.uid() = agency_user_id) WITH CHECK (auth.uid() = agency_user_id);

DROP POLICY IF EXISTS "own reports" ON monetiq.reports;
CREATE POLICY "own reports" ON monetiq.reports
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own payments read" ON monetiq.payments;
CREATE POLICY "own payments read" ON monetiq.payments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own subscription read" ON monetiq.subscriptions;
CREATE POLICY "own subscription read" ON monetiq.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "own notifications" ON monetiq.notifications;
CREATE POLICY "own notifications" ON monetiq.notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "country_cpm public read" ON monetiq.country_cpm;
CREATE POLICY "country_cpm public read" ON monetiq.country_cpm
  FOR SELECT USING (true);

-- ──────────────────────────────────────────────
-- GRANTS (exposer le schéma à PostgREST)
-- ──────────────────────────────────────────────

GRANT USAGE ON SCHEMA monetiq TO anon, authenticated, service_role;
GRANT SELECT ON monetiq.country_cpm TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA monetiq TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA monetiq TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA monetiq TO authenticated, service_role;

-- ──────────────────────────────────────────────
-- SEED — CPM Afrique (9 pays)
-- ──────────────────────────────────────────────

INSERT INTO monetiq.country_cpm (code, name, flag, currency, fx_to_usd, cpm_facebook, cpm_tiktok, rpm_facebook, rpm_tiktok) VALUES
  ('SN', 'Sénégal',         '🇸🇳', 'XOF', 600,  1.40, 0.80, 0.90, 0.45),
  ('CI', 'Côte d''Ivoire',  '🇨🇮', 'XOF', 600,  1.60, 0.90, 1.00, 0.50),
  ('CM', 'Cameroun',        '🇨🇲', 'XAF', 600,  1.20, 0.70, 0.80, 0.40),
  ('ML', 'Mali',            '🇲🇱', 'XOF', 600,  1.00, 0.60, 0.70, 0.35),
  ('NG', 'Nigeria',         '🇳🇬', 'NGN', 1550, 1.30, 1.00, 0.85, 0.55),
  ('GH', 'Ghana',           '🇬🇭', 'GHS', 15,   1.50, 0.95, 0.95, 0.50),
  ('ZA', 'Afrique du Sud',  '🇿🇦', 'ZAR', 18,   3.20, 1.80, 2.10, 1.10),
  ('MA', 'Maroc',           '🇲🇦', 'MAD', 10,   2.40, 1.40, 1.60, 0.85),
  ('CD', 'RD Congo',        '🇨🇩', 'USD', 1,    0.90, 0.50, 0.60, 0.30)
ON CONFLICT (code) DO UPDATE SET
  name         = EXCLUDED.name,
  flag         = EXCLUDED.flag,
  currency     = EXCLUDED.currency,
  fx_to_usd    = EXCLUDED.fx_to_usd,
  cpm_facebook = EXCLUDED.cpm_facebook,
  cpm_tiktok   = EXCLUDED.cpm_tiktok,
  rpm_facebook = EXCLUDED.rpm_facebook,
  rpm_tiktok   = EXCLUDED.rpm_tiktok;

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Étape suivante côté dashboard Supabase :                    ║
-- ║  Settings → API → Exposed schemas → ajouter "monetiq"        ║
-- ║  (à côté de "public, graphql_public, storage")               ║
-- ╚══════════════════════════════════════════════════════════════╝
