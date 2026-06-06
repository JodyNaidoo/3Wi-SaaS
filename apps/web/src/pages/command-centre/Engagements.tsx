/**
 * Engagements queue — operations view.
 *
 * Lists every engagement against any shared-service offering across the
 * tenant. Used by ops to triage and progress engagements through the
 * lifecycle.
 *
 * Detail page: /cc/engagements/:id
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { engagements, statusPillClasses, type Engagement, type EngagementStatus } from '../../lib/api/engagements';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities',  href: '/cc/director' },
  { key: 'F6', label: 'Growers',       href: '/cc/growers' },
  { key: 'G', label: 'Engagements',    href: '/cc/engagements' },
];

const ALL_STATUSES: EngagementStatus[] = ['requested', 'accepted', 'in_progress', 'delivered', 'closed', 'cancelled'];

export function EngagementsCC() {
  const [items, setItems] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<EngagementStatus | ''>('');

  async function load() {
    setLoading(true); setError(null);
    try {
      const r = await engagements.list(statusFilter ? { status: statusFilter } : undefined);
      setItems(r.engagements);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]);

  const totals = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = items.filter((i) => i.status === s).length;
    return acc;
  }, {});

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Engagements queue</h1>
        <p className="text-sm text-slate-500">
          All service engagements across the tenant. Click a row to view detail and progress lifecycle.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            className={`text-left rounded-xl border p-3 transition-all ${statusFilter === s ? 'border-slate-900 shadow' : 'border-slate-200 hover:border-slate-400'}`}
          >
            <div className={`inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${statusPillClasses(s)}`}>{s.replace('_', ' ')}</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{totals[s] ?? 0}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card title={statusFilter ? `Filtered: ${statusFilter.replace('_', ' ')}` : 'All engagements'}>
        {error ? <div className="text-sm text-rose-700 py-2">{error}</div> : null}

        {loading ? <p className="text-sm text-slate-500 py-6 text-center">Loading…</p> :
         items.length === 0 ? <p className="text-sm text-slate-500 py-6 text-center">No engagements yet.</p> :
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2 text-left">Service</th>
              <th className="px-3 py-2 text-left">Client</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Budget</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Requested</th>
            </tr></thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <Link to={`/cc/engagements/${e.id}`} className="font-semibold text-slate-900 hover:underline">
                      {e.serviceName}
                    </Link>
                    <div className="text-xs text-slate-500">{e.serviceUnit}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div>{e.clientName}</div>
                    {e.clientCompany ? <div className="text-xs text-slate-500">{e.clientCompany}</div> : null}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{e.clientEmail}</td>
                  <td className="px-3 py-2 text-xs">{e.budgetIndication ?? '—'}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${statusPillClasses(e.status)}`}>
                      {e.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500">{new Date(e.requestedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </Card>
    </Shell>
  );
}
