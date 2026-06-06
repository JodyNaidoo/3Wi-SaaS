/**
 * MT Naidoo Properties — Property Portfolio Hub.
 *
 * Hierarchy:
 *   3Wi
 *     └── MT Naidoo Properties
 *           ├── 14 Wellington Street
 *           └── MTNFT-9 Botanic Street
 *
 * Each tile represents an individual property asset in the portfolio.
 * Property-specific tracking template: lease, rental income, opex,
 * capex, valuation, tenants.
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

const MTN_HEX = '#475569';

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

/** Property tile primitive. */
function PropertyTile({
  to, code, badgeBg, address, status, statusKind = 'amber',
  description, accentHex,
}: {
  to: string;
  code: string;
  badgeBg: string;
  address: string;
  status: string;
  statusKind?: 'amber' | 'emerald' | 'slate';
  description: string;
  accentHex: string;
}) {
  const statusClass = statusKind === 'emerald'
    ? 'bg-emerald-100 text-emerald-800'
    : statusKind === 'slate'
    ? 'bg-slate-100 text-slate-700'
    : 'bg-amber-100 text-amber-800';
  return (
    <Link to={to}
      className="group block rounded-xl border-2 border-slate-200 bg-white p-6 transition-all hover:shadow-md"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentHex)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center min-w-12 h-12 px-3 rounded-lg text-white text-xs font-mono font-bold"
          style={{ background: badgeBg }}
        >
          {code}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass}`}>{status}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{address}</h2>
      <p className="text-xs text-slate-600 mb-3">{description}</p>
      <div className="text-xs text-slate-500 space-y-0.5">
        <div>• Lease &amp; tenant register</div>
        <div>• Rental income / arrears</div>
        <div>• Opex (rates, levies, maintenance, insurance)</div>
        <div>• Valuation &amp; capex schedule</div>
      </div>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: accentHex }}>
        Open property file &nbsp;→
      </div>
    </Link>
  );
}

// =================================================================
// MT Naidoo Properties Hub
// =================================================================
export function MTNaidooPropertiesHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs trail={[{ to: '/cc/director', label: '3Wi' }, { label: 'MT Naidoo Properties' }]} />

      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: MTN_HEX }}>
          Property portfolio
        </div>
        <h1 className="text-3xl font-bold" style={{ color: MTN_HEX }}>MT Naidoo Properties</h1>
        <p className="text-sm text-slate-600 mt-1">
          Property assets held by MT Naidoo Properties. Each tile is one property's file —
          lease, tenant, rental income, opex, capex and valuation.
        </p>
      </div>

      {/* Portfolio summary KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-4xl">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-500">Properties</div>
          <div className="text-2xl font-bold text-slate-900">3</div>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-500">Occupied</div>
          <div className="text-2xl font-bold text-slate-900">TBC</div>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-500">Monthly rental</div>
          <div className="text-2xl font-bold text-slate-900">TBC</div>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-500">Total NAV</div>
          <div className="text-2xl font-bold text-slate-900">TBC</div>
        </div>
      </div>

      {/* Property tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <PropertyTile
          to="/tenants/mt-naidoo-properties/14-wellington-street"
          code="14WS" badgeBg="#1E40AF"
          address="14 Wellington Street"
          status="Coming soon"
          description="Tell Claude about this property — type (residential / commercial / mixed-use), suburb, current tenant or vacant, lease terms."
          accentHex="#1E40AF"
        />
        <PropertyTile
          to="/tenants/mt-naidoo-properties/mtnft-9-botanic-street"
          code="MTNFT-9" badgeBg="#015807"
          address="MTNFT-9 Botanic Street"
          status="Coming soon"
          description="Tell Claude about this property. The 'MTNFT-9' code suggests a unit number or sectional title — confirm the structure."
          accentHex="#015807"
        />
        <PropertyTile
          to="/tenants/mt-naidoo-properties/pd-grant-25-panorama-drive"
          code="PD-25" badgeBg="#7C3AED"
          address="PD Grant — 25 Panorama Drive"
          status="Coming soon"
          description="Tell Claude about this property. 'PD Grant' looks like a sectional title scheme or building name; 25 is the unit number — confirm."
          accentHex="#7C3AED"
        />
      </div>

      <div className="mt-6 max-w-4xl rounded-lg border border-slate-200 bg-white p-4">
        <div className="text-xs font-semibold text-slate-700 mb-1">Property file — standard contents</div>
        <p className="text-xs text-slate-600">
          Once a property tile is wired up, its file holds: title deed and erf details, current tenant and lease (start, end, rental escalation, deposit),
          monthly rental and arrears, operating expenses (rates, levies, maintenance, insurance, security), valuation history, capex schedule, and a photo gallery.
        </p>
      </div>

      {/* Hierarchy footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are</div>
        <div className="font-mono">
          3Wi → <span className="font-semibold" style={{ color: MTN_HEX }}>MT Naidoo Properties</span> → [14 Wellington Street | MTNFT-9 Botanic Street | PD Grant — 25 Panorama Drive]
        </div>
      </div>
    </Shell>
  );
}

// =================================================================
// Property placeholder template
// =================================================================
function PropertyPlaceholder({ slug, code, fullAddress, accentHex }: {
  slug: string;
  code: string;
  fullAddress: string;
  accentHex: string;
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-3xl mt-4">
        <Crumbs trail={[
          { to: '/cc/director', label: '3Wi' },
          { to: '/tenants/mt-naidoo-properties', label: 'MT Naidoo Properties' },
          { label: slug },
        ]} />
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center justify-center px-3 h-10 rounded-lg text-white text-xs font-mono font-bold" style={{ background: accentHex }}>
            {code}
          </span>
          <h1 className="text-3xl font-bold" style={{ color: accentHex }}>{slug}</h1>
        </div>
        <p className="text-sm text-slate-600 mt-1">{fullAddress}</p>

        {/* Quick-spec card */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Property type</div>
            <div className="text-sm text-slate-800">TBC — residential / commercial / mixed-use / industrial</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Current status</div>
            <div className="text-sm text-slate-800">TBC — occupied / vacant / under renovation</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Monthly rental</div>
            <div className="text-sm text-slate-800">R TBC</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Last valuation</div>
            <div className="text-sm text-slate-800">R TBC (date TBC)</div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude these property details and we'll build out the file:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li><b>Property type</b> — residential / commercial / mixed-use / industrial</li>
            <li><b>Title details</b> — erf number, scheme number (if sectional title), title deed reference</li>
            <li><b>Current tenant</b> — name, contact, lease start/end, monthly rental, escalation %, deposit</li>
            <li><b>Operating expenses</b> — typical monthly rates / levies / insurance / maintenance</li>
            <li><b>Bond / loan</b> — outstanding balance, bank, monthly instalment</li>
            <li><b>Last valuation</b> — amount, date, valuer</li>
            <li><b>Capex schedule</b> — planned renovations or upgrades</li>
            <li><b>Where do you track this today?</b> — Smartsheet, Excel, Property24, paper file, nothing</li>
          </ul>
          <p className="text-sm text-amber-900 mt-3">
            Once defined, this page becomes the full property file with rental tracker, arrears alerts, opex breakdown, and valuation history.
          </p>
        </div>
      </div>
    </Shell>
  );
}

// Concrete property pages
export const Property14WellingtonStreetPage = () => <PropertyPlaceholder
  slug="14 Wellington Street"
  code="14WS"
  fullAddress="14 Wellington Street (suburb, city — TBC)"
  accentHex="#1E40AF" />;

export const PropertyMTNFT9BotanicStreetPage = () => <PropertyPlaceholder
  slug="MTNFT-9 Botanic Street"
  code="MTNFT-9"
  fullAddress="Unit MTNFT-9, Botanic Street (suburb, city — TBC)"
  accentHex="#015807" />;

export const PropertyPDGrant25PanoramaPage = () => <PropertyPlaceholder
  slug="PD Grant — 25 Panorama Drive"
  code="PD-25"
  fullAddress="Unit 25, PD Grant, Panorama Drive (suburb, city — TBC)"
  accentHex="#7C3AED" />;
