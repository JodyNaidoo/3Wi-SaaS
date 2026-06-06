/**
 * Hempire-EC Client Hub.
 *
 * Reached from the IBS Consulting hub via the "Hempire EC" tile.
 * Presents Hempire-EC's three working surfaces as large tile buttons:
 *   - PSC         (Project Steering Committee — governance)
 *   - Members     (the 46 growers and any future enrolled members)
 *   - Off takers  (vetted pool — links to ECRDA submission Smartsheet)
 *
 * Breadcrumb:
 *   3Wi  ›  IBS  ›  IBS Consulting  ›  Hempire EC
 */

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { offtakers, type OfftakerDashboardData } from '../../lib/api/offtakers';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },
];

// Hempire-EC offtaker Smartsheet
const OFFTAKERS_SMARTSHEET_URL =
  'https://app.smartsheet.eu/sheets/CCjj6QrG222hJxWG7VQqhPfv8fxhVvhGP2gJcc81';

export function HempireECHub() {
  const [stats, setStats] = useState<OfftakerDashboardData | null>(null);
  useEffect(() => {
    let cancelled = false;
    offtakers.dashboard()
      .then(d => { if (!cancelled) setStats(d); })
      .catch(() => { /* silent */ });
    return () => { cancelled = true; };
  }, []);

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
        <span className="text-slate-900 font-semibold">Hempire EC</span>
      </nav>

      {/* Page header — Hempire palette */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#015807] mb-1">
          Client
        </div>
        <h1 className="text-3xl font-bold text-[#3F1101]">Hempire EC</h1>
        <p className="text-sm text-slate-600 mt-1">
          Hempire Eastern Cape NPC — grant-funded hemp production programme.
          Currently delivering the Sunshines Project with 46 growers under ECRDA funding.
        </p>
      </div>

      {/* Four tiles — PSC, Members, Off takers, ECRDA 2026/2027 MOA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl">

        {/* Tile 1: PSC — opens funder hub */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/psc"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#3F1101] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#3F1101]/10 text-[#3F1101] text-xl font-bold">
              PSC
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">PSC</h2>
          <p className="text-sm text-slate-600 mb-3">
            Project Steering Committee — composed of five government departments and agencies. Choose a member to enter their workspace.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• DEDEAT · ECDC · SEDFA</div>
            <div>• ECRDA (Part 1 funder, live)</div>
            <div>• DSBD (Part 2 funder)</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#3F1101] group-hover:underline">
            Choose a PSC member &nbsp;→
          </div>
        </Link>

        {/* Tile 2: Members — opens hub for Hubs + Farmers/Growers */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/members"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#015807] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#015807]/10 text-[#015807] text-xl font-bold">
              M
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              46 enrolled
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Members</h2>
          <p className="text-sm text-slate-600 mb-3">
            Hempire-EC's member network. Split between aggregation hubs and individual farmers / growers.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Hubs (aggregation / pack-house network)</div>
            <div>• Farmers / Growers (46 enrolled)</div>
            <div>• R 536 589,80 disbursement envelope</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#015807] group-hover:underline">
            Choose Hubs or Farmers &nbsp;→
          </div>
        </Link>

        {/* Tile 3: Off takers — opens category hub */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/offtakers"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#B45309] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#FDF31C]/40 text-[#7B5500] text-xl font-bold">
              OT
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              {stats && stats.total > 0 ? `${stats.total} submission${stats.total === 1 ? '' : 's'}` : 'Building pool'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Off takers</h2>
          <p className="text-sm text-slate-600 mb-3">
            Vetted pool of prospective hemp offtakers — split by product category from the value chain.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Flower (CBD/CBG extraction)</div>
            <div>• Seed / Grain · Textile Fibres · Industrial Fibres</div>
            {stats && stats.total > 0
              ? <div>• <strong className="text-emerald-700">{stats.approvedCount}</strong> approved in pool · <strong className="text-amber-700">{stats.total - stats.approvedCount}</strong> in pipeline</div>
              : <div>• ECRDA checklist + Smartsheet register</div>}
          </div>
          <div className="mt-4 text-sm font-semibold text-[#B45309] group-hover:underline">
            Choose a buyer category &nbsp;→
          </div>
        </Link>

        {/* Tile 4: ECRDA 2026/2027 MOA Projects — next-FY programme */}
        <Link
          to="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa"
          className="group block rounded-xl border-2 border-slate-200 hover:border-[#0E7490] bg-white p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0E7490]/10 text-[#0E7490] text-base font-bold">
              26
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-medium">
              Planning
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">ECRDA 2026/2027 MOA Projects</h2>
          <p className="text-sm text-slate-600 mb-3">
            Next-financial-year programme under the ECRDA MOA. Expanded grower base + new workstreams + multi-year deliverables.
          </p>
          <div className="text-xs text-slate-500 space-y-0.5">
            <div>• Multi-year programme architecture</div>
            <div>• Cultivation · Value-chain · Technical assistance</div>
            <div>• FY26/27 envelope TBC</div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#0E7490] group-hover:underline">
            Open MOA workspace &nbsp;→
          </div>
        </Link>
      </div>

      {/* Quick links — payment verification stages for Hempire-EC */}
      <div className="mt-6 max-w-5xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Payment verification (Sunshines Part 1 — 4-gate governance)
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/my-farm"          className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Stage 2 — Farmer portal</Link>
          <Link to="/cc/verifications" className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Stage 3 — Verifications</Link>
          <Link to="/cc/authorisations"className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Stage 4 — Authorisations</Link>
          <Link to="/payments/loader"  className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Stage 5 — Payment loader</Link>
          <Link to="/cc/ecrda"         className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Stage 6 — ECRDA POPs</Link>
        </div>
      </div>

      {/* Footer breadcrumb / context */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">Where you are in the hierarchy</div>
        <div className="font-mono">
          3Wi PTY Ltd <span className="text-slate-400">→</span> IBS <span className="text-slate-400">→</span> IBS Consulting <span className="text-slate-400">→</span> <span className="font-semibold text-[#3F1101]">Hempire EC</span> <span className="text-slate-400">→</span> [PSC | Members | Off takers | ECRDA 2026/2027 MOA]
        </div>
      </div>
    </Shell>
  );
}

/**
 * ECRDA 2026/2027 MOA Projects workspace.
 *
 * Next-FY programme architecture under a new Memorandum of Agreement
 * with ECRDA. Builds on Sunshines Part 1 (FY25/26) with expanded grower
 * base, new workstreams, and multi-year deliverables.
 */
export function Ecrda2026MoaWorkspace() {
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
        <span className="text-slate-900 font-semibold">ECRDA 2026/2027 MOA Projects</span>
      </nav>

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-6xl"
           style={{ borderColor: '#0E749033', background: '#0E74900A' }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: '#0E7490' }}>26</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#0E749020', color: '#0E7490' }}>Planning · FY26/27</span>
              <span className="text-xs text-slate-500">Memorandum of Agreement under negotiation</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">ECRDA 2026/2027 MOA Projects</h1>
            <p className="text-sm text-slate-600 mt-1">
              Next-financial-year programme architecture under a renewed ECRDA Memorandum of Agreement.
              Builds on Sunshines Part 1 (FY25/26) with expanded grower base, additional workstreams,
              and multi-year deliverables.
            </p>
          </div>
        </div>
      </div>

      {/* KPI strip — placeholder figures */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-6xl">
        <KpiCard label="MOA status"        value="Planning"    sub="Target sign by Q4 FY25/26" />
        <KpiCard label="Envelope target"   value="TBC"         sub="Subject to ECRDA budget cycle" />
        <KpiCard label="Workstreams"       value="5"           sub="See breakdown below" />
        <KpiCard label="Reporting cadence" value="Quarterly"   sub="PSC + ECRDA M&E framework" />
      </div>

      {/* Programme context */}
      <div className="max-w-6xl mb-4">
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Programme context</header>
          <div className="p-5 text-sm text-slate-700 space-y-3">
            <p>
              The 2026/2027 MOA scales the Sunshines model from a single-cohort pilot into a programmatic, multi-workstream
              partnership. Lessons learned from Part 1 (46 growers, R 536 590 disbursed, 48,92 funded ha) inform the
              design — particularly around banking-readiness, GACP compliance, offtaker certainty, and the 4-gate
              payment-verification process.
            </p>
            <p>
              The MOA positions ECRDA as the anchor funder while opening explicit hooks for parallel funding from
              <strong> DSBD (Part 2 seed cohort)</strong>, <strong>SEDFA</strong>, and private off-takers. Hempire-EC remains
              the implementing NPC; 3Wi IBS Consulting provides programme management.
            </p>
          </div>
        </section>
      </div>

      {/* Master delivery process */}
      <div className="max-w-6xl mb-4">
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold flex items-center justify-between">
            <span>Master delivery process</span>
            <span className="text-xs font-mono text-slate-500">demand-led · 3 steps</span>
          </header>
          <div className="p-5">
            <p className="text-sm text-slate-700 mb-4">
              Programme delivery starts from the <strong>offtaker</strong> and works back to the <strong>grower</strong> —
              we don't recruit farmers until we know what the market wants and how to support them to produce it.
            </p>

            {/* Top-level 3 steps — horizontal flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <ProcessStep n={1} title="Offtaker vetting + technical needs analysis"
                href="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-1-offtaker-vetting"
                desc="Confirm what the market will buy. Capture quality, volume, format, certification and timing requirements per offtaker." />
              <ProcessStep n={2} title="Support hub blueprint development"
                href="/hub-support-dashboard.html" external ctaLabel="Open mock dashboard ↗"
                desc="Design the hub infrastructure + service mix required to meet those technical needs. One blueprint per geography / value-chain." />
              <ProcessStep n={3} title="Grower onboarding support programme"
                href="/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa/step-3-grower-onboarding"
                desc="Recruit + onboard growers into the hub. Three pillars: Training, Farm Infrastructure, Inputs & Consumables." last />
            </div>

            {/* Step 3 expansion — three sub-areas */}
            <div className="rounded-xl border-2 p-5 mb-2"
                 style={{ borderColor: '#0E749033', background: '#0E74900A' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
                      style={{ background: '#0E7490' }}>3</span>
                <span className="text-sm font-bold text-slate-900">Grower onboarding support programme — three pillars</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Pillar (a) Training */}
                <PillarCard letter="a" title="Training" colour="#0E7490"
                  items={[
                    'i.  Pre-planting',
                    'ii. In-season operations',
                    'iii. Post-harvest activities',
                    'iv. GACP / GAP',
                    'v.  Financial aspects of primary production',
                  ]} />

                {/* Pillar (b) Farm Infrastructure */}
                <PillarCard letter="b" title="Farm Infrastructure" colour="#0891B2"
                  items={[
                    'i.  Infrastructure needs analysis',
                    'ii. Infrastructure maintenance routines',
                  ]} />

                {/* Pillar (c) Production inputs and consumables */}
                <PillarCard letter="c" title="Production inputs & consumables management" colour="#06B6D4"
                  items={[
                    'Sourcing + procurement coordination',
                    'Stock + cold-chain handling',
                    'Per-grower allocation + tracking',
                  ]} />
              </div>
            </div>

            <p className="text-xs text-slate-500 italic mt-3">
              This sequencing means every grower onboarded already has (i) a confirmed buyer, (ii) hub infrastructure
              sized for their needs, and (iii) a structured support programme. It is the structural fix for the
              banking-readiness + GACP-compliance + offtaker-uncertainty gaps observed in Part 1.
            </p>
          </div>
        </section>
      </div>

      {/* Workstreams */}
      <div className="max-w-6xl mb-4">
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Workstreams (5)</header>
          <div className="p-5">
            <ol className="relative border-l-2 border-slate-200 ml-3 space-y-5">
              <Workstream n={1} title="Cultivation expansion"
                desc="Onboard the next cohort of growers across the Eastern Cape. Target: 100+ growers, 120+ ha. Includes hub-based aggregation model where individual smallholder farms feed a centralised pack-house." />
              <Workstream n={2} title="Value-chain development"
                desc="Move beyond raw-flower into Seed/Grain, Textile Fibres, Industrial Fibres. Confirms offtaker contracts before planting season. Each value-chain has its own QC + grading protocol." />
              <Workstream n={3} title="Technical assistance + extension"
                desc="Field officers + agronomy support (Luvo QongQo). GIS mapping + verification (Solly Vuso). Skills Centre delivers farmer training under the same MOA." />
              <Workstream n={4} title="Infrastructure investment"
                desc="Co-funded shared infrastructure: drying tunnels, processing equipment, cold-chain. Capex sharing with hubs to unlock scale." />
              <Workstream n={5} title="M&E + impact reporting"
                desc="Logframe-driven monitoring (outputs → outcomes → impact). Quarterly reports to ECRDA Board, annual independent evaluation, end-of-programme impact assessment." />
            </ol>
          </div>
        </section>
      </div>

      {/* Two-column: Timeline + Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mb-4">
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Indicative timeline</header>
          <div className="p-5 text-sm text-slate-700 space-y-2">
            <TimelineRow when="Now → Mar 2026" what="MOA negotiation + drafting" status="active" />
            <TimelineRow when="Mar 2026"        what="MOA sign-off (target)" status="upcoming" />
            <TimelineRow when="Apr 2026"        what="FY26/27 disbursement window opens" status="upcoming" />
            <TimelineRow when="Apr–Jun 2026"    what="Grower recruitment + onboarding (Q1)" status="upcoming" />
            <TimelineRow when="Jul–Sep 2026"    what="Planting season + first disbursements (Q2)" status="upcoming" />
            <TimelineRow when="Oct–Dec 2026"    what="In-season management + technical visits (Q3)" status="upcoming" />
            <TimelineRow when="Jan–Mar 2027"    what="Harvest + offtake + end-of-FY reporting (Q4)" status="upcoming" />
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Governance &amp; reporting</header>
          <div className="p-5 text-sm text-slate-700 space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">PSC composition</div>
              <p>Same PSC as Sunshines Part 1 — ECRDA (anchor), DSBD, DEDEAT, ECDC, SEDFA. Quarterly meetings.</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Reporting cadence</div>
              <ul className="list-disc ml-5 space-y-0.5">
                <li>Monthly programme dashboard to ECRDA programme team</li>
                <li>Quarterly PSC pack (this SaaS auto-generates it)</li>
                <li>Bi-annual financial report to ECRDA Board</li>
                <li>Annual independent M&amp;E evaluation</li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Payment governance</div>
              <p>Same 4-gate verification process as Part 1 (Farmer → Verifier → Authoriser → Loader). Already live in this SaaS.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Linked artefacts */}
      <div className="max-w-6xl mb-4">
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <header className="px-5 py-3 border-b border-slate-100 font-semibold">Linked artefacts</header>
          <div className="p-5">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr><th className="text-left py-1">Artefact</th><th className="text-left">Status</th><th className="text-left">Location</th></tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100"><td className="py-2">Draft MOA text</td><td><span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium uppercase">Drafting</span></td><td className="text-xs text-slate-500">SharePoint &gt; ECRDA &gt; 2026 MOA</td></tr>
                <tr className="border-t border-slate-100"><td className="py-2">Budget submission</td><td><span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium uppercase">Drafting</span></td><td className="text-xs text-slate-500">SharePoint &gt; ECRDA &gt; FY26/27 Budget</td></tr>
                <tr className="border-t border-slate-100"><td className="py-2">Logframe (outputs → outcomes → impact)</td><td><span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium uppercase">In design</span></td><td className="text-xs text-slate-500">Notion &gt; M&amp;E framework</td></tr>
                <tr className="border-t border-slate-100"><td className="py-2">Value-chain offtaker LOIs</td><td><span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium uppercase">Outreach</span></td><td className="text-xs text-slate-500">/cc/offtakers · Smartsheet register</td></tr>
                <tr className="border-t border-slate-100"><td className="py-2">Grower pipeline (next cohort)</td><td><span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium uppercase">Planning</span></td><td className="text-xs text-slate-500">/cc/growers (filter: prospect)</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-slate-500 italic mt-3">
              Wire each artefact to its SharePoint URL when the SharePoint sync goes live.
            </p>
          </div>
        </section>
      </div>

      {/* Quick links back to live ops */}
      <div className="max-w-6xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Related live surfaces (FY25/26 — Sunshines Part 1)
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/cc/growers"       className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">Current growers register</Link>
          <Link to="/cc/psc"           className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">PSC dashboard</Link>
          <Link to="/cc/ecrda"         className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">ECRDA closure dashboard (Part 1)</Link>
          <Link to="/tenants/ibs/consulting/hempire-ec/psc/ecrda" className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">ECRDA sub-hub (people)</Link>
        </div>
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

function Workstream({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="ml-6">
      <span className="absolute -left-[14px] flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
            style={{ background: '#0E7490' }}>{n}</span>
      <h4 className="text-base font-bold text-slate-900 mb-0.5">{title}</h4>
      <p className="text-sm text-slate-600">{desc}</p>
    </li>
  );
}

function ProcessStep({ n, title, desc, last, href, external, ctaLabel }: { n: number; title: string; desc: string; last?: boolean; href?: string; external?: boolean; ctaLabel?: string }) {
  const cta = ctaLabel ?? (external ? 'Open dashboard ↗' : 'Open workflow →');
  const inner = (
    <>
      <div className="flex items-start gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold shrink-0"
              style={{ background: '#0E7490' }}>{n}</span>
        <h4 className="text-sm font-bold text-slate-900 leading-tight">{title}</h4>
      </div>
      <p className="text-xs text-slate-600 ml-11">{desc}</p>
      {href ? <div className="ml-11 mt-2 text-xs font-semibold text-[#0E7490]">{cta}</div> : null}
      {!last ? (
        <span className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-300 text-2xl pointer-events-none select-none">
          ›
        </span>
      ) : null}
    </>
  );
  const baseCls = "relative block rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-[#0E7490] hover:shadow-md transition-all";
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseCls}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link to={href} className={baseCls}>
        {inner}
      </Link>
    );
  }
  return (
    <div className="relative rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-[#0E7490] transition-colors">
      {inner}
    </div>
  );
}

function PillarCard({ letter, title, items, colour }: { letter: string; title: string; items: string[]; colour: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold uppercase"
              style={{ background: colour }}>{letter}</span>
        <h5 className="text-sm font-bold text-slate-900">{title}</h5>
      </div>
      <ul className="text-xs text-slate-700 space-y-1 ml-1">
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
    </div>
  );
}

function TimelineRow({ when, what, status }: { when: string; what: string; status: 'active' | 'upcoming' }) {
  const pill = status === 'active'
    ? 'bg-emerald-100 text-emerald-800'
    : 'bg-slate-100 text-slate-700';
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-mono text-xs text-slate-500 shrink-0">{when}</span>
      <span className="flex-1 mx-3 border-b border-dotted border-slate-200" />
      <span>{what}</span>
      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded shrink-0 ${pill}`}>{status}</span>
    </div>
  );
}
