/**
 * /cc/billing/customers — list + filter + create
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

const HEMPIRE = { brown: '#3F1101', green: '#015807', yellow: '#FDF31C' };

type Customer = {
  id: string;
  displayName: string;
  companyName?: string;
  customerType: 'external' | 'internal_unit';
  internalUnitSlug?: string;
  primaryEmail: string;
  status: string;
  industry?: string;
  paymentTerms: string;
};

export function CustomersList() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<'all' | 'external' | 'internal_unit'>('all');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  async function reload() {
    setLoading(true);
    const qs = new URLSearchParams();
    if (filter !== 'all') qs.set('type', filter);
    if (q) qs.set('q', q);
    const data = await api<Customer[]>(`/customers${qs.toString() ? '?' + qs : ''}`);
    setRows(data);
    setLoading(false);
  }
  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filter]);

  const counts = useMemo(() => ({
    all: rows.length,
    external: rows.filter(r => r.customerType === 'external').length,
    internal: rows.filter(r => r.customerType === 'internal_unit').length,
  }), [rows]);

  return (
    <div style={{ padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontFamily: 'Ubuntu, sans-serif', color: HEMPIRE.brown, margin: 0 }}>Customers</h1>
        <button onClick={() => setShowCreate(true)} style={btnGreen}>+ New Customer</button>
      </div>

      <div style={{ display: 'flex', gap: 4, borderBottom: `2px solid ${HEMPIRE.brown}`, marginBottom: 16 }}>
        {(['all','external','internal_unit'] as const).map(t => (
          <button key={t} onClick={() => setFilter(t)} style={tabStyle(filter === t)}>
            {t === 'all' ? 'All' : t === 'external' ? 'External' : 'Intercompany'}{' '}
            <span style={{ opacity: 0.6 }}>({t === 'all' ? counts.all : t === 'external' ? counts.external : counts.internal})</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <input placeholder="Search name, email, VAT…" value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') void reload(); }}
          style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: 3 }} />
        <button onClick={() => void reload()} style={btnBrown}>Search</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: HEMPIRE.brown, color: 'white' }}>
              <Th>Name</Th><Th>Type</Th><Th>Email</Th><Th>Status</Th><Th>Industry</Th><Th>Terms</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} style={{ padding: 16, color: '#666' }}>No customers found.</td></tr>}
            {rows.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                <Td><Link to={`/cc/billing/customers/${c.id}`} style={{ color: HEMPIRE.green }}>{c.displayName}</Link></Td>
                <Td>{c.customerType === 'internal_unit'
                  ? <span style={{ ...pill, background: HEMPIRE.yellow, color: HEMPIRE.brown }}>Intercompany · {c.internalUnitSlug ?? '—'}</span>
                  : <span style={{ ...pill, background: '#e8f5e9', color: HEMPIRE.green }}>External</span>}</Td>
                <Td>{c.primaryEmail}</Td><Td>{c.status}</Td>
                <Td>{c.industry ?? '—'}</Td><Td>{c.paymentTerms}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreate && <CreateCustomerModal onClose={() => setShowCreate(false)} onSaved={() => { setShowCreate(false); void reload(); }} />}
    </div>
  );
}

function CreateCustomerModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({
    customerType: 'external', displayName: '', companyName: '',
    primaryEmail: '', paymentTerms: 'Net 30',
  });
  const [busy, setBusy] = useState(false);
  async function submit(e: any) {
    e.preventDefault(); setBusy(true);
    try {
      await api('/customers', { method: 'POST', body: JSON.stringify(form) });
      onSaved();
    } catch (err) {
      alert((err as Error).message);
    } finally { setBusy(false); }
  }
  return (
    <div style={modalBackdrop}>
      <form onSubmit={submit} style={modalCard}>
        <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, marginTop: 0 }}>New Customer</h2>
        <Row label="Type">
          <select value={form.customerType} onChange={e => setForm({ ...form, customerType: e.target.value })} style={inp}>
            <option value="external">External (paying client)</option>
            <option value="internal_unit">Intercompany (3Wi unit)</option>
          </select>
        </Row>
        {form.customerType === 'internal_unit' && (
          <Row label="3Wi Unit Slug">
            <input value={form.internalUnitSlug ?? ''} onChange={e => setForm({ ...form, internalUnitSlug: e.target.value })}
              placeholder="e.g. wellies, knockout-marketing" style={inp} />
          </Row>
        )}
        <Row label="Display Name *">
          <input required value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} style={inp} />
        </Row>
        <Row label="Company">
          <input value={form.companyName ?? ''} onChange={e => setForm({ ...form, companyName: e.target.value })} style={inp} />
        </Row>
        <Row label="Primary Email *">
          <input required type="email" value={form.primaryEmail} onChange={e => setForm({ ...form, primaryEmail: e.target.value })} style={inp} />
        </Row>
        <Row label="VAT Number">
          <input value={form.vatNumber ?? ''} onChange={e => setForm({ ...form, vatNumber: e.target.value })} style={inp} />
        </Row>
        <Row label="Payment Terms">
          <select value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value })} style={inp}>
            <option>Due on receipt</option><option>Net 7</option><option>Net 15</option>
            <option>Net 30</option><option>Net 45</option><option>Net 60</option>
          </select>
        </Row>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
          <button type="submit" disabled={busy} style={btnGreen}>{busy ? 'Saving…' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}

const Th = ({ children }: any) => <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 500 }}>{children}</th>;
const Td = ({ children }: any) => <td style={{ padding: '8px 12px', fontSize: 14 }}>{children}</td>;
const pill: React.CSSProperties = { padding: '2px 8px', borderRadius: 999, fontSize: 11 };
const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 14px', background: active ? HEMPIRE.brown : 'transparent',
  color: active ? 'white' : HEMPIRE.brown, border: 'none', cursor: 'pointer',
  fontFamily: 'Roboto', fontSize: 13, borderRadius: '3px 3px 0 0',
});
const btnBrown: React.CSSProperties = { padding: '6px 12px', background: HEMPIRE.brown, color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer' };
const btnGreen: React.CSSProperties = { ...btnBrown, background: HEMPIRE.green };
const btnGhost: React.CSSProperties = { ...btnBrown, background: 'transparent', color: HEMPIRE.brown, border: `1px solid ${HEMPIRE.brown}` };
const modalBackdrop: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modalCard: React.CSSProperties = { background: 'white', padding: 24, borderRadius: 6, width: 480, maxHeight: '90vh', overflowY: 'auto' };
const Row = ({ label, children }: any) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>{label}</label>{children}
  </div>
);
const inp: React.CSSProperties = { width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: 3, fontSize: 14 };
