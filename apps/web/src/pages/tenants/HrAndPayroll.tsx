/**
 * HR & Payroll — productised hub.
 *
 * Replaces the flat HrAndPayrollPage workspace inside UpSkillTraining.tsx
 * with a hub of 5 productised services, each engageable.
 *
 *   1. Monthly Payroll Outsource
 *   2. HR Compliance Pack Setup
 *   3. Employee Onboarding Service
 *   4. BBBEE Skills-Spend Reporting
 *   5. Disciplinary & CCMA Support
 */

import { ServiceHubShell, ServiceTile, ServiceDetail, type Crumb } from '../../components/service-hub/ServiceHubKit';

const HR_PRIMARY = '#0F766E';   // deep teal
const BASE_CRUMBS: Crumb[] = [
  { label: '3Wi', href: '/cc/director' },
  { label: 'IBS', href: '/tenants/ibs' },
  { label: 'Rainmaker', href: '/tenants/ibs/rainmaker' },
  { label: '3Wi Shared Services', href: '/tenants/ibs/rainmaker/3wi-shared-services' },
  { label: 'UpSkill Training', href: '/tenants/ibs/rainmaker/3wi-shared-services/upskill-training' },
];
const HUB_BASE = '/tenants/ibs/rainmaker/3wi-shared-services/upskill-training/hr-and-payroll';

function detailCrumbs(name: string): Crumb[] {
  return [...BASE_CRUMBS, { label: 'HR and Payroll', href: HUB_BASE }, { label: name }];
}

/* ────── HUB ────── */
export function HrAndPayrollHub() {
  return (
    <ServiceHubShell
      crumbs={[...BASE_CRUMBS, { label: 'HR and Payroll' }]}
      eyebrow="UpSkill · Operations"
      eyebrowColour={HR_PRIMARY}
      title="HR and Payroll"
      intro={<>
        Back-office people operations for the IBS group and external SMME clients. Five productised services —
        each scopable, priced and engageable.
      </>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <ServiceTile to={`${HUB_BASE}/monthly-payroll`} initials="MP" colour={HR_PRIMARY}
          name="Monthly Payroll Outsource" meta="Monthly retainer"
          tagline="End-to-end payroll: payslips, EFT, EMP201, EMP501, IRP5s."
          bullets={['SARS EMP201 / EMP501', 'EFT pay file', 'Pay-slip distribution', 'Leave + variable capture']} />
        <ServiceTile to={`${HUB_BASE}/hr-compliance`} initials="HC" colour="#0D6660"
          name="HR Compliance Pack Setup" meta="Fixed-price project"
          tagline="BCEA + POPIA-aligned policies, contracts, employee handbook."
          bullets={['Employment contracts', 'Employee handbook', 'POPIA policy', 'Disciplinary code']} />
        <ServiceTile to={`${HUB_BASE}/onboarding`} initials="OB" colour="#0B5751"
          name="Employee Onboarding Service" meta="Per hire"
          tagline="Offer letter → contract → induction → first-day kit."
          bullets={['Offer + contract', 'Background checks', 'Induction', 'Equipment + access setup']} />
        <ServiceTile to={`${HUB_BASE}/bbbee-skills`} initials="BB" colour="#0E867D"
          name="BBBEE Skills-Spend Reporting" meta="Annual + quarterly tracking"
          tagline="Track + report skills levy spend for BBBEE scorecard input."
          bullets={['Skills spend tracker', 'Mandatory + discretionary grants', 'SETA reporting', 'Scorecard data pack']} />
        <ServiceTile to={`${HUB_BASE}/disciplinary`} initials="DS" colour="#14B8A6"
          name="Disciplinary & CCMA Support" meta="Per case · hourly"
          tagline="Warning → hearing → CCMA support. Procedural fairness throughout."
          bullets={['Warning drafting', 'Hearing chair', 'CCMA conciliation prep', 'Arbitration support']} />
      </div>
    </ServiceHubShell>
  );
}

/* ────── 1. MONTHLY PAYROLL ────── */
export function MonthlyPayrollPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Monthly Payroll Outsource')}
      name="Monthly Payroll Outsource" tagline="End-to-end monthly payroll, SARS filings, and employee comms."
      badge="Service 1 of 5" colour={HR_PRIMARY} initials="MP"
      facts={[
        { label: 'Cadence',       value: 'Monthly' },
        { label: 'SLA',           value: 'Pay-slips by 25th' },
        { label: 'SARS filings',  value: 'EMP201 monthly · EMP501 bi-annual' },
        { label: 'Stack',         value: 'PaySpace · SimplePay · Sage' },
      ]}
      phases={[
        { step: '1', label: 'Variables capture', duration: 'Days 1–5', activities: ['Overtime + commission', 'Leave taken + balances', 'Deductions (loans, garnishees)', 'New hires + terminations'], deliverable: 'Validated payroll inputs' },
        { step: '2', label: 'Draft payroll + client review', duration: 'Days 10–15', activities: ['Run payroll in system', 'Draft pay-slips', 'Client review of exception report'], deliverable: 'Approved draft', gate: 'Client signs draft' },
        { step: '3', label: 'Final + payment', duration: 'Days 20–25', activities: ['Final pay-slips issued', 'EFT pay file generated for client bank upload', 'Pay-slip distribution (email / portal)', 'Payment lands 28th'], deliverable: 'Pay-slips delivered + payment scheduled' },
        { step: '4', label: 'SARS + reporting', duration: 'Month-end', activities: ['EMP201 submission by 7th', 'Bi-annual EMP501 reconciliation', 'Annual IRP5 + IT3(a) issue', 'UI19 on terminations'], deliverable: 'SARS-acknowledged submissions' },
      ]}
      raciHeaders={['Variables', 'Draft', 'Final', 'SARS']}
      raciRows={[
        { role: 'Payroll Administrator',  cells: ['A R', 'A R', 'A R', 'A R'] },
        { role: 'Senior Reviewer',        cells: ['I',   'A',   'A',   'C']   },
        { role: 'Client HR contact',      cells: ['R',   'A',   'I',   'C']   },
      ]}
      tooling="PaySpace / SimplePay / Sage Payroll, SARS e@syFile, Excel (exception reports), Mailchimp / portal (payslip distribution)."
      definitionOfDone="Payslips delivered by 25th, EFT released, EMP201 submitted by 7th of next month."
      pricingNotes="Per-employee retainer (typically R 95 – R 250 / employee / month). Minimum monthly fee. Bi-annual EMP501 included."
      engagePreset={{ serviceUnit: 'hr-and-payroll', serviceSlug: 'monthly-payroll', serviceName: 'Monthly Payroll Outsource', accent: HR_PRIMARY, scopeFields: [
        { key: 'employees',  label: 'Number of employees', placeholder: 'e.g. 12' },
        { key: 'currentTool',label: 'Current payroll tool', placeholder: 'e.g. spreadsheets, PaySpace, none' },
      ]}}
    />
  );
}

/* ────── 2. HR COMPLIANCE PACK ────── */
export function HrCompliancePackPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('HR Compliance Pack Setup')}
      name="HR Compliance Pack Setup" tagline="BCEA + POPIA + LRA-aligned policies, contracts, employee handbook delivered as a one-off project."
      badge="Service 2 of 5" colour="#0D6660" initials="HC"
      facts={[
        { label: 'Duration',  value: '3–5 weeks' },
        { label: 'Pricing',   value: 'Fixed-price project' },
        { label: 'Output',    value: 'Pack + policies + contracts' },
        { label: 'Frameworks',value: 'BCEA · POPIA · LRA · EE' },
      ]}
      phases={[
        { step: '1', label: 'Discovery', duration: '1 week', activities: ['Workforce profile + roles', 'Existing contracts / policies audit', 'Risk + gap analysis'], deliverable: 'Discovery report' },
        { step: '2', label: 'Drafting', duration: '2 weeks', activities: ['Employment contracts (perm, FTC, learner)', 'Employee handbook', 'POPIA policy + consent forms', 'Disciplinary + grievance code', 'EE plan template (if 50+ employees)'], deliverable: 'Draft pack', gate: 'Client review' },
        { step: '3', label: 'Implementation', duration: '1–2 weeks', activities: ['Sign-off + signing party with employees', 'Acknowledgement register', 'Internal launch communications'], deliverable: 'Signed-off pack + acknowledgement register' },
      ]}
      raciHeaders={['Discovery', 'Drafting', 'Implementation']}
      raciRows={[
        { role: 'HR Consultant',          cells: ['A R', 'A R', 'A']   },
        { role: 'Legal reviewer',         cells: ['C',   'R',   'I']   },
        { role: 'Client',                 cells: ['A',   'A',   'A R'] },
      ]}
      tooling="Google Docs / Word (drafting), DocuSign (signatures), Notion (handbook hosting), POPIA consent template library."
      definitionOfDone="All employees signed on new contracts, handbook digitised, POPIA register populated."
      pricingNotes="Fixed-price project. Banded by headcount: <10 employees R 15k, 10-50 R 35k, 50+ R 60k+. Annual refresh add-on R 5–15k."
      engagePreset={{ serviceUnit: 'hr-and-payroll', serviceSlug: 'hr-compliance', serviceName: 'HR Compliance Pack Setup', accent: '#0D6660', scopeFields: [
        { key: 'headcount', label: 'Number of employees', placeholder: 'e.g. 25' },
        { key: 'existing',  label: 'Existing pack?', options: ['Nothing in place', 'Some contracts exist', 'Old pack needs refresh', 'Not sure'] },
      ]}}
    />
  );
}

/* ────── 3. ONBOARDING ────── */
export function EmployeeOnboardingPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Employee Onboarding Service')}
      name="Employee Onboarding Service" tagline="Offer letter to first-day kit — handled per hire so the client team can stay heads-down."
      badge="Service 3 of 5" colour="#0B5751" initials="OB"
      facts={[
        { label: 'Cadence',   value: 'Per hire' },
        { label: 'Duration',  value: '5–10 working days' },
        { label: 'Pricing',   value: 'Per hire OR bundled' },
        { label: 'Output',    value: 'Onboarded employee' },
      ]}
      phases={[
        { step: '1', label: 'Offer + contract', duration: 'Day 1–2', activities: ['Offer letter generation', 'Salary + benefits package', 'Employment contract', 'Conditional-on-checks clause'], deliverable: 'Signed offer + contract' },
        { step: '2', label: 'Background checks', duration: 'Day 3–5', activities: ['ID verification', 'Criminal record check', 'Credit check (where role requires)', 'Reference checks', 'Qualification verification'], deliverable: 'Background check pack', gate: 'No red flags' },
        { step: '3', label: 'Pre-board + first-day setup', duration: 'Day 6–10', activities: ['Bank + tax + UIF reg', 'Add to payroll system', 'Email + system access', 'Equipment allocation', 'First-day plan'], deliverable: 'Pre-board pack + setup complete' },
        { step: '4', label: 'Induction + week-1 check-in', duration: 'Week 1', activities: ['Company induction (history, values, structure)', 'Role-specific induction', 'Buddy + manager intro', 'Day 5 check-in'], deliverable: 'Onboarded + checked-in employee' },
      ]}
      raciHeaders={['Offer', 'Checks', 'Pre-board', 'Induction']}
      raciRows={[
        { role: 'HR Coordinator',         cells: ['A R', 'A R', 'A R', 'R']   },
        { role: 'Hiring Manager',         cells: ['A',   'I',   'C',   'A']   },
        { role: 'IT / Equipment',         cells: ['I',   'I',   'R',   'I']   },
        { role: 'Buddy',                  cells: ['I',   'I',   'I',   'R']   },
      ]}
      tooling="Greenhouse / Workable (ATS), MIE / Lexis (background checks), DocuSign (offer signatures), Notion (induction wiki)."
      definitionOfDone="Employee inducted, week-1 check-in done, all systems + equipment in place, payroll updated."
      pricingNotes="R 1 500 – R 3 500 per hire (includes background check pass-through). Bulk discount for 5+ hires per month."
      engagePreset={{ serviceUnit: 'hr-and-payroll', serviceSlug: 'onboarding', serviceName: 'Employee Onboarding Service', accent: '#0B5751', scopeFields: [
        { key: 'volume',  label: 'Hiring volume', options: ['Ad-hoc (<1 / month)', '1-3 / month', '3-10 / month', '10+ / month'] },
        { key: 'checks',  label: 'Background check level', options: ['Basic (ID + criminal)', 'Standard (+ credit + refs)', 'Enhanced (+ quals + media)'] },
      ]}}
    />
  );
}

/* ────── 4. BBBEE SKILLS-SPEND ────── */
export function BbbeeSkillsReportingPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('BBBEE Skills-Spend Reporting')}
      name="BBBEE Skills-Spend Reporting" tagline="Track skills-levy spend across the year. Maximise BBBEE scorecard points from training already happening."
      badge="Service 4 of 5" colour="#0E867D" initials="BB"
      facts={[
        { label: 'Cadence',        value: 'Annual + quarterly tracking' },
        { label: 'Scorecard',      value: 'Skills Dev + ED elements' },
        { label: 'Reporting',      value: 'SETA + verification agency' },
        { label: 'Target',         value: '6% of leviable payroll' },
      ]}
      phases={[
        { step: '1', label: 'Baseline + plan', duration: '2 weeks (annual)', activities: ['Last 12 months training spend mapping', 'Identify mandatory vs discretionary', 'Skills development plan for upcoming year', 'BBBEE scorecard target setting'], deliverable: 'Skills development plan' },
        { step: '2', label: 'Quarterly tracking', duration: 'Quarterly', activities: ['Capture each training event (cost + headcount + designated groups)', 'SETA submission of WSP / ATR if quarter-end', 'Spend-vs-target dashboard'], deliverable: 'Quarterly tracking dashboard' },
        { step: '3', label: 'Annual scorecard data pack', duration: '1 week', activities: ['Annual training register', 'Spend-by-element split', 'Designated groups proportion', 'Verification-ready evidence pack'], deliverable: 'Scorecard data pack', gate: 'Client signs pack' },
        { step: '4', label: 'Verification support', duration: 'During audit', activities: ['Liaise with BBBEE verification agency', 'Provide source documents on request', 'Resolve queries'], deliverable: 'Verified scorecard' },
      ]}
      raciHeaders={['Baseline', 'Tracking', 'Data pack', 'Verification']}
      raciRows={[
        { role: 'Skills Specialist',     cells: ['A R', 'A R', 'A R', 'A R'] },
        { role: 'HR + Training Mgrs',    cells: ['R',   'R',   'C',   'C']   },
        { role: 'BBBEE Verifier',        cells: ['I',   'I',   'C',   'A']   },
        { role: 'Client',                cells: ['A',   'I',   'A',   'A']   },
      ]}
      tooling="Excel skills register, SETA portal (WSP/ATR submission), Notion (evidence pack), DocuSign (signatures)."
      definitionOfDone="Annual data pack delivered before verification audit, verified BBBEE scorecard issued."
      pricingNotes="Annual retainer (R 25 000 – R 80 000) banded by headcount. Includes quarterly tracking + verification support."
      engagePreset={{ serviceUnit: 'hr-and-payroll', serviceSlug: 'bbbee-skills', serviceName: 'BBBEE Skills-Spend Reporting', accent: '#0E867D' }}
    />
  );
}

/* ────── 5. DISCIPLINARY ────── */
export function DisciplinarySupportPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Disciplinary & CCMA Support')}
      name="Disciplinary & CCMA Support" tagline="Procedurally fair disciplinary process from warning through CCMA arbitration if needed."
      badge="Service 5 of 5" colour="#14B8A6" initials="DS"
      facts={[
        { label: 'Engagement',    value: 'Per case' },
        { label: 'Pricing',       value: 'Hourly + cap' },
        { label: 'Frameworks',    value: 'LRA + Schedule 8' },
        { label: 'Risk',          value: 'Unfair-dismissal awards' },
      ]}
      phases={[
        { step: '1', label: 'Incident assessment', duration: '1–3 days', activities: ['Incident report intake', 'Severity assessment', 'Recommended track (warning, hearing, dismissal)', 'Risk briefing to client'], deliverable: 'Recommended action memo', gate: 'Client approves track' },
        { step: '2', label: 'Warning OR hearing prep', duration: '3–7 days', activities: ['Warning: drafting + delivery', 'Hearing: charge sheet + evidence pack + witness statements', 'Notice of hearing (5 working days)', 'Employee notified of rights'], deliverable: 'Warning issued OR hearing scheduled' },
        { step: '3', label: 'Hearing + outcome', duration: '1 day + 2 days', activities: ['Independent chair + initiator + interpreter (if needed)', 'Evidence presentation', 'Defence', 'Verdict + sanction', 'Outcome letter'], deliverable: 'Outcome letter issued', gate: 'Outcome delivered to employee' },
        { step: '4', label: 'CCMA referral (if employee refers)', duration: 'Per CCMA process', activities: ['Conciliation prep', 'Conciliation hearing', 'Arbitration prep + bundle', 'Arbitration hearing', 'Award + post-award action'], deliverable: 'CCMA award' },
      ]}
      raciHeaders={['Assessment', 'Prep', 'Hearing', 'CCMA']}
      raciRows={[
        { role: 'HR Consultant',         cells: ['A R', 'A R', 'A R', 'C']   },
        { role: 'Hearing Chair',         cells: ['I',   'I',   'A R', 'I']   },
        { role: 'Labour Lawyer',         cells: ['C',   'C',   'C',   'A R'] },
        { role: 'Client manager',        cells: ['A',   'R',   'R',   'C']   },
      ]}
      tooling="DocuSign (signed warnings + outcome letters), Loom (recorded testimony if remote), Notion (case file), CCMA portal (referrals)."
      definitionOfDone="Process completed with procedural fairness intact. Award or final outcome documented."
      pricingNotes="Hourly billing (R 1 500 – R 3 500 / hour depending on seniority) with case-cap quote up-front. CCMA disbursements at cost."
      engagePreset={{ serviceUnit: 'hr-and-payroll', serviceSlug: 'disciplinary', serviceName: 'Disciplinary & CCMA Support', accent: '#14B8A6', scopeFields: [
        { key: 'severity', label: 'Likely severity', options: ['Verbal / written warning', 'Final written warning', 'Dismissal hearing', 'CCMA already referred', 'Not sure'] },
        { key: 'urgency',  label: 'Urgency', options: ['Today', 'This week', 'Next week', 'Flexible'] },
      ]}}
    />
  );
}
