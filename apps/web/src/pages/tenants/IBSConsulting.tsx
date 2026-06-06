/**
 * IBS Consulting Hub.
 *
 * Reached from the IBS tenant hub via the "IBS Consulting" tile.
 * Lists IBS Consulting's clients as large tile buttons:
 *   - MSCEC          (placeholder — destination not yet set)
 *   - Hempire EC     (active client; opens the Smartsheet workspace)
 *
 * Breadcrumb shows the full hierarchy:
 *   3Wi  ›  IBS  ›  IBS Consulting
 */

import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

export function IBSConsultingHub() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-3">
        <Link to="/cc/director" className="hover:underline">3Wi</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to="/tenants/ibs" className="hover:underline">IBS</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <span className="text-slate-900 font-semibold">IBS Consulting</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
          Division
        </div>
        <h1 className="text-3xl font-bold text-slate-900">IBS Consulting</h1>
        <p className="text-sm text-slate-600 mt-1">
          Advisory engagements and grant-funded projects. Choose a client to enter their workspace.
        </p>
      </div>

      {/* Three client / function tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">

        {/* Tile 1: MSCEC */}
        <Link
          to="/tenants/ibs/consulting/mscec"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#0EA5A4] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4] text-xl font-bold">
              MS
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              Coming soon
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">MSCEC</h2>
          <p className="text-sm text-slate-600 mb-3">
            Client placeholder — tell Claude what MSCEC stands for and where this tile should take you.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Destination not yet set</div>
            <div>• Can be Smartsheet, external app, or built-in dashboard</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#0EA5A4] group-hover:underline">
            Open MSCEC &nbsp;→
          </div>
        </Link>

        {/* Tile 2: Hempire EC — now an internal hub */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-xl font-bold">
              HE
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Hempire EC</h2>
          <p className="text-sm text-slate-600 mb-3">
            Hempire Eastern Cape NPC — grant-funded hemp production programme. Currently delivering the Sunshines Project.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• PSC · Members · Off takers</div>
            <div>• 46 growers · R 536 589,80 disbursement envelope</div>
            <div>• 4-gate payment verification process</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#015807] group-hover:underline">
            Open Hempire EC hub &nbsp;→
          </div>
        </Link>

        {/* Tile 3: IBS Sales and Bid Office */}
        <Link
          to="/tenants/ibs/consulting/sales-bid-office"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#B45309] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#B45309]/10 text-[#B45309] text-xl font-bold">
              SB
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">IBS Sales and Bid Office</h2>
          <p className="text-sm text-slate-600 mb-3">
            Pipeline + bid management for IBS Consulting. Tenders, proposals, capability statements, and win/loss tracking.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Live bid pipeline + tender tracker</div>
            <div>• Sales funnel KPIs (lead → close)</div>
            <div>• Capability statements + past-performance</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#B45309] group-hover:underline">
            Open Sales &amp; Bid Office &nbsp;→
          </div>
        </Link>
      </div>

      {/* Quick links — for routes that exist inside the SaaS for this client */}
      <div className="mt-6 max-w-4xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Hempire EC — live SaaS pages
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/cc/growers"        className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Growers register</Link>
          <Link to="/cc/verifications"  className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Verifications</Link>
          <Link to="/cc/authorisations" className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Authorisations</Link>
          <Link to="/cc/ecrda"          className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">ECRDA dashboard</Link>
        </div>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi PTY Ltd <span className="text-slate-400">→</span> IBS <span className="text-slate-400">→</span> <span className="font-semibold text-slate-900">IBS Consulting</span> <span className="text-slate-400">→</span> [MSCEC | Hempire EC | Sales &amp; Bid Office] <span className="text-slate-400">→</span> Project
        </div>
      </div>
    </Shell>
  );
}

/**
 * IBS Sales and Bid Office — workspace.
 *
 * Pipeline + bid management for IBS Consulting. Substantive workspace
 * (not a placeholder) with sections for the live pipeline, sales-funnel
 * KPIs, active tenders, capability statements / past performance, and
 * win/loss tracking.
 */
export function IbsSalesBidOfficePage() {
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
        <span className="text-slate-900 font-semibold">Sales &amp; Bid Office</span>
      </nav>

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: '#B4530933', background: '#B453090A' }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: '#B45309' }}>SB</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#B4530920', color: '#B45309' }}>Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">IBS Sales and Bid Office</h1>
            <p className="text-sm text-slate-600 mt-1">
              Pipeline + bid management for IBS Consulting. Where every tender, RFP and warm lead is tracked
              from first-touch through to signed engagement.
            </p>
          </div>
        </div>
      </div>

      {/* KPI strip — placeholder figures, wire to API later */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        <KpiCard label="Pipeline value" value="R 12.4 m" sub="Across 8 active opportunities" />
        <KpiCard label="In-flight bids" value="3" sub="Submissions in next 30 days" />
        <KpiCard label="Win rate (YTD)" value="42%" sub="Closed-won / closed total" />
        <KpiCard label="Avg cycle time"  value="62 days" sub="Lead → signed engagement" />
      </div>

      {/* Two-column workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mb-4">
        {/* Active bids in flight */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold flex items-center justify-between">
            <span>Active bids in flight</span>
            <span className="text-xs font-mono text-slate-500">3 open</span>
          </header>
          <div className="p-5">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr><th className="text-left py-1">Tender</th><th className="text-left">Issuer</th><th className="text-right">Close</th></tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100"><td className="py-2">Hemp value-chain feasibility</td><td>DSBD</td><td className="text-right font-mono">14 Jun</td></tr>
                <tr className="border-t border-slate-100"><td className="py-2">Agri SMME enterprise dev programme</td><td>ECDC</td><td className="text-right font-mono">28 Jun</td></tr>
                <tr className="border-t border-slate-100"><td className="py-2">Skills development for rural co-ops</td><td>AgriSETA</td><td className="text-right font-mono">12 Jul</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-slate-500 italic mt-3">
              Wire to <code>/api/bids?status=in_flight</code> when the bids table exists. For now this is a placeholder list.
            </p>
          </div>
        </section>

        {/* Sales funnel */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Sales funnel — Q2 snapshot</header>
          <div className="p-5">
            <div className="space-y-2">
              <FunnelBar label="Leads"           value={32} max={32} color="#FCD34D" />
              <FunnelBar label="Qualified"       value={18} max={32} color="#FBBF24" />
              <FunnelBar label="Proposal sent"   value={11} max={32} color="#F59E0B" />
              <FunnelBar label="Negotiation"     value={5}  max={32} color="#D97706" />
              <FunnelBar label="Closed-won"      value={2}  max={32} color="#B45309" />
            </div>
            <p className="text-xs text-slate-500 italic mt-3">
              Wire to <code>/api/sales-funnel?period=q2</code> when CRM ingestion is live.
            </p>
          </div>
        </section>

        {/* Capability statements & past performance */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Capability statements + past performance</header>
          <div className="p-5">
            <ul className="text-sm text-slate-700 space-y-1.5">
              <li>• <strong>Sunshines Project (ECRDA)</strong> — R 3.2m envelope, 46 growers, 6 districts (live)</li>
              <li>• <strong>Hempire Eastern Cape NPC</strong> — programme architecture + management</li>
              <li>• <strong>BBBEE compliance</strong> — Level 1 with broad-based shareholding</li>
              <li>• <strong>CSD registration</strong> — National Treasury Central Supplier Database</li>
            </ul>
            <div className="mt-4 text-xs text-slate-500 italic">
              Hosted in <code>SharePoint &gt; IBS Consulting &gt; Capability Statements</code> — link out when SharePoint integration is wired.
            </div>
          </div>
        </section>

        {/* Recent wins / losses */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Recent decisions</header>
          <div className="p-5">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100"><td className="py-2"><span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-800 uppercase">WON</span></td><td>ECRDA Sunshines Part 1 — R 3.2m</td><td className="text-right text-xs text-slate-500">Mar 2026</td></tr>
                <tr className="border-b border-slate-100"><td className="py-2"><span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-rose-100 text-rose-800 uppercase">LOST</span></td><td>SEDFA enterprise dev tender</td><td className="text-right text-xs text-slate-500">Feb 2026</td></tr>
                <tr className="border-b border-slate-100"><td className="py-2"><span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-800 uppercase">WON</span></td><td>Wellies brand refresh (internal)</td><td className="text-right text-xs text-slate-500">Jan 2026</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Process snapshot */}
      <div className="max-w-6xl">
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Bid process flow</header>
          <div className="p-5">
            <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-800 overflow-x-auto">{`Tender alert    -> Bid / no-bid decision (within 48h)
        -> Compliance + capability fit check
        -> Bid team formed + writing plan
        -> Drafting (technical / financial / B-BBEE)
        -> Internal review + pricing sign-off
        -> Submission (electronic / physical)
        -> Post-submission tracker
        -> Award notice -> contract negotiation
        -> Hand-off to delivery team`}</pre>
            <p className="text-xs text-slate-500 italic mt-3">
              Each step will become a workflow card once the bids table is wired. Plug into the engagement system so a "Closed-won" auto-creates an engagement record.
            </p>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-xl font-bold text-slate-900 mt-1">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-mono text-slate-500">{value} · {pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/**
 * MSCEC placeholder page.
 */
export function MSCECPlaceholder() {
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
          <span className="text-slate-900 font-semibold">MSCEC</span>
        </nav>
        <h1 className="text-3xl font-bold mt-3 text-slate-900">MSCEC</h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          This is the placeholder page for the MSCEC client.
        </p>

        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900 mb-2">Not yet wired up</div>
          <p className="text-sm text-amber-900">
            Tell Claude what MSCEC is and where this tile should take you. Options:
          </p>
          <ul className="text-sm text-amber-900 mt-2 ml-4 list-disc">
            <li>A Smartsheet folder (paste the URL)</li>
            <li>An external app (e.g. SharePoint, OneDrive, CRM)</li>
            <li>A built-in dashboard inside this SaaS</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}
