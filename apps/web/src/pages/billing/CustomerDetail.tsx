/**
 * /cc/billing/customers/:id — 360° view of one customer (external or intercompany)
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

const HEMPIRE = { brown: '#3F1101', green: '#015807', yellow: '#FDF31C' };
const ZAR = (v: any) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 2 }).format(Number(v ?? 0));

export function CustomerDetail() {
  const { id } = useParams();
  const [c, setC] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try { setC(await api<any>(`/customers/${id}`)); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [id]);
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!c) return <div style={{ padding: 24 }}>Not found.</div>;

  const totalOpen = (c.invoices ?? [])
    .filter((i: any) => !['paid','void'].includes(i.status))
    .reduce((s: number, i: any) => s + Number(i.balanceDueZar ?? 0), 0);

  return (
    <div style={{ padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <Link to="/cc/billing/customers" style={{ color: HEMPIRE.green, fontSize: 13 }}>← Back to customers</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8, marginBottom: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, margin: 0 }}>{c.displayName}</h1>
          <div style={{ color: '#666', fontSize: 14 }}>{c.companyName ?? c.primaryEmail}</div>
          <div style={{ marginTop: 8 }}>
            {c.customerType === 'internal_unit'
              ? <span style={{ background: HEMPIRE.yellow, color: HEMPIRE.brown, padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>Intercompany · {c.internalUnitSlug}</span>
              : <span style={{ background: '#e8f5e9', color: HEMPIRE.green, padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>External</span>}
            <span style={{ marginLeft: 8, padding: '4px 10px', borderRadius: 999, background: '#f5f5f5', fontSize: 12 }}>{c.status}</span>
          </div>
        </div>
        <Link to={`/cc/billing/invoices/new?customer=${c.id}`} style={btnGreen}>+ New Invoice</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <Kpi label="Total Owing"   value={ZAR(totalOpen)} tone="brown" />
        <Kpi label="Open Invoices" value={String((c.invoices ?? []).filter((i: any) => !['paid','void'].includes(i.status)).length)} tone="brown" />
        <Kpi label="Payment Terms" value={c.paymentTerms} tone="green" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card title="Contact">
          <Pair k="Email" v={c.primaryEmail} /><Pair k="Phone" v={c.primaryPhone} />
          <Pair k="Mobile" v={c.mobile} /><Pair k="Website" v={c.website} />
        </Card>
        <Card title="Tax & Compliance">
          <Pair k="VAT #" v={c.vatNumber} /><Pair k="Company Reg #" v={c.companyRegNumber} />
          <Pair k="BBBEE Level" v={c.bbbeeLevel} /><Pair k="Currency" v={c.currency} />
        </Card>
        <Card title="Billing Address">
          <div style={{ fontSize: 14 }}>
            {[c.billLine1, c.billLine2, c.billCity, c.billProvince, c.billPostal, c.billCountry].filter(Boolean).join(', ') || '—'}
          </div>
        </Card>
        <Card title="Notes">
          <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{c.notes || '—'}</div>
        </Card>
      </div>

      <h2 style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, fontSize: 18 }}>Invoices</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: HEMPIRE.brown, color: 'white' }}>
            <Th>Number</Th><Th>Issued</Th><Th>Due</Th><Th align="right">Total</Th>
            <Th align="right">Paid</Th><Th align="right">Balance</Th><Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {(c.invoices ?? []).length === 0 && <tr><td colSpan={7} style={{ padding: 12, color: '#666' }}>No invoices yet.</td></tr>}
          {(c.invoices ?? []).map((i: any) => (
            <tr key={i.id} style={{ borderBottom: '1px solid #eee' }}>
              <Td><Link to={`/cc/billing/invoices/${i.id}`} style={{ color: HEMPIRE.green }}>{i.invoiceNumber}</Link></Td>
              <Td>{new Date(i.issueDate).toLocaleDateString()}</Td>
              <Td>{new Date(i.dueDate).toLocaleDateString()}</Td>
              <Td align="right">{ZAR(i.totalZar)}</Td>
              <Td align="right">{ZAR(i.amountPaidZar)}</Td>
              <Td align="right">{ZAR(i.balanceDueZar)}</Td>
              <Td>{i.status}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Kpi = ({ label, value, tone }: any) => {
  const color = tone === 'green' ? HEMPIRE.green : HEMPIRE.brown;
  return (
    <div style={{ background: 'white', border: `1px solid ${color}`, padding: 14, borderRadius: 4 }}>
      <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'Ubuntu', fontSize: 20, color, marginTop: 4 }}>{value}</div>
    </div>
  );
};
const Card = ({ title, children }: any) => (
  <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 4, padding: 14 }}>
    <div style={{ fontFamily: 'Ubuntu', color: HEMPIRE.brown, fontSize: 14, marginBottom: 8 }}>{title}</div>{children}
  </div>
);
const Pair = ({ k, v }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', borderBottom: '1px dashed #eee' }}>
    <span style={{ color: '#666' }}>{k}</span><span>{v || '—'}</span>
  </div>
);
const Th = ({ children, align }: any) => <th style={{ textAlign: align ?? 'left', padding: '8px 12px', fontSize: 12, fontWeight: 500 }}>{children}</th>;
const Td = ({ children, align }: any) => <td style={{ textAlign: align ?? 'left', padding: '8px 12px', fontSize: 14 }}>{children}</td>;
const btnGreen: React.CSSProperties = { padding: '8px 14px', background: HEMPIRE.green, color: 'white', textDecoration: 'none', borderRadius: 3, fontSize: 14 };
