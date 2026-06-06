# 3Wi PMO Suite — Production SaaS

> **CANONICAL BASELINE** — This is the chosen baseline going forward (confirmed by Jody, 4 May 2026).
> The `02_Demo_Build/` folder is now archive-only and should not be developed against.

AI-powered, multi-tenant Project Management Office platform owned by **3Wi PTY Ltd** (Jody Naidoo).
Anchor tenant: **IBS / Sunshines Project** (Ravi Naidoo, ECRDA Pilot Production Project).

This is the **canonical production codebase** — multi-tenant, RLS-protected, Stripe-billed,
Resend-emailed. The version that ships to paying subscribers.

> **No API keys?** Set `MOCK_MODE=true` in your `.env` and the app runs fully offline using realistic stubs for Anthropic, Stripe, and Resend. See `NO_KEYS_DEPLOY.md` for the three deploy paths (pure-mock, free-tier hybrid, and full production).

## Stack

| Layer | Technology |
|---|---|
| Frontend (SaaS) | React 18 + TypeScript, Vite, Tailwind, shadcn/ui patterns, Zustand, React Router v6 |
| Frontend (Marketing) | React 18 + Vite (single-page) |
| Backend | Node.js 20, Express, TypeScript, Prisma |
| Database | PostgreSQL via Supabase (auth, storage, realtime, RLS) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) — streaming |
| Payments | Stripe (subscription billing, webhooks) |
| Email | Resend (transactional) |
| Cache | Redis (Upstash) |
| Hosting | Vercel (web + marketing), Railway/Render (api) |

## Repo Layout

```
03_PMO_SaaS/
  README.md                ← this file
  BUILD_BRIEF.md           ← consolidated prompt + priority order
  .env.example             ← all env vars
  prisma/schema.prisma     ← 14-table multi-tenant schema
  supabase/migrations/     ← raw SQL (init + RLS)
  apps/web/                ← main SaaS app
  apps/api/                ← REST API
  apps/marketing/          ← public marketing site
  demo-reports/            ← 5 markdown templates AI skills produce
```

## Build & Deploy Order

1. **Provision Supabase project** → copy `DATABASE_URL`, `SUPABASE_URL`, anon + service keys.
2. **Run migrations**: apply `supabase/migrations/0001_init.sql` then `0002_rls.sql` via Supabase SQL editor or `psql`.
3. **Generate Prisma client**: `cd prisma && npx prisma generate`.
4. **Stripe**: create one Product per tier (Starter / Professional / Enterprise). Copy price IDs.
5. **Resend**: verify sending domain. Copy `RESEND_API_KEY`.
6. **Anthropic**: copy `ANTHROPIC_API_KEY`.
7. **Build & deploy API**: `cd apps/api && npm install && npm run build && npm start` (port 4000).
8. **Build & deploy web**: `cd apps/web && npm install && npm run build` → deploy `dist/` to Vercel.
9. **Build & deploy marketing**: `cd apps/marketing && npm install && npm run build` → root domain.
10. **Stripe webhook**: point at `${API_URL}/webhooks/stripe`, copy `STRIPE_WEBHOOK_SECRET`.
11. **Create first tenant + director** via `POST /auth/signup` then run the 6-step wizard.

## Branding Guidance

- **Marketing site** uses 3Wi neutral palette with green accent (`#015807`). The Hempire palette (`#3F1101`, `#015807`, `#FDF31C`) is shown specifically inside the Sunshines case-study card.
- **Main SaaS app** is neutral 3Wi: charcoal (`#0F172A`), teal (`#0EA5A4`), warm white (`#F8FAFC`). Each tenant overrides `--brand-primary/-secondary/-accent` CSS vars from their `tenants` row, so the Sunshines tenant gets Hempire colours automatically when logged in.
- **Demo reports** use placeholder tokens like `{{project_name}}` — AI skills replace them at run time.

## Performance Targets

| Target | Threshold |
|---|---|
| Dashboard load on mobile 4G | < 2 s |
| Photo upload with geotag | < 5 s |
| AI streaming — first token | < 3 s |
| Farmer portal min device | Android 2 GB RAM |
| Photo queue offline | local-first, sync on reconnect |

## Security Posture

- RLS on every tenant-scoped table — `current_setting('app.tenant_id')` (see `0002_rls.sql`).
- Farmer PINs bcrypt-hashed (`pin_hash`).
- Photos in private Supabase bucket; presigned URLs with 1-hour expiry.
- Audit log on every report generation, milestone update, user lifecycle action.
- POPIA basis: contract performance (OTA), purpose limitation, retention controls.

## Pricing

| Tier | Projects | Users | AI Reports/mo | Monthly | Annual (-20%) |
|---|---|---|---|---|---|
| Starter | 1 | 10 | 3 | R5,000 | R48,000 |
| Professional | 3 | 50 | 20 | R15,000 | R144,000 |
| Enterprise | ∞ | ∞ | ∞ | Custom | Custom |
| **IBS anchor** | 1 | 8 | 6 | **R18,000** | R216,000 |

IBS pricing is per-user (R1,500) + per-report (R1,000) — defensible to SARS as a connected-person fee.

## Env Vars

See `.env.example`. Required:
- `DATABASE_URL`, `DIRECT_URL`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `REDIS_URL`
- `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Sunshines Anchor Demo

Seed data (in `apps/api/src/services/seed.ts`) loads the full Sunshines hierarchy:

- **Tenant:** IBS (3Wi's first paying client)
- **Client:** Hempire-EC NPC (Hempire colours `#3F1101 / #015807 / #FDF31C`)
- **Project:** Sunshines Project — code `SUNSHINES-001`, MOA `HEMP/IBS/MOA/2025`
  - Total budget: **R4,800,000** (corrected from earlier R8.7m)
  - Tagline: "Sowing Seeds of Change"

### Parts, Deliverables, Growers, Disbursements

Sunshines is split into **Parts** (programme phases under one project):

| Part | Name | Lead funder | Notes |
|---|---|---|---|
| P1 | Seedlings Cohort | ECRDA | 46-grower register, rate-based disbursements |
| P2 | DSBD Seed Cohort | DSBD | placeholder — growers TBC |

Each Part has named **Deliverables** (D1, D2, D3 ...) — the contracted outputs the
funder pays against. Part 1 deliverables:

- **D1** — Determine Part 1 budget allocation within R4.8m envelope (At risk, 0%)
- **D2** — Review applications + field-research data; house in Grower Register; publish reports (On track, 60%)
- **D3** — Disbursements + per-farmer sign-off + Part 1 closeout (On track, 20%, payment R536,590)

The lower-level `Milestone` model is retained for G0..G5 gate audits and continues
to be used by the farmer / technical command centres.

### Disbursement formula

Per Sunshines Part 1, disbursements are rate-based per funded hectare:

```
amount_mechanisation = funded_ha x R7,350.00
amount_labour        = funded_ha x R3,618.72
amount_total         = funded_ha x R10,968.72
```

`funded_ha` defaults to the grower's `mapped_ha` (verified surveyed area) and can
be overridden per-grower if needed. Each Disbursement requires a per-farmer
**Sign-off** (`Awaiting / Disputed / Signed / Withdrawn`) before it advances to
`Approved` and then `Paid`. Sign-off captures witness name, signature reference
and any grower notes for an auditable trail.

### Run the seed

After applying migrations 0001 -> 0004:

```bash
cd apps/api
npm run prisma:generate
npm run seed              # idempotent — safe to re-run
```

The seed loads 46 growers from `apps/api/src/services/seed-data/growers.json`
and creates 46 Disbursement rows + 46 DisbursementSignoff rows (all `Awaiting`).
