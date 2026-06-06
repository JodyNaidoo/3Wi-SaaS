# Supabase Migrations

Run in order:

```bash
psql "$DATABASE_URL" -f 0001_init.sql
psql "$DATABASE_URL" -f 0002_rls.sql
```

Or paste each into the Supabase SQL editor (project → SQL → New query).

## What 0001_init.sql does
Creates all 15 tables with FK constraints and indexes. Idempotent on first run only.

## What 0002_rls.sql does
Enables RLS on every table and creates an `*_isolation` policy on each one. The API sets
`set local app.tenant_id = '<uuid>'` at the start of every request inside a transaction; the
policies compare `tenant_id` (or `project_tenant(project_id)`) to that GUC. With this in place
the app DB user does not bypass RLS, so a tenant-id leak in code can never cross tenants.

## Running with Prisma
After SQL migrations apply, generate the Prisma client at the repo root:
```bash
cd ../prisma && npx prisma generate
```

The Prisma model is the source of truth for **types**, but **the SQL files are the source of
truth for the database**. Keep them in sync manually for now.
