import 'dotenv/config';
/**
 * Seed data for the Sunshines anchor demo.
 *
 * Idempotent — re-running this script will not create duplicates. It uses
 * upsert by tenant slug, client slug, project code, part code and grower
 * external_ref so it can be safely run on every deploy or after a fresh
 * migration.
 *
 * Hierarchy created:
 *   Tenant: IBS
 *     Client: Hempire-EC NPC
 *       Project: Sunshines (R4,800,000 envelope)
 *         Part 1: Seedlings Cohort (ECRDA, 46 growers)
 *           Deliverables D1, D2, D3
 *           46 Growers + 46 Disbursements + 46 Sign-offs (Awaiting)
 *         Part 2: DSBD Seed Cohort (DSBD, placeholder)
 *
 * Run with:  npm run seed     (or: npx tsx src/services/seed.ts)
 *
 * Note: this script bypasses the tenant GUC because it creates tenants
 * themselves. RLS is enforced at the API layer via withTenant().
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { PrismaClient, Prisma } from '@prisma/client';
import {
  PART1_DELIVERABLES,
  SUNSHINES_RISKS,
  SUNSHINES_TAGLINE,
  SUNSHINES_TOTAL_BUDGET,
  RATE_MECHANISATION,
  RATE_LABOUR,
  type RawGrower,
} from './seed-data/fixtures.js';

const prisma = new PrismaClient();

function loadGrowers(): RawGrower[] {
  const here = dirname(fileURLToPath(import.meta.url));
  const path = resolve(here, 'seed-data', 'growers.json');
  return JSON.parse(readFileSync(path, 'utf-8')) as RawGrower[];
}

async function seedTenantAndClient() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'ibs' },
    update: {},
    create: {
      name: 'IBS',
      slug: 'ibs',
      brandColorPrimary: '#0F172A',
      brandColorSecondary: '#0EA5A4',
      brandColorAccent: '#F59E0B',
      subscriptionTier: 'professional',
      billingEmail: 'finance@ibs.example',
    },
  });

  const client = await prisma.client.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: 'hempire-ec' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Hempire-EC NPC',
      slug: 'hempire-ec',
      legalName: 'Hempire Eastern Cape NPC',
      brandColorPrimary: '#3F1101',
      brandColorSecondary: '#015807',
      brandColorAccent: '#FDF31C',
      primaryContactName: 'Hempire-EC Director',
      primaryContactEmail: 'director@hempire-ec.example',
      status: 'active',
    },
  });

  return { tenant, client };
}

async function seedProject(tenantId: string, clientId: string) {
  return prisma.project.upsert({
    where: { tenantId_code: { tenantId, code: 'SUNSHINES-001' } },
    update: {
      totalBudget: SUNSHINES_TOTAL_BUDGET,
      tagline: SUNSHINES_TAGLINE,
      moaReference: 'HEMP/IBS/MOA/2025',
    },
    create: {
      tenantId,
      clientId,
      name: 'Sunshines Project',
      code: 'SUNSHINES-001',
      description: 'ECRDA Pilot Production Project — multi-cohort programme management.',
      status: 'active',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-08-31'),
      totalBudget: SUNSHINES_TOTAL_BUDGET,
      funder: 'ECRDA + DSBD',
      moaReference: 'HEMP/IBS/MOA/2025',
      tagline: SUNSHINES_TAGLINE,
    },
  });
}

async function seedParts(tenantId: string, projectId: string) {
  const part1 = await prisma.part.upsert({
    where: { projectId_code: { projectId, code: 'P1' } },
    update: {},
    create: {
      tenantId, projectId,
      code: 'P1', name: 'Seedlings Cohort',
      description: 'ECRDA-funded seedlings production cohort, 46 growers in the Eastern Cape.',
      leadFunder: 'ECRDA',
      budgetAllocation: new Prisma.Decimal('3200000.00'),
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-05-31'),
      status: 'active', sortOrder: 1,
    },
  });

  const part2 = await prisma.part.upsert({
    where: { projectId_code: { projectId, code: 'P2' } },
    update: {},
    create: {
      tenantId, projectId,
      code: 'P2', name: 'DSBD Seed Cohort',
      description: 'DSBD-funded seed cohort — placeholder, growers TBC.',
      leadFunder: 'DSBD',
      budgetAllocation: new Prisma.Decimal('1600000.00'),
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      status: 'active', sortOrder: 2,
    },
  });

  return { part1, part2 };
}

async function seedDeliverables(tenantId: string, projectId: string, partId: string) {
  for (const d of PART1_DELIVERABLES) {
    await prisma.deliverable.upsert({
      where: { projectId_code: { projectId, code: d.code } },
      update: {
        partId, title: d.title, description: d.description, owner: d.owner,
        dueDate: d.dueDate, status: d.status, percentComplete: d.percentComplete,
        payment: d.payment, funder: d.funder, sortOrder: d.sortOrder,
      },
      create: {
        tenantId, projectId, partId,
        code: d.code, title: d.title, description: d.description, owner: d.owner,
        dueDate: d.dueDate, status: d.status, percentComplete: d.percentComplete,
        payment: d.payment, funder: d.funder, sortOrder: d.sortOrder,
      },
    });
  }
}

async function seedRisks(projectId: string) {
  for (const r of SUNSHINES_RISKS) {
    await prisma.risk.upsert({
      where: { projectId_code: { projectId, code: r.code } },
      update: r,
      create: { projectId, ...r },
    });
  }
}

async function seedOneGrower(args: {
  tenantId: string; projectId: string; partId: string; g: RawGrower;
}) {
  const { tenantId, projectId, partId, g } = args;
  const region = ['Eastern', 'Northern', 'Southern'].includes(g.region) ? g.region : 'Eastern';

  const data = {
    fullName: g.name,
    farmName: g.farm,
    district: g.district,
    region,
    coordinator: g.coordinator,
    seedlingsPlanned: Math.round(g.seedlings_planned),
    seedlingsReceived: Math.round(g.seedlings_received),
    deliveryGap: Math.round(g.delivery_gap),
    plannedHa: new Prisma.Decimal(String(g.planned_ha)),
    mappedHa: new Prisma.Decimal(String(g.mapped_ha)),
    theoreticalHa: new Prisma.Decimal(String(g.theoretical_ha)),
    outlierFlag: g.outlier !== 'Normal',
  };

  const grower = await prisma.grower.upsert({
    where: { projectId_externalRef: { projectId, externalRef: g.n } },
    update: { ...data, partId },
    create: {
      ...data,
      tenantId, projectId, partId,
      externalRef: g.n,
      status: 'active',
      enrolledAt: new Date('2025-10-01'),
    },
  });

  const fundedHa  = new Prisma.Decimal(String(g.funded_ha));
  const amountMech = new Prisma.Decimal(String(g.mech_amount));
  const amountLab  = new Prisma.Decimal(String(g.labour_amount));
  const amountTot  = new Prisma.Decimal(String(g.total_disbursement));

  const existing = await prisma.disbursement.findFirst({ where: { growerId: grower.id } });
  const disbursement = existing
    ? await prisma.disbursement.update({
        where: { id: existing.id },
        data: {
          partId, fundedHa,
          rateMechanisation: RATE_MECHANISATION,
          rateLabour: RATE_LABOUR,
          amountMechanisation: amountMech,
          amountLabour: amountLab,
          amountTotal: amountTot,
        },
      })
    : await prisma.disbursement.create({
        data: {
          tenantId, projectId, partId,
          growerId: grower.id,
          fundedHa,
          rateMechanisation: RATE_MECHANISATION,
          rateLabour: RATE_LABOUR,
          amountMechanisation: amountMech,
          amountLabour: amountLab,
          amountTotal: amountTot,
          status: 'Pending',
        },
      });

  const existingSignoff = await prisma.disbursementSignoff.findFirst({
    where: { disbursementId: disbursement.id },
  });
  if (!existingSignoff) {
    await prisma.disbursementSignoff.create({
      data: {
        tenantId,
        disbursementId: disbursement.id,
        growerId: grower.id,
        signoffStatus: 'Awaiting',
      },
    });
  }
}

async function main() {
  console.log('[seed] starting Sunshines anchor seed ...');
  const { tenant, client } = await seedTenantAndClient();
  console.log(`[seed] tenant=${tenant.slug} client=${client.slug}`);

  const project = await seedProject(tenant.id, client.id);
  console.log(`[seed] project=${project.code} budget=R${project.totalBudget.toString()}`);

  const { part1, part2 } = await seedParts(tenant.id, project.id);
  console.log(`[seed] parts: ${part1.code}=${part1.name}, ${part2.code}=${part2.name}`);

  await seedDeliverables(tenant.id, project.id, part1.id);
  console.log('[seed] deliverables D1..D3 upserted under Part 1');

  await seedRisks(project.id);
  console.log('[seed] risks R01..R05 upserted');

  const rawGrowers = loadGrowers();
  console.log(`[seed] loaded ${rawGrowers.length} growers from seed-data/growers.json`);

  for (const g of rawGrowers) {
    await seedOneGrower({ tenantId: tenant.id, projectId: project.id, partId: part1.id, g });
  }
  console.log(`[seed] ${rawGrowers.length} growers + disbursements + signoffs upserted`);

  console.log('[seed] done.');
}

main()
  .catch((e) => {
    console.error('[seed] FAILED', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
