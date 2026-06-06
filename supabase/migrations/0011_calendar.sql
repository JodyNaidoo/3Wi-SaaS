-- =====================================================================
-- 0011 — Master Calendar (cross-function scheduling)
-- =====================================================================
-- ONE event table for everything scheduled across the group:
--   - Recurring outputs (monthly bookkeeping, weekly content posts)
--   - Deadlines (ECRDA reports, SAQA submissions, tax filings)
--   - Meetings + workshops + training sessions
--   - Campaign launches + content publish slots
--   - Internal milestones (engagement gates, sprint reviews)
-- =====================================================================

-- Idempotent: drop any partial state from earlier failed runs
DROP VIEW  IF EXISTS upcoming_events  CASCADE;
DROP TABLE IF EXISTS calendar_events  CASCADE;
DROP TYPE  IF EXISTS event_type       CASCADE;
DROP TYPE  IF EXISTS event_status     CASCADE;

CREATE TYPE event_type AS ENUM (
  'deliverable',      -- something we owe (e.g. monthly performance report)
  'deadline',         -- external deadline (e.g. SARS submission)
  'meeting',          -- internal or client meeting
  'milestone',        -- engagement / project gate
  'training',         -- scheduled training session
  'campaign_launch',  -- marketing campaign go-live
  'content_publish',  -- scheduled content post
  'recurring',        -- generic recurring event
  'other'
);

CREATE TYPE event_status AS ENUM (
  'planned',
  'in_progress',
  'completed',
  'cancelled',
  'overdue'
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- categorisation
  title               TEXT NOT NULL,
  type                event_type NOT NULL DEFAULT 'other',
  status              event_status NOT NULL DEFAULT 'planned',

  -- ownership / context
  provider_unit_slug  TEXT,                      -- which 3Wi unit owns this event
  customer_id         UUID REFERENCES customers(id) ON DELETE SET NULL,
  engagement_id       UUID REFERENCES engagements(id) ON DELETE SET NULL,
  invoice_id          UUID REFERENCES ar_invoices(id) ON DELETE SET NULL,

  -- timing
  start_at            TIMESTAMPTZ NOT NULL,
  end_at              TIMESTAMPTZ,
  all_day             BOOLEAN NOT NULL DEFAULT FALSE,
  timezone            TEXT NOT NULL DEFAULT 'Africa/Johannesburg',

  -- recurrence (RFC 5545 RRULE - empty if single)
  is_recurring        BOOLEAN NOT NULL DEFAULT FALSE,
  recurring_rule      TEXT,                      -- e.g. 'FREQ=MONTHLY;BYMONTHDAY=5'
  recurring_until     TIMESTAMPTZ,

  -- people
  owner_user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  assignee_emails     TEXT[],

  -- detail
  description         TEXT,
  location            TEXT,                      -- physical or virtual (Zoom link)
  url                 TEXT,                      -- meeting link / doc link

  -- audit
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id  UUID REFERENCES users(id),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_calendar_tenant       ON calendar_events(tenant_id);
CREATE INDEX idx_calendar_start        ON calendar_events(start_at);
CREATE INDEX idx_calendar_provider     ON calendar_events(provider_unit_slug);
CREATE INDEX idx_calendar_customer     ON calendar_events(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX idx_calendar_engagement   ON calendar_events(engagement_id) WHERE engagement_id IS NOT NULL;
CREATE INDEX idx_calendar_type         ON calendar_events(type);
CREATE INDEX idx_calendar_status       ON calendar_events(status);
CREATE INDEX idx_calendar_owner        ON calendar_events(owner_user_id) WHERE owner_user_id IS NOT NULL;

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY calendar_isolation ON calendar_events
  USING (tenant_id::text = current_setting('app.tenant_id', true));

-- =====================================================================
-- VIEW: upcoming events for "today" + next 7 days
-- =====================================================================
CREATE OR REPLACE VIEW upcoming_events AS
SELECT
  e.*,
  c.display_name AS customer_name,
  CASE
    WHEN e.start_at::date = CURRENT_DATE THEN 'today'
    WHEN e.start_at::date = CURRENT_DATE + 1 THEN 'tomorrow'
    WHEN e.start_at::date <= CURRENT_DATE + 7 THEN 'this_week'
    WHEN e.start_at::date <= CURRENT_DATE + 30 THEN 'this_month'
    ELSE 'later'
  END AS time_bucket
FROM calendar_events e
LEFT JOIN customers c ON c.id = e.customer_id
WHERE e.start_at >= CURRENT_DATE
  AND e.status NOT IN ('completed', 'cancelled')
ORDER BY e.start_at ASC;
