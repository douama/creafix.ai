# CreaFix AI

**Le SEMrush + TubeBuddy + TikTok Studio + Meta Monetization Manager de l'Afrique.**

Plateforme IA d'audit de monétisation sociale pour créateurs africains, agences médias, influenceurs, pages Facebook, TikTokers et médias digitaux.

![banner](https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1600)

---

## ✨ Fonctionnalités livrées dans cette base

### Landing page premium
- Hero, features (9), how-it-works, agents IA (7), témoignages, pricing, FAQ, CTA, footer
- Design futuriste : glassmorphism, gradient violet → bleu → orange africain, animations Framer Motion
- Responsive mobile-first, optimisé low data
- FR (par défaut) — prêt pour i18n EN

### Dashboard SaaS complet
- `/dashboard` — vue d'ensemble, scores IA, comptes connectés, recommandations
- `/dashboard/audits` — historique des audits + page détail dimensions/issues/opportunités/plan 30j
- `/dashboard/audits/new` — wizard de lancement (Facebook / TikTok / OAuth)
- `/dashboard/generator` — idées virales, hooks, scripts, miniatures, voix-off, sons tendance
- `/dashboard/revenue` — estimateur multi-pays avec données CPM/RPM réelles
- `/dashboard/trends` — Trend Agent (hashtags, sons)
- `/dashboard/anti-ban` — surveillance risques
- `/dashboard/agents` — 7 agents IA (status, confiance)
- `/dashboard/agency` — mode marque blanche, clients
- `/dashboard/reports` — rapports PDF
- `/dashboard/billing` — plans, Mobile Money + Stripe
- `/dashboard/settings`, `/dashboard/help`

### Auth & onboarding
- Pages `/login`, `/signup` (Google, Facebook, email)
- Wizard d'onboarding 5 étapes (profil → plateforme → niche → pays → connexion)
- NextAuth scaffolding (Google + Facebook avec scopes Pages)

### Backend
- Schéma Prisma complet (15 modèles : User, SocialAccount, Audit, GeneratedContent, AgencyClient, Subscription, Payment, CountryCpm, Notification…)
- API routes : `/api/audits`, `/api/generator/ideas`, `/api/revenue/estimate`, `/api/social/connect`, `/api/payments/checkout`, `/api/health`, `/api/auth/[...nextauth]`
- Couche multi-agents IA (`src/lib/ai/agents.ts`) avec 5 agents implémentés en mode simulé
- Couche providers IA (`src/lib/ai/providers.ts`) prête pour Claude / GPT / Gemini / ElevenLabs / Runway
- Couche paiements (`src/lib/payments/providers.ts`) pour Stripe, PayPal, PayDunya, CinetPay, Wave, OM, MTN
- Middleware sécurité (headers, CSP-friendly)
- Données CPM/RPM pour 9 pays africains (Sénégal, CI, Cameroun, Mali, Nigeria, Ghana, RSA, Maroc, RDC)

---

## 🚀 Démarrage rapide

```bash
# 1. Installer
pnpm install   # ou npm install

# 2. Variables d'environnement
cp .env.example .env.local
# Édite .env.local avec tes clés (au minimum DATABASE_URL + NEXTAUTH_SECRET)

# 3. Base de données (optionnel — le SaaS tourne en mode démo sans)
pnpm db:generate
pnpm db:push        # crée le schéma sur PostgreSQL
pnpm db:seed        # insère les CPM africains

# 4. Lancer
pnpm dev            # → http://localhost:3000
```

---

## 🏗 Architecture

```
src/
├── app/
│   ├── (auth)/            # /login, /signup
│   ├── api/               # Routes API serveur
│   │   ├── audits/
│   │   ├── auth/[...nextauth]/
│   │   ├── generator/ideas/
│   │   ├── payments/checkout/
│   │   ├── revenue/estimate/
│   │   ├── social/connect/
│   │   └── health/
│   ├── dashboard/         # SaaS authentifié
│   ├── onboarding/        # Wizard 5 étapes
│   ├── layout.tsx         # Root (fonts, theme dark)
│   ├── globals.css        # Design tokens
│   └── page.tsx           # Landing
├── components/
│   ├── brand/             # Logo
│   ├── dashboard/         # Sidebar, topbar, score-ring, charts
│   ├── marketing/         # Sections landing
│   └── ui/                # Primitives (button, card, badge, …)
├── lib/
│   ├── ai/
│   │   ├── agents.ts      # 7 agents (audit, viral, monetization, anti-ban, trend, thumbnail, script)
│   │   └── providers.ts   # Couche abstraite multi-fournisseurs LLM (privée)
│   ├── payments/
│   │   └── providers.ts   # Stripe + Mobile Money agrégateurs
│   ├── supabase/          # Client browser + server + admin + middleware
│   ├── africa-cpm.ts      # Données CPM/RPM 9 pays africains (fallback)
│   └── utils.ts           # cn(), formatCurrency, …
├── middleware.ts          # Sessions Supabase + headers sécurité
└── supabase/migrations/   # Schéma SQL (10 tables, RLS, triggers, seed)
```

---

## 🤖 Stack IA

L'orchestration multi-agents et le routage des modèles sont des éléments
**propriétaires** documentés en interne uniquement. La couche
`src/lib/ai/providers.ts` expose une API neutre (`chat()`,
`generateImage()`, `generateVoice()`, `generateVideo()`) — les
implémentations concrètes vivent dans la branche privée de l'équipe.

Pour brancher tes propres clés en local :
```bash
# .env.local — renseigne les fournisseurs que tu utilises
# (clés API, modèles, baseURL si self-hosted)
```

---

## 💸 Paiements africains

`src/lib/payments/providers.ts` est l'unique surface. Brancher via :
- **PayDunya** (Sénégal, CI, BF, ML, TG, BJ) — couvre Wave, OM, Moov, Free, MTN en 1 intégration
- **CinetPay** (CI, CM, SN, BF, ML) — alternative
- **Stripe** — cartes internationales, Apple/Google Pay
- **PayPal** — fallback diaspora

---

## 🇸🇳 Données CPM Afrique

Source : moyennes 2024-2025 observées. Adapter via Prisma `CountryCpm` (table seedée).

| Pays          | RPM FB | RPM TT | CPM FB | CPM TT |
|---------------|--------|--------|--------|--------|
| 🇸🇳 Sénégal   | 0.90   | 0.45   | 1.40   | 0.80   |
| 🇨🇮 CI        | 1.00   | 0.50   | 1.60   | 0.90   |
| 🇨🇲 Cameroun  | 0.80   | 0.40   | 1.20   | 0.70   |
| 🇲🇱 Mali      | 0.70   | 0.35   | 1.00   | 0.60   |
| 🇳🇬 Nigeria   | 0.85   | 0.55   | 1.30   | 1.00   |
| 🇬🇭 Ghana     | 0.95   | 0.50   | 1.50   | 0.95   |
| 🇿🇦 RSA       | 2.10   | 1.10   | 3.20   | 1.80   |
| 🇲🇦 Maroc     | 1.60   | 0.85   | 2.40   | 1.40   |
| 🇨🇩 RDC       | 0.60   | 0.30   | 0.90   | 0.50   |

---

## ☁️ Déploiement

### Vercel (recommandé)
```bash
vercel
```
Configurer les env vars dans le dashboard Vercel.

### Self-host (AWS / VPS)
```bash
pnpm build
pnpm start
```

**Base de données :** Supabase (recommandé pour la latence Afrique), Neon, ou RDS.
**Stockage :** Cloudflare R2 (faible coût Afrique) ou S3.
**CDN :** Cloudflare obligatoire pour les utilisateurs mobiles bas débit.

---

## 📱 Roadmap

- [x] Web SaaS Next.js 14
- [x] Multi-agents IA scaffolding
- [x] Mobile Money agrégateurs
- [ ] App Flutter (iOS + Android) — notifications push + upload mobile
- [ ] Webhooks Meta + TikTok pour audit temps réel
- [ ] Marketplace influenceurs
- [ ] Programme affiliation + ambassadeur
- [ ] Leaderboard créateurs Afrique
- [ ] Versions wolof / pidgin / arabe

---

## 🛡 Confidentialité

- OAuth officiel uniquement (jamais de mot de passe partagé)
- Tokens chiffrés côté DB (à activer via pgcrypto ou KMS)
- RGPD-compliant + alignement DPI Sénégal & équivalents

---

## 📝 Licence

Proprietary © CreaFix AI · Built with ❤ for Africa.
