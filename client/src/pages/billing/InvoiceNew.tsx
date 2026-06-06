/**
 * /cc/billing/invoices/new — create a new invoice (external or intercompany)
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';

const HEMPIRE = { brown: '#3F1101', green: '#015807', yellow: '#FDF31C' };
const UNITS = [
  'knockout-marketing','affinity-accounting','intelligent-capital',
  'maintenance-co','hr-payroll','skills-centre','wellies','ibs-sales','three-wi-pty',
];

export default function InvoiceNew() {
  const nav = useNavigate();
  const [search] = useSearchParams();
  const preCustomer = search.get('customer') ?? '';

  const [customers, setCustomers] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    providerUnitSlug: '',
    customerId: preCustomer,
    isIntercompany: false,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate:   new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    currency: 'ZAR',
    notes: '',
    lineItems: [{ serviceCode: '', description: '', quantity: 1, unit: '', unitPriceZar: 0, vatRatePct: 15 }],
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/customers').then(({ data }) => setCustomers(data));
  }, []);

  function updateLine(i: number, patch: any) {
    setForm((f: any) => {
      const lineItems = [...f.lineItems];
      lineItems[i] = { ...lineItems[i], ...patch };
      return { ...f, lineItems };
    });
  }
  function addLine()    { setForm((f: any) => ({ ...f, lineItems: [...f.lineItems, { serviceCode: '', description: '', quantity: 1, unit: '', unitPriceZar: 0, vatRatePct: 15 }] })); }
  function removeLine(i: number) { setForm((f: any) => ({ ...f, lineItems: f.lineItems.filter((_: any, idx: number) => idx !== i) })); }

  const subtotal  = form.lineItems.reduce((s: number, l: any) => s + Number(l.quantity) * Number(l.unitPriceZar), 0);
  const vatAmount = form.lineItems.reduce((s: number, l: any) => s + Number(l.quantity) * Number(l.unitPriceZar) * Number(l.vatRatePct) / 100, 0);
  const total = subtotal + vatAmount;

  // when customer selected — flip intercompany flag
  function setCustomer(id: string) {
    const c = customers.find(c => c.id === id);
    setForm((f: any) => ({ ...f, customerId: id, isIntercompany: c?.customerType === 'internal_unit' }));
  }

  async function submit(e: any) {
    e.preventDefault(); setBusy(true);
    try {
      const payload = {
        ...form,
        lineItems: form.lineItems.map((l: any) => ({
          ...l,
          quantity:     Number(l.quantity),
          unitPriceZar: Number(l.unitPriceZar),
          vatRatePct:   Number(l.vatRatePct),
        })),
      };
      const { data } = await api.post('/invoices', payload);
      nav(`/cc/billing/invoices/${data.id}`);
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} style={{ padding: 24, fontFamily: 'Roboto, sans-serif', maxWidth: 980 }}>
      <h1 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown }}>New Invoice</h1>

      {/* HEADER */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        <Row label="Provider unit *">
          <select required value={form.providerUnitSlug} onChange={e => setForm({ ...form, providerUnitSlug: e.target.value })} style={inp}>
            <option value="">— select —</option>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </Row>
        <Row label="Customer *">
          <select required value={form.customerId} onChange={e => setCustomer(e.target.value)} style={inp}>
            <option value="">— select —</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.displayName} {c.customerType === 'internal_unit' ? '· [INTERNAL]' : ''}
              </option>
            ))}
          </select>
        </Row>
        <Row label="Issue date"><input type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} style={inp} /></Row>
        <Row label="Due date *"><input type="date" required value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} style={inp} /></Row>
      </div>

      {form.isIntercompany && (
        <div style={{ background: HEMPIRE.yellow, color: HEMPIRE.brown, padding: 10, borderRadius: 4, marginBottom: 16, fontSize: 13 }}>
          <strong>Intercompany invoice</strong> — this will be flagged for elimination at group consolidation.
        </div>
      )}

      {/* LINE ITEMS */}
      <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, fontSize: 16 }}>Line items</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
        <thead>
          <tr style={{ background: HEMPIRE.brown, color: 'white' }}>
            <Th>Code</Th><Th>Description</Th><Th align="right">Qty</Th><Th>Unit</Th>
            <Th align="right">Price (ZAR)</Th><Th align="right">VAT %</Th><Th align="right">Total</Th><Th></Th>
          </tr>
        </thead>
        <tbody>
          {form.lineItems.map((l: any, i: number) => {
            const line = Number(l.quantity) * Number(l.unitPriceZar);
            return (
              <tr key={i}>
                <Td><input value={l.serviceCode} onChange={e => updateLine(i, { serviceCode: e.target.value })} style={inpSmall} /></Td>
                <Td><input value={l.description} onChange={e => updateLine(i, { description: e.target.value })} required style={inpSmall} /></Td>
                <Td align="right"><input type="number" step="0.01" value={l.quantity} onChange={e => updateLine(i, { quantity: e.target.value })} style={{ ...inpSmall, width: 70, textAlign: 'right' }} /></Td>
                <Td><input value={l.unit} onChange={e => updateLine(i, { unit: e.target.value })} placeholder="hour, ea." style={{ ...inpSmall, width: 80 }} /></Td>
                <Td align="right"><input type="number" step="0.01" value={l.unitPriceZar} onChange={e => updateLine(i, { unitPriceZar: e.target.value })} style={{ ...inpSmall, width: 110, textAlign: 'right' }} /></Td>
                <Td align="right"><input type="number" step="0.1" value={l.vatRatePct} onChange={e => updateLine(i, { vatRatePct: e.target.value })} style={{ ...inpSmall, width: 60, textAlign: 'right' }} /></Td>
                <Td align="right" style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown }}>{ZAR(line)}</Td>
                <Td><button type="button" onClick={() => removeLine(i)} style={{ background: 'none', border: 'none', color: '#b00020', cursor: 'pointer' }}>×</button></Td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button type="button" onClick={addLine} style={btnGhost}>+ Add line</button>

      {/* TOTALS */}
      <div style={{ marginTop: 16, marginLeft: 'auto', maxWidth: 280 }}>
        <Total label="Subtotal" value={ZAR(subtotal)} />
        <Total label="VAT" value={ZAR(vatAmount)} />
        <Total label="Total" value={ZAR(total)} bold />
      </div>

      <Row label="Notes (visible to customer)">
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 60 }} />
      </Row>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
        <button type="button" onClick={() => nav(-1)} style={btnGhost}>Cancel</button>
        <button type="submit" disabled={busy} style={btnGreen}>{busy ? 'Creating…' : 'Create Invoice'}</button>
      </div>
    </form>
  );
}

function ZAR(v: any) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 2 }).format(Number(v ?? 0));
}
const Row = ({ label, children }: any) => (<div style={{ marginBottom: 10 }}><label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>{label}</label>{children}</div>);
const inp: React.CSSProperties = { width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: 3, fontSize: 14, boxSizing: 'border-box' };
const inpSmall: React.CSSProperties = { ...inp, padding: '4px 8px', fontSize: 13 };
const Th = ({ children, align }: any) => <th style={{ textAlign: align ?? 'left', padding: '6px 8px', fontSize: 12, fontWeight: 500 }}>{children}</th>;
const Td = ({ children, align, style }: any) => <td style={{ textAlign: align ?? 'left', padding: '4px 8px', fontSize: 13, ...style }}>{children}</td>;
const btnGreen: React.CSSProperties = { padding: '8px 14px', background: HEMPIRE.green, color: 'white', border: 'none', borderRadius: 3, fontSize: 14, cursor: 'pointer' };
const btnGhost: React.CSSProperties = { padding: '6px 12px', background: 'transparent', color: HEMPIRE.brown, border: `1px solid ${HEMPIRE.brown}`, borderRadius: 3, fontSize: 13, cursor: 'pointer' };
const Total = ({ label, value, bold }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: bold ? 16 : 14, fontFamily: bold ? 'Ubuntu' : 'Roboto', color: HEMPIRE.brown, borderTop: bold ? `2px solid ${HEMPIRE.brown}` : undefined }}>
    <span>{label}</span><span>{value}</span>
  </div>
);
