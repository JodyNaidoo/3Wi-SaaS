/**
 * Rainmaker Division Hub.
 *
 * Reached from the IBS tenant hub via the "Rainmaker" tile.
 * Currently houses one product line:
 *   - 3Wi Shared Services  (back-office services — bookkeeping, IT,
 *                            HR, legal advisory etc. — shared across
 *                            IBS divisions and possibly external clients)
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  Rainmaker
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

export function RainmakerHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-3">
        <Link to="/cc/director" className="hover:underline">3Wi</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <span className="text-slate-900 font-semibold">Rainmaker</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#0EA5A4] mb-1">
          Division
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Rainmaker</h1>
        <p className="text-sm text-slate-600 mt-1">
          IBS's second division. Choose a product line to enter its workspace.
        </p>
      </div>

      {/* One tile — single product line for now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">

        {/* Tile: 3Wi Shared Services */}
        <Link
          to="/tenants/ibs/rainmaker/3wi-shared-services"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#0EA5A4] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4] text-base font-bold">
              3Wi
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Coming soon
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">3Wi Shared Services</h2>
          <p className="text-sm text-slate-600 mb-3">
            Centralised back-office services — finance, IT, HR, legal, and other corporate functions — shared across IBS divisions and offered to external clients.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Tell Claude what services 3Wi Shared Services delivers</div>
            <div>• Likely: bookkeeping, payroll, IT, legal, secretarial</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#0EA5A4] group-hover:underline">
            Open 3Wi Shared Services &nbsp;→
          </div>
        </Link>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → <span className="font-semibold text-[#0EA5A4]">Rainmaker</span> → 3Wi Shared Services → (services)
        </div>
      </div>
    </Shell>
  );
}

/**
 * 3Wi Shared Services placeholder page.
 */
export function SharedServicesPlaceholder() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-2xl mt-4">
        <nav className="text-xs text-slate-500 mb-3">
          <Link to="/cc/director" className="hover:underline">3Wi</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/rainmaker" className="hover:underline">Rainmaker</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">3Wi Shared Services</span>
        </nav>
        <h1 className="text-3xl font-bold mt-3 text-slate-900">3Wi Shared Services</h1>
        <p className="text-sm text-slate-600 mt-1">
          Centralised back-office services offered by 3Wi PTY Ltd across the IBS group and to external clients.
        </p>

        <div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude which service lines 3Wi Shared Services delivers. Common back-office shared services include:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li><b>Finance &amp; Accounting</b> — bookkeeping, payroll, tax, management accounts</li>
            <li><b>IT &amp; Systems</b> — infrastructure, helpdesk, software licences, security</li>
            <li><b>HR</b> — recruitment, contracts, performance, training</li>
            <li><b>Legal &amp; Compliance</b> — contracts, IP, regulatory, POPIA</li>
            <li><b>Company Secretarial</b> — board minutes, CIPC, shareholder records</li>
            <li><b>Procurement</b> — vendor management, sourcing, contract negotiation</li>
          </ul>
          <p className="text-sm text-amber-900 mt-3">
            Once defined, each service line becomes its own tile here (similar to PSC's funder tiles). Each tile can lead to a service-specific dashboard, ticketing queue, or Smartsheet workspace.
          </p>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          <span className="font-semibold">Tip:</span> If 3Wi Shared Services serves external clients too, those clients
          (e.g. "ABC Manufacturing", "XYZ Consulting") would sit one level deeper under their respective service lines —
          mirroring the IBS Consulting → Hempire EC pattern you've already built.
        </div>
      </div>
    </Shell>
  );
}
