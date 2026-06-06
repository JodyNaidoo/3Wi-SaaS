-- ============================================================
-- 3Wi PMO Suite - Migration 0004: Parts, Deliverables, Growers,
--                                  Disbursements, Sign-offs
--
-- Major scope addition for the Sunshines Project. The Project is now
-- split into Parts (programme phases), each with its own Deliverables
-- (D1, D2, D3 ...). Part 1 (Seedlings Cohort) carries a 46-grower
-- register with rate-based disbursements (R7,350/ha mechanisation +
-- R3,618.72/ha labour) and per-farmer sign-off.
--
-- Hierarchy:
--   Project -> Part -> Deliverable
--                   -> Grower -> Disbursement -> DisbursementSignoff
--
-- Idempotent: uses IF NOT EXISTS and DROP POLICY IF EXISTS.
-- Applies cleanly on top of 0001_init.sql, 0002_rls.sql, 0003_clients.sql.
-- Relies on `current_tenant()` and `project_tenant()` from 0002_rls.sql.
--
-- Seed data lives in apps/api/src/services/seed.ts so it stays in
-- sync with bcrypt hashes and Prisma-generated UUIDs.
-- ============================================================

-- ---- Parts ----

CREATE TABLE IF NOT EXISTS parts (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id          UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id         UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code               TEXT NOT NULL,
  name               TEXT NOT NULL,
  description        TEXT,
  lead_funder        TEXT NOT NULL,
  budget_allocation  NUMERIC(14, 2),
  start_date         DATE,
  end_date           DATE,
  status             TEXT NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active', 'paused', 'closed')),
  sort_order         INT NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, code)
);

CREATE INDEX IF NOT EXISTS parts_tenant_idx          ON parts(tenant_id);
CREATE INDEX IF NOT EXISTS parts_project_idx         ON parts(project_id);
CREATE INDEX IF NOT EXISTS parts_project_status_idx  ON parts(project_id, status);

-- ---- Deliverables ----

CREATE TABLE IF NOT EXISTS deliverables (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id        UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  part_id           UUID REFERENCES parts(id) ON DELETE SET NULL,
  code              TEXT NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  owner             TEXT,
  due_date          DATE,
  status            TEXT NOT NULL DEFAULT 'On track'
                    CHECK (status IN ('At risk', 'On track', 'Complete', 'Delayed', 'Future')),
  percent_complete  INT NOT NULL DEFAULT 0 CHECK (percent_complete BETWEEN 0 AND 100),
  payment           NUMERIC(14, 2),
  funder            TEXT,
  evidence_url      TEXT,
  notes             TEXT,
  sort_order        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, code)
);

CREATE INDEX IF NOT EXISTS deliverables_tenant_idx          ON deliverables(tenant_id);
CREATE INDEX IF NOT EXISTS deliverables_project_status_idx  ON deliverables(project_id, status);
CREATE INDEX IF NOT EXISTS deliverables_part_idx            ON deliverables(part_id);

-- ---- Growers ----

CREATE TABLE IF NOT EXISTS growers (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  part_id             UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  external_ref        INT NOT NULL,
  full_name           TEXT NOT NULL,
  farm_name           TEXT,
  district            TEXT,
  region              TEXT,
  coordinator         TEXT,
  phone               TEXT,
  email               TEXT,
  id_number           TEXT,
  seedlings_planned   INT NOT NULL DEFAULT 0,
  seedlings_received  INT NOT NULL DEFAULT 0,
  delivery_gap        INT NOT NULL DEFAULT 0,
  planned_ha          NUMERIC(14, 4) NOT NULL DEFAULT 0,
  mapped_ha           NUMERIC(14, 4) NOT NULL DEFAULT 0,
  theoretical_ha      NUMERIC(14, 4) NOT NULL DEFAULT 0,
  outlier_flag        BOOLEAN NOT NULL DEFAULT FALSE,
  enrolled_at         TIMESTAMPTZ,
  status              TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'inactive', 'dropped')),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, external_ref)
);

CREATE INDEX IF NOT EXISTS growers_tenant_idx          ON growers(tenant_id);
CREATE INDEX IF NOT EXISTS growers_part_idx            ON growers(part_id);
CREATE INDEX IF NOT EXISTS growers_project_status_idx  ON growers(project_id, status);

-- ---- Disbursements ----

CREATE TABLE IF NOT EXISTS disbursements (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id            UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  part_id               UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  grower_id             UUID NOT NULL REFERENCES growers(id) ON DELETE CASCADE,
  funded_ha             NUMERIC(14, 4) NOT NULL DEFAULT 0,
  rate_mechanisation    NUMERIC(14, 2) NOT NULL DEFAULT 7350.00,
  rate_labour           NUMERIC(14, 2) NOT NULL DEFAULT 3618.72,
  amount_mechanisation  NUMERIC(14, 2) NOT NULL DEFAULT 0,
  amount_labour         NUMERIC(14, 2) NOT NULL DEFAULT 0,
  amount_total          NUMERIC(14, 2) NOT NULL DEFAULT 0,
  status                TEXT NOT NULL DEFAULT 'Pending'
                        CHECK (status IN ('Pending', 'Approved', 'Paid', 'On hold')),
  paid_at               TIMESTAMPTZ,
  evidence_url          TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS disbursements_tenant_idx        ON disbursements(tenant_id);
CREATE INDEX IF NOT EXISTS disbursements_part_status_idx   ON disbursements(part_id, status);
CREATE INDEX IF NOT EXISTS disbursements_grower_idx        ON disbursements(grower_id);

-- ---- Disbursement Sign-offs ----

CREATE TABLE IF NOT EXISTS disbursement_signoffs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  disbursement_id     UUID NOT NULL REFERENCES disbursements(id) ON DELETE CASCADE,
  grower_id           UUID NOT NULL REFERENCES growers(id) ON DELETE CASCADE,
  signoff_status      TEXT NOT NULL DEFAULT 'Awaiting'
                      CHECK (signoff_status IN ('Awaiting', 'Disputed', 'Signed', 'Withdrawn')),
  signed_at           TIMESTAMPTZ,
  witness_name        TEXT,
  witness_email       TEXT,
  signature_ref       TEXT,
  notes_from_grower   TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS disbursement_signoffs_tenant_idx        ON disbursement_signoffs(tenant_id);
CREATE INDEX IF NOT EXISTS disbursement_signoffs_disbursement_idx  ON disbursement_signoffs(disbursement_id);
CREATE INDEX IF NOT EXISTS disbursement_signoffs_grower_status_idx ON disbursement_signoffs(grower_id, signoff_status);

-- ---- RLS ----

ALTER TABLE parts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables           ENABLE ROW LEVEL SECURITY;
ALTER TABLE growers                ENABLE ROW LEVEL SECURITY;
ALTER TABLE disbursements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE disbursement_signoffs  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS parts_tenant_isolation ON parts;
CREATE POLICY parts_tenant_isolation ON parts
  USING (tenant_id = current_tenant())
  WITH CHECK (tenant_id = current_tenant());

DROP POLICY IF EXISTS deliverables_tenant_isolation ON deliverables;
CREATE POLICY deliverables_tenant_isolation ON deliverables
  USING (tenant_id = current_tenant())
  WITH CHECK (tenant_id = current_tenant());

DROP POLICY IF EXISTS growers_tenant_isolation ON growers;
CREATE POLICY growers_tenant_isolation ON growers
  USING (tenant_id = current_tenant())
  WITH CHECK (tenant_id = current_tenant());

DROP POLICY IF EXISTS disbursements_tenant_isolation ON disbursements;
CREATE POLICY disbursements_tenant_isolation ON disbursements
  USING (tenant_id = current_tenant())
  WITH CHECK (tenant_id = current_tenant());

DROP POLICY IF EXISTS disbursement_signoffs_tenant_isolation ON disbursement_signoffs;
CREATE POLICY disbursement_signoffs_tenant_isolation ON disbursement_signoffs
  USING (tenant_id = current_tenant())
  WITH CHECK (tenant_id = current_tenant());

-- end of 0004_parts_growers_disbursements.sql
