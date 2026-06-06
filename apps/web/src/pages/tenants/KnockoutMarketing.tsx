/**
 * Knockout Marketing — Service Hub.
 *
 * Reached from 3Wi Shared Services > Knockout Marketing tile.
 * Replaces the old placeholder. Lists the three productised service offerings
 * with their workflows, deliverables, RACI, gates and tooling.
 *
 *   1. Brand Development
 *   2. Content Development
 *   3. Campaign Deployment & Management
 *
 * Breadcrumb:
 *   3Wi › IBS › Rainmaker › 3Wi Shared Services › Knockout Marketing
 */

import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { EngagementIntakeModal, type ServicePreset } from '../../components/engagements/EngagementIntakeModal';

const KM_PRIMARY = '#B45309';   // burnt amber
const KM_ACCENT  = '#FDF31C';   // 3Wi yellow

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
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
      {service
        ? <>
            <Link to="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing" className="hover:underline">Knockout Marketing</Link>
            <span className="mx-1.5 text-slate-400">›</span>
            <span className="text-slate-900 font-semibold">{service}</span>
          </>
        : <span className="text-slate-900 font-semibold">Knockout Marketing</span>}
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  KNOCKOUT MASTER WORKFLOW
 *  The 5-phase journey every new KOM client follows. Each phase is
 *  clickable through to the relevant service / page that fulfils it.
 * ────────────────────────────────────────────────────────────────── */

type MasterPhase = {
  n: number;
  title: string;
  subtitle: string;
  description: string;
  colour: string;
  href: string;
  destinationLabel: string;
};

const MASTER_PHASES: MasterPhase[] = [
  {
    n: 1,
    title: 'Onboard + bill',
    subtitle: 'Capture billing info in QBO',
    description: 'Customer intake using QBO-shaped fields. Creates the QuickBooks customer record and adds the client to the KOM book.',
    colour: '#0E7490',
    href: '/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/kom-customers',
    destinationLabel: 'KOM Customers',
  },
  {
    n: 2,
    title: 'Brand audit',
    subtitle: 'Assess status of brand assets',
    description: 'Discovery + audit of the existing brand. Positioning, identity, guidelines — what exists, what is missing, what needs rebuilding.',
    colour: '#B45309',
    href: '/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/brand-development',
    destinationLabel: 'Brand Development',
  },
  {
    n: 3,
    title: 'Content purpose',
    subtitle: 'Determine purpose of content',
    description: 'Why are we making content? Lead-gen, awareness, education, social brand-building, training material. Sets the content strategy.',
    colour: '#9C5310',
    href: '/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/content-development',
    destinationLabel: 'Content Development',
  },
  {
    n: 4,
    title: 'Campaign calendar',
    subtitle: 'Plan the campaign cadence',
    description: 'Quarterly + monthly calendar of campaigns, channels, budgets and launches. Synchronises content production with media spend.',
    colour: '#7A3E0C',
    href: '/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/campaign-deployment',
    destinationLabel: 'Campaign Deployment',
  },
  {
    n: 5,
    title: 'Performance M&E',
    subtitle: 'Monitor, evaluate, learn',
    description: 'Performance reports per channel, per campaign. Monitoring and evaluation that closes the loop back into next quarter\'s content + campaign plan.',
    colour: '#15803D',
    href: '/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/performance-reports',
    destinationLabel: 'Performance Reports',
  },
];

function MasterWorkflowFlow() {
  return (
    <div className="max-w-6xl mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-600">Master workflow</div>
          <div className="text-sm text-slate-600 italic">
            Every new KOM client follows this 5-phase journey. Click any phase to open its workspace.
          </div>
        </div>
      </div>

      {/* Horizontal flow on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 relative">
        {MASTER_PHASES.map((p, idx) => (
          <div key={p.n} className="relative">
            <Link
              to={p.href}
              className="group flex flex-col h-full rounded-xl border-2 border-slate-200 bg-white p-4 hover:shadow-md transition-all"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = p.colour)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold shrink-0"
                  style={{ background: p.colour }}
                >
                  {p.n}
                </span>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: p.colour }}>
                  Phase {p.n}
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="text-[11px] text-slate-500 italic mb-2">{p.subtitle}</p>
              <p className="text-xs text-slate-700 flex-1">{p.description}</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{p.destinationLabel}</span>
                <span className="text-xs font-semibold group-hover:underline" style={{ color: p.colour }}>Open →</span>
              </div>
            </Link>
            {/* Arrow to next phase (desktop only, between cards) */}
            {idx < MASTER_PHASES.length - 1 && (
              <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 items-center justify-center w-4 h-4 rounded-full bg-white border border-slate-300 text-slate-500 text-[10px] font-bold">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Compact flow summary - text version */}
      <div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 overflow-x-auto whitespace-nowrap">
        1. Onboard + bill (QBO)  →  2. Brand audit  →  3. Content purpose  →  4. Campaign calendar  →  5. Performance M&E
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  KNOCKOUT HUB
 * ────────────────────────────────────────────────────────────────── */
export function KnockoutMarketingHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb />

      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: KM_PRIMARY }}>
          Shared service · Marketing & Creative
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Knockout Marketing</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          The brand and growth practice of the IBS group. Three productised offerings — buy one or stack all three
          for a compounding flywheel: <em>Brand creates the system, Content creates the material, Campaigns spend the budget</em>.
        </p>
      </div>

      {/* Master Workflow — every new client follows this 5-phase sequence */}
      <MasterWorkflowFlow />

      {/* 3 service tiles + 1 CRM tile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
        <ServiceTile
          slug="brand-development"
          name="Brand Development"
          tagline="Positioning + verbal + visual identity + guidelines + activation kit"
          pricing="Fixed price · 6–10 weeks"
          model="One-off project"
          deliverables={['Brand strategy deck', 'Logo + visual system', 'Brand guidelines PDF', 'Activation kit + templates']}
          colour={KM_PRIMARY}
          initials="BD"
        />
        <ServiceTile
          slug="content-development"
          name="Content Development"
          tagline="Monthly content engine: strategy, calendar, production, QA, publish"
          pricing="Monthly retainer + cycles"
          model="Recurring revenue"
          deliverables={['Quarterly strategy', 'Editorial calendar', '12–20 pieces / month (typical)', 'Monthly performance report']}
          colour="#9C5310"
          initials="CD"
        />
        <ServiceTile
          slug="campaign-deployment"
          name="Campaign Deployment"
          tagline="Plan → produce → launch → optimise paid + owned campaigns"
          pricing="Setup fee + % of media spend"
          model="Project + retainer hybrid"
          deliverables={['Campaign plan + media buy', 'Channel builds', 'Weekly in-flight optimisation', 'Post-campaign report']}
          colour="#7A3E0C"
          initials="CM"
        />
        <ServiceTile
          slug="kom-customers"
          name="KOM Customers"
          tagline="Knockout's client book — accounts, engagement pipeline, activity, renewals"
          pricing="Internal · CRM view"
          model="Account directory"
          deliverables={['Active client list', 'Pipeline + engagement value', 'Activity timeline per client', 'Renewal + churn calendar']}
          colour="#0E7490"
          initials="KC"
        />
      </div>

      {/* Flywheel explanation */}
      <div className="mt-8 max-w-6xl">
        <Card title="The Knockout flywheel — how the three offerings compound">
          <div className="text-sm text-slate-700 space-y-3">
            <p>
              A client buying all three becomes a recurring-revenue compound: one-off brand fee turns into a monthly content
              retainer, which feeds quarterly campaign cycles plus ongoing media management percentage. Performance data
              flows back to refine the next cycle.
            </p>
            <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-800 overflow-x-auto">{`Brand Development     →   creates the System
   ↓
Content Development   →   creates the Material            ←──┐
   ↓                                                          │
Campaign Deployment   →   spends the Budget                   │  Performance
   ↓                                                          │  data flows
Performance data      ──────────────────────────────────────► │  back to refine
                                                              │  next cycle`}</pre>
          </div>
        </Card>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 max-w-6xl">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → Rainmaker → 3Wi Shared Services → <span className="font-semibold" style={{ color: KM_PRIMARY }}>Knockout Marketing</span> → [Brand | Content | Campaigns]
        </div>
      </div>
    </Shell>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Reusable service tile on the hub
 * ────────────────────────────────────────────────────────────────── */
function ServiceTile({
  slug, name, tagline, pricing, model, deliverables, colour, initials,
}: {
  slug: string;
  name: string;
  tagline: string;
  pricing: string;
  model: string;
  deliverables: string[];
  colour: string;
  initials: string;
}) {
  return (
    <Link
      to={`/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/${slug}`}
      className="group block rounded-xl border-2 border-slate-200 hover:shadow-md bg-white p-6 transition-all"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colour)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-white text-sm font-bold"
          style={{ background: colour }}
        >
          {initials}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${colour}15`, color: colour }}
        >
          {model}
        </span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{name}</h2>
      <p className="text-xs text-slate-600 mb-3">{tagline}</p>
      <div className="text-xs font-mono text-slate-700 mb-3">{pricing}</div>
      <div className="text-xs text-slate-500 space-y-0.5">
        {deliverables.map((d) => <div key={d}>• {d}</div>)}
      </div>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: colour }}>
        Open service &nbsp;→
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Reusable service detail shell
 * ────────────────────────────────────────────────────────────────── */
function ServiceDetail({
  name, tagline, badge, colour, initials, breadcrumbName,
  facts, phases, raciHeaders, raciRows, tooling, definitionOfDone, pricingNotes,
  extraTopSection,
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
  extraTopSection?: ReactNode;
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb service={breadcrumbName} />

      {/* Service header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${colour}33`, background: `${colour}08` }}>
        <div className="flex items-start gap-5">
          <span
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
            style={{ background: colour }}
          >
            {initials}
          </span>
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

      {/* Optional extra section (e.g. sub-tiles) */}
      {extraTopSection ? <div className="max-w-6xl mb-6">{extraTopSection}</div> : null}

      {/* KPI / facts strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        {facts.map((f) => (
          <div key={f.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{f.label}</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Workflow phases */}
      <div className="max-w-6xl mb-6">
        <Card title="Workflow — phases, activities, gates">
          <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            {phases.map((p, idx) => (
              <li key={p.step} className="ml-6">
                <span
                  className="absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                  style={{ background: colour }}
                >
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

      {/* RACI */}
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

        <Card title="Pricing model + Definition of Done">
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

      {/* Tooling */}
      <div className="max-w-6xl mb-6">
        <Card title="Standard tooling stack">
          <p className="text-sm text-slate-700">{tooling}</p>
        </Card>
      </div>

      {/* Engage CTA — now wired to live modal */}
      <EngageThisService preset={{
        serviceUnit: 'knockout-marketing',
        serviceSlug: breadcrumbName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        serviceName: name,
        accent: colour,
        scopeFields: scopeFieldsForService(breadcrumbName),
      }} />
    </Shell>
  );
}

/**
 * Live "Engage this service" panel — opens the EngagementIntakeModal.
 */
function EngageThisService({ preset }: { preset: ServicePreset }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-6xl">
      <div
        className="rounded-xl border-2 p-5 flex items-center justify-between gap-4"
        style={{ borderColor: `${preset.accent}55`, background: `${preset.accent}05` }}
      >
        <div className="text-sm" style={{ color: preset.accent }}>
          <span className="font-semibold">Engage this service →</span>{' '}
          Submit a request and our team will scope, invoice and spin up an Asana project.
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-5 py-2 rounded-lg text-white font-semibold text-sm shrink-0"
          style={{ background: preset.accent }}
        >
          Engage
        </button>
      </div>
      <EngagementIntakeModal isOpen={open} onClose={() => setOpen(false)} preset={preset} />
    </div>
  );
}

/**
 * Service-specific scope fields that appear inside the intake modal.
 * Keeps the form short but captures the right discovery info per service.
 */
function scopeFieldsForService(breadcrumbName: string): ServicePreset['scopeFields'] {
  if (breadcrumbName === 'Brand Development') {
    return [
      { key: 'engagementType', label: 'Type of engagement', options: ['New brand from scratch', 'Rebrand existing identity', 'Brand extension (sub-brand)', 'Not sure'] },
      { key: 'industry',       label: 'Industry / sector',  placeholder: 'e.g. hemp, retail, finance' },
    ];
  }
  if (breadcrumbName === 'Content Development') {
    return [
      { key: 'piecesPerMonth', label: 'Volume per month',   options: ['1–5 pieces', '6–12 pieces', '13–20 pieces', '20+ pieces'] },
      { key: 'channelMix',     label: 'Primary channels',   placeholder: 'e.g. Instagram, LinkedIn, YouTube, newsletter' },
    ];
  }
  if (breadcrumbName === 'Campaign Deployment') {
    return [
      { key: 'objective', label: 'Campaign objective', options: ['Awareness', 'Lead generation', 'Sales / e-commerce', 'App installs', 'Not sure'] },
      { key: 'channels',  label: 'Preferred channels', placeholder: 'e.g. Meta, Google, LinkedIn' },
    ];
  }
  return undefined;
}

/* ══════════════════════════════════════════════════════════════════
 *  SERVICE 1 · BRAND DEVELOPMENT
 * ══════════════════════════════════════════════════════════════════ */
export function BrandDevelopmentService() {
  return (
    <ServiceDetail
      name="Brand Development"
      tagline="Positioning, verbal identity, visual identity, guidelines and activation kit."
      badge="Service 1 of 3"
      colour={KM_PRIMARY}
      initials="BD"
      breadcrumbName="Brand Development"
      facts={[
        { label: 'Duration',         value: '6–10 weeks' },
        { label: 'Pricing',          value: 'Fixed price · gated' },
        { label: 'Phases',           value: '7' },
        { label: 'Client gates',     value: '5' },
      ]}
      phases={[
        {
          step: '1',
          label: 'Discovery',
          duration: '1–2 weeks',
          activities: [
            'Kick-off + brief intake',
            'Stakeholder interviews (3–5)',
            'Competitor + category audit',
            'Current-brand audit (if rebrand)',
            'Customer / persona research',
          ],
          deliverable: 'Discovery Report',
          gate: 'Discovery sign-off',
        },
        {
          step: '2',
          label: 'Strategy',
          duration: '1–2 weeks',
          activities: [
            'Positioning statement',
            'Brand pyramid (purpose, values, personality)',
            'Value proposition + reasons-to-believe',
            'Target audience + persona cards',
            'Competitive map',
          ],
          deliverable: 'Brand Strategy Deck',
          gate: 'Strategy sign-off',
        },
        {
          step: '3',
          label: 'Verbal Identity',
          duration: '1 week',
          activities: [
            'Naming (if applicable)',
            'Tagline',
            'Brand voice + tone matrix',
            'Boilerplate copy',
          ],
          deliverable: 'Messaging Architecture',
          gate: 'Verbal sign-off',
        },
        {
          step: '4',
          label: 'Visual Identity',
          duration: '2–3 weeks',
          activities: [
            'Mood boards (2)',
            'Logo concepts (3 directions)',
            'Logo refinement (1 chosen, 2 variants)',
            'Colour palette + typography + iconography',
            'Imagery direction + brand patterns',
          ],
          deliverable: 'Logo + Visual System',
          gate: 'Visual sign-off',
        },
        {
          step: '5',
          label: 'Guidelines',
          duration: '1 week',
          activities: [
            "Logo usage + clear space + don'ts",
            'Colour + typography + grid',
            'Voice + writing principles',
            'Sample applications',
          ],
          deliverable: 'Brand Guidelines Document',
          gate: 'Guidelines sign-off',
        },
        {
          step: '6',
          label: 'Activation Kit',
          duration: '1 week',
          activities: [
            'Business card + letterhead + email signature',
            'Social profile + cover assets',
            'Presentation template (Google / PPTX / Keynote)',
            'Web identity tokens (colours, fonts, components)',
            'Favicon + app icon',
          ],
          deliverable: 'Production-ready templates',
        },
        {
          step: '7',
          label: 'Handover',
          duration: '0.5 weeks',
          activities: [
            'All editable source files (.ai, .figma, .ttf)',
            'DAM / Google Drive structure',
            'Training session for client marketing team',
          ],
          deliverable: 'Brand Asset Library + training session',
        },
      ]}
      raciHeaders={['Discovery', 'Strategy', 'Verbal', 'Visual', 'Guidelines', 'Activation', 'Handover']}
      raciRows={[
        { role: 'Brand Strategist',  cells: ['A R', 'A R', 'A R', 'C',  'C',   'I',   'C']   },
        { role: 'Creative Director', cells: ['C',   'C',   'C',   'A R','A R', 'A',   'R']   },
        { role: 'Senior Designer',   cells: ['I',   'I',   'I',   'R',  'R',   'R',   'R']   },
        { role: 'Copywriter',        cells: ['I',   'C',   'R',   'I',  'C',   'C',   'I']   },
        { role: 'Account Manager',   cells: ['R',   'R',   'R',   'R',  'R',   'R',   'A R'] },
        { role: 'Client',            cells: ['A',   'A',   'A',   'A',  'A',   'A',   'A']   },
      ]}
      tooling="Miro (discovery), Figma (visual + tokens), Notion / Google Docs (strategy + guidelines), Frame.io (review rounds), Brandfolder / Bynder or Google Drive (DAM). Adobe Illustrator + Photoshop where deliverables require it."
      definitionOfDone="Brand Guidelines PDF + Activation Kit delivered, all source files transferred, training session completed and signed off."
      pricingNotes="Fixed-price project, invoiced 30% on kick-off, 40% at Visual sign-off (Gate 4), 30% at Handover. Out-of-scope changes priced as separate change orders."
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  SERVICE 2 · CONTENT DEVELOPMENT
 * ══════════════════════════════════════════════════════════════════ */
export function ContentDevelopmentService() {
  return (
    <ServiceDetail
      name="Content Development"
      tagline="Monthly content engine — strategy, calendar, production, QA, publish, analyse."
      badge="Service 2 of 3"
      colour="#9C5310"
      initials="CD"
      breadcrumbName="Content Development"
      extraTopSection={
        <Card title="Specialised sub-services — agent-orchestrated production">
          <p className="text-sm text-slate-600 mb-4">
            Knockout's Content Development practice now ships two AI-agent production pipelines
            on top of the generic editorial workflow. Each sub-service is a fully orchestrated
            agent pipeline (Anthropic Claude SDK), gated by human Subject Matter Experts before
            delivery. Pick the right pipeline for the work in hand.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ContentSubTile
              slug="advertising-social-brand"
              initials="AD"
              colour="#9C5310"
              name="Advertising + Social Brand Building"
              tagline="Per-campaign or always-on content engine for paid ads + organic social. 10-agent pipeline produces concept → copy → visuals → publish → performance loop."
              bullets={[
                'Per-platform variant generation (IG, FB, LinkedIn, TikTok, X)',
                'isiXhosa + Afrikaans localised variants',
                'POPIA + claims-compliance Critic gate',
                'Auto-schedules via Buffer / Meta API, pulls 7/14/30-day performance',
              ]}
              cadence="Cycle: 24–48h per asset · Cost: R 12–80 per asset"
            />
            <ContentSubTile
              slug="training-programmes"
              initials="TR"
              colour="#015807"
              name="Training Programmes Content"
              tagline="SAQA-aligned learner guides, facilitator guides, assessments and PoE templates. 7-agent pipeline replaces a 12-week traditional learning-design cycle."
              bullets={[
                'SAQA Specific Outcome + Assessment Criterion coverage by construction',
                'isiXhosa key-term integration + community reviewer queue',
                'Hempire-brand docx + pptx output (proven on Modules iv and v)',
                'SAQA-registered SME sign-off gate before client delivery',
              ]}
              cadence="Cycle: 7–14 days per module · Cost: R 25k–150k vs R 250k–800k traditional"
            />
          </div>
        </Card>
      }
      facts={[
        { label: 'Engagement',     value: 'Monthly retainer' },
        { label: 'Sprint length',  value: '4 weeks' },
        { label: 'Strategy cycle', value: 'Quarterly' },
        { label: 'Pieces / month', value: '12–20 (typical)' },
      ]}
      phases={[
        {
          step: '1',
          label: 'Content Strategy (quarterly)',
          duration: 'Quarter open',
          activities: [
            'Content pillars (3–5 themes)',
            'Audience + channel matrix',
            'KPIs per channel',
            'Format mix (long-form, short, video, photo)',
          ],
          deliverable: 'Quarterly Content Strategy',
        },
        {
          step: '2',
          label: 'Editorial Calendar (monthly)',
          duration: 'Month open',
          activities: [
            'Master calendar across channels',
            'Theme + frequency per channel',
            'Talent / location / asset lock-ins',
          ],
          deliverable: 'Approved monthly calendar',
          gate: 'Client sign-off on calendar',
        },
        {
          step: '3',
          label: 'Briefing (per piece)',
          duration: '1–2 days',
          activities: [
            'Brief template: objective, audience, message',
            'Format + channel + KPI + deadline',
            'Required assets + references',
          ],
          deliverable: 'Approved piece brief',
        },
        {
          step: '4',
          label: 'Pre-production',
          duration: '2–5 days',
          activities: [
            'Shot list / script / outline',
            'Talent / location / permit confirmations',
            'Equipment checklist',
          ],
          deliverable: 'Pre-production pack',
        },
        {
          step: '5',
          label: 'Production',
          duration: 'Per format',
          activities: [
            'Write / shoot / record / design',
            'Daily WIP reviews',
            'Raw asset capture and labelling',
          ],
          deliverable: 'Raw production assets',
        },
        {
          step: '6',
          label: 'Post-production',
          duration: '1–5 days',
          activities: [
            'Edit, colour, sound',
            'Copy edit + fact-check',
            'Format export per channel spec',
          ],
          deliverable: 'Channel-ready files (draft)',
        },
        {
          step: '7',
          label: 'Internal QA',
          duration: 'Same day',
          activities: [
            'Brand compliance check',
            'Legal / POPIA review',
            'Accessibility + alt-text + captions',
          ],
          deliverable: 'QA-passed files',
          gate: 'Internal sign-off',
        },
        {
          step: '8',
          label: 'Client approval',
          duration: '1–3 days',
          activities: [
            'Submit through Frame.io / Figma',
            'Max 2 review rounds in scope',
            'Change requests beyond scope = separate ticket',
          ],
          deliverable: 'Client-approved files',
          gate: 'Client sign-off',
        },
        {
          step: '9',
          label: 'Delivery + archival',
          duration: 'Same day',
          activities: [
            'Final files to DAM with metadata',
            'Publish or hand to media team',
            'Version control + naming convention',
          ],
          deliverable: 'Published + archived asset',
        },
        {
          step: '10',
          label: 'Performance log (monthly)',
          duration: 'Month close',
          activities: [
            'Log KPIs against each brief',
            'Identify top + bottom performers',
            'Learnings into next month plan',
          ],
          deliverable: 'Monthly Performance Report',
        },
      ]}
      raciHeaders={['Strategy', 'Calendar', 'Brief', 'Pre-prod', 'Production', 'Post', 'QA', 'Client', 'Deliver', 'Perf']}
      raciRows={[
        { role: 'Content Strategist',     cells: ['A R', 'A R', 'A',   'C',   'I',   'I',   'C',   'C',   'I',   'A R'] },
        { role: 'Producer',               cells: ['C',   'R',   'R',   'A R', 'A R', 'A R', 'A',   'R',   'A R', 'R']   },
        { role: 'Craft specialists',      cells: ['I',   'I',   'C',   'R',   'R',   'R',   'I',   'I',   'I',   'I']   },
        { role: 'Editor / QA',            cells: ['I',   'I',   'I',   'I',   'C',   'R',   'A R', 'I',   'C',   'I']   },
        { role: 'Account Manager',        cells: ['R',   'R',   'R',   'I',   'I',   'I',   'I',   'R',   'I',   'R']   },
        { role: 'Client',                 cells: ['A',   'A',   'A',   'I',   'I',   'I',   'I',   'A',   'I',   'C']   },
      ]}
      tooling="Notion / Airtable (calendar), Asana / ClickUp (sprint), Frame.io (video review), Figma (design review), Google Docs (copy), Adobe CC + Premiere + Lightroom (production), Brandfolder (DAM), GA4 + native channel analytics (performance)."
      definitionOfDone="Each piece published, archived in DAM with metadata, and logged in the monthly performance report. Month closes with a delivered performance review."
      pricingNotes="Monthly retainer scoped to pieces-per-month × format mix. Production overruns above ±15% trigger a change order. Quarterly strategy refresh included in retainer."
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  SERVICE 3 · CAMPAIGN DEPLOYMENT
 * ══════════════════════════════════════════════════════════════════ */
export function CampaignDeploymentService() {
  return (
    <ServiceDetail
      name="Campaign Deployment & Management"
      tagline="Plan → produce → launch → optimise paid + owned campaigns end to end."
      badge="Service 3 of 3"
      colour="#7A3E0C"
      initials="CM"
      breadcrumbName="Campaign Deployment"
      facts={[
        { label: 'Pre-flight',     value: '3–4 weeks' },
        { label: 'In-flight',      value: '4–8 weeks (typical)' },
        { label: 'Pricing',        value: 'Setup + media %' },
        { label: 'Channels',       value: 'Meta · Google · LinkedIn · Email' },
      ]}
      phases={[
        {
          step: '1',
          label: 'Campaign Strategy',
          duration: '1–2 weeks',
          activities: [
            'Objective + KPIs (awareness, leads, sales, ROAS)',
            'Budget split across channels',
            'Audience definition + segmentation',
            'Channel mix + media plan',
            'Big idea / creative concept',
          ],
          deliverable: 'Campaign Plan + Media Buy',
          gate: 'Plan + Budget approved',
        },
        {
          step: '2',
          label: 'Creative Production',
          duration: '2–3 weeks',
          activities: [
            'Adapt content to channel specs (16:9, 9:16, 1:1)',
            'Variant set for A/B testing (3–5 per ad set)',
            'Landing-page copy + design',
            'Email sequence + automation flows',
          ],
          deliverable: 'Channel-ready creative library',
          gate: 'Creative approved',
        },
        {
          step: '3',
          label: 'Channel Setup',
          duration: '1 week',
          activities: [
            'Tracking: UTMs, pixels, GA4, conversion events',
            'Audience builds in each platform',
            'Campaign structures (Meta / Google / LinkedIn)',
            'Landing pages live + tested',
            'Email automations armed',
          ],
          deliverable: 'Configured campaigns + pre-launch checklist',
        },
        {
          step: '4',
          label: 'QA + Soft Launch',
          duration: '1–2 days',
          activities: [
            'End-to-end click-through tests',
            'Conversion-event firing verified',
            'Small-budget smoke test (10% of day-one spend)',
          ],
          deliverable: 'GO / NO-GO decision',
          gate: 'Internal GO/NO-GO',
        },
        {
          step: '5',
          label: 'Launch — Day 0',
          duration: '24 hours',
          activities: [
            'All channels live',
            'First 24h hourly monitoring',
            'Triggers + alerts armed',
          ],
          deliverable: 'Live campaign + Day 1 snapshot',
        },
        {
          step: '6',
          label: 'In-flight Optimisation (weekly)',
          duration: '4–8 weeks',
          activities: [
            'Performance review vs KPI targets',
            'Budget reallocation across ad sets',
            'Pause under-performers (CPA / ROAS triggers)',
            'Creative refresh (fatigue check)',
            'Audience tuning + new A/B tests',
            'Landing-page conversion-rate tuning',
            'Weekly snapshot to client (Friday)',
          ],
          deliverable: 'Weekly optimisation memo + Friday snapshot',
        },
        {
          step: '7',
          label: 'Mid-campaign Deep-dive',
          duration: 'Week 4–5',
          activities: [
            'Cohort + funnel analysis',
            'Refresh creative brief if needed',
            'Re-forecast end-of-flight outcomes',
          ],
          deliverable: 'Mid-flight report + revised forecast',
        },
        {
          step: '8',
          label: 'Post-campaign Report',
          duration: '1 week post-launch',
          activities: [
            'Results vs KPIs (per channel + total)',
            'Spend efficiency (CPA, ROAS, CPL)',
            'Creative winners + losers',
            'Audience insights',
            'Recommendations for next campaign',
          ],
          deliverable: 'Post-campaign Report (PDF + Looker dashboard link)',
        },
        {
          step: '9',
          label: 'Post-mortem + Archival',
          duration: '0.5 weeks',
          activities: [
            'Internal retro (what worked / didn\'t / why)',
            'Winning creatives + audiences saved to library',
            'Learnings memo into Knockout CRM',
          ],
          deliverable: 'Learnings memo + archived assets',
        },
      ]}
      raciHeaders={['Strategy', 'Creative', 'Setup', 'QA', 'Launch', 'Optimise', 'Report']}
      raciRows={[
        { role: 'Performance / Media Lead', cells: ['A R', 'C',   'A R', 'A R', 'A R', 'A R', 'A R'] },
        { role: 'Campaign Manager',         cells: ['R',   'R',   'R',   'R',   'R',   'R',   'R']   },
        { role: 'Creative team',            cells: ['C',   'A R', 'C',   'I',   'I',   'C',   'C']   },
        { role: 'Analyst',                  cells: ['C',   'I',   'C',   'C',   'I',   'R',   'R']   },
        { role: 'Account Manager',          cells: ['R',   'R',   'R',   'R',   'R',   'R',   'R']   },
        { role: 'Client',                   cells: ['A',   'A',   'I',   'I',   'A',   'C',   'A']   },
      ]}
      tooling="Meta Ads Manager, Google Ads, LinkedIn Campaign Manager, GA4, GTM, Looker Studio (dashboards), HubSpot / Mailchimp / Klaviyo (email automation), Hotjar (landing-page heatmaps), Asana / ClickUp (delivery), Slack (in-flight comms)."
      definitionOfDone="Post-campaign report delivered to client, learnings memo logged in CRM, winning creatives + audiences archived to the asset library for reuse."
      pricingNotes="Setup fee (covers strategy, creative, setup) + monthly management fee + percentage of media spend (typical 10–15% of paid media). Optional retainer for always-on campaigns."
    />
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Helper — sub-tile inside Content Development hub
 * ────────────────────────────────────────────────────────────────── */
function ContentSubTile({
  slug, initials, colour, name, tagline, bullets, cadence,
}: {
  slug: string;
  initials: string;
  colour: string;
  name: string;
  tagline: string;
  bullets: string[];
  cadence: string;
}) {
  return (
    <Link
      to={`/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/content-development/${slug}`}
      className="group block rounded-xl border-2 border-slate-200 hover:shadow-md bg-white p-5 transition-all"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colour)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-white text-xs font-bold"
          style={{ background: colour }}
        >
          {initials}
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
          style={{ background: `${colour}15`, color: colour }}
        >
          Agent pipeline
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{name}</h3>
      <p className="text-xs text-slate-600 mb-3">{tagline}</p>
      <ul className="text-xs text-slate-700 space-y-1 mb-3">
        {bullets.map((b) => <li key={b} className="flex gap-1.5"><span style={{ color: colour }}>•</span><span>{b}</span></li>)}
      </ul>
      <div className="text-[11px] font-mono text-slate-500 border-t border-slate-100 pt-2">{cadence}</div>
      <div className="mt-2 text-xs font-semibold group-hover:underline" style={{ color: colour }}>
        Open agent pipeline &nbsp;→
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  AGENT-ORCHESTRATED SERVICE DETAIL
 *  Renders an AI agent pipeline workflow instead of a human-team workflow.
 * ══════════════════════════════════════════════════════════════════ */
type AgentPhase = {
  step: number;
  agent: string;
  model: string;
  trigger: string;
  inputs: string[];
  tools: string[];
  outputs: string[];
  gate?: string;
  durationEst: string;
  costEst: string;
};

function AgentServiceDetail({
  name, tagline, badge, colour, initials, breadcrumbName,
  facts, phases, humanGates, pricingNotes, definitionOfDone, tooling, modelStack,
}: {
  name: string;
  tagline: string;
  badge: string;
  colour: string;
  initials: string;
  breadcrumbName: string;
  facts: { label: string; value: string }[];
  phases: AgentPhase[];
  humanGates: { gate: string; owner: string; sla: string }[];
  pricingNotes: string;
  definitionOfDone: string;
  tooling: string;
  modelStack: string;
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <nav className="text-xs text-slate-500 mb-3">
        <Link to="/cc/director" className="hover:underline">3Wi</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs/rainmaker" className="hover:underline">Rainmaker</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs/rainmaker/3wi-shared-services" className="hover:underline">3Wi Shared Services</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing" className="hover:underline">Knockout Marketing</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing/content-development" className="hover:underline">Content Development</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <span className="text-slate-900 font-semibold">{breadcrumbName}</span>
      </nav>

      {/* Service header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${colour}33`, background: `${colour}08` }}>
        <div className="flex items-start gap-5">
          <span
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
            style={{ background: colour }}
          >
            {initials}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${colour}20`, color: colour }}>
                {badge}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide bg-slate-900 text-white">
                Agent pipeline
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{name}</h1>
            <p className="text-sm text-slate-600 mt-1">{tagline}</p>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        {facts.map((f) => (
          <div key={f.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{f.label}</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Model stack */}
      <div className="max-w-6xl mb-6">
        <Card title="Model stack">
          <p className="text-sm text-slate-700 font-mono">{modelStack}</p>
        </Card>
      </div>

      {/* Agent pipeline phases */}
      <div className="max-w-6xl mb-6">
        <Card title={`Agent pipeline — ${phases.length} phases`}>
          <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            {phases.map((p) => (
              <li key={p.step} className="ml-6">
                <span
                  className="absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                  style={{ background: colour }}
                >
                  {p.step}
                </span>
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h4 className="text-base font-bold text-slate-900">
                    {p.agent}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                        style={{ background: `${colour}15`, color: colour }}>
                    {p.model}
                  </span>
                </div>
                <div className="text-xs text-slate-500 italic mb-2">Trigger: {p.trigger}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Inputs</div>
                    <ul className="text-xs text-slate-700 space-y-0.5">
                      {p.inputs.map((i) => <li key={i}>· {i}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Tools / APIs</div>
                    <ul className="text-xs text-slate-700 space-y-0.5">
                      {p.tools.map((i) => <li key={i}>· {i}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Outputs</div>
                    <ul className="text-xs text-slate-700 space-y-0.5">
                      {p.outputs.map((i) => <li key={i}>· {i}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-500">
                  <span>⏱ {p.durationEst}</span>
                  <span>💰 {p.costEst}</span>
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

      {/* Human gates */}
      <div className="max-w-6xl mb-6">
        <Card title="Human gates (mandatory before delivery)">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-2 py-2 font-semibold">Gate</th>
                <th className="text-left px-2 py-2 font-semibold">Owner</th>
                <th className="text-left px-2 py-2 font-semibold">SLA</th>
              </tr>
            </thead>
            <tbody>
              {humanGates.map((g) => (
                <tr key={g.gate} className="border-t border-slate-100">
                  <td className="px-2 py-1.5 font-medium">{g.gate}</td>
                  <td className="px-2 py-1.5">{g.owner}</td>
                  <td className="px-2 py-1.5 font-mono text-slate-600">{g.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Pricing + DoD + Tooling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 max-w-6xl">
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
        <Card title="Tooling stack">
          <p className="text-sm text-slate-700">{tooling}</p>
        </Card>
      </div>

      {/* Engage */}
      <EngageThisService preset={{
        serviceUnit: 'knockout-marketing',
        serviceSlug: breadcrumbName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        serviceName: name,
        accent: colour,
      }} />
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  SUB-SERVICE 2.1 · CD-AD — Advertising + Social Brand Building
 * ══════════════════════════════════════════════════════════════════ */
export function ContentDevAdvertisingSocialService() {
  return (
    <AgentServiceDetail
      name="Content Development — Advertising + Social Brand Building"
      tagline="10-agent pipeline that produces per-platform paid and organic content end-to-end, gated by a brand + compliance Critic and a human publisher sign-off."
      badge="Sub-service · CD-AD"
      colour="#9C5310"
      initials="AD"
      breadcrumbName="Advertising + Social Brand Building"
      facts={[
        { label: 'Cycle per asset',  value: '24–48 hours' },
        { label: 'Cost per asset',   value: 'R 12–80 (AI) + human review' },
        { label: 'Channels supported', value: 'IG · FB · LinkedIn · TikTok · X · Email' },
        { label: 'Languages',        value: 'EN + isiXhosa + Afrikaans' },
      ]}
      modelStack="Planner + Critic: Claude Opus 4.6 · Writer + Insight + Localiser: Claude Sonnet 4.6 · Visual Director: Sonnet + image-gen API (Stable Diffusion XL or DALL-E 3) · Formatter + Scheduler: Claude Haiku 4.5"
      phases={[
        {
          step: 1,
          agent: 'Brief Intake Agent',
          model: 'Claude Haiku 4.5',
          trigger: 'Client / account manager submits brief via SaaS form or Slack',
          inputs: [
            'Objective (awareness / leads / sales / trial)',
            'Audience persona + region',
            'Channels + post type',
            'Budget + go-live date',
            'Brand voice tokens',
          ],
          tools: ['SaaS Brief form', 'Slack bot ingestion', 'Brand-voice JSON lookup'],
          outputs: ['Structured brief JSON', 'Asset slot count + spec sheet'],
          durationEst: '< 5 min',
          costEst: 'R 0.40',
        },
        {
          step: 2,
          agent: 'Audience + Trends Agent',
          model: 'Claude Sonnet 4.6 + web',
          trigger: 'Brief JSON validated',
          inputs: ['Audience persona', 'Channel mix', 'Brand category'],
          tools: ['Meta Audience Insights API', 'Google Trends', 'Web search', 'TikTok Creative Center'],
          outputs: ['3 trend signals', 'Best-performing competitor format scan', 'Time-of-week recommendation'],
          durationEst: '8–12 min',
          costEst: 'R 2.20',
        },
        {
          step: 3,
          agent: 'Concept Agent',
          model: 'Claude Opus 4.6',
          trigger: 'Audience signals received',
          inputs: ['Brief JSON', 'Trend signals', 'Brand voice tokens', 'Prior winning concepts (vector DB)'],
          tools: ['Memory: brand voice corpus', 'Memory: prior performance library'],
          outputs: ['3 concept options', 'Rationale per concept', 'Recommended pick + risk note'],
          gate: 'Account Manager picks 1 concept',
          durationEst: '6–10 min',
          costEst: 'R 9.00',
        },
        {
          step: 4,
          agent: 'Copy Agent',
          model: 'Claude Sonnet 4.6',
          trigger: 'Concept locked',
          inputs: ['Selected concept', 'Per-platform character limits', 'Brand voice tokens'],
          tools: ['Platform spec library', 'Banned-word filter'],
          outputs: [
            'IG caption + 5 hashtags (×3 variants)',
            'LinkedIn post (×2 variants)',
            'FB primary text + headline + description',
            'TikTok / Reels hook line + CTA',
            'X thread + alt text',
          ],
          durationEst: '4–8 min',
          costEst: 'R 3.10',
        },
        {
          step: 5,
          agent: 'Visual Director Agent',
          model: 'Sonnet 4.6 + image-gen',
          trigger: 'Copy drafted',
          inputs: ['Concept', 'Brand visual tokens (palette, type, motifs)', 'Per-platform aspect ratios'],
          tools: ['Stable Diffusion XL or DALL-E 3 API', 'Asset library lookup', 'Background remover'],
          outputs: [
            'Image-gen prompts (×3 per platform)',
            'Generated raw images (1:1, 9:16, 4:5, 16:9)',
            'Stock-image alternatives if generation fails',
          ],
          durationEst: '10–20 min',
          costEst: 'R 18–45',
        },
        {
          step: 6,
          agent: 'Asset Production Agent',
          model: 'Sonnet 4.6 + Canva/Figma API',
          trigger: 'Raw visuals + copy ready',
          inputs: ['Generated images', 'Copy variants', 'Brand template tokens'],
          tools: ['Canva Brand Templates API', 'Figma Plugin API', 'Logo + watermark placement'],
          outputs: ['Finished post images per channel spec', 'Carousel decks', 'Video storyboards (if applicable)'],
          durationEst: '6–12 min',
          costEst: 'R 4.20',
        },
        {
          step: 7,
          agent: 'Critic Agent',
          model: 'Claude Opus 4.6',
          trigger: 'Assets ready',
          inputs: ['All channel-ready assets', 'Brand guidelines', 'POPIA + claims rules', 'Accessibility checklist'],
          tools: ['Brand-token compliance check', 'Banned-claims lexicon', 'Alt-text validator', 'Hashtag-ban list'],
          outputs: ['Pass / Fail per asset', 'Suggested fixes if Fail', 'Final approval token'],
          gate: 'Auto-gate: all assets must PASS before next phase',
          durationEst: '3–5 min',
          costEst: 'R 4.10',
        },
        {
          step: 8,
          agent: 'Localiser Agent',
          model: 'Claude Sonnet 4.6',
          trigger: 'Critic-approved',
          inputs: ['Approved EN assets', 'Target languages', 'Cultural-fit notes'],
          tools: ['isiXhosa + Afrikaans corpus', 'Community reviewer queue'],
          outputs: ['Localised copy variants per language', 'Reviewer-queue ticket if quality flag triggered'],
          durationEst: '3–6 min',
          costEst: 'R 2.00',
        },
        {
          step: 9,
          agent: 'Publisher Agent',
          model: 'Haiku 4.5 + scheduling APIs',
          trigger: 'All variants ready and SME publisher signs off',
          inputs: ['Final asset bundle', 'Scheduling calendar', 'Optimal post times from trends agent'],
          tools: ['Meta Graph API', 'LinkedIn Marketing API', 'Buffer / Hootsuite API', 'Mailchimp / Klaviyo'],
          outputs: ['Scheduled posts per channel', 'Confirmation receipt + post IDs', 'Calendar entry in Asana'],
          gate: 'Human publisher sign-off (Account Manager)',
          durationEst: '< 5 min',
          costEst: 'R 0.50',
        },
        {
          step: 10,
          agent: 'Performance Agent',
          model: 'Sonnet 4.6 + analytics APIs',
          trigger: 'Day 1, 7, 14, 30 after publish',
          inputs: ['Post IDs', 'KPI targets from brief'],
          tools: ['Meta Insights API', 'LinkedIn Analytics', 'TikTok Analytics', 'GA4', 'Looker Studio'],
          outputs: [
            'Per-asset metrics (reach, CTR, saves, comments, conv.)',
            'Top performer + bottom performer',
            'Learnings memo into Brand voice corpus (compounds quality next cycle)',
          ],
          durationEst: '5 min per check-in',
          costEst: 'R 1.50',
        },
      ]}
      humanGates={[
        { gate: 'Concept selection',          owner: 'Account Manager',         sla: '< 4 working hours' },
        { gate: 'Critic override (if Fail)',  owner: 'Brand SME / Senior Strategist', sla: '< 2 working hours' },
        { gate: 'Publish sign-off',           owner: 'Account Manager',         sla: '< 2 working hours' },
        { gate: 'isiXhosa reviewer (flagged)', owner: 'Community reviewer panel', sla: '< 24 hours' },
      ]}
      pricingNotes="Three tiers — Starter R 8k/month (≤30 assets), Growth R 20k/month (≤80 assets + always-on critic), Always-on R 45k/month (unlimited within fair-use + dedicated SME). Custom pricing for paid-media spend management."
      definitionOfDone="Each asset published to its channel(s), scheduled in the client's content calendar, archived to the DAM with full metadata, and entered into the 30-day performance loop. Learnings memo logged for next-cycle quality compounding."
      tooling="Anthropic Claude SDK (orchestrator) · Bull + Redis (queue) · Supabase (state) · Buffer / Meta Graph / LinkedIn API (publishing) · Canva Brand Templates + Figma API (production) · Stable Diffusion XL / DALL-E 3 (image gen) · GA4 + Looker (performance) · Slack (in-flight comms)."
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PHASE 5 · PERFORMANCE REPORTS (M&E)
 *  Aggregates monthly content performance + post-campaign reports
 *  into a single monitoring & evaluation view per client.
 * ══════════════════════════════════════════════════════════════════ */

const PERF_COLOUR = '#15803D';

type ClientPerfRow = {
  client: string;
  initials: string;
  reach: number;
  engagement: number;
  conversions: number;
  spendZar: number;
  cpaZar: number;
  roas: number;
  trend: 'up' | 'flat' | 'down';
};

const MOCK_PERF: ClientPerfRow[] = [
  { client: 'Hempire-EC NPC',           initials: 'HE', reach: 184320, engagement: 9.2, conversions: 612, spendZar: 28000, cpaZar: 45.75, roas: 4.2, trend: 'up'   },
  { client: 'IBS Consulting Group',     initials: 'IB', reach:  62150, engagement: 6.8, conversions: 184, spendZar: 14500, cpaZar: 78.80, roas: 2.9, trend: 'up'   },
  { client: 'Khula Woyise Investments', initials: 'KW', reach:  41080, engagement: 7.5, conversions: 132, spendZar:  9800, cpaZar: 74.20, roas: 3.4, trend: 'flat' },
  { client: 'Wellies Manufacturing',    initials: 'WM', reach:  98420, engagement: 8.1, conversions: 286, spendZar: 18200, cpaZar: 63.60, roas: 3.8, trend: 'up'   },
  { client: 'MT Naidoo Properties',     initials: 'MN', reach:  22810, engagement: 5.2, conversions:  41, spendZar:  6400, cpaZar:156.10, roas: 1.6, trend: 'down' },
  { client: 'Lesemba Gallery',          initials: 'LG', reach:  18650, engagement: 9.8, conversions:  72, spendZar:  4200, cpaZar: 58.30, roas: 3.1, trend: 'up'   },
];

function trendBadge(t: ClientPerfRow['trend']) {
  const map = {
    up:   { bg: '#DCFCE7', fg: '#15803D', icon: '▲', label: 'Improving' },
    flat: { bg: '#F1F5F9', fg: '#475569', icon: '■', label: 'Flat' },
    down: { bg: '#FEE2E2', fg: '#B91C1C', icon: '▼', label: 'Declining' },
  };
  const c = map[t];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.fg }}>
      <span>{c.icon}</span><span>{c.label}</span>
    </span>
  );
}

export function PerformanceReportsPage() {
  // Aggregate KPIs
  const totalReach = MOCK_PERF.reduce((s, r) => s + r.reach, 0);
  const totalConv  = MOCK_PERF.reduce((s, r) => s + r.conversions, 0);
  const totalSpend = MOCK_PERF.reduce((s, r) => s + r.spendZar, 0);
  const blendedRoas = (MOCK_PERF.reduce((s, r) => s + r.roas * r.spendZar, 0) / totalSpend).toFixed(2);

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb service="Performance Reports" />

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl" style={{ borderColor: `${PERF_COLOUR}33`, background: `${PERF_COLOUR}08` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0" style={{ background: PERF_COLOUR }}>
            5
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${PERF_COLOUR}20`, color: PERF_COLOUR }}>
                Phase 5 of master workflow
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide bg-slate-900 text-white">
                Monitoring & Evaluation
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Performance Reports</h1>
            <p className="text-sm text-slate-600 mt-1">
              Cross-client monitoring + evaluation. Aggregates monthly content performance, in-flight campaign metrics
              and post-campaign reports. Feeds learnings back into next quarter's content + campaign plan.
            </p>
          </div>
        </div>
      </div>

      {/* Aggregate KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        <KpiCard label="30-day reach"        value={totalReach.toLocaleString('en-ZA')}                colour={PERF_COLOUR} />
        <KpiCard label="30-day conversions"  value={totalConv.toLocaleString('en-ZA')}                 colour="#0E7490" />
        <KpiCard label="30-day media spend"  value={zar(totalSpend)}                                   colour="#B45309" />
        <KpiCard label="Blended ROAS"        value={blendedRoas + 'x'}                                  colour="#15803D" />
      </div>

      {/* Demo data banner */}
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 max-w-6xl">
        <span className="font-semibold">Demo data</span> — will switch to live when
        <code className="mx-1 px-1.5 py-0.5 bg-amber-100 rounded font-mono">GA4</code>,
        <code className="mx-1 px-1.5 py-0.5 bg-amber-100 rounded font-mono">Meta Insights</code>,
        <code className="mx-1 px-1.5 py-0.5 bg-amber-100 rounded font-mono">LinkedIn</code> connectors are wired.
      </div>

      {/* Per-client performance table */}
      <div className="max-w-6xl mb-6">
        <Card title="Per-client performance — last 30 days">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-600 uppercase tracking-wider">
                  <th className="text-left px-3 py-2 font-semibold">Client</th>
                  <th className="text-right px-3 py-2 font-semibold">Reach</th>
                  <th className="text-right px-3 py-2 font-semibold">Eng. rate</th>
                  <th className="text-right px-3 py-2 font-semibold">Conv.</th>
                  <th className="text-right px-3 py-2 font-semibold">Spend</th>
                  <th className="text-right px-3 py-2 font-semibold">CPA</th>
                  <th className="text-right px-3 py-2 font-semibold">ROAS</th>
                  <th className="text-left px-3 py-2 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PERF.map(r => (
                  <tr key={r.client} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded text-white text-[10px] font-bold" style={{ background: PERF_COLOUR }}>
                          {r.initials}
                        </span>
                        <span className="font-semibold text-slate-900">{r.client}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{r.reach.toLocaleString('en-ZA')}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{r.engagement.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{r.conversions.toLocaleString('en-ZA')}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">{zar(r.spendZar)}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">R {r.cpaZar.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs font-bold" style={{ color: r.roas >= 3 ? PERF_COLOUR : r.roas >= 2 ? '#B45309' : '#B91C1C' }}>
                      {r.roas.toFixed(1)}x
                    </td>
                    <td className="px-3 py-2">{trendBadge(r.trend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* M&E feedback loop card */}
      <div className="max-w-6xl mb-6">
        <Card title="M&E feedback loop — how Phase 5 closes back to Phase 3 & 4">
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-800 overflow-x-auto">{`5. Performance M&E (this page)
   ↓ identifies
Top performers ─────────────► back into 3. Content (do more of)
Bottom performers ──────────► back into 3. Content (drop or rework)
Channel ROAS winners ───────► back into 4. Campaign (reallocate budget)
Audience insights ──────────► back into 4. Campaign (refine targeting)
Creative fatigue signals ───► back into 3. Content (refresh brief)

The compounding effect: each cycle the next plan gets sharper because
last cycle's data flowed back in.`}</pre>
        </Card>
      </div>

      {/* Coming next */}
      <div className="max-w-6xl">
        <Card title="Coming next (when this view goes live)">
          <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
            <li>Click a client row → full per-client M&E dashboard (per-channel breakdown, creative-level performance, audience cohort analysis).</li>
            <li>GA4 + Meta + LinkedIn + TikTok API connectors auto-pull metrics nightly.</li>
            <li>Auto-flagged anomalies (CPA spike, engagement drop) push to Account Manager via Slack.</li>
            <li>Monthly PDF report auto-generated for each client and emailed.</li>
            <li>"Compare to last month / quarter / year" toggle.</li>
            <li>Winning creatives auto-archived to the brand asset library for re-use.</li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  SERVICE 4 · KOM CUSTOMERS (internal CRM view)
 *  Lists Knockout Marketing's client book - accounts, engagement
 *  pipeline, MRR, activity. Mock data for now; wire to /clients
 *  API once that endpoint exists.
 * ══════════════════════════════════════════════════════════════════ */

const KC_COLOUR = '#0E7490';

type KomClient = {
  id: string;
  name: string;
  initials: string;
  industry: string;
  status: 'active' | 'pipeline' | 'paused' | 'churned';
  servicesEngaged: string[];      // ['BD','CD','CM']
  monthlyValueZar: number;
  pipelineValueZar: number;
  lastActivity: string;
  accountManager: string;
};

const MOCK_KOM_CLIENTS: KomClient[] = [
  { id: 'c1',  name: 'Hempire-EC NPC',           initials: 'HE', industry: 'Agriculture / NPC',          status: 'active',   servicesEngaged: ['BD','CD','CM'], monthlyValueZar: 45000, pipelineValueZar: 0,      lastActivity: 'Today',     accountManager: 'Jody Naidoo' },
  { id: 'c2',  name: 'IBS Consulting Group',     initials: 'IB', industry: 'Consulting',                 status: 'active',   servicesEngaged: ['BD','CD'],      monthlyValueZar: 28000, pipelineValueZar: 0,      lastActivity: 'Yesterday', accountManager: 'Jody Naidoo' },
  { id: 'c3',  name: 'Khula Woyise Investments', initials: 'KW', industry: 'Holdco / Portfolio',         status: 'active',   servicesEngaged: ['BD'],            monthlyValueZar: 18000, pipelineValueZar: 35000,  lastActivity: '2 days ago',accountManager: 'Sunshine Blouw' },
  { id: 'c4',  name: 'Wellies Manufacturing',    initials: 'WM', industry: 'FMCG / Beverages',           status: 'active',   servicesEngaged: ['CD','CM'],      monthlyValueZar: 22000, pipelineValueZar: 0,      lastActivity: '4 days ago',accountManager: 'Jody Naidoo' },
  { id: 'c5',  name: 'MT Naidoo Properties',     initials: 'MN', industry: 'Real Estate',                status: 'active',   servicesEngaged: ['CD'],            monthlyValueZar: 12000, pipelineValueZar: 0,      lastActivity: '1 week ago',accountManager: 'Sunshine Blouw' },
  { id: 'c6',  name: 'ECRDA Programme Office',   initials: 'EC', industry: 'Government / Agency',        status: 'pipeline', servicesEngaged: [],                monthlyValueZar: 0,     pipelineValueZar: 120000, lastActivity: '3 days ago',accountManager: 'Jody Naidoo' },
  { id: 'c7',  name: 'Lesemba Gallery',          initials: 'LG', industry: 'Arts / Retail',              status: 'active',   servicesEngaged: ['BD'],            monthlyValueZar: 8000,  pipelineValueZar: 0,      lastActivity: '2 weeks ago',accountManager: 'Sunshine Blouw' },
  { id: 'c8',  name: 'High Rollerz',             initials: 'HR', industry: 'Lifestyle / Apparel',        status: 'paused',   servicesEngaged: ['CD'],            monthlyValueZar: 0,     pipelineValueZar: 15000,  lastActivity: '1 month ago',accountManager: 'Sunshine Blouw' },
  { id: 'c9',  name: 'Cell Max',                 initials: 'CM', industry: 'Telco / Retail',             status: 'pipeline', servicesEngaged: [],                monthlyValueZar: 0,     pipelineValueZar: 45000,  lastActivity: '1 week ago',accountManager: 'Jody Naidoo' },
];

function statusBadge(s: KomClient['status']) {
  const map = {
    active:   { bg: '#DCFCE7', fg: '#15803D', label: 'Active' },
    pipeline: { bg: '#DBEAFE', fg: '#1E40AF', label: 'Pipeline' },
    paused:   { bg: '#FEF3C7', fg: '#B45309', label: 'Paused' },
    churned:  { bg: '#FEE2E2', fg: '#B91C1C', label: 'Churned' },
  };
  const c = map[s];
  return (
    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.fg }}>
      {c.label}
    </span>
  );
}

function zar(n: number) {
  return 'R ' + n.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function KomCustomersPage() {
  const [filter, setFilter] = useState<'all' | KomClient['status']>('all');
  const clients = filter === 'all' ? MOCK_KOM_CLIENTS : MOCK_KOM_CLIENTS.filter(c => c.status === filter);

  const totalActive   = MOCK_KOM_CLIENTS.filter(c => c.status === 'active').length;
  const totalPipeline = MOCK_KOM_CLIENTS.filter(c => c.status === 'pipeline').length;
  const totalMrr      = MOCK_KOM_CLIENTS.reduce((s, c) => s + c.monthlyValueZar, 0);
  const totalPipelineValue = MOCK_KOM_CLIENTS.reduce((s, c) => s + c.pipelineValueZar, 0);

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb service="KOM Customers" />

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl" style={{ borderColor: `${KC_COLOUR}33`, background: `${KC_COLOUR}08` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0" style={{ background: KC_COLOUR }}>
            KC
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${KC_COLOUR}20`, color: KC_COLOUR }}>
                Account directory
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide bg-slate-900 text-white">
                Internal · CRM
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">KOM Customers</h1>
            <p className="text-sm text-slate-600 mt-1">
              Knockout Marketing's client book — accounts, services engaged, monthly recurring revenue, pipeline value, and recent activity.
            </p>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        <KpiCard label="Active clients"      value={String(totalActive)}                colour={KC_COLOUR} />
        <KpiCard label="In pipeline"         value={String(totalPipeline)}              colour="#1E40AF" />
        <KpiCard label="Monthly recurring"   value={zar(totalMrr)}                      colour="#15803D" />
        <KpiCard label="Pipeline value"      value={zar(totalPipelineValue)}            colour="#B45309" />
      </div>

      {/* Customer onboarding tile (QBO-shaped intake) */}
      <div className="max-w-6xl mb-6">
        <CustomerOnboardingTile />
      </div>

      {/* Demo data banner */}
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 max-w-6xl">
        <span className="font-semibold">Demo data</span> — this view will switch to live once the
        <code className="mx-1 px-1.5 py-0.5 bg-amber-100 rounded font-mono">/kom-clients</code> API is wired
        (next deployment).
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-3 max-w-6xl">
        {(['all','active','pipeline','paused','churned'] as const).map(k => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              filter === k
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {k === 'all' ? `All (${MOCK_KOM_CLIENTS.length})` : k}
          </button>
        ))}
      </div>

      {/* Client table */}
      <div className="max-w-6xl mb-6">
        <Card title={`Clients (${clients.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-600 uppercase tracking-wider">
                  <th className="text-left px-3 py-2 font-semibold">Client</th>
                  <th className="text-left px-3 py-2 font-semibold">Industry</th>
                  <th className="text-left px-3 py-2 font-semibold">Status</th>
                  <th className="text-left px-3 py-2 font-semibold">Services</th>
                  <th className="text-right px-3 py-2 font-semibold">MRR</th>
                  <th className="text-right px-3 py-2 font-semibold">Pipeline</th>
                  <th className="text-left px-3 py-2 font-semibold">Account mgr</th>
                  <th className="text-left px-3 py-2 font-semibold">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded text-white text-[10px] font-bold" style={{ background: KC_COLOUR }}>
                          {c.initials}
                        </span>
                        <span className="font-semibold text-slate-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-xs">{c.industry}</td>
                    <td className="px-3 py-2">{statusBadge(c.status)}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        {c.servicesEngaged.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">none yet</span>
                        ) : c.servicesEngaged.map(s => (
                          <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {c.monthlyValueZar > 0 ? zar(c.monthlyValueZar) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {c.pipelineValueZar > 0 ? zar(c.pipelineValueZar) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-700">{c.accountManager}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">{c.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* What this view will do once wired */}
      <div className="max-w-6xl">
        <Card title="Coming next (when this view goes live)">
          <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
            <li>Click a client row → drill into full client profile (engagement history, contacts, files, invoices).</li>
            <li>"+ Add client" button → opens client intake modal (similar to engagement intake).</li>
            <li>Auto-pull engagement values from the existing <code className="font-mono">engagements</code> table.</li>
            <li>Sync invoiced amounts from QuickBooks Online to validate MRR.</li>
            <li>Activity timeline aggregates: engagement state changes, content delivered, campaign launches, invoice events.</li>
            <li>Renewal calendar — surfaces contracts due in next 30 / 60 / 90 days.</li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}

function KpiCard({ label, value, colour }: { label: string; value: string; colour: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-lg font-bold mt-1" style={{ color: colour }}>{value}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  CUSTOMER ONBOARDING TILE
 *  Captures all fields needed to create a customer in QuickBooks
 *  Online via the QBO Accounting API. Submit shows a JSON preview
 *  of the QBO-shaped payload + adds a draft client locally.
 * ────────────────────────────────────────────────────────────────── */

type QboCustomerForm = {
  // Identity
  displayName: string;
  companyName: string;
  givenName: string;
  familyName: string;
  title: string;
  // Contact
  primaryEmail: string;
  primaryPhone: string;
  mobile: string;
  website: string;
  // Billing address
  billLine1: string;
  billLine2: string;
  billCity: string;
  billProvince: string;
  billPostal: string;
  billCountry: string;
  // Shipping address
  shipSameAsBilling: boolean;
  shipLine1: string;
  shipLine2: string;
  shipCity: string;
  shipProvince: string;
  shipPostal: string;
  shipCountry: string;
  // Tax + payment
  taxable: boolean;
  vatNumber: string;
  companyRegNumber: string;
  currency: 'ZAR' | 'USD' | 'EUR' | 'GBP';
  paymentTerms: string;
  // SA-specific + notes
  bbbeeLevel: string;
  notes: string;
};

const EMPTY_QBO: QboCustomerForm = {
  displayName: '', companyName: '', givenName: '', familyName: '', title: '',
  primaryEmail: '', primaryPhone: '', mobile: '', website: '',
  billLine1: '', billLine2: '', billCity: '', billProvince: '', billPostal: '', billCountry: 'South Africa',
  shipSameAsBilling: true,
  shipLine1: '', shipLine2: '', shipCity: '', shipProvince: '', shipPostal: '', shipCountry: 'South Africa',
  taxable: true, vatNumber: '', companyRegNumber: '',
  currency: 'ZAR', paymentTerms: 'Net 30',
  bbbeeLevel: '', notes: '',
};

const SA_PROVINCES = ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'];

function CustomerOnboardingTile() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<QboCustomerForm>(EMPTY_QBO);
  const [submitted, setSubmitted] = useState<{ payload: any; refId: string } | null>(null);

  const upd = <K extends keyof QboCustomerForm>(k: K, v: QboCustomerForm[K]) => setForm(p => ({ ...p, [k]: v }));

  function buildQboPayload(): any {
    // Shape mirrors Intuit QuickBooks Online Customer entity
    return {
      DisplayName: form.displayName,
      ...(form.companyName ? { CompanyName: form.companyName } : {}),
      ...(form.givenName   ? { GivenName: form.givenName }     : {}),
      ...(form.familyName  ? { FamilyName: form.familyName }   : {}),
      ...(form.title       ? { Title: form.title }             : {}),
      ...(form.primaryEmail ? { PrimaryEmailAddr: { Address: form.primaryEmail } } : {}),
      ...(form.primaryPhone ? { PrimaryPhone:     { FreeFormNumber: form.primaryPhone } } : {}),
      ...(form.mobile       ? { Mobile:           { FreeFormNumber: form.mobile } }       : {}),
      ...(form.website      ? { WebAddr:          { URI: form.website } }                 : {}),
      BillAddr: {
        Line1: form.billLine1, ...(form.billLine2 ? { Line2: form.billLine2 } : {}),
        City: form.billCity, CountrySubDivisionCode: form.billProvince,
        PostalCode: form.billPostal, Country: form.billCountry,
      },
      ShipAddr: form.shipSameAsBilling
        ? null
        : {
            Line1: form.shipLine1, ...(form.shipLine2 ? { Line2: form.shipLine2 } : {}),
            City: form.shipCity, CountrySubDivisionCode: form.shipProvince,
            PostalCode: form.shipPostal, Country: form.shipCountry,
          },
      Taxable: form.taxable,
      ...(form.vatNumber ? { ResaleNum: form.vatNumber } : {}),
      CurrencyRef: { value: form.currency },
      SalesTermRef: { name: form.paymentTerms },
      Notes: [
        form.companyRegNumber ? `Company reg: ${form.companyRegNumber}` : null,
        form.bbbeeLevel       ? `B-BBEE: ${form.bbbeeLevel}`             : null,
        form.notes            ? form.notes                               : null,
      ].filter(Boolean).join(' | '),
    };
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.displayName.trim()) { alert('Display name is required (QBO needs it).'); return; }
    if (!form.primaryEmail.trim()) { alert('Email is required.'); return; }
    const payload = buildQboPayload();
    const refId = 'KOM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    setSubmitted({ payload, refId });
    // TODO: POST to /kom-clients endpoint when API exists.
    // For now, log so it's inspectable in browser DevTools.
    console.log('[KOM Customer Onboarding] Would POST to /kom-clients + QBO:', { refId, payload });
  }

  function reset() {
    setForm(EMPTY_QBO);
    setSubmitted(null);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Customer onboarded</div>
            <h3 className="text-lg font-bold text-emerald-900 mt-1">{submitted.payload.DisplayName}</h3>
            <div className="text-xs text-emerald-800 mt-1">Reference: <code className="font-mono">{submitted.refId}</code></div>
          </div>
          <button onClick={reset} className="text-xs font-semibold text-emerald-700 hover:underline">Onboard another →</button>
        </div>
        <div className="text-xs text-emerald-800 mb-2 italic">
          Captured locally. Will be POSTed to <code>/kom-clients</code> + synced to QuickBooks Online once those endpoints are wired.
        </div>
        <details className="text-xs text-emerald-900">
          <summary className="cursor-pointer font-semibold py-1">Preview QBO payload (for /v3/customer)</summary>
          <pre className="mt-2 p-3 bg-white border border-emerald-200 rounded font-mono text-[10px] overflow-x-auto">
{JSON.stringify(submitted.payload, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50 hover:bg-cyan-100 hover:border-cyan-400 p-5 transition-all"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-cyan-700">+ Add new customer</div>
            <h3 className="text-lg font-bold text-cyan-900 mt-1">Customer onboarding intake</h3>
            <p className="text-sm text-cyan-800 mt-1">
              Captures every field QuickBooks Online needs to create a customer record. On submit we'll add the
              record to the KOM client book and sync to QBO (once the integration is enabled).
            </p>
          </div>
          <div className="text-2xl text-cyan-600 shrink-0">+</div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['DisplayName','CompanyName','Contact','BillAddr','ShipAddr','Taxable','VAT','PaymentTerms','Currency','Notes'].map(t => (
            <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-cyan-300 text-cyan-700">
              {t}
            </span>
          ))}
        </div>
      </button>
    );
  }

  // Open: full intake form
  return (
    <form onSubmit={submit} className="rounded-xl border-2 border-cyan-300 bg-white p-5 space-y-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Customer onboarding</div>
          <h3 className="text-lg font-bold text-slate-900">New KOM customer (QBO-shaped intake)</h3>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-500 hover:underline">cancel</button>
      </div>

      {/* Identity */}
      <OnbSection title="1 · Identity">
        <OnbField label="Display name *" placeholder="e.g. Hempire-EC NPC" value={form.displayName} onChange={v => upd('displayName', v)} required />
        <OnbField label="Company / trading name" value={form.companyName} onChange={v => upd('companyName', v)} />
        <OnbField label="Title" placeholder="e.g. Mr, Ms, Dr" value={form.title} onChange={v => upd('title', v)} />
        <OnbField label="Contact first name" value={form.givenName} onChange={v => upd('givenName', v)} />
        <OnbField label="Contact last name" value={form.familyName} onChange={v => upd('familyName', v)} />
      </OnbSection>

      {/* Contact */}
      <OnbSection title="2 · Contact">
        <OnbField type="email" label="Email *" value={form.primaryEmail} onChange={v => upd('primaryEmail', v)} required />
        <OnbField type="tel" label="Primary phone" value={form.primaryPhone} onChange={v => upd('primaryPhone', v)} />
        <OnbField type="tel" label="Mobile" value={form.mobile} onChange={v => upd('mobile', v)} />
        <OnbField type="url" label="Website" placeholder="https://" value={form.website} onChange={v => upd('website', v)} />
      </OnbSection>

      {/* Billing */}
      <OnbSection title="3 · Billing address">
        <OnbField className="md:col-span-2" label="Street line 1" value={form.billLine1} onChange={v => upd('billLine1', v)} />
        <OnbField className="md:col-span-2" label="Street line 2" value={form.billLine2} onChange={v => upd('billLine2', v)} />
        <OnbField label="City" value={form.billCity} onChange={v => upd('billCity', v)} />
        <OnbSelect label="Province" value={form.billProvince} onChange={v => upd('billProvince', v)} options={SA_PROVINCES} />
        <OnbField label="Postal code" value={form.billPostal} onChange={v => upd('billPostal', v)} />
        <OnbField label="Country" value={form.billCountry} onChange={v => upd('billCountry', v)} />
      </OnbSection>

      {/* Shipping */}
      <OnbSection title="4 · Shipping address">
        <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" checked={form.shipSameAsBilling} onChange={e => upd('shipSameAsBilling', e.target.checked)} />
          <span>Same as billing address</span>
        </label>
        {!form.shipSameAsBilling && (
          <>
            <OnbField className="md:col-span-2" label="Street line 1" value={form.shipLine1} onChange={v => upd('shipLine1', v)} />
            <OnbField className="md:col-span-2" label="Street line 2" value={form.shipLine2} onChange={v => upd('shipLine2', v)} />
            <OnbField label="City" value={form.shipCity} onChange={v => upd('shipCity', v)} />
            <OnbSelect label="Province" value={form.shipProvince} onChange={v => upd('shipProvince', v)} options={SA_PROVINCES} />
            <OnbField label="Postal code" value={form.shipPostal} onChange={v => upd('shipPostal', v)} />
            <OnbField label="Country" value={form.shipCountry} onChange={v => upd('shipCountry', v)} />
          </>
        )}
      </OnbSection>

      {/* Tax + payment */}
      <OnbSection title="5 · Tax & payment terms">
        <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" checked={form.taxable} onChange={e => upd('taxable', e.target.checked)} />
          <span>Customer is taxable (VAT applies on invoices)</span>
        </label>
        <OnbField label="VAT number" placeholder="e.g. 4123456789" value={form.vatNumber} onChange={v => upd('vatNumber', v)} />
        <OnbField label="Company registration number" placeholder="e.g. 2024/123456/07" value={form.companyRegNumber} onChange={v => upd('companyRegNumber', v)} />
        <OnbSelect label="Currency" value={form.currency} onChange={v => upd('currency', v as any)} options={['ZAR','USD','EUR','GBP']} />
        <OnbSelect label="Payment terms" value={form.paymentTerms} onChange={v => upd('paymentTerms', v)}
          options={['Cash on delivery','Net 7','Net 14','Net 30','Net 60','Net 90']} />
      </OnbSection>

      {/* Notes */}
      <OnbSection title="6 · SA-specific + notes">
        <OnbSelect label="B-BBEE level" value={form.bbbeeLevel} onChange={v => upd('bbbeeLevel', v)}
          options={['','Level 1','Level 2','Level 3','Level 4','Non-compliant','Exempt','Unknown']} />
        <OnbTextarea className="md:col-span-2" label="Notes" rows={3} value={form.notes} onChange={v => upd('notes', v)}
          placeholder="Anything else KOM should know (preferred contact method, key dates, billing oddities...)" />
      </OnbSection>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-slate-200">
        <button type="submit" className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold">
          Submit + preview QBO payload
        </button>
        <button type="button" onClick={() => setForm(EMPTY_QBO)} className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50">
          Reset
        </button>
        <button type="button" onClick={() => setOpen(false)} className="ml-auto px-3 py-2 text-sm text-slate-500 hover:underline">
          Close
        </button>
      </div>
    </form>
  );
}

function OnbSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-widest text-cyan-700 mb-2">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function OnbField({
  label, value, onChange, type = 'text', placeholder, required, className,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 outline-none"
      />
    </div>
  );
}

function OnbSelect({
  label, value, onChange, options, className,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-slate-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 outline-none"
      >
        {options.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
      </select>
    </div>
  );
}

function OnbTextarea({
  label, value, onChange, rows = 3, placeholder, className,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-slate-700 mb-1">{label}</label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 outline-none"
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  SUB-SERVICE 2.2 · CD-TR — Training Programmes Content
 * ══════════════════════════════════════════════════════════════════ */
export function ContentDevTrainingProgrammesService() {
  return (
    <AgentServiceDetail
      name="Content Development — Training Programmes"
      tagline="7-agent SAQA-aligned pipeline producing Learner Guides, Facilitator Guides, Assessment Packs, PoE workbooks and Compliance Matrices. Replaces a 12-week traditional learning-design cycle with a 7–14 day pipeline."
      badge="Sub-service · CD-TR"
      colour="#015807"
      initials="TR"
      breadcrumbName="Training Programmes"
      facts={[
        { label: 'Cycle per module',    value: '7–14 days' },
        { label: 'Cost per module',     value: 'R 25k – R 150k' },
        { label: 'Vs traditional cost', value: 'R 250k – R 800k' },
        { label: 'SAQA coverage',       value: '100% (gate-enforced)' },
      ]}
      modelStack="Planner + Critic: Claude Opus 4.6 (reasoning + verification) · Writer + Assessor + Localiser: Claude Sonnet 4.6 (cost-effective drafting) · Formatter: Claude Haiku 4.5 + python-docx + python-pptx (mechanical rendering)"
      phases={[
        {
          step: 1,
          agent: 'Brief Intake Agent',
          model: 'Claude Haiku 4.5',
          trigger: 'Client submits via SaaS brief form',
          inputs: [
            'SAQA Unit Standard ID (or "I need NQF X")',
            'Target audience (e.g. smallholder farmer)',
            'Language(s)',
            'Brand voice (Hempire / ECRDA / client own)',
            'Tier (Starter / Premium / Enterprise)',
          ],
          tools: ['SaaS Brief form', 'SAQA registry lookup'],
          outputs: ['Validated brief JSON', 'Tier-specific artefact list'],
          durationEst: '< 5 min',
          costEst: 'R 0.60',
        },
        {
          step: 2,
          agent: 'Planner Agent (SAQA)',
          model: 'Claude Opus 4.6',
          trigger: 'Brief validated',
          inputs: ['Unit Standard text', 'Audience persona', 'Credit-hour allocation'],
          tools: ['SAQA registry cache (Supabase)', 'NQF descriptor library'],
          outputs: [
            'Module structure JSON (chapters per SO)',
            '5 Specific Outcomes extracted',
            '20± Assessment Criteria extracted',
            'Word-count budget per chapter',
          ],
          durationEst: '8–15 min',
          costEst: 'R 32',
        },
        {
          step: 3,
          agent: 'Research Agent',
          model: 'Claude Sonnet 4.6 + web tools',
          trigger: 'Module structure ready',
          inputs: ['Subject domain', 'Audience context', 'Per-SO learning topics'],
          tools: ['Web search', 'Vetted ag / regulatory databases', 'Citation extractor'],
          outputs: ['Per-chapter factual base', 'Citation set (8–15 sources)', 'Hallucination risk flags'],
          durationEst: '15–25 min',
          costEst: 'R 48',
        },
        {
          step: 4,
          agent: 'Writer Agent',
          model: 'Claude Sonnet 4.6',
          trigger: 'Research approved',
          inputs: ['Module structure', 'Factual base', 'Brand voice', 'Plain-language target (Grade 8–9)'],
          tools: ['Plain-language style guide', 'Worked-example library'],
          outputs: [
            'Learner Guide chapters (1 per SO)',
            'Facilitator Guide notes',
            'Activities + case studies',
          ],
          durationEst: '45–90 min',
          costEst: 'R 320',
        },
        {
          step: 5,
          agent: 'Assessor Agent',
          model: 'Claude Sonnet 4.6',
          trigger: 'Writer draft complete',
          inputs: ['Each AC + matching content', 'NQF-level question difficulty matrix'],
          tools: ['Question bank library', 'Rubric template'],
          outputs: [
            'Pre/post knowledge test (10 MCQ)',
            'Practical task brief + rubric (Section B)',
            'PoE evidence requirements (Section C)',
            'Marking memorandum',
          ],
          durationEst: '20–40 min',
          costEst: 'R 110',
        },
        {
          step: 6,
          agent: 'Critic Agent',
          model: 'Claude Opus 4.6',
          trigger: 'Writer + Assessor complete',
          inputs: ['All artefacts', 'SAQA SO/AC list', 'Reading-level target', 'Brand standards'],
          tools: ['SAQA-coverage matrix builder', 'Flesch-Kincaid calculator', 'Hallucination scanner'],
          outputs: [
            'PASS / FAIL per quality gate',
            'Specific rewrite instructions if any FAIL',
            'Compliance matrix (SO/AC × content section)',
          ],
          gate: 'Auto-gate: All gates must PASS before Formatter',
          durationEst: '10–20 min',
          costEst: 'R 78',
        },
        {
          step: 7,
          agent: 'Localiser Agent',
          model: 'Sonnet 4.6 + reviewer queue',
          trigger: 'Critic PASS',
          inputs: ['Approved EN content', 'Target languages (default: EN + isiXhosa)', 'Cultural notes'],
          tools: ['isiXhosa key-term corpus', 'Community-reviewer queue', 'Cultural-fit scanner'],
          outputs: [
            'isiXhosa key-term glossary (bilingual)',
            'Localised scenarios + examples',
            'Community-reviewer ticket (paid R 500–1000)',
          ],
          gate: 'Community reviewer must sign off (if Premium+)',
          durationEst: '15–30 min',
          costEst: 'R 65',
        },
        {
          step: 8,
          agent: 'Formatter Agent',
          model: 'Haiku 4.5 + python-docx/pptx',
          trigger: 'Localised content ready',
          inputs: ['Final content', 'Client brand tokens', 'Artefact-tier checklist'],
          tools: ['python-docx', 'python-pptx', 'ReportLab', 'Playwright (PDF fallback)'],
          outputs: [
            'Learner Guide.docx (branded)',
            'Facilitator Guide.docx',
            'Assessment Pack.docx + .pdf',
            'PoE Template.docx',
            'SAQA Compliance Matrix.docx',
            'Slide deck.pptx (Premium+)',
            'SCORM package (Enterprise)',
          ],
          durationEst: '5–10 min',
          costEst: 'R 12',
        },
        {
          step: 9,
          agent: 'Delivery Agent',
          model: 'Haiku 4.5',
          trigger: 'All artefacts rendered AND human gates passed',
          inputs: ['Artefact bundle', 'Client portal credentials', 'LMS / Training Dashboard endpoint'],
          tools: ['Supabase Storage', 'Hempire Training Module Library API', 'LMS SCORM uploader', 'Email API'],
          outputs: [
            'Bundle uploaded to client portal',
            'Auto-link to grower mobile app /me/training',
            'Email notification to client + cohort',
          ],
          gate: 'Final SME + client approval recorded in audit log',
          durationEst: '< 5 min',
          costEst: 'R 1.20',
        },
      ]}
      humanGates={[
        { gate: 'SME (SAQA-registered) sign-off', owner: 'Subject-matter expert (panel)', sla: '4–8 hours per module' },
        { gate: 'isiXhosa community review',      owner: 'Community reviewer panel',      sla: '< 24 hours' },
        { gate: 'Client approval (revision rounds)', owner: 'Client representative',     sla: '1–3 days (tier-dependent)' },
        { gate: 'QCTO / SAQA quality verification (if external accreditation needed)', owner: 'QCTO panel', sla: 'Per QCTO schedule' },
      ]}
      pricingNotes="Three tiers per module — Starter R 25–50k (1 language, 1 revision round), Premium R 80–120k (2 languages, 2 revisions, slide deck), Enterprise R 150k+ (custom voice, 3+ languages, video scripts, audio narration, SCORM-ready)."
      definitionOfDone="All artefacts SME-signed, client-approved, uploaded to client portal AND wired into Hempire Training Module Library where applicable. SAQA Compliance Matrix on file. Audit log complete."
      tooling="Anthropic Claude SDK (orchestrator) · Bull + Redis (queue) · Supabase (content_projects, content_runs, content_artefacts) · python-docx + python-pptx (rendering) · ReportLab (PDF) · ElevenLabs (audio narration, Enterprise) · LMS connectors (SCORM 1.2 + xAPI)."
    />
  );
}
