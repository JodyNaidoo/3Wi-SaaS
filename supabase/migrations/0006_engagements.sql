-- =====================================================================
-- 0006 — Engagements (client engagement workflow)
-- =====================================================================
-- Captures the lifecycle of a client engagement against any of the
-- productised shared-service offerings (Brand, Content, Campaigns).
-- One row per engagement. Status flows:
--   requested -> accepted -> in_progress -> delivered -> closed
-- (cancelled is also valid at any point).
--
-- Idempotent: safe to re-run.
-- =====================================================================

CREATE TYPE engagement_status AS ENUM (
  'requested',
  'accepted',
  'in_progress',
  'delivered',
  'closed',
  'cancelled'
);

CREATE TABLE engagements (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Which service was engaged. Free-text for now (slug from KnockoutMarketing.tsx)
  -- to avoid coupling to a services table until we know it's needed.
  service_unit             TEXT NOT NULL,    -- e.g. "knockout-marketing"
  service_slug             TEXT NOT NULL,    -- e.g. "brand-development"
  service_name             TEXT NOT NULL,    -- e.g. "Brand Development"

  -- Client details supplied via intake form
  client_name              TEXT NOT NULL,
  client_company           TEXT,
  client_email             TEXT NOT NULL,
  client_phone             TEXT,

  -- Scope choices captured from the intake form
  scope_summary            TEXT,             -- auto-generated multi-line summary
  scope_choices            JSONB,            -- raw form payload for audit
  budget_indication        TEXT,             -- e.g. "R 50k-R 100k"
  desired_start_date       DATE,
  notes                    TEXT,

  -- Lifecycle
  status                   engagement_status NOT NULL DEFAULT 'requested',
  requested_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at              TIMESTAMPTZ,
  delivered_at             TIMESTAMPTZ,
  closed_at                TIMESTAMPTZ,

  -- Downstream integration refs (filled in by external services later)
  scope_doc_url            TEXT,             -- Google Doc / PDF link
  deposit_invoice_ref      TEXT,             -- QuickBooks invoice number / Stripe invoice ID
  asana_project_id         TEXT,             -- Asana project gid

  -- Provenance
  created_by_user_id       UUID REFERENCES users(id),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX engagements_tenant_status_idx ON engagements (tenant_id, status);
CREATE INDEX engagements_tenant_service_idx ON engagements (tenant_id, service_unit, service_slug);
CREATE INDEX engagements_created_at_idx ON engagements (created_at DESC);

-- Tenant isolation via RLS (matches 0002 pattern)
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY engagements_isolation ON engagements
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_engagements_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER engagements_set_updated_at
  BEFORE UPDATE ON engagements
  FOR EACH ROW
  EXECUTE FUNCTION set_engagements_updated_at();
