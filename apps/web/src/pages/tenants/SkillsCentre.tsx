/**
 * Skills Centre — service hub + 5 productised programme workflows.
 *
 * Replaces the old SkillsCentrePage (which was a flat workspace).
 * Now a hub with 5 service tiles, each opening a detail page with
 * phases, deliverables, RACI, gates, tooling, and a live "Engage"
 * button that opens the EngagementIntakeModal.
 *
 *   1. SETA Learnerships
 *   2. Farmer Training
 *   3. Corporate Workshops
 *   4. Train-the-Trainer
 *   5. Custom Programmes
 *
 * Breadcrumb:
 *   3Wi › IBS › Rainmaker › 3Wi Shared Services › UpSkill Training › Skills Centre
 */

import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { EngagementIntakeModal, type ServicePreset } from '../../components/engagements/EngagementIntakeModal';

const SC_PRIMARY = '#7C3AED';   // amethyst
const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities', href: '/cc/director' },
  { key: 'F6', label: 'Growers',      href: '/cc/growers' },
  { key: 'G',  label: 'Engagements',  href: '/cc/engagements' },
];

/* ──────────────────────────────────────────────────────────────────
 *  Shared breadcrumb
 * ────────────────────────────────────────────────────────────────── */
function Breadcrumb({ service }: { service?: string }) {
  return (
    <nav className="text-xs text-slate-500 mb-3">
      <Link to="/cc/director" className="hover:underline">3Wi</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs/rainmaker" className="hover:underline">Rainmaker</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs/rainmaker/3wi-shared-services" className="hover:underline">3Wi Shared Services</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      <Link to="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training" className="hover:underline">UpSkill Training</Link>
      <span className="mx-1.5 text-slate-400">›</span>
      {service
        ? <>
            <Link to="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/skills-centre" className="hover:underline">Skills Centre</Link>
            <span className="mx-1.5 text-slate-400">›</span>
            <span className="text-slate-900 font-semibold">{service}</span>
          </>
        : <span className="text-slate-900 font-semibold">Skills Centre</span>}
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  SKILLS CENTRE HUB
 * ────────────────────────────────────────────────────────────────── */
export function SkillsCentreHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb />

      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: SC_PRIMARY }}>
          UpSkill · Accredited delivery
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Skills Centre</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Accredited training delivery — five productised programmes. Each has a documented workflow,
          deliverables, RACI and pricing model so it can be quoted, contracted, delivered and audited.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <ServiceTile
          slug="seta-learnerships"
          name="SETA Learnerships"
          initials="SL"
          tagline="12-month NQF-accredited qualifications. Two customers: corporate sponsor + learner."
          duration="12 months"
          pricing="Per learner · SETA-discounted"
          colour="#6D28D9"
          highlights={['NQF Level 2–5', 'BBBEE scorecard input', 'Stipend admin', 'Portfolio of Evidence']}
        />
        <ServiceTile
          slug="farmer-training"
          name="Farmer Training"
          initials="FT"
          tagline="Cohort-based field training: planting, in-season, harvest, post-harvest, GACP/GAP."
          duration="6 weeks per cohort"
          pricing="Per cohort · sponsor-funded"
          colour="#7C3AED"
          highlights={['Field practical', 'Site visits', 'GACP/GAP compliance', 'Cohort report to sponsor']}
        />
        <ServiceTile
          slug="corporate-workshops"
          name="Corporate Workshops"
          initials="CW"
          tagline="Short courses for corporate teams — leadership, sales, ops, soft skills."
          duration="1–3 days"
          pricing="Per delegate or per workshop"
          colour="#8B5CF6"
          highlights={['In-person / hybrid / online', 'CPD points where eligible', 'Same-day feedback', '30/60/90 follow-up option']}
        />
        <ServiceTile
          slug="train-the-trainer"
          name="Train-the-Trainer"
          initials="TT"
          tagline="Equip client's own trainers to deliver a Skills Centre programme under licence."
          duration="2 weeks intensive + ongoing"
          pricing="Per trainer + content licence"
          colour="#9333EA"
          highlights={['Master class', 'Co-delivery shadowing', 'Certification', 'Quarterly CoP']}
        />
        <ServiceTile
          slug="custom-programmes"
          name="Custom Programmes"
          initials="CP"
          tagline="Bespoke programmes built to a client's specific competency need. Optional accreditation."
          duration="8–16 weeks (typical)"
          pricing="Custom proposal"
          colour="#A855F7"
          highlights={['Discovery + needs analysis', 'Optional accreditation pathway', 'Pilot then scale', 'Ongoing programme mgmt']}
        />
      </div>

      <div className="mt-8 max-w-6xl">
        <Card title="How these 5 services compound">
          <div className="text-sm text-slate-700 space-y-2">
            <p>
              A corporate buying <strong>Workshops</strong> often funds a <strong>Learnership</strong> the next year.
              A sponsor running <strong>Farmer Training</strong> may need a <strong>Train-the-Trainer</strong> roll-out
              when they want regional scale. <strong>Custom Programmes</strong> is the entry point for new sectors —
              once piloted, the curriculum becomes another standardised offering.
            </p>
            <p className="text-xs text-slate-500 italic">
              All five share a common backbone: QCTO + SETA accreditation, internal LMS, external moderation, BBBEE
              scorecard data, and learner tracer studies. Adding a programme is incremental work, not net-new infrastructure.
            </p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Hub tile
 * ────────────────────────────────────────────────────────────────── */
function ServiceTile({
  slug, name, initials, tagline, duration, pricing, colour, highlights,
}: {
  slug: string;
  name: string;
  initials: string;
  tagline: string;
  duration: string;
  pricing: string;
  colour: string;
  highlights: string[];
}) {
  return (
    <Link
      to={`/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/skills-centre/${slug}`}
      className="group block rounded-xl border-2 border-slate-200 hover:shadow-md bg-white p-6 transition-all"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colour)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-white text-sm font-bold"
              style={{ background: colour }}>
          {initials}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${colour}15`, color: colour }}>
          {duration}
        </span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{name}</h2>
      <p className="text-xs text-slate-600 mb-3">{tagline}</p>
      <div className="text-xs font-mono text-slate-700 mb-3">{pricing}</div>
      <div className="text-xs text-slate-500 space-y-0.5">
        {highlights.map((h) => <div key={h}>• {h}</div>)}
      </div>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: colour }}>
        Open workflow &nbsp;→
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Reusable service detail shell (same shape as Knockout)
 * ────────────────────────────────────────────────────────────────── */
function ServiceDetail({
  name, tagline, badge, colour, initials, breadcrumbName,
  facts, phases, raciHeaders, raciRows, tooling, definitionOfDone, pricingNotes,
  engagePreset,
}: {
  name: string;
  tagline: string;
  badge: string;
  colour: string;
  initials: string;
  breadcrumbName: string;
  facts: { label: string; value: string }[];
  phases: { step: string; label: string; activities: string[]; deliverable: string; duration?: string; gate?: string }[];
  raciHeaders: string[];
  raciRows: { role: string; cells: string[] }[];
  tooling: string;
  definitionOfDone: string;
  pricingNotes: string;
  engagePreset: ServicePreset;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb service={breadcrumbName} />

      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${colour}33`, background: `${colour}08` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: colour }}>{initials}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${colour}20`, color: colour }}>
                {badge}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{name}</h1>
            <p className="text-sm text-slate-600 mt-1">{tagline}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        {facts.map((f) => (
          <div key={f.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{f.label}</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{f.value}</div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mb-6">
        <Card title="Workflow — phases, activities, gates">
          <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            {phases.map((p, idx) => (
              <li key={p.step} className="ml-6">
                <span className="absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                      style={{ background: colour }}>
                  {idx + 1}
                </span>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h4 className="text-base font-bold text-slate-900">{p.label}</h4>
                  {p.duration ? <span className="text-xs font-mono text-slate-500">{p.duration}</span> : null}
                </div>
                <ul className="text-sm text-slate-700 list-disc ml-5 space-y-0.5 mb-2">
                  {p.activities.map((a) => <li key={a}>{a}</li>)}
                </ul>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold">Deliverable:</span> {p.deliverable}
                </div>
                {p.gate ? (
                  <div className="mt-2 inline-block text-xs font-semibold px-2 py-1 rounded"
                       style={{ background: `${colour}15`, color: colour }}>
                    ────── GATE: {p.gate} ──────
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 max-w-6xl">
        <Card title="RACI — Responsible · Accountable · Consulted · Informed">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-2 py-2 font-semibold">Role</th>
                  {raciHeaders.map((h) => (
                    <th key={h} className="px-2 py-2 font-semibold text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {raciRows.map((r) => (
                  <tr key={r.role} className="border-t border-slate-100">
                    <td className="px-2 py-1.5 font-medium">{r.role}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className="px-2 py-1.5 text-center font-mono">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Pricing + Definition of Done">
          <div className="text-sm text-slate-700 space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Pricing</div>
              <p>{pricingNotes}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Definition of Done</div>
              <p>{definitionOfDone}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="max-w-6xl mb-6">
        <Card title="Standard tooling stack">
          <p className="text-sm text-slate-700">{tooling}</p>
        </Card>
      </div>

      {/* Engage CTA */}
      <div className="max-w-6xl">
        <div className="rounded-xl border-2 p-5 flex items-center justify-between gap-4"
             style={{ borderColor: `${colour}55`, background: `${colour}05` }}>
          <div className="text-sm" style={{ color: colour }}>
            <span className="font-semibold">Engage this service →</span>{' '}
            Submit a request and our team will scope, contract and schedule kick-off.
          </div>
          <button type="button" onClick={() => setOpen(true)}
                  className="px-5 py-2 rounded-lg text-white font-semibold text-sm shrink-0"
                  style={{ background: colour }}>
            Engage
          </button>
        </div>
        <EngagementIntakeModal isOpen={open} onClose={() => setOpen(false)} preset={engagePreset} />
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  1 · SETA LEARNERSHIPS
 * ══════════════════════════════════════════════════════════════════ */
export function SetaLearnershipsPage() {
  return (
    <ServiceDetail
      name="SETA Learnerships"
      tagline="12-month NQF-accredited learnerships funded by corporate sponsors via the BBBEE skills levy."
      badge="Service 1 of 5"
      colour="#6D28D9"
      initials="SL"
      breadcrumbName="SETA Learnerships"
      facts={[
        { label: 'Duration',         value: '12 months' },
        { label: 'NQF level',        value: 'Levels 2–5' },
        { label: 'Pricing',          value: 'Per learner' },
        { label: 'BBBEE',            value: 'Skills + ED spend' },
      ]}
      phases={[
        { step: '1', label: 'Sponsor MoA + funding agreement', duration: '2 weeks',
          activities: ['Confirm qualification + NQF level', 'Cohort size + duration', 'Pricing per learner + stipend amount', 'BBBEE scorecard target'],
          deliverable: 'Signed MoA + first instalment invoice', gate: 'Sponsor signature' },
        { step: '2', label: 'Learner recruitment + selection', duration: '3 weeks',
          activities: ['Advertise (local + sponsor channels)', 'Application screening', 'Interview shortlist', 'Selection panel + offer letters'],
          deliverable: 'Signed learner contracts + roll', gate: 'Sponsor sign-off on roll' },
        { step: '3', label: 'Induction + onboarding', duration: '1 week',
          activities: ['Programme orientation', 'Stipend admin + banking', 'PoE template walkthrough', 'Mentor allocation'],
          deliverable: 'Inducted cohort + welcome pack' },
        { step: '4', label: 'Classroom delivery', duration: 'Months 1–6',
          activities: ['Weekly classroom (in-person or hybrid)', 'Formative assessments', 'Mentor 1:1s (bi-weekly)', 'Monthly attendance + progress report'],
          deliverable: 'Monthly progress reports to sponsor' },
        { step: '5', label: 'Workplace experience', duration: 'Months 4–10',
          activities: ['Placement at sponsor or partner workplace', 'Logbook capture (daily)', 'Workplace supervisor sign-off (weekly)', 'Site visits by Skills Centre coach'],
          deliverable: 'Completed workplace logbook' },
        { step: '6', label: 'Portfolio of Evidence compilation', duration: 'Months 8–11',
          activities: ['PoE assembly per unit standard', 'Evidence quality reviews', 'Gap-close interventions', 'Pre-moderation by internal assessor'],
          deliverable: 'PoE pack ready for external moderation' },
        { step: '7', label: 'External moderation', duration: 'Month 11',
          activities: ['Submit PoE to ETQA', 'External moderator visit', 'Address moderation findings'],
          deliverable: 'Moderation report (passed/findings)', gate: 'ETQA pass' },
        { step: '8', label: 'Summative assessment', duration: 'Month 12',
          activities: ['Final assessment delivery', 'Marking + verification'],
          deliverable: 'Assessment results' },
        { step: '9', label: 'Certification + SoR', duration: 'Month 12',
          activities: ['Statement of Results issued', 'NQF credits uploaded to NLRD', 'BBBEE scorecard data pack to sponsor'],
          deliverable: 'SoR + sponsor scorecard input' },
        { step: '10', label: 'Placement + tracer study', duration: '3 / 6 / 12 month follow-up',
          activities: ['Placement support', 'Tracer survey at 3/6/12 months', 'Employment-outcome report to sponsor'],
          deliverable: 'Tracer report' },
      ]}
      raciHeaders={['Recruit', 'Induct', 'Classroom', 'Workplace', 'PoE', 'Moderation', 'SoR', 'Tracer']}
      raciRows={[
        { role: 'Programme Manager',     cells: ['A R','A R','A',  'A R','A',  'A R','A R','A R'] },
        { role: 'Lead Facilitator',     cells: ['C',  'R',  'A R','C',  'R',  'C',  'I',  'I'] },
        { role: 'Workplace Mentor',     cells: ['I',  'C',  'C',  'R',  'C',  'I',  'I',  'C'] },
        { role: 'Internal Assessor',    cells: ['I',  'I',  'C',  'C',  'A R','R',  'C',  'I'] },
        { role: 'External Moderator',   cells: ['I',  'I',  'I',  'I',  'C',  'A',  'I',  'I'] },
        { role: 'Sponsor (corporate)',  cells: ['A',  'I',  'I',  'A',  'I',  'I',  'A',  'C'] },
      ]}
      tooling="LMS (Moodle / Open edX), Stripe / EFT for stipends, Google Drive / Notion for PoE, ETQA / SETA portals for moderation, Looker for tracer reporting."
      definitionOfDone="Statement of Results issued, NQF credits on NLRD, BBBEE data pack to sponsor, 3-month tracer survey complete."
      pricingNotes="Per-learner fee (typically R 30 000 – R 50 000). Most sponsors recover via mandatory + discretionary BBBEE skills grants. Stipend pass-through invoiced separately."
      engagePreset={{
        serviceUnit: 'skills-centre',
        serviceSlug: 'seta-learnerships',
        serviceName: 'SETA Learnerships',
        accent: '#6D28D9',
        scopeFields: [
          { key: 'nqfLevel',  label: 'NQF Level',         options: ['NQF Level 2', 'NQF Level 3', 'NQF Level 4', 'NQF Level 5'] },
          { key: 'cohortSize',label: 'Number of learners',placeholder: 'e.g. 20' },
          { key: 'sector',    label: 'Industry sector',   placeholder: 'e.g. hemp, FMCG, retail' },
        ],
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  2 · FARMER TRAINING
 * ══════════════════════════════════════════════════════════════════ */
export function FarmerTrainingPage() {
  return (
    <ServiceDetail
      name="Farmer Training"
      tagline="6-week cohort programmes covering planting, in-season management, harvest, post-harvest and GACP/GAP compliance."
      badge="Service 2 of 5"
      colour="#7C3AED"
      initials="FT"
      breadcrumbName="Farmer Training"
      facts={[
        { label: 'Duration',     value: '6 weeks per cohort' },
        { label: 'Format',       value: 'Class + field' },
        { label: 'Pricing',      value: 'Per cohort' },
        { label: 'Funder',       value: 'Programme sponsor' },
      ]}
      phases={[
        { step: '1', label: 'Programme design with sponsor', duration: '2 weeks',
          activities: ['Crop / commodity scope (hemp, vegetable, livestock, etc.)', 'Cohort size + region', 'Funder reporting requirements', 'Curriculum customisation'],
          deliverable: 'Programme charter + signed scope', gate: 'Sponsor sign-off' },
        { step: '2', label: 'Cohort recruitment', duration: '1 week',
          activities: ['Liaise with coordinators in target region', 'Application screening', 'Confirm logistics (transport, accommodation if residential)'],
          deliverable: 'Confirmed learner roll' },
        { step: '3', label: 'Pre-training assessment', duration: '3 days',
          activities: ['Baseline skills survey', 'Site visit to participating farms', 'Pre-test (knowledge baseline)'],
          deliverable: 'Baseline assessment report' },
        { step: '4', label: 'Module 1 — Planting & cultivation', duration: 'Week 1',
          activities: ['Soil preparation + planning', 'Seedling handling + transplanting', 'Irrigation + nutrient basics', 'Practical: nursery + first beds'],
          deliverable: 'Module 1 attendance + assessment' },
        { step: '5', label: 'Module 2 — In-season management', duration: 'Week 2',
          activities: ['Pest + disease scouting', 'Pruning + canopy management', 'Fertigation scheduling', 'Practical: scouting walk on participant farms'],
          deliverable: 'Module 2 attendance + assessment' },
        { step: '6', label: 'Module 3 — Harvest & post-harvest', duration: 'Week 3',
          activities: ['Harvest timing + indicators', 'Drying + curing', 'Storage + packaging', 'Practical: harvest simulation'],
          deliverable: 'Module 3 attendance + assessment' },
        { step: '7', label: 'Module 4 — GACP / GAP compliance', duration: 'Week 4',
          activities: ['Record-keeping standards', 'Traceability + batch labelling', 'Pesticide register + WHO classification', 'Audit readiness checklist'],
          deliverable: 'GACP/GAP self-audit per learner' },
        { step: '8', label: 'Field practical + site visits', duration: 'Week 5',
          activities: ['Site visit to each participant farm', 'On-farm coaching', 'Photo + GPS documentation'],
          deliverable: 'Site-visit report per farm' },
        { step: '9', label: 'Final assessment + certification', duration: 'Week 6',
          activities: ['Written assessment', 'Practical observation', 'Certificate of completion issued'],
          deliverable: 'Certificates + final marks', gate: 'Pass mark per learner' },
        { step: '10', label: 'Cohort report + tracer', duration: 'Week 6 + ongoing',
          activities: ['Sponsor cohort report (attendance, results, photos)', 'Season tracer (yield, sales, lessons learned)', 'Recommendations for next cohort'],
          deliverable: 'Sponsor cohort report' },
      ]}
      raciHeaders={['Design', 'Recruit', 'Baseline', 'Module 1–4', 'Site visits', 'Cert', 'Report']}
      raciRows={[
        { role: 'Programme Manager',  cells: ['A R','A R','A',  'A R','A',  'A R','A R'] },
        { role: 'Lead Facilitator',  cells: ['R',  'C',  'R',  'R',  'R',  'R',  'C']   },
        { role: 'Field Coach',       cells: ['I',  'I',  'R',  'C',  'R',  'C',  'C']   },
        { role: 'Coordinator (regional)', cells: ['C', 'R','C',  'C',  'C',  'I',  'C']   },
        { role: 'Sponsor / Funder',  cells: ['A',  'I',  'I',  'I',  'I',  'I',  'A']   },
      ]}
      tooling="Notion / Airtable for cohort tracking, KoBoToolbox for field surveys, WhatsApp Business for learner comms, Google Drive for photo + report archive, GIS layer for site visit GPS."
      definitionOfDone="Cohort certified, sponsor report delivered, season tracer scheduled, photos + GPS archived in DAM."
      pricingNotes="Per-cohort price (typically R 50 000 – R 150 000 per 20-learner cohort, depending on field-visit travel). Sponsor funds 100% in most cases."
      engagePreset={{
        serviceUnit: 'skills-centre',
        serviceSlug: 'farmer-training',
        serviceName: 'Farmer Training',
        accent: '#7C3AED',
        scopeFields: [
          { key: 'commodity', label: 'Crop / commodity', placeholder: 'e.g. hemp, vegetables, livestock' },
          { key: 'cohortSize',label: 'Cohort size',      placeholder: 'e.g. 20 farmers' },
          { key: 'region',    label: 'Region',           placeholder: 'e.g. Amathole, OR Tambo' },
        ],
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  3 · CORPORATE WORKSHOPS
 * ══════════════════════════════════════════════════════════════════ */
export function CorporateWorkshopsPage() {
  return (
    <ServiceDetail
      name="Corporate Workshops"
      tagline="1–3 day short courses for corporate teams — leadership, sales, ops, soft skills."
      badge="Service 3 of 5"
      colour="#8B5CF6"
      initials="CW"
      breadcrumbName="Corporate Workshops"
      facts={[
        { label: 'Duration',     value: '1–3 days' },
        { label: 'Format',       value: 'In-person / Hybrid / Online' },
        { label: 'Pricing',      value: 'Per delegate or per workshop' },
        { label: 'CPD',          value: 'Where eligible' },
      ]}
      phases={[
        { step: '1', label: 'Brief intake + needs analysis', duration: '1 week',
          activities: ['Discovery call with L&D lead', 'Target audience + delegate count', 'Outcomes + success criteria', 'Format selection (in-person, hybrid, online)'],
          deliverable: 'Workshop brief', gate: 'Brief sign-off' },
        { step: '2', label: 'Workshop design + materials', duration: '1–2 weeks',
          activities: ['Detailed agenda + timings', 'Facilitator notes', 'Delegate workbook', 'Pre-reads + post-workshop resources'],
          deliverable: 'Workshop pack (delegate + facilitator versions)', gate: 'Client approves materials' },
        { step: '3', label: 'Logistics', duration: '1 week',
          activities: ['Venue + catering booking (in-person)', 'Tech setup (hybrid + online)', 'Delegate registration + comms', 'Materials printing / digital distribution'],
          deliverable: 'Logistics-ready checklist' },
        { step: '4', label: 'Delivery', duration: '1–3 days',
          activities: ['Facilitate workshop', 'Live activities + discussions', 'Capture key insights + group outputs', 'Daily wrap-up + next-day prep'],
          deliverable: 'Delivered workshop + group outputs' },
        { step: '5', label: 'Feedback + L&D report', duration: 'Same week',
          activities: ['End-of-workshop survey (Net Promoter + Kirkpatrick L1/L2)', 'Group output digitisation', 'Insights memo to client L&D lead'],
          deliverable: 'L&D report + survey results' },
        { step: '6', label: 'Optional follow-up', duration: '30 / 60 / 90 days',
          activities: ['Behavioural-application check-ins (online or 1:1)', 'Manager debrief', 'Refresher resources release'],
          deliverable: 'Follow-up report (if scoped)' },
      ]}
      raciHeaders={['Brief', 'Design', 'Logistics', 'Deliver', 'Report', 'Follow-up']}
      raciRows={[
        { role: 'Workshop Lead',          cells: ['A R','A R','C',  'A R','A R','A R'] },
        { role: 'Facilitator(s)',         cells: ['C',  'R',  'I',  'R',  'C',  'C']   },
        { role: 'Producer / Coordinator', cells: ['R',  'C',  'A R','R',  'R',  'R']   },
        { role: 'Client L&D Lead',        cells: ['A',  'A',  'C',  'A',  'C',  'C']   },
      ]}
      tooling="Miro / Mural (activities), Slido (polls), Zoom / Teams (online), Notion (pre/post resources), Typeform (surveys), Google Slides / PPTX (delivery deck)."
      definitionOfDone="Workshop delivered, L&D report + survey results sent to client within 3 business days, materials archived for re-use."
      pricingNotes="Per-delegate (R 3 000 – R 15 000 depending on subject + format) or per-workshop flat fee. Travel + venue invoiced at cost. Follow-up sold as separate package."
      engagePreset={{
        serviceUnit: 'skills-centre',
        serviceSlug: 'corporate-workshops',
        serviceName: 'Corporate Workshops',
        accent: '#8B5CF6',
        scopeFields: [
          { key: 'topic',    label: 'Topic area',  options: ['Leadership', 'Sales', 'Operations', 'Soft skills', 'Compliance', 'Other'] },
          { key: 'delegates',label: 'Delegates',   placeholder: 'e.g. 25' },
          { key: 'format',   label: 'Format',      options: ['In-person', 'Hybrid', 'Online'] },
        ],
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  4 · TRAIN-THE-TRAINER
 * ══════════════════════════════════════════════════════════════════ */
export function TrainTheTrainerPage() {
  return (
    <ServiceDetail
      name="Train-the-Trainer"
      tagline="License a Skills Centre programme to a client's internal trainers — they deliver, we certify."
      badge="Service 4 of 5"
      colour="#9333EA"
      initials="TT"
      breadcrumbName="Train-the-Trainer"
      facts={[
        { label: 'Duration',     value: '2 weeks intensive + ongoing' },
        { label: 'Output',       value: 'Certified trainers' },
        { label: 'Pricing',      value: 'Per trainer + licence' },
        { label: 'Support',      value: 'Quarterly CoP' },
      ]}
      phases={[
        { step: '1', label: 'Programme design + licence scope', duration: '1 week',
          activities: ['Identify the source programme being licensed', 'Number of trainers + delivery volume forecast', 'Licence territory + term', 'Quality-control mechanism'],
          deliverable: 'Licence agreement + scope doc', gate: 'Client signs licence' },
        { step: '2', label: 'Trainer candidate selection', duration: '1 week',
          activities: ['Candidate intake forms', 'Capability screen (subject knowledge + facilitation)', 'Onboarding pack issued'],
          deliverable: 'Confirmed trainer cohort' },
        { step: '3', label: 'Master class', duration: 'Week 1',
          activities: ['Subject deep-dive', 'Facilitation craft (questioning, energy, time management)', 'Materials walk-through', 'Practical micro-teaches with peer feedback'],
          deliverable: 'Master-class attendance + micro-teach evaluations' },
        { step: '4', label: 'Practical co-delivery', duration: 'Week 2',
          activities: ['Trainer co-delivers a live workshop alongside Skills Centre senior', 'Daily debrief', 'Coaching against rubric'],
          deliverable: 'Co-delivery observation reports' },
        { step: '5', label: 'Certification assessment', duration: '2 days',
          activities: ['Written subject assessment', 'Solo delivery observation (60–90 min)', 'Final rubric scoring', 'Pass / not-yet-competent decision'],
          deliverable: 'Certification decision per trainer', gate: 'Pass threshold' },
        { step: '6', label: 'Licence + master content access', duration: 'Ongoing',
          activities: ['Trainer credential issued', 'Access to master deck + workbook + assessments', 'Brand-use guidelines', 'Royalty / fee schedule'],
          deliverable: 'Trainer certificate + content access' },
        { step: '7', label: 'Quarterly Community of Practice', duration: 'Ongoing',
          activities: ['Quarterly virtual CoP for certified trainers', 'New material releases', 'Refresher + recalibration', 'Peer-share + case studies'],
          deliverable: 'Quarterly CoP report' },
      ]}
      raciHeaders={['Licence', 'Select', 'Master class', 'Co-deliver', 'Certify', 'Content', 'CoP']}
      raciRows={[
        { role: 'Skills Centre Senior',   cells: ['A R','A R','A R','A R','A R','A',  'A R'] },
        { role: 'Master Facilitator',     cells: ['C',  'C',  'R',  'R',  'R',  'C',  'R']   },
        { role: 'Trainer candidates',     cells: ['I',  'R',  'R',  'R',  'R',  'I',  'R']   },
        { role: 'Client L&D Lead',        cells: ['A',  'C',  'C',  'C',  'I',  'I',  'C']   },
      ]}
      tooling="Notion (master content + LMS), Loom (micro-teach recordings), Zoom (CoP sessions), DocuSign (licence agreements), Stripe (licence fees), Brandfolder (content distribution)."
      definitionOfDone="Trainer certified, master content access granted, licence agreement executed, first CoP session scheduled."
      pricingNotes="Per-trainer certification fee + annual content licence (typically R 20 000 – R 50 000 per trainer + 10–15% of trainer-delivered revenue, or flat annual fee)."
      engagePreset={{
        serviceUnit: 'skills-centre',
        serviceSlug: 'train-the-trainer',
        serviceName: 'Train-the-Trainer',
        accent: '#9333EA',
        scopeFields: [
          { key: 'programme',   label: 'Programme to licence', placeholder: 'e.g. SETA Learnership facilitation' },
          { key: 'trainers',    label: 'Trainer candidates',   placeholder: 'e.g. 5' },
          { key: 'territory',   label: 'Licence territory',    placeholder: 'e.g. Eastern Cape / National' },
        ],
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  5 · CUSTOM PROGRAMMES
 * ══════════════════════════════════════════════════════════════════ */
export function CustomProgrammesPage() {
  return (
    <ServiceDetail
      name="Custom Programmes"
      tagline="Bespoke training designed against a client's specific competency need. Optional accreditation pathway."
      badge="Service 5 of 5"
      colour="#A855F7"
      initials="CP"
      breadcrumbName="Custom Programmes"
      facts={[
        { label: 'Duration',     value: '8–16 weeks (typical)' },
        { label: 'Output',       value: 'New productised programme' },
        { label: 'Pricing',      value: 'Custom proposal' },
        { label: 'Accreditation',value: 'Optional pathway' },
      ]}
      phases={[
        { step: '1', label: 'Discovery + needs analysis', duration: '2 weeks',
          activities: ['Stakeholder interviews (sponsor + target audience)', 'Competency-gap analysis', 'Existing-content audit', 'Outcome KPIs'],
          deliverable: 'Discovery report + competency map', gate: 'Discovery sign-off' },
        { step: '2', label: 'Programme design + accreditation decision', duration: '3 weeks',
          activities: ['Learning outcomes mapped to NQF (if accredited path)', 'Programme structure (modules, duration, format)', 'Assessment strategy', 'Accreditation pathway recommendation (QCTO / SETA / non-accredited)'],
          deliverable: 'Programme design document', gate: 'Design + accreditation decision' },
        { step: '3', label: 'Materials development', duration: '3–4 weeks',
          activities: ['Facilitator guide', 'Delegate workbook', 'Slide deck + activity assets', 'Assessment tools', 'PoE templates (if accredited)'],
          deliverable: 'Pilot-ready materials pack' },
        { step: '4', label: 'Pilot cohort delivery', duration: '4–6 weeks',
          activities: ['Run pilot with small cohort (8–15 learners)', 'Detailed observation + feedback capture', 'Daily iteration log', 'Pilot assessment + results'],
          deliverable: 'Pilot delivery report' },
        { step: '5', label: 'Iterate based on pilot', duration: '2 weeks',
          activities: ['Materials updates from pilot feedback', 'Facilitator briefing refresh', 'Final version baseline'],
          deliverable: 'Production-ready programme', gate: 'Sponsor signs off final' },
        { step: '6', label: 'Roll-out at scale', duration: 'Per cohort',
          activities: ['Scale cohort recruitment', 'Facilitator pool training', 'Repeated cohort delivery', 'Quality moderation on each cohort'],
          deliverable: 'Cohort certifications + reports' },
        { step: '7', label: 'Ongoing programme management', duration: 'Quarterly',
          activities: ['Quarterly programme health review', 'Materials refresh + bug fixes', 'Outcome tracking', 'Renewal / scope-change discussion'],
          deliverable: 'Quarterly programme report' },
      ]}
      raciHeaders={['Discovery', 'Design', 'Materials', 'Pilot', 'Iterate', 'Roll-out', 'Ongoing']}
      raciRows={[
        { role: 'Programme Architect',   cells: ['A R','A R','A R','A',  'A R','A',  'A R'] },
        { role: 'Lead Facilitator',     cells: ['C',  'C',  'R',  'R',  'C',  'R',  'C']   },
        { role: 'Materials Designer',   cells: ['I',  'C',  'R',  'C',  'R',  'C',  'C']   },
        { role: 'External Assessor',    cells: ['I',  'C',  'C',  'C',  'I',  'C',  'C']   },
        { role: 'Sponsor',              cells: ['A',  'A',  'C',  'C',  'A',  'I',  'A']   },
      ]}
      tooling="Notion (discovery + design docs), Figma (workbook + slide design), Articulate / Rise (eLearning), Moodle (LMS), Frame.io (asset review), QCTO / SETA portals (if accreditation path)."
      definitionOfDone="Programme delivered to sponsor at production quality, first cohort certified, quarterly programme review scheduled, programme added to Skills Centre catalogue."
      pricingNotes="Custom proposal — typically Discovery + Design priced as fixed fee, Materials priced T&M with cap, Pilot priced per learner, Roll-out priced per cohort. Accreditation work invoiced separately at cost."
      engagePreset={{
        serviceUnit: 'skills-centre',
        serviceSlug: 'custom-programmes',
        serviceName: 'Custom Programmes',
        accent: '#A855F7',
        scopeFields: [
          { key: 'objective',  label: 'Programme objective', placeholder: 'e.g. upskill 200 ops staff on FMCG basics' },
          { key: 'audience',   label: 'Audience size',       placeholder: 'e.g. 200 across 3 sites' },
          { key: 'accredited', label: 'Need accreditation?', options: ['Yes — required', 'Optional', 'No — internal use only'] },
        ],
      }}
    />
  );
}
