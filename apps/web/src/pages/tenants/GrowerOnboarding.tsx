/**
 * Step 3 of the ECRDA 2026/2027 MOA master delivery process.
 *
 * Grower Onboarding Support Programme — three pillars:
 *   (a) Training (5 modules: pre-plant, in-season, post-harvest, GACP/GAP, financial)
 *   (b) Farm Infrastructure (needs analysis + maintenance routines)
 *   (c) Production inputs & consumables management
 *
 * Routes:
 *   /tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding
 *     /training
 *     /farm-infrastructure
 *     /inputs-consumables
 */

import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';

const ACCENT = '#0E7490';
const ACCENT_A = '#15803d';  // green for Training
const ACCENT_B = '#7c2d12';  // earth brown for Infrastructure
const ACCENT_C = '#a16207';  // amber for Inputs

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities', href: '/cc/director' },
  { key: 'F6', label: 'Growers',      href: '/cc/growers' },
  { key: 'G',  label: 'Engagements',  href: '/cc/engagements' },
];

const MOA_BASE = '/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa';
const STEP3_BASE = `${MOA_BASE}/step-3-grower-onboarding`;

/* ─────────────── Shared breadcrumb ─────────────── */
function Crumbs({ pillar }: { pillar?: string }) {
  return (
    <nav className="text-xs text-slate-500 mb-3">
      <Link to="/cc/director" className="hover:underline">3Wi</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs/consulting" className="hover:underline">IBS Consulting</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs/consulting/hempire-ec" className="hover:underline">Hempire EC</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to={MOA_BASE} className="hover:underline">ECRDA 2026/2027 MOA</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      {pillar
        ? <>
            <Link to={STEP3_BASE} className="hover:underline">Step 3 · Grower Onboarding</Link>
            <span className="mx-1.5 text-slate-400">›</span>
            <span className="text-slate-900 font-semibold">{pillar}</span>
          </>
        : <span className="text-slate-900 font-semibold">Step 3 · Grower Onboarding Support Programme</span>}
    </nav>
  );
}

/* ─────────────── Reusable bits ─────────────── */
function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-900 mt-1">{value}</div>
      {sub ? <div className="text-xs text-slate-500 mt-0.5">{sub}</div> : null}
    </div>
  );
}

function PositionTile({ n, title, desc, current, href, external }: { n: number; title: string; desc: string; current?: boolean; href?: string; external?: boolean }) {
  const inner = (
    <>
      <div className="flex items-start gap-2 mb-1">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 ${current ? 'text-white' : 'bg-slate-100 text-slate-700'}`}
              style={current ? { background: '#0E7490' } : {}}>{n}</span>
        <h5 className="text-sm font-bold text-slate-900 leading-tight">{title}</h5>
      </div>
      <p className="text-xs text-slate-600 ml-9">{desc}</p>
      {current
        ? <span className="absolute top-1 right-2 text-[10px] font-bold uppercase text-[#0E7490]">You are here</span>
        : href ? <div className="ml-9 mt-2 text-xs font-semibold text-[#0E7490]">{external ? 'Open ↗' : 'Open →'}</div> : null}
    </>
  );
  const baseCls = `relative block rounded-xl border-2 p-3 transition-all ${current ? 'border-[#0E7490] bg-[#0E7490]/5' : 'border-slate-200 bg-white hover:border-[#0E7490] hover:shadow-md'}`;
  if (current || !href) {
    return <div className={baseCls}>{inner}</div>;
  }
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={baseCls}>{inner}</a>;
  }
  return <Link to={href} className={baseCls}>{inner}</Link>;
}

function PillarTile({
  href, letter, title, tagline, bullets, colour,
}: {
  href: string; letter: string; title: string; tagline: string; bullets: string[]; colour: string;
}) {
  return (
    <Link
      to={href}
      className="group block rounded-xl border-2 border-slate-200 hover:shadow-md bg-white p-6 transition-all"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colour)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-white text-lg font-bold uppercase"
              style={{ background: colour }}>{letter}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-xs text-slate-600 mb-3">{tagline}</p>
      <ul className="text-xs text-slate-500 space-y-0.5">
        {bullets.map(b => <li key={b}>• {b}</li>)}
      </ul>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: colour }}>
        Open pillar →
      </div>
    </Link>
  );
}

function Phase({ n, title, duration, activities, deliverable, gate, colour }: {
  n: number; title: string; duration?: string; activities: string[]; deliverable: string; gate?: string; colour: string;
}) {
  return (
    <li className="ml-6">
      <span className="absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
            style={{ background: colour }}>{n}</span>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        {duration ? <span className="text-xs font-mono text-slate-500">{duration}</span> : null}
      </div>
      <ul className="text-sm text-slate-700 list-disc ml-5 space-y-0.5 mb-2">
        {activities.map(a => <li key={a}>{a}</li>)}
      </ul>
      <div className="text-xs text-slate-600">
        <span className="font-semibold">Deliverable:</span> {deliverable}
      </div>
      {gate ? (
        <div className="mt-2 inline-block text-xs font-semibold px-2 py-1 rounded"
             style={{ background: `${colour}15`, color: colour }}>
          ────── GATE: {gate} ──────
        </div>
      ) : null}
    </li>
  );
}

function ModuleCard({ n, title, format, content, accent, href }: { n: string; title: string; format: string; content: string[]; accent: string; href?: string }) {
  const inner = (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold"
              style={{ background: accent }}>{n}</span>
        <h5 className="text-sm font-bold text-slate-900">{title}</h5>
      </div>
      <div className="text-xs font-mono text-slate-500 mb-2">Format: {format}</div>
      <ul className="text-xs text-slate-700 list-disc ml-4 space-y-0.5">
        {content.map(c => <li key={c}>{c}</li>)}
      </ul>
      {href ? (
        <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-semibold flex items-center justify-between" style={{ color: accent }}>
          <span>Open SAQA spec + PoE</span>
          <span>→</span>
        </div>
      ) : null}
    </>
  );
  if (href) {
    return (
      <Link to={href} className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-[#15803d] hover:shadow-md transition-all">
        {inner}
      </Link>
    );
  }
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      {inner}
    </div>
  );
}

function RaciTable({ headers, rows }: { headers: string[]; rows: (string|string[])[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left px-2 py-2 font-semibold">Role</th>
            {headers.map(h => <th key={h} className="px-2 py-2 font-semibold text-center">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const role = r[0] as string;
            const cells = r.slice(1) as string[];
            return (
              <tr key={role} className="border-t border-slate-100">
                <td className="px-2 py-1.5 font-medium">{role}</td>
                {cells.map((c, i) => <td key={i} className="px-2 py-1.5 text-center font-mono">{c}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function WorkflowShell({
  pillar, name, tagline, accent, badge, badgeColour, kpis, children,
}: {
  pillar: string; name: string; tagline: string; accent: string; badge: string; badgeColour?: string;
  kpis: { label: string; value: string; sub?: string }[];
  children: ReactNode;
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs pillar={pillar} />

      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${accent}33`, background: `${accent}0A` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: accent }}>{badge}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${accent}20`, color: accent }}>
                Step 3 · Grower Onboarding · Pillar {badgeColour ?? badge}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{name}</h1>
            <p className="text-sm text-slate-600 mt-1">{tagline}</p>
          </div>
        </div>
      </div>

      {kpis.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
          {kpis.map(k => <Kpi key={k.label} {...k} />)}
        </div>
      ) : null}

      <div className="space-y-4 max-w-6xl">{children}</div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  STEP 3 HUB
 * ══════════════════════════════════════════════════════════════════ */
export function GrowerOnboardingHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs />

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0A` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: ACCENT }}>3</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${ACCENT}20`, color: ACCENT }}>
                Master process · Step 3 of 3
              </span>
              <span className="text-xs text-slate-500">Final step — recruit, equip and develop the grower</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Grower Onboarding Support Programme</h1>
            <p className="text-sm text-slate-600 mt-1">
              The grower-facing delivery layer. Recruit growers into a hub that already has a confirmed buyer (Step 1)
              and a tailored infrastructure blueprint (Step 2). Three pillars: <strong>Training</strong>,
              <strong> Farm Infrastructure</strong>, and <strong>Production Inputs &amp; Consumables</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        <Kpi label="Pillars" value="3" sub="Training · Infra · Inputs" />
        <Kpi label="Training modules" value="5" sub="Pre-plant → Financial" />
        <Kpi label="Programme cycle" value="One growing season" sub="~8 months end-to-end" />
        <Kpi label="Definition of Done" value="Cohort certified" sub="+ tracer scheduled" />
      </div>

      {/* Master process position */}
      <div className="max-w-6xl mb-4">
        <Card title="Position in the master process">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <PositionTile n={1} title="Offtaker vetting + TNA"
              href={`${MOA_BASE}/step-1-offtaker-vetting`}
              desc="Confirm market + capture support model." />
            <PositionTile n={2} title="Support hub blueprint"
              href="/hub-support-dashboard.html" external
              desc="Design hub infrastructure to meet TNA needs." />
            <PositionTile n={3} title="Grower onboarding programme" current
              desc="Recruit, train, equip + support growers in the hub." />
          </div>
          <p className="text-xs text-slate-500 italic mt-3">
            Growers enter Step 3 only after Steps 1 and 2 have produced a confirmed buyer and a functioning hub.
            That sequencing is the structural fix for the banking, GACP and offtaker uncertainty seen in Part 1.
          </p>
        </Card>
      </div>

      {/* Three pillar tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mb-6">
        <PillarTile href={`${STEP3_BASE}/training`} letter="a" colour={ACCENT_A}
          title="Training"
          tagline="5 modules covering the full crop cycle and the financial side of running a farm as a business."
          bullets={['Pre-planting', 'In-season operations', 'Post-harvest', 'GACP / GAP', 'Financial fundamentals']} />
        <PillarTile href={`${STEP3_BASE}/farm-infrastructure`} letter="b" colour={ACCENT_B}
          title="Farm Infrastructure"
          tagline="Per-farm needs analysis + co-funded infrastructure + ongoing maintenance routines."
          bullets={['Infrastructure needs analysis', 'Spec design + procurement', 'Operator hand-over', 'Quarterly maintenance routines']} />
        <PillarTile href={`${STEP3_BASE}/inputs-consumables`} letter="c" colour={ACCENT_C}
          title="Production Inputs &amp; Consumables"
          tagline="Centralised sourcing + per-grower allocation + usage tracking. Reduces input cost and quality variance."
          bullets={['Demand forecast per cohort', 'Bulk sourcing + procurement', 'Per-grower allocation + delivery', 'Usage tracking + replenishment']} />
      </div>

      {/* Sequencing note */}
      <div className="max-w-6xl">
        <Card title="How the three pillars sequence in time">
          <div className="text-sm text-slate-700 space-y-2">
            <pre className="bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono overflow-x-auto">{`Month 0   Cohort recruitment (cross-pillar)
Month 1   Pillar A: Training Module i (Pre-planting)        ◄── season opener
          Pillar B: Infrastructure needs analysis per farm
          Pillar C: Procurement plan + sourcing
Month 2   Pillar B: Infrastructure install / upgrade
          Pillar C: Pre-planting input distribution
Month 3-4 Pillar A: Training Module ii (In-season ops)       ◄── ongoing
          Pillar C: In-season input replenishment
Month 5   Pillar A: Training Module iii (Post-harvest)
          Pillar B: Harvest equipment readiness check
Month 6   Pillar A: Training Module iv (GACP/GAP) + Mod v (Financial)
          Pillar B: Maintenance routine setup
Month 7   Cohort assessment + certification
Month 8+  Tracer + next-season planning`}</pre>
            <p className="text-xs text-slate-500 italic">
              The three pillars run concurrently — they're not sequential. The cohort experiences them as one
              integrated programme, not three separate workstreams.
            </p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PILLAR (a) — TRAINING
 * ══════════════════════════════════════════════════════════════════ */
export function TrainingPillarPage() {
  return (
    <WorkflowShell pillar="Training" name="Training" tagline="5 modules delivered across the growing season. Classroom + field + financial coaching."
      accent={ACCENT_A} badge="a" badgeColour="(a)"
      kpis={[
        { label: 'Modules',  value: '5',                sub: 'Pre-plant → Financial' },
        { label: 'Delivery', value: 'Classroom + field',sub: 'On-farm demos prioritised' },
        { label: 'Languages',value: 'English · isiXhosa',sub: 'Afrikaans on request' },
        { label: 'Assessment', value: 'Per module + final',sub: 'Cert on pass' },
      ]}
    >
      <Card title="5 training modules">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <ModuleCard n="i" accent={ACCENT_A} title="Pre-planting" format="1 day classroom + 1 day field"
            href={`${STEP3_BASE}/training/saqa-modules/pre-planting`}
            content={['Soil prep + amendments','Cultivar selection per offtaker spec','Seedling handling + transplanting','Plot layout + spacing','Irrigation setup']} />
          <ModuleCard n="ii" accent={ACCENT_A} title="In-season operations" format="Ongoing field sessions + monthly cohort calls"
            href={`${STEP3_BASE}/training/saqa-modules/in-season`}
            content={['Pest + disease scouting','Irrigation + water mgmt','Nutrition + fertiliser','Pruning + canopy mgmt','Growth-stage monitoring + reporting']} />
          <ModuleCard n="iii" accent={ACCENT_A} title="Post-harvest activities" format="2-day intensive at harvest"
            href={`${STEP3_BASE}/training/saqa-modules/post-harvest`}
            content={['Harvest timing + method','Drying + curing protocols','Storage conditions','Quality grading basics','Transport prep']} />
          <ModuleCard n="iv" accent={ACCENT_A} title="GACP / GAP compliance" format="1-day cert preparation"
            href={`${STEP3_BASE}/training/saqa-modules/gacp-gap`}
            content={['Record-keeping standards','Traceability + batch labelling','Pesticide register','Audit readiness','Mock audit walkthrough']} />
          <ModuleCard n="v" accent={ACCENT_A} title="Financial aspects of primary production" format="1-day workshop + follow-up coaching"
            href={`${STEP3_BASE}/training/saqa-modules/financial`}
            content={['Cash-flow basics for a farm','Banking + SARS basics','Contract reading + pricing','Cost-of-production calc','Reinvestment + saving plan']} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/training/saqa-modules"
             className="px-4 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: '#15803d' }}>
            📚 Open SAQA Module Library
          </a>
          <a href="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding/training/dashboard"
             className="px-4 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: '#0E7490' }}>
            📊 Open Training Dashboard
          </a>
        </div>
      </Card>

      <Card title="Programme workflow">
        <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
          <Phase n={1} colour={ACCENT_A} title="Cohort needs assessment" duration="2 weeks"
            activities={['Baseline skills survey per farmer','Site visits to participating farms','Identify gaps + customisation needs','Confirm language + accessibility needs']}
            deliverable="Baseline assessment report" gate="Cohort scope sign-off" />
          <Phase n={2} colour={ACCENT_A} title="Curriculum customisation per cohort" duration="2 weeks"
            activities={['Adjust module content to cohort baseline','Localise examples + case studies','Schedule delivery dates per module','Confirm trainers + venues']}
            deliverable="Cohort training plan" />
          <Phase n={3} colour={ACCENT_A} title="Module delivery (i–v)" duration="6 months"
            activities={['Deliver each module per schedule','Capture attendance per session','Formative assessments at module end','Mentor / coach 1:1s between modules']}
            deliverable="Module completion records" />
          <Phase n={4} colour={ACCENT_A} title="Final assessment + certification" duration="1 month"
            activities={['Written final assessment','Practical observation on-farm','Marking + verification','Issue certificates to passing learners','Statement of Results for SETA reporting']}
            deliverable="Certified farmers + SoR" gate="Pass mark per farmer" />
          <Phase n={5} colour={ACCENT_A} title="Tracer + season review" duration="3 / 6 / 12 months post-cert"
            activities={['Yield + income tracking','Behaviour-change check-ins','Lessons-learned capture','Curriculum updates for next cohort']}
            deliverable="Tracer report" />
        </ol>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="RACI">
          <RaciTable
            headers={['Assess', 'Custom', 'Deliver', 'Certify', 'Tracer']}
            rows={[
              ['Programme Manager',   'A R', 'A R', 'A',   'A R', 'A R'],
              ['Lead Facilitator',    'R',   'A R', 'A R', 'R',   'C'],
              ['Mentor / Coach',      'C',   'C',   'R',   'C',   'R'],
              ['Assessor / Moderator','I',   'I',   'C',   'A R', 'I'],
              ['Farmer',              'C',   'I',   'R',   'R',   'R'],
            ]}
          />
        </Card>
        <Card title="Standard tooling + Definition of Done">
          <div className="text-sm text-slate-700 space-y-2">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Tooling</div>
              <p>Notion / Airtable (cohort tracking + curriculum), KoBoToolbox (field surveys), WhatsApp Business (cohort comms), Google Drive (materials archive), SETA portals (where accredited).</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Definition of Done</div>
              <p>Cohort certified, SoR issued, tracer scheduled, curriculum updates logged for the next cohort.</p>
            </div>
          </div>
        </Card>
      </div>
    </WorkflowShell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PILLAR (b) — FARM INFRASTRUCTURE
 * ══════════════════════════════════════════════════════════════════ */
export function FarmInfrastructurePillarPage() {
  return (
    <WorkflowShell pillar="Farm Infrastructure" name="Farm Infrastructure"
      tagline="Per-farm needs analysis, co-funded infrastructure delivery, and ongoing maintenance routines."
      accent={ACCENT_B} badge="b" badgeColour="(b)"
      kpis={[
        { label: 'Sub-pillars',  value: '2',          sub: 'Needs analysis + Maintenance' },
        { label: 'Survey unit',  value: 'Per farm',   sub: 'Custom spec per grower' },
        { label: 'Maintenance',  value: 'Quarterly',  sub: 'PM schedule per asset' },
        { label: 'Co-funding',   value: 'Hub + farmer + grant', sub: 'Cost-share model' },
      ]}
    >
      <Card title="Two sub-pillars">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold uppercase"
                    style={{ background: ACCENT_B }}>i</span>
              <h5 className="text-sm font-bold text-slate-900">Infrastructure needs analysis</h5>
            </div>
            <ul className="text-xs text-slate-700 list-disc ml-4 space-y-1">
              <li>Site survey + asset register</li>
              <li>Gap analysis vs cultivation + post-harvest requirements</li>
              <li>Capex + opex sizing per farm</li>
              <li>Co-funding model (hub / farmer / grant)</li>
              <li>Spec design + procurement plan</li>
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold uppercase"
                    style={{ background: ACCENT_B }}>ii</span>
              <h5 className="text-sm font-bold text-slate-900">Infrastructure maintenance routines</h5>
            </div>
            <ul className="text-xs text-slate-700 list-disc ml-4 space-y-1">
              <li>Preventive maintenance schedule per asset type</li>
              <li>Daily / weekly farmer check-list</li>
              <li>Quarterly hub-led PM visit</li>
              <li>Maintenance log + photo evidence</li>
              <li>Annual asset condition review + budget refresh</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Programme workflow">
        <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
          <Phase n={1} colour={ACCENT_B} title="Site survey + needs analysis" duration="1–2 weeks per farm"
            activities={['On-farm visit to map existing assets','Cultivation + post-harvest requirements check','Identify infrastructure gaps','Photo + GPS documentation']}
            deliverable="Per-farm needs analysis report" />
          <Phase n={2} colour={ACCENT_B} title="Infrastructure spec design" duration="2 weeks"
            activities={['Spec design per identified gap (irrigation, tunnel, drying, storage, fencing)','Capex + opex sizing','Co-funding split decision (hub / farmer / grant)','Vendor + supplier quotes']}
            deliverable="Spec sheet + quote pack" gate="Co-funding agreement signed" />
          <Phase n={3} colour={ACCENT_B} title="Procurement + install / upgrade" duration="4–8 weeks"
            activities={['Procurement coordinated through hub for scale + price','Install via vendor or hub team','Acceptance test per spec','Snag list close-out']}
            deliverable="Installed + commissioned infrastructure" gate="Acceptance test pass" />
          <Phase n={4} colour={ACCENT_B} title="Operator handover" duration="1 week"
            activities={['Operator training (theory + hands-on)','Operating manual + spare-parts list','Warranty hand-over','First maintenance check scheduled']}
            deliverable="Operator certified + warranty active" />
          <Phase n={5} colour={ACCENT_B} title="Maintenance routine setup" duration="Continuous"
            activities={['Per-asset PM schedule defined','Daily / weekly farmer checklist issued','Quarterly hub PM visits scheduled','Maintenance log activated']}
            deliverable="Live maintenance schedule + log" />
          <Phase n={6} colour={ACCENT_B} title="Quarterly review" duration="Per quarter"
            activities={['Asset condition review','Maintenance log audit','Findings + remediation','Plan next quarter']}
            deliverable="Quarterly maintenance report" />
        </ol>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="RACI">
          <RaciTable
            headers={['Survey', 'Spec', 'Install', 'Handover', 'Maintain']}
            rows={[
              ['Hub Operations Lead', 'A R', 'A R', 'A R', 'A',   'A R'],
              ['Field Engineer',      'R',   'R',   'R',   'R',   'R'],
              ['Vendor',              'I',   'C',   'R',   'R',   'C'],
              ['Farmer',              'A',   'A',   'C',   'R',   'R'],
              ['Programme Manager',   'C',   'A',   'C',   'A',   'C'],
            ]}
          />
        </Card>
        <Card title="Standard tooling + Definition of Done">
          <div className="text-sm text-slate-700 space-y-2">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Tooling</div>
              <p>Notion (asset register), KoBoToolbox / Forms (site surveys), CMMS (UpKeep / Maintainly) for maintenance schedule, WhatsApp Business (farmer check-ins), DocuSign (co-funding agreements).</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Definition of Done</div>
              <p>Asset commissioned + operator certified + maintenance schedule live + first quarterly review delivered.</p>
            </div>
          </div>
        </Card>
      </div>
    </WorkflowShell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PILLAR (c) — INPUTS & CONSUMABLES
 * ══════════════════════════════════════════════════════════════════ */
export function InputsConsumablesPillarPage() {
  return (
    <WorkflowShell pillar="Inputs & Consumables" name="Production Inputs &amp; Consumables Management"
      tagline="Centralised sourcing, per-grower allocation, usage tracking, replenishment. Reduces unit cost and quality variance."
      accent={ACCENT_C} badge="c" badgeColour="(c)"
      kpis={[
        { label: 'Sourcing model',    value: 'Hub-centralised', sub: 'Bulk + standardised' },
        { label: 'Allocation',         value: 'Per grower',     sub: 'Demand-forecast driven' },
        { label: 'Cold-chain ready',   value: 'Yes',            sub: 'For seedlings + biologicals' },
        { label: 'Tracking',           value: 'Per batch + grower',sub: 'WMS + per-farm ledger' },
      ]}
    >
      <Card title="Input categories handled">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="text-left py-1 px-2">Category</th>
              <th className="text-left px-2">Examples</th>
              <th className="text-left px-2">Cold-chain?</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100"><td className="py-2 px-2 font-medium">Seedlings + planting material</td><td>Certified hemp seedlings, mother stock</td><td>Yes</td></tr>
            <tr className="border-t border-slate-100"><td className="py-2 px-2 font-medium">Fertilisers</td><td>NPK blends, micro-nutrients, organic amendments</td><td>No</td></tr>
            <tr className="border-t border-slate-100"><td className="py-2 px-2 font-medium">Biological inputs</td><td>Biofertilisers, biostimulants, mycorrhiza</td><td>Yes</td></tr>
            <tr className="border-t border-slate-100"><td className="py-2 px-2 font-medium">Crop protection</td><td>IPM-aligned pest + disease control</td><td>Some</td></tr>
            <tr className="border-t border-slate-100"><td className="py-2 px-2 font-medium">Irrigation consumables</td><td>Drip line, fittings, filters, replacement parts</td><td>No</td></tr>
            <tr className="border-t border-slate-100"><td className="py-2 px-2 font-medium">Harvest + post-harvest</td><td>Bags, twine, drying nets, labels, packaging</td><td>No</td></tr>
            <tr className="border-t border-slate-100"><td className="py-2 px-2 font-medium">PPE + safety</td><td>Gloves, masks, eyewear, first-aid</td><td>No</td></tr>
          </tbody>
        </table>
      </Card>

      <Card title="Programme workflow">
        <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
          <Phase n={1} colour={ACCENT_C} title="Demand forecast per cohort" duration="2 weeks pre-season"
            activities={['Per-farm cultivation plan (Ha + crop)','Per-farm input requirement calc','Aggregate cohort demand','Buffer + safety stock sizing']}
            deliverable="Cohort demand schedule" gate="Programme Manager sign-off" />
          <Phase n={2} colour={ACCENT_C} title="Sourcing + procurement" duration="3–6 weeks pre-season"
            activities={['Approved-supplier list maintenance','RFQ + supplier selection','Bulk purchase orders','Inbound logistics planning']}
            deliverable="POs placed + delivery dates confirmed" />
          <Phase n={3} colour={ACCENT_C} title="Inbound + stock management" duration="Continuous"
            activities={['Goods-receiving + QC at hub','Cold-chain storage where required','Stock ledger + barcode tracking (WMS)','Expiry / shelf-life monitoring']}
            deliverable="Inputs available at hub, traceable + dated" />
          <Phase n={4} colour={ACCENT_C} title="Per-grower allocation" duration="Per cycle (typically monthly)"
            activities={['Allocation against demand schedule','Adjustments for actual usage','Per-farm pack assembly','Allocation manifest issued']}
            deliverable="Per-grower pack ready for collection / delivery" />
          <Phase n={5} colour={ACCENT_C} title="Distribution + delivery" duration="Per cycle"
            activities={['Farmer collection at hub OR last-mile delivery','Sign-off on receipt','Per-farm ledger update','Returns / unused stock reverse-logistics']}
            deliverable="Inputs in farmer\'s hands + signed acceptance" />
          <Phase n={6} colour={ACCENT_C} title="Usage tracking + reorder" duration="Continuous"
            activities={['Per-farm usage reporting (WhatsApp / app)','Variance analysis (actual vs planned)','Reorder triggers based on stock + lead time','Quarterly category-spend review']}
            deliverable="Live stock levels + replenishment orders" />
        </ol>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="RACI">
          <RaciTable
            headers={['Forecast', 'Source', 'Stock', 'Allocate', 'Deliver', 'Reorder']}
            rows={[
              ['Hub Procurement Lead', 'A R', 'A R', 'A R', 'A R', 'A',   'A R'],
              ['Programme Manager',    'A',   'A',   'C',   'A',   'C',   'A'],
              ['Warehouse / WMS team', 'C',   'I',   'R',   'R',   'R',   'R'],
              ['Field Coordinator',    'R',   'I',   'I',   'R',   'R',   'R'],
              ['Farmer',               'R',   'I',   'I',   'C',   'R',   'C'],
              ['Supplier',             'I',   'R',   'I',   'I',   'C',   'C'],
            ]}
          />
        </Card>
        <Card title="Standard tooling + Definition of Done">
          <div className="text-sm text-slate-700 space-y-2">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Tooling</div>
              <p>ERP (Pastel / Sage X3) for POs + supplier ledger, WMS (Odoo / custom) for stock + per-farm allocation, WhatsApp Business for farmer usage reports, Power BI for spend + variance dashboards.</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Definition of Done</div>
              <p>Stock available + traceable, per-farm allocations honoured, usage reported, replenishment ordered before stock-out, quarterly category-spend review delivered.</p>
            </div>
          </div>
        </Card>
      </div>
    </WorkflowShell>
  );
}
