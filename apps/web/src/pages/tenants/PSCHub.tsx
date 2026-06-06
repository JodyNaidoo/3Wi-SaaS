/**
 * Project Steering Committee (PSC) Hub.
 *
 * Reached from the Hempire-EC client hub via the "PSC" tile.
 * The PSC is composed of representatives from five South African
 * government departments and agencies. Each tile represents one of them.
 *
 *   - DEDEAT  Provincial: Economic Development, Environmental Affairs & Tourism
 *   - ECDC    Provincial SOC: Eastern Cape Development Corporation
 *   - SEDFA   National: Small Enterprise Development & Finance Agency
 *   - ECRDA   Provincial SOC: Eastern Cape Rural Development Agency (live funder)
 *   - DSBD    National: Department of Small Business Development
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  IBS Consulting  ›  Hempire EC  ›  PSC
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

export function PSCHub() {
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
        <span className="text-slate-900 font-semibold">PSC</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#3F1101] mb-1">
          Governance
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Project Steering Committee</h1>
        <p className="text-sm text-slate-600 mt-1">
          The PSC is composed of representatives from five South African government departments and agencies. Choose a member to enter their workspace.
        </p>
      </div>

      {/* Five funder tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">

        {/* Tile: DEDEAT */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/psc/dedeat"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#3F1101] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#3F1101]/10 text-[#3F1101] text-sm font-bold">
              DEDEAT
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Coming soon</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">DEDEAT</h2>
          <p className="text-xs text-slate-600 mb-3">
            Eastern Cape Department of Economic Development, Environmental Affairs and Tourism.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Provincial policy &amp; economic dev</div>
            <div>• Environmental compliance</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#3F1101] group-hover:underline">Open DEDEAT &nbsp;→</div>
        </Link>

        {/* Tile: ECDC */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/psc/ecdc"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-base font-bold">
              ECDC
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Coming soon</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">ECDC</h2>
          <p className="text-xs text-slate-600 mb-3">
            Eastern Cape Development Corporation — provincial SOC for investment promotion and SMME funding.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Investment promotion</div>
            <div>• Business funding &amp; support</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#015807] group-hover:underline">Open ECDC &nbsp;→</div>
        </Link>

        {/* Tile: SEDFA */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/psc/sedfa"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#0EA5A4] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4] text-base font-bold">
              SEDFA
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Coming soon</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">SEDFA</h2>
          <p className="text-xs text-slate-600 mb-3">
            Small Enterprise Development &amp; Finance Agency — national, formed from the merger of SEFA and SEDA.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• SMME finance</div>
            <div>• Business development support</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#0EA5A4] group-hover:underline">Open SEDFA &nbsp;→</div>
        </Link>

        {/* Tile: ECRDA — live, links to existing dashboard */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/psc/ecrda"
          className="group block rounded-xl border-2 border-[#015807]/40 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-base font-bold">
              ECRDA
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">Active funder</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">ECRDA</h2>
          <p className="text-xs text-slate-600 mb-3">
            Eastern Cape Rural Development Agency — funder of Sunshines Project Part 1 (Seedlings Cohort).
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• R 3 200 000 envelope (Part 1)</div>
            <div>• 46 growers · live POP dashboard</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#015807] group-hover:underline">Open ECRDA dashboard &nbsp;→</div>
        </Link>

        {/* Tile: DSBD */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/psc/dsbd"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#B45309] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#FDF31C]/40 text-[#7B5500] text-base font-bold">
              DSBD
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Part 2 funder</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">DSBD</h2>
          <p className="text-xs text-slate-600 mb-3">
            Department of Small Business Development — national funder of Sunshines Project Part 2 (DSBD Seed Cohort).
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• R 1 600 000 envelope (Part 2)</div>
            <div>• Growers TBC</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#B45309] group-hover:underline">Open DSBD &nbsp;→</div>
        </Link>
      </div>

      {/* Quick links — back to detailed PSC working dashboard */}
      <div className="mt-6 max-w-6xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          PSC working surfaces (decisions, budget, risks)
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/cc/psc"             className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">PSC dashboard (Part 1 budget)</Link>
          <Link to="/cc/growers"         className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Growers register</Link>
          <Link to="/cc/authorisations"  className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Release batches</Link>
        </div>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → IBS Consulting → Hempire EC → <span className="font-semibold text-[#3F1101]">PSC</span> → [DEDEAT | ECDC | SEDFA | ECRDA | DSBD]
        </div>
      </div>
    </Shell>
  );
}

/**
 * Generic funder placeholder. Renders a stub page with the funder name.
 * Used for DEDEAT, ECDC, SEDFA, DSBD (ECRDA has its own live dashboard).
 */
export function FunderPlaceholder({ slug, fullName, role }: { slug: string; fullName: string; role: string }) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-2xl mt-4">
        <nav className="text-xs text-slate-500 mb-3">
          <Link to="/cc/director" className="hover:underline">3Wi</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/consulting" className="hover:underline">IBS Consulting</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/consulting/hempire-ec" className="hover:underline">Hempire EC</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/consulting/hempire-ec/psc" className="hover:underline">PSC</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">{slug}</span>
        </nav>
        <h1 className="text-3xl font-bold mt-3 text-slate-900">{slug}</h1>
        <p className="text-sm text-slate-600 mt-1">{fullName}</p>
        <p className="text-sm text-slate-500 mt-1 italic">{role}</p>

        <div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude what this PSC member's workspace should contain. Common options:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li>A read-only dashboard with their funded projects, contributions, and POPs</li>
            <li>A submission form (similar to ECRDA's offtaker checklist)</li>
            <li>An external link to their official website or portal</li>
            <li>A Smartsheet workspace for their representatives</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}

// Concrete placeholder exports — one per funder
export const DEDEATPage = () => <FunderPlaceholder
  slug="DEDEAT"
  fullName="Eastern Cape Department of Economic Development, Environmental Affairs and Tourism"
  role="Provincial policy framework and environmental compliance" />;

export const ECDCPage = () => <FunderPlaceholder
  slug="ECDC"
  fullName="Eastern Cape Development Corporation"
  role="Provincial state-owned company — investment promotion and SMME funding" />;

export const SEDFAPage = () => <FunderPlaceholder
  slug="SEDFA"
  fullName="Small Enterprise Development and Finance Agency"
  role="National agency — SMME finance and business development support" />;

export const DSBDPage = () => <FunderPlaceholder
  slug="DSBD"
  fullName="Department of Small Business Development"
  role="National department — funder of Sunshines Project Part 2 (DSBD Seed Cohort)" />;
