-- ============================================================
-- 3Wi PMO Suite — Row Level Security
-- Tenants cannot see each other's data under any circumstances.
--
-- Strategy:
--  - The API connects with a role that does NOT bypass RLS.
--  - On every request the API runs:  set local app.tenant_id = '<uuid>';
--    (See apps/api/src/middleware/tenant.ts)
--  - Every tenant-scoped table has a USING + WITH CHECK policy that
--    requires tenant_id = current_setting('app.tenant_id')::uuid.
--  - For child tables that don't carry tenant_id directly (workstreams,
--    milestones, risks, project_users, help_requests, photo_uploads,
--    gate_audits) we walk to projects to derive tenant_id.
-- ============================================================

-- helper for child tables: extract tenant from project
create or replace function project_tenant(p uuid) returns uuid
language sql stable as $$
  select tenant_id from projects where id = p;
$$;

create or replace function current_tenant() returns uuid
language sql stable as $$
  select nullif(current_setting('app.tenant_id', true), '')::uuid;
$$;

-- ---- enable RLS on all tables ----
alter table tenants         enable row level security;
alter table users           enable row level security;
alter table projects        enable row level security;
alter table workstreams     enable row level security;
alter table milestones      enable row level security;
alter table risks           enable row level security;
alter table project_users   enable row level security;
alter table help_requests   enable row level security;
alter table photo_uploads   enable row level security;
alter table gate_audits     enable row level security;
alter table reports         enable row level security;
alter table ai_prompts      enable row level security;
alter table subscriptions   enable row level security;
alter table invoices        enable row level security;
alter table audit_log       enable row level security;

-- ---- tenants: a tenant can only see its own row ----
drop policy if exists tenants_isolation on tenants;
create policy tenants_isolation on tenants
  using (id = current_tenant())
  with check (id = current_tenant());

-- ---- direct-tenant tables ----
do $$
declare t text;
begin
  foreach t in array array['users','projects','reports','ai_prompts','subscriptions','invoices','audit_log']
  loop
    execute format('drop policy if exists %I_isolation on %I', t, t);
    execute format(
      'create policy %I_isolation on %I using (tenant_id = current_tenant()) with check (tenant_id = current_tenant())',
      t, t
    );
  end loop;
end$$;

-- ---- project-child tables: tenant derived via projects ----
do $$
declare t text;
begin
  foreach t in array array['workstreams','milestones','risks','project_users',
                            'help_requests','photo_uploads','gate_audits']
  loop
    execute format('drop policy if exists %I_isolation on %I', t, t);
    execute format(
      'create policy %I_isolation on %I using (project_tenant(project_id) = current_tenant()) with check (project_tenant(project_id) = current_tenant())',
      t, t
    );
  end loop;
end$$;

-- ---- public demo bypass: a separate role / view layer can read the
--       designated demo tenant for the marketing site. We do NOT grant
--       that here; expose only via dedicated read-only views in app code. ----
