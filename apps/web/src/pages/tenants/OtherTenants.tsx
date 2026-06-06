/**
 * Other 3Wi PTY Ltd Tenant Hubs.
 *
 * Sibling pages to the IBS hub, one for each additional tenant owned
 * by 3Wi PTY Ltd. Each is a placeholder ready to be fleshed out the
 * same way IBS has been (divisions → clients → projects → ...).
 *
 *   - Wellies
 *   - Khula Woyise Investments
 *   - MT Naidoo Properties
 *
 * Breadcrumb pattern:
 *   3Wi  ›  [Tenant name]
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

/** Shared template for placeholder tenant hubs. */
function TenantPlaceholder({
  slug, fullName, description, accentHex, sampleStructure,
}: {
  slug: string;
  fullName: string;
  description: string;
  accentHex: string;
  sampleStructure: string[];
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-3xl mt-4">
        <nav className="text-xs text-slate-500 mb-3">
          <Link to="/cc/director" className="hover:underline">3Wi</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">{slug}</span>
        </nav>
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accentHex }}>
          Tenant
        </div>
        <h1 className="text-3xl font-bold" style={{ color: accentHex }}>{slug}</h1>
        <p className="text-sm text-slate-600 mt-1">{fullName}</p>
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
            Tell Claude how to structure {slug}. The pattern used for IBS works well as a template:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li><b>Divisions</b> — top-level business lines (like IBS Consulting and Rainmaker)</li>
            <li><b>Clients / projects / units</b> — what sits inside each division</li>
            <li><b>Data sources</b> — Smartsheet workspaces, external apps, internal pages</li>
            <li><b>Branding</b> — primary, secondary, accent colours</li>
          </ul>
          <p className="text-sm text-amber-900 mt-3">
            Once defined, this tenant gets the same multi-level hub navigation as IBS — divisions, sub-units, dashboards.
          </p>
        </div>
      </div>
    </Shell>
  );
}

export const WelliesPage = () => <TenantPlaceholder
  slug="Wellies"
  fullName="Wellies (entity description TBC)"
  description="Tell Claude what Wellies is — sector, products, geography. Examples: a beverage brand, footwear, a media business, etc."
  sampleStructure={[
    'Products / services',
    'Customers / clients',
    'Operations team',
    'Suppliers and partners',
  ]}
  accentHex="#B45309" />;

export const KhulaWoyisePage = () => <TenantPlaceholder
  slug="Khula Woyise Investments"
  fullName="Khula Woyise Investments (investment holding company)"
  description={`"Khula" means "to grow". A Pty Ltd investment vehicle — likely holding company for stakes in operating businesses, property, or pooled investor capital.`}
  sampleStructure={[
    'Portfolio companies (equity stakes)',
    'Property assets',
    'Liquid investments (equities, money market)',
    'Investor register and capital calls',
    'NAV and performance reporting',
  ]}
  accentHex="#015807" />;

export const MTNaidooPropertiesPage = () => <TenantPlaceholder
  slug="MT Naidoo Properties"
  fullName="MT Naidoo Properties (property portfolio)"
  description="Property entity — likely holds residential, commercial or rural property assets, with rental income and capital appreciation as primary returns."
  sampleStructure={[
    'Property register (per asset)',
    'Tenant register and lease tracker',
    'Rental income and arrears',
    'Operating expenses (rates, maintenance, insurance)',
    'Valuations and capex schedule',
    'Disposal pipeline',
  ]}
  accentHex="#475569" />;

/** Family-trust placeholder template — captures the right things for a trust, not an operating business. */
function FamilyTrustPlaceholder({ slug, initials, accentHex, fullDescription }: {
  slug: string; initials: string; accentHex: string; fullDescription: string;
}) {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="max-w-3xl mt-4">
        <nav className="text-xs text-slate-500 mb-3">
          <Link to="/cc/director" className="hover:underline">3Wi</Link>
          <span className="mx-1.5 text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">{slug}</span>
        </nav>
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center justify-center px-3 h-10 rounded-lg text-white text-xs font-mono font-bold" style={{ background: accentHex }}>
            {initials}
          </span>
          <h1 className="text-3xl font-bold" style={{ color: accentHex }}>{slug}</h1>
        </div>
        <p className="text-sm text-slate-600 mt-1">Inter vivos family trust</p>
        <p className="text-sm text-slate-700 mt-3">{fullDescription}</p>

        {/* Trust governance snapshot — standard contents */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Trustees</div>
            <div className="text-sm text-slate-800">TBC — typically 3+ (founder, family, independent)</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Beneficiaries</div>
            <div className="text-sm text-slate-800">TBC — named family members and contingent beneficiaries</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Master's Reference (IT)</div>
            <div className="text-sm text-slate-800">IT TBC / TBC</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Trust Deed</div>
            <div className="text-sm text-slate-800">TBC — registration year, current amendments</div>
          </div>
        </div>

        {/* What a trust file holds */}
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Likely sub-structure</div>
          <ul className="text-sm text-slate-800 list-disc ml-4 space-y-1">
            <li>Asset register — property, shares, loan accounts, cash</li>
            <li>Beneficiary register and distributions ledger</li>
            <li>Trustee register and minutes of meetings</li>
            <li>Trust deed and amendments</li>
            <li>Annual financial statements and tax returns</li>
            <li>Bank statements and brokerage statements</li>
          </ul>
        </div>

        <div className="mt-5 rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude these trust details and we'll build out the file:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li><b>Trust founder</b> and date of registration</li>
            <li><b>Trustees</b> — names and roles</li>
            <li><b>Beneficiaries</b> — named and contingent</li>
            <li><b>Asset register</b> — what does the trust own? (property addresses, shareholdings, cash)</li>
            <li><b>Auditor / tax practitioner</b> — who handles AFS and SARS submissions?</li>
            <li><b>Where is the trust admin tracked today?</b> — accountant, spreadsheet, paper</li>
          </ul>
          <p className="text-sm text-amber-900 mt-3">
            Once defined, this page becomes the trust file with asset register, distribution ledger, and trustee minutes.
          </p>
        </div>
      </div>
    </Shell>
  );
}

export const JKMNaidooFamilyTrustPage = () => <FamilyTrustPlaceholder
  slug="JKM Naidoo Family Trust"
  initials="JKM"
  accentHex="#6B21A8"
  fullDescription="JKM Naidoo Family Trust — inter vivos trust. Tell Claude who the founder is (JKM are presumably the founder's initials), who the trustees and beneficiaries are, and what assets sit in the trust." />;

export const RMNaidooFamilyTrustPage = () => <FamilyTrustPlaceholder
  slug="RM Naidoo Family Trust"
  initials="RM"
  accentHex="#9F1239"
  fullDescription="RM Naidoo Family Trust — inter vivos trust. Tell Claude who the founder is (RM are presumably the founder's initials), who the trustees and beneficiaries are, and what assets sit in the trust." />;
