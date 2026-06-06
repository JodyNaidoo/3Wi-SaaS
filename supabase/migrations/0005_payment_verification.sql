-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 0005 — Payment Verification & Sign-Off (Sunshines Part 1)
--
-- Implements the four-gate disbursement governance process designed for
-- Hempire-EC NPC. See:
--   Sunshines_Inception_Section_Disbursement_Process.docx   (operational design)
--   3Wi_Hempire_Payment_Verification_Process.html           (full design)
--   3Wi_Cowork_Implementation_Prompt.md                     (build brief)
--
-- New tables:
--   release_batches          — groups verified disbursements for authorisation
--   farmer_signoffs          — Stage 2: beneficiary self-verification + banking
--   verification_signoffs    — Stage 3: Solly Vuso (Technical Verifier)
--   release_signoffs         — Stage 4: Dr Sunshine Blouw (Release Authoriser)
--   payment_records          — Stage 5: bank confirmation + POP
--
-- Extends:
--   disbursements   — adds process_status enum (10-state machine)
--   users           — adds new roles (verifier, authoriser, bookkeeper, ecrda_viewer)
--                     (role column is text, no DDL change needed — values are
--                     enforced by application code + this comment)
--
-- All new tables are tenant-scoped and RLS-protected using the existing
-- current_setting('app.tenant_id') pattern from 0002_rls.sql.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Extend disbursements with the 10-state process_status machine
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.disbursements
  ADD COLUMN IF NOT EXISTS process_status TEXT NOT NULL DEFAULT 'Awaiting Beneficiary',
  ADD COLUMN IF NOT EXISTS process_status_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Valid states (enforced by check constraint):
--   Awaiting Beneficiary | Beneficiary-Accepted | Disputed |
--   Calculation-Verified | Calculation-Rejected |
--   Release-Authorised   | On Hold |
--   Payment Pending      | Paid    | Payment Failed
ALTER TABLE public.disbursements
  DROP CONSTRAINT IF EXISTS disbursements_process_status_check;

ALTER TABLE public.disbursements
  ADD CONSTRAINT disbursements_process_status_check
    CHECK (process_status IN (
      'Awaiting Beneficiary', 'Beneficiary-Accepted', 'Disputed',
      'Calculation-Verified', 'Calculation-Rejected',
      'Release-Authorised',   'On Hold',
      'Payment Pending',      'Paid', 'Payment Failed'
    ));

CREATE INDEX IF NOT EXISTS idx_disbursements_process_status
  ON public.disbursements (tenant_id, process_status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. release_batches — Stage 4 grouping
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.release_batches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  part_id         UUID NOT NULL REFERENCES public.parts(id)    ON DELETE CASCADE,
  batch_code      TEXT NOT NULL,                       -- e.g. "B-2026-05-001"
  total_amount    NUMERIC(14, 2) NOT NULL DEFAULT 0,
  grower_count    INTEGER       NOT NULL DEFAULT 0,
  status          TEXT          NOT NULL DEFAULT 'pending_auth',
  created_by      UUID REFERENCES public.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT release_batches_status_check
    CHECK (status IN ('pending_auth', 'authorised', 'paid', 'on_hold', 'cancelled')),
  CONSTRAINT release_batches_unique_code UNIQUE (project_id, batch_code)
);

CREATE INDEX IF NOT EXISTS idx_release_batches_tenant     ON public.release_batches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_release_batches_part_status ON public.release_batches(part_id, status);

-- Track which disbursements belong to which batch
ALTER TABLE public.disbursements
  ADD COLUMN IF NOT EXISTS release_batch_id UUID REFERENCES public.release_batches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_disbursements_batch
  ON public.disbursements(release_batch_id) WHERE release_batch_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. farmer_signoffs — Stage 2 beneficiary self-verification
--
-- Banking columns are stored encrypted-at-rest. The application encrypts
-- with AES-256-GCM using the BANKING_ENC_KEY env var. POPIA-compliant:
-- only Stage 5 bookkeeper role decrypts; all reads logged in audit_log.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.farmer_signoffs (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                     UUID NOT NULL REFERENCES public.tenants(id)       ON DELETE CASCADE,
  disbursement_id               UUID NOT NULL REFERENCES public.disbursements(id) ON DELETE CASCADE,
  grower_id                     UUID NOT NULL REFERENCES public.growers(id)       ON DELETE CASCADE,

  decision                      TEXT NOT NULL,             -- accepted | disputed | no_response
  signed_full_name              TEXT,
  signed_at                     TIMESTAMPTZ,
  signed_ip                     INET,
  signed_device_fingerprint     TEXT,
  indemnity_version             TEXT NOT NULL DEFAULT '1.0',

  banking_account_holder_enc    TEXT,       -- AES-256-GCM ciphertext + tag + iv (base64)
  banking_bank                  TEXT,
  banking_account_number_enc    TEXT,
  banking_branch_code_enc       TEXT,
  banking_account_type          TEXT,
  banking_proof_storage_key     TEXT,       -- Supabase Storage object key

  dispute_reason                TEXT,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT farmer_signoffs_decision_check
    CHECK (decision IN ('accepted', 'disputed', 'no_response')),
  CONSTRAINT farmer_signoffs_unique_disbursement UNIQUE (disbursement_id)
);

CREATE INDEX IF NOT EXISTS idx_farmer_signoffs_tenant    ON public.farmer_signoffs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_farmer_signoffs_grower    ON public.farmer_signoffs(grower_id);
CREATE INDEX IF NOT EXISTS idx_farmer_signoffs_decision  ON public.farmer_signoffs(tenant_id, decision);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. verification_signoffs — Stage 3 Mr Vuso (Technical Verifier)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.verification_signoffs (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id              UUID NOT NULL REFERENCES public.tenants(id)       ON DELETE CASCADE,
  disbursement_id        UUID NOT NULL REFERENCES public.disbursements(id) ON DELETE CASCADE,
  verifier_user_id       UUID NOT NULL REFERENCES public.users(id),

  decision               TEXT NOT NULL,                    -- verified | rejected
  signed_full_name       TEXT NOT NULL,
  signed_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  signed_ip              INET,

  twofa_method           TEXT,                             -- totp | sms | webauthn
  twofa_evidence_hash    TEXT,                             -- sha256 of 2FA challenge response

  formula_check_passed   BOOLEAN NOT NULL DEFAULT true,
  rejection_reason       TEXT,
  notes                  TEXT,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT verification_signoffs_decision_check
    CHECK (decision IN ('verified', 'rejected')),
  CONSTRAINT verification_signoffs_unique_per_disbursement
    UNIQUE (disbursement_id)
);

CREATE INDEX IF NOT EXISTS idx_verification_signoffs_tenant    ON public.verification_signoffs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_verification_signoffs_verifier  ON public.verification_signoffs(verifier_user_id);
CREATE INDEX IF NOT EXISTS idx_verification_signoffs_decision  ON public.verification_signoffs(tenant_id, decision);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. release_signoffs — Stage 4 Dr Blouw (Release Authoriser)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.release_signoffs (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id              UUID NOT NULL REFERENCES public.tenants(id)         ON DELETE CASCADE,
  release_batch_id       UUID NOT NULL REFERENCES public.release_batches(id) ON DELETE CASCADE,
  authoriser_user_id     UUID NOT NULL REFERENCES public.users(id),

  decision               TEXT NOT NULL,                    -- authorised | held
  signed_full_name       TEXT NOT NULL,
  signed_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  signed_ip              INET,

  twofa_method           TEXT,
  twofa_evidence_hash    TEXT,

  hold_reason            TEXT,
  governance_attestation BOOLEAN NOT NULL DEFAULT false,   -- ticked: "envelope avail + verified + farmer-attested"

  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT release_signoffs_decision_check
    CHECK (decision IN ('authorised', 'held')),
  CONSTRAINT release_signoffs_unique_per_batch
    UNIQUE (release_batch_id)
);

CREATE INDEX IF NOT EXISTS idx_release_signoffs_tenant      ON public.release_signoffs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_release_signoffs_authoriser  ON public.release_signoffs(authoriser_user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. payment_records — Stage 5 bank confirmation + POP
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payment_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id)         ON DELETE CASCADE,
  disbursement_id     UUID NOT NULL REFERENCES public.disbursements(id)   ON DELETE CASCADE,
  release_batch_id    UUID REFERENCES public.release_batches(id)          ON DELETE SET NULL,

  bank_reference      TEXT,
  payment_date        DATE,
  amount              NUMERIC(14, 2) NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending',

  failed_reason       TEXT,
  pop_storage_key     TEXT,                               -- Supabase Storage key for the POP PDF

  captured_by         UUID REFERENCES public.users(id),
  captured_at         TIMESTAMPTZ,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT payment_records_status_check
    CHECK (status IN ('pending', 'paid', 'failed')),
  CONSTRAINT payment_records_unique_per_disbursement
    UNIQUE (disbursement_id)
);

CREATE INDEX IF NOT EXISTS idx_payment_records_tenant   ON public.payment_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_batch    ON public.payment_records(release_batch_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_status   ON public.payment_records(tenant_id, status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. updated_at triggers (reuse the helper from 0001 if present)
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    CREATE OR REPLACE FUNCTION public.set_updated_at()
    RETURNS TRIGGER AS $body$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $body$ LANGUAGE plpgsql;
  END IF;
END $$;

CREATE TRIGGER trg_release_batches_updated_at
  BEFORE UPDATE ON public.release_batches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_payment_records_updated_at
  BEFORE UPDATE ON public.payment_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. RLS — tenant isolation for all new tables
--
-- Pattern matches 0002_rls.sql: each tenant-scoped table has a policy that
-- restricts visibility to rows where tenant_id matches the
-- current_setting('app.tenant_id') GUC set by the API on each request.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.release_batches        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_signoffs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_signoffs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_signoffs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records        ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS release_batches_tenant_isolation       ON public.release_batches;
DROP POLICY IF EXISTS farmer_signoffs_tenant_isolation       ON public.farmer_signoffs;
DROP POLICY IF EXISTS verification_signoffs_tenant_isolation ON public.verification_signoffs;
DROP POLICY IF EXISTS release_signoffs_tenant_isolation      ON public.release_signoffs;
DROP POLICY IF EXISTS payment_records_tenant_isolation       ON public.payment_records;

CREATE POLICY release_batches_tenant_isolation       ON public.release_batches
  USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY farmer_signoffs_tenant_isolation       ON public.farmer_signoffs
  USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY verification_signoffs_tenant_isolation ON public.verification_signoffs
  USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY release_signoffs_tenant_isolation      ON public.release_signoffs
  USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY payment_records_tenant_isolation       ON public.payment_records
  USING (tenant_id::text = current_setting('app.tenant_id', true));

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Backfill — existing 46 disbursements get process_status = 'Awaiting Beneficiary'
--    The default on the column already handles this, but we set it explicitly
--    for any rows that may have been added without the default.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE public.disbursements
   SET process_status = 'Awaiting Beneficiary'
 WHERE process_status IS NULL;

COMMIT;

-- ─────────────────────────────────────────────────────────────────────────────
-- Post-deploy notes:
--
--   1. Generate Prisma client:
--        cd C:\dev\3wi-pmo-saas
--        npx prisma generate
--
--   2. Generate a banking encryption key for .env (32 bytes, base64):
--        node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
--      Add to apps/api/.env:
--        BANKING_ENC_KEY=<paste>
--
--   3. Smoke-test:
--        UPDATE public.disbursements
--           SET process_status = 'Beneficiary-Accepted'
--         WHERE external_ref IN (SELECT external_ref FROM public.growers ORDER BY external_ref LIMIT 5)
--         RETURNING id, process_status;
--      Five disbursements should now appear in Solly's queue at /cc/verifications.
-- ─────────────────────────────────────────────────────────────────────────────
