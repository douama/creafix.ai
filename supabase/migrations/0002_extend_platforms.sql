-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Migration 0002 — Étend l'enum platform                       ║
-- ║                                                                ║
-- ║  Ajoute X, SNAPCHAT, TWITCH, PINTEREST, LINKEDIN              ║
-- ║  (FACEBOOK, TIKTOK, INSTAGRAM, YOUTUBE existent déjà)         ║
-- ║                                                                ║
-- ║  À coller dans SQL Editor → Run                               ║
-- ╚══════════════════════════════════════════════════════════════╝

ALTER TYPE monetiq.platform ADD VALUE IF NOT EXISTS 'X';
ALTER TYPE monetiq.platform ADD VALUE IF NOT EXISTS 'SNAPCHAT';
ALTER TYPE monetiq.platform ADD VALUE IF NOT EXISTS 'TWITCH';
ALTER TYPE monetiq.platform ADD VALUE IF NOT EXISTS 'PINTEREST';
ALTER TYPE monetiq.platform ADD VALUE IF NOT EXISTS 'LINKEDIN';
