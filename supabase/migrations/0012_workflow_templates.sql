-- =====================================================================
-- 0012 — Workflow Templates + Instances (Path 2 foundation)
-- =====================================================================
DROP TABLE IF EXISTS workflow_instance_activities CASCADE;
DROP TABLE IF EXISTS workflow_instances            CASCADE;
DROP TABLE IF EXISTS workflow_template_activities  CASCADE;
DROP TABLE IF EXISTS workflow_template_phases      CASCADE;
DROP TABLE IF EXISTS workflow_templates            CASCADE;
DROP TYPE  IF EXISTS workflow_instance_status      CASCADE;
DROP TYPE  IF EXISTS workflow_activity_status      CASCADE;
DROP TYPE  IF EXISTS pricing_tier                  CASCADE;

CREATE TYPE workflow_instance_status AS ENUM (
  'discovery','proposal','contracting','inception',
  'execution','complete','cancelled','on_hold'
);
CREATE TYPE workflow_activity_status AS ENUM (
  'pending','in_progress','awaiting_review',
  'complete','blocked','escalated','skipped'
);
CREATE TYPE pricing_tier AS ENUM (
  'A_strategic_partner','B_fixed_engagement','C_tactical_sprint'
);

CREATE TABLE workflow_templates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL,
  description         TEXT,
  version             TEXT NOT NULL DEFAULT 'v1',
  owner_unit_slug     TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  metadata            JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id  UUID REFERENCES users(id),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, slug, version)
);
CREATE INDEX idx_workflow_templates_tenant ON workflow_templates(tenant_id);
CREATE INDEX idx_workflow_templates_active ON workflow_templates(tenant_id, is_active);
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY wf_templates_isolation ON workflow_templates
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE workflow_template_phases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   UUID NOT NULL REFERENCES workflow_templates(id) ON DELETE CASCADE,
  code          TEXT NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  UNIQUE (template_id, code)
);
CREATE INDEX idx_wf_template_phases_template ON workflow_template_phases(template_id);

CREATE TABLE workflow_template_activities (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id                  UUID NOT NULL REFERENCES workflow_template_phases(id) ON DELETE CASCADE,
  name                      TEXT NOT NULL,
  description               TEXT,
  sort_order                INT NOT NULL DEFAULT 0,
  responsible_role          TEXT,
  accountable_role          TEXT,
  consulted_roles           TEXT[] DEFAULT '{}',
  informed_roles            TEXT[] DEFAULT '{}',
  est_hours_director        NUMERIC(5,2) DEFAULT 0,
  est_hours_coordinator     NUMERIC(5,2) DEFAULT 0,
  est_agent_runs            INT DEFAULT 0,
  output_artifact           TEXT,
  ai_agent_slug             TEXT,
  requires_director_signoff BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_wf_template_activities_phase ON workflow_template_activities(phase_id);

CREATE TABLE workflow_instances (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_id         UUID NOT NULL REFERENCES workflow_templates(id) ON DELETE RESTRICT,
  customer_id         UUID REFERENCES customers(id) ON DELETE SET NULL,
  name                TEXT NOT NULL,
  pricing_tier        pricing_tier,
  status              workflow_instance_status NOT NULL DEFAULT 'discovery',
  current_phase_code  TEXT,
  value_zar           NUMERIC(14,2) DEFAULT 0,
  started_at          TIMESTAMPTZ,
  due_at              TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_user_id  UUID REFERENCES users(id),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_wf_instances_tenant   ON workflow_instances(tenant_id);
CREATE INDEX idx_wf_instances_customer ON workflow_instances(customer_id);
CREATE INDEX idx_wf_instances_status   ON workflow_instances(status);
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
CREATE POLICY wf_instances_isolation ON workflow_instances
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE workflow_instance_activities (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id              UUID NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
  template_activity_id     UUID NOT NULL REFERENCES workflow_template_activities(id) ON DELETE RESTRICT,
  assigned_user_id         UUID REFERENCES users(id),
  status                   workflow_activity_status NOT NULL DEFAULT 'pending',
  started_at               TIMESTAMPTZ,
  due_at                   TIMESTAMPTZ,
  completed_at             TIMESTAMPTZ,
  output_data              JSONB DEFAULT '{}'::jsonb,
  notes                    TEXT,
  escalated_to_director    BOOLEAN NOT NULL DEFAULT FALSE,
  escalation_reason        TEXT,
  director_signed_off      BOOLEAN NOT NULL DEFAULT FALSE,
  director_signoff_at      TIMESTAMPTZ,
  director_signoff_by      UUID REFERENCES users(id),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_wf_inst_act_instance  ON workflow_instance_activities(instance_id);
CREATE INDEX idx_wf_inst_act_assignee  ON workflow_instance_activities(assigned_user_id);
CREATE INDEX idx_wf_inst_act_status    ON workflow_instance_activities(status);
CREATE INDEX idx_wf_inst_act_escalated ON workflow_instance_activities(escalated_to_director) WHERE escalated_to_director = TRUE;

CREATE OR REPLACE VIEW coordinator_queue AS
SELECT ia.id AS activity_id, ia.instance_id, i.name AS engagement_name, i.tenant_id,
       c.display_name AS customer_name, ta.name AS activity_name, p.name AS phase_name,
       p.code AS phase_code, ia.status, ia.assigned_user_id, ia.due_at,
       ia.escalated_to_director, ta.responsible_role, ta.ai_agent_slug
FROM workflow_instance_activities ia
JOIN workflow_instances           i  ON i.id  = ia.instance_id
JOIN workflow_template_activities ta ON ta.id = ia.template_activity_id
JOIN workflow_template_phases     p  ON p.id  = ta.phase_id
LEFT JOIN customers c ON c.id = i.customer_id
WHERE ia.status IN ('pending','in_progress','blocked','escalated','awaiting_review');

CREATE OR REPLACE VIEW director_approval_queue AS
SELECT ia.id AS activity_id, ia.instance_id, i.name AS engagement_name, i.tenant_id,
       c.display_name AS customer_name, ta.name AS activity_name, ta.output_artifact,
       ia.output_data, ia.notes, ia.completed_at, ia.assigned_user_id
FROM workflow_instance_activities ia
JOIN workflow_instances           i  ON i.id  = ia.instance_id
JOIN workflow_template_activities ta ON ta.id = ia.template_activity_id
LEFT JOIN customers c ON c.id = i.customer_id
WHERE ta.requires_director_signoff = TRUE
  AND ia.status = 'awaiting_review'
  AND ia.director_signed_off = FALSE;
