/**
 * 3Wi Shared Services Hub.
 *
 * Reached from the Rainmaker division hub via the "3Wi Shared Services" tile.
 * Lists the five service-line businesses run under Shared Services:
 *   - Intelligent Capital   (financial advisory / capital raising)
 *   - Knockout Marketing    (marketing and creative agency)
 *   - Affinity Accounting   (bookkeeping and accounting practice)
 *   - UpSkill Training      (training and capacity building)
 *   - Maintenance Co        (maintenance services)
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  Rainmaker  ›  3Wi Shared Services
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

export function SharedServicesHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-3">
        <Link to="/cc/director" className="hover:underline">3Wi</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs/rainmaker" className="hover:underline">Rainmaker</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <span className="text-slate-900 font-semibold">3Wi Shared Services</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#0EA5A4] mb-1">
          Service group
        </div>
        <h1 className="text-3xl font-bold text-slate-900">3Wi Shared Services</h1>
        <p className="text-sm text-slate-600 mt-1">
          Five service-line businesses operating under the 3Wi Shared Services group. Choose a business to enter its workspace.
        </p>
      </div>

      {/* Five service-line tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">

        {/* Tile 1: Intelligent Capital */}
        <Link
          to="/tenants/ibs/rainmaker/3wi-shared-services/intelligent-capital"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-base font-bold">
              IC
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Coming soon</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Intelligent Capital</h2>
          <p className="text-xs text-slate-600 mb-3">
            Financial advisory, capital raising and investment structuring. Likely supports the other 3Wi businesses with funding strategy.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Capital raising</div>
            <div>• Investment advisory</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#015807] group-hover:underline">Open Intelligent Capital &nbsp;→</div>
        </Link>

        {/* Tile 2: Knockout Marketing */}
        <Link
          to="/tenants/ibs/rainmaker/3wi-shared-services/knockout-marketing"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#B45309] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#FDF31C]/40 text-[#B45309] text-base font-bold">
              KM
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Coming soon</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Knockout Marketing</h2>
          <p className="text-xs text-slate-600 mb-3">
            Marketing and creative agency. Brand, content, digital, and campaign services for IBS group and external clients.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Brand &amp; creative</div>
            <div>• Digital campaigns</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#B45309] group-hover:underline">Open Knockout Marketing &nbsp;→</div>
        </Link>

        {/* Tile 3: Affinity Accounting */}
        <Link
          to="/tenants/ibs/rainmaker/3wi-shared-services/affinity-accounting"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#3F1101] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#3F1101]/10 text-[#3F1101] text-base font-bold">
              AA
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Coming soon</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Affinity Accounting</h2>
          <p className="text-xs text-slate-600 mb-3">
            Bookkeeping and accounting practice. Monthly management accounts, tax, payroll, and SARS / CIPC compliance.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Bookkeeping &amp; tax</div>
            <div>• Payroll &amp; compliance</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#3F1101] group-hover:underline">Open Affinity Accounting &nbsp;→</div>
        </Link>

        {/* Tile 4: UpSkill Training */}
        <Link
          to="/tenants/ibs/rainmaker/3wi-shared-services/upskill-training"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#0EA5A4] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4] text-base font-bold">
              UT
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Coming soon</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">UpSkill Training</h2>
          <p className="text-xs text-slate-600 mb-3">
            Training and capacity-building. SETA-accredited learnerships, in-house workshops, and farmer / SMME training programmes.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Learnerships</div>
            <div>• Workshops &amp; mentoring</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#0EA5A4] group-hover:underline">Open UpSkill Training &nbsp;→</div>
        </Link>

        {/* Tile 5: Maintenance Co */}
        <Link
          to="/tenants/ibs/rainmaker/3wi-shared-services/maintenance-co"
          className="group block rounded-xl border-2 border-slate-200 hover:border-slate-500 bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-200 text-slate-700 text-base font-bold">
              MC
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Coming soon</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Maintenance Co</h2>
          <p className="text-xs text-slate-600 mb-3">
            Maintenance services. Facilities, equipment, vehicles and on-site support across the IBS group and external clients.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Facilities maintenance</div>
            <div>• Equipment &amp; vehicle service</div>
          </div>
          <div className="mt-3 text-sm font-semibold text-slate-700 group-hover:underline">Open Maintenance Co &nbsp;→</div>
        </Link>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → Rainmaker → <span className="font-semibold text-[#0EA5A4]">3Wi Shared Services</span> → [IC | KM | AA | UT | MC]
        </div>
      </div>
    </Shell>
  );
}

/**
 * Generic service-line placeholder. Re-used for all five businesses.
 */
export function ServiceLinePlaceholder({
  slug, fullName, description, accentHex, sampleServices,
}: {
  slug: string;
  fullName: string;
  description: string;
  accentHex: string;
  sampleServices: string[];
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-3xl mt-4">
        <nav className="text-xs text-slate-500 mb-3">
          <Link to="/cc/director" className="hover:underline">3Wi</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/rainmaker" className="hover:underline">Rainmaker</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/rainmaker/3wi-shared-services" className="hover:underline">3Wi Shared Services</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">{slug}</span>
        </nav>
        <h1 className="text-3xl font-bold mt-3" style={{ color: accentHex }}>{slug}</h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">{fullName}</p>

        <div className="rounded-lg border border-slate-200 bg-white p-5 mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Description</div>
          <p className="text-sm text-slate-800">{description}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Likely services offered</div>
          <ul className="text-sm text-slate-800 list-disc ml-4 space-y-1">
            {sampleServices.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>

        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude what {slug} offers in real life and how you want to track it:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li>Client list — who pays {slug} (other IBS divisions? external clients?)</li>
            <li>Service catalogue — what does {slug} actually deliver?</li>
            <li>Pricing model — flat fee, retainer, project, time-and-materials?</li>
            <li>Where do you currently track {slug} work? (Smartsheet, spreadsheet, nothing yet)</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}

// Concrete service-line exports
export const IntelligentCapitalPage = () => <ServiceLinePlaceholder
  slug="Intelligent Capital"
  fullName="Financial advisory and capital raising"
  description="Capital raising, investment structuring and financial advisory. Likely supports IBS Consulting clients (e.g. Hempire-EC) with grant-funding strategy, blended-finance deals, and investor introductions."
  sampleServices={[
    'Grant application strategy &amp; submissions',
    'Blended-finance structuring (grant + concessional + commercial)',
    'Investor introductions and capital raising',
    'Financial modelling and projections',
    'Due diligence support',
  ]}
  accentHex="#015807" />;

export const KnockoutMarketingPage = () => <ServiceLinePlaceholder
  slug="Knockout Marketing"
  fullName="Marketing and creative agency"
  description="Brand, content, digital marketing and campaign services. Provides creative output to IBS group businesses and external clients."
  sampleServices={[
    'Brand identity and design systems',
    'Website design and build',
    'Content production (copy, photo, video)',
    'Digital campaigns (paid, social, email)',
    'PR and stakeholder communications',
  ]}
  accentHex="#B45309" />;

export const AffinityAccountingPage = () => <ServiceLinePlaceholder
  slug="Affinity Accounting"
  fullName="Bookkeeping and accounting practice"
  description="Monthly bookkeeping, management accounts, tax, payroll, and SARS / CIPC compliance for IBS group entities and external SMME clients."
  sampleServices={[
    'Monthly bookkeeping and management accounts',
    'Provisional and annual tax submissions',
    'Payroll and SARS EMP201 / EMP501',
    'VAT registration and returns',
    'CIPC company secretarial returns',
    'Annual financial statements compilation',
  ]}
  accentHex="#3F1101" />;

export const UpSkillTrainingPage = () => <ServiceLinePlaceholder
  slug="UpSkill Training"
  fullName="Training and capacity building"
  description="SETA-accredited learnerships, in-house workshops, and farmer / SMME training. Likely delivers training inside Sunshines (grower onboarding) and to external corporate clients."
  sampleServices={[
    'SETA-accredited learnerships',
    'Farmer training (planting, harvest, post-harvest)',
    'Corporate workshops and short courses',
    'BBBEE-aligned skills development',
    'Train-the-trainer programmes',
  ]}
  accentHex="#0EA5A4" />;

export const MaintenanceCoPage = () => <ServiceLinePlaceholder
  slug="Maintenance Co"
  fullName="Maintenance services"
  description="Facilities, equipment, vehicle and on-site maintenance. Supports IBS group operations and provides services to external clients."
  sampleServices={[
    'Facilities and building maintenance',
    'Vehicle and fleet servicing',
    'Equipment installation and repair',
    'Preventive maintenance contracts',
    'Emergency call-out response',
  ]}
  accentHex="#475569" />;
