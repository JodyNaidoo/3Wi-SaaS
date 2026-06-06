/**
 * ECRDA Hemp Offtaker Vetting + Technical Needs Analysis.
 *
 * Step 1 of the ECRDA 2026/2027 MOA master delivery process.
 * Implements the process flow from the ECRDA Hemp Offtaker
 * Submission Checklist v1.0 (Apr 2026):
 *   - 10 checklist sections + 2 annexures
 *   - 6-point initial screening rubric (Annexure B.2)
 *   - 5-tier approval chain (Annexure B.4)
 */

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { offtakers, type OfftakerDashboardData } from '../../lib/api/offtakers';

const ACCENT = '#0E7490';   // matches the MOA workspace teal
const OFFTAKERS_SMARTSHEET_URL = 'https://app.smartsheet.eu/sheets/CCjj6QrG222hJxWG7VQqhPfv8fxhVvhGP2gJcc81';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities', href: '/cc/director' },
  { key: 'F6', label: 'Growers',      href: '/cc/growers' },
  { key: 'G',  label: 'Engagements',  href: '/cc/engagements' },
];

export function OfftakerVettingWorkflow() {
  const [stats, setStats] = useState<OfftakerDashboardData | null>(null);
  useEffect(() => {
    let cancelled = false;
    offtakers.dashboard()
      .then(d => { if (!cancelled) setStats(d); })
      .catch(() => { /* silent — banner not critical */ });
    return () => { cancelled = true; };
  }, []);
  const total = stats?.total ?? 0;
  const approved = stats?.approvedCount ?? 0;
  const inPipeline = total - approved - (stats?.byStatus?.declined ?? 0);

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-3">
        <Link to="/cc/director" className="hover:underline">3Wi</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs/consulting" className="hover:underline">IBS Consulting</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs/consulting/hempire-ec" className="hover:underline">Hempire EC</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa" className="hover:underline">ECRDA 2026/2027 MOA</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <span className="text-slate-900 font-semibold">Step 1 · Offtaker Vetting + TNA</span>
      </nav>

      {/* Prominent CTA banner — open the submission form */}
      <div className="rounded-2xl border-2 p-4 mb-4 max-w-6xl flex flex-wrap items-center justify-between gap-3"
           style={{ borderColor: ACCENT, background: ACCENT, color: 'white' }}>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold uppercase tracking-widest text-cyan-100">Coordinator action</div>
          <div className="text-base md:text-lg font-bold">Issue or capture the Offtaker Submission Checklist</div>
          <div className="text-xs text-cyan-100 mt-0.5">
            Standalone form an offtaker fills in (Sections 1–10 + Annexure A). Deployable anywhere — currently SaaS-hosted at <code>/offtaker-submission-form.html</code>.
          </div>
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            <span className="bg-white/15 rounded-md px-2 py-1">
              <strong className="text-base text-white">{total}</strong> <span className="text-cyan-100">total submissions</span>
            </span>
            <span className="bg-emerald-700/40 rounded-md px-2 py-1">
              <strong className="text-base text-white">{approved}</strong> <span className="text-emerald-100">approved in pool</span>
            </span>
            <span className="bg-amber-700/40 rounded-md px-2 py-1">
              <strong className="text-base text-white">{Math.max(0, inPipeline)}</strong> <span className="text-amber-100">in pipeline</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <a href="/offtaker-submission-form.html" target="_blank" rel="noopener noreferrer"
             className="px-5 py-3 rounded-lg bg-white text-[#0E7490] font-semibold text-sm hover:bg-cyan-50">
            ↗  Offtaker Vetting Form
          </a>
          <Link to="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-1-offtaker-vetting/dashboard"
                className="relative px-5 py-3 rounded-lg bg-cyan-700 text-white font-semibold text-sm hover:bg-cyan-800">
            📊  Offtaker Dashboard
            {total > 0 ? (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-xs font-bold rounded-full min-w-[24px] h-6 px-1.5 flex items-center justify-center shadow">
                {total}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0A` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: ACCENT }}>1</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${ACCENT}20`, color: ACCENT }}>
                Master process · Step 1 of 3
              </span>
              <span className="text-xs text-slate-500">Demand-led — confirms market before recruiting growers</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Offtaker Vetting + Technical Needs Analysis</h1>
            <p className="text-sm text-slate-600 mt-1">
              Standardised information-gathering + evaluation of prospective hemp offtakers seeking to buy
              produce from Eastern Cape farmers. Outputs feed Step 2 (Hub Blueprint development) and
              Step 3 (Grower onboarding programme).
            </p>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        <Kpi label="Checklist sections"   value="10 + 2 annexures" sub="ECRDA v1.0, April 2026" />
        <Kpi label="Screening dimensions" value="6"                sub="Annexure B.2" />
        <Kpi label="Approval chain"       value="5 sign-offs"      sub="Reviewer → CEO" />
        <Kpi label="Typical cycle"        value="8–12 weeks"       sub="Submission → pool admission" />
      </div>

      {/* Master process position */}
      <div className="max-w-6xl mb-4">
        <Card title="Position in the master process">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <PositionTile n={1} title="Offtaker vetting + TNA" current
              desc="Confirm what the market will buy + capture support model." />
            <PositionTile n={2} title="Support hub blueprint"
              href="/hub-support-dashboard.html" external
              desc="Design hub infrastructure to meet the TNA-identified needs." />
            <PositionTile n={3} title="Grower onboarding programme"
              href="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding"
              desc="Recruit + onboard growers into a hub with a confirmed buyer." />
          </div>
          <p className="text-xs text-slate-500 italic mt-3">
            Each approved offtaker's TNA findings become inputs to Step 2 (per-hub blueprint) and inform Step 3 (training curriculum + inputs).
          </p>
        </Card>
      </div>

      {/* 8-phase workflow */}
      <div className="max-w-6xl mb-4">
        <Card title="Workflow — 8 phases">
          <ol className="relative border-l-2 border-slate-200 ml-3 space-y-6">
            <Phase n={1} title="Outreach + checklist issuance" duration="1–2 weeks per cohort"
              activities={[
                'Identify target offtakers (sector mapping, ECRDA network, public domain, industry bodies)',
                'Issue checklist with cover letter + return instructions',
                'Open Q&A support channel (email + WhatsApp)',
                'Set a per-cohort submission deadline',
              ]}
              deliverable="Issued-checklists tracker + Q&A log" />

            <Phase n={2} title="Submission intake (Annexure B.1)" duration="Continuous"
              activities={[
                'Date-stamp on receipt',
                'Completeness check against required sections',
                'Assign unique reference: ECRDA/HEMP/####/2026',
                'Issue acknowledgment letter to respondent',
              ]}
              deliverable="Submission registered + acknowledged"
              gate="Complete OR returned to respondent" />

            <Phase n={3} title="Initial screening (Annexure B.2)" duration="1–2 weeks per submission"
              activities={[
                'Legal entity verified (CIPC + MOI)',
                'Tax status verified (SARS TCS)',
                'Financial strength scored (Strong / Adequate / Weak / Unverified)',
                'Product-market fit (Aligned / Partial / Unclear / Misaligned)',
                'Farmer support commitment (Substantial / Moderate / Minimal / None)',
                'Geographic fit with ECRDA priorities (High / Moderate / Low)',
              ]}
              deliverable="Screening scorecard"
              gate="Proceed to TNA OR decline at screening" />

            <Phase n={4} title="Technical Needs Analysis (Sections 4 + 7 deep dive)" duration="2–3 weeks"
              activities={[
                'Per-product quality + volume + format requirements (Section 3.2 → Section 7.2)',
                'Map their farmer-support model: pre-plant, in-season, post-harvest, training, inputs',
                'Assess their on-farm technical capability (agronomists, hotlines, extension)',
                'Identify gaps the Hub Blueprint (Step 2) must fill',
                'Cross-check seasonality + logistics for the target districts',
              ]}
              deliverable="Technical Needs Analysis (TNA) report" />

            <Phase n={5} title="Reference + financial verification (Sections 8.2 + 8.3)" duration="1–2 weeks"
              activities={[
                'Audited financials reviewed (last 2–3 years)',
                'Bank verification call',
                'Contact 3 references (client / supplier / financial)',
                'Track-record validated against existing supply contracts',
              ]}
              deliverable="Verification pack" />

            <Phase n={6} title="Evaluation notes + recommendation drafting (B.3 + B.4)" duration="1 week"
              activities={[
                'Compile screening + TNA + verification into Evaluation Notes',
                'Score against ECRDA rubric',
                'Draft recommendation: Approve / Approve-Conditional / Defer / Decline',
                'Identify conditions if conditional approval',
              ]}
              deliverable="Recommendation memo" />

            <Phase n={7} title="Approval chain (Annexure B.4 — 5 sign-offs)" duration="2–4 weeks"
              activities={[
                '1. Reviewer signs Evaluation Notes',
                '2. ECRDA Programme Manager sign-off',
                '3. ECRDA Sector Head sign-off',
                '4. ECRDA IPM Executive sign-off',
                '5. ECRDA CEO sign-off',
              ]}
              deliverable="Signed approval (or decline) with audit trail"
              gate="CEO sign-off" />

            <Phase n={8} title="Pool admission + farmer-facing publication" duration="1 week"
              activities={[
                'Add offtaker profile to the vetted pool',
                'Publish to farmer-facing directory',
                'Feed TNA findings to Hub Blueprint (Step 2)',
                'Schedule periodic re-vetting (annual default)',
                'Notify offtaker of admission + onboarding pack',
              ]}
              deliverable="Live offtaker profile + Step 2 hand-off" />
          </ol>
        </Card>
      </div>

      {/* Two-column: Screening rubric + Approval chain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mb-4">
        <Card title="Initial screening rubric (Annexure B.2)">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase tracking-wider">
              <tr><th className="text-left py-1">Dimension</th><th className="text-left">Possible scores</th></tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100"><td className="py-2">Legal entity verified</td><td className="text-xs">Yes / No / Pending</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Tax status verified</td><td className="text-xs">Yes / No / Pending</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Financial strength</td><td className="text-xs">Strong / Adequate / Weak / Unverified</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Product-market fit</td><td className="text-xs">Aligned / Partial / Unclear / Misaligned</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Farmer-support commitment</td><td className="text-xs">Substantial / Moderate / Minimal / None</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Geographic fit (ECRDA priorities)</td><td className="text-xs">High / Moderate / Low</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-500 italic mt-3">
            "Substantial" support + "Aligned" product-market fit are de-facto pass criteria. Weak financial strength is grounds for decline regardless of other scores.
          </p>
        </Card>

        <Card title="Approval chain (Annexure B.4)">
          <ol className="text-sm space-y-2 ml-1">
            <ApprovalStep n={1} role="Reviewer" note="Compiles evaluation pack + initial recommendation" />
            <ApprovalStep n={2} role="ECRDA Programme Manager" note="Endorses or returns for revision" />
            <ApprovalStep n={3} role="ECRDA Sector Head" note="Confirms sector strategic fit" />
            <ApprovalStep n={4} role="ECRDA IPM Executive" note="Resource + portfolio alignment" />
            <ApprovalStep n={5} role="ECRDA CEO" note="Final approval — adds to pool" gate />
          </ol>
          <p className="text-xs text-slate-500 italic mt-3">
            Sign-offs captured via DocuSign + archived to the SharePoint submission folder. Audit trail required for ECRDA M&E.
          </p>
        </Card>
      </div>

      {/* Checklist anatomy */}
      <div className="max-w-6xl mb-4">
        <Card title="Checklist anatomy — what the submission contains">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <Section n="1"  title="Respondent and Company Details" subs="Legal name, registration, ownership, B-BBEE" />
            <Section n="2"  title="Geographic Area of Interest"    subs="Districts, LMs, existing presence, expansion stance" />
            <Section n="3"  title="Offtake Model and Product Focus" subs="Category (trader/processor), products, scale" />
            <Section n="4"  title="Farmer Support and Training"    subs="Pre-plant, in-season, harvest, training, inputs" />
            <Section n="5"  title="Commercial Terms"               subs="Contracting, pricing, payment" />
            <Section n="6"  title="Operational and Logistics"      subs="Collection, storage, processing, seasonality" />
            <Section n="7"  title="Market Access + Downstream Demand" subs="Buyers, absorption capacity, expansion plans" />
            <Section n="8"  title="Compliance + References"        subs="Regulatory, financial, references" />
            <Section n="9"  title="Risks, Dependencies, Constraints" subs="Self-disclosed risks + mitigations" />
            <Section n="10" title="Respondent Declaration"          subs="Signed truthfulness + verification consent" />
            <Section n="A"  title="Annexure A — Supporting Docs"   subs="7 categories: legal, financial, licences, market, ops, refs, other" />
            <Section n="B"  title="Annexure B — ECRDA Internal Use" subs="Receipt, screening, evaluation, recommendation" />
          </div>
        </Card>
      </div>

      {/* Tooling + DoD + Linked artefacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mb-4">
        <Card title="Standard tooling">
          <ul className="text-sm text-slate-700 space-y-1 list-disc ml-4">
            <li><strong>Smartsheet</strong> — offtaker register + intake tracker</li>
            <li><strong>SharePoint</strong> — submission archive (one folder per ECRDA/HEMP/####/2026)</li>
            <li><strong>Notion</strong> — evaluation rubric + Q&amp;A log</li>
            <li><strong>DocuSign</strong> — approval chain signatures (5 sign-offs)</li>
            <li><strong>Affinity Accounting</strong> — financial verification (internal cross-sell from 3Wi Shared Services)</li>
            <li><strong>Power BI</strong> — vetted-pool dashboard for farmers</li>
            <li><strong>Email + WhatsApp</strong> — offtaker outreach + Q&amp;A</li>
          </ul>
        </Card>

        <Card title="Definition of Done">
          <p className="text-sm text-slate-700">
            Approved offtaker added to the vetted pool, visible to farmers in the directory, TNA report logged
            and fed into Hub Blueprint development (Step 2). Annual re-vetting scheduled. Full submission
            archived to SharePoint with the unique reference number.
          </p>
        </Card>
      </div>

      {/* Linked artefacts */}
      <div className="max-w-6xl mb-4">
        <Card title="Linked artefacts">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase tracking-wider">
              <tr><th className="text-left py-1">Artefact</th><th className="text-left">Status</th><th className="text-left">Location</th></tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100"><td className="py-2">Checklist v1.0 — interactive submission form</td><td><Pill kind="ok">Live</Pill></td><td className="text-xs"><a href="/offtaker-submission-form.html" target="_blank" rel="noopener" className="text-cyan-700 underline">Open form ↗</a></td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Checklist v1.0 (source DOCX)</td><td><Pill kind="ok">Live</Pill></td><td className="text-xs text-slate-500">SharePoint &gt; ECRDA &gt; Offtaker Checklist v1.0</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Offtaker register</td><td><Pill kind="ok">Live</Pill></td><td className="text-xs"><a href={OFFTAKERS_SMARTSHEET_URL} target="_blank" rel="noopener" className="text-cyan-700 underline">Open Smartsheet ↗</a></td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Submission archive folder template</td><td><Pill kind="amber">Drafting</Pill></td><td className="text-xs text-slate-500">SharePoint folder schema TBD</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Evaluation rubric (Notion)</td><td><Pill kind="amber">Drafting</Pill></td><td className="text-xs text-slate-500">Notion &gt; ECRDA &gt; Offtaker Evaluation</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Approval-chain template (DocuSign)</td><td><Pill kind="amber">Drafting</Pill></td><td className="text-xs text-slate-500">DocuSign envelope template TBD</td></tr>
              <tr className="border-t border-slate-100"><td className="py-2">Farmer-facing directory page</td><td><Pill kind="slate">Planned</Pill></td><td className="text-xs text-slate-500">/cc/offtakers (future)</td></tr>
            </tbody>
          </table>
        </Card>
      </div>

      {/* RACI */}
      <div className="max-w-6xl">
        <Card title="RACI — Responsible · Accountable · Consulted · Informed">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-2 py-2 font-semibold">Role</th>
                  <th className="px-2 py-2 text-center">Outreach</th>
                  <th className="px-2 py-2 text-center">Intake</th>
                  <th className="px-2 py-2 text-center">Screening</th>
                  <th className="px-2 py-2 text-center">TNA</th>
                  <th className="px-2 py-2 text-center">Verify</th>
                  <th className="px-2 py-2 text-center">Approve</th>
                  <th className="px-2 py-2 text-center">Publish</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['ECRDA Programme Officer',         'R',  'A R','A R','C',  'C',  'I',  'R'  ],
                  ['IBS Consulting Sector Lead',      'C',  'C',  'R',  'A R','R',  'C',  'C'  ],
                  ['Affinity Accounting (financial)', 'I',  'I',  'I',  'I',  'A R','I',  'I'  ],
                  ['ECRDA Programme Manager',         'A',  'A',  'A',  'A',  'A',  'R',  'A'  ],
                  ['ECRDA Sector Head',               'I',  'I',  'I',  'C',  'I',  'R',  'I'  ],
                  ['ECRDA IPM Executive',             'I',  'I',  'I',  'I',  'I',  'R',  'I'  ],
                  ['ECRDA CEO',                       'I',  'I',  'I',  'I',  'I',  'A R','I'  ],
                  ['Offtaker',                        'R',  'R',  'C',  'C',  'C',  'I',  'I'  ],
                  ['Hempire-EC (NPC implementer)',    'C',  'C',  'C',  'C',  'I',  'I',  'A'  ],
                ].map(([role, ...cells]) => (
                  <tr key={role} className="border-t border-slate-100">
                    <td className="px-2 py-1.5 font-medium">{role}</td>
                    {cells.map((c, i) => <td key={i} className="px-2 py-1.5 text-center font-mono">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

/* ────── Small components ────── */

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-900 mt-1">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
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

function Phase({ n, title, duration, activities, deliverable, gate }: {
  n: number;
  title: string;
  duration?: string;
  activities: string[];
  deliverable: string;
  gate?: string;
}) {
  return (
    <li className="ml-6">
      <span className="absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
            style={{ background: ACCENT }}>{n}</span>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        {duration ? <span className="text-xs font-mono text-slate-500">{duration}</span> : null}
      </div>
      <ul className="text-sm text-slate-700 list-disc ml-5 space-y-0.5 mb-2">
        {activities.map((a) => <li key={a}>{a}</li>)}
      </ul>
      <div className="text-xs text-slate-600">
        <span className="font-semibold">Deliverable:</span> {deliverable}
      </div>
      {gate ? (
        <div className="mt-2 inline-block text-xs font-semibold px-2 py-1 rounded"
             style={{ background: `${ACCENT}15`, color: ACCENT }}>
          ────── GATE: {gate} ──────
        </div>
      ) : null}
    </li>
  );
}

function ApprovalStep({ n, role, note, gate }: { n: number; role: string; note: string; gate?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white shrink-0 ${gate ? 'ring-2 ring-offset-1 ring-emerald-400' : ''}`}
            style={{ background: ACCENT }}>{n}</span>
      <div className="flex-1">
        <div className="font-semibold text-slate-900">{role}</div>
        <div className="text-xs text-slate-500">{note}</div>
      </div>
    </li>
  );
}

function Section({ n, title, subs }: { n: string; title: string; subs: string }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold uppercase shrink-0"
            style={{ background: `${ACCENT}15`, color: ACCENT }}>{n}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-900 text-sm">{title}</div>
        <div className="text-xs text-slate-500">{subs}</div>
      </div>
    </div>
  );
}

function Pill({ kind, children }: { kind: 'ok' | 'amber' | 'slate'; children: React.ReactNode }) {
  const cls = kind === 'ok'    ? 'bg-emerald-100 text-emerald-800'
            : kind === 'amber' ? 'bg-amber-100 text-amber-800'
            :                    'bg-slate-100 text-slate-700';
  return <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${cls}`}>{children}</span>;
}
