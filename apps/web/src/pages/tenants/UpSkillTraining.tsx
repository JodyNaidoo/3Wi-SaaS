/**
 * UpSkill Training — Hub.
 *
 * Reached from 3Wi Shared Services > UpSkill Training tile.
 * Replaces the old placeholder. Splits UpSkill into two operating units:
 *
 *   1. HR and Payroll  — back-office people operations for the IBS group
 *                        and external SMME clients.
 *   2. Skills Centre   — accredited learnerships, workshops, farmer +
 *                        corporate training, BBBEE skills delivery.
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  Rainmaker  ›  3Wi Shared Services  ›  UpSkill Training
 */

import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';

const UT_PRIMARY = '#0EA5A4';   // teal — UpSkill brand accent
const HR_ACCENT  = '#0F766E';   // deeper teal
const SC_ACCENT  = '#7C3AED';   // amethyst — Skills Centre

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'G',   label: 'Engagements',      href: '/cc/engagements' },
];

/* ──────────────────────────────────────────────────────────────────
 *  Shared breadcrumb
 * ────────────────────────────────────────────────────────────────── */
function Breadcrumb({ unit }: { unit?: string }) {
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
      {unit
        ? <>
            <Link to="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training" className="hover:underline">UpSkill Training</Link>
            <span className="mx-1.5 text-slate-400">›</span>
            <span className="text-slate-900 font-semibold">{unit}</span>
          </>
        : <span className="text-slate-900 font-semibold">UpSkill Training</span>}
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  UPSKILL HUB
 * ────────────────────────────────────────────────────────────────── */
export function UpSkillTrainingHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb />

      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: UT_PRIMARY }}>
          Shared service · People & Capability
        </div>
        <h1 className="text-3xl font-bold text-slate-900">UpSkill Training</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          The people-operations and capability-building practice of the IBS group. Two operating units:
          <strong> HR &amp; Payroll</strong> runs the back-office machinery (compliance, payslips, contracts) and
          <strong> Skills Centre</strong> delivers SETA-accredited learnerships, corporate workshops, and farmer training programmes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl">
        <UnitTile
          slug="hr-and-payroll"
          name="HR and Payroll"
          tagline="Back-office people operations — payroll, compliance, employee lifecycle, BBBEE skills reporting."
          colour={HR_ACCENT}
          initials="HR"
          model="Monthly retainer"
          services={[
            'Monthly payroll + EMP201 / EMP501',
            'HR compliance pack + contracts',
            'Employee onboarding & offboarding',
            'BBBEE skills-spend reporting',
          ]}
        />
        <UnitTile
          slug="skills-centre"
          name="Skills Centre"
          tagline="Accredited training delivery — learnerships, workshops, farmer + corporate programmes."
          colour={SC_ACCENT}
          initials="SC"
          model="Programme + per-learner pricing"
          services={[
            'SETA-accredited learnerships',
            'Farmer training (planting → harvest)',
            'Corporate workshops & short courses',
            'Train-the-Trainer programmes',
          ]}
        />
      </div>

      <div className="mt-8 max-w-6xl">
        <Card title="Why these two together">
          <div className="text-sm text-slate-700 space-y-2">
            <p>
              Corporates spend mandatory BBBEE skills-development levy on <strong>Skills Centre</strong> learnerships
              and workshops. The same corporates increasingly outsource their <strong>HR &amp; Payroll</strong> to
              specialists rather than carry the in-house overhead. Bundling both lets UpSkill be the single
              people-operations partner — capability built today, capability administered tomorrow.
            </p>
            <p className="text-xs text-slate-500 italic">
              Captive demand floor: every IBS portfolio company uses HR + Payroll. Hempire farmers and ECRDA
              cohorts feed the Skills Centre learner pipeline.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 max-w-6xl">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → Rainmaker → 3Wi Shared Services → <span className="font-semibold" style={{ color: UT_PRIMARY }}>UpSkill Training</span> → [HR &amp; Payroll | Skills Centre]
        </div>
      </div>
    </Shell>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Reusable unit tile on the UpSkill hub
 * ────────────────────────────────────────────────────────────────── */
function UnitTile({
  slug, name, tagline, colour, initials, model, services,
}: {
  slug: string;
  name: string;
  tagline: string;
  colour: string;
  initials: string;
  model: string;
  services: string[];
}) {
  return (
    <Link
      to={`/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/${slug}`}
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
      <div className="text-xs text-slate-500 space-y-0.5">
        {services.map((s) => <div key={s}>• {s}</div>)}
      </div>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: colour }}>
        Open workspace &nbsp;→
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  Reusable workspace shell for unit detail pages
 * ────────────────────────────────────────────────────────────────── */
function UnitWorkspace({
  name, tagline, badge, colour, initials, breadcrumbName,
  facts, sections,
}: {
  name: string;
  tagline: string;
  badge: string;
  colour: string;
  initials: string;
  breadcrumbName: string;
  facts: { label: string; value: string; sub?: string }[];
  sections: { title: string; children: ReactNode }[];
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Breadcrumb unit={breadcrumbName} />

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

      {facts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{f.label}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{f.value}</div>
              {f.sub ? <div className="text-xs text-slate-500 mt-0.5">{f.sub}</div> : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl">
        {sections.map((s) => (
          <Card key={s.title} title={s.title}>{s.children}</Card>
        ))}
      </div>
    </Shell>
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PAGE: HR and Payroll
 * ══════════════════════════════════════════════════════════════════ */
export function HrAndPayrollPage() {
  return (
    <UnitWorkspace
      name="HR and Payroll"
      tagline="Back-office people operations for the IBS group and external SMME clients."
      badge="UpSkill · Operations"
      colour={HR_ACCENT}
      initials="HR"
      breadcrumbName="HR and Payroll"
      facts={[
        { label: 'Service model',     value: 'Monthly retainer', sub: 'Per-employee pricing tier' },
        { label: 'SLA',               value: 'Payslips by 25th', sub: 'Pay run completed for 28th' },
        { label: 'Compliance focus',  value: 'SARS · CIPC · DoL', sub: 'Zero-penalty target' },
        { label: 'BBBEE',             value: 'Skills spend',     sub: 'Reporting + scorecard input' },
      ]}
      sections={[
        {
          title: 'Service catalogue',
          children: (
            <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
              <li>Monthly payroll run — payslips, EFT files, EMP201, EMP501</li>
              <li>Employment contracts + employee handbook drafting</li>
              <li>Employee onboarding (offer letter → induction → contract)</li>
              <li>Offboarding (resignation → UI19 → final pay)</li>
              <li>Leave register + leave-cycle reset</li>
              <li>BBBEE skills-spend tracking + scorecard data</li>
              <li>Department of Labour returns (UI8 / UI19 / OID)</li>
              <li>Disciplinary support (warnings, hearings, CCMA prep)</li>
              <li>HR policies (POPIA, harassment, BCEA-aligned)</li>
            </ul>
          ),
        },
        {
          title: 'Monthly process flow',
          children: (
            <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-800 overflow-x-auto">{`Day 1-5    Capture variables (overtime, leave, deductions)
Day 10     Draft payslips for client review
Day 15     Client approval gate
Day 20     Final payslips issued
Day 25     EFT file released to bank
Day 28     Payment hits employees
Month-end  EMP201 submission to SARS
Annually   EMP501 reconciliation, IRP5s, UI19s`}</pre>
          ),
        },
        {
          title: 'Compliance calendar',
          children: (
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr><th className="text-left py-1">Filing</th><th className="text-left">Cadence</th><th className="text-left">Deadline</th></tr>
              </thead>
              <tbody>
                <tr><td className="py-1">EMP201 (PAYE)</td><td>Monthly</td><td>7th of next month</td></tr>
                <tr><td className="py-1">EMP501 reconciliation</td><td>Twice yearly</td><td>May + Oct</td></tr>
                <tr><td className="py-1">IRP5 / IT3(a)</td><td>Annually</td><td>End May</td></tr>
                <tr><td className="py-1">UI19 (per termination)</td><td>Ad hoc</td><td>7 days after end</td></tr>
                <tr><td className="py-1">OID return (W.As 8)</td><td>Annually</td><td>End March</td></tr>
                <tr><td className="py-1">EEA2 (50+ employees)</td><td>Annually</td><td>15 Jan</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          title: 'Captive vs external split',
          children: (
            <div className="text-sm text-slate-700 space-y-2">
              <div className="flex justify-between"><span>Internal: Wellies, Hempire-EC, Khula Woyise portfolio</span><span className="font-mono text-emerald-700">Captive</span></div>
              <div className="flex justify-between"><span>External SMME clients</span><span className="font-mono text-amber-700">Growth target</span></div>
              <p className="text-xs text-slate-500 italic mt-2">Track <em>per-employee</em> price for benchmarking against PaySpace, SimplePay, Sage.</p>
            </div>
          ),
        },
      ]}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  PAGE: Skills Centre
 * ══════════════════════════════════════════════════════════════════ */
export function SkillsCentrePage() {
  return (
    <UnitWorkspace
      name="Skills Centre"
      tagline="Accredited training delivery — learnerships, workshops, farmer + corporate programmes."
      badge="UpSkill · Delivery"
      colour={SC_ACCENT}
      initials="SC"
      breadcrumbName="Skills Centre"
      facts={[
        { label: 'Accreditation',  value: 'QCTO + SETAs', sub: 'AgriSETA, Services SETA target' },
        { label: 'Pricing',        value: 'Per learner',  sub: 'Or per-programme cohort' },
        { label: 'BBBEE driver',   value: 'Skills levy',  sub: 'Corporate B-BBEE scorecard' },
        { label: 'Capacity',       value: 'TBC',          sub: 'Set classroom + remote bandwidth' },
      ]}
      sections={[
        {
          title: 'Programme catalogue',
          children: (
            <ul className="text-sm text-slate-700 list-disc ml-5 space-y-1">
              <li><strong>SETA Learnerships</strong> — 12-month accredited qualifications with NQF credits</li>
              <li><strong>Farmer Training</strong> — planting, harvest, post-harvest, GAP / GACP compliance</li>
              <li><strong>Corporate Workshops</strong> — 1–3 day short courses (leadership, sales, ops)</li>
              <li><strong>Train-the-Trainer</strong> — equips client internal trainers, scaled delivery</li>
              <li><strong>Custom Programmes</strong> — bespoke client curriculum (POPIA-bound)</li>
            </ul>
          ),
        },
        {
          title: 'Learner lifecycle',
          children: (
            <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-800 overflow-x-auto">{`1.  Sponsor signs MoA (corporate or SETA)
2.  Learner recruitment + selection
3.  Onboarding + induction
4.  Classroom + practical delivery
5.  Formative assessments + portfolio of evidence
6.  External moderation (ETQA)
7.  Summative assessment
8.  Statement of Results (SoR) issued
9.  SETA reporting + BBBEE scorecard data to sponsor
10. Tracer study (3 / 6 / 12 month employment outcomes)`}</pre>
          ),
        },
        {
          title: 'Active accreditation status',
          children: (
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr><th className="text-left py-1">Body</th><th className="text-left">Status</th><th className="text-left">Renews</th></tr>
              </thead>
              <tbody>
                <tr><td className="py-1">QCTO (umbrella)</td><td className="font-mono text-amber-700">TBC</td><td className="font-mono">—</td></tr>
                <tr><td className="py-1">AgriSETA</td><td className="font-mono text-amber-700">TBC</td><td className="font-mono">—</td></tr>
                <tr><td className="py-1">Services SETA</td><td className="font-mono text-amber-700">TBC</td><td className="font-mono">—</td></tr>
                <tr><td className="py-1">CHIETA (chemicals)</td><td className="font-mono text-slate-400">Future</td><td className="font-mono">—</td></tr>
              </tbody>
              <tfoot>
                <tr><td colSpan={3} className="pt-3 text-xs italic text-slate-500">Fill in accreditation numbers + renewal dates when issued.</td></tr>
              </tfoot>
            </table>
          ),
        },
        {
          title: 'Pipeline + cross-sell',
          children: (
            <div className="text-sm text-slate-700 space-y-2">
              <p>Internal learner pipeline:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Hempire-EC growers (cultivation, harvest, GACP)</li>
                <li>Wellies factory operators (food safety, FMCG ops)</li>
                <li>Khula Woyise portfolio staff (retail, hospitality)</li>
              </ul>
              <p className="mt-2">External lead source: corporates spending mandatory BBBEE skills levy.</p>
              <p className="text-xs text-slate-500 italic mt-1">
                Cross-sell: corporates who buy Skills Centre programmes often need Knockout Marketing
                (employer branding around the learnership) and Affinity Accounting (their internal compliance).
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}
