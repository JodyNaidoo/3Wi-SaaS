import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';

const HOTKEYS: Hotkey[] = [
  { key: 'F1',  label: 'All entities',     href: '/cc/director' },
  { key: 'F2',  label: 'Farmer pipeline',  href: '/cc/director?p=farmers' },
  { key: 'F3',  label: 'AI skills',        href: '/ai/monthly-ops' },
  { key: 'F4',  label: 'Milestones',       href: '/cc/director?p=milestones' },
  { key: 'F5',  label: 'Risk register',    href: '/cc/director?p=risks' },
  { key: 'F6',  label: 'Growers',          href: '/cc/growers' },
  { key: 'F7',  label: 'Cash flow',        href: '/cc/director?p=cash' },
  { key: 'F8',  label: 'Report builder',   href: '/ai/quarterly' },
  { key: 'F9',  label: 'User management',  href: '/cc/director?p=users' },
  { key: 'F10', label: 'Billing',          href: '/billing/subscription' },
  // Disbursement governance (Sunshines Part 1 — Hempire payment verification process)
  { key: 'F11', label: 'Verifications',    href: '/cc/verifications' },     // Stage 3 - Solly
  { key: 'F12', label: 'Authorisations',   href: '/cc/authorisations' },    // Stage 4 - Dr Blouw
  { key: 'P',   label: 'Payment loader',   href: '/payments/loader' },      // Stage 5 - Bookkeeper
  { key: 'E',   label: 'ECRDA dashboard',  href: '/cc/ecrda' },             // Stage 6 - ECRDA (read-only)
  { key: 'M',   label: 'My Farm portal',   href: '/my-farm' },              // Stage 2 - farmer-facing preview
];

export function DirectorCC() {
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <h1 className="text-2xl font-bold mb-4">All Entities Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Active projects">
          <div className="text-3xl font-bold">1</div>
          <p className="text-xs text-slate-500">Across this tenant</p>
        </Card>
        <Card title="Active users">
          <div className="text-3xl font-bold">8</div>
          <p className="text-xs text-slate-500">Counted toward billing this month</p>
        </Card>
        <Card title="Reports this month">
          <div className="text-3xl font-bold">6</div>
          <p className="text-xs text-slate-500">AI-generated</p>
        </Card>
      </div>

      <Card title="Quick actions" className="mt-4">
        <div className="flex flex-wrap gap-2">
          <a href="/ai/monthly-ops" className="btn-primary">Generate monthly ops</a>
          <a href="/ai/quarterly" className="btn-primary">Generate quarterly PSC</a>
          <a href="/ai/mov-pack" className="btn-primary">Build MoV pack</a>
        </div>
      </Card>

      {/* Tenants & workspaces — quick access to all 3Wi PTY Ltd tenant hubs */}
      <Card title="Tenants &amp; workspaces" className="mt-4">
        <div className="flex flex-wrap gap-2">
          {/* 3WI Pty Ltd (RN) — parent holdco */}
          <Link
            to="/tenants/3wi-pty-ltd"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F4D2C] text-white hover:bg-[#163B21] font-semibold text-sm"
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/20 font-mono">3WI</span>
            Open 3WI Pty Ltd (RN)
          </Link>

          {/* IBS (active — fully built out) */}
          <Link
            to="/tenants/ibs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3F1101] text-[#FDF31C] hover:bg-[#2a0a01] font-semibold text-sm"
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-[#FDF31C]/20 font-mono">IBS</span>
            Open IBS
          </Link>

          {/* Wellies (placeholder) */}
          <Link
            to="/tenants/wellies"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B45309] text-white hover:bg-[#92400E] font-semibold text-sm"
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/20 font-mono">WL</span>
            Open Wellies
          </Link>

          {/* Khula Woyise Investments (placeholder) */}
          <Link
            to="/tenants/khula-woyise"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#015807] text-white hover:bg-[#013904] font-semibold text-sm"
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/20 font-mono">KW</span>
            Open Khula Woyise
          </Link>

          {/* MT Naidoo Properties (placeholder) */}
          <Link
            to="/tenants/mt-naidoo-properties"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-900 font-semibold text-sm"
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/20 font-mono">MTN</span>
            Open MT Naidoo Properties
          </Link>

          {/* JKM Naidoo Family Trust (placeholder) */}
          <Link
            to="/tenants/jkm-naidoo-family-trust"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6B21A8] text-white hover:bg-[#581C87] font-semibold text-sm"
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/20 font-mono">JKM</span>
            Open JKM Family Trust
          </Link>

          {/* RM Naidoo Family Trust (placeholder) */}
          <Link
            to="/tenants/rm-naidoo-family-trust"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#9F1239] text-white hover:bg-[#881337] font-semibold text-sm"
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/20 font-mono">RM</span>
            Open RM Family Trust
          </Link>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          All 3Wi PTY Ltd tenants. IBS, Wellies, Khula Woyise and MT Naidoo Properties are scaffolded; the two family trusts are placeholders ready to be defined — tell Claude founder, trustees, beneficiaries and asset register.
        </p>
      </Card>

      <Card title="Today's queues" className="mt-4">
        <ul className="text-sm space-y-1">
          <li>3 unreviewed photos in technical queue</li>
          <li>1 help request open (within SLA)</li>
          <li>2 milestones due in next 14 days</li>
        </ul>
      </Card>
    </Shell>
  );
}
