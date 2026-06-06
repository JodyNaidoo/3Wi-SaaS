/**
 * SAQA-aligned training module library + Portfolio of Evidence (PoE) tool +
 * Training Dashboard for the Step 3 Training pillar.
 *
 * Exports:
 *   - SaqaModuleLibrary       List of all 5 modules with NQF + credits
 *   - SaqaModuleDetail        Per-module detail (driven by URL param)
 *   - PoeAssessmentTool       Portfolio of Evidence builder (per learner, per module)
 *   - TrainingDashboard       Cohort-level dashboard with KPIs + heatmap
 *
 * Routes:
 *   /tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/training
 *     /saqa-modules              -> library
 *     /saqa-modules/:moduleId    -> detail + PoE structure
 *     /assessment                -> PoE builder for active learner
 *     /dashboard                 -> training dashboard
 */

import { Link, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { poe, type PoeDashboardLearner } from '../../lib/api/poe';

const ACCENT = '#15803d';   // green to match Training pillar
const ACCENT_DARK = '#14532d';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities', href: '/cc/director' },
  { key: 'F6', label: 'Growers',      href: '/cc/growers' },
  { key: 'G',  label: 'Engagements',  href: '/cc/engagements' },
];

const MOA_BASE = '/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa';
const STEP3 = `${MOA_BASE}/step-3-grower-onboarding`;
const TRAINING = `${STEP3}/training`;

/* ──────────────────────────────────────────────────────────────────
 *  SAQA MODULE DATA
 * ────────────────────────────────────────────────────────────────── */

export interface SaqaModule {
  id: string;
  number: string;          // i, ii, iii, iv, v
  title: string;
  usTitle: string;         // Unit Standard title
  usId: string;            // Placeholder US ID
  nqfLevel: number;
  credits: number;
  notionalHours: number;
  field: string;
  subfield: string;
  purpose: string;
  specificOutcomes: {
    so: string;             // SO number / title
    title: string;
    criteria: string[];
  }[];
  poeRequirements: {
    type: string;            // 'Written assessment', 'Practical demo', etc.
    evidence: string;        // what to submit
    weight: number;          // % of overall assessment
  }[];
  ccfo: string[];            // Critical Cross-Field Outcomes addressed
}

export const SAQA_MODULES: SaqaModule[] = [
  {
    id: 'pre-planting',
    number: 'i',
    title: 'Pre-planting',
    usTitle: 'Establish Hemp Crop Production',
    usId: 'USNEW-HEMP-001',
    nqfLevel: 3,
    credits: 8,
    notionalHours: 80,
    field: 'Agriculture and Nature Conservation',
    subfield: 'Primary Agriculture · Plant Production',
    purpose: 'A learner credited with this unit standard will be able to prepare land and establish a hemp crop suitable for commercial production in the Eastern Cape, in line with offtaker quality specifications and ECRDA programme requirements.',
    specificOutcomes: [
      { so: 'SO1', title: 'Prepare soil for hemp cultivation', criteria: [
        'Soil sample taken using prescribed method and submitted for analysis',
        'Soil amendments interpreted and applied to recommended rates',
        'Tillage method selected based on soil + slope + erosion risk',
        'Field readiness inspected before planting',
      ]},
      { so: 'SO2', title: 'Select cultivar matching offtaker specifications', criteria: [
        'Offtaker product spec (CBD%, THC threshold, fibre grade) interpreted',
        'Cultivar selected with reference to spec + climate + permit',
        'Seed / seedling source verified as licensed and certified',
        'Cultivar selection documented in cultivation plan',
      ]},
      { so: 'SO3', title: 'Handle and transplant seedlings', criteria: [
        'Seedlings inspected for health and uniformity on receipt',
        'Holding conditions maintained (light, temperature, water)',
        'Transplanting performed within recommended window and depth',
        'Transplant losses recorded and replaced where viable',
      ]},
      { so: 'SO4', title: 'Lay out plot to optimise yield and access', criteria: [
        'Plant spacing applied per cultivar + management plan',
        'Access lanes provided for in-season operations',
        'Headlands and buffer zones marked',
        'GPS-referenced plot map produced',
      ]},
      { so: 'SO5', title: 'Set up irrigation infrastructure', criteria: [
        'Water source confirmed legally accessible',
        'Drip line / sprinkler installed per design',
        'Pressure + flow tested before planting',
        'Irrigation schedule documented for in-season reference',
      ]},
    ],
    poeRequirements: [
      { type: 'Written assessment', evidence: 'Soil analysis interpretation exercise (case study)', weight: 15 },
      { type: 'Practical demo',     evidence: 'Land prep + plot layout observation (assessor on-site)', weight: 25 },
      { type: 'Workplace evidence', evidence: 'Photo log: before / during / after planting + GPS-referenced plot map', weight: 25 },
      { type: 'Witness statement',  evidence: 'Field officer or extension agent confirms transplant + irrigation setup', weight: 15 },
      { type: 'Knowledge questions',evidence: '20 short-answer questions covering cultivar + soil + irrigation', weight: 20 },
    ],
    ccfo: ['Identifying and solving problems', 'Collecting + analysing information', 'Working effectively with others'],
  },
  {
    id: 'in-season',
    number: 'ii',
    title: 'In-season operations',
    usTitle: 'Manage In-Season Hemp Crop Operations',
    usId: 'USNEW-HEMP-002',
    nqfLevel: 3,
    credits: 10,
    notionalHours: 100,
    field: 'Agriculture and Nature Conservation',
    subfield: 'Primary Agriculture · Plant Production',
    purpose: 'A learner credited with this unit standard will be able to manage a hemp crop through the in-season period, applying integrated pest management, nutrition, irrigation and canopy management to achieve quality and yield targets.',
    specificOutcomes: [
      { so: 'SO1', title: 'Conduct pest and disease scouting', criteria: [
        'Weekly scouting walks performed to set pattern',
        'Pests and diseases identified using standard reference guide',
        'Scouting log maintained per plot',
        'Thresholds applied to trigger intervention decisions',
      ]},
      { so: 'SO2', title: 'Manage irrigation and water', criteria: [
        'Irrigation triggered based on plant + soil indicators (not calendar)',
        'Water meter readings logged per cycle',
        'Run-off and water stress observed and corrected',
        'Compliance with water-use licence maintained',
      ]},
      { so: 'SO3', title: 'Apply nutrition and fertiliser plan', criteria: [
        'Fertiliser plan interpreted and applied at correct rates',
        'Application timing matched to growth stage',
        'PPE used during all fertiliser handling',
        'Nutrient deficiency symptoms recognised and addressed',
      ]},
      { so: 'SO4', title: 'Conduct canopy and growth management', criteria: [
        'Pruning performed per cultivar specification',
        'Canopy structure managed for airflow + light penetration',
        'Lodging and competition controlled',
        'Activities documented in cultivation diary',
      ]},
      { so: 'SO5', title: 'Monitor and report growth stages', criteria: [
        'Growth stage identified using BBCH scale',
        'Per-plot photos captured at set intervals',
        'Variances from expected growth flagged early',
        'Weekly status report submitted to programme manager',
      ]},
    ],
    poeRequirements: [
      { type: 'Workplace evidence', evidence: 'Scouting log + fertiliser application records covering 8+ weeks',          weight: 30 },
      { type: 'Practical demo',     evidence: 'On-farm pest ID + irrigation decision (assessor walk-through)',             weight: 25 },
      { type: 'Photo evidence',     evidence: 'Weekly per-plot photos with BBCH stage labels',                              weight: 20 },
      { type: 'Witness statement',  evidence: 'Field officer confirms scouting frequency + interventions',                  weight: 10 },
      { type: 'Written assessment', evidence: 'IPM decision case study + nutrient deficiency identification',                weight: 15 },
    ],
    ccfo: ['Identifying and solving problems', 'Collecting + analysing information', 'Demonstrating an understanding of the world as a set of related systems'],
  },
  {
    id: 'post-harvest',
    number: 'iii',
    title: 'Post-harvest activities',
    usTitle: 'Conduct Hemp Harvest and Post-Harvest Operations',
    usId: 'USNEW-HEMP-003',
    nqfLevel: 4,
    credits: 12,
    notionalHours: 120,
    field: 'Agriculture and Nature Conservation',
    subfield: 'Primary Agriculture · Plant Production',
    purpose: 'A learner credited with this unit standard will be able to plan and execute hemp harvest, drying, curing, grading and storage operations to deliver produce that meets offtaker quality specifications.',
    specificOutcomes: [
      { so: 'SO1', title: 'Determine harvest timing and method', criteria: [
        'Harvest readiness indicators identified per product (flower / seed / fibre)',
        'Trichome maturity assessed for flower harvests',
        'Harvest method matched to product (manual / mechanical)',
        'Harvest plan documented and signed off',
      ]},
      { so: 'SO2', title: 'Execute harvest operation', criteria: [
        'Harvest team briefed on quality + safety + biosecurity',
        'Harvest performed within indicated window',
        'Cut material protected from contamination during transfer',
        'Harvest log completed (date, plot, weight, weather)',
      ]},
      { so: 'SO3', title: 'Conduct drying and curing', criteria: [
        'Drying environment monitored for temperature + humidity + airflow',
        'Moisture content tracked to target level',
        'Curing performed for prescribed duration',
        'Microbial + mould checks performed before storage',
      ]},
      { so: 'SO4', title: 'Grade and sort produce', criteria: [
        'Grading criteria interpreted from offtaker spec',
        'Sample sorting performed to demonstrate consistency',
        'Reject material segregated and recorded',
        'Grade allocation justified in writing',
      ]},
      { so: 'SO5', title: 'Package and store for dispatch', criteria: [
        'Packaging matched to product + transport mode',
        'Batch label applied (origin, date, grade, weight)',
        'Storage conditions confirmed before placement',
        'Stock register updated on placement and dispatch',
      ]},
    ],
    poeRequirements: [
      { type: 'Practical demo',     evidence: 'Harvest readiness assessment + grading exercise (assessor present)', weight: 25 },
      { type: 'Workplace evidence', evidence: 'Harvest + drying log + grading sheet for at least one batch',         weight: 25 },
      { type: 'Photo evidence',     evidence: 'Before / during / after photos: harvest, drying, storage',             weight: 20 },
      { type: 'Witness statement',  evidence: 'Hub QC technician confirms moisture + grading sign-off',                weight: 15 },
      { type: 'Written assessment', evidence: 'Grading decision case study + storage condition design',                weight: 15 },
    ],
    ccfo: ['Organising oneself + activities', 'Collecting + analysing information', 'Communicating effectively'],
  },
  {
    id: 'gacp-gap',
    number: 'iv',
    title: 'GACP / GAP compliance',
    usTitle: 'Apply Good Agricultural and Collection Practices in Hemp Production',
    usId: 'USNEW-HEMP-004',
    nqfLevel: 4,
    credits: 8,
    notionalHours: 80,
    field: 'Agriculture and Nature Conservation',
    subfield: 'Primary Agriculture · Quality and Compliance',
    purpose: 'A learner credited with this unit standard will be able to apply Good Agricultural and Collection Practices (GACP) and Good Agricultural Practices (GAP) to hemp production, maintain compliance documentation, and prepare for external audit.',
    specificOutcomes: [
      { so: 'SO1', title: 'Maintain record-keeping aligned to GACP', criteria: [
        'Records kept for soil, seed, inputs, operations, harvest',
        'Records updated within 24 hours of activity',
        'Records stored securely with backups',
        'Retention period applied per regulatory requirement',
      ]},
      { so: 'SO2', title: 'Apply traceability and batch labelling', criteria: [
        'Each batch assigned unique reference',
        'Labels applied at harvest and maintained through storage + dispatch',
        'Batch genealogy traceable from seed to dispatch',
        'Recall test performed at least annually',
      ]},
      { so: 'SO3', title: 'Maintain pesticide register and IPM-aligned practice', criteria: [
        'Pesticide register kept per regulation',
        'Pre-harvest interval (PHI) respected',
        'IPM hierarchy applied before chemical intervention',
        'WHO toxicity classification applied to selection',
      ]},
      { so: 'SO4', title: 'Demonstrate audit readiness', criteria: [
        'Self-audit checklist completed within 30 days of external audit window',
        'Non-conformities logged with corrective actions',
        'Evidence file organised per GACP / GAP audit structure',
        'Staff trained on auditor protocol',
      ]},
      { so: 'SO5', title: 'Participate in mock audit', criteria: [
        'Mock audit attended end-to-end',
        'Findings interpreted and acted on within 14 days',
        'Improvement plan submitted to programme manager',
        'Re-mock or external audit booked',
      ]},
    ],
    poeRequirements: [
      { type: 'Workplace evidence', evidence: 'Complete records file: soil, seed, inputs, ops, harvest, dispatch', weight: 35 },
      { type: 'Practical demo',     evidence: 'Mock audit walk-through with external assessor',                     weight: 25 },
      { type: 'Written assessment', evidence: 'GACP knowledge test + corrective-action plan exercise',              weight: 20 },
      { type: 'Witness statement',  evidence: 'Hub compliance officer confirms record currency + audit readiness',   weight: 10 },
      { type: 'Photo evidence',     evidence: 'Batch labels, pesticide store, records file',                         weight: 10 },
    ],
    ccfo: ['Identifying and solving problems', 'Working effectively with others', 'Using science and technology effectively and critically'],
  },
  {
    id: 'financial',
    number: 'v',
    title: 'Financial aspects of primary production',
    usTitle: 'Apply Basic Financial Management Principles to Primary Agricultural Production',
    usId: 'USNEW-HEMP-005',
    nqfLevel: 4,
    credits: 10,
    notionalHours: 100,
    field: 'Business, Commerce and Management Studies',
    subfield: 'Generic Management · Financial Management',
    purpose: 'A learner credited with this unit standard will be able to apply basic financial management principles — cash flow, banking, SARS compliance, contract interpretation, cost of production and reinvestment — to a primary agricultural operation.',
    specificOutcomes: [
      { so: 'SO1', title: 'Build and maintain a farm cash-flow forecast', criteria: [
        '12-month rolling cash-flow constructed',
        'Major in / out flows captured (inputs, labour, sales, repayments)',
        'Variance review performed monthly',
        'Cash-flow updated and shared with programme manager',
      ]},
      { so: 'SO2', title: 'Apply banking and SARS basics', criteria: [
        'Business bank account opened or operational',
        'Receipts kept for all material transactions',
        'SARS registration status confirmed (tax PIN or affidavit)',
        'Tax-clearance + EMP201 (if employer) submitted on time',
      ]},
      { so: 'SO3', title: 'Interpret and negotiate offtake contracts', criteria: [
        'Key contract clauses identified (price, quality, payment, exclusivity)',
        'Calculation of expected revenue based on yield and price',
        'Risks identified and discussed before signature',
        'Contract signed in business name',
      ]},
      { so: 'SO4', title: 'Calculate cost of production', criteria: [
        'Direct costs captured (seed, fertiliser, labour, water, energy)',
        'Indirect costs allocated (overhead share, depreciation)',
        'Cost per kg / per ha calculated',
        'Break-even price determined',
      ]},
      { so: 'SO5', title: 'Plan reinvestment and savings', criteria: [
        'Surplus identified after costs and obligations',
        'Reinvestment priorities ranked (e.g. infrastructure, expansion, working capital)',
        'Savings vehicle selected and operational',
        'Annual financial plan submitted to programme manager',
      ]},
    ],
    poeRequirements: [
      { type: 'Practical exercise', evidence: '12-month cash-flow spreadsheet for own farm (assessor reviews)',  weight: 30 },
      { type: 'Workplace evidence', evidence: 'Bank statements + SARS confirmation + receipts file (last 3 mo)', weight: 25 },
      { type: 'Written assessment', evidence: 'Contract interpretation exercise + cost-of-production calc',      weight: 25 },
      { type: 'Witness statement',  evidence: 'Mentor or accountant confirms cash-flow + record discipline',      weight: 10 },
      { type: 'Reflective journal', evidence: 'Reinvestment plan with rationale + 6-month review',                 weight: 10 },
    ],
    ccfo: ['Organising oneself + activities', 'Identifying and solving problems', 'Reflecting on and exploring strategies'],
  },
];

const TOTAL_CREDITS = SAQA_MODULES.reduce((s, m) => s + m.credits, 0);
const TOTAL_HOURS = SAQA_MODULES.reduce((s, m) => s + m.notionalHours, 0);

/* ──────────────────────────────────────────────────────────────────
 *  SHARED COMPONENTS
 * ────────────────────────────────────────────────────────────────── */

function Crumbs({ tail }: { tail: { label: string; href?: string }[] }) {
  return (
    <nav className="text-xs text-slate-500 mb-3">
      <Link to="/cc/director" className="hover:underline">3Wi</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to={MOA_BASE} className="hover:underline">ECRDA 2026/2027 MOA</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to={STEP3} className="hover:underline">Step 3 · Grower Onboarding</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to={TRAINING} className="hover:underline">Training</Link>
      {tail.map((c, i) => (
        <span key={i}>
          <span className="mx-1.5 text-slate-400">›</span>
          {c.href
            ? <Link to={c.href} className="hover:underline">{c.label}</Link>
            : <span className="text-slate-900 font-semibold">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}

function Kpi({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-900 mt-1">{value}</div>
      {sub ? <div className="text-xs text-slate-500 mt-0.5">{sub}</div> : null}
    </div>
  );
}

function NqfBadge({ level, credits }: { level: number; credits: number }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <span className="px-2 py-0.5 rounded-md font-bold text-white" style={{ background: ACCENT }}>NQF {level}</span>
      <span className="px-2 py-0.5 rounded-md font-bold border" style={{ borderColor: ACCENT, color: ACCENT_DARK }}>{credits} credits</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  1 · SAQA MODULE LIBRARY (list view)
 * ══════════════════════════════════════════════════════════════════ */
export function SaqaModuleLibrary() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs tail={[{ label: 'SAQA Module Library' }]} />

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0A` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: ACCENT }}>SAQA</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: ACCENT }}>
                NQF aligned · QCTO pathway
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">SAQA Module Library</h1>
            <p className="text-sm text-slate-600 mt-1">
              The five Step 3 Training modules, expressed as SAQA-aligned unit standards. Each module has a
              specified NQF level, credit value, specific outcomes (SOs), assessment criteria (ACs), and a
              Portfolio of Evidence (PoE) blueprint that every learner builds during the programme.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        <Kpi label="Modules"        value={String(SAQA_MODULES.length)}   sub="One per training topic" />
        <Kpi label="Total credits"  value={TOTAL_CREDITS}                  sub={`${TOTAL_HOURS} notional hours`} />
        <Kpi label="NQF range"      value="3 – 4"                          sub="Mixed levels per module" />
        <Kpi label="Assessment"     value="PoE + practical"                sub="Per-module + final integrated" />
      </div>

      {/* Module list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mb-6">
        {SAQA_MODULES.map(m => (
          <Link key={m.id} to={`${TRAINING}/saqa-modules/${m.id}`}
                className="group block rounded-xl border-2 border-slate-200 bg-white p-5 hover:border-[#15803d] hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-md text-white text-sm font-bold uppercase shrink-0"
                    style={{ background: ACCENT }}>{m.number}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-slate-900">{m.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{m.usTitle}</p>
              </div>
            </div>
            <div className="ml-12">
              <div className="mb-2"><NqfBadge level={m.nqfLevel} credits={m.credits} /></div>
              <div className="text-xs text-slate-500 font-mono">{m.usId}</div>
              <div className="text-xs text-slate-500 mt-1">
                {m.specificOutcomes.length} specific outcomes · {m.poeRequirements.length} PoE evidence types
              </div>
              <div className="mt-3 text-sm font-semibold text-[#15803d] group-hover:underline">
                Open module spec →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer summary */}
      <div className="max-w-6xl">
        <Card title="Programme-level summary">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="text-left py-1 px-2">Module</th>
                <th className="text-left px-2">Unit Standard</th>
                <th className="text-center px-2">NQF</th>
                <th className="text-center px-2">Credits</th>
                <th className="text-center px-2">Hours</th>
                <th className="text-center px-2">SOs</th>
                <th className="text-center px-2">PoE types</th>
              </tr>
            </thead>
            <tbody>
              {SAQA_MODULES.map(m => (
                <tr key={m.id} className="border-t border-slate-100">
                  <td className="py-2 px-2"><span className="font-mono text-xs mr-2" style={{ color: ACCENT_DARK }}>{m.number}</span>{m.title}</td>
                  <td className="px-2 text-xs">{m.usTitle}</td>
                  <td className="px-2 text-center font-mono">{m.nqfLevel}</td>
                  <td className="px-2 text-center font-mono">{m.credits}</td>
                  <td className="px-2 text-center font-mono text-slate-500">{m.notionalHours}</td>
                  <td className="px-2 text-center font-mono">{m.specificOutcomes.length}</td>
                  <td className="px-2 text-center font-mono">{m.poeRequirements.length}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
                <td className="py-2 px-2">TOTAL (full programme)</td>
                <td className="px-2 text-xs">5-module integrated qualification path</td>
                <td className="px-2 text-center font-mono">3–4</td>
                <td className="px-2 text-center font-mono">{TOTAL_CREDITS}</td>
                <td className="px-2 text-center font-mono">{TOTAL_HOURS}</td>
                <td className="px-2 text-center font-mono">{SAQA_MODULES.reduce((s,m)=>s+m.specificOutcomes.length,0)}</td>
                <td className="px-2 text-center font-mono">—</td>
              </tr>
            </tbody>
          </table>
          <div className="text-xs text-slate-500 italic mt-3">
            Unit Standard IDs are placeholders pending QCTO + AgriSETA registration. The framework follows SAQA conventions for outcomes-based training so the path to formal accreditation is straightforward.
          </div>
        </Card>
      </div>

      {/* Cross-links */}
      <div className="mt-4 max-w-6xl flex flex-wrap gap-2">
        <Link to={`${TRAINING}/dashboard`} className="px-4 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: ACCENT }}>
          📊 Open Training Dashboard
        </Link>
        <Link to={TRAINING} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50">
          ← Back to Training pillar
        </Link>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  2 · SAQA MODULE DETAIL (driven by URL param)
 * ══════════════════════════════════════════════════════════════════ */
export function SaqaModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const m = SAQA_MODULES.find(x => x.id === moduleId);

  if (!m) {
    return (
      <Shell role="director" hotkeys={HOTKEYS}>
        <Crumbs tail={[{ label: 'SAQA Modules', href: `${TRAINING}/saqa-modules` }, { label: 'Not found' }]} />
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-800 max-w-3xl">
          Module not found. <Link to={`${TRAINING}/saqa-modules`} className="underline">Back to library</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs tail={[
        { label: 'SAQA Modules', href: `${TRAINING}/saqa-modules` },
        { label: `${m.number}. ${m.title}` },
      ]} />

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0A` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold uppercase shrink-0"
                style={{ background: ACCENT }}>{m.number}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <NqfBadge level={m.nqfLevel} credits={m.credits} />
              <span className="text-xs text-slate-500 font-mono">{m.usId}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{m.title}</h1>
            <p className="text-sm text-slate-600 mt-1 font-mono">{m.usTitle}</p>
          </div>
        </div>
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        <Kpi label="NQF Level"        value={`Level ${m.nqfLevel}`}                sub="On the NQF framework" />
        <Kpi label="Credits"          value={String(m.credits)}                     sub={`${m.notionalHours} notional hours`} />
        <Kpi label="Specific outcomes" value={String(m.specificOutcomes.length)}    sub={`${m.specificOutcomes.reduce((s,so)=>s+so.criteria.length,0)} assessment criteria`} />
        <Kpi label="PoE evidence types" value={String(m.poeRequirements.length)}    sub="Components of assessment" />
      </div>

      {/* Field + Purpose */}
      <div className="max-w-6xl mb-4">
        <Card title="Field, subfield + purpose">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Field</div>
              <p className="text-slate-700">{m.field}</p>
              <div className="text-xs font-semibold uppercase text-slate-500 mt-3 mb-1">Subfield</div>
              <p className="text-slate-700">{m.subfield}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Purpose</div>
              <p className="text-slate-700">{m.purpose}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Specific outcomes + criteria */}
      <div className="max-w-6xl mb-4">
        <Card title="Specific outcomes + assessment criteria">
          <ol className="relative border-l-2 border-slate-200 ml-3 space-y-5">
            {m.specificOutcomes.map((so, i) => (
              <li key={so.so} className="ml-6">
                <span className="absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                      style={{ background: ACCENT }}>{i + 1}</span>
                <div className="font-bold text-slate-900 text-sm">{so.so} · {so.title}</div>
                <ul className="text-sm text-slate-700 list-disc ml-5 mt-1 space-y-0.5">
                  {so.criteria.map((c, j) => <li key={j}>{c}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* PoE structure */}
      <div className="max-w-6xl mb-4">
        <Card title="Portfolio of Evidence (PoE) — assessment blueprint">
          <p className="text-xs text-slate-500 italic mb-3">
            Every learner builds a PoE for this module. The weights below add to 100% and form the assessor's final competence judgement.
          </p>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="text-left py-1 px-2">Evidence type</th>
                <th className="text-left px-2">What the learner submits</th>
                <th className="text-right px-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              {m.poeRequirements.map((p, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-2 px-2 font-medium">{p.type}</td>
                  <td className="px-2 text-xs text-slate-600">{p.evidence}</td>
                  <td className="px-2 text-right font-mono font-semibold">{p.weight}%</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
                <td className="py-2 px-2">Total</td>
                <td className="px-2"></td>
                <td className="px-2 text-right font-mono">{m.poeRequirements.reduce((s,p)=>s+p.weight,0)}%</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      {/* CCFOs */}
      <div className="max-w-6xl mb-4">
        <Card title="Critical Cross-Field Outcomes addressed">
          <div className="flex flex-wrap gap-2">
            {m.ccfo.map(c => (
              <span key={c} className="text-xs px-3 py-1 rounded-full font-medium border" style={{ borderColor: ACCENT, color: ACCENT_DARK, background: `${ACCENT}10` }}>
                {c}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Cross-links */}
      <div className="max-w-6xl flex flex-wrap gap-2">
        <Link to={`${TRAINING}/saqa-modules`} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50">
          ← All SAQA modules
        </Link>
        <Link to={`${TRAINING}/dashboard`} className="px-4 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: ACCENT }}>
          📊 Open Training Dashboard
        </Link>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  3 · TRAINING DASHBOARD
 * ══════════════════════════════════════════════════════════════════ */

interface LearnerRow {
  id: string;
  name: string;
  district: string;
  cohort: string;
  status: Record<string, 'NS' | 'IP' | 'SUB' | 'VER' | 'COMP' | 'NYC'>;  // per moduleId
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; }> = {
  NS:   { label: 'Not started',     color: '#64748b', bg: '#f1f5f9' },
  IP:   { label: 'In progress',     color: '#0E7490', bg: '#cffafe' },
  SUB:  { label: 'Submitted',       color: '#a16207', bg: '#fef9c3' },
  VER:  { label: 'Under verification', color: '#7c3aed', bg: '#ede9fe' },
  COMP: { label: 'Competent',       color: '#15803d', bg: '#dcfce7' },
  NYC:  { label: 'Not yet competent', color: '#b91c1c', bg: '#fee2e2' },
};

// MOCK cohort data — 18 learners across 2 cohorts
const MOCK_LEARNERS: LearnerRow[] = [
  { id: 'L01', name: 'Madumane Buyile',       district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'VER',  'gacp-gap': 'IP',  'financial': 'IP'  } },
  { id: 'L02', name: 'Nogaga Xolisa',         district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'SUB',  'gacp-gap': 'IP',  'financial': 'NS'  } },
  { id: 'L03', name: 'Mkiva Zakhele',          district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'SUB',  'post-harvest': 'IP',   'gacp-gap': 'NS',  'financial': 'NS'  } },
  { id: 'L04', name: 'Maciti Vukile',          district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'VER',  'gacp-gap': 'SUB', 'financial': 'IP'  } },
  { id: 'L05', name: 'Gazi Mziwethemba',       district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'NYC',  'in-season': 'IP',   'post-harvest': 'NS',   'gacp-gap': 'NS',  'financial': 'NS'  } },
  { id: 'L06', name: 'Xoxo Winston',           district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'IP',   'post-harvest': 'NS',   'gacp-gap': 'NS',  'financial': 'NS'  } },
  { id: 'L07', name: 'Mandleni-Voyi Mandisa',  district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'COMP', 'gacp-gap': 'VER', 'financial': 'SUB' } },
  { id: 'L08', name: 'Kleinsmit Andre',        district: 'Sarah Baartman','cohort': 'Sarah-2026A',  status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'COMP', 'gacp-gap': 'COMP','financial': 'VER' } },
  { id: 'L09', name: 'Batyi Steve',            district: 'Sarah Baartman','cohort': 'Sarah-2026A',  status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'COMP', 'gacp-gap': 'COMP','financial': 'COMP'} },
  { id: 'L10', name: 'Williams Frank',         district: 'Sarah Baartman','cohort': 'Sarah-2026A',  status: { 'pre-planting': 'COMP', 'in-season': 'VER',  'post-harvest': 'SUB',  'gacp-gap': 'IP',  'financial': 'NS'  } },
  { id: 'L11', name: 'Gibbs Charmaine',        district: 'Sarah Baartman','cohort': 'Sarah-2026A',  status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'VER',  'gacp-gap': 'SUB', 'financial': 'IP'  } },
  { id: 'L12', name: 'Mfono Thembani',         district: 'Joe Gqabi',    cohort: 'Sarah-2026A',  status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'COMP', 'gacp-gap': 'VER', 'financial': 'SUB' } },
  { id: 'L13', name: 'Mnyengo Joe',            district: 'Joe Gqabi',    cohort: 'Sarah-2026A',  status: { 'pre-planting': 'IP',   'in-season': 'NS',   'post-harvest': 'NS',   'gacp-gap': 'NS',  'financial': 'NS'  } },
  { id: 'L14', name: 'Qabaka Bonani Sive',     district: 'Chris Hani',   cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'VER',  'gacp-gap': 'SUB', 'financial': 'IP'  } },
  { id: 'L15', name: 'Nayo Ayanda',            district: 'Buffalo City', cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'SUB',  'post-harvest': 'IP',   'gacp-gap': 'NS',  'financial': 'NS'  } },
  { id: 'L16', name: 'Mahlati Nombuyiselo',    district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'COMP', 'gacp-gap': 'SUB', 'financial': 'IP'  } },
  { id: 'L17', name: 'Myaleni Luciano',        district: 'Buffalo City', cohort: 'Amathole-2026A', status: { 'pre-planting': 'NYC',  'in-season': 'NS',   'post-harvest': 'NS',   'gacp-gap': 'NS',  'financial': 'NS'  } },
  { id: 'L18', name: 'Dywili Thabo',           district: 'Amathole',     cohort: 'Amathole-2026A', status: { 'pre-planting': 'COMP', 'in-season': 'COMP', 'post-harvest': 'VER',  'gacp-gap': 'IP',  'financial': 'NS'  } },
];

const COHORTS = Array.from(new Set(MOCK_LEARNERS.map(l => l.cohort)));

/** Map API status enum -> matrix display code */
function mapApiStatusToMatrixCode(apiStatus: string): 'NS' | 'IP' | 'SUB' | 'VER' | 'COMP' | 'NYC' {
  switch (apiStatus) {
    case 'draft':              return 'IP';
    case 'submitted':          return 'SUB';
    case 'under_verification': return 'VER';
    case 'competent':          return 'COMP';
    case 'not_yet_competent':  return 'NYC';
    case 're_assess':          return 'NYC';
    case 'deferred':           return 'IP';
    case 'cancelled':          return 'NS';
    default:                   return 'NS';
  }
}

export function TrainingDashboard() {
  const [cohortFilter, setCohortFilter] = useState<string>('');
  const [liveLearners, setLiveLearners] = useState<LearnerRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [apiNote, setApiNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    poe.dashboard(cohortFilter || undefined)
      .then(r => {
        if (cancelled) return;
        if (r.learners.length === 0) {
          setLiveLearners(null);
          setUsingMock(true);
          setApiNote('No live PoE submissions yet. Showing demo data until first submission lands.');
        } else {
          const transformed: LearnerRow[] = r.learners.map((l: PoeDashboardLearner, i: number) => {
            const status: LearnerRow['status'] = {};
            for (const [mId, st] of Object.entries(l.status)) {
              status[mId] = mapApiStatusToMatrixCode(st);
            }
            return {
              id: `L${String(i + 1).padStart(2, '0')}`,
              name: l.candidateName,
              cohort: l.cohort,
              district: l.district || '—',
              status,
            };
          });
          setLiveLearners(transformed);
          setUsingMock(false);
          setApiNote(null);
        }
      })
      .catch(err => {
        if (cancelled) return;
        setLiveLearners(null);
        setUsingMock(true);
        setApiNote(`Live data unavailable (${err.message}). Showing demo data.`);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [cohortFilter]);

  const sourceData = liveLearners ?? MOCK_LEARNERS;
  const visible = cohortFilter && liveLearners == null
    ? sourceData.filter(l => l.cohort === cohortFilter)
    : sourceData;

  // Per-module aggregate counts
  const aggregate = SAQA_MODULES.map(m => {
    const counts: Record<string, number> = { NS: 0, IP: 0, SUB: 0, VER: 0, COMP: 0, NYC: 0 };
    visible.forEach(l => { counts[l.status[m.id] || 'NS']++; });
    return { module: m, counts };
  });

  const totalLearners = visible.length;
  const fullyCompetent = visible.filter(l => SAQA_MODULES.every(m => l.status[m.id] === 'COMP')).length;
  const totalCredits = visible.reduce((sum, l) => sum + SAQA_MODULES.reduce((s, m) => s + (l.status[m.id] === 'COMP' ? m.credits : 0), 0), 0);
  const maxCredits = totalLearners * TOTAL_CREDITS;
  const atRisk = visible.filter(l => Object.values(l.status).filter(s => s === 'NYC').length > 0).length;

  // % per module that achieved COMP
  const competentRates = SAQA_MODULES.map(m => {
    const n = visible.filter(l => l.status[m.id] === 'COMP').length;
    return { id: m.id, label: m.title, value: totalLearners ? Math.round((n / totalLearners) * 100) : 0 };
  });

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs tail={[{ label: 'Training Dashboard' }]} />

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-7xl"
           style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0A` }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-5">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                  style={{ background: ACCENT }}>📊</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: ACCENT }}>
                  Mock data
                </span>
                <span className="text-xs text-slate-500">Wires to live cohort data once learner table exists</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Training Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Per-cohort, per-learner, per-module status across the 5 SAQA-aligned training modules.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Cohort filter:</label>
            <select value={cohortFilter} onChange={e => setCohortFilter(e.target.value)}
                    className="border border-slate-300 rounded-md px-2 py-1 text-sm">
              <option value="">All cohorts</option>
              {COHORTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Live / mock banner */}
      {loading ? (
        <div className="rounded-lg bg-slate-100 border border-slate-200 px-4 py-2 mb-4 text-xs text-slate-600 max-w-7xl">
          ⏳ Loading live PoE data…
        </div>
      ) : usingMock ? (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 mb-4 text-xs text-amber-800 max-w-7xl">
          📊 <strong>Demo data shown.</strong> {apiNote}
        </div>
      ) : (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 mb-4 text-xs text-emerald-800 max-w-7xl">
          ✅ <strong>Live data.</strong> Reading from <code>poe_submissions</code> table — {visible.length} learner{visible.length === 1 ? '' : 's'} with at least one submission.
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 max-w-7xl">
        <Kpi label="Active learners"     value={String(totalLearners)}                                sub={`across ${cohortFilter ? 1 : COHORTS.length} cohort${cohortFilter ? '' : 's'}`} />
        <Kpi label="Fully competent"     value={`${fullyCompetent} / ${totalLearners}`}              sub={totalLearners ? `${Math.round((fullyCompetent/totalLearners)*100)}%` : '0%'} />
        <Kpi label="Credits earned"      value={String(totalCredits)}                                 sub={`/ ${maxCredits} possible`} />
        <Kpi label="Avg credits / learner" value={totalLearners ? (totalCredits/totalLearners).toFixed(1) : '0'} sub={`of ${TOTAL_CREDITS} max`} />
        <Kpi label="At-risk learners"    value={String(atRisk)}                                       sub="One or more NYC modules" />
      </div>

      {/* Per-module competence bars */}
      <div className="max-w-7xl mb-6">
        <Card title="Competence rate by module">
          {competentRates.map(r => (
            <div key={r.id} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">{r.label}</span>
                <span className="font-mono text-slate-500">{r.value}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: ACCENT }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Module status funnel */}
      <div className="max-w-7xl mb-6">
        <Card title="Status distribution per module">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="text-left px-2 py-2">Module</th>
                  {Object.keys(STATUS_META).map(k => (
                    <th key={k} className="px-2 py-2 text-center" title={STATUS_META[k].label}>
                      <span className="px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: STATUS_META[k].bg, color: STATUS_META[k].color }}>{k}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aggregate.map(({ module, counts }) => (
                  <tr key={module.id} className="border-t border-slate-100">
                    <td className="px-2 py-1.5 font-medium">{module.number}. {module.title}</td>
                    {Object.keys(STATUS_META).map(k => (
                      <td key={k} className="px-2 py-1.5 text-center font-mono">{counts[k]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-500 italic mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {Object.entries(STATUS_META).map(([k, v]) => (
              <span key={k}><span className="px-1 py-0.5 rounded font-bold uppercase mr-1" style={{ background: v.bg, color: v.color }}>{k}</span>{v.label}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* Learner × Module heatmap */}
      <div className="max-w-7xl mb-6">
        <Card title={`Learner × Module status matrix (${visible.length} learners)`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase">
                  <th className="text-left px-2 py-2">Learner</th>
                  <th className="text-left px-2 py-2">District</th>
                  <th className="text-left px-2 py-2">Cohort</th>
                  {SAQA_MODULES.map(m => (
                    <th key={m.id} className="text-center px-2 py-2" title={m.title}>{m.number}. {m.title.split(' ')[0]}</th>
                  ))}
                  <th className="text-center px-2 py-2">Credits</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(l => {
                  const credits = SAQA_MODULES.reduce((s, m) => s + (l.status[m.id] === 'COMP' ? m.credits : 0), 0);
                  return (
                    <tr key={l.id} className="border-t border-slate-100">
                      <td className="px-2 py-1.5 font-medium">{l.name}</td>
                      <td className="px-2 py-1.5 text-slate-500">{l.district}</td>
                      <td className="px-2 py-1.5 font-mono text-slate-500">{l.cohort}</td>
                      {SAQA_MODULES.map(m => {
                        const st = l.status[m.id] || 'NS';
                        const meta = STATUS_META[st];
                        return (
                          <td key={m.id} className="px-1 py-1 text-center">
                            <span className="inline-block w-full px-1.5 py-0.5 rounded font-bold uppercase text-[10px]"
                                  style={{ background: meta.bg, color: meta.color }}>{st}</span>
                          </td>
                        );
                      })}
                      <td className="px-2 py-1.5 text-center font-mono font-bold">{credits} / {TOTAL_CREDITS}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Cross-links */}
      <div className="max-w-7xl flex flex-wrap gap-2">
        <Link to={`${TRAINING}/saqa-modules`} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50">
          ← SAQA Module Library
        </Link>
        <Link to={TRAINING} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50">
          Training pillar
        </Link>
      </div>
    </Shell>
  );
}
