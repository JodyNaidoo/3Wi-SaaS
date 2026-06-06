/**
 * Hempire-EC Members Hub.
 *
 * Reached from the Hempire-EC client hub via the "Members" tile.
 * Splits the membership into two views:
 *   - Hubs                (aggregation / production / pack-house hubs)
 *   - Farmers / Growers   (the 46-grower register — links to /cc/growers)
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  IBS Consulting  ›  Hempire EC  ›  Members
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

export function MembersHub() {
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
        <span className="text-slate-900 font-semibold">Members</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#015807] mb-1">
          Member register
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Members</h1>
        <p className="text-sm text-slate-600 mt-1">
          Hempire-EC's enrolled membership. View the network of aggregation hubs or drill into the individual farmer / grower register.
        </p>
      </div>

      {/* Two tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">

        {/* Tile 1: Hubs */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/members/hubs"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#3F1101] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#3F1101]/10 text-[#3F1101] text-xl font-bold">
              H
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Coming soon
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Hubs</h2>
          <p className="text-sm text-slate-600 mb-3">
            Aggregation, production or pack-house hubs where Hempire-EC members work together. Each hub groups multiple growers and may host shared infrastructure.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Placeholder — tell Claude what a Hub is</div>
            <div>• Likely: location, manager, member count, services</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#3F1101] group-hover:underline">
            Open hubs register &nbsp;→
          </div>
        </Link>

        {/* Tile 2: Farmers / Growers — now opens Cohorts hub */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/members/cohorts"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-xl font-bold">
              FG
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              2 cohorts
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Farmers / Growers</h2>
          <p className="text-sm text-slate-600 mb-3">
            Growers split by Sunshines Project cohort. Choose Seedling Cohort 1 (ECRDA, live) or Seed Cohort 2 (DSBD, planned).
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Seedling Cohort 1 — 46 growers, R 536 589,80</div>
            <div>• Seed Cohort 2 — growers TBC, R 1 600 000 envelope</div>
            <div>• Per-cohort disbursement &amp; reporting</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#015807] group-hover:underline">
            Choose a cohort &nbsp;→
          </div>
        </Link>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → IBS Consulting → Hempire EC → <span className="font-semibold text-[#015807]">Members</span> → [Hubs | Farmers / Growers]
        </div>
      </div>
    </Shell>
  );
}

/**
 * Hubs placeholder page.
 */
export function HubsPlaceholder() {
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
          <Link to="/tenants/ibs/consulting/hempire-ec/members" className="hover:underline">Members</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">Hubs</span>
        </nav>
        <h1 className="text-3xl font-bold mt-3 text-slate-900">Hubs</h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          Placeholder page for Hempire-EC's hub network.
        </p>

        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude what a Hub is in your context. Common patterns in agri-programmes:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li><b>Aggregation hub</b> — where growers deliver produce for grading and onward sale</li>
            <li><b>Pack-house / processing hub</b> — drying, decortication, primary processing</li>
            <li><b>Training / extension hub</b> — where workshops and on-farm support are coordinated</li>
            <li><b>Co-operative</b> — formal entity that groups individual growers</li>
            <li><b>District depot</b> — Hempire-EC's own physical presence in each EC district</li>
          </ul>
          <p className="text-sm text-amber-900 mt-3">
            Once you tell me, I can build the Hubs register — fields like name, district, type, manager, member count, services offered, GPS, photos.
          </p>
        </div>
      </div>
    </Shell>
  );
}
