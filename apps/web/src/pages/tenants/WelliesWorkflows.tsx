/**
 * Wellies — 8 productised workflows (replaces placeholder detail pages).
 *
 * Sales workflows (B2B-engageable):
 *   1. Signature Retail Sales
 *   2. Personalised Labels
 *   3. Wellies Water
 *   4. Euphoria Beverages
 *
 * Production workflows (internal ops):
 *   5. Production 500ml line
 *   6. Production 1.5L line
 *   7. Production 5L line
 *
 * Product Development (internal NPD):
 *   8. Product Development
 *
 * Hub pages (WelliesHub, WelliesSalesHub, WelliesOutboundSalesHub,
 * WelliesProductionHub) stay in Wellies.tsx — unchanged.
 */

import { ServiceDetail, type Crumb } from '../../components/service-hub/ServiceHubKit';

const WELLIES_HEX = '#B45309';
const TENANT_CRUMBS: Crumb[] = [
  { label: '3Wi', href: '/cc/director' },
  { label: 'Wellies', href: '/tenants/wellies' },
];

function salesCrumbs(name: string): Crumb[] {
  return [...TENANT_CRUMBS, { label: 'Sales', href: '/tenants/wellies/sales' }, { label: name }];
}
function outboundCrumbs(name: string): Crumb[] {
  return [
    ...TENANT_CRUMBS,
    { label: 'Sales', href: '/tenants/wellies/sales' },
    { label: 'Outbound Sales', href: '/tenants/wellies/sales/outbound' },
    { label: name },
  ];
}
function productionCrumbs(name: string): Crumb[] {
  return [...TENANT_CRUMBS, { label: 'Production', href: '/tenants/wellies/production' }, { label: name }];
}
function prodDevCrumbs(): Crumb[] {
  return [...TENANT_CRUMBS, { label: 'Product Development' }];
}

/* ══════════════════════════════════════════════════════════════════
 *  1 · SIGNATURE RETAIL SALES
 * ══════════════════════════════════════════════════════════════════ */
export function WelliesSignatureRetailWorkflow() {
  return (
    <ServiceDetail
      crumbs={salesCrumbs('Signature Retail')}
      name="Signature Retail Sales"
      tagline="In-store retail channel for Wellies Water and Euphoria Beverages — Spar, Pick n Pay, Boxer, indies."
      badge="Sales · Retail channel"
      colour={WELLIES_HEX}
      initials="SR"
      facts={[
        { label: 'Channel',       value: 'National + regional retail' },
        { label: 'Listings',      value: 'Per SKU per banner' },
        { label: 'Pricing',       value: 'List - trade discount - rebate' },
        { label: 'Reorder cycle', value: 'Weekly / fortnightly' },
      ]}
      phases={[
        { step: '1', label: 'Account opening', duration: '2–4 weeks', activities: ['NDA + credit application', 'Master supply agreement', 'EDI + ordering system setup', 'Distribution centre allocation'], deliverable: 'Active retailer account + supplier code', gate: 'First PO received' },
        { step: '2', label: 'Range presentation + listing', duration: '4–8 weeks', activities: ['Category review submission', 'Listing-fee negotiation', 'NPD + range pack to buyer', 'Listing decision'], deliverable: 'Confirmed SKU listings + barcodes registered', gate: 'Listing letter received' },
        { step: '3', label: 'Planogram + PO', duration: '2–4 weeks', activities: ['Shelf position + facings allocation', 'POS / launch promo plan', 'Opening order + DC delivery', 'In-store activation (sampling, demos)'], deliverable: 'On-shelf in pilot stores', gate: 'In-store audit confirms presence' },
        { step: '4', label: 'Sell-through + reorder', duration: 'Continuous', activities: ['Weekly Nielsen / EPOS data review', 'Out-of-stock + lost-sales monitoring', 'Promotional planning (mid + month-end pulses)', 'Quarterly business review with buyer'], deliverable: 'Healthy weekly reorders + rate-of-sale per SKU' },
      ]}
      raciHeaders={['Open', 'List', 'Plan', 'Reorder']}
      raciRows={[
        { role: 'National Sales Manager', cells: ['A R', 'A R', 'A',   'A R'] },
        { role: 'Key Account Manager',    cells: ['R',   'R',   'A R', 'R']   },
        { role: 'Merchandiser',           cells: ['I',   'I',   'R',   'R']   },
        { role: 'Trade Marketing',        cells: ['C',   'C',   'R',   'C']   },
        { role: 'Retailer buyer',         cells: ['A',   'A',   'C',   'C']   },
      ]}
      tooling="Salesforce / HubSpot (KAM CRM), Nielsen + EPOS data feeds, EDI integrations per banner, Tableau / Power BI (sell-through dashboards)."
      definitionOfDone="SKU listed + on-shelf + reordering weekly at or above target rate-of-sale."
      pricingNotes="Wholesale price = list - trade discount (8–18% depending on banner) - rebate (2–5%). Margin target +/- 35% net."
      engagePreset={{
        serviceUnit: 'wellies-sales',
        serviceSlug: 'signature-retail',
        serviceName: 'Signature Retail Sales',
        accent: WELLIES_HEX,
        scopeFields: [
          { key: 'banner', label: 'Retail banner', options: ['Spar', 'Pick n Pay', 'Boxer', 'Shoprite / Checkers', 'Independent', 'Other'] },
          { key: 'sku',    label: 'SKU interest',  options: ['Wellies Water 500ml', 'Wellies Water 1.5L', 'Wellies Water 5L', 'Euphoria Beverages', 'Full range'] },
        ],
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  2 · PERSONALISED LABELS
 * ══════════════════════════════════════════════════════════════════ */
export function WelliesPersonalisedLabelsWorkflow() {
  return (
    <ServiceDetail
      crumbs={outboundCrumbs('Personalised Labels')}
      name="Personalised Labels"
      tagline="Bespoke-labelled bottled water for events, corporate gifting, weddings, conferences."
      badge="Outbound · Bespoke"
      colour="#9C5310"
      initials="PL"
      facts={[
        { label: 'MOQ',          value: '500 bottles' },
        { label: 'Lead time',    value: '10 working days' },
        { label: 'Format',       value: '500ml standard · custom on request' },
        { label: 'Pricing',      value: 'Sliding scale by quantity' },
      ]}
      phases={[
        { step: '1', label: 'Brief intake', duration: '1 day', activities: ['Event date + delivery address', 'Bottle quantity + format', 'Artwork brief (logo, theme, colours)', 'Brand-safety check (no banned categories)'], deliverable: 'Confirmed brief + first quote', gate: 'Customer accepts quote' },
        { step: '2', label: 'Artwork design + proof', duration: '2–3 days', activities: ['Designer drafts label artwork', 'Customer review round 1', 'Revisions if needed (max 2 rounds in scope)', 'Final proof signed'], deliverable: 'Signed-off print-ready artwork', gate: 'Artwork sign-off' },
        { step: '3', label: 'PO + production scheduling', duration: '1 day', activities: ['Deposit invoice (50%)', 'Slot booked on label-print + bottling line', 'Production date confirmed to customer'], deliverable: 'Scheduled production date' },
        { step: '4', label: 'Production + label print', duration: '3–5 days', activities: ['Label print run', 'Bottling line setup + run', 'Inline quality check', 'Pallet labelling + dispatch prep'], deliverable: 'Finished personalised bottles palletised' },
        { step: '5', label: 'Delivery + feedback', duration: '1–2 days', activities: ['Courier dispatch with tracking', 'Final balance invoice issued', 'Delivery confirmation', 'Post-event feedback request'], deliverable: 'Delivered + paid + NPS captured' },
      ]}
      raciHeaders={['Brief', 'Artwork', 'PO', 'Production', 'Deliver']}
      raciRows={[
        { role: 'Account Manager',    cells: ['A R', 'A',   'A R', 'C',   'A R'] },
        { role: 'Designer',           cells: ['I',   'A R', 'I',   'I',   'I']   },
        { role: 'Production Planner', cells: ['I',   'I',   'R',   'A R', 'C']   },
        { role: 'Logistics',          cells: ['I',   'I',   'I',   'C',   'R']   },
        { role: 'Customer',           cells: ['A',   'A',   'A',   'I',   'A']   },
      ]}
      tooling="HubSpot (intake), Figma / Adobe Illustrator (artwork), Xero (invoicing), Pastel Evolution (production scheduling), Aramex / Courier Guy (delivery)."
      definitionOfDone="Bottles delivered on or before event date, balance invoice paid, customer NPS captured."
      pricingNotes="500 bottles @ R 12 ea | 1 000 @ R 9 ea | 5 000 @ R 7 ea | 10 000+ @ R 5,50 ea. Artwork design included up to 2 revision rounds, extra rounds R 350/round."
      engagePreset={{
        serviceUnit: 'wellies-outbound',
        serviceSlug: 'personalised-labels',
        serviceName: 'Personalised Labels',
        accent: '#9C5310',
        scopeFields: [
          { key: 'quantity', label: 'Bottle quantity', placeholder: 'e.g. 1 500' },
          { key: 'eventDate',label: 'Event date',      placeholder: 'YYYY-MM-DD' },
          { key: 'occasion', label: 'Occasion / use',  options: ['Wedding', 'Corporate event', 'Conference', 'Gift / promo', 'Other'] },
        ],
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  3 · WELLIES WATER (B2B branded water)
 * ══════════════════════════════════════════════════════════════════ */
export function WelliesWaterWorkflow() {
  return (
    <ServiceDetail
      crumbs={outboundCrumbs('Wellies Water')}
      name="Wellies Water"
      tagline="B2B branded water — offices, gyms, hotels, schools, hospitals. Standing-order delivery model."
      badge="Outbound · Recurring B2B"
      colour="#7B2E13"
      initials="WW"
      facts={[
        { label: 'SKUs',         value: '500ml · 1.5L · 5L' },
        { label: 'Cadence',      value: 'Weekly / fortnightly / monthly' },
        { label: 'Pricing',      value: 'Tiered by monthly volume' },
        { label: 'Contract',     value: '12-month rolling' },
      ]}
      phases={[
        { step: '1', label: 'Lead → qualification', duration: '1 week', activities: ['Inbound lead capture (web, referral, walk-in)', 'BANT-style qualification call', 'Site / staff-count assessment', 'Volume estimate + SKU mix'], deliverable: 'Qualified opportunity in CRM' },
        { step: '2', label: 'Sample + meeting', duration: '1–2 weeks', activities: ['Sample case delivered to prospect', 'Tasting / quality walkthrough', 'Decision-maker meeting', 'Competitive replacement plan (if switching)'], deliverable: 'Decision-maker buy-in + intent to proceed', gate: 'Verbal commitment' },
        { step: '3', label: 'Quote + contract', duration: '1 week', activities: ['Pricing per tier confirmed', '12-month supply agreement', 'Cooler / dispenser provision (if needed)', 'Service-level commitments'], deliverable: 'Signed supply agreement', gate: 'Contract signed' },
        { step: '4', label: 'Onboarding + first delivery', duration: '1–2 weeks', activities: ['Account setup in ordering system', 'Standing-order delivery schedule confirmed', 'First delivery + dispenser install', 'Customer kick-off + ordering training'], deliverable: 'First delivery received + ordering system live' },
        { step: '5', label: 'Reorder + account management', duration: 'Continuous', activities: ['Standing-order auto-fulfilment', 'Monthly account review (volume, satisfaction)', 'Quarterly business review', 'Upsell to new sites / SKUs'], deliverable: 'Monthly recurring revenue + low-churn account' },
      ]}
      raciHeaders={['Qualify', 'Sample', 'Contract', 'Onboard', 'Manage']}
      raciRows={[
        { role: 'BD Manager',         cells: ['A R', 'A R', 'A R', 'A',   'A']   },
        { role: 'Sales Rep',          cells: ['R',   'R',   'R',   'R',   'R']   },
        { role: 'Customer Service',   cells: ['I',   'I',   'C',   'R',   'A R'] },
        { role: 'Logistics',          cells: ['I',   'I',   'C',   'R',   'R']   },
        { role: 'Customer',           cells: ['A',   'A',   'A',   'A',   'C']   },
      ]}
      tooling="HubSpot (CRM), Xero (recurring invoicing), Cartrack (delivery vehicle tracking), Slack (customer-service channels), Typeform (quarterly NPS)."
      definitionOfDone="Standing-order live, first 3 deliveries received on schedule, customer NPS captured at month 1."
      pricingNotes="Tier 1: <500L/mo @ list. Tier 2: 500–2000L/mo @ -8%. Tier 3: 2000–10000L/mo @ -15%. Tier 4: 10000L+/mo @ -22% + dispenser provision."
      engagePreset={{
        serviceUnit: 'wellies-outbound',
        serviceSlug: 'wellies-water',
        serviceName: 'Wellies Water',
        accent: '#7B2E13',
        scopeFields: [
          { key: 'segment',  label: 'Customer segment', options: ['Office', 'Gym / fitness', 'Hotel / HORECA', 'School', 'Hospital / clinic', 'Other'] },
          { key: 'volume',   label: 'Estimated monthly volume', options: ['<500 litres', '500-2000 litres', '2000-10000 litres', '10000+ litres'] },
          { key: 'sites',    label: 'Number of sites',  placeholder: 'e.g. 3' },
        ],
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  4 · EUPHORIA BEVERAGES
 * ══════════════════════════════════════════════════════════════════ */
export function WelliesEuphoriaWorkflow() {
  return (
    <ServiceDetail
      crumbs={outboundCrumbs('Euphoria Beverages')}
      name="Euphoria Beverages"
      tagline="Wellies' flavoured / functional beverage range. B2B + niche retail."
      badge="Outbound · Flavoured beverages"
      colour="#5C1801"
      initials="EB"
      facts={[
        { label: 'Range',       value: 'Flavoured + functional SKUs' },
        { label: 'Channels',    value: 'Retail · HORECA · Gym · Direct' },
        { label: 'Pricing',     value: 'Premium-to-Wellies-Water' },
        { label: 'NPD cycle',   value: 'New SKU per quarter (target)' },
      ]}
      phases={[
        { step: '1', label: 'Lead → qualification', duration: '1 week', activities: ['Inbound + outbound prospecting', 'Channel fit (retail / HORECA / gym / direct)', 'Volume + cadence estimate'], deliverable: 'Qualified opportunity' },
        { step: '2', label: 'Sample + tasting', duration: '1–2 weeks', activities: ['Sample case + brand pack', 'Tasting session', 'Functional benefits walkthrough (where applicable)', 'Decision-maker meeting'], deliverable: 'Tasting feedback + intent', gate: 'Buyer interest confirmed' },
        { step: '3', label: 'Quote + supply terms', duration: '1 week', activities: ['SKU mix + pack format', 'Trade pricing + promo allowance', 'Supply agreement', 'Co-marketing plan (if applicable)'], deliverable: 'Signed supply terms' },
        { step: '4', label: 'Onboarding + launch', duration: '2 weeks', activities: ['First PO + delivery', 'In-store / on-premise activation', 'Sales-team training (HORECA only)'], deliverable: 'Live on shelf / behind bar' },
        { step: '5', label: 'Sell-through + reorder', duration: 'Continuous', activities: ['Weekly EPOS or order data review', 'Promotional pulses', 'New SKU introduction at QBRs', 'Quarterly business review'], deliverable: 'Repeat orders + ranged expansion' },
      ]}
      raciHeaders={['Qualify', 'Sample', 'Contract', 'Launch', 'Manage']}
      raciRows={[
        { role: 'BD Manager',         cells: ['A R', 'A',   'A R', 'A',   'A R'] },
        { role: 'Sales Rep',          cells: ['R',   'R',   'R',   'R',   'R']   },
        { role: 'Brand Marketing',    cells: ['C',   'R',   'C',   'A R', 'C']   },
        { role: 'Logistics',          cells: ['I',   'I',   'I',   'R',   'R']   },
        { role: 'Customer',           cells: ['A',   'A',   'A',   'C',   'C']   },
      ]}
      tooling="HubSpot (CRM), Pastel Evolution (orders), Klaviyo (DTC if direct), Meta + TikTok ads (gym + retail awareness)."
      definitionOfDone="First PO delivered, sell-through tracked at week 4, decision on re-order or de-list at month 3."
      pricingNotes="Higher margin than Wellies Water given premium functional positioning. Promotional allowance 3–5% of trade-spend budget."
      engagePreset={{
        serviceUnit: 'wellies-outbound',
        serviceSlug: 'euphoria-beverages',
        serviceName: 'Euphoria Beverages',
        accent: '#5C1801',
        scopeFields: [
          { key: 'channel',   label: 'Channel', options: ['Retail', 'HORECA / on-premise', 'Gym / fitness', 'Direct / corporate', 'Distributor'] },
          { key: 'skuMix',    label: 'SKU interest',    placeholder: 'e.g. full range, just functional' },
        ],
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  5 · PRODUCTION 500ml LINE (internal ops)
 * ══════════════════════════════════════════════════════════════════ */
export function WelliesProduction500mlWorkflow() {
  return (
    <ServiceDetail
      crumbs={productionCrumbs('500ml line')}
      name="Production — 500ml line"
      tagline="High-volume single-serve line. Bottle blow → fill → cap → label → code → palletise."
      badge="Production · Internal ops"
      colour={WELLIES_HEX}
      initials="P5"
      facts={[
        { label: 'Output target', value: '8 000 bottles/hour' },
        { label: 'OEE target',    value: '> 75%' },
        { label: 'Scrap target',  value: '< 1.5%' },
        { label: 'QC release',    value: 'Microbio + chemistry per batch' },
      ]}
      phases={[
        { step: '1', label: 'Production planning', duration: 'Weekly', activities: ['Sales forecast pull (S&OP)', 'Finished-goods inventory check', 'Production schedule build', 'Material requirements (preforms, caps, labels, film)'], deliverable: 'Confirmed production schedule + materials staged' },
        { step: '2', label: 'Line setup + materials', duration: '30–60 min', activities: ['Preform hopper load', 'Cap + label change-over (if SKU change)', 'CIP / sanitisation cycle', 'Filler purge + sample run'], deliverable: 'Line ready for production run', gate: 'Pre-run QC sample pass' },
        { step: '3', label: 'Production run', duration: 'Per shift', activities: ['Inline blow → fill → cap → label → batch-code → palletise', 'Inline reject monitoring', 'Hourly QC samples (fill volume, cap torque, label position)', 'Operator + maintenance handover at shift change'], deliverable: 'Palletised bottles + run report' },
        { step: '4', label: 'QC + release', duration: '24–48 hours', activities: ['Microbiology incubation', 'Chemistry (TDS, pH, conductivity)', 'Visual + leak test on sample', 'Certificate of Analysis sign-off'], deliverable: 'Released pallets (or holds + investigation)', gate: 'CoA signed' },
        { step: '5', label: 'Finished goods to warehouse', duration: 'Same day as release', activities: ['Pallet move to FG warehouse', 'WMS update + barcode link', 'Available-to-promise refresh in ERP'], deliverable: 'Stock available for picking' },
      ]}
      raciHeaders={['Plan', 'Setup', 'Run', 'QC', 'FG']}
      raciRows={[
        { role: 'Production Manager', cells: ['A R', 'A',   'A',   'C',   'A']   },
        { role: 'Line Operator',      cells: ['I',   'A R', 'A R', 'C',   'R']   },
        { role: 'QC Technician',      cells: ['C',   'R',   'R',   'A R', 'C']   },
        { role: 'Maintenance',        cells: ['I',   'R',   'R',   'I',   'I']   },
        { role: 'Warehouse',          cells: ['C',   'I',   'I',   'I',   'A R'] },
      ]}
      tooling="ERP (Pastel Evolution / Sage X3), MES / SCADA on line, LIMS for QC, hand-held scanners for WMS, Power BI for OEE dashboard."
      definitionOfDone="Pallets released to FG within 48h of run, OEE logged, CoA filed, batch traceable end-to-end."
      pricingNotes="Internal cost-centre — costed via standard cost + variance. External co-pack runs priced at variable + 35% margin."
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  6 · PRODUCTION 1.5L LINE
 * ══════════════════════════════════════════════════════════════════ */
export function WelliesProduction1_5LWorkflow() {
  return (
    <ServiceDetail
      crumbs={productionCrumbs('1.5L line')}
      name="Production — 1.5L line"
      tagline="Family-pack line. Slower output, heavier bottles, shrink-wrap multi-packs."
      badge="Production · Internal ops"
      colour="#9C5310"
      initials="P1"
      facts={[
        { label: 'Output target', value: '3 500 bottles/hour' },
        { label: 'OEE target',    value: '> 72%' },
        { label: 'Pack format',   value: '6-pack shrink-wrapped' },
        { label: 'QC release',    value: 'Microbio + chemistry + pack integrity' },
      ]}
      phases={[
        { step: '1', label: 'Production planning', duration: 'Weekly', activities: ['Sales forecast + retail promo overlay', 'Inventory check', 'Schedule build with 500ml line coordination', 'Materials staging (preforms, caps, labels, shrink film)'], deliverable: 'Confirmed schedule + materials' },
        { step: '2', label: 'Line setup', duration: '45–90 min', activities: ['Heavier preform handling check', 'Shrink-wrap tunnel temperature setup', 'CIP + sanitisation', 'Sample run + first-off inspection'], deliverable: 'Line cleared to run', gate: 'Pre-run QC pass' },
        { step: '3', label: 'Production run', duration: 'Per shift', activities: ['Blow → fill → cap → label → batch-code → 6-pack shrink-wrap → palletise', 'Pack-integrity checks (shrink seal quality)', 'Hourly QC samples'], deliverable: 'Palletised 6-packs' },
        { step: '4', label: 'QC + release', duration: '24–48 hours', activities: ['Microbiology + chemistry', 'Shrink-wrap integrity test', 'CoA sign-off'], deliverable: 'Released pallets', gate: 'CoA signed' },
        { step: '5', label: 'FG to warehouse', duration: 'Same day', activities: ['Pallet move', 'WMS update', 'ATP refresh'], deliverable: 'Stock available for picking' },
      ]}
      raciHeaders={['Plan', 'Setup', 'Run', 'QC', 'FG']}
      raciRows={[
        { role: 'Production Manager', cells: ['A R', 'A',   'A',   'C',   'A']   },
        { role: 'Line Operator',      cells: ['I',   'A R', 'A R', 'C',   'R']   },
        { role: 'QC Technician',      cells: ['C',   'R',   'R',   'A R', 'C']   },
        { role: 'Maintenance',        cells: ['I',   'R',   'R',   'I',   'I']   },
        { role: 'Warehouse',          cells: ['C',   'I',   'I',   'I',   'A R'] },
      ]}
      tooling="Same stack as 500ml line. Shrink-wrap tunnel needs its own SCADA tag-set."
      definitionOfDone="Pallets released within 48h, pack integrity passed, traceability complete."
      pricingNotes="Internal cost-centre. Shrink-wrap consumables + slower line speed = higher per-unit cost than 500ml."
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  7 · PRODUCTION 5L LINE
 * ══════════════════════════════════════════════════════════════════ */
export function WelliesProduction5LWorkflow() {
  return (
    <ServiceDetail
      crumbs={productionCrumbs('5L line')}
      name="Production — 5L line"
      tagline="Bulk pack line for HORECA + retail family format. Carry-handle bottles, lower output, longer dwell."
      badge="Production · Internal ops"
      colour="#5C1801"
      initials="P5"
      facts={[
        { label: 'Output target', value: '1 200 bottles/hour' },
        { label: 'OEE target',    value: '> 68%' },
        { label: 'Pack format',   value: 'Single bottle + handle' },
        { label: 'Channel',       value: 'HORECA + family-pack retail' },
      ]}
      phases={[
        { step: '1', label: 'Production planning', duration: 'Weekly', activities: ['HORECA standing-order pull', 'Family-pack retail forecast', 'Material staging (5L preforms, caps, handle inserts, labels)', 'Slot allocation between SKUs'], deliverable: 'Confirmed schedule' },
        { step: '2', label: 'Line setup', duration: '60–120 min', activities: ['5L preform + handle assembly check', 'Filler nozzle change-over (larger bore)', 'CIP + sanitisation', 'First-off inspection (handle alignment, fill level)'], deliverable: 'Line cleared', gate: 'Pre-run QC pass' },
        { step: '3', label: 'Production run', duration: 'Per shift', activities: ['Blow (with handle insert) → fill → cap → label → code → palletise (single layer for retail, double for HORECA)', 'Inline checks: handle integrity, label position', 'Hourly QC samples'], deliverable: 'Palletised 5L bottles' },
        { step: '4', label: 'QC + release', duration: '24–48 hours', activities: ['Microbiology + chemistry', 'Handle pull-test sample', 'Bottle leak / pressure sample', 'CoA sign-off'], deliverable: 'Released pallets', gate: 'CoA + handle test pass' },
        { step: '5', label: 'FG to warehouse', duration: 'Same day', activities: ['Pallet move (heavier, fewer per pallet)', 'WMS update', 'Allocate to HORECA standing orders first'], deliverable: 'Stock available' },
      ]}
      raciHeaders={['Plan', 'Setup', 'Run', 'QC', 'FG']}
      raciRows={[
        { role: 'Production Manager', cells: ['A R', 'A',   'A',   'C',   'A']   },
        { role: 'Line Operator',      cells: ['I',   'A R', 'A R', 'C',   'R']   },
        { role: 'QC Technician',      cells: ['C',   'R',   'R',   'A R', 'C']   },
        { role: 'Maintenance',        cells: ['I',   'R',   'R',   'I',   'I']   },
        { role: 'Warehouse',          cells: ['C',   'I',   'I',   'I',   'A R'] },
      ]}
      tooling="Same ERP / MES / LIMS / WMS as 500ml + 1.5L. Handle pull-test apparatus on-line."
      definitionOfDone="Pallets released within 48h, HORECA standing-orders fulfilled first, retail FG balance live."
      pricingNotes="Internal cost-centre. Lower line speed + heavier pack = highest per-litre cost across the 3 lines."
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
 *  8 · PRODUCT DEVELOPMENT (NPD)
 * ══════════════════════════════════════════════════════════════════ */
export function WelliesProductDevelopmentWorkflow() {
  return (
    <ServiceDetail
      crumbs={prodDevCrumbs()}
      name="Product Development"
      tagline="New product development pipeline — concept to commercial launch. Standard 5-gate NPD process."
      badge="Internal · NPD"
      colour="#7C3AED"
      initials="PD"
      facts={[
        { label: 'NPD cycle target', value: '6–12 months concept-to-shelf' },
        { label: 'Gates',            value: '5 stage-gates' },
        { label: 'Hit rate target',  value: '1 in 4 concepts launch' },
        { label: 'Categories',       value: 'Water · flavoured · functional' },
      ]}
      phases={[
        { step: '1', label: 'Concept generation', duration: '4–6 weeks', activities: ['Consumer + category insight scan', 'Competitor + trend audit', 'Internal ideation workshops', 'Concept brief drafting (3–8 concepts)'], deliverable: 'Concept briefs', gate: 'Gate 1: portfolio fit + go-no-go on concepts' },
        { step: '2', label: 'Concept screening', duration: '3–4 weeks', activities: ['Consumer concept test (qual or quant)', 'Cost-of-goods estimation', 'Regulatory + ingredient feasibility', 'Score + rank concepts'], deliverable: 'Ranked concepts + 1–2 selected', gate: 'Gate 2: selected concept to prototype' },
        { step: '3', label: 'Prototype + sensory', duration: '6–10 weeks', activities: ['Formulation development (in-house or external lab)', 'Iterative sensory rounds (internal panel + consumer)', 'Packaging concept design', 'Shelf-life trial start'], deliverable: 'Prototype passing sensory + initial shelf-life', gate: 'Gate 3: prototype to pilot' },
        { step: '4', label: 'Pilot run', duration: '4–6 weeks', activities: ['Small-batch pilot on real production line', 'Pack format finalised + artwork', 'Pilot QA + microbiology', 'Trade + consumer reaction (sampling)'], deliverable: 'Pilot batch + go-to-market plan', gate: 'Gate 4: pilot → commercial launch' },
        { step: '5', label: 'Commercialisation / launch', duration: '6–10 weeks', activities: ['First commercial production run', 'Trade listing + sell-in', 'Marketing campaign launch (Knockout Marketing)', 'Sell-through tracking → reorder', 'Post-launch review at month 3'], deliverable: 'Live SKU + month-3 post-launch review', gate: 'Gate 5: scale, hold, or pull' },
      ]}
      raciHeaders={['Concepts', 'Screen', 'Prototype', 'Pilot', 'Launch']}
      raciRows={[
        { role: 'NPD Manager',        cells: ['A R', 'A R', 'A R', 'A R', 'A R'] },
        { role: 'Food Scientist',     cells: ['C',   'R',   'A R', 'R',   'C']   },
        { role: 'Packaging Designer', cells: ['I',   'I',   'R',   'R',   'C']   },
        { role: 'Brand Marketing',    cells: ['C',   'R',   'C',   'R',   'A R'] },
        { role: 'Production Manager', cells: ['I',   'C',   'C',   'A',   'A']   },
        { role: 'Finance',            cells: ['I',   'R',   'C',   'C',   'C']   },
      ]}
      tooling="Notion (concept briefs + stage-gate tracker), Figma (packaging design), in-house sensory lab, external CRO for consumer testing (Ask Afrika / Insight), shelf-life testing partner."
      definitionOfDone="SKU live on shelf, hitting forecast rate-of-sale at month 3, post-launch review documents go/hold/pull decision."
      pricingNotes="Internal cost-centre. Concept-to-launch NPD spend typically R 250 000 – R 1.2m per SKU (incl. lab, consumer testing, pack design, launch marketing)."
    />
  );
}
