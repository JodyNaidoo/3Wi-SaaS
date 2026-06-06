/**
 * Sunshines Cohorts Hub.
 *
 * Reached from the Members hub via the "Farmers / Growers" tile.
 * Splits the grower base by the project Part they're enrolled in:
 *   - Seedling Cohort 1   (Part 1 — ECRDA-funded, 46 growers, LIVE)
 *   - Seed Cohort 2       (Part 2 — DSBD-funded, growers TBC, placeholder)
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  IBS Consulting  ›  Hempire EC  ›  Members  ›  Farmers / Growers
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

export function CohortsHub() {
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
        <Link to="/tenants/ibs/consulting/hempire-ec/members" className="hover:underline">Members</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <span className="text-slate-900 font-semibold">Farmers / Growers</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#015807] mb-1">
          Sunshines Cohorts
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Farmers / Growers</h1>
        <p className="text-sm text-slate-600 mt-1">
          The Sunshines Project is split into two parts, each with its own funded cohort. Choose a cohort to enter its register.
        </p>
      </div>

      {/* Two cohort tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">

        {/* Tile 1: Seedling Cohort 1 — Part 1, ECRDA-funded, LIVE */}
        <Link
          to="/cc/growers"
          className="group block rounded-xl border-2 border-[#015807]/40 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-xl font-bold">
              SC1
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              46 enrolled · live
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Seedling Cohort 1</h2>
          <p className="text-sm text-slate-600 mb-3">
            Sunshines Project <b>Part 1</b> — Seedlings Cohort. Funded by ECRDA. 46 growers across six Eastern Cape districts.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Funder: <span className="font-semibold text-[#015807]">ECRDA</span></div>
            <div>• Envelope: R 3 200 000 (Part 1 allocation)</div>
            <div>• Disbursement: R 536 589,80 across 46 growers</div>
            <div>• Rate: R 10 968,72 per Ha (mech + labour)</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#015807] group-hover:underline">
            Open Seedling Cohort 1 register &nbsp;→
          </div>
        </Link>

        {/* Tile 2: Seed Cohort 2 — Part 2, DSBD-funded, placeholder */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/members/cohorts/seed-cohort-2"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#B45309] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#FDF31C]/40 text-[#7B5500] text-xl font-bold">
              SC2
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Growers TBC
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Seed Cohort 2</h2>
          <p className="text-sm text-slate-600 mb-3">
            Sunshines Project <b>Part 2</b> — DSBD Seed Cohort. Funded by the Department of Small Business Development. Growers not yet enrolled.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Funder: <span className="font-semibold text-[#B45309]">DSBD</span></div>
            <div>• Envelope: R 1 600 000 (Part 2 allocation)</div>
            <div>• Disbursement: pending — growers TBC</div>
            <div>• Cohort enrolment: planned 2026</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#B45309] group-hover:underline">
            Open Seed Cohort 2 placeholder &nbsp;→
          </div>
        </Link>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → IBS Consulting → Hempire EC → Members → <span className="font-semibold text-[#015807]">Farmers / Growers</span> → [Seedling Cohort 1 | Seed Cohort 2]
        </div>
      </div>
    </Shell>
  );
}

/**
 * Seed Cohort 2 placeholder page.
 */
export function SeedCohort2Placeholder() {
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
          <Link to="/tenants/ibs/consulting/hempire-ec/members/cohorts" className="hover:underline">Farmers / Growers</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">Seed Cohort 2</span>
        </nav>
        <h1 className="text-3xl font-bold mt-3 text-slate-900">Seed Cohort 2</h1>
        <p className="text-sm text-slate-600 mt-1">
          Sunshines Project Part 2 — DSBD-funded.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase">Funder</div>
            <div className="text-lg font-bold text-[#B45309]">DSBD</div>
            <div className="text-xs text-slate-500">Department of Small Business Development</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase">Envelope</div>
            <div className="text-lg font-bold text-slate-900">R 1 600 000</div>
            <div className="text-xs text-slate-500">Part 2 allocation</div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Growers not yet enrolled</div>
          <p className="text-sm text-amber-900">
            Seed Cohort 2 is the DSBD-funded portion of the Sunshines Project. Once growers are recruited and the cohort is opened, this page becomes the register — same shape as Seedling Cohort 1, with district / coordinator filters and per-grower disbursement status.
          </p>
          <p className="text-sm text-amber-900 mt-2">
            Tell Claude when you have:
          </p>
          <ul className="text-sm text-amber-900 mt-1 ml-4 list-disc">
            <li>The cohort size (number of growers planned)</li>
            <li>The disbursement rate (or formula) per grower</li>
            <li>The geography (which districts / municipalities)</li>
            <li>The expected enrolment date</li>
          </ul>
          <p className="text-sm text-amber-900 mt-2">
            Once that's defined I'll seed Part 2 records into the database and this tile becomes "n enrolled · live", just like Seedling Cohort 1.
          </p>
        </div>
      </div>
    </Shell>
  );
}
