-- ─────────────────────────────────────────────────────────────────────
-- Migration 0003 : RPC d'attribution du rôle ADMIN
-- ─────────────────────────────────────────────────────────────────────
-- Le schéma `monetiq` n'est pas exposé par PostgREST par défaut.
-- On crée une RPC sécurisée (SECURITY DEFINER) qui permet de :
--   - Insérer / mettre à jour un user_profile avec role='ADMIN'
--   - Appelable uniquement avec le service_role key (côté serveur)
--
-- Helper supplémentaire : is_admin(uuid) — utilisé par les RLS et middleware.

set search_path = public;

-- ─── Helper : test admin par user id ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, monetiq
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM monetiq.user_profiles
    WHERE id = p_user_id
      AND role = 'ADMIN'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon;

-- ─── RPC : promote un user à ADMIN (service_role only) ────────────────
CREATE OR REPLACE FUNCTION public.set_admin_role(
  p_user_id  uuid,
  p_email    text,
  p_full_name text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, monetiq
AS $$
BEGIN
  -- Garde-fou : ne s'exécute qu'avec service_role
  IF current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'authenticated' THEN
    RAISE EXCEPTION 'set_admin_role est réservée au service_role';
  END IF;

  INSERT INTO monetiq.user_profiles (id, email, full_name, role)
  VALUES (p_user_id, p_email, COALESCE(p_full_name, split_part(p_email, '@', 1)), 'ADMIN')
  ON CONFLICT (id) DO UPDATE
    SET role        = 'ADMIN',
        email       = EXCLUDED.email,
        full_name   = COALESCE(EXCLUDED.full_name, monetiq.user_profiles.full_name),
        updated_at  = now();
END;
$$;

-- service_role peut tout — pas besoin de grant supplémentaire.
REVOKE EXECUTE ON FUNCTION public.set_admin_role(uuid, text, text) FROM anon, authenticated;
