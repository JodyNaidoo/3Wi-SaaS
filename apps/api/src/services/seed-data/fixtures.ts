/**
 * Static seed-data fixtures for the Sunshines anchor demo.
 * Pulled out of seed.ts so the orchestration file stays under 400 lines.
 */

import { Prisma } from '@prisma/client';

export const SUNSHINES_TOTAL_BUDGET = '4800000.00';
export const SUNSHINES_TAGLINE      = 'Sowing Seeds of Change';

export const RATE_MECHANISATION = '7350.00';
export const RATE_LABOUR        = '3618.72';

export interface DeliverableFixture {
  code: string;
  title: string;
  description: string;
  owner: string;
  dueDate: Date;
  status: string;
  percentComplete: number;
  payment: string | null;
  funder: string;
  sortOrder: number;
}

export const PART1_DELIVERABLES: DeliverableFixture[] = [
  {
    code: 'D1',
    title: 'Determine Part 1 budget allocation within R4.8m envelope',
    description: 'Confirm the split between mechanisation, labour, mapping and audit reserves.',
    owner: 'Director',
    dueDate: new Date('2025-11-30'),
    status: 'At risk',
    percentComplete: 0,
    payment: null,
    funder: 'ECRDA',
    sortOrder: 1,
  },
  {
    code: 'D2',
    title: 'Review applications + field-research data; house in Grower Register; publish reports',
    description: '46 farmers reviewed, mapped hectares verified, monthly grower-register report.',
    owner: 'Field Office',
    dueDate: new Date('2026-02-28'),
    status: 'On track',
    percentComplete: 60,
    payment: null,
    funder: 'ECRDA',
    sortOrder: 2,
  },
  {
    code: 'D3',
    title: 'Disbursements + per-farmer sign-off + Part 1 closeout',
    description: 'Calculate, sign-off and pay out R10,968.72 per funded ha; final close report.',
    owner: 'Finance',
    dueDate: new Date('2026-05-31'),
    status: 'On track',
    percentComplete: 20,
    payment: '536590.00',
    funder: 'ECRDA',
    sortOrder: 3,
  },
];

export interface RiskFixture {
  code: string;
  label: string;
  likelihood: number;
  impact: number;
  ragStatus: string;
  controlAction: string;
  owner: string;
  pfmaFlag: boolean;
}

export const SUNSHINES_RISKS: RiskFixture[] = [
  { code: 'R01', label: 'Funder budget approval delayed (R4.8m envelope)',
    likelihood: 4, impact: 5, ragStatus: 'red',
    controlAction: 'Escalate to PSC; weekly tracking meeting with ECRDA',
    owner: 'Director', pfmaFlag: true },
  { code: 'R02', label: 'Seedlings delivery gap vs planned (over/under supply)',
    likelihood: 3, impact: 3, ragStatus: 'amber',
    controlAction: 'Reconcile delivery gap weekly; outlier flags raised',
    owner: 'Field Office', pfmaFlag: false },
  { code: 'R03', label: 'Mapped hectares << planned hectares (capacity risk)',
    likelihood: 4, impact: 4, ragStatus: 'amber',
    controlAction: 'Re-survey outlier farms; revise funded_ha downward',
    owner: 'Technical', pfmaFlag: false },
  { code: 'R04', label: 'Farmer sign-off disputes on disbursement amounts',
    likelihood: 3, impact: 4, ragStatus: 'amber',
    controlAction: 'In-person witness; clear rate sheet; appeal channel',
    owner: 'Field Office', pfmaFlag: false },
  { code: 'R05', label: 'POPIA / record retention on grower personal data',
    likelihood: 2, impact: 4, ragStatus: 'green',
    controlAction: 'RLS enforced; private bucket; audit log on every read',
    owner: 'Director', pfmaFlag: true },
];

export interface RawGrower {
  n: number;
  name: string;
  farm: string;
  district: string;
  region: string;
  coordinator: string;
  seedlings_planned: number;
  seedlings_received: number;
  delivery_gap: number;
  planned_ha: number;
  mapped_ha: number;
  theoretical_ha: number;
  funded_ha: number;
  mech_amount: number;
  labour_amount: number;
  total_disbursement: number;
  outlier: string;
}
