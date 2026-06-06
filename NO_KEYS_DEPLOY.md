# No-Keys Deploy Guide

A step-by-step guide for running and deploying **3Wi PMO Suite** without paying
for Anthropic, Stripe, or Resend on day one. Written for Jody (non-developer);
copy/paste friendly.

> TL;DR — open `.env`, set `MOCK_MODE=true`, run the app. Everything works.
> When you're ready, swap each service to a free tier one at a time.

---

## What "MOCK_MODE" actually does

Set `MOCK_MODE=true` at the top of your `.env`. The API will detect it on
startup and substitute three external services with realistic in-process stubs:

| Service | Real path | Mock behaviour |
|---|---|---|
| Anthropic Claude | Streams real AI text | Streams a deterministic fixture per skill (Monthly Ops, Risks, MoV, Quarterly, Stakeholder comms, Meeting summary, Farmer advisor) - same SSE shape, ~12 ms / word pacing so the UI behaves identically. |
| Stripe | Real customers, subscriptions, invoices, hosted checkout, signed webhooks | Fake customer & subscription objects (typed as `Stripe.Customer` / `Stripe.Subscription`), checkout returns `/billing/mock-checkout?tier=...`, billing portal returns `/billing/mock-portal`, webhook handler accepts any POST without signature check. |
| Resend | Sends real email | Logs the email to console (`[MOCK EMAIL] To: ... \| Subject: ... \| Body preview: ...`) and appends a JSON line to `apps/api/.mock-outbox.jsonl` for inspection. Returns a fake `mock-...` message ID. |

Supabase, Postgres, JWT, Redis are NOT mocked — those are infrastructure-level
and you'll always need at least the Supabase free tier for real data. The
"Pure mock" Path A below uses SQLite or an in-memory database to skip even
Supabase; see Path A.

You will see a startup banner like:

```
----------------------------------------------------------------
  3Wi PMO API - listening on :4000
  MOCK_MODE = TRUE (everything stubbed)
    - Anthropic Claude  : MOCK
    - Stripe billing    : MOCK
    - Resend email      : MOCK
  No external API calls will be made. Outputs come from fixtures.
----------------------------------------------------------------
```

If `MOCK_MODE=false` but a key is missing, the API auto-falls-back to mock
for that service and prints a one-time `console.warn`. The app never crashes
just because a key is empty.

---

## Three deploy paths

### Path A — Pure mock (zero signups, demo only)

**For:** Showing the app to a stakeholder this afternoon. No accounts to make.
**Time:** ~10 minutes.
**Limitations:** Data is local only. Can't share a multi-user link unless you
expose your laptop via a tunnel (ngrok / Cloudflare Tunnel).

1. Clone the repo: `git clone <your-fork> && cd 03_PMO_SaaS`
2. Copy env: `cp .env.example .env`
3. Confirm the top of `.env` reads `MOCK_MODE=true` (default).
4. Replace `DATABASE_URL` and `DIRECT_URL` with a local SQLite line, e.g.
   `DATABASE_URL="file:./dev.db"`. (Supabase-specific features will be no-ops.)
5. Install: in `apps/api`, `apps/web`, `apps/marketing`, run `npm install`.
6. Run migrations: from repo root run `npx prisma migrate dev` (this creates the
   local SQLite file). If Prisma complains about Postgres-only features, run
   `npx prisma db push` instead.
7. Start API: `cd apps/api && npm run dev`
8. Start web: in another terminal, `cd apps/web && npm run dev`
9. Browse `http://localhost:5173`, sign up, and click around. AI reports, billing
   pages, and welcome emails all work — they just don't talk to the internet.

To share a public preview without signups: install `ngrok` (free), run
`ngrok http 5173`, share the URL. Note: only safe for short demos.

---

### Path B — Free-tier hybrid (RECOMMENDED starting point)

**For:** Real users + real data, no payments. Recommended as the production
starting point until paid traffic arrives.
**Time:** ~60 minutes.
**Limitations:** Anthropic, Stripe, Resend are all in mock. Supabase + Vercel +
Railway are real but on free tiers.

1. **Supabase (free)** — sign up at https://supabase.com, create a new project.
   On the project's "Project Settings -> API" page copy `URL`, `anon key`,
   `service_role key`. Paste into `.env` as `SUPABASE_URL`,
   `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Free tier covers up to
   500 MB DB and 1 GB storage with no payment required.
2. From "Project Settings -> Database" copy the `Connection string` (transaction
   pooler) into `DATABASE_URL` and the direct connection into `DIRECT_URL`.
3. Apply migrations:
   - Open the Supabase SQL editor.
   - Paste `supabase/migrations/0001_init.sql`, run.
   - Paste `supabase/migrations/0002_rls.sql`, run.
4. Create the storage bucket: Supabase -> Storage -> New bucket named `photos`,
   private.
5. Set `MOCK_MODE=true` (still — keeps Anthropic/Stripe/Resend stubbed).
6. **Vercel (free Hobby plan)** — push the repo to GitHub, click "New Project"
   in Vercel, point at `apps/web`. Set the env vars from your `.env` in the
   Vercel project settings. Deploy.
7. **Railway or Render (free starter)** — same flow for `apps/api`. Set env
   vars in the dashboard. Confirm the public URL responds at `/health`.
8. **Upstash Redis (free)** — sign up, create a database, copy the
   `rediss://...` URL into `REDIS_URL`. (Optional in mock mode.)
9. Update `VITE_API_URL` in the web app's Vercel env to your Railway URL.
10. Browse the deployed marketing/web app. Real users can sign up, add
    projects, generate reports (mock), see invoices (mock), receive welcome
    emails (mock — visible in Railway logs).

> **Free-tier health check:** every service in this path has a permanent free
> tier with no credit card required. You will not be charged.

---

### Path C — Full production (all paid keys)

**For:** Onboarding paying tenants. Everything live.
**Time:** ~2 hours plus domain DNS waits.

1. Do everything in Path B.
2. **Anthropic (paid):** at https://console.anthropic.com create an API key.
   Free signup includes ~$5 credits. Set `Workspace -> Limits` to a low
   monthly cap (e.g. $20) until you know your usage. Paste into
   `ANTHROPIC_API_KEY`.
3. **Stripe (live):** at https://dashboard.stripe.com switch off "Test mode",
   create a Product per tier (Starter R5,000/mo, Professional R15,000/mo,
   Enterprise custom). Copy each Price ID into `STRIPE_PRICE_STARTER`,
   `STRIPE_PRICE_PRO`. Copy `Secret key (live)` into `STRIPE_SECRET_KEY`.
4. **Stripe webhook:** Dashboard -> Webhooks -> add endpoint
   `${API_URL}/webhooks/stripe`, listen to `invoice.paid`,
   `invoice.payment_failed`, `customer.subscription.deleted`. Copy the signing
   secret into `STRIPE_WEBHOOK_SECRET`.
5. **Resend (paid or larger free tier):** at https://resend.com verify your
   sending domain (DNS TXT records). Copy the API key into `RESEND_API_KEY`.
   Free tier is 3,000 emails/month — already plenty for early-stage. The
   "sandbox" sender works without a verified domain for testing.
6. Set `MOCK_MODE=false` in production environments.
7. Restart the API. The startup banner should now show every service as
   `LIVE`.

---

## Comparison: what works in each mode

| Capability | MOCK only (Path A) | Free-tier hybrid (Path B) | Paid prod (Path C) |
|---|---|---|---|
| Sign up / log in | YES (local) | YES (Supabase auth) | YES |
| Multi-tenant data | YES (SQLite) | YES (Postgres + RLS) | YES |
| Photo uploads | YES (filesystem) | YES (Supabase storage) | YES |
| AI report generation | Stubbed fixture | Stubbed fixture | Real Claude streaming |
| AI streaming UI | YES (paced fixture) | YES (paced fixture) | YES (real tokens) |
| Stripe checkout | Local mock URL | Local mock URL | Real Stripe Checkout |
| Stripe webhook | Auto-accept | Auto-accept | Signature-verified |
| Subscription billing | Fake objects | Fake objects | Real subscriptions |
| Invoices | Fake list | Fake list | Real invoices + PDF |
| Welcome / report emails | Console + outbox file | Console + outbox file | Real Resend delivery |
| Realtime updates | NO | YES (Supabase) | YES |
| Auditable PFMA outputs | YES (fixture) | YES (fixture) | YES (Claude) |
| Cost / month | R0 | R0 | depends on usage |

---

## Inspecting mock output

- **Mock email outbox:** `apps/api/.mock-outbox.jsonl` — one JSON line per
  email. Tail it with `tail -f apps/api/.mock-outbox.jsonl` to watch as users
  trigger emails. The file is gitignored.
- **Mock AI fixtures:** `apps/api/src/services/mocks/claude-fixtures.ts` — edit
  the strings if you want a different demo narrative.
- **Mock Stripe shapes:** `apps/api/src/services/mocks/stripe-fixtures.ts`.
- **Detection logic:** `apps/api/src/services/mocks/mode.ts`.

---

## Troubleshooting

**"I set a key but it's still using the mock."** — Check the startup banner.
If `MOCK_MODE=true`, the global flag wins. Set it to `false` and restart.

**"I get a console.warn about a missing key."** — That's the soft fallback.
Either set the key or set `MOCK_MODE=true` to silence the warning.

**"Stripe webhook works in mock but not in prod."** — Make sure
`STRIPE_WEBHOOK_SECRET` matches the value Stripe shows you for the endpoint
URL. The mock path accepts anything; live signature verification is strict.

**"Welcome emails go nowhere in mock."** — They're in the outbox file at
`apps/api/.mock-outbox.jsonl` and printed in the API logs.

**"Per-service mock toggles."** — You can mix-and-match. For example, set
`MOCK_MODE=false`, `MOCK_STRIPE=true` to run real Anthropic + Resend with
mocked Stripe.

---

## Next steps

When you're ready to flip a service from mock to real, you only need to:

1. Get the key, paste it into `.env`.
2. Either remove `MOCK_MODE=true` (turns ALL services live) or set the
   per-service `MOCK_*` flag to `false`.
3. Restart the API and confirm the startup banner shows that service as `LIVE`.

No code changes required.
