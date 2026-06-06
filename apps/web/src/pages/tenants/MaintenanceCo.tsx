/**
 * Maintenance Co — facilities, equipment, vehicle, on-site maintenance.
 *
 * Hub + 4 productised services:
 *   1. Reactive Maintenance Call-outs
 *   2. Preventive Maintenance Contracts
 *   3. Vehicle & Fleet Servicing
 *   4. Equipment Installation & Commissioning
 */

import { ServiceHubShell, ServiceTile, ServiceDetail, type Crumb } from '../../components/service-hub/ServiceHubKit';

const MC_PRIMARY = '#475569';   // slate
const BASE_CRUMBS: Crumb[] = [
  { label: '3Wi', href: '/cc/director' },
  { label: 'IBS', href: '/tenants/ibs' },
  { label: 'Rainmaker', href: '/tenants/ibs/rainmaker' },
  { label: '3Wi Shared Services', href: '/tenants/ibs/rainmaker/3wi-shared-services' },
];
const HUB_BASE = '/tenants/ibs/rainmaker/3wi-shared-services/maintenance-co';

function detailCrumbs(name: string): Crumb[] {
  return [...BASE_CRUMBS, { label: 'Maintenance Co', href: HUB_BASE }, { label: name }];
}

/* ────── HUB ────── */
export function MaintenanceCoHub() {
  return (
    <ServiceHubShell
      crumbs={[...BASE_CRUMBS, { label: 'Maintenance Co' }]}
      eyebrow="Shared service · Facilities & Assets"
      eyebrowColour={MC_PRIMARY}
      title="Maintenance Co"
      intro={<>
        SLA-backed maintenance for facilities, equipment and fleet. Replace the "find a guy" pattern with a
        reliable service across the IBS group sites and external clients. Four productised services covering
        reactive call-outs, preventive contracts, fleet servicing, and equipment installation.
      </>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <ServiceTile to={`${HUB_BASE}/reactive-callouts`} initials="RC" colour={MC_PRIMARY}
          name="Reactive Call-outs" meta="On-demand · SLA-bound"
          tagline="Break-fix dispatch. Customer logs a ticket, technician on-site within SLA."
          bullets={['Multi-trade artisan bench', 'Same-day for P1', 'Parts mark-up at cost', 'Job report + photos']} />
        <ServiceTile to={`${HUB_BASE}/preventive-contracts`} initials="PM" colour="#334155"
          name="Preventive Contracts" meta="Annual SLA · per-asset"
          tagline="Scheduled servicing of HVAC, generators, fire systems, electrical panels."
          bullets={['Asset register + schedule', 'Quarterly visits (typical)', 'Compliance certificates', 'Annual SLA review']} />
        <ServiceTile to={`${HUB_BASE}/fleet-servicing`} initials="FS" colour="#1E293B"
          name="Vehicle & Fleet Servicing" meta="Per vehicle · per service"
          tagline="Scheduled service of light commercial + passenger fleets. Includes pre-trip checks."
          bullets={['OEM-spec servicing', 'Tyre management', 'Roadworthy renewals', 'Pre-trip inspections']} />
        <ServiceTile to={`${HUB_BASE}/equipment-install`} initials="EI" colour="#64748B"
          name="Equipment Install & Commissioning" meta="Per project"
          tagline="Install + commission new equipment — production lines, irrigation, processing."
          bullets={['Site survey + spec', 'Install + commission', 'Operator training', 'Warranty hand-over']} />
      </div>
    </ServiceHubShell>
  );
}

/* ────── 1. REACTIVE CALL-OUTS ────── */
export function ReactiveCallOutsPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Reactive Call-outs')}
      name="Reactive Maintenance Call-outs" tagline="Break-fix dispatch with SLA-bound response times across multiple trades."
      badge="Service 1 of 4" colour={MC_PRIMARY} initials="RC"
      facts={[
        { label: 'P1 response',  value: 'Same day' },
        { label: 'P2 response',  value: '48 hours' },
        { label: 'Trades',       value: 'Elec · Plumb · HVAC · Veh · Eqpt' },
        { label: 'Pricing',      value: 'Call-out + hourly + parts' },
      ]}
      phases={[
        { step: '1', label: 'Ticket intake', duration: 'Within 1 hour', activities: ['Customer logs ticket (portal, WhatsApp, phone)', 'Triage priority (P1 / P2 / P3)', 'Confirm site + access details', 'ETA committed back to customer'],
          deliverable: 'Confirmed ticket + technician allocation' },
        { step: '2', label: 'Dispatch + arrival', duration: 'Per SLA', activities: ['Technician selected by trade match + location', 'En-route GPS confirmation to customer', 'On-arrival check-in (site rep sign-in)'],
          deliverable: 'Technician on-site' },
        { step: '3', label: 'Diagnose + fix', duration: 'Variable', activities: ['Diagnostic walkthrough', 'Photo + video of issue', 'Parts requirement check', 'Repair OR temporary make-safe + return-with-parts plan'],
          deliverable: 'Repaired OR work-order for parts return', gate: 'Customer signs job card' },
        { step: '4', label: 'Job close', duration: 'Same day', activities: ['Job report + photos (before / after)', 'Customer satisfaction capture', 'Invoice raised (or roll into SLA monthly)', 'Asset register updated'],
          deliverable: 'Closed job + invoice' },
      ]}
      raciHeaders={['Intake', 'Dispatch', 'Diagnose+fix', 'Close']}
      raciRows={[
        { role: 'Dispatcher',           cells: ['A R', 'A R', 'I',   'I']   },
        { role: 'Technician',           cells: ['I',   'R',   'A R', 'R']   },
        { role: 'Operations Manager',   cells: ['A',   'A',   'C',   'A']   },
        { role: 'Customer',             cells: ['R',   'C',   'A',   'A']   },
      ]}
      tooling="Job-card system (ServiceM8 / Tradify / Notion), WhatsApp Business (intake), GPS tracking (Cartrack / Geotab), parts catalogue (CSV)."
      definitionOfDone="Issue resolved OR clear plan to resolve, customer signed job card, photos archived, invoice raised."
      pricingNotes="Call-out fee (R 350 – R 750 depending on trade + distance) + hourly labour + parts at cost + 15% markup. SLA customers get discounted call-out."
      engagePreset={{ serviceUnit: 'maintenance-co', serviceSlug: 'reactive-callouts', serviceName: 'Reactive Call-outs', accent: MC_PRIMARY, scopeFields: [
        { key: 'trade',    label: 'Trade needed', options: ['Electrical', 'Plumbing', 'HVAC', 'Vehicle', 'Equipment', 'Multi-trade', 'Not sure'] },
        { key: 'urgency',  label: 'Urgency', options: ['P1 - emergency', 'P2 - 48 hours', 'P3 - this week'] },
        { key: 'site',     label: 'Site location', placeholder: 'e.g. East London CBD' },
      ]}}
    />
  );
}

/* ────── 2. PREVENTIVE CONTRACTS ────── */
export function PreventiveContractsPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Preventive Contracts')}
      name="Preventive Maintenance Contracts" tagline="Scheduled servicing of facility assets — HVAC, generators, fire systems, electrical, plumbing."
      badge="Service 2 of 4" colour="#334155" initials="PM"
      facts={[
        { label: 'Cadence',     value: 'Quarterly typical' },
        { label: 'Asset types', value: 'HVAC · Gen · Fire · Elec' },
        { label: 'Compliance',  value: 'OHS · COCs · CoFs' },
        { label: 'Pricing',     value: 'Annual SLA · per-asset' },
      ]}
      phases={[
        { step: '1', label: 'Asset survey + register', duration: '1–2 weeks', activities: ['On-site survey of every coverable asset', 'Photo + serial capture', 'Manufacturer + warranty status', 'Service-history reconstruction'],
          deliverable: 'Asset register + initial condition report' },
        { step: '2', label: 'PM schedule design', duration: '1 week', activities: ['OEM-recommended frequency per asset', 'Cluster by site + trade for efficient routing', 'Compliance overlay (HVAC cleaning, fire-system test, etc.)', 'Annual + monthly view'],
          deliverable: 'PM schedule + quote', gate: 'Customer signs SLA' },
        { step: '3', label: 'Scheduled service visits', duration: 'Per cadence', activities: ['Pre-visit asset access confirmation', 'Service per checklist', 'Findings + recommendations report', 'Compliance certificate where applicable'],
          deliverable: 'Service report + certificate' },
        { step: '4', label: 'Annual SLA review', duration: '1 week (annual)', activities: ['12-month report (visits, findings, parts used)', 'Asset condition trend per asset', 'Renewal pricing + scope update'],
          deliverable: 'Annual review report + renewal offer' },
      ]}
      raciHeaders={['Survey', 'Schedule', 'Visits', 'Review']}
      raciRows={[
        { role: 'Operations Manager',   cells: ['A R', 'A R', 'A',   'A R'] },
        { role: 'Senior Technician',    cells: ['R',   'C',   'A R', 'R']   },
        { role: 'Compliance Officer',   cells: ['C',   'R',   'C',   'R']   },
        { role: 'Customer',             cells: ['A',   'A',   'I',   'A']   },
      ]}
      tooling="CMMS (UpKeep / Limble / Maintainly), asset QR codes, OHS document templates, digital signature for compliance certs."
      definitionOfDone="All scheduled visits completed within ±5 days of cadence, compliance certs issued, annual review delivered."
      pricingNotes="Annual SLA per asset (e.g. R 4 800 / year per split-AC unit). Parts at cost + markup. Out-of-scope work quoted separately."
      engagePreset={{ serviceUnit: 'maintenance-co', serviceSlug: 'preventive-contracts', serviceName: 'Preventive Contracts', accent: '#334155', scopeFields: [
        { key: 'sites',      label: 'Number of sites', placeholder: 'e.g. 3' },
        { key: 'assetTypes', label: 'Asset types', placeholder: 'e.g. HVAC, generators, fire systems' },
      ]}}
    />
  );
}

/* ────── 3. FLEET SERVICING ────── */
export function FleetServicingPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Fleet Servicing')}
      name="Vehicle & Fleet Servicing" tagline="OEM-spec scheduled servicing of LCV + passenger fleets. Roadworthy renewals + tyre management."
      badge="Service 3 of 4" colour="#1E293B" initials="FS"
      facts={[
        { label: 'Vehicle types', value: 'LCV · Passenger · Bakkie' },
        { label: 'Cadence',       value: 'OEM-spec (15k km typical)' },
        { label: 'Pricing',       value: 'Per vehicle · per service' },
        { label: 'Includes',      value: 'Pre-trip + roadworthy' },
      ]}
      phases={[
        { step: '1', label: 'Fleet onboarding', duration: '1 week', activities: ['Vehicle list + VIN + odo capture', 'OEM service-history reconstruction', 'Next service due-date per vehicle', 'Service-plan vs cash-pay decision'],
          deliverable: 'Fleet register + next-service schedule', gate: 'Customer signs scope' },
        { step: '2', label: 'Scheduled service', duration: 'Per cadence', activities: ['Customer notification 7 days before due', 'Booking confirmation', 'OEM-spec service performed', 'Multi-point inspection report'],
          deliverable: 'Service report + invoice' },
        { step: '3', label: 'Roadworthy + licence renewals', duration: 'Annual', activities: ['Roadworthy booking 30 days before licence expiry', 'Pre-test inspection + remediation', 'Roadworthy test', 'Licence renewal'],
          deliverable: 'Renewed disc + roadworthy cert' },
        { step: '4', label: 'Tyre + monthly inspection', duration: 'Monthly', activities: ['Tread depth + pressure check', 'Rotation + replacement when due', 'Wheel alignment when needed'],
          deliverable: 'Monthly tyre report' },
      ]}
      raciHeaders={['Onboard', 'Service', 'Roadworthy', 'Tyres']}
      raciRows={[
        { role: 'Fleet Coordinator',    cells: ['A R', 'A R', 'A R', 'A R'] },
        { role: 'Workshop Foreman',     cells: ['C',   'R',   'R',   'R']   },
        { role: 'Customer',             cells: ['A',   'I',   'A',   'I']   },
      ]}
      tooling="Fleet management software (Cartrack / Geotab / Webfleet), workshop management (Tekion / Loomly), OEM service portals."
      definitionOfDone="Vehicle returned to customer with multi-point inspection report + invoice. Service-history stamp on the right OEM portal."
      pricingNotes="Per-service fixed labour + parts at cost. Roadworthy: R 750 – R 1 500. Pre-trip inspection: R 250."
      engagePreset={{ serviceUnit: 'maintenance-co', serviceSlug: 'fleet-servicing', serviceName: 'Fleet Servicing', accent: '#1E293B', scopeFields: [
        { key: 'fleetSize', label: 'Fleet size', placeholder: 'e.g. 5 vehicles' },
        { key: 'vehicleMix',label: 'Vehicle mix', placeholder: 'e.g. 3x LCV, 2x bakkie' },
      ]}}
    />
  );
}

/* ────── 4. EQUIPMENT INSTALL ────── */
export function EquipmentInstallPage() {
  return (
    <ServiceDetail
      crumbs={detailCrumbs('Equipment Install & Commissioning')}
      name="Equipment Installation & Commissioning" tagline="Install and commission new equipment — production lines, irrigation systems, processing kit."
      badge="Service 4 of 4" colour="#64748B" initials="EI"
      facts={[
        { label: 'Duration',     value: '1–6 weeks per project' },
        { label: 'Scope',        value: 'Mechanical + Electrical + Controls' },
        { label: 'Output',       value: 'Commissioned + operators trained' },
        { label: 'Pricing',      value: 'Project quote' },
      ]}
      phases={[
        { step: '1', label: 'Site survey + spec', duration: '1 week', activities: ['Site walk + measurements', 'Power + water + comms requirements', 'OEM install specification cross-check', 'Method statement + risk assessment'],
          deliverable: 'Install spec + quote', gate: 'Customer signs install scope' },
        { step: '2', label: 'Install', duration: '1–4 weeks', activities: ['Equipment delivery + offload', 'Civil / mechanical install', 'Electrical reticulation + isolation', 'Controls + PLC programming where applicable'],
          deliverable: 'Installed equipment' },
        { step: '3', label: 'Commissioning + test', duration: '3–7 days', activities: ['Cold commissioning (no-load)', 'Hot commissioning (full-load)', 'Acceptance test per spec', 'Snag list + close-out'],
          deliverable: 'Acceptance test report', gate: 'Acceptance test pass' },
        { step: '4', label: 'Operator training + handover', duration: '1–3 days', activities: ['Operator training (theory + hands-on)', 'Maintenance manual + spares list', 'Warranty hand-over from OEM', 'Punch-list close-out'],
          deliverable: 'Training certs + handover pack' },
      ]}
      raciHeaders={['Survey', 'Install', 'Commission', 'Handover']}
      raciRows={[
        { role: 'Project Engineer',     cells: ['A R', 'A R', 'A R', 'A R'] },
        { role: 'Install Crew',         cells: ['C',   'R',   'R',   'C']   },
        { role: 'OEM Specialist',       cells: ['C',   'C',   'R',   'C']   },
        { role: 'Customer / Operators', cells: ['A',   'I',   'A',   'A']   },
      ]}
      tooling="AutoCAD / SketchUp (site drawings), PLC programming software (per OEM), Smartsheet (project plan), DocuSign (acceptance test signature)."
      definitionOfDone="Equipment commissioned + acceptance test signed off, operators trained, warranty period started."
      pricingNotes="Project quote based on equipment + install scope. Typically R 30 000 – R 500 000+. OEM specialist day-rates pass-through."
      engagePreset={{ serviceUnit: 'maintenance-co', serviceSlug: 'equipment-install', serviceName: 'Equipment Install & Commissioning', accent: '#64748B', scopeFields: [
        { key: 'equipment', label: 'Equipment type', placeholder: 'e.g. bottling line, irrigation, processing kit' },
        { key: 'site',      label: 'Site location', placeholder: 'e.g. East London' },
      ]}}
    />
  );
}
