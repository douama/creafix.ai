-- ──────────────────────────────────────────────────────────────────────────
-- 0008 — AI provider API keys via Supabase Vault
--
-- Même pattern que les payment-secrets (cf. migration 0007 §7) :
--   • table de liaison ai_provider_secrets → vault.secrets (chiffré)
--   • RPC SECURITY DEFINER : get_ai_secret / set_ai_secret / delete_ai_secret
--   • Auth : SUPER_ADMIN strict en écriture, service_role en lecture
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS monetiq.ai_provider_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider monetiq.ai_provider NOT NULL UNIQUE,
  secret_id uuid NOT NULL,
  last4 text NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE monetiq.ai_provider_secrets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin only ai_provider_secrets" ON monetiq.ai_provider_secrets;
CREATE POLICY "admin only ai_provider_secrets" ON monetiq.ai_provider_secrets FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION monetiq.get_ai_secret(p_provider text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','monetiq','vault'
AS $$
DECLARE
  v_secret_id uuid;
  v_decrypted text;
BEGIN
  -- Seul service_role peut récupérer la VALEUR (runtime providers).
  IF current_setting('role') <> 'service_role' THEN
    RAISE EXCEPTION 'Accès service_role requis pour décrypter';
  END IF;

  SELECT secret_id INTO v_secret_id FROM monetiq.ai_provider_secrets
    WHERE provider::text = p_provider;
  IF v_secret_id IS NULL THEN RETURN NULL; END IF;

  SELECT decrypted_secret INTO v_decrypted FROM vault.decrypted_secrets WHERE id = v_secret_id;
  RETURN v_decrypted;
END;
$$;

CREATE OR REPLACE FUNCTION monetiq.set_ai_secret(p_provider text, p_value text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','monetiq','vault'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_secret_id uuid;
  v_existing record;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM monetiq.user_profiles WHERE id = v_user_id AND role = 'SUPER_ADMIN'
  ) THEN
    RAISE EXCEPTION 'Accès SUPER_ADMIN requis pour modifier les clés IA';
  END IF;

  IF length(p_value) < 8 THEN
    RAISE EXCEPTION 'Clé trop courte (min 8 caractères)';
  END IF;

  SELECT * INTO v_existing FROM monetiq.ai_provider_secrets
    WHERE provider::text = p_provider;

  IF FOUND THEN
    PERFORM vault.update_secret(v_existing.secret_id, p_value);
    v_secret_id := v_existing.secret_id;
    UPDATE monetiq.ai_provider_secrets
      SET last4 = right(p_value, 4),
          updated_by = v_user_id,
          updated_at = now()
      WHERE id = v_existing.id;
  ELSE
    v_secret_id := vault.create_secret(
      p_value,
      format('cfx_ai_%s', lower(p_provider)),
      format('CreaFix AI provider key : %s', p_provider)
    );
    INSERT INTO monetiq.ai_provider_secrets (provider, secret_id, last4, updated_by)
      VALUES (p_provider::monetiq.ai_provider, v_secret_id, right(p_value, 4), v_user_id);
  END IF;

  INSERT INTO monetiq.audit_logs (actor_id, action, target_type, target_id, meta)
    VALUES (v_user_id, 'ai_secret.set', 'ai_provider_secret', v_secret_id::text,
            jsonb_build_object('provider', p_provider, 'last4', right(p_value, 4)));

  RETURN v_secret_id;
END;
$$;

CREATE OR REPLACE FUNCTION monetiq.delete_ai_secret(p_provider text)
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

  SELECT * INTO v_existing FROM monetiq.ai_provider_secrets
    WHERE provider::text = p_provider;
  IF NOT FOUND THEN RETURN false; END IF;

  DELETE FROM vault.secrets WHERE id = v_existing.secret_id;
  DELETE FROM monetiq.ai_provider_secrets WHERE id = v_existing.id;

  INSERT INTO monetiq.audit_logs (actor_id, action, target_type, target_id, meta)
    VALUES (v_user_id, 'ai_secret.delete', 'ai_provider_secret', v_existing.secret_id::text,
            jsonb_build_object('provider', p_provider));
  RETURN true;
END;
$$;

-- ──────────────────────────────────────────────────────────────────────────
-- trend_sync_runs : trace des runs cron trends-sync (stub mode inclus)
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS monetiq.trend_sync_runs (
  id bigserial PRIMARY KEY,
  ran_at timestamptz NOT NULL DEFAULT now(),
  mode text NOT NULL DEFAULT 'stub', -- 'stub' | 'live'
  platforms_attempted integer NOT NULL DEFAULT 0,
  platforms_ok integer NOT NULL DEFAULT 0,
  note text
);

ALTER TABLE monetiq.trend_sync_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin only trend_sync_runs" ON monetiq.trend_sync_runs;
CREATE POLICY "admin only trend_sync_runs" ON monetiq.trend_sync_runs FOR SELECT
  USING (public.is_admin(auth.uid()));
