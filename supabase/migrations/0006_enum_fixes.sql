-- ============================================================================
-- 0006_enum_fixes.sql
--
-- Corrige deux incohérences d'enums repérées en audit :
--   1. monetiq.payment_provider ne contenait pas FLUTTERWAVE alors que le code
--      (`src/lib/payments/providers.ts`, routes `/api/checkout/flutterwave` et
--      `/api/webhooks/flutterwave`) l'utilisait → INSERT échouait en prod si
--      un user passait par Flutterwave.
--   2. monetiq.plan ne contenait pas ENTERPRISE alors que la migration 0005
--      faisait INSERT INTO plans_config (plan='ENTERPRISE', ...). Les champs
--      `user_profiles.plan` et `subscriptions.plan` typés sur cet enum
--      refusaient toute valeur ENTERPRISE.
--
-- `ADD VALUE IF NOT EXISTS` est idempotent (PG 9.6+) — la migration peut être
-- rejouée sans erreur.
-- ============================================================================

ALTER TYPE monetiq.payment_provider ADD VALUE IF NOT EXISTS 'FLUTTERWAVE';
ALTER TYPE monetiq.plan ADD VALUE IF NOT EXISTS 'ENTERPRISE';
