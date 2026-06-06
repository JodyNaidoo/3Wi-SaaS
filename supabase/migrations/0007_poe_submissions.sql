-- =====================================================================
-- 0007 — Portfolio of Evidence submissions
-- =====================================================================
-- Stores each PoE submission from the standalone HTML form (or future
-- SaaS UI). One row per candidate × module × submission attempt.
-- =====================================================================

CREATE TYPE poe_status AS ENUM (
  'draft',
  'submitted',
  'under_verification',
  'competent',
  'not_yet_competent',
  're_assess',
  'deferred',
  'cancelled'
);

CREATE TABLE poe_submissions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Learner identity (grower_id where matched; always store name snapshot for audit)
  grower_id               UUID REFERENCES growers(id),
  candidate_name          TEXT NOT NULL,
  candidate_id_number     TEXT,
  cohort                  TEXT NOT NULL,
  district                TEXT,
  farm_name               TEXT,
  candidate_phone         TEXT,
  candidate_email         TEXT,
  learner_reference       TEXT,

  -- Module identity (snapshot at submission time)
  module_id               TEXT NOT NULL,
  module_title            TEXT NOT NULL,
  module_us_id            TEXT,
  module_nqf_level        INTEGER,
  module_credits          INTEGER,

  -- The full form payload
  evidence_payload        JSONB NOT NULL,

  -- Status + decision
  status                  poe_status NOT NULL DEFAULT 'submitted',
  total_score             NUMERIC(5,2),
  decision                TEXT,
  assessor_feedback       TEXT,
  required_actions        TEXT,

  -- Sign-off chain
  coordinator_name        TEXT,
  coordinator_role        TEXT,
  coordinator_date        DATE,
  assessor_name           TEXT,
  assessor_reg            TEXT,
  assessor_date           DATE,
  internal_moderator_name TEXT,
  internal_moderator_date DATE,
  external_moderator_name TEXT,
  external_moderator_date DATE,

  -- Provenance
  poe_ref                 TEXT,
  submitted_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at             TIMESTAMPTZ,
  decided_at              TIMESTAMPTZ,
  created_by_user_id      UUID REFERENCES users(id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX poe_tenant_status_idx ON poe_submissions (tenant_id, status);
CREATE INDEX poe_tenant_module_idx ON poe_submissions (tenant_id, module_id);
CREATE INDEX poe_tenant_cohort_idx ON poe_submissions (tenant_id, cohort);
CREATE INDEX poe_tenant_candidate_idx ON poe_submissions (tenant_id, candidate_name);
CREATE INDEX poe_submitted_at_idx ON poe_submissions (submitted_at DESC);

ALTER TABLE poe_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY poe_isolation ON poe_submissions
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE OR REPLACE FUNCTION set_poe_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER poe_set_updated_at
  BEFORE UPDATE ON poe_submissions
  FOR EACH ROW EXECUTE FUNCTION set_poe_updated_at();
