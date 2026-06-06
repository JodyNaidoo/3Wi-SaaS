/**
 * Hempire-EC Offtakers Hub.
 *
 * Reached from the Hempire-EC client hub via the "Off takers" tile.
 * Splits the offtaker pool by product category from the hemp value chain:
 *   - Flower          (dried flower for CBD/CBG extraction + premium)
 *   - Seed / Grain    (hempseed for food or oil)
 *   - Textile Fibres  (bast fibre for clothing, paper, etc.)
 *   - Industrial Fibres (hurd / shiv for construction, animal bedding)
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  IBS Consulting  ›  Hempire EC  ›  Off takers
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

const SMARTSHEET_URL = 'https://app.smartsheet.eu/sheets/CCjj6QrG222hJxWG7VQqhPfv8fxhVvhGP2gJcc81';

export function OfftakersHub() {
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
        <span className="text-slate-900 font-semibold">Off takers</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#B45309] mb-1">
          Buyer pool
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Off takers</h1>
        <p className="text-sm text-slate-600 mt-1">
          Vetted pool of prospective hemp offtakers split by product category from the value chain.
          Each tile filters the master Smartsheet to offtakers who buy that category.
        </p>
      </div>

      {/* Four offtaker category tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">

        {/* Tile 1: Flower */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/offtakers/flower"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-xl font-bold">
              FL
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Building pool
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Flower</h2>
          <p className="text-sm text-slate-600 mb-3">
            Dried hemp flower for CBD / CBG extraction and premium direct-sale grade. The highest-value product per hectare.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Buyers: extractors, pharmacies, dispensaries</div>
            <div>• Typical pricing: R/kg</div>
            <div>• Quality req: THC &lt; 0,3% · COA · moisture spec</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#015807] group-hover:underline">
            Open flower buyer pool &nbsp;→
          </div>
        </Link>

        {/* Tile 2: Seed / Grain */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/offtakers/seed-grain"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#7B5500] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#FDF31C]/40 text-[#7B5500] text-xl font-bold">
              SG
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Building pool
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Seed / Grain</h2>
          <p className="text-sm text-slate-600 mb-3">
            Whole hempseed for food (hearts, milk) and cold-pressed oil. Food-grade quality requirements.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Buyers: food processors, oil pressers, health brands</div>
            <div>• Typical pricing: R/tonne</div>
            <div>• Quality req: HACCP · GAP · germination</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#7B5500] group-hover:underline">
            Open seed / grain buyer pool &nbsp;→
          </div>
        </Link>

        {/* Tile 3: Textile Fibres */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/offtakers/textile-fibres"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#0EA5A4] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4] text-xl font-bold">
              TF
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Building pool
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Textile Fibres</h2>
          <p className="text-sm text-slate-600 mb-3">
            Bast fibre from the outer hemp stalk — long, soft fibres for textiles, paper, rope, and composite applications.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Buyers: textile mills, paper producers, fashion brands</div>
            <div>• Typical pricing: R/tonne</div>
            <div>• Quality req: retting · fibre length · cleanliness</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#0EA5A4] group-hover:underline">
            Open textile fibres buyer pool &nbsp;→
          </div>
        </Link>

        {/* Tile 4: Industrial Fibres */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/offtakers/industrial-fibres"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#3F1101] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#3F1101]/10 text-[#3F1101] text-xl font-bold">
              IF
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Building pool
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Industrial Fibres</h2>
          <p className="text-sm text-slate-600 mb-3">
            Hurd / shiv — the woody inner core of the hemp stalk. Used in hempcrete, animal bedding, insulation, and bioplastics.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Buyers: construction firms, hempcrete makers, automotive</div>
            <div>• Typical pricing: R/tonne</div>
            <div>• Quality req: particle size · moisture · dust-free</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#3F1101] group-hover:underline">
            Open industrial fibres buyer pool &nbsp;→
          </div>
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-6 max-w-5xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Master register (all offtakers, all categories)
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={SMARTSHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-700"
          >
            Open master Smartsheet (80 columns)
          </a>
        </div>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi → IBS → IBS Consulting → Hempire EC → <span className="font-semibold text-[#B45309]">Off takers</span> → [Flower | Seed/Grain | Textile Fibres | Industrial Fibres]
        </div>
      </div>
    </Shell>
  );
}

/**
 * Generic offtaker-category placeholder.
 * Re-used for all four categories. Each one shows the category-specific
 * profile + a link to the filtered Smartsheet view (once you set up the
 * Smartsheet reports).
 */
export function OfftakerCategoryPage({
  slug, fullName, description, buyers, qualitySpec, accentHex,
}: {
  slug: string;
  fullName: string;
  description: string;
  buyers: string;
  qualitySpec: string;
  accentHex: string;
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-3xl mt-4">
        <nav className="text-xs text-slate-500 mb-3">
          <Link to="/cc/director" className="hover:underline">3Wi</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/consulting" className="hover:underline">IBS Consulting</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/consulting/hempire-ec" className="hover:underline">Hempire EC</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <Link to="/tenants/ibs/consulting/hempire-ec/offtakers" className="hover:underline">Off takers</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">{slug}</span>
        </nav>
        <h1 className="text-3xl font-bold mt-3" style={{ color: accentHex }}>{slug}</h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Typical buyers</div>
            <div className="text-sm text-slate-800">{buyers}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Quality specification</div>
            <div className="text-sm text-slate-800">{qualitySpec}</div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">No offtakers in this category yet</div>
          <p className="text-sm text-amber-900">
            As offtakers submit the ECRDA checklist and tick "{slug}" as a product they purchase, they'll appear here.
            For now, click below to see the master register with all categories.
          </p>
          <p className="text-sm text-amber-900 mt-3">
            <a
              href={SMARTSHEET_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline"
            >Open master offtaker Smartsheet →</a>
          </p>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Want this filtered automatically? Once 5+ offtakers exist in the master sheet, create a Smartsheet Report
          filtered on the "Buys {slug}" checkbox column, then paste its URL here — this page becomes a live filtered view.
        </p>
      </div>
    </Shell>
  );
}

// Concrete category exports
export const FlowerPage = () => <OfftakerCategoryPage
  slug="Flower"
  fullName="Dried Hemp Flower"
  description="Dried hemp flower for CBD/CBG extraction and premium direct-sale grade. The highest-value product per hectare in the hemp value chain."
  buyers="Cannabinoid extractors, pharmacies, licensed dispensaries, premium consumer brands."
  qualitySpec="THC content < 0,3% · Certificate of Analysis (COA) required · 10-12% moisture · clean of seed and stem"
  accentHex="#015807" />;

export const SeedGrainPage = () => <OfftakerCategoryPage
  slug="Seed / Grain"
  fullName="Hempseed (Food and Oil)"
  description="Whole hempseed for human consumption (hearts, milk, protein powder) and cold-pressed seed oil. Food-grade processing facilities required."
  buyers="Food processors, cold-press oil mills, health and wellness brands, pet food."
  qualitySpec="HACCP-certified handling · GAP-certified farm · viable germination · clean of foreign matter"
  accentHex="#7B5500" />;

export const TextileFibresPage = () => <OfftakerCategoryPage
  slug="Textile Fibres"
  fullName="Bast Fibre (Textile-Grade)"
  description="Long, soft fibres separated from the outer skin of the hemp stalk. Used for clothing textiles, fine paper, rope, and composite materials."
  buyers="Textile mills, fashion brands, fine paper producers, composite material manufacturers."
  qualitySpec="Properly retted · fibre length spec · fineness · cleanliness · low hurd contamination"
  accentHex="#0EA5A4" />;

export const IndustrialFibresPage = () => <OfftakerCategoryPage
  slug="Industrial Fibres"
  fullName="Hurd / Shiv (Industrial-Grade)"
  description="Woody inner core of the hemp stalk. Used in hempcrete (hemp-lime construction), animal bedding, insulation, bioplastics, and automotive composites."
  buyers="Hempcrete builders, construction firms, automotive Tier-1 suppliers, animal bedding producers."
  qualitySpec="Particle size specification · low moisture · dust-free · consistent density"
  accentHex="#3F1101" />;
