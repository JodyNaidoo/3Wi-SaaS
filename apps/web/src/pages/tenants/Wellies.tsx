/**
 * Wellies Tenant — Multi-level Hub.
 *
 * Hierarchy:
 *   3Wi
 *     └── Wellies
 *           ├── Sales
 *           │     ├── Signature Retail Sales
 *           │     └── Outbound Sales
 *           │           ├── Personalised Labels
 *           │           ├── Wellies Water
 *           │           └── Euphoria Beverages
 *           ├── Production
 *           └── Product Development
 *
 * Wellies is structured by function (Sales / Production / Product Dev)
 * rather than by product, with the product lines living under Outbound Sales.
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

// Wellies brand accent
const WELLIES_HEX = '#B45309';

// ─────────────────────────────────────────── Tile primitive
function Tile({
  to, badge, badgeBg = '#015807', title, status, statusKind = 'amber',
  description, bullets, accentHex,
}: {
  to: string;
  badge: string;
  badgeBg?: string;
  title: string;
  status: string;
  statusKind?: 'amber' | 'emerald' | 'slate';
  description: string;
  bullets: string[];
  accentHex: string;
}) {
  const statusClass = statusKind === 'emerald'
    ? 'bg-emerald-100 text-emerald-800'
    : statusKind === 'slate'
    ? 'bg-slate-100 text-slate-700'
    : 'bg-amber-100 text-amber-800';
  return (
    <Link
      to={to}
      className="group block rounded-xl border-2 border-slate-200 bg-white p-6 transition-all hover:shadow-md"
      style={{ borderColor: undefined }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentHex)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-base font-bold text-white"
          style={{ background: badgeBg }}
        >
          {badge}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass}`}>{status}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-xs text-slate-600 mb-3">{description}</p>
      <div className="text-xs text-slate-500 space-y-0.5">
        {bullets.map((b) => <div key={b}>• {b}</div>)}
      </div>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: accentHex }}>
        Open &nbsp;→
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────── Breadcrumb primitive
function Crumbs({ trail }: { trail: { to?: string; label: string }[] }) {
  return (
    <nav className="text-xs text-slate-500 mb-3">
      {trail.map((c, i) => (
        <span key={i}>
          {c.to
            ? <Link to={c.to} className="hover:underline">{c.label}</Link>
            : <span className="text-slate-900 font-semibold">{c.label}</span>}
          {i < trail.length - 1 && <span className="mx-1.5 text-slate-400">›</span>}
        </span>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────── Placeholder template
function PlaceholderBlock({ slug, lead, prompts }: { slug: string; lead: string; prompts: string[] }) {
  return (
    <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5 mt-5 max-w-3xl">
      <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
      <p className="text-sm text-amber-900">{lead}</p>
      <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
        {prompts.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </div>
  );
}

// =================================================================
// LEVEL 1: Wellies Hub (Sales / Production / Product Development)
// =================================================================
export function WelliesHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs trail={[{ to: '/cc/director', label: '3Wi' }, { label: 'Wellies' }]} />
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: WELLIES_HEX }}>Tenant</div>
        <h1 className="text-3xl font-bold" style={{ color: WELLIES_HEX }}>Wellies</h1>
        <p className="text-sm text-slate-600 mt-1">
          Wellies is structured by function. Choose Sales, Production, or Product Development.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl">
        <Tile
          to="/tenants/wellies/sales"
          badge="S" badgeBg="#1E40AF"
          title="Sales" status="Active" statusKind="emerald"
          description="Retail and outbound sales channels — the revenue engine of Wellies."
          bullets={['Signature Retail Sales', 'Outbound Sales (3 product lines)']}
          accentHex="#1E40AF"
        />
        <Tile
          to="/tenants/wellies/production"
          badge="P" badgeBg="#3F1101"
          title="Production" status="Coming soon"
          description="Manufacturing and bottling operations. Production runs, inventory, quality."
          bullets={['Bottling lines', 'Inventory & WIP', 'Quality control']}
          accentHex="#3F1101"
        />
        <Tile
          to="/tenants/wellies/product-development"
          badge="PD" badgeBg="#015807"
          title="Product Development" status="Coming soon"
          description="New product lines, flavour development, packaging design, pilot runs."
          bullets={['New SKU pipeline', 'Flavour & formulation', 'Packaging design']}
          accentHex="#015807"
        />
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are</div>
        <div className="font-mono">3Wi → <span className="font-semibold" style={{ color: WELLIES_HEX }}>Wellies</span> → [Sales | Production | Product Development]</div>
      </div>
    </Shell>
  );
}

// =================================================================
// LEVEL 2: Wellies Sales (Signature Retail / Outbound)
// =================================================================
export function WelliesSalesHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs trail={[
        { to: '/cc/director', label: '3Wi' },
        { to: '/tenants/wellies', label: 'Wellies' },
        { label: 'Sales' },
      ]} />
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#1E40AF] mb-1">Function</div>
        <h1 className="text-3xl font-bold text-slate-900">Sales</h1>
        <p className="text-sm text-slate-600 mt-1">
          Two sales channels — retail through the signature outlets, and outbound through three product lines.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <Tile
          to="/tenants/wellies/sales/signature-retail"
          badge="SR" badgeBg="#1E40AF"
          title="Signature Retail Sales" status="Coming soon"
          description="Direct-to-consumer retail through the Wellies signature outlets."
          bullets={['Outlet network', 'POS daily takings', 'Stock per outlet']}
          accentHex="#1E40AF"
        />
        <Tile
          to="/tenants/wellies/sales/outbound"
          badge="OB" badgeBg="#0EA5A4"
          title="Outbound Sales" status="Active" statusKind="emerald"
          description="B2B and channel sales across three product lines."
          bullets={['Personalised Labels', 'Wellies Water', 'Euphoria Beverages']}
          accentHex="#0EA5A4"
        />
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are</div>
        <div className="font-mono">3Wi → Wellies → <span className="font-semibold text-[#1E40AF]">Sales</span> → [Signature Retail | Outbound]</div>
      </div>
    </Shell>
  );
}

// =================================================================
// LEVEL 3: Wellies Outbound Sales (3 product lines)
// =================================================================
export function WelliesOutboundSalesHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs trail={[
        { to: '/cc/director', label: '3Wi' },
        { to: '/tenants/wellies', label: 'Wellies' },
        { to: '/tenants/wellies/sales', label: 'Sales' },
        { label: 'Outbound Sales' },
      ]} />
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#0EA5A4] mb-1">Channel</div>
        <h1 className="text-3xl font-bold text-slate-900">Outbound Sales</h1>
        <p className="text-sm text-slate-600 mt-1">
          B2B and channel sales — three distinct product lines, each with its own customers, pricing and pipeline.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl">
        <Tile
          to="/tenants/wellies/sales/outbound/personalised-labels"
          badge="PL" badgeBg="#7C3AED"
          title="Personalised Labels" status="Coming soon"
          description="Bespoke label printing on Wellies bottled products — gifting, events, corporate."
          bullets={['Per-order custom design', 'Event &amp; corporate gifting', 'Wedding / promo SKUs']}
          accentHex="#7C3AED"
        />
        <Tile
          to="/tenants/wellies/sales/outbound/wellies-water"
          badge="WW" badgeBg="#0284C7"
          title="Wellies Water" status="Coming soon"
          description="Flagship bottled water product line — retail, hospitality and corporate channels."
          bullets={['Still &amp; sparkling SKUs', 'HoReCa accounts', 'Wholesale &amp; retail']}
          accentHex="#0284C7"
        />
        <Tile
          to="/tenants/wellies/sales/outbound/euphoria-beverages"
          badge="EU" badgeBg="#DC2626"
          title="Euphoria Beverages" status="Coming soon"
          description="Functional / lifestyle beverage line — distinct positioning from Wellies Water."
          bullets={['Functional drinks SKUs', 'Lifestyle / wellness positioning', 'Targeted retail channel']}
          accentHex="#DC2626"
        />
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are</div>
        <div className="font-mono">3Wi → Wellies → Sales → <span className="font-semibold text-[#0EA5A4]">Outbound Sales</span> → [Personalised Labels | Wellies Water | Euphoria Beverages]</div>
      </div>
    </Shell>
  );
}

// =================================================================
// Placeholder pages — all the leaves
// =================================================================
function GenericPlaceholder({ trail, title, accentHex, lead, prompts }: {
  trail: { to?: string; label: string }[];
  title: string; accentHex: string; lead: string; prompts: string[];
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs trail={trail} />
      <h1 className="text-3xl font-bold mt-3" style={{ color: accentHex }}>{title}</h1>
      <PlaceholderBlock slug={title} lead={lead} prompts={prompts} />
    </Shell>
  );
}

// LEVEL 2: Wellies Production Hub — bottle-size split
export function WelliesProductionHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs trail={[
        { to: '/cc/director', label: '3Wi' },
        { to: '/tenants/wellies', label: 'Wellies' },
        { label: 'Production' },
      ]} />
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#3F1101] mb-1">Function</div>
        <h1 className="text-3xl font-bold text-slate-900">Production</h1>
        <p className="text-sm text-slate-600 mt-1">
          Bottling operations split by pack size. Each tile opens that SKU's production line — capacity, runs, inventory and QC.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl">
        <Tile
          to="/tenants/wellies/production/500ml"
          badge="500" badgeBg="#0284C7"
          title="500 ml" status="Coming soon"
          description="Single-serve pack — retail, HoReCa, vending. Highest unit volume."
          bullets={['Single-serve SKU', 'Retail / HoReCa channel', 'Smallest pack size']}
          accentHex="#0284C7"
        />
        <Tile
          to="/tenants/wellies/production/1-5l"
          badge="1,5" badgeBg="#0EA5A4"
          title="1,5 L" status="Coming soon"
          description="Family / take-home pack — retail and bulk events."
          bullets={['Family / take-home SKU', 'Retail &amp; bulk channel', 'Mid-size pack']}
          accentHex="#0EA5A4"
        />
        <Tile
          to="/tenants/wellies/production/5l"
          badge="5L" badgeBg="#015807"
          title="5 L" status="Coming soon"
          description="Bulk / refill pack — office water, household refill, dispensers."
          bullets={['Bulk / refill SKU', 'Office &amp; household', 'Largest pack size']}
          accentHex="#015807"
        />
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are</div>
        <div className="font-mono">3Wi → Wellies → <span className="font-semibold text-[#3F1101]">Production</span> → [500 ml | 1,5 L | 5 L]</div>
      </div>
    </Shell>
  );
}

// LEVEL 3: bottle-size placeholders
export const WelliesProduction500mlPage = () => (
  <GenericPlaceholder
    trail={[
      { to: '/cc/director', label: '3Wi' },
      { to: '/tenants/wellies', label: 'Wellies' },
      { to: '/tenants/wellies/production', label: 'Production' },
      { label: '500 ml' },
    ]}
    title="500 ml line" accentHex="#0284C7"
    lead="Production line for 500 ml SKUs. Tell Claude what to track:"
    prompts={[
      'Bottling capacity (bottles per shift / per day)',
      'Active SKUs (Wellies Water, Euphoria flavours, personalised labels)',
      'Inventory on hand and reorder points',
      'Batch / lot tracking and QC records',
      'Downtime and yield metrics',
    ]}
  />
);

export const WelliesProduction1_5LPage = () => (
  <GenericPlaceholder
    trail={[
      { to: '/cc/director', label: '3Wi' },
      { to: '/tenants/wellies', label: 'Wellies' },
      { to: '/tenants/wellies/production', label: 'Production' },
      { label: '1,5 L' },
    ]}
    title="1,5 L line" accentHex="#0EA5A4"
    lead="Production line for 1,5 L SKUs. Tell Claude what to track:"
    prompts={[
      'Bottling capacity (per shift / per day)',
      'Active SKUs at this pack size',
      'Inventory on hand and reorder points',
      'Batch / lot tracking and QC records',
      'Downtime and yield metrics',
    ]}
  />
);

export const WelliesProduction5LPage = () => (
  <GenericPlaceholder
    trail={[
      { to: '/cc/director', label: '3Wi' },
      { to: '/tenants/wellies', label: 'Wellies' },
      { to: '/tenants/wellies/production', label: 'Production' },
      { label: '5 L' },
    ]}
    title="5 L line" accentHex="#015807"
    lead="Production line for 5 L bulk / refill SKUs. Tell Claude what to track:"
    prompts={[
      'Bottling capacity (per shift / per day)',
      'Active SKUs (office water, refill, dispensers)',
      'Returnable bottle programme (if applicable)',
      'Inventory on hand and reorder points',
      'Batch / lot tracking and QC records',
    ]}
  />
);

export const WelliesProductDevelopmentPage = () => (
  <GenericPlaceholder
    trail={[
      { to: '/cc/director', label: '3Wi' },
      { to: '/tenants/wellies', label: 'Wellies' },
      { label: 'Product Development' },
    ]}
    title="Product Development" accentHex="#015807"
    lead="New product pipeline. Tell Claude how to structure this:"
    prompts={[
      'Stages (concept → formulation → pilot → launch)',
      'Active NPD projects',
      'Owners and timelines',
      'Pilot batch tracking',
      'Launch criteria / gates',
    ]}
  />
);

export const WelliesSignatureRetailPage = () => (
  <GenericPlaceholder
    trail={[
      { to: '/cc/director', label: '3Wi' },
      { to: '/tenants/wellies', label: 'Wellies' },
      { to: '/tenants/wellies/sales', label: 'Sales' },
      { label: 'Signature Retail Sales' },
    ]}
    title="Signature Retail Sales" accentHex="#1E40AF"
    lead="Direct-to-consumer through the signature outlets. Tell Claude:"
    prompts={[
      'Outlet network — how many, where',
      'POS system in use',
      'Daily takings reporting',
      'Stock at outlet level',
      'Staff and shifts',
    ]}
  />
);

export const WelliesPersonalisedLabelsPage = () => (
  <GenericPlaceholder
    trail={[
      { to: '/cc/director', label: '3Wi' },
      { to: '/tenants/wellies', label: 'Wellies' },
      { to: '/tenants/wellies/sales', label: 'Sales' },
      { to: '/tenants/wellies/sales/outbound', label: 'Outbound Sales' },
      { label: 'Personalised Labels' },
    ]}
    title="Personalised Labels" accentHex="#7C3AED"
    lead="Bespoke labelling on Wellies bottled products. Tell Claude:"
    prompts={[
      'Order pipeline — customer, event, design, qty',
      'Lead time and production scheduling',
      'Design approval workflow',
      'Pricing tiers (event size / quantity bands)',
      'Print / labelling vendor relationships',
    ]}
  />
);

export const WelliesWaterPage = () => (
  <GenericPlaceholder
    trail={[
      { to: '/cc/director', label: '3Wi' },
      { to: '/tenants/wellies', label: 'Wellies' },
      { to: '/tenants/wellies/sales', label: 'Sales' },
      { to: '/tenants/wellies/sales/outbound', label: 'Outbound Sales' },
      { label: 'Wellies Water' },
    ]}
    title="Wellies Water" accentHex="#0284C7"
    lead="Flagship bottled water — HoReCa, retail, corporate channels. Tell Claude:"
    prompts={[
      'SKUs (still / sparkling / pack sizes)',
      'Active accounts (HoReCa, retailers, distributors)',
      'Pricing per channel and per SKU',
      'Sales pipeline and quotes',
      'Order management — where do orders live?',
    ]}
  />
);

export const WelliesEuphoriaPage = () => (
  <GenericPlaceholder
    trail={[
      { to: '/cc/director', label: '3Wi' },
      { to: '/tenants/wellies', label: 'Wellies' },
      { to: '/tenants/wellies/sales', label: 'Sales' },
      { to: '/tenants/wellies/sales/outbound', label: 'Outbound Sales' },
      { label: 'Euphoria Beverages' },
    ]}
    title="Euphoria Beverages" accentHex="#DC2626"
    lead="Functional / lifestyle beverage line. Tell Claude:"
    prompts={[
      'Category positioning (functional, wellness, lifestyle, other)',
      'SKUs and flavours',
      'Target retail channel (health stores, gyms, mainstream retail)',
      'Differentiation from Wellies Water',
      'Active accounts and pipeline',
    ]}
  />
);
