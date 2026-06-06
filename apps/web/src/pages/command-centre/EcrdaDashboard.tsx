/**
 * Stage 6 — ECRDA closure dashboard (read-only).
 *
 * Read-only view of payment progress. Banking details NEVER appear.
 * Per-grower POP download via signed URL.
 */

import { useEffect, useMemo, useState } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { Td } from '../../components/ui/Table';
import {
  ecrda, formatRand, formatNum, statusPillClasses,
  type QueueDisbursement,
} from '../../lib/api/payment-process';
import { useAuthStore } from '../../lib/auth';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'POP dashboard', href: '/cc/ecrda' },
];

interface Summary {
  growerCount: number; paidCount: number; paidValue: number;
  totalEnvelope: number; remainingValue: number; percentPaid: number;
  byStatus: Record<string, { count: number; value: number }>;
}

export function EcrdaDashboard() {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [rows, setRows] = useState<QueueDisbursement[]>([]);
  const [district, setDistrict] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true); setError(null);
    try {
      const [s, d] = await Promise.all([ecrda.summary(), ecrda.disbursements(district || undefined)]);
      setSummary(s); setRows(d.disbursements);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, [district]);

  const districts = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => { if (r.grower.district) s.add(r.grower.district); });
    return Array.from(s).sort();
  }, [rows]);

  async function downloadPop(id: string) {
    try {
      const r = await ecrda.popUrl(id);
      window.open(r.url, '_blank');
    } catch (e) { alert((e as Error).message); }
  }

  return (
    <Shell role={user?.role ?? 'ecrda_viewer'} hotkeys={HOTKEYS}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">ECRDA — Sunshines Part 1 closure dashboard</h1>
        <p className="text-sm text-slate-500">
          Read-only view of disbursement status and proof-of-payment downloads. Banking details are not displayed.
        </p>
      </div>

      {error ? <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">{error}</div> : null}

      {/* Summary cards */}
      {summary ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <Kpi label="Growers" value={String(summary.growerCount)} accent="brown" />
          <Kpi label="Paid" value={`${summary.paidCount} / ${summary.growerCount}`} accent="green" />
          <Kpi label="Paid value" value={formatRand(summary.paidValue)} accent="green" />
          <Kpi label="Remaining" value={formatRand(summary.remainingValue)} accent="brown" />
          <Kpi label="% Complete" value={`${summary.percentPaid.toFixed(1)}%`} accent="yellow" />
        </div>
      ) : null}

      {/* Filters */}
      <Card title="Per-grower payment status" className="mb-4">
        <div className="mb-3 flex flex-wrap gap-3 items-center">
          <label className="text-xs font-semibold">Filter by district:</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm">
            <option value="">All</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {loading ? <p className="text-sm text-slate-500 py-6 text-center">Loading…</p> :
         rows.length === 0 ? <p className="text-sm text-slate-500 py-6 text-center">No records.</p> :
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Grower</th>
              <th className="px-3 py-2 text-left">District</th>
              <th className="px-3 py-2 text-left">Coordinator</th>
              <th className="px-3 py-2 text-right">Funded Ha</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Paid</th>
              <th className="px-3 py-2 text-left">POP</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <Td className="font-mono text-xs">{r.grower.externalRef}</Td>
                  <Td className="font-medium">{r.grower.fullName}</Td>
                  <Td>{r.grower.district ?? '—'}</Td>
                  <Td>{r.grower.coordinator ?? '—'}</Td>
                  <Td className="text-right tabular-nums">{formatNum(r.fundedHa)}</Td>
                  <Td className="text-right tabular-nums font-semibold">{formatRand(r.amountTotal)}</Td>
                  <Td>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${statusPillClasses(r.processStatus)}`}>
                      {r.processStatus}
                    </span>
                  </Td>
                  <Td className="text-xs">{r.paidAt ? r.paidAt.slice(0, 10) : '—'}</Td>
                  <Td>
                    {r.paymentRecord?.popStorageKey ? (
                      <button onClick={() => downloadPop(r.id)} className="text-xs text-[var(--brand-secondary,#015807)] underline">Download</button>
                    ) : <span className="text-xs text-slate-400">—</span>}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </Card>
    </Shell>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent: 'brown' | 'green' | 'yellow' }) {
  const accentBg = accent === 'green' ? 'bg-emerald-50 border-emerald-200' : accent === 'yellow' ? 'bg-amber-50 border-amber-200' : 'bg-[#FAF6E8] border-[#3F1101]/20';
  const accentText = accent === 'green' ? 'text-emerald-900' : accent === 'yellow' ? 'text-amber-900' : 'text-[#3F1101]';
  return (
    <div className={`rounded-lg border ${accentBg} px-3 py-3`}>
      <div className={`text-[10px] uppercase tracking-wide font-semibold ${accentText} opacity-70`}>{label}</div>
      <div className={`text-xl font-bold ${accentText} mt-0.5`}>{value}</div>
    </div>
  );
}
