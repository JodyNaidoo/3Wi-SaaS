-- =====================================================================
-- 0010 — Unified Billing (AR ledger) — RECOVERY + AR_ namespace
-- =====================================================================
-- Replaces a prior failed attempt at this file.
-- The Stripe SaaS-billing module already owns the `invoices` table, so
-- the AR transactional tables get the `ar_` prefix:
--   customers              (no prefix — cross-cutting customer master)
--   ar_invoices            (was: invoices)
--   ar_invoice_lines       (was: invoice_line_items)
--   ar_payments            (was: payments)
--   ar_invoice_ageing      (view)
--   ar_customer_balances   (view)
-- =====================================================================

-- ---------------------------------------------------------------------
-- ROLLBACK partial state from any earlier failed run of this file.
-- Safe to run repeatedly; uses IF EXISTS.
-- ---------------------------------------------------------------------
DROP VIEW  IF EXISTS customer_balances    CASCADE;
DROP VIEW  IF EXISTS invoice_ageing       CASCADE;
DROP VIEW  IF EXISTS ar_customer_balances CASCADE;
DROP VIEW  IF EXISTS ar_invoice_ageing    CASCADE;
DROP TABLE IF EXISTS payments             CASCADE;   -- only the AR payments table I may have created
DROP TABLE IF EXISTS ar_payments          CASCADE;
DROP TABLE IF EXISTS invoice_line_items   CASCADE;
DROP TABLE IF EXISTS ar_invoice_lines     CASCADE;
DROP TABLE IF EXISTS customers            CASCADE;
-- Note: `invoices` is intentionally NOT dropped (it's the Stripe SaaS-billing table).

DROP TYPE IF EXISTS customer_type   CASCADE;
DROP TYPE IF EXISTS customer_status CASCADE;
DROP TYPE IF EXISTS invoice_status  CASCADE;
DROP TYPE IF EXISTS payment_method  CASCADE;

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
CREATE TYPE customer_type AS ENUM (
  'external',
  'internal_unit'
);

CREATE TYPE customer_status AS ENUM (
  'active', 'pipeline', 'paused', 'churned'
);

CREATE TYPE invoice_status AS ENUM (
  'draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'void'
);

CREATE TYPE payment_method AS ENUM (
  'bank_transfer', 'cash', 'mobile', 'card', 'cheque', 'intercompany_netting', 'other'
);

-- ---------------------------------------------------------------------
-- CUSTOMERS (group-wide customer master)
-- ---------------------------------------------------------------------
CREATE TABLE customers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_type       customer_type NOT NULL DEFAULT 'external',
  internal_unit_slug  TEXT,
  display_name        TEXT NOT NULL,
  company_name        TEXT,
  given_name          TEXT,
  family_name         TEXT,
  title               TEXT,
  primary_email       TEXT NOT NULL,
  primary_phone       TEXT,
  mobile              TEXT,
  website             TEXT,
  bill_line1          TEXT,
  bill_line2          TEXT,
  bill_city           TEXT,
  bill_province       TEXT,
  bill_postal         TEXT,
  bill_country        TEXT DEFAULT 'South Africa',
  ship_line1          TEXT,
  ship_line2          TEXT,
  ship_city           TEXT,
  ship_province       TEXT,
  ship_postal         TEXT,
  ship_country        TEXT,
  taxable             BOOLEAN NOT NULL DEFAULT TRUE,
  vat_number          TEXT,
  company_reg_number  TEXT,
  bbbee_level         TEXT,
  currency            TEXT NOT NULL DEFAULT 'ZAR',
  payment_terms       TEXT NOT NULL DEFAULT 'Net 30',
  status              customer_status NOT NULL DEFAULT 'active',
  industry            TEXT,
  account_manager     TEXT,
  notes               TEXT,
  qbo_customer_id     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id  UUID REFERENCES users(id),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_customers_tenant    ON customers(tenant_id);
CREATE INDEX idx_customers_type      ON customers(customer_type);
CREATE INDEX idx_customers_status    ON customers(status);
CREATE INDEX idx_customers_qbo       ON customers(qbo_customer_id) WHERE qbo_customer_id IS NOT NULL;
CREATE INDEX idx_customers_unit_slug ON customers(internal_unit_slug) WHERE internal_unit_slug IS NOT NULL;

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_isolation ON customers
  USING (tenant_id::text = current_setting('app.tenant_id', true));

-- ---------------------------------------------------------------------
-- AR_INVOICES (group-wide AR ledger — every unit posts here)
-- ---------------------------------------------------------------------
CREATE TABLE ar_invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number      TEXT NOT NULL,
  provider_unit_slug  TEXT NOT NULL,
  customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  is_intercompany     BOOLEAN NOT NULL DEFAULT FALSE,
  issue_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date            DATE NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'ZAR',
  subtotal_zar        NUMERIC(14,2) NOT NULL DEFAULT 0,
  vat_amount_zar      NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_zar           NUMERIC(14,2) NOT NULL DEFAULT 0,
  amount_paid_zar     NUMERIC(14,2) NOT NULL DEFAULT 0,
  balance_due_zar     NUMERIC(14,2) GENERATED ALWAYS AS (total_zar - amount_paid_zar) STORED,
  status              invoice_status NOT NULL DEFAULT 'draft',
  sent_at             TIMESTAMPTZ,
  viewed_at           TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  notes               TEXT,
  internal_notes      TEXT,
  engagement_id       UUID REFERENCES engagements(id) ON DELETE SET NULL,
  qbo_invoice_id      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id  UUID REFERENCES users(id),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, invoice_number)
);

CREATE INDEX idx_ar_invoices_tenant   ON ar_invoices(tenant_id);
CREATE INDEX idx_ar_invoices_customer ON ar_invoices(customer_id);
CREATE INDEX idx_ar_invoices_provider ON ar_invoices(provider_unit_slug);
CREATE INDEX idx_ar_invoices_status   ON ar_invoices(status);
CREATE INDEX idx_ar_invoices_intercmp ON ar_invoices(is_intercompany) WHERE is_intercompany = TRUE;
CREATE INDEX idx_ar_invoices_due      ON ar_invoices(due_date) WHERE status NOT IN ('paid','void');

ALTER TABLE ar_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY ar_invoices_isolation ON ar_invoices
  USING (tenant_id::text = current_setting('app.tenant_id', true));

-- ---------------------------------------------------------------------
-- AR_INVOICE_LINES
-- ---------------------------------------------------------------------
CREATE TABLE ar_invoice_lines (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id          UUID NOT NULL REFERENCES ar_invoices(id) ON DELETE CASCADE,
  service_code        TEXT,
  description         TEXT NOT NULL,
  quantity            NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit                TEXT,
  unit_price_zar      NUMERIC(12,2) NOT NULL,
  line_total_zar      NUMERIC(14,2) GENERATED ALWAYS AS (quantity * unit_price_zar) STORED,
  vat_rate_pct        NUMERIC(5,2) NOT NULL DEFAULT 15.0,
  sort_order          INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ar_invoice_lines_invoice ON ar_invoice_lines(invoice_id);

-- ---------------------------------------------------------------------
-- AR_PAYMENTS
-- ---------------------------------------------------------------------
CREATE TABLE ar_payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id          UUID NOT NULL REFERENCES ar_invoices(id) ON DELETE CASCADE,
  payment_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_zar          NUMERIC(14,2) NOT NULL,
  method              payment_method NOT NULL DEFAULT 'bank_transfer',
  reference           TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id  UUID REFERENCES users(id)
);

CREATE INDEX idx_ar_payments_tenant  ON ar_payments(tenant_id);
CREATE INDEX idx_ar_payments_invoice ON ar_payments(invoice_id);

ALTER TABLE ar_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY ar_payments_isolation ON ar_payments
  USING (tenant_id::text = current_setting('app.tenant_id', true));

-- ---------------------------------------------------------------------
-- VIEW: ar_invoice_ageing
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW ar_invoice_ageing AS
SELECT
  i.id,
  i.tenant_id,
  i.invoice_number,
  i.provider_unit_slug,
  i.customer_id,
  c.display_name AS customer_name,
  i.total_zar,
  i.balance_due_zar,
  i.due_date,
  i.status,
  CASE
    WHEN i.status IN ('paid','void') THEN 'closed'
    WHEN i.due_date >= CURRENT_DATE THEN 'current'
    WHEN i.due_date >= CURRENT_DATE - INTERVAL '30 days' THEN '1-30 days'
    WHEN i.due_date >= CURRENT_DATE - INTERVAL '60 days' THEN '31-60 days'
    WHEN i.due_date >= CURRENT_DATE - INTERVAL '90 days' THEN '61-90 days'
    ELSE '90+ days'
  END AS ageing_bucket,
  GREATEST(0, CURRENT_DATE - i.due_date) AS days_overdue
FROM ar_invoices i
JOIN customers c ON c.id = i.customer_id;

-- ---------------------------------------------------------------------
-- VIEW: ar_customer_balances (per-customer total owing)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW ar_customer_balances AS
SELECT
  c.id AS customer_id,
  c.tenant_id,
  c.display_name,
  c.customer_type,
  COUNT(i.id) FILTER (WHERE i.status NOT IN ('paid','void')) AS open_invoice_count,
  COALESCE(SUM(i.balance_due_zar) FILTER (WHERE i.status NOT IN ('paid','void')), 0) AS total_owing_zar,
  COALESCE(SUM(i.balance_due_zar) FILTER (WHERE i.due_date < CURRENT_DATE AND i.status NOT IN ('paid','void')), 0) AS overdue_zar,
  MAX(i.issue_date)  AS last_invoice_date,
  MAX(p.payment_date) AS last_payment_date
FROM customers c
LEFT JOIN ar_invoices i ON i.customer_id = c.id
LEFT JOIN ar_payments p ON p.invoice_id = i.id
GROUP BY c.id, c.tenant_id, c.display_name, c.customer_type;
