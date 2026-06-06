-- ============================================================
-- 3Wi PMO Suite — initial schema migration
-- Idempotent enough for first-run; do NOT re-run after deploy.
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------- tenants
create table if not exists tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  brand_color_primary text default '#0F172A',
  brand_color_secondary text default '#0EA5A4',
  brand_color_accent text default '#F59E0B',
  logo_url text,
  subscription_tier text default 'starter',
  stripe_customer_id text unique,
  billing_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ----------------------------------------------------------------- users
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  email text unique,
  phone text unique,
  pin_hash text,
  password_hash text,
  full_name text not null,
  role text not null check (role in ('director','psc','farmer','technical','offtaker','staff')),
  district text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists users_tenant_idx on users(tenant_id);

-- ----------------------------------------------------------------- projects
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  code text not null,
  description text,
  status text default 'active',
  start_date date not null,
  end_date date not null,
  total_budget numeric(14,2) not null,
  funder text not null,
  moa_reference text,
  tagline text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, code)
);
create index if not exists projects_tenant_idx on projects(tenant_id);

-- ----------------------------------------------------------------- workstreams
create table if not exists workstreams (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  code text not null,
  name text not null,
  budget numeric(14,2) not null,
  lead_role text not null,
  colour text default '#0EA5A4',
  icon text default 'Briefcase',
  sort_order int default 0,
  created_at timestamptz default now(),
  unique(project_id, code)
);
create index if not exists workstreams_project_idx on workstreams(project_id);

-- ----------------------------------------------------------------- milestones
create table if not exists milestones (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  workstream_ids uuid[] default '{}',
  code text not null,
  label text not null,
  due_date date not null,
  status text default 'pending',
  completion_pct int default 0,
  payment_amount numeric(14,2),
  gate_evidence jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, code)
);
create index if not exists milestones_project_idx on milestones(project_id);

-- ----------------------------------------------------------------- risks
create table if not exists risks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  code text not null,
  label text not null,
  likelihood int not null check (likelihood between 1 and 5),
  impact int not null check (impact between 1 and 5),
  rag_status text not null check (rag_status in ('green','amber','red')),
  control_action text not null,
  owner text not null,
  pfma_flag boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, code)
);
create index if not exists risks_project_idx on risks(project_id);

-- ----------------------------------------------------------------- project_users
create table if not exists project_users (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  command_centre text not null,
  access_level text default 'read',
  created_at timestamptz default now(),
  unique(project_id, user_id)
);
create index if not exists project_users_project_idx on project_users(project_id);

-- ----------------------------------------------------------------- help_requests
create table if not exists help_requests (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  farmer_user_id uuid not null references users(id) on delete cascade,
  gate text,
  message text not null,
  photo_url text,
  status text default 'open',
  response text,
  responder_id uuid references users(id),
  responded_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists help_requests_project_status_idx on help_requests(project_id, status);

-- ----------------------------------------------------------------- photo_uploads
create table if not exists photo_uploads (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  gate text,
  url text not null,
  geo_lat numeric(10,6),
  geo_lng numeric(10,6),
  note text,
  reviewed boolean default false,
  reviewer_id uuid references users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists photo_uploads_project_reviewed_idx on photo_uploads(project_id, reviewed);

-- ----------------------------------------------------------------- gate_audits
create table if not exists gate_audits (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  gate text not null,
  pass boolean not null,
  evidence_items jsonb not null,
  photos text[] default '{}',
  ncr_raised boolean default false,
  notes text,
  created_at timestamptz default now()
);
create index if not exists gate_audits_project_gate_idx on gate_audits(project_id, gate);

-- ----------------------------------------------------------------- reports
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  report_type text not null,
  generated_by uuid not null references users(id),
  prompt_used text not null,
  input_text text,
  content text not null,
  status text default 'draft',
  created_at timestamptz default now()
);
create index if not exists reports_tenant_project_idx on reports(tenant_id, project_id);

-- ----------------------------------------------------------------- ai_prompts
create table if not exists ai_prompts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  skill_type text not null,
  system_prompt text not null,
  updated_by uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, project_id, skill_type)
);
create index if not exists ai_prompts_tenant_idx on ai_prompts(tenant_id);

-- ----------------------------------------------------------------- subscriptions
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  plan text not null,
  active_users int default 0,
  reports_this_month int default 0,
  monthly_fee numeric(12,2) not null,
  user_fee_per_month numeric(10,2) default 1500,
  report_fee numeric(10,2) default 1000,
  vat_rate numeric(5,4) default 0,
  stripe_subscription_id text unique,
  billing_anchor int default 1,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists subscriptions_tenant_idx on subscriptions(tenant_id);

-- ----------------------------------------------------------------- invoices
create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  active_users int not null,
  reports_count int not null,
  subtotal numeric(12,2) not null,
  vat_amount numeric(12,2) default 0,
  total_amount numeric(12,2) not null,
  status text default 'open',
  stripe_invoice_id text unique,
  paid_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists invoices_tenant_status_idx on invoices(tenant_id, status);

-- ----------------------------------------------------------------- audit_log
create table if not exists audit_log (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid references users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb,
  ip_address text,
  created_at timestamptz default now()
);
create index if not exists audit_log_tenant_entity_idx on audit_log(tenant_id, entity_type);
