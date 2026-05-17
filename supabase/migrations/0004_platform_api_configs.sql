-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 0004 : Platform API configs — African Trend Scanner
-- ─────────────────────────────────────────────────────────────────────────────
-- Stocke la configuration par plateforme (enable/disable, pays) et les
-- métadonnées des clés API (masquées — last4 uniquement côté UI).
-- Les valeurs réelles sont dans platform_api_credential_values, service_role
-- only (RLS). Un cron /api/cron/trends-sync tourne toutes les heures.
-- ─────────────────────────────────────────────────────────────────────────────

SET search_path = monetiq, public;

-- ── 1. Config par plateforme ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS monetiq.platform_api_configs (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  platform           text        NOT NULL UNIQUE,
  enabled            boolean     NOT NULL DEFAULT false,
  countries          text[]      NOT NULL DEFAULT '{}',
  last_sync_at       timestamptz,
  last_sync_status   text        CHECK (last_sync_status IN ('ok', 'error', 'pending')),
  last_sync_error    text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

INSERT INTO monetiq.platform_api_configs (platform, enabled, countries)
VALUES
  ('tiktok',    false, ARRAY['CI','NG','MA','CM','ZA','SN']),
  ('instagram', false, ARRAY['CI','NG','MA','CM','ZA','SN']),
  ('youtube',   false, ARRAY['CI','NG','MA','CM','ZA','SN']),
  ('twitter',   false, ARRAY['CI','NG','MA','CM','ZA','SN']),
  ('facebook',  false, ARRAY['CI','NG','MA','CM','ZA','SN'])
ON CONFLICT (platform) DO NOTHING;

ALTER TABLE monetiq.platform_api_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_only_pac" ON monetiq.platform_api_configs;
CREATE POLICY "service_only_pac" ON monetiq.platform_api_configs
  USING (auth.role() = 'service_role');

-- ── 2. Métadonnées des clés (last4 pour affichage masqué) ─────────────────────
CREATE TABLE IF NOT EXISTS monetiq.platform_api_credentials (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  platform    text        NOT NULL,
  key_name    text        NOT NULL,
  last4       text        NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform, key_name)
);

ALTER TABLE monetiq.platform_api_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_only_cred" ON monetiq.platform_api_credentials;
CREATE POLICY "service_only_cred" ON monetiq.platform_api_credentials
  USING (auth.role() = 'service_role');

-- ── 3. Valeurs réelles des clés (service_role only) ───────────────────────────
CREATE TABLE IF NOT EXISTS monetiq.platform_api_credential_values (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  platform    text        NOT NULL,
  key_name    text        NOT NULL,
  value       text        NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform, key_name)
);

ALTER TABLE monetiq.platform_api_credential_values ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_only_credv" ON monetiq.platform_api_credential_values;
CREATE POLICY "service_only_credv" ON monetiq.platform_api_credential_values
  USING (auth.role() = 'service_role');

-- ── 4. RPCs ────────────────────────────────────────────────────────────────────

-- Lister les configs (sans secrets)
CREATE OR REPLACE FUNCTION public.list_platform_api_configs()
RETURNS TABLE(
  platform         text,
  enabled          boolean,
  countries        text[],
  last_sync_at     timestamptz,
  last_sync_status text,
  last_sync_error  text
) LANGUAGE plpgsql SECURITY DEFINER
SET search_path = monetiq, public
AS $$
BEGIN
  RETURN QUERY
    SELECT c.platform, c.enabled, c.countries,
           c.last_sync_at, c.last_sync_status, c.last_sync_error
    FROM monetiq.platform_api_configs c
    ORDER BY c.platform;
END;
$$;

-- Lister les credentials (last4 uniquement)
CREATE OR REPLACE FUNCTION public.list_platform_api_credentials()
RETURNS TABLE(platform text, key_name text, last4 text, updated_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = monetiq, public
AS $$
BEGIN
  RETURN QUERY
    SELECT c.platform, c.key_name, c.last4, c.updated_at
    FROM monetiq.platform_api_credentials c
    ORDER BY c.platform, c.key_name;
END;
$$;

-- Upsert credential (vérifie SUPER_ADMIN)
CREATE OR REPLACE FUNCTION public.upsert_platform_api_credential(
  p_platform text,
  p_key_name text,
  p_value    text,
  p_user_id  uuid
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = monetiq, public
AS $$
DECLARE
  v_is_super boolean;
BEGIN
  SELECT public.is_super_admin(p_user_id) INTO v_is_super;
  IF NOT COALESCE(v_is_super, false) THEN
    RAISE EXCEPTION 'SUPER_ADMIN required';
  END IF;

  INSERT INTO monetiq.platform_api_credentials (platform, key_name, last4, updated_at)
  VALUES (p_platform, p_key_name, right(p_value, 4), now())
  ON CONFLICT (platform, key_name)
  DO UPDATE SET last4 = right(p_value, 4), updated_at = now();

  INSERT INTO monetiq.platform_api_credential_values (platform, key_name, value, updated_at)
  VALUES (p_platform, p_key_name, p_value, now())
  ON CONFLICT (platform, key_name)
  DO UPDATE SET value = p_value, updated_at = now();
END;
$$;

-- Supprimer credential (vérifie SUPER_ADMIN)
CREATE OR REPLACE FUNCTION public.delete_platform_api_credential(
  p_platform text,
  p_key_name text,
  p_user_id  uuid
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = monetiq, public
AS $$
DECLARE
  v_is_super boolean;
BEGIN
  SELECT public.is_super_admin(p_user_id) INTO v_is_super;
  IF NOT COALESCE(v_is_super, false) THEN
    RAISE EXCEPTION 'SUPER_ADMIN required';
  END IF;

  DELETE FROM monetiq.platform_api_credentials
  WHERE platform = p_platform AND key_name = p_key_name;

  DELETE FROM monetiq.platform_api_credential_values
  WHERE platform = p_platform AND key_name = p_key_name;
END;
$$;

-- Mettre à jour la config (enabled + countries, vérifie SUPER_ADMIN)
CREATE OR REPLACE FUNCTION public.update_platform_api_config(
  p_platform  text,
  p_enabled   boolean,
  p_countries text[],
  p_user_id   uuid
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = monetiq, public
AS $$
DECLARE
  v_is_super boolean;
BEGIN
  SELECT public.is_super_admin(p_user_id) INTO v_is_super;
  IF NOT COALESCE(v_is_super, false) THEN
    RAISE EXCEPTION 'SUPER_ADMIN required';
  END IF;

  UPDATE monetiq.platform_api_configs
  SET enabled    = p_enabled,
      countries  = p_countries,
      updated_at = now()
  WHERE platform = p_platform;
END;
$$;

-- Mettre à jour le statut de sync (service_role uniquement)
CREATE OR REPLACE FUNCTION public.update_platform_sync_status(
  p_platform text,
  p_status   text,
  p_error    text DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = monetiq, public
AS $$
BEGIN
  UPDATE monetiq.platform_api_configs
  SET last_sync_at     = now(),
      last_sync_status = p_status,
      last_sync_error  = p_error,
      updated_at       = now()
  WHERE platform = p_platform;
END;
$$;

-- Récupérer les credentials pour le cron sync (service_role uniquement)
CREATE OR REPLACE FUNCTION public.get_platform_credentials_for_sync(
  p_platform text
) RETURNS TABLE(key_name text, value text)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = monetiq, public
AS $$
BEGIN
  RETURN QUERY
    SELECT cv.key_name, cv.value
    FROM monetiq.platform_api_credential_values cv
    WHERE cv.platform = p_platform;
END;
$$;

-- Grants (accessible aux rôles authentifiés via supabase.rpc)
GRANT EXECUTE ON FUNCTION public.list_platform_api_configs() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.list_platform_api_credentials() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.upsert_platform_api_credential(text, text, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_platform_api_credential(text, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_platform_api_config(text, boolean, text[], uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_platform_sync_status(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_platform_credentials_for_sync(text) TO service_role;
