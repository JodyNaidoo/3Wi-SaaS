-- =====================================================================
-- 0008 — Offtaker submissions (Vetted Pool intake)
-- =====================================================================
-- Stores submissions from the ECRDA Hemp Offtaker Submission Checklist
-- (the standalone HTML form at /offtaker-submission-form.html).
-- One row per submission. The full form payload is kept in JSONB; a few
-- key fields are indexed for dashboard queries.
-- =====================================================================

CREATE TYPE offtaker_status AS ENUM (
  'draft',
  'submitted',
  'screening',
  'tna',
  'verification',
  'recommendation',
  'approved',
  'approved_conditional',
  'declined',
  'deferred',
  'withdrawn'
);

CREATE TABLE offtaker_submissions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Indexed snapshot fields (extracted from form payload at submit time)
  legal_name               TEXT NOT NULL,
  trading_name             TEXT,
  registration_number      TEXT,
  legal_entity_type        TEXT,
  primary_contact_name     TEXT,
  primary_contact_email    TEXT NOT NULL,
  primary_contact_phone    TEXT,
  bbbee_level              TEXT,
  offtaker_category        TEXT,           -- Trader / Processor / Integrated / End-user / Other
  target_districts         TEXT[],         -- e.g. ['Amathole','OR Tambo']
  product_categories       TEXT[],         -- e.g. ['flower','seed','bast']
  preferred_farmer_types   TEXT[],
  total_hectares_capacity  NUMERIC,
  estimated_farmers        INTEGER,

  -- Full form payload + supporting docs metadata
  form_payload             JSONB NOT NULL,

  -- Status + decision
  status                   offtaker_status NOT NULL DEFAULT 'submitted',
  screening_scorecard      JSONB,          -- 6-point screening per Annexure B.2
  tna_summary              TEXT,            -- Technical Needs Analysis output
  verification_notes       TEXT,
  recommendation           TEXT,            -- 'Approve' / 'Approve-Conditional' / 'Decline' / 'Defer'
  recommendation_notes     TEXT,
  conditions               TEXT,            -- Conditions if approved-conditional

  -- 5-tier approval chain (Annexure B.4)
  reviewer_name            TEXT,
  reviewer_date            DATE,
  programme_manager_name   TEXT,
  programme_manager_date   DATE,
  sector_head_name         TEXT,
  sector_head_date         DATE,
  ipm_executive_name       TEXT,
  ipm_executive_date       DATE,
  ceo_name                 TEXT,
  ceo_date                 DATE,

  -- Provenance
  submission_ref           TEXT,            -- ECRDA/HEMP/####/2026
  submitted_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at               TIMESTAMPTZ,
  created_by_user_id       UUID REFERENCES users(id),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX offtaker_tenant_status_idx ON offtaker_submissions (tenant_id, status);
CREATE INDEX offtaker_tenant_category_idx ON offtaker_submissions (tenant_id, offtaker_category);
CREATE INDEX offtaker_tenant_bbbee_idx ON offtaker_submissions (tenant_id, bbbee_level);
CREATE INDEX offtaker_submitted_at_idx ON offtaker_submissions (submitted_at DESC);
CREATE INDEX offtaker_districts_gin_idx ON offtaker_submissions USING gin (target_districts);
CREATE INDEX offtaker_products_gin_idx ON offtaker_submissions USING gin (product_categories);

ALTER TABLE offtaker_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY offtaker_isolation ON offtaker_submissions
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE OR REPLACE FUNCTION set_offtaker_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER offtaker_set_updated_at
  BEFORE UPDATE ON offtaker_submissions
  FOR EACH ROW EXECUTE FUNCTION set_offtaker_updated_at();
