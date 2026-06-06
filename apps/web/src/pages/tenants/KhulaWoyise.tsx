/**
 * Khula Woyise Investments — Portfolio Hub.
 *
 * Khula Woyise is the investment vehicle holding stakes in 8 entities.
 * Three of those (Wellies, IBS, Knockout Marketing) are ALSO accessible
 * elsewhere in the SaaS — those tiles deep-link to the existing pages
 * rather than duplicating them. Five are new placeholders.
 *
 *   - High Rollerz                 (new placeholder)
 *   - Lesemba Gallery              (new placeholder)
 *   - Cell Max                     (new placeholder)
 *   - Signature Coffee Co          (new placeholder)
 *   - Thabo's Tutoring Centre      (new placeholder)
 *   - Wellies                      (cross-link → /tenants/wellies)
 *   - Knockout Marketing           (cross-link → IBS Rainmaker shared services)
 *   - IBS                          (cross-link → /tenants/ibs)
 *
 * Breadcrumb:
 *   3Wi  ›  Khula Woyise
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

const KHULA_HEX = '#015807';

/** Compact portfolio tile. */
function PortfolioTile({
  to, external, badge, badgeBg, title, status, statusKind = 'amber',
  description, hold, accentHex, crossLink,
}: {
  to: string;
  external?: boolean;
  badge: string;
  badgeBg: string;
  title: string;
  status: string;
  statusKind?: 'amber' | 'emerald' | 'slate';
  description: string;
  hold: string;
  accentHex: string;
  crossLink?: boolean;
}) {
  const statusClass = statusKind === 'emerald'
    ? 'bg-emerald-100 text-emerald-800'
    : statusKind === 'slate'
    ? 'bg-slate-100 text-slate-700'
    : 'bg-amber-100 text-amber-800';
  const inner = (
    <>
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-base font-bold text-white"
          style={{ background: badgeBg }}
        >
          {badge}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass}`}>{status}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">
        {title}
        {crossLink ? <span className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 align-middle">cross-link</span> : null}
      </h2>
      <p className="text-xs text-slate-600 mb-3">{description}</p>
      <div className="text-xs text-slate-500">
        <span className="font-semibold">Holding:</span> {hold}
      </div>
      <div className="mt-3 text-sm font-semibold group-hover:underline" style={{ color: accentHex }}>
        Open {title} &nbsp;→
      </div>
    </>
  );
  const className =
    'group block rounded-xl border-2 border-slate-200 bg-white p-6 transition-all hover:shadow-md';
  const styleHover = (e: React.MouseEvent<HTMLAnchorElement>, on: boolean) => {
    (e.currentTarget as HTMLElement).style.borderColor = on ? accentHex : '';
  };
  return external ? (
    <a href={to} target="_blank" rel="noreferrer"
       className={className}
       onMouseEnter={(e) => styleHover(e, true)}
       onMouseLeave={(e) => styleHover(e, false)}>
      {inner}
    </a>
  ) : (
    <Link to={to}
       className={className}
       onMouseEnter={(e) => styleHover(e, true)}
       onMouseLeave={(e) => styleHover(e, false)}>
      {inner}
    </Link>
  );
}

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

// =================================================================
// Khula Woyise Hub — 8 portfolio companies
// =================================================================
export function KhulaWoyiseHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <Crumbs trail={[{ to: '/cc/director', label: '3Wi' }, { label: 'Khula Woyise' }]} />

      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: KHULA_HEX }}>
          Investment vehicle
        </div>
        <h1 className="text-3xl font-bold" style={{ color: KHULA_HEX }}>Khula Woyise Investments</h1>
        <p className="text-sm text-slate-600 mt-1">
          Investment holding company. The eight portfolio entities below are entities in which Khula Woyise holds an equity stake.
          Entities marked <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">cross-link</span> have their full operational view elsewhere in the SaaS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">

        <PortfolioTile
          to="/tenants/khula-woyise/high-rollerz"
          badge="HR" badgeBg="#7C3AED"
          title="High Rollerz" status="Coming soon"
          description="Tell Claude what High Rollerz is — sector, products, geography."
          hold="Equity stake (%) TBC"
          accentHex="#7C3AED"
        />

        <PortfolioTile
          to="/tenants/khula-woyise/lesemba-gallery"
          badge="LG" badgeBg="#DC2626"
          title="Lesemba Gallery" status="Coming soon"
          description="Likely art gallery / curatorial business. Confirm sector and how to track it."
          hold="Equity stake (%) TBC"
          accentHex="#DC2626"
        />

        <PortfolioTile
          to="/tenants/khula-woyise/cell-max"
          badge="CM" badgeBg="#0EA5A4"
          title="Cell Max" status="Coming soon"
          description="Sounds like telecom / cellular retail. Confirm what Cell Max actually does."
          hold="Equity stake (%) TBC"
          accentHex="#0EA5A4"
        />

        <PortfolioTile
          to="/tenants/khula-woyise/signature-coffee-co"
          badge="SC" badgeBg="#92400E"
          title="Signature Coffee Co" status="Coming soon"
          description="Coffee retail / hospitality. Confirm number of outlets and locations."
          hold="Equity stake (%) TBC"
          accentHex="#92400E"
        />

        <PortfolioTile
          to="/tenants/khula-woyise/thabos-tutoring-centre"
          badge="TT" badgeBg="#1E40AF"
          title="Thabo's Tutoring Centre" status="Coming soon"
          description="Education / tutoring business. Confirm subjects, levels, and student volume."
          hold="Equity stake (%) TBC"
          accentHex="#1E40AF"
        />

        {/* CROSS-LINKS — these tiles take you to entities that exist elsewhere in the SaaS */}
        <PortfolioTile
          to="/tenants/wellies"
          badge="WL" badgeBg="#B45309"
          title="Wellies" status="Active" statusKind="emerald" crossLink
          description="Beverage business — Wellies Water, Euphoria Beverages, Personalised Labels. Full operational hub already built."
          hold="Equity stake (%) TBC"
          accentHex="#B45309"
        />

        <PortfolioTile
          to="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing"
          badge="KM" badgeBg="#B45309"
          title="Knockout Marketing" status="Coming soon" crossLink
          description="Marketing and creative agency. Also part of IBS → Rainmaker → 3Wi Shared Services."
          hold="Equity stake (%) TBC"
          accentHex="#B45309"
        />

        <PortfolioTile
          to="/tenants/ibs"
          badge="IBS" badgeBg="#3F1101"
          title="IBS" status="Active" statusKind="emerald" crossLink
          description="IBS Consulting (Hempire-EC, Sunshines, MSCEC) and Rainmaker (3Wi Shared Services). Fully built out."
          hold="Equity stake (%) TBC"
          accentHex="#3F1101"
        />
      </div>

      {/* Cross-link explainer */}
      <div className="mt-6 max-w-6xl rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="text-xs font-semibold text-blue-900 mb-1">About cross-links</div>
        <p className="text-xs text-blue-900">
          Wellies, Knockout Marketing, and IBS are also accessible directly from the Director Command Centre (they are operating tenants in their own right).
          Within Khula Woyise they represent investment holdings, so the tile shows the same entity from a "portfolio" perspective.
          When you click a cross-link tile, you land on the existing operational hub — no duplicate data.
        </p>
      </div>

      {/* Hierarchy footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are</div>
        <div className="font-mono">
          3Wi → <span className="font-semibold" style={{ color: KHULA_HEX }}>Khula Woyise</span> → [High Rollerz | Lesemba Gallery | Cell Max | Signature Coffee Co | Thabo's | <i>Wellies, Knockout Marketing, IBS (cross-link)</i>]
        </div>
      </div>
    </Shell>
  );
}

// =================================================================
// Placeholder template for new portfolio entities
// =================================================================
function PortfolioPlaceholder({ slug, sector, description, accentHex, sampleStructure }: {
  slug: string;
  sector: string;
  description: string;
  accentHex: string;
  sampleStructure: string[];
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-3xl mt-4">
        <Crumbs trail={[
          { to: '/cc/director', label: '3Wi' },
          { to: '/tenants/khula-woyise', label: 'Khula Woyise' },
          { label: slug },
        ]} />
        <h1 className="text-3xl font-bold mt-3" style={{ color: accentHex }}>{slug}</h1>
        <p className="text-sm text-slate-600 mt-1">{sector}</p>
        <p className="text-sm text-slate-700 mt-3">{description}</p>

        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Likely sub-structure</div>
          <ul className="text-sm text-slate-800 list-disc ml-4 space-y-1">
            {sampleStructure.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>

        <div className="mt-5 rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude how to structure {slug}:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li>Sector and core offering</li>
            <li>Geographic footprint</li>
            <li>Sub-units (outlets, divisions, products)</li>
            <li>Where is the operational data tracked currently?</li>
            <li>Khula Woyise equity stake (%)</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}

export const HighRollerzPage = () => <PortfolioPlaceholder
  slug="High Rollerz"
  sector="Sector TBC"
  description="Tell Claude what High Rollerz does. Common interpretations: lifestyle / entertainment brand, mobility services, luxury retail."
  sampleStructure={['Product / service lines', 'Customer base', 'Locations / outlets', 'Operations team', 'Marketing channels']}
  accentHex="#7C3AED" />;

export const LesembaGalleryPage = () => <PortfolioPlaceholder
  slug="Lesemba Gallery"
  sector="Art gallery / curatorial (sector TBC)"
  description="Likely an art gallery or curatorial business. Tell Claude what Lesemba Gallery's primary business is — exhibitions, sales, artist representation, framing, prints."
  sampleStructure={['Artist roster', 'Active exhibitions', 'Inventory of works', 'Sales pipeline / commissions', 'Events calendar']}
  accentHex="#DC2626" />;

export const CellMaxPage = () => <PortfolioPlaceholder
  slug="Cell Max"
  sector="Telecom / cellular (sector TBC)"
  description="Sounds like a cellular retail or telecom services business. Confirm Cell Max's actual offering — retail stores, service contracts, repairs, etc."
  sampleStructure={['Outlet network', 'SIM / handset inventory', 'Service contracts', 'Repair queue', 'Vendor relationships (Vodacom, MTN, etc.)']}
  accentHex="#0EA5A4" />;

export const SignatureCoffeeCoPage = () => <PortfolioPlaceholder
  slug="Signature Coffee Co"
  sector="Coffee retail / hospitality"
  description="Coffee retail business — likely a chain of coffee shops or single signature outlet. Possibly linked to Wellies signature retail given the shared 'signature' name."
  sampleStructure={['Outlet network and locations', 'Daily takings per outlet', 'Menu and pricing', 'Stock and supply chain (beans, milk, supplies)', 'Staff and shifts']}
  accentHex="#92400E" />;

export const ThabosTutoringPage = () => <PortfolioPlaceholder
  slug="Thabo's Tutoring Centre"
  sector="Education / tutoring"
  description="Tutoring business. Tell Claude the model — group classes, one-on-one, online, in-person, school subjects, university prep, professional certifications."
  sampleStructure={['Subject areas and grade levels', 'Tutor roster and qualifications', 'Student register', 'Class scheduling and attendance', 'Fees and payment tracking']}
  accentHex="#1E40AF" />;
