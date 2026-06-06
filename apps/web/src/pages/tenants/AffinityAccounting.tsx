/**
 * Affinity Accounting — bookkeeping & SARS / CIPC compliance practice.
 *
 * Hub + 5 productised services:
 *   1. Monthly Bookkeeping + Management Accounts
 *   2. VAT Returns + Provisional Tax
 *   3. Annual Tax + AFS
 *   4. CIPC Company Secretarial
 *   5. Audit Preparation Support
 *
 * Note: Payroll is handled by UpSkill Training > HR & Payroll, not here.
 */

import { ServiceHubShell, ServiceTile, ServiceDetail, type Crumb } from '../../components/service-hub/ServiceHubKit';

const AA_PRIMARY = '#3F1101';   // 3Wi brown
const BASE_CRUMBS: Crumb[] = [
  { label: '3Wi', href: '/cc/director' },
  { label: 'IBS', href: '/tenants/ibs' },
  { label: 'Rainmaker', href: '/tenants/ibs/rainmaker' },
  { label: '3Wi Shared Services', href: '/tenants/ibs/rainmaker/3wi-shared-services' },
];
const HUB_BASE = '/tenants/ibs/rainmaker/3wi-shared-services/affinity-accounting';

function detailCrumbs(name: string): Crumb[] {
  return [...BASE_CRUMBS, { label: 'Affinity Accounting', href: HUB_BASE }, { label: name }];
}

/* ────── HUB ────── */
export function AffinityAccountingHub() {
  return (
    <ServiceHubShell
      crumbs={[...BASE_CRUMBS, { label: 'Affinity Accounting' }]}
      eyebrow="Shared service · Accounting & Compliance"
      eyebrowColour={AA_PRIMARY}
      title="Affinity Accounting"
      intro={<>
        Bookkeeping, tax and SARS / CIPC compliance practice. Convert messy informal businesses
        into formal, fundable, audit-ready entities. Five productised services span the recurring
        compliance year. <em>Payroll lives under UpSkill Training &gt; HR &amp; Payroll.</em>
      </>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <ServiceTile to={`${HUB_BASE}/monthly-bookkeeping`} initials="MB" colour={AA_PRIMARY}
          name="Monthly Bookkeeping" meta="Monthly retainer"
          tagline="Cloud accounting setup, daily bookkeeping, monthly close, management accounts."
          bullets={['Xero / QB / Sage setup', 'Monthly close + mgmt accounts', 'Director review meeting', 'Cloud-first workflow']} />
        <ServiceTile to={`${HUB_BASE}/vat-prov-tax`} initials="VT" colour="#5C1801"
          name="VAT + Provisional Tax" meta="Bi-monthly + bi-annual"
          tagline="VAT201 returns every 2 months, provisional tax twice a year."
          bullets={['VAT201 every 2 months', 'IRP6 provisional Aug + Feb', 'Diesel rebate (where eligible)', 'SARS account management']} />
        <ServiceTile to={`${HUB_BASE}/annual-tax-afs`} initials="AT" colour="#7B2E13"
          name="Annual Tax + AFS" meta="Annual cycle"
          tagline="IT14 corporate return + Annual Financial Statements compilation."
          bullets={['IT14 / IT12 return', 'IFRS / IFRS-SME AFS', 'Tax computation + workings', 'Director assurance pack']} />
        <ServiceTile to={`${HUB_BASE}/cipc-secretarial`} initials="CS" colour="#9C5310"
          name="CIPC Company Secretarial" meta="Annual + ad-hoc"
          tagline="Annual returns, director changes, beneficial-ownership filings."
          bullets={['Annual return + BO filing', 'Director / shareholder changes', 'Special resolutions', 'Statutory register upkeep']} />
        <ServiceTile to={`${HUB_BASE}/audit-prep`} initials="AP" colour="#B45309"
          name="Audit Preparation Support" meta="Annual project"
          tagline="Audit-readiness work for SMMEs heading into a statutory or BBBEE audit."
          bullets={['Audit-ready trial balance', 'Lead schedules + working papers', 'Auditor Q&A coordination', 'Adjustment journals on close']} />
      </div>
    </ServiceHubShell>
  );
}

/* ────── 1. MONTHLY BOOKKEEPING ────── */
export function MonthlyBookkeepingPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Monthly Bookkeeping')}
      name="Monthly Bookkeeping + Management Accounts" tagline="Cloud-first bookkeeping practice. Clean books, on-time close, director-ready management accounts."
      badge="Service 1 of 5" colour={AA_PRIMARY} initials="MB"
      facts={[
        { label: 'Cadence', value: 'Monthly retainer' },
        { label: 'Stack',   value: 'Xero · QuickBooks · Sage' },
        { label: 'Close target', value: 'By 10th of next month' },
        { label: 'Output', value: 'Mgmt accounts + dashboard' },
      ]}
      phases={[
        { step: '1', label: 'Onboarding (one-off)', duration: '2–4 weeks', activities: ['Cloud accounting system selection + setup', 'Chart of accounts design', 'Opening balance reconstruction', 'Bank-feed + integration setup'], deliverable: 'Live accounting system + clean opening TB', gate: 'TB sign-off' },
        { step: '2', label: 'Daily / weekly bookkeeping', duration: 'Continuous', activities: ['Bank-feed reconciliation', 'Invoice + bill capture', 'Cash handling + petty cash', 'Inter-company transactions'], deliverable: 'Up-to-date ledgers' },
        { step: '3', label: 'Monthly close', duration: 'Days 1–8 of next month', activities: ['Accruals + prepayments', 'Depreciation', 'Inter-company elims', 'Trial balance review by senior'], deliverable: 'Closed trial balance', gate: 'Senior reviewer sign-off' },
        { step: '4', label: 'Management accounts + review', duration: 'Days 8–12', activities: ['P&L, balance sheet, cash flow', 'Variance commentary (vs budget + prior month)', 'Key ratio dashboard', 'Director review meeting'], deliverable: 'Mgmt accounts pack + meeting notes' },
      ]}
      raciHeaders={['Onboarding', 'Bookkeeping', 'Close', 'Review']}
      raciRows={[
        { role: 'Senior Bookkeeper',  cells: ['A R', 'A R', 'A R', 'C']   },
        { role: 'Bookkeeper',         cells: ['R',   'R',   'R',   'I']   },
        { role: 'Partner / Reviewer', cells: ['A',   'C',   'A',   'A R'] },
        { role: 'Client',             cells: ['A',   'C',   'I',   'A']   },
      ]}
      tooling="Xero / QuickBooks Online / Sage Cloud, Dext / Hubdoc (receipts), Stripe / Yoco / SnapScan integrations, Spotlight Reporting (mgmt accounts dashboard)."
      definitionOfDone="Books closed by 10th, management accounts delivered by 12th, director-review meeting held by 15th."
      pricingNotes="Monthly retainer banded by transaction volume + complexity. Typical R 4 000 – R 25 000 / month. Onboarding fee separate (R 10 000 – R 30 000)."
      engagePreset={{ serviceUnit: 'affinity-accounting', serviceSlug: 'monthly-bookkeeping', serviceName: 'Monthly Bookkeeping', accent: AA_PRIMARY, scopeFields: [
        { key: 'system',     label: 'Preferred system', options: ['Xero', 'QuickBooks Online', 'Sage Cloud', 'No preference'] },
        { key: 'volume',     label: 'Transaction volume', options: ['<100 / month', '100-500 / month', '500-2000 / month', '2000+ / month'] },
        { key: 'state',      label: 'Current state', options: ['Greenfield startup', 'Established but messy', 'Existing books need migration', 'Other'] },
      ]}}
    />
  );
}

/* ────── 2. VAT + PROVISIONAL ────── */
export function VatProvTaxPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('VAT + Provisional Tax')}
      name="VAT Returns + Provisional Tax" tagline="VAT201 every 2 months, IRP6 provisional twice a year, SARS account in good standing."
      badge="Service 2 of 5" colour="#5C1801" initials="VT"
      facts={[
        { label: 'VAT cycle', value: 'Bi-monthly' },
        { label: 'Prov tax',  value: 'Aug + Feb' },
        { label: 'Pricing',   value: 'Bundled in retainer' },
        { label: 'SARS portal', value: 'eFiling' },
      ]}
      phases={[
        { step: '1', label: 'Pre-cycle prep', duration: '2 days before deadline', activities: ['VAT report reconciliation', 'Invoice classification check (zero-rated / exempt / standard)', 'Outstanding supplier statements'], deliverable: 'Reconciled VAT control account' },
        { step: '2', label: 'VAT201 submission', duration: 'Submission day', activities: ['Final VAT201 prepared', 'Client sign-off on numbers', 'Submit via SARS eFiling', 'Payment instruction issued'], deliverable: 'VAT201 acknowledgment + payment', gate: 'Client signs final return' },
        { step: '3', label: 'Provisional tax (Aug + Feb)', duration: '2 weeks', activities: ['Earnings estimate using YTD actuals + forecast', 'IRP6 calculation', 'Top-up payment recommendation', 'Submission'], deliverable: 'IRP6 + payment confirmation' },
        { step: '4', label: 'SARS account management', duration: 'Ongoing', activities: ['Statement of account reviews', 'Penalty / interest disputes', 'Tax compliance status maintenance', 'Refund follow-ups'], deliverable: 'Clean SARS standing' },
      ]}
      raciHeaders={['Pre-cycle', 'Submit', 'Prov tax', 'SARS mgmt']}
      raciRows={[
        { role: 'Tax Practitioner',  cells: ['A R', 'A R', 'A R', 'A R'] },
        { role: 'Senior Bookkeeper', cells: ['R',   'C',   'R',   'C']   },
        { role: 'Client',            cells: ['I',   'A',   'A',   'C']   },
      ]}
      tooling="SARS eFiling, Taxshield / Quick Books tax module, Excel (prov tax workbook), Notion (submission log)."
      definitionOfDone="VAT201 submitted on or before 25th of month-after-cycle. IRP6s submitted on deadline. SARS account clean."
      pricingNotes="Included in monthly bookkeeping retainer. Stand-alone (only-tax) clients: R 3 500 / VAT cycle + R 5 000 / IRP6."
      engagePreset={{ serviceUnit: 'affinity-accounting', serviceSlug: 'vat-prov-tax', serviceName: 'VAT + Provisional Tax', accent: '#5C1801' }}
    />
  );
}

/* ────── 3. ANNUAL TAX + AFS ────── */
export function AnnualTaxAfsPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Annual Tax + AFS')}
      name="Annual Tax + AFS" tagline="IT14 corporate return + Annual Financial Statements compilation. Director assurance pack on close."
      badge="Service 3 of 5" colour="#7B2E13" initials="AT"
      facts={[
        { label: 'Cadence',  value: 'Annual' },
        { label: 'Standard', value: 'IFRS / IFRS-SME' },
        { label: 'Deadline', value: '12 months post year-end' },
        { label: 'Output',   value: 'AFS + IT14 + IT12' },
      ]}
      phases={[
        { step: '1', label: 'Year-end pack', duration: '2 weeks', activities: ['Year-end TB sign-off', 'Stock-take + fixed asset verification', 'Inter-company elim worksheets', 'Director review meeting on draft TB'], deliverable: 'Audit-ready year-end TB', gate: 'Director signs TB' },
        { step: '2', label: 'AFS drafting', duration: '3–4 weeks', activities: ['Primary statements (SOFP, SOCI, SOCE, SOCF)', 'Accounting policies + notes', 'Related party + going concern notes', 'Director report + responsibility statement'], deliverable: 'Draft AFS', gate: 'Partner reviewer sign-off' },
        { step: '3', label: 'Tax computation + return', duration: '1–2 weeks', activities: ['Taxable income computation', 'Capital allowances + recoupments', 'IT14 (corporate) or IT12 (individuals)', 'Submission via eFiling'], deliverable: 'IT14 / IT12 submitted + acknowledged' },
        { step: '4', label: 'Director assurance + handover', duration: '1 week', activities: ['Final AFS signed by directors', 'Tax invoice + payment instruction', 'Working papers archived', 'Auditor handover (if applicable)'], deliverable: 'Signed AFS + tax acknowledgment' },
      ]}
      raciHeaders={['Year-end', 'AFS', 'Tax', 'Handover']}
      raciRows={[
        { role: 'Partner / Reviewer',  cells: ['A',   'A R', 'A',   'A']   },
        { role: 'Tax Practitioner',    cells: ['C',   'C',   'A R', 'C']   },
        { role: 'Senior Bookkeeper',   cells: ['R',   'R',   'C',   'R']   },
        { role: 'Client / Directors',  cells: ['A',   'C',   'A',   'A']   },
      ]}
      tooling="CaseWare Cloud (AFS production), Xero / QB (source), SARS eFiling, DocuSign (director signatures)."
      definitionOfDone="AFS signed, IT14 / IT12 submitted, tax paid, working papers archived to client folder."
      pricingNotes="Fixed-fee project banded by entity complexity. Typical R 12 000 – R 60 000. AFS + tax usually invoiced separately."
      engagePreset={{ serviceUnit: 'affinity-accounting', serviceSlug: 'annual-tax-afs', serviceName: 'Annual Tax + AFS', accent: '#7B2E13', scopeFields: [
        { key: 'entityType', label: 'Entity type', options: ['Pty Ltd', 'CC', 'Trust', 'Partnership', 'Sole prop'] },
        { key: 'yearEnd',    label: 'Year-end month', placeholder: 'e.g. February' },
      ]}}
    />
  );
}

/* ────── 4. CIPC ────── */
export function CipcSecretarialPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('CIPC Company Secretarial')}
      name="CIPC Company Secretarial" tagline="Annual returns, beneficial-ownership filings, director changes, statutory registers."
      badge="Service 4 of 5" colour="#9C5310" initials="CS"
      facts={[
        { label: 'Cadence',   value: 'Annual + ad-hoc' },
        { label: 'Registrar', value: 'CIPC' },
        { label: 'Key filings', value: 'CoR 30.1 · BO · CoR 39' },
        { label: 'Risk',      value: 'Dereg if missed' },
      ]}
      phases={[
        { step: '1', label: 'Annual return + BO filing', duration: '1 week (annually)', activities: ['Confirm prior year turnover + employee count (sets fee)', 'Beneficial ownership confirmation', 'CoR 30.1 + BO filing via CIPC portal', 'Filing certificate to client'], deliverable: 'AR + BO acknowledgments' },
        { step: '2', label: 'Director / shareholder changes', duration: 'Ad-hoc', activities: ['CoR 39 (director change) prep', 'CoR 121 (incorporation amendment) where applicable', 'Statutory register update', 'Filing + acknowledgment'], deliverable: 'Updated statutory register + CIPC filing' },
        { step: '3', label: 'Special resolutions', duration: 'Ad-hoc', activities: ['Resolution drafting (MoI changes, conversions)', 'Notice + minutes', 'CIPC filing (CoR 14.1 etc.)', 'Updated MoI'], deliverable: 'Lodged resolution + updated MoI' },
        { step: '4', label: 'Statutory register upkeep', duration: 'Continuous', activities: ['Directors register', 'Members / shareholders register', 'Minutes book', 'BO record'], deliverable: 'Audit-ready statutory pack' },
      ]}
      raciHeaders={['Annual', 'Dir change', 'Resolutions', 'Registers']}
      raciRows={[
        { role: 'Company Secretary', cells: ['A R', 'A R', 'A R', 'A R'] },
        { role: 'Partner / Reviewer',cells: ['A',   'A',   'A',   'C']   },
        { role: 'Client',            cells: ['C',   'A',   'A',   'I']   },
      ]}
      tooling="CIPC eServices portal, BizPortal, DocuSign (director signatures), Notion (statutory registers)."
      definitionOfDone="Annual return filed before anniversary, BO updated within 10 business days of change, statutory register current."
      pricingNotes="Annual return R 1 500 – R 4 000 per entity (depending on turnover band). Ad-hoc filings R 1 500 – R 5 000 each."
      engagePreset={{ serviceUnit: 'affinity-accounting', serviceSlug: 'cipc-secretarial', serviceName: 'CIPC Company Secretarial', accent: '#9C5310' }}
    />
  );
}

/* ────── 5. AUDIT PREP ────── */
export function AuditPrepPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Audit Preparation Support')}
      name="Audit Preparation Support" tagline="Get an SMME audit-ready: clean TB, lead schedules, working papers, auditor Q&A coordination."
      badge="Service 5 of 5" colour="#B45309" initials="AP"
      facts={[
        { label: 'Trigger',  value: 'Statutory / BBBEE / lender audit' },
        { label: 'Duration', value: '6–10 weeks' },
        { label: 'Output',   value: 'Audit-ready file' },
        { label: 'Pricing',  value: 'Fixed-fee project' },
      ]}
      phases={[
        { step: '1', label: 'Readiness assessment', duration: '1 week', activities: ['TB review + reconciliations', 'Audit-trail gap analysis', 'Risk areas + management estimates', 'Pre-audit memo to auditor'],
          deliverable: 'Readiness report', gate: 'Client approves work plan' },
        { step: '2', label: 'Lead schedules + working papers', duration: '3–4 weeks', activities: ['Account-by-account lead schedules', 'Supporting workings (revenue cut-off, debtor age, fixed asset register, etc.)', 'Reconciliation pack per balance', 'Cross-references to source docs'],
          deliverable: 'Audit-ready working paper file' },
        { step: '3', label: 'Auditor Q&A + adjustments', duration: '2–4 weeks', activities: ['Manage auditor queries', 'Draft response per query', 'Negotiate adjusting journals where required', 'Final audit adjustments posted'],
          deliverable: 'Audit complete + final adjustments' },
        { step: '4', label: 'Post-audit close', duration: '1 week', activities: ['Final adjusted TB', 'Updated AFS for sign-off', 'Lessons learned for next audit', 'File archive'],
          deliverable: 'Signed audited AFS' },
      ]}
      raciHeaders={['Readiness', 'Working papers', 'Auditor Q&A', 'Close']}
      raciRows={[
        { role: 'Partner / Reviewer',  cells: ['A',   'A',   'A R', 'A']   },
        { role: 'Senior Bookkeeper',   cells: ['A R', 'A R', 'R',   'R']   },
        { role: 'External Auditor',    cells: ['I',   'I',   'R',   'A']   },
        { role: 'Client',              cells: ['A',   'C',   'C',   'A']   },
      ]}
      tooling="CaseWare Cloud (working papers), Xero / QB (source), Notion (Q&A tracker), DocuSign (final signatures)."
      definitionOfDone="Unqualified audit opinion (or known-issue qualified opinion with mitigation plan)."
      pricingNotes="Fixed-fee project banded by audit complexity. Typical R 30 000 – R 200 000. Excludes auditor's own fee."
      engagePreset={{ serviceUnit: 'affinity-accounting', serviceSlug: 'audit-prep', serviceName: 'Audit Preparation Support', accent: '#B45309', scopeFields: [
        { key: 'auditType', label: 'Audit type', options: ['Statutory', 'BBBEE verification', 'Lender / covenant', 'Grant funder', 'Other'] },
        { key: 'turnover',  label: 'Annual turnover band', options: ['<R 2m', 'R 2m–R 10m', 'R 10m–R 50m', 'R 50m–R 200m', 'R 200m+'] },
      ]}}
    />
  );
}
