/**
 * /cc/billing/invoices/:id — single invoice (line items, payments, status workflow)
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

const HEMPIRE = { brown: '#3F1101', green: '#015807', yellow: '#FDF31C' };
function ZAR(v: any) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 2 }).format(Number(v ?? 0));
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const [inv, setInv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPay, setShowPay] = useState(false);

  async function reload() {
    const { data } = await api.get(`/invoices/${id}`);
    setInv(data); setLoading(false);
  }
  useEffect(() => { reload(); }, [id]);

  async function changeStatus(status: string) {
    await api.patch(`/invoices/${id}`, { status, ...(status === 'sent' ? { sentAt: new Date().toISOString() } : {}) });
    reload();
  }

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!inv) return <div style={{ padding: 24 }}>Not found.</div>;

  return (
    <div style={{ padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <Link to="/cc/billing/invoices" style={{ color: HEMPIRE.green, fontSize: 13 }}>← Back to invoices</Link>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8, marginBottom: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, margin: 0 }}>{inv.invoiceNumber}</h1>
          <div style={{ color: '#666', fontSize: 14 }}>
            {inv.providerUnitSlug} → <Link to={`/cc/billing/customers/${inv.customer.id}`} style={{ color: HEMPIRE.green }}>{inv.customer.displayName}</Link>
            {inv.isIntercompany && <span style={{ marginLeft: 8, fontSize: 11, background: HEMPIRE.yellow, color: HEMPIRE.brown, padding: '2px 8px', borderRadius: 999 }}>Intercompany</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {inv.status === 'draft' && <button onClick={() => changeStatus('sent')}    style={btnBrown}>Mark as Sent</button>}
          {!['paid','void'].includes(inv.status) && <button onClick={() => setShowPay(true)} style={btnGreen}>+ Record Payment</button>}
          {inv.status !== 'void' && <button onClick={() => changeStatus('void')} style={btnGhost}>Void</button>}
        </div>
      </div>

      {/* META STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
        <Meta label="Status" value={inv.status} />
        <Meta label="Issued" value={new Date(inv.issueDate).toLocaleDateString()} />
        <Meta label="Due" value={new Date(inv.dueDate).toLocaleDateString()} />
        <Meta label="Total" value={ZAR(inv.totalZar)} />
        <Meta label="Balance" value={ZAR(inv.balanceDueZar)} highlight />
      </div>

      {/* LINE ITEMS */}
      <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, fontSize: 16 }}>Line items</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: HEMPIRE.brown, color: 'white' }}>
            <Th>Code</Th><Th>Description</Th><Th align="right">Qty</Th><Th>Unit</Th>
            <Th align="right">Price</Th><Th align="right">VAT %</Th><Th align="right">Line Total</Th>
          </tr>
        </thead>
        <tbody>
          {inv.lineItems.map((li: any) => (
            <tr key={li.id} style={{ borderBottom: '1px solid #eee' }}>
              <Td>{li.serviceCode ?? '—'}</Td>
              <Td>{li.description}</Td>
              <Td align="right">{Number(li.quantity)}</Td>
              <Td>{li.unit ?? '—'}</Td>
              <Td align="right">{ZAR(li.unitPriceZar)}</Td>
              <Td align="right">{Number(li.vatRatePct)}%</Td>
              <Td align="right">{ZAR(li.lineTotalZar)}</Td>
            </tr>
          ))}
          <tr><Td colSpan={6 as any} align="right"><strong>Subtotal</strong></Td><Td align="right">{ZAR(inv.subtotalZar)}</Td></tr>
          <tr><Td colSpan={6 as any} align="right"><strong>VAT</strong></Td>     <Td align="right">{ZAR(inv.vatAmountZar)}</Td></tr>
          <tr><Td colSpan={6 as any} align="right"><strong>Total</strong></Td>   <Td align="right" ><strong>{ZAR(inv.totalZar)}</strong></Td></tr>
          <tr><Td colSpan={6 as any} align="right"><strong>Paid</strong></Td>    <Td align="right">{ZAR(inv.amountPaidZar)}</Td></tr>
          <tr><Td colSpan={6 as any} align="right"><strong>Balance Due</strong></Td><Td align="right" style={{ color: HEMPIRE.brown }}><strong>{ZAR(inv.balanceDueZar)}</strong></Td></tr>
        </tbody>
      </table>

      {/* PAYMENTS */}
      <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, fontSize: 16 }}>Payments</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: HEMPIRE.brown, color: 'white' }}>
            <Th>Date</Th><Th>Method</Th><Th>Reference</Th><Th align="right">Amount</Th><Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {inv.payments.length === 0 && <tr><td colSpan={5} style={{ padding: 12, color: '#666' }}>No payments yet.</td></tr>}
          {inv.payments.map((p: any) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <Td>{new Date(p.paymentDate).toLocaleDateString()}</Td>
              <Td>{p.method.replace(/_/g, ' ')}</Td>
              <Td>{p.reference ?? '—'}</Td>
              <Td align="right">{ZAR(p.amountZar)}</Td>
              <Td>{p.notes ?? '—'}</Td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPay && <PayModal invoiceId={inv.id} suggestedAmount={Number(inv.balanceDueZar)}
        isIntercompany={inv.isIntercompany}
        onClose={() => setShowPay(false)} onSaved={() => { setShowPay(false); reload(); }} />}
    </div>
  );
}

function PayModal({ invoiceId, suggestedAmount, isIntercompany, onClose, onSaved }:
  { invoiceId: string; suggestedAmount: number; isIntercompany: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({
    paymentDate: new Date().toISOString().slice(0, 10),
    amountZar:   suggestedAmount,
    method:      isIntercompany ? 'intercompany_netting' : 'bank_transfer',
    reference:   '',
    notes:       '',
  });
  const [busy, setBusy] = useState(false);
  async function submit(e: any) {
    e.preventDefault(); setBusy(true);
    try { await api.post(`/invoices/${invoiceId}/payments`, { ...form, amountZar: Number(form.amountZar) }); onSaved(); }
    finally { setBusy(false); }
  }
  return (
    <div style={modalBackdrop}>
      <form onSubmit={submit} style={modalCard}>
        <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, marginTop: 0 }}>Record Payment</h2>
        <Row label="Date">       <input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} style={inp} /></Row>
        <Row label="Amount (ZAR)"><input type="number" step="0.01" value={form.amountZar} onChange={e => setForm({ ...form, amountZar: e.target.value })} style={inp} /></Row>
        <Row label="Method">
          <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} style={inp}>
            <option value="bank_transfer">Bank transfer</option>
            <option value="cash">Cash</option>
            <option value="mobile">Mobile</option>
            <option value="card">Card</option>
            <option value="cheque">Cheque</option>
            <option value="intercompany_netting">Intercompany netting</option>
            <option value="other">Other</option>
          </select>
        </Row>
        <Row label="Reference"> <input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} style={inp} /></Row>
        <Row label="Notes">     <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 60 }} /></Row>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
          <button type="submit" disabled={busy} style={btnGreen}>{busy ? 'Saving…' : 'Record'}</button>
        </div>
      </form>
    </div>
  );
}

const Meta = ({ label, value, highlight }: any) => (
  <div style={{ background: highlight ? HEMPIRE.yellow : '#fafafa', padding: 10, borderRadius: 4, border: '1px solid #eee' }}>
    <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontFamily: 'Ubuntu', fontSize: 16, color: HEMPIRE.brown, marginTop: 2 }}>{value}</div>
  </div>
);
const Th = ({ children, align }: any) => <th style={{ textAlign: align ?? 'left', padding: '8px 12px', fontSize: 12, fontWeight: 500 }}>{children}</th>;
const Td = ({ children, align, style, colSpan }: any) => <td colSpan={colSpan} style={{ textAlign: align ?? 'left', padding: '8px 12px', fontSize: 14, ...style }}>{children}</td>;
const btnBrown: React.CSSProperties = { padding: '8px 14px', background: HEMPIRE.brown, color: 'white', border: 'none', borderRadius: 3, fontSize: 14, cursor: 'pointer' };
const btnGreen: React.CSSProperties = { ...btnBrown, background: HEMPIRE.green };
const btnGhost: React.CSSProperties = { ...btnBrown, background: 'transparent', color: HEMPIRE.brown, border: `1px solid ${HEMPIRE.brown}` };
const modalBackdrop: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const modalCard: React.CSSProperties = { background: 'white', padding: 24, borderRadius: 6, width: 420 };
const Row = ({ label, children }: any) => (<div style={{ marginBottom: 10 }}><label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 4 }}>{label}</label>{children}</div>);
const inp: React.CSSProperties = { width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: 3, fontSize: 14 };
