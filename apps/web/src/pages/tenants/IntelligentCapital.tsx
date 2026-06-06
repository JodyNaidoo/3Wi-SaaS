/**
 * Intelligent Capital — financial advisory & capital raising.
 *
 * Hub + 5 productised services:
 *   1. Grant Application Strategy
 *   2. Blended Finance Structuring
 *   3. Investor Introductions
 *   4. Financial Modelling
 *   5. Due Diligence Support
 */

import { ServiceHubShell, ServiceTile, ServiceDetail, type Crumb } from '../../components/service-hub/ServiceHubKit';

const IC_PRIMARY = '#015807';   // ECRDA green
const BASE_CRUMBS: Crumb[] = [
  { label: '3Wi', href: '/cc/director' },
  { label: 'IBS', href: '/tenants/ibs' },
  { label: 'Rainmaker', href: '/tenants/ibs/rainmaker' },
  { label: '3Wi Shared Services', href: '/tenants/ibs/rainmaker/3wi-shared-services' },
];
const HUB_BASE = '/tenants/ibs/rainmaker/3wi-shared-services/intelligent-capital';

function detailCrumbs(name: string): Crumb[] {
  return [...BASE_CRUMBS, { label: 'Intelligent Capital', href: HUB_BASE }, { label: name }];
}

/* ────── HUB ────── */
export function IntelligentCapitalHub() {
  return (
    <ServiceHubShell
      crumbs={[...BASE_CRUMBS, { label: 'Intelligent Capital' }]}
      eyebrow="Shared service · Capital & Finance"
      eyebrowColour={IC_PRIMARY}
      title="Intelligent Capital"
      intro={<>
        Financial advisory and capital raising. Five productised services covering the full deal lifecycle —
        from grant application through blended-finance structuring, investor introductions, financial modelling
        and due diligence support.
      </>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <ServiceTile to={`${HUB_BASE}/grant-application`} initials="GA" colour="#015807"
          name="Grant Application Strategy" meta="Per submission"
          tagline="Eligibility, strategy and full submission for grant funding (ECRDA, ECDC, DSBD, DBSA)."
          bullets={['Eligibility screen', 'Application + supporting pack', 'Sponsor liaison', 'Resubmission support']} />
        <ServiceTile to={`${HUB_BASE}/blended-finance`} initials="BF" colour="#047857"
          name="Blended Finance Structuring" meta="Per deal · success fee"
          tagline="Layer grant + concessional + commercial capital into a single bankable structure."
          bullets={['Capital stack design', 'Term sheet drafting', 'Funder negotiations', 'Closing coordination']} />
        <ServiceTile to={`${HUB_BASE}/investor-introductions`} initials="II" colour="#059669"
          name="Investor Introductions" meta="Per intro · % of close"
          tagline="Warm intros from our funder network — IDC, DBSA, banks, private equity, family offices."
          bullets={['Investor mapping', 'Pitch deck refinement', 'Warm introductions', 'Follow-up support']} />
        <ServiceTile to={`${HUB_BASE}/financial-modelling`} initials="FM" colour="#10B981"
          name="Financial Modelling" meta="Fixed-price project"
          tagline="Investor-grade financial models. Excel + scenario analysis + sensitivity testing."
          bullets={['3-statement model', 'Scenario sensitivity', 'Valuation work', 'Investor-ready output']} />
        <ServiceTile to={`${HUB_BASE}/due-diligence`} initials="DD" colour="#34D399"
          name="Due Diligence Support" meta="Hourly + cap"
          tagline="Data-room build, Q&A coordination, response drafting for incoming investor / funder DD."
          bullets={['Data-room build', 'Q&A coordination', 'Response drafting', 'Closing-binder assembly']} />
      </div>
    </ServiceHubShell>
  );
}

/* ────── 1. GRANT APPLICATION ────── */
export function GrantApplicationPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Grant Application Strategy')}
      name="Grant Application Strategy" tagline="From eligibility screen to signed funding agreement."
      badge="Service 1 of 5" colour="#015807" initials="GA"
      facts={[
        { label: 'Duration', value: '6–10 weeks' },
        { label: 'Pricing',  value: 'Per submission' },
        { label: 'Funders',  value: 'ECRDA · ECDC · DSBD · DBSA' },
        { label: 'Win rate', value: 'Track per cohort' },
      ]}
      phases={[
        { step: '1', label: 'Eligibility screen', duration: '1 week', activities: ['Funder programme review', 'BBBEE + sector + financial fit', 'Go / no-go recommendation'], deliverable: 'Eligibility report', gate: 'Client approves to proceed' },
        { step: '2', label: 'Application strategy', duration: '1 week', activities: ['Application architecture', 'Key narratives + theory of change', 'Budget approach + match-funding plan'], deliverable: 'Application strategy memo', gate: 'Strategy sign-off' },
        { step: '3', label: 'Drafting + supporting pack', duration: '3–6 weeks', activities: ['Full application drafted', 'Supporting docs (CVs, AFS, compliance certs)', 'Budget workbook', 'Logframe / outputs / KPIs'], deliverable: 'Submission-ready application pack' },
        { step: '4', label: 'Submission + follow-up', duration: '1–2 weeks', activities: ['Submit via funder portal', 'Acknowledgment tracking', 'Respond to clarification questions', 'Site-visit hosting if requested'], deliverable: 'Submission confirmation + Q&A responses' },
      ]}
      raciHeaders={['Eligibility', 'Strategy', 'Drafting', 'Submission']}
      raciRows={[
        { role: 'Capital Lead',         cells: ['A R', 'A R', 'A',   'A R'] },
        { role: 'Sector Specialist',    cells: ['C',   'R',   'R',   'C']   },
        { role: 'Financial Modeller',   cells: ['I',   'C',   'R',   'C']   },
        { role: 'Account Manager',      cells: ['R',   'R',   'R',   'R']   },
        { role: 'Client',               cells: ['A',   'A',   'C',   'A']   },
      ]}
      tooling="Funder online portals (ECRDA, IDC, DBSA), Notion (application workspace), Google Docs (drafting), Excel (budget workbook), DocuSign (signatures)."
      definitionOfDone="Application submitted, acknowledgment received, all clarification questions answered, status tracked through to funding decision."
      pricingNotes="Per-submission fixed fee (typically R 50 000 – R 250 000 depending on application complexity). Success fee optional on award."
      engagePreset={{ serviceUnit: 'intelligent-capital', serviceSlug: 'grant-application', serviceName: 'Grant Application Strategy', accent: '#015807', scopeFields: [
        { key: 'funder', label: 'Target funder', placeholder: 'e.g. ECRDA, DSBD, IDC' },
        { key: 'amount', label: 'Funding amount sought', placeholder: 'e.g. R 5m' },
        { key: 'sector', label: 'Sector', placeholder: 'e.g. hemp agriculture' },
      ]}}
    />
  );
}

/* ────── 2. BLENDED FINANCE ────── */
export function BlendedFinancePage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Blended Finance Structuring')}
      name="Blended Finance Structuring" tagline="Layer grant + concessional + commercial capital into one bankable deal."
      badge="Service 2 of 5" colour="#047857" initials="BF"
      facts={[
        { label: 'Duration', value: '3–6 months' },
        { label: 'Pricing',  value: 'Retainer + success fee' },
        { label: 'Layers',   value: 'Grant · Conc · Comm' },
        { label: 'Typical',  value: 'R 20m – R 200m deals' },
      ]}
      phases={[
        { step: '1', label: 'Capital stack design', duration: '3 weeks', activities: ['Project capex + working-capital sizing', 'Layer waterfall (which money first-loss vs senior)', 'Match each layer to a likely funder', 'Risk + return per layer'], deliverable: 'Capital stack design memo', gate: 'Client + lead funder approve' },
        { step: '2', label: 'Term sheet drafting', duration: '4 weeks', activities: ['Per-funder term sheets', 'Inter-creditor terms', 'Covenants + reporting requirements'], deliverable: 'Draft term sheets per layer', gate: 'Lead funder term sheet signed' },
        { step: '3', label: 'Funder negotiations', duration: '6–12 weeks', activities: ['Lead funder → other funders alignment', 'Term sheet to long-form conversion', 'DD coordination across funders', 'Conditions-precedent tracking'], deliverable: 'All long-form agreements signed', gate: 'Conditions precedent met' },
        { step: '4', label: 'Closing coordination', duration: '2 weeks', activities: ['CP satisfaction evidence pack', 'Closing-day choreography', 'First drawdown trigger'], deliverable: 'Funded + first drawdown received' },
      ]}
      raciHeaders={['Stack design', 'Term sheets', 'Negotiation', 'Closing']}
      raciRows={[
        { role: 'Capital Lead',         cells: ['A R', 'A R', 'A R', 'A R'] },
        { role: 'Legal counsel',        cells: ['C',   'R',   'R',   'R']   },
        { role: 'Financial Modeller',   cells: ['R',   'C',   'C',   'C']   },
        { role: 'Account Manager',      cells: ['R',   'R',   'R',   'R']   },
        { role: 'Client',               cells: ['A',   'A',   'A',   'A']   },
      ]}
      tooling="Excel / Power BI (waterfall modelling), Google Docs (term sheets), DocuSign (long-form signatures), Notion (CP tracker), virtual data room (Intralinks / iDeals)."
      definitionOfDone="All facilities drawn-down at closing, inter-creditor agreement signed, ongoing reporting cadence set up."
      pricingNotes="Monthly retainer (R 50k–R 150k) + success fee (typically 1–2% of total capital raised, capped). Legal disbursements at cost."
      engagePreset={{ serviceUnit: 'intelligent-capital', serviceSlug: 'blended-finance', serviceName: 'Blended Finance Structuring', accent: '#047857', scopeFields: [
        { key: 'dealSize',  label: 'Approximate deal size', placeholder: 'e.g. R 50m' },
        { key: 'leadFunder',label: 'Lead funder (if known)', placeholder: 'e.g. DBSA' },
        { key: 'sector',    label: 'Sector', placeholder: 'e.g. agri-processing' },
      ]}}
    />
  );
}

/* ────── 3. INVESTOR INTRODUCTIONS ────── */
export function InvestorIntroductionsPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Investor Introductions')}
      name="Investor Introductions" tagline="Warm introductions from our funder network — vetted, briefed and tracked."
      badge="Service 3 of 5" colour="#059669" initials="II"
      facts={[
        { label: 'Duration', value: '4–12 weeks' },
        { label: 'Pricing',  value: 'Retainer + % of close' },
        { label: 'Network',  value: 'IDC · DBSA · banks · PE · FOs' },
        { label: 'Conversion',value: 'Track per cohort' },
      ]}
      phases={[
        { step: '1', label: 'Investor mapping + pitch refinement', duration: '2 weeks', activities: ['Identify investor archetype that fits this deal', 'Shortlist 8–15 named investors', 'Refine pitch deck for that audience', 'Practice + Q&A prep'],
          deliverable: 'Shortlist + investor-ready pitch', gate: 'Client approves shortlist' },
        { step: '2', label: 'Warm introductions', duration: '2–4 weeks', activities: ['Email intro to each investor from our principal', 'Pitch session scheduling', 'Brief investor on the company in advance', 'Pre-meeting prep with client'],
          deliverable: 'Introduction emails sent + meetings booked' },
        { step: '3', label: 'Follow-up support', duration: '4–8 weeks', activities: ['Post-meeting feedback gathering', 'Q&A drafting + sending', 'Term-sheet discussions support', 'Decision tracking'],
          deliverable: 'Weekly investor pipeline report' },
      ]}
      raciHeaders={['Mapping', 'Intros', 'Follow-up']}
      raciRows={[
        { role: 'Capital Lead',         cells: ['A R', 'A R', 'A R'] },
        { role: 'Account Manager',      cells: ['R',   'R',   'R']   },
        { role: 'Client',               cells: ['A',   'C',   'R']   },
      ]}
      tooling="HubSpot CRM (pipeline), Notion (investor profiles), Calendly (scheduling), DocSend (pitch tracking), Loom (async pitch refresh)."
      definitionOfDone="All shortlisted investors introduced, pipeline tracked through to term sheet, client briefed on each outcome."
      pricingNotes="Monthly retainer R 25k–R 75k + success fee (1–3% of capital raised at close). Travel + entertainment at cost."
      engagePreset={{ serviceUnit: 'intelligent-capital', serviceSlug: 'investor-introductions', serviceName: 'Investor Introductions', accent: '#059669', scopeFields: [
        { key: 'raiseTarget', label: 'Raise target', placeholder: 'e.g. R 20m' },
        { key: 'stage',       label: 'Stage', options: ['Pre-seed', 'Seed', 'Series A', 'Series B+', 'Growth / project finance'] },
      ]}}
    />
  );
}

/* ────── 4. FINANCIAL MODELLING ────── */
export function FinancialModellingPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Financial Modelling')}
      name="Financial Modelling" tagline="Investor-grade 3-statement models with scenario + sensitivity analysis."
      badge="Service 4 of 5" colour="#10B981" initials="FM"
      facts={[
        { label: 'Duration', value: '3–6 weeks' },
        { label: 'Pricing',  value: 'Fixed-price project' },
        { label: 'Output',   value: '3-statement + sensitivity' },
        { label: 'Format',   value: 'Excel + PDF deck' },
      ]}
      phases={[
        { step: '1', label: 'Inputs + assumptions', duration: '1 week', activities: ['Collect historical financials + KPIs', 'Document driver assumptions with client', 'Industry benchmarking + sensitivity ranges'],
          deliverable: 'Assumptions log', gate: 'Client signs off assumptions' },
        { step: '2', label: 'Model build', duration: '2–3 weeks', activities: ['Income statement, balance sheet, cash flow (3-statement)', 'Working capital + capex schedules', 'Tax + financing waterfall', 'Scenario sensitivity (base / upside / downside)'],
          deliverable: 'Pilot model', gate: 'Client model walkthrough' },
        { step: '3', label: 'Refinement + handover', duration: '1–2 weeks', activities: ['Address review comments', 'Build output dashboard + investor summary', 'Documentation + user guide', 'Handover session'],
          deliverable: 'Final model + investor summary deck' },
      ]}
      raciHeaders={['Inputs', 'Build', 'Handover']}
      raciRows={[
        { role: 'Financial Modeller',   cells: ['A R', 'A R', 'A R'] },
        { role: 'Capital Lead',         cells: ['C',   'C',   'C']   },
        { role: 'Account Manager',      cells: ['R',   'R',   'R']   },
        { role: 'Client',               cells: ['A',   'A',   'A']   },
      ]}
      tooling="Excel (model build), Power BI / Looker (dashboard), Notion (documentation), Loom (handover walkthrough video)."
      definitionOfDone="Model error-free, fully audited, client trained on use, source files transferred."
      pricingNotes="Fixed-price project (typically R 40k – R 150k depending on complexity). Refresh retainer optional (R 5k–R 15k / month)."
      engagePreset={{ serviceUnit: 'intelligent-capital', serviceSlug: 'financial-modelling', serviceName: 'Financial Modelling', accent: '#10B981', scopeFields: [
        { key: 'purpose', label: 'Purpose', options: ['Investor pitch', 'Bank funding', 'Internal planning', 'Valuation', 'Other'] },
        { key: 'horizon', label: 'Forecast horizon', options: ['3 years', '5 years', '7 years', '10 years', '15+ years (project finance)'] },
      ]}}
    />
  );
}

/* ────── 5. DUE DILIGENCE ────── */
export function DueDiligenceSupportPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Due Diligence Support')}
      name="Due Diligence Support" tagline="Data-room build, Q&A coordination, response drafting for incoming investor / funder DD."
      badge="Service 5 of 5" colour="#34D399" initials="DD"
      facts={[
        { label: 'Duration', value: '4–8 weeks' },
        { label: 'Pricing',  value: 'Hourly + cap' },
        { label: 'Output',   value: 'Data room + Q&A log' },
        { label: 'Tools',    value: 'Intralinks · iDeals · GDrive' },
      ]}
      phases={[
        { step: '1', label: 'Data-room build', duration: '2 weeks', activities: ['DD checklist mapping (legal, financial, commercial, technical, ESG)', 'Document collection + indexing', 'Redaction where required', 'Permission structure per investor'],
          deliverable: 'Populated data room' },
        { step: '2', label: 'Q&A coordination', duration: '2–4 weeks', activities: ['Receive investor / funder questions', 'Route to subject-matter expert internally', 'Draft + review responses', 'Post to data room + log'],
          deliverable: 'Q&A log + responses' },
        { step: '3', label: 'Closing-binder assembly', duration: '2 weeks', activities: ['Final clean data-room snapshot', 'Closing-binder index', 'Originals + certified copies management'],
          deliverable: 'Closing binder' },
      ]}
      raciHeaders={['Data room', 'Q&A', 'Closing']}
      raciRows={[
        { role: 'DD Coordinator',       cells: ['A R', 'A R', 'A R'] },
        { role: 'Legal counsel',        cells: ['R',   'R',   'R']   },
        { role: 'Capital Lead',         cells: ['C',   'C',   'C']   },
        { role: 'Client SMEs',          cells: ['R',   'R',   'C']   },
      ]}
      tooling="Intralinks / iDeals / Datasite (VDR), Notion (Q&A tracker), DocuSign (closing-binder signatures), Adobe Acrobat (redaction)."
      definitionOfDone="All DD questions answered, closing binder assembled, post-closing storage organised."
      pricingNotes="Hourly billing with monthly cap. Typical engagement R 50k – R 250k total. VDR licensing at cost."
      engagePreset={{ serviceUnit: 'intelligent-capital', serviceSlug: 'due-diligence', serviceName: 'Due Diligence Support', accent: '#34D399', scopeFields: [
        { key: 'ddType',   label: 'DD type', options: ['Investor (equity)', 'Funder (debt)', 'Acquirer (M&A)', 'Other'] },
        { key: 'urgency',  label: 'Timeline', options: ['<4 weeks', '4-8 weeks', '8-12 weeks', 'Flexible'] },
      ]}}
    />
  );
}
