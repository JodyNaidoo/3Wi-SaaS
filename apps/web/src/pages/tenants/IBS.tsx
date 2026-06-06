/**
 * IBS Tenant Hub.
 *
 * Reached from the Director Command Centre "Open IBS workspace" button.
 * Presents IBS's two divisions as large tile buttons:
 *   - IBS Consulting   (revenue from advisory work, incl. Hempire-EC)
 *   - Rainmaker        (IBS's second product line)
 *
 * Each tile is fully clickable, accessible, and routes to its own
 * sub-page or external workspace.
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

export function IBSHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      {/* Page header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
          Tenant
        </div>
        <h1 className="text-3xl font-bold text-slate-900">IBS</h1>
        <p className="text-sm text-slate-600 mt-1">
          Choose a division to enter. Each division is a separate revenue centre with its own clients, projects, and reporting.
        </p>
      </div>

      {/* Two division tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">

        {/* Tile 1: IBS Consulting — now an internal hub */}
        <Link
          to="/tenants/ibs/consulting"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-2xl font-bold">
              IC
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">IBS Consulting</h2>
          <p className="text-sm text-slate-600 mb-3">
            Advisory engagements and grant-funded projects. Currently delivering MSCEC and Hempire-EC.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Clients · Projects · Disbursements</div>
            <div>• PMO &amp; reporting workstreams</div>
            <div>• Revenue centre performance tracker</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#015807] group-hover:underline">
            Choose a client &nbsp;→
          </div>
        </Link>

        {/* Tile 2: Rainmaker */}
        <Link
          to="/tenants/ibs/rainmaker"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#0EA5A4] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4] text-2xl font-bold">
              RM
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Coming soon
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Rainmaker</h2>
          <p className="text-sm text-slate-600 mb-3">
            IBS's second division. Tell Claude what Rainmaker does and where it should link — this tile is ready to be wired up.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Placeholder — destination not yet set</div>
            <div>• Replace with a dashboard, Smartsheet folder, or external app</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#0EA5A4] group-hover:underline">
            Open Rainmaker &nbsp;→
          </div>
        </Link>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where this sits in the hierarchy</div>
        <div className="font-mono">
          3Wi PTY Ltd <span className="text-slate-400">→</span> <span className="font-semibold text-slate-900">IBS</span> <span className="text-slate-400">→</span> [IBS Consulting | Rainmaker] <span className="text-slate-400">→</span> Client <span className="text-slate-400">→</span> Project
        </div>
      </div>
    </Shell>
  );
}

/**
 * Rainmaker placeholder page.
 * Lives in the same file for now. Move out into its own file once the
 * real Rainmaker workflow is defined.
 */
export function RainmakerPlaceholder() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-2xl mt-4">
        <Link to="/tenants/ibs" className="text-sm text-slate-600 hover:underline">&larr; Back to IBS</Link>
        <h1 className="text-3xl font-bold mt-3 text-slate-900">Rainmaker</h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          This is the placeholder page for IBS's Rainmaker division.
        </p>

        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude what Rainmaker is and where this button should take you. Options:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li>A separate Smartsheet folder (paste the URL)</li>
            <li>An external app (e.g. CRM, project tool)</li>
            <li>A built-in Rainmaker dashboard inside this SaaS</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}
