/**
 * Offtaker Vetted Pool — Dashboard.
 *
 * Aggregates ECRDA offtaker submissions across all stages of the vetting
 * lifecycle. Reads live data from /offtaker-submissions/dashboard.
 */

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { offtakers, type OfftakerDashboardData } from '../../lib/api/offtakers';

const ACCENT = '#0E7490';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities', href: '/cc/director' },
  { key: 'F6', label: 'Growers',      href: '/cc/growers' },
  { key: 'G',  label: 'Engagements',  href: '/cc/engagements' },
];

const MOA_BASE = '/tenants/ibs/consulting/hempire-ec/ecrda-2026-2027-moa';
const STEP1 = `${MOA_BASE}/step-1-offtaker-vetting`;

const STATUS_LABELS: Record<string, string> = {
  draft:                'Draft',
  submitted:            'Submitted',
  screening:            'Initial screening',
  tna:                  'Technical Needs Analysis',
  verification:         'Verification',
  recommendation:       'Recommendation drafting',
  approved:             'Approved — in pool',
  approved_conditional: 'Approved (conditional)',
  declined:             'Declined',
  deferred:             'Deferred',
  withdrawn:            'Withdrawn',
};

const STATUS_COLORS: Record<string, string> = {
  draft: '#94a3b8', submitted: '#0E7490', screening: '#3b82f6',
  tna: '#7c3aed', verification: '#a16207', recommendation: '#d97706',
  approved: '#15803d', approved_conditional: '#16a34a',
  declined: '#b91c1c', deferred: '#64748b', withdrawn: '#475569',
};

const MOCK_DATA: OfftakerDashboardData = {
  total: 8,
  approvedCount: 3,
  approvedHaCapacity: 350,
  approvedFarmers: 42,
  byStatus: { submitted: 2, screening: 1, tna: 1, verification: 1, approved: 2, approved_conditional: 1 },
  byCategory: { 'Trader / Reseller': 2, 'Processor / Manufacturer': 4, 'Integrated Model (both)': 2 },
  byBbbee: { 'Level 1': 3, 'Level 2': 2, 'Level 4': 2, 'Unknown': 1 },
  byDistrict: { 'Amathole': 5, 'OR Tambo': 3, 'Sarah Baartman': 4, 'Joe Gqabi': 2, 'Chris Hani': 2, 'Buffalo City': 3 },
  byProduct: { 'flower': 6, 'seed': 4, 'bast': 3, 'hurd': 3, 'stalk': 1 },
  recent: [
    { legalName: 'Medigrow Health (Pty) Ltd',  offtakerCategory: 'Processor / Manufacturer', status: 'approved', submittedAt: '2026-04-12T09:30:00Z' },
    { legalName: 'Intsangu Extraction',        offtakerCategory: 'Processor / Manufacturer', status: 'approved', submittedAt: '2026-04-18T11:00:00Z' },
    { legalName: 'Hemporium',                  offtakerCategory: 'Integrated Model (both)',  status: 'approved_conditional', submittedAt: '2026-04-25T14:15:00Z' },
    { legalName: 'House of Hemp',              offtakerCategory: 'Processor / Manufacturer', status: 'verification', submittedAt: '2026-05-02T08:45:00Z' },
    { legalName: 'EC Fibre Co-op',             offtakerCategory: 'Trader / Reseller',        status: 'tna',          submittedAt: '2026-05-10T13:20:00Z' },
    { legalName: 'Greenleaf Naturals',         offtakerCategory: 'Processor / Manufacturer', status: 'screening',    submittedAt: '2026-05-18T10:00:00Z' },
    { legalName: 'Kumba Hemp Traders',         offtakerCategory: 'Trader / Reseller',        status: 'submitted',    submittedAt: '2026-05-25T15:30:00Z' },
    { legalName: 'Cape Bast Industries',       offtakerCategory: 'Integrated Model (both)',  status: 'submitted',    submittedAt: '2026-05-28T09:00:00Z' },
  ],
};

function Kpi({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color: accent || '#0f172a' }}>{value}</div>
      {sub ? <div className="text-xs text-slate-500 mt-0.5">{sub}</div> : null}
    </div>
  );
}

function bar(label: string, value: number, max: number, color: string) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-2">
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

function pillStatus(status: string) {
  const color = STATUS_COLORS[status] || '#475569';
  return (
    <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded"
          style={{ background: color + '20', color }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function OfftakerDashboard() {
  const [data, setData] = useState<OfftakerDashboardData | null>(null);
  const [usingMock, setUsingMock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiNote, setApiNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    offtakers.dashboard()
      .then(d => {
        if (cancelled) return;
        if (d.total === 0) {
          setData(MOCK_DATA); setUsingMock(true);
          setApiNote('No live offtaker submissions yet. Showing demo data until first submission lands.');
        } else {
          setData(d); setUsingMock(false); setApiNote(null);
        }
      })
      .catch(err => {
        if (cancelled) return;
        setData(MOCK_DATA); setUsingMock(true);
        setApiNote(`Live data unavailable (${err.message}). Showing demo data.`);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading || !data) {
    return (
      <Shell role="director" hotkeys={HOTKEYS}>
        <p className="text-sm text-slate-500 py-10 text-center">Loading offtaker dashboard…</p>
      </Shell>
    );
  }

  const maxDistrict = Math.max(1, ...Object.values(data.byDistrict));
  const maxProduct  = Math.max(1, ...Object.values(data.byProduct));
  const maxCategory = Math.max(1, ...Object.values(data.byCategory));
  const maxBbbee    = Math.max(1, ...Object.values(data.byBbbee));

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-3">
        <Link to="/cc/director" className="hover:underline">3Wi</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to={MOA_BASE} className="hover:underline">ECRDA 2026/2027 MOA</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <Link to={STEP1} className="hover:underline">Step 1 · Offtaker Vetting + TNA</Link>
        <span className="mx-1.5 text-slate-400">›</span>
        <span className="text-slate-900 font-semibold">Vetted Pool Dashboard</span>
      </nav>

      {/* Header */}
      <div className="rounded-2xl border-2 p-6 mb-6 max-w-7xl"
           style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0A` }}>
        <div className="flex items-start gap-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl text-white text-xl font-bold shrink-0"
                style={{ background: ACCENT }}>📦</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: ACCENT }}>
                Vetted Pool · Step 1 output
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Offtaker Submissions Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">
              Aggregated view of all offtaker submissions across the vetting lifecycle.
              Approved offtakers form the farmer-facing directory + feed Hub Blueprint design (Step 2).
            </p>
          </div>
        </div>
      </div>

      {/* Live / mock banner */}
      {usingMock ? (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 mb-4 text-xs text-amber-800 max-w-7xl">
          📊 <strong>Demo data shown.</strong> {apiNote}
        </div>
      ) : (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 mb-4 text-xs text-emerald-800 max-w-7xl">
          ✅ <strong>Live data.</strong> Reading from <code>offtaker_submissions</code> — {data.total} submission{data.total === 1 ? '' : 's'} aggregated.
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 max-w-7xl">
        <Kpi label="Total submissions" value={data.total} accent={ACCENT} />
        <Kpi label="Approved in pool"   value={data.approvedCount} sub={`${data.total ? Math.round((data.approvedCount/data.total)*100) : 0}% approval rate`} accent="#15803d" />
        <Kpi label="Approved Ha capacity" value={`${data.approvedHaCapacity.toLocaleString()} ha`} sub="across approved offtakers" accent="#15803d" />
        <Kpi label="Approved farmer reach" value={data.approvedFarmers.toLocaleString()} sub="farmers commitable" accent="#15803d" />
        <Kpi label="In pipeline"          value={data.total - data.approvedCount - (data.byStatus.declined || 0)} sub="awaiting decision" accent="#a16207" />
      </div>

      {/* Pipeline by status */}
      <div className="max-w-7xl mb-4">
        <Card title="Pipeline by status">
          {Object.entries(data.byStatus).length === 0 ? (
            <p className="text-sm text-slate-500 italic">No submissions yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Object.entries(data.byStatus).map(([status, count]) => (
                <div key={status} className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                  <div className="text-2xl font-bold" style={{ color: STATUS_COLORS[status] || '#0f172a' }}>{count}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-1">{STATUS_LABELS[status] || status}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Demand aggregation + Geographic + Pool composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mb-4">
        <Card title="Product demand — offtakers interested per category">
          {Object.entries(data.byProduct).length === 0 ? <p className="text-xs text-slate-500 italic">No data.</p> :
           Object.entries(data.byProduct).sort((a,b)=>b[1]-a[1]).map(([k,v]) => bar(k, v, maxProduct, '#0E7490'))}
        </Card>
        <Card title="Geographic interest — offtakers targeting each district">
          {Object.entries(data.byDistrict).length === 0 ? <p className="text-xs text-slate-500 italic">No data.</p> :
           Object.entries(data.byDistrict).sort((a,b)=>b[1]-a[1]).map(([k,v]) => bar(k, v, maxDistrict, '#15803d'))}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mb-4">
        <Card title="Pool composition — by offtaker category">
          {Object.entries(data.byCategory).length === 0 ? <p className="text-xs text-slate-500 italic">No data.</p> :
           Object.entries(data.byCategory).sort((a,b)=>b[1]-a[1]).map(([k,v]) => bar(k, v, maxCategory, '#7c3aed'))}
        </Card>
        <Card title="Pool composition — by B-BBEE level">
          {Object.entries(data.byBbbee).length === 0 ? <p className="text-xs text-slate-500 italic">No data.</p> :
           Object.entries(data.byBbbee).sort((a,b)=>b[1]-a[1]).map(([k,v]) => bar(k, v, maxBbbee, '#B45309'))}
        </Card>
      </div>

      {/* Recent submissions */}
      <div className="max-w-7xl mb-4">
        <Card title="Recent submissions (latest 10)">
          {data.recent.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-2 py-2">Offtaker</th>
                    <th className="text-left px-2 py-2">Category</th>
                    <th className="text-left px-2 py-2">Status</th>
                    <th className="text-left px-2 py-2">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((s, i) => (
                    <tr key={s.id || i} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-2 py-2 font-medium">{s.legalName}</td>
                      <td className="px-2 py-2 text-xs text-slate-600">{s.offtakerCategory || '—'}</td>
                      <td className="px-2 py-2">{pillStatus(s.status || 'submitted')}</td>
                      <td className="px-2 py-2 text-xs font-mono text-slate-500">
                        {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Quick links */}
      <div className="max-w-7xl flex flex-wrap gap-2">
        <a href="/offtaker-submission-form.html" target="_blank" rel="noopener"
           className="px-4 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: ACCENT }}>
          ↗ Issue new submission form
        </a>
        <Link to={STEP1} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50">
          ← Step 1 workflow
        </Link>
        <Link to={MOA_BASE} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50">
          MOA programme
        </Link>
      </div>
    </Shell>
  );
}
