-- =====================================================================
-- 0013 — Seed: IBS Engagement v1 (template + 6 phases + 32 activities)
-- =====================================================================
-- Idempotent: safe to re-run; skips if template already exists.
-- Targets the FIRST tenant by created_at — adjust if you need a specific one.
-- =====================================================================

DO $seed$
DECLARE
  v_tenant_id          UUID;
  v_template_id        UUID;
  v_p_discovery        UUID;
  v_p_proposal         UUID;
  v_p_contracting      UUID;
  v_p_inception        UUID;
  v_p_coordination     UUID;
  v_p_reporting        UUID;
BEGIN
  SELECT id INTO v_tenant_id FROM tenants ORDER BY created_at LIMIT 1;
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'No tenants found — cannot seed';
  END IF;

  IF EXISTS (
    SELECT 1 FROM workflow_templates
    WHERE tenant_id = v_tenant_id AND slug = 'ibs-engagement-v1' AND version = 'v1'
  ) THEN
    RAISE NOTICE 'IBS Engagement v1 already seeded — skipping';
    RETURN;
  END IF;

  -- TEMPLATE ----------------------------------------------------------------
  v_template_id := gen_random_uuid();
  INSERT INTO workflow_templates (
    id, tenant_id, name, slug, description, version, owner_unit_slug, is_active, metadata
  ) VALUES (
    v_template_id, v_tenant_id, 'IBS Engagement v1', 'ibs-engagement-v1',
    '4-phase consulting engagement — Discovery -> Proposal -> Contracting -> Execution. Used by IBS Consulting for all client engagements.',
    'v1', 'ibs-consulting', TRUE,
    '{"pricing_tiers":["A_strategic_partner","B_fixed_engagement","C_tactical_sprint"],"academy_doc":"docs/IBS_Engagement_Playbook_v1.md"}'::jsonb
  );

  -- PHASES ------------------------------------------------------------------
  v_p_discovery    := gen_random_uuid();
  v_p_proposal     := gen_random_uuid();
  v_p_contracting  := gen_random_uuid();
  v_p_inception    := gen_random_uuid();
  v_p_coordination := gen_random_uuid();
  v_p_reporting    := gen_random_uuid();

  INSERT INTO workflow_template_phases (id, template_id, code, name, description, sort_order) VALUES
    (v_p_discovery,    v_template_id, 'discovery',    'Discovery',    'Understand the client problem; decide whether to proceed; choose tier.', 1),
    (v_p_proposal,     v_template_id, 'proposal',     'Proposal',     'Design solution, map to workstreams, price, document, present.',        2),
    (v_p_contracting,  v_template_id, 'contracting',  'Contracting',  'Negotiate + sign + open the engagement in SaaS.',                        3),
    (v_p_inception,    v_template_id, 'inception',    'Inception',    'Inception report + reporting cadence setup + PSC formation.',           4),
    (v_p_coordination, v_template_id, 'coordination', 'Coordination', 'Day-to-day workstream execution; coordinator-led; agents do heavy work.', 5),
    (v_p_reporting,    v_template_id, 'reporting',    'Reporting',    'Monthly + ad-hoc + dashboards; AI agents generate, coord curates.',     6);

  -- ACTIVITIES --------------------------------------------------------------
  -- PHASE 1: Discovery (6)
  INSERT INTO workflow_template_activities
    (phase_id, name, description, sort_order, responsible_role, accountable_role, consulted_roles, informed_roles,
     est_hours_director, est_hours_coordinator, est_agent_runs, output_artifact, ai_agent_slug, requires_director_signoff)
  VALUES
    (v_p_discovery, 'Inbound enquiry triage', 'Categorise the enquiry; apply wheelhouse Q1 from Discovery decision tree.', 1,
     'coordinator', 'director', '{}', '{client}', 0.25, 0.5, 0, 'Triage note in CRM', NULL, FALSE),
    (v_p_discovery, 'First strategic call', 'Jody-led discovery call with client. Capture problem in client''s own words.', 2,
     'director', 'director', '{coordinator,client}', '{}', 1.0, 0.5, 0, 'Call notes + recording', NULL, TRUE),
    (v_p_discovery, 'Client research', 'Industry context, recent news, key people, financial signals.', 3,
     'agent', 'coordinator', '{}', '{director}', 0, 1.0, 1, 'Client research brief', 'stakeholder', FALSE),
    (v_p_discovery, 'Stakeholder map', 'Identify decision-makers, influencers, and gatekeepers in client org.', 4,
     'agent', 'coordinator', '{director,client}', '{}', 0.25, 1.0, 1, 'Stakeholder map (RACI-style)', 'stakeholder', FALSE),
    (v_p_discovery, 'Problem statement draft', 'Consolidate into a 1-page Problem Brief.', 5,
     'coordinator', 'coordinator', '{director,client}', '{}', 0.5, 2.0, 1, 'Problem Brief v1', NULL, FALSE),
    (v_p_discovery, 'Final problem brief sign-off', 'Jody approves; sent to client for confirmation.', 6,
     'director', 'director', '{}', '{client}', 0.5, 0.25, 0, 'Signed-off Problem Brief', NULL, TRUE);

  -- PHASE 2: Proposal (8)
  INSERT INTO workflow_template_activities
    (phase_id, name, description, sort_order, responsible_role, accountable_role, consulted_roles, informed_roles,
     est_hours_director, est_hours_coordinator, est_agent_runs, output_artifact, ai_agent_slug, requires_director_signoff)
  VALUES
    (v_p_proposal, 'Workstream selection from Rainmaker catalogue', 'Pick functional units (Marketing, Accounting, etc.) that map to the problem.', 1,
     'coordinator', 'agent', '{director}', '{}', 0.5, 1.0, 1, 'Workstream list with rationale', NULL, FALSE),
    (v_p_proposal, 'Custom IBS-IP workstream design', 'Where stock Rainmaker doesn''t fit, design custom workstream from IBS IP.', 2,
     'director', 'director', '{coordinator}', '{}', 2.0, 0.5, 0, 'Custom workstream definition', NULL, TRUE),
    (v_p_proposal, 'Resource plan (people × hours)', 'Estimate Jody hours + coordinator hours + agent runs per workstream.', 3,
     'coordinator', 'director', '{}', '{}', 0.5, 2.0, 0, 'Resource plan table', NULL, FALSE),
    (v_p_proposal, 'KPI definition per workstream', 'Define what success looks like — measurable, time-bound, billable.', 4,
     'coordinator', 'agent', '{director}', '{}', 0.5, 1.5, 1, 'KPI grid', NULL, FALSE),
    (v_p_proposal, 'Cost budget assembly', 'Calculate fees against resource plan + margin + tier minimums.', 5,
     'coordinator', 'director', '{}', '{}', 0.5, 1.5, 0, 'Budget spreadsheet', NULL, FALSE),
    (v_p_proposal, 'Pricing tier decision', 'Apply Tier A/B/C decision tree from playbook.', 6,
     'director', 'director', '{}', '{}', 0.5, 0, 0, 'Tier decision + rationale (note in SaaS)', NULL, TRUE),
    (v_p_proposal, 'Proposal document drafting', 'Assemble proposal from template: cover, brief, approach, workstreams, KPIs, fees, timeline.', 7,
     'coordinator', 'agent', '{director}', '{}', 1.0, 4.0, 2, 'Proposal PDF v1', 'mov-pack', FALSE),
    (v_p_proposal, 'Final proposal sign-off + send', 'Jody reviews, signs, coordinator emails to client.', 8,
     'director', 'director', '{}', '{client}', 1.0, 0.5, 0, 'Sent proposal + email receipt', NULL, TRUE);

  -- PHASE 3: Contracting (4)
  INSERT INTO workflow_template_activities
    (phase_id, name, description, sort_order, responsible_role, accountable_role, consulted_roles, informed_roles,
     est_hours_director, est_hours_coordinator, est_agent_runs, output_artifact, ai_agent_slug, requires_director_signoff)
  VALUES
    (v_p_contracting, 'Contract drafting (from template)', 'Use IBS contract template; populate scope + fees + milestones from proposal.', 1,
     'agent', 'coordinator', '{}', '{director}', 0, 1.0, 1, 'Contract v1 PDF', NULL, FALSE),
    (v_p_contracting, 'Negotiation rounds', 'Address client redlines; escalate unusual terms to Jody.', 2,
     'director', 'director', '{coordinator,client}', '{}', 1.5, 1.0, 0, 'Negotiation log + final contract', NULL, TRUE),
    (v_p_contracting, 'Final contract sign-off', 'Both parties sign per sign-authority rules.', 3,
     'director', 'director', '{}', '{client}', 0.5, 0.5, 0, 'Fully-signed contract', NULL, TRUE),
    (v_p_contracting, 'Engagement kickoff in SaaS', 'Coord creates engagement in SaaS: tenant, login, workflow instance.', 4,
     'coordinator', 'coordinator', '{}', '{director}', 0, 1.0, 1, 'Live engagement in SaaS', NULL, FALSE);

  -- PHASE 4.1: Inception (4)
  INSERT INTO workflow_template_activities
    (phase_id, name, description, sort_order, responsible_role, accountable_role, consulted_roles, informed_roles,
     est_hours_director, est_hours_coordinator, est_agent_runs, output_artifact, ai_agent_slug, requires_director_signoff)
  VALUES
    (v_p_inception, 'Inception report drafting', 'AI-assembled inception doc: scope confirmation, plan, risks, success criteria.', 1,
     'coordinator', 'agent', '{director}', '{}', 0.5, 3.0, 2, 'Inception Report PDF', 'mov-pack', FALSE),
    (v_p_inception, 'Reporting cadence setup', 'Schedule monthly/quarterly templates in SaaS calendar; agree with client.', 2,
     'coordinator', 'coordinator', '{client}', '{}', 0.25, 1.5, 1, 'Reporting schedule', NULL, FALSE),
    (v_p_inception, 'PSC formation + first meeting', 'Jody chairs first Project Steering Committee.', 3,
     'director', 'director', '{coordinator,client}', '{}', 2.0, 1.0, 0, 'PSC charter + minutes', NULL, TRUE),
    (v_p_inception, 'Sign-off on plan', 'Client signs off inception report and reporting cadence.', 4,
     'director', 'director', '{}', '{client}', 0.5, 0.25, 0, 'Signed inception report', NULL, TRUE);

  -- PHASE 4.2: Coordination (5)
  INSERT INTO workflow_template_activities
    (phase_id, name, description, sort_order, responsible_role, accountable_role, consulted_roles, informed_roles,
     est_hours_director, est_hours_coordinator, est_agent_runs, output_artifact, ai_agent_slug, requires_director_signoff)
  VALUES
    (v_p_coordination, 'Workstream-level execution (monthly cycle)', 'Each workstream runs its own agent + coord cycle.', 1,
     'agent', 'coordinator', '{client}', '{director}', 0, 20.0, 30, 'Workstream outputs', NULL, FALSE),
    (v_p_coordination, 'Reporting template maintenance', 'Tweak templates as KPIs evolve or new data sources appear.', 2,
     'coordinator', 'coordinator', '{director}', '{}', 0.25, 2.0, 1, 'Updated report templates', NULL, FALSE),
    (v_p_coordination, 'Workflow dashboard mgmt', 'Keep dashboards current; respond to data-quality issues.', 3,
     'coordinator', 'coordinator', '{}', '{director,client}', 0, 4.0, 5, 'Live dashboards', NULL, FALSE),
    (v_p_coordination, 'Day-to-day client comms', 'Coord owns inbox + Slack/Teams; CC Jody on substantive items.', 4,
     'coordinator', 'coordinator', '{director,client}', '{}', 0.5, 8.0, 2, 'Client comms log', NULL, FALSE),
    (v_p_coordination, 'Exception escalation', 'Coord flags via SaaS button; Jody triages within 24hr.', 5,
     'director', 'director', '{coordinator}', '{}', 1.0, 0.25, 0, 'Resolved exception log', NULL, FALSE);

  -- PHASE 4.3: Reporting (5)
  INSERT INTO workflow_template_activities
    (phase_id, name, description, sort_order, responsible_role, accountable_role, consulted_roles, informed_roles,
     est_hours_director, est_hours_coordinator, est_agent_runs, output_artifact, ai_agent_slug, requires_director_signoff)
  VALUES
    (v_p_reporting, 'Monthly Ops Report', 'AI-generated monthly progress + KPIs + risks.', 1,
     'coordinator', 'agent', '{director,client}', '{}', 0.5, 3.0, 4, 'Monthly Ops PDF + email', 'monthly-ops', FALSE),
    (v_p_reporting, 'Quarterly PSC Pack', 'Comprehensive quarterly review for PSC meeting.', 2,
     'coordinator', 'agent', '{director,client}', '{}', 1.5, 6.0, 6, 'Quarterly PSC Pack PDF', 'quarterly', TRUE),
    (v_p_reporting, 'Incident reports (as occur)', 'When something unexpected happens, generate incident report within 24hr.', 3,
     'coordinator', 'agent', '{director}', '{client}', 0.5, 1.5, 2, 'Incident Report', 'risk-update', TRUE),
    (v_p_reporting, 'Aggregate-vs-benchmark', 'Comparing client performance to industry benchmarks (quarterly).', 4,
     'coordinator', 'agent', '{director}', '{client}', 0.5, 2.0, 3, 'Benchmark comparison report', 'stakeholder', FALSE),
    (v_p_reporting, 'Client review meetings (quarterly)', 'Jody attends; coordinator runs the slides.', 5,
     'director', 'director', '{coordinator,client}', '{}', 2.0, 2.0, 0, 'Meeting minutes + actions', NULL, TRUE);

  RAISE NOTICE 'IBS Engagement v1 seeded for tenant %', v_tenant_id;
END $seed$;
