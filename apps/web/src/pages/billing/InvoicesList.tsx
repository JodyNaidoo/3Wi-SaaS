/**
 * /cc/billing/invoices — group-wide invoice ledger with unit/status/intercompany filters
 *
 * NOTE: renamed component to `InvoicesLedger` to avoid clashing with the
 * pre-existing `Invoices` (Stripe history) page in this folder.
 */
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';

const HEMPIRE = { brown: '#3F1101', green: '#015807', yellow: '#FDF31C' };
const UNITS = [
  'knockout-marketing','affinity-accounting','intelligent-capital',
  'maintenance-co','hr-payroll','skills-centre','wellies','ibs-sales','three-wi-pty',
];
const STATUSES = ['draft','sent','viewed','partial','paid','overdue','void'];

const ZAR = (v: any) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(Number(v ?? 0));

export function InvoicesLedger() {
  const [search, setSearch] = useSearchParams();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const status        = search.get('status') ?? '';
  const unit          = search.get('unit') ?? '';
  const intercompany  = search.get('intercompany') ?? '';

  async function reload() {
    setLoading(true);
    const qs = new URLSearchParams();
    if (status)       qs.set('status', status);
    if (unit)         qs.set('unit', unit);
    if (intercompany) qs.set('intercompany', intercompany);
    const data = await api<any[]>(`/invoices${qs.toString() ? '?' + qs : ''}`);
    setRows(data);
    setLoading(false);
  }
  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [status, unit, intercompany]);

  function setFilter(key: string, val: string) {
    const next = new URLSearchParams(search);
    if (val) next.set(key, val); else next.delete(key);
    setSearch(next);
  }

  const totalBalance = rows.reduce((s, r) => s + Number(r.balanceDueZar ?? 0), 0);

  return (
    <div style={{ padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, margin: 0 }}>Invoices</h1>
        <Link to="/cc/billing/invoices/new" style={btnGreen}>+ New Invoice</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Select label="Status" value={status} onChange={v => setFilter('status', v)} options={STATUSES} />
        <Select label="Unit"   value={unit}   onChange={v => setFilter('unit', v)}   options={UNITS}    />
        <Select label="Type"   value={intercompany} onChange={v => setFilter('intercompany', v)}
          options={[{ value: '', label: 'All' }, { value: 'false', label: 'External' }, { value: 'true', label: 'Intercompany' }]} />
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 13, color: '#666' }}>
          {rows.length} invoice{rows.length !== 1 ? 's' : ''} · open balance <strong style={{ color: HEMPIRE.brown }}>{ZAR(totalBalance)}</strong>
        </div>
      </div>

      {loading ? <div>Loading…</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: HEMPIRE.brown, color: 'white' }}>
              <Th>Number</Th><Th>Unit</Th><Th>Customer</Th><Th>Issued</Th><Th>Due</Th>
              <Th align="right">Total</Th><Th align="right">Balance</Th><Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={8} style={{ padding: 16, color: '#666' }}>No invoices match these filters.</td></tr>}
            {rows.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee', background: r.isIntercompany ? 'rgba(253,243,28,0.08)' : undefined }}>
                <Td>
                  <Link to={`/cc/billing/invoices/${r.id}`} style={{ color: HEMPIRE.green }}>{r.invoiceNumber}</Link>
                  {r.isIntercompany && <span style={{ marginLeft: 6, fontSize: 10, background: HEMPIRE.yellow, color: HEMPIRE.brown, padding: '1px 6px', borderRadius: 4 }}>IC</span>}
                </Td>
                <Td>{r.providerUnitSlug}</Td>
                <Td>{r.customer?.displayName ?? '—'}</Td>
                <Td>{new Date(r.issueDate).toLocaleDateString()}</Td>
                <Td>{new Date(r.dueDate).toLocaleDateString()}</Td>
                <Td align="right">{ZAR(r.totalZar)}</Td>
                <Td align="right">{ZAR(r.balanceDueZar)}</Td>
                <Td><span style={statusPill(r.status)}>{r.status}</span></Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }:
  { label: string; value: string; onChange: (v: string) => void; options: any[] }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span style={{ color: '#666' }}>{label}:</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: 3, fontSize: 13 }}>
        <option value="">All</option>
        {options.map((o: any) => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
const Th = ({ children, align }: any) => <th style={{ textAlign: align ?? 'left', padding: '8px 12px', fontSize: 12, fontWeight: 500 }}>{children}</th>;
const Td = ({ children, align }: any) => <td style={{ textAlign: align ?? 'left', padding: '8px 12px', fontSize: 14 }}>{children}</td>;
const btnGreen: React.CSSProperties = { padding: '8px 14px', background: HEMPIRE.green, color: 'white', textDecoration: 'none', borderRadius: 3, fontSize: 14 };
function statusPill(s: string): React.CSSProperties {
  const map: Record<string, [string, string]> = {
    draft:   ['#f5f5f5', '#666'],
    sent:    ['#e3f2fd', '#0d47a1'],
    viewed:  ['#e1f5fe', '#01579b'],
    partial: ['#fff3e0', '#8a4b00'],
    paid:    ['#e8f5e9', HEMPIRE.green],
    overdue: ['#fdecea', '#b00020'],
    void:    ['#f5f5f5', '#999'],
  };
  const [bg, fg] = map[s] ?? ['#f5f5f5', '#666'];
  return { background: bg, color: fg, padding: '2px 10px', borderRadius: 999, fontSize: 11 };
}
