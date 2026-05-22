-- ============================================================================
-- 0008_fix_is_admin_rpc.sql
--
-- Problème : is_admin() (migration 0003) ne vérifie que role = 'ADMIN'.
-- Depuis la migration 0007, les rôles 'SUPER_ADMIN', 'MODERATOR', 'SUPPORT',
-- 'ANALYST' existent et ont accès au panneau admin — mais is_admin() les
-- rejetait, ce qui bloquait la connexion et les RLS de ces utilisateurs.
--
-- Fix : is_admin() accepte désormais tous les rôles admin élargi.
-- is_super_admin() était déjà correct (migration 0007), on le laisse tel quel.
-- ============================================================================

set search_path = public;

-- ── Mise à jour de is_admin : couvre tous les rôles avec accès /admin ──────
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
      AND role IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR', 'SUPPORT', 'ANALYST')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon;

-- Wrapper monetiq (pour les RLS qui référencent monetiq.is_admin)
CREATE OR REPLACE FUNCTION monetiq.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, monetiq
STABLE
AS $$
  SELECT public.is_admin(p_user_id);
$$;

-- ── Vérification via auth.uid() (pour les policies RLS dans les migrations) ─
-- Cette variante sans argument est utilisée dans certaines policies RLS
-- (auth.uid() injecté automatiquement).
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, monetiq
STABLE
AS $$
  SELECT public.is_admin(auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated, anon;
