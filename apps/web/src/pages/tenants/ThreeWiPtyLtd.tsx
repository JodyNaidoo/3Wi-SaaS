/**
 * 3WI Pty Ltd (RN) — parent holding company hub.
 *
 * The missing piece. Sits ABOVE the operating tenants (IBS, Wellies,
 * Khula Woyise, MT Naidoo, Trusts) as the holdco itself.
 *
 * Matches the SharePoint architecture at
 * https://3wiptyltd.sharepoint.com/sites/3WIPtyLtd which holds:
 *   - Group Architecture & Designs
 *   - Group Strategy
 *   - Group Compliance & Legal
 *   - Group HR
 */

import { ServiceHubShell, ServiceTile, ServiceDetail, type Crumb } from '../../components/service-hub/ServiceHubKit';

const TW_PRIMARY = '#1F4D2C';   // hempire deep green
const BASE_CRUMBS: Crumb[] = [
  { label: '3Wi', href: '/cc/director' },
];
const HUB_BASE = '/tenants/3wi-pty-ltd';

function detailCrumbs(name: string): Crumb[] {
  return [...BASE_CRUMBS, { label: '3WI Pty Ltd (RN)', href: HUB_BASE }, { label: name }];
}

/* ────── HUB ────── */
export function ThreeWiPtyLtdHub() {
  return (
    <ServiceHubShell
      crumbs={[...BASE_CRUMBS, { label: '3WI Pty Ltd (RN)' }]}
      eyebrow="Group · Parent holding company"
      eyebrowColour={TW_PRIMARY}
      title="3WI Pty Ltd (RN)"
      intro={<>
        The parent holding company that sits above all operating tenants — IBS, Wellies, Khula Woyise,
        MT Naidoo Properties, and the two family trusts. Four group functions live here: Architecture,
        Strategy, Compliance &amp; Legal, and HR.
      </>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <ServiceTile to={`${HUB_BASE}/group-architecture`} initials="GA" colour={TW_PRIMARY}
          name="Group Architecture & Designs" meta="Group function"
          tagline="Org chart, entity structures, brand architecture across the IBS group."
          bullets={['Holdco / opco / SPV structures', 'Entity register + relationships', 'Brand architecture map', 'Inter-company flows']} />
        <ServiceTile to={`${HUB_BASE}/group-strategy`} initials="GS" colour="#2D7A3E"
          name="Group Strategy" meta="Group function"
          tagline="Multi-year strategy across all operating divisions. Annual cycle + quarterly review."
          bullets={['3-year group strategy', 'Annual operating plan', 'Capital allocation', 'Quarterly group review']} />
        <ServiceTile to={`${HUB_BASE}/group-compliance`} initials="GC" colour="#4F7942"
          name="Group Compliance & Legal" meta="Group function"
          tagline="Statutory + regulatory + contractual compliance across all entities."
          bullets={['Statutory register (all entities)', 'Contract repository', 'Regulatory tracker', 'BBBEE consolidated scorecard']} />
        <ServiceTile to={`${HUB_BASE}/group-hr`} initials="GH" colour="#6B8E23"
          name="Group HR" meta="Group function"
          tagline="Group-wide HR policies, talent + comp benchmarking, cross-entity mobility."
          bullets={['Group HR policy library', 'Comp + benefits benchmark', 'Talent + succession planning', 'Cross-entity mobility']} />
      </div>

      <div className="mt-8 max-w-6xl">
        <ServiceHubShellNote />
      </div>
    </ServiceHubShell>
  );
}

function ServiceHubShellNote() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Position in the group</div>
      <pre className="text-xs font-mono text-slate-700 overflow-x-auto bg-slate-50 p-3 rounded">{`3WI Pty Ltd (RN)   ◄── you are here (parent)
   │
   ├── IBS  (operating)
   │     ├── IBS Consulting -> Hempire-EC -> PSC etc.
   │     └── Rainmaker -> 3Wi Shared Services
   │
   ├── Wellies More For You Management  (operating)
   ├── Khula Woyise Investments         (operating - holding portfolio of 5 SMEs)
   ├── MT Naidoo Properties             (operating - real estate)
   ├── JKM Naidoo Family Trust          (estate)
   └── RM Naidoo Family Trust           (estate)`}</pre>
    </div>
  );
}

/* ────── 1. GROUP ARCHITECTURE ────── */
export function GroupArchitecturePage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Group Architecture & Designs')}
      name="Group Architecture & Designs" tagline="Maintain the org chart, entity structures, brand architecture, and inter-company flows across the IBS group."
      badge="Group function" colour={TW_PRIMARY} initials="GA"
      facts={[
        { label: 'Entities tracked', value: '7 operating + 2 trusts' },
        { label: 'Review cycle',     value: 'Quarterly' },
        { label: 'Output',           value: 'Org chart + entity register' },
        { label: 'Audience',         value: 'Board + auditors + funders' },
      ]}
      phases={[
        { step: '1', label: 'Entity register upkeep', duration: 'Continuous', activities: ['Track every entity (Pty, CC, Trust, SPV)', 'CIPC status + reg numbers', 'Directors, shareholders, beneficiaries', 'Bank accounts + asset custody'], deliverable: 'Entity register (single source of truth)' },
        { step: '2', label: 'Org chart + relationships', duration: 'Quarterly', activities: ['Update visual org chart', 'Inter-company loan + service flows', 'Cross-shareholding map'], deliverable: 'Visual org chart + flows diagram' },
        { step: '3', label: 'Brand architecture', duration: 'Quarterly', activities: ['Brand families (Hempire, Wellies, etc.)', 'Brand-to-entity mapping', 'Brand-mark + naming rights register'], deliverable: 'Brand architecture map' },
        { step: '4', label: 'Restructuring projects', duration: 'Ad-hoc', activities: ['New entity / SPV setup', 'Mergers, conversions, restructures', 'Share-issue or buy-back', 'Tax restructuring with advisors'], deliverable: 'Restructure proposal + CIPC filings' },
      ]}
      raciHeaders={['Register', 'Org chart', 'Brand', 'Restructure']}
      raciRows={[
        { role: 'Group Counsel',       cells: ['A R', 'A',   'C',   'A R'] },
        { role: 'CFO / Tax advisor',   cells: ['R',   'C',   'I',   'R']   },
        { role: 'Brand lead (KM)',     cells: ['I',   'C',   'A R', 'I']   },
        { role: 'CEO',                 cells: ['A',   'A',   'A',   'A']   },
      ]}
      tooling="Notion (entity register), Lucidchart / Whimsical (org chart), CIPC eServices, DocuSign (resolutions)."
      definitionOfDone="Entity register current. Org chart updated within 5 business days of any change. Brand architecture matches the current portfolio."
      pricingNotes="Internal group function — funded from holdco operating budget. Not productised for external sale."
    />
  );
}

/* ────── 2. GROUP STRATEGY ────── */
export function GroupStrategyPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Group Strategy')}
      name="Group Strategy" tagline="3-year group strategy, annual operating plan, capital allocation, quarterly review."
      badge="Group function" colour="#2D7A3E" initials="GS"
      facts={[
        { label: 'Strategy horizon',  value: '3-year rolling' },
        { label: 'Operating plan',    value: 'Annual' },
        { label: 'Review cycle',      value: 'Quarterly' },
        { label: 'Capital allocation',value: 'Annual + ad-hoc' },
      ]}
      phases={[
        { step: '1', label: '3-year group strategy refresh', duration: 'Annual (Q4)', activities: ['Market + sector outlook per division', 'Group ambition + measurable goals', 'Strategic bets + investment priorities', 'Risk frame'], deliverable: 'Updated 3-year strategy doc', gate: 'Board approves' },
        { step: '2', label: 'Annual operating plan', duration: 'Q4 → Q1', activities: ['Per-division operating plan', 'Budgets + cash flow forecast', 'Headcount plan', 'Capex requests'], deliverable: 'Group operating plan + budget', gate: 'Board approves budget' },
        { step: '3', label: 'Capital allocation', duration: 'Annual + ad-hoc', activities: ['Capex prioritisation across divisions', 'Inter-company funding decisions', 'External capital raise calls', 'Dividend / reinvestment decision'], deliverable: 'Capital allocation memo' },
        { step: '4', label: 'Quarterly review', duration: 'Quarterly', activities: ['Per-division performance vs plan', 'Strategic-bet progress', 'Risk register update', 'Re-plan if material variance'], deliverable: 'Quarterly group review pack' },
      ]}
      raciHeaders={['3-year', 'Op plan', 'Capital', 'Quarterly']}
      raciRows={[
        { role: 'CEO',                 cells: ['A R', 'A',   'A',   'A R'] },
        { role: 'CFO',                 cells: ['R',   'A R', 'A R', 'R']   },
        { role: 'Division MDs',        cells: ['C',   'R',   'C',   'R']   },
        { role: 'Board',               cells: ['A',   'A',   'A',   'C']   },
      ]}
      tooling="Notion (strategy doc + plan), Excel / Power BI (budget + forecast), board portal (Diligent / Convene)."
      definitionOfDone="Strategy doc + operating plan approved by board. Quarterly reviews delivered within 4 weeks of quarter-end."
      pricingNotes="Internal group function."
    />
  );
}

/* ────── 3. GROUP COMPLIANCE & LEGAL ────── */
export function GroupCompliancePage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Group Compliance & Legal')}
      name="Group Compliance & Legal" tagline="Statutory + regulatory + contractual compliance across every entity in the group."
      badge="Group function" colour="#4F7942" initials="GC"
      facts={[
        { label: 'Coverage',         value: 'All 9 entities' },
        { label: 'Frameworks',       value: 'Companies Act · POPIA · BBBEE · SARS' },
        { label: 'Contracts',        value: 'Group repository' },
        { label: 'Risk',             value: 'Penalties + dereg + litigation' },
      ]}
      phases={[
        { step: '1', label: 'Statutory register (all entities)', duration: 'Continuous', activities: ['Per-entity directors, shareholders, beneficial owners', 'CIPC annual return tracker', 'Trust deed + trustees register', 'BO filings + amendments'], deliverable: 'Live statutory register' },
        { step: '2', label: 'Contract repository', duration: 'Continuous', activities: ['Per-entity contract intake', 'Auto-renewal + expiry tracker', 'Counterparty + value index', 'Versioning + signed-original storage'], deliverable: 'Contract repository' },
        { step: '3', label: 'Regulatory tracker', duration: 'Continuous', activities: ['Per-sector regulator engagement (e.g. SAHPRA for Hempire)', 'Licence + permit renewal calendar', 'Regulatory change-log + impact', 'Sector-body memberships'], deliverable: 'Regulatory tracker' },
        { step: '4', label: 'Group BBBEE scorecard', duration: 'Annual', activities: ['Consolidated scorecard build', 'Sub-element evidence collation', 'Verification audit prep', 'Sub-entity scorecards roll-up'], deliverable: 'Verified group scorecard', gate: 'BBBEE verification' },
      ]}
      raciHeaders={['Statutory', 'Contracts', 'Regulatory', 'BBBEE']}
      raciRows={[
        { role: 'Group Counsel',       cells: ['A R', 'A R', 'A R', 'C']   },
        { role: 'Company Secretary',   cells: ['R',   'C',   'I',   'I']   },
        { role: 'BBBEE Specialist',    cells: ['I',   'I',   'C',   'A R'] },
        { role: 'Division MDs',        cells: ['I',   'R',   'R',   'C']   },
      ]}
      tooling="Notion (repositories), DocuSign (signatures), CIPC + SARS portals, Affinity Accounting integration for filings, BBBEE verification agency portal."
      definitionOfDone="Zero missed statutory deadlines. All contracts captured within 5 days of signature. Annual BBBEE scorecard verified."
      pricingNotes="Internal group function."
    />
  );
}

/* ────── 4. GROUP HR ────── */
export function GroupHrPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Group HR')}
      name="Group HR" tagline="Group-wide HR policies, comp + benefits benchmarking, talent + succession planning, cross-entity mobility."
      badge="Group function" colour="#6B8E23" initials="GH"
      facts={[
        { label: 'Coverage',         value: 'All operating entities' },
        { label: 'Policy library',   value: 'BCEA + POPIA + LRA' },
        { label: 'Talent process',   value: '9-box + succession map' },
        { label: 'Mobility',         value: 'Inter-entity policy' },
      ]}
      phases={[
        { step: '1', label: 'Group HR policy library', duration: 'Continuous', activities: ['Group-wide policies (POPIA, harassment, leave)', 'Per-entity variations + deltas', 'Annual review + refresh', 'Employee acknowledgement tracking'], deliverable: 'Live policy library' },
        { step: '2', label: 'Comp + benefits benchmarking', duration: 'Annual', activities: ['Salary survey participation', 'Internal grade structure', 'Benefit harmonisation across entities', 'Compa-ratio tracking'], deliverable: 'Annual comp + benefits report' },
        { step: '3', label: 'Talent + succession planning', duration: 'Annual + quarterly', activities: ['Per-entity talent reviews (9-box)', 'Critical roles + successor identification', 'Development plans for top + high-potential', 'Group-level talent council'], deliverable: 'Group talent map + succession plan' },
        { step: '4', label: 'Cross-entity mobility', duration: 'Ad-hoc', activities: ['Inter-entity transfer policy', 'Service-continuity treatment', 'Tax + payroll handover', 'Re-onboarding'], deliverable: 'Transfer completed + service continuous' },
      ]}
      raciHeaders={['Policies', 'Comp', 'Talent', 'Mobility']}
      raciRows={[
        { role: 'Group HR Director',   cells: ['A R', 'A R', 'A R', 'A R'] },
        { role: 'HR & Payroll (UpSkill)', cells: ['R',   'C',   'I',   'R']   },
        { role: 'Division MDs',        cells: ['C',   'R',   'A R', 'R']   },
        { role: 'CEO',                 cells: ['A',   'A',   'A',   'C']   },
      ]}
      tooling="Notion (policy library), 21st Century Salary Survey, BambooHR / Sage People (HRIS), DocuSign (acknowledgements)."
      definitionOfDone="Policies current and acknowledged by all employees. Annual comp benchmarking + talent review delivered to CEO."
      pricingNotes="Internal group function."
    />
  );
}
