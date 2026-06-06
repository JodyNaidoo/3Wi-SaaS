# 3Wi PMO Suite — Build Brief

Consolidated build brief derived from the canonical Cowork prompt. Single source of truth for engineering. Pair with `README.md` (deploy guide) and `prisma/schema.prisma` (data model).

## Identity

Multi-tenant AI-powered PMO SaaS owned by 3Wi PTY Ltd. Anchor tenant: IBS, running the ECRDA Pilot Production Project (Sunshines) under MOA `HEMP/IBS/MOA/2025`. Purpose: replace manual PMO reporting, gate tracking, risk management, and stakeholder communication with an AI command centre any PM can configure for any project in under 30 minutes.

## Architecture — 4 Layers

1. **Tenant** — isolated data, users, projects, branding.
2. **Project** — workstreams, milestones, risks per tenant.
3. **User** — role-scoped command centre.
4. **AI** — 5 skills/project; prompts editable per tenant.

## 14 Schema Tables

| Table | Tenant FK | Notes |
|---|---|---|
| tenants | (root) | brand colours, Stripe customer, tier |
| users | yes | email, phone, bcrypt pin_hash, role, district |
| projects | yes | budget, funder, MOA, tagline |
| workstreams | via project | code/name/budget/lead/colour/icon |
| milestones | via project | M01.., due, status, payment_amount, gate_evidence |
| risks | via project | likelihood/impact/RAG/control/owner/PFMA |
| project_users | via project | role-scoped command-centre membership |
| help_requests | via project | farmer→tech, 24h SLA |
| photo_uploads | via project | geotagged, reviewed |
| gate_audits | via project | digital G0–G5 checklists |
| reports | yes | AI outputs |
| ai_prompts | yes | per-skill editable prompt |
| subscriptions | yes | plan, counts, Stripe sub id |
| invoices | yes | monthly billing rollups |
| audit_log | yes | mutation log |

## Five Command Centres

| # | Role | Hotkeys | Scope |
|---|---|---|---|
| 1 | director | F1–F10 | full + prompt editor + billing |
| 2 | psc | F1–F6 | read-only funder/governance |
| 3 | farmer | F1–F8 | mobile, phone+PIN, offline |
| 4 | technical | F1–F7 | photo queue, help, gate audits, NCR |
| 5 | offtaker | F1–F6 | delivery, QC, payments, pipeline |

## Five AI Skills

1. `monthly_ops` — Monthly Operations Report
2. `risk_update` — Risk Register Update
3. `mov_pack` — MoV Evidence Pack
4. `quarterly_report` — Quarterly PSC Report
5. `stakeholder_comms` — Stakeholder Communication

Each skill has tenant-editable prompt, streaming response, copy + save-to-reports.

## 6-Step Onboarding Wizard

1. Project identity (name/code/dates/budget/funder/MOA/brand/logo)
2. Workstreams (max 10, sum-not-exceed validation)
3. Milestones (max 25, CSV import, payment trigger)
4. Risk register (12 standard pre-pop, PFMA flag)
5. User groups (CSV bulk farmer import)
6. AI prompt configuration

On finish: dashboard + command centres + welcome emails generated.

## Pricing

| Tier | Projects | Users | Reports/mo | R/mo | R/yr (-20%) |
|---|---|---|---|---|---|
| Starter | 1 | 10 | 3 | 5,000 | 48,000 |
| Professional | 3 | 50 | 20 | 15,000 | 144,000 |
| Enterprise | inf | inf | inf | Custom | Custom |
| IBS anchor | 1 | 8 | 6 | 18,000 | 216,000 |

IBS billed per-user (R1,500) + per-report (R1,000). VAT exclusive.

## Performance Targets

- Dashboard < 2s on 4G
- Photo upload < 5s mobile
- AI streaming first token < 3s
- Farmer portal works on Android 2GB RAM
- Photo queue offline-capable

## Security

- RLS on every tenant-scoped table
- Bcrypt PIN hashing
- Private bucket; presigned URLs 1h
- JWT-protected APIs; audit log
- POPIA — contract performance basis

## Build Priority Order

1. DB schema + Supabase setup
2. Auth — JWT for director, phone+PIN for farmer
3. Onboarding wizard (6 steps)
4. Command-centre shell
5. Director CC (F1, F4, F5, F6)
6. Farmer CC (F1–F4)
7. Technical Hub (F1 photo queue)
8. AI skills (all 5 streaming + prompt editor)
9. Demo reports (pre-loaded)
10. PSC CC
11. Offtaker CC
12. Billing module + Stripe
13. Marketing website
14. Email notifications

## Sunshines Anchor Config

- Tenant: IBS · Project: SUNSHINES-001 · MOA HEMP/IBS/MOA/2025
- Budget R8.7m (ECRDA R4.8m + SEDFA R3.9m)
- Brand `#3F1101` / `#015807` / `#FDF31C`, tagline "Sowing Seeds of Change"
- Workstreams A–F, milestones M01–M20, risks R1–R12
- 6 confirmed farmers, PIN `1234` (bcrypt hashed)
- 5 prompts loaded with Hempire EC / PFMA / MOA / brand context
