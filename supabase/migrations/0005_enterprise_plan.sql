-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 0005 : Ajout du plan ENTERPRISE dans plans_config
-- ─────────────────────────────────────────────────────────────────────────────
-- Le plan Enterprise à $199/mois avec essai 7 jours gratuits.
-- Destiné aux groupes médias, TV, radios et plateformes africaines.
-- ─────────────────────────────────────────────────────────────────────────────

SET search_path = monetiq, public;

INSERT INTO monetiq.plans_config (
  slug,
  name,
  description,
  price_monthly_usd,
  price_yearly_usd,
  features,
  credits_included,
  active,
  sort_order
)
VALUES (
  'ENTERPRISE',
  'Enterprise',
  'Pour les groupes médias, TV, radios et plateformes africaines.',
  199,
  1990,
  ARRAY[
    'Créateurs, médias & pages illimités',
    'Dashboard multi-marques centralisé',
    'API & Webhooks haute disponibilité',
    'SLA 99,9% garanti + support 24/7',
    'Modèles IA entraînés sur vos données',
    'Intégrations CRM, ERP et outils tiers',
    'Rapports exécutifs & analytics avancés',
    'Manager de succès dédié'
  ],
  999999,
  true,
  4
)
ON CONFLICT (slug) DO UPDATE
  SET name              = EXCLUDED.name,
      description       = EXCLUDED.description,
      price_monthly_usd = EXCLUDED.price_monthly_usd,
      price_yearly_usd  = EXCLUDED.price_yearly_usd,
      features          = EXCLUDED.features,
      credits_included  = EXCLUDED.credits_included,
      active            = EXCLUDED.active,
      sort_order        = EXCLUDED.sort_order,
      updated_at        = now();
