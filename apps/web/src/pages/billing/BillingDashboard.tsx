/**
 * /cc/billing — Group billing dashboard
 * Hempire palette: #3F1101 brown, #015807 green, #FDF31C yellow
 * Type-faces: Ubuntu (headings) + Roboto (body)
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

type Totals = {
  open_count: number;
  open_balance_zar: string;
  overdue_zar: string;
  billed_mtd_zar: string;
  intercompany_mtd_zar: string;
};
type AgeingRow = {
  id: string; invoice_number: string; customer_name: string;
  provider_unit_slug: string; balance_due_zar: string; due_date: string;
  ageing_bucket: string; days_overdue: number; status: string;
};

const HEMPIRE = { brown: '#3F1101', green: '#015807', yellow: '#FDF31C' };
const ZAR = (v: any) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(Number(v ?? 0));

export function BillingDashboard() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [ageing, setAgeing] = useState<AgeingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, a] = await Promise.all([
          api<Totals>('/invoices/_summary/totals'),
          api<AgeingRow[]>('/invoices/_summary/ageing'),
        ]);
        setTotals(t);
        setAgeing(a);
      } catch (err) {
        console.error('[billing dashboard]', err);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div style={{ padding: 24, fontFamily: 'Roboto, sans-serif' }}>Loading billing…</div>;

  const overdueRows = ageing.filter(r => r.days_overdue > 0).slice(0, 10);
  const buckets = ageing.reduce<Record<string, number>>((acc, r) => {
    if (r.status === 'paid' || r.status === 'void') return acc;
    acc[r.ageing_bucket] = (acc[r.ageing_bucket] ?? 0) + Number(r.balance_due_zar);
    return acc;
  }, {});

  return (
    <div style={{ padding: 24, fontFamily: 'Roboto, sans-serif', color: '#222' }}>
      <h1 style={{ fontFamily: 'Ubuntu, sans-serif', color: HEMPIRE.brown, marginBottom: 4 }}>Billing — Group Ledger</h1>
      <div style={{ color: '#666', marginBottom: 24 }}>Unified view across all 3Wi units · external + intercompany</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        <Kpi label="Billed MTD"     value={ZAR(totals?.billed_mtd_zar)}      tone="green"  />
        <Kpi label="Open Balance"   value={ZAR(totals?.open_balance_zar)}    tone="brown"  />
        <Kpi label="Overdue"        value={ZAR(totals?.overdue_zar)}         tone="red"    />
        <Kpi label="Open Invoices"  value={String(totals?.open_count ?? 0)}  tone="brown"  />
        <Kpi label="Intercompany MTD" value={ZAR(totals?.intercompany_mtd_zar)} tone="yellow" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <Link to="/cc/billing/customers" style={btnBrown}>Customers</Link>
        <Link to="/cc/billing/invoices"  style={btnBrown}>All Invoices</Link>
        <Link to="/cc/billing/invoices?intercompany=true" style={btnYellow}>Intercompany</Link>
        <Link to="/cc/billing/invoices/new" style={btnGreen}>+ New Invoice</Link>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Ubuntu, sans-serif', color: HEMPIRE.brown, fontSize: 18 }}>Ageing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {['current','1-30 days','31-60 days','61-90 days','90+ days'].map(b => (
            <div key={b} style={{ background: '#f7f4ef', padding: 12, borderLeft: `4px solid ${HEMPIRE.brown}` }}>
              <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase' }}>{b}</div>
              <div style={{ fontFamily: 'Ubuntu', fontSize: 18, color: HEMPIRE.brown }}>{ZAR(buckets[b] ?? 0)}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontFamily: 'Ubuntu, sans-serif', color: HEMPIRE.brown, fontSize: 18 }}>Top Overdue</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: HEMPIRE.brown, color: 'white' }}>
              <Th>Invoice</Th><Th>Unit</Th><Th>Customer</Th><Th>Due</Th>
              <Th align="right">Balance</Th><Th align="right">Days Overdue</Th><Th>Bucket</Th>
            </tr>
          </thead>
          <tbody>
            {overdueRows.length === 0 && <tr><td colSpan={7} style={{ padding: 12, color: '#666' }}>No overdue invoices.</td></tr>}
            {overdueRows.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <Td><Link to={`/cc/billing/invoices/${r.id}`} style={{ color: HEMPIRE.green }}>{r.invoice_number}</Link></Td>
                <Td>{r.provider_unit_slug}</Td><Td>{r.customer_name}</Td>
                <Td>{new Date(r.due_date).toLocaleDateString()}</Td>
                <Td align="right">{ZAR(r.balance_due_zar)}</Td>
                <Td align="right">{r.days_overdue}</Td>
                <Td><span style={pill(r.ageing_bucket)}>{r.ageing_bucket}</span></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone: 'brown'|'green'|'red'|'yellow' }) {
  const color = tone === 'green' ? HEMPIRE.green : tone === 'red' ? '#b00020' : tone === 'yellow' ? '#8a6d00' : HEMPIRE.brown;
  const bg = tone === 'yellow' ? HEMPIRE.yellow : 'white';
  return (
    <div style={{ background: bg, border: `1px solid ${color}`, padding: 16, borderRadius: 4 }}>
      <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontFamily: 'Ubuntu, sans-serif', fontSize: 22, color, marginTop: 4 }}>{value}</div>
    </div>
  );
}
const btnBrown:  React.CSSProperties = { padding: '8px 14px', background: HEMPIRE.brown, color: 'white', textDecoration: 'none', borderRadius: 3, fontSize: 14 };
const btnGreen:  React.CSSProperties = { ...btnBrown, background: HEMPIRE.green };
const btnYellow: React.CSSProperties = { ...btnBrown, background: HEMPIRE.yellow, color: HEMPIRE.brown };
function Th({ children, align }: any) { return <th style={{ textAlign: align ?? 'left', padding: '8px 12px', fontSize: 12, fontWeight: 500 }}>{children}</th>; }
function Td({ children, align }: any) { return <td style={{ textAlign: align ?? 'left', padding: '8px 12px', fontSize: 14 }}>{children}</td>; }
function pill(b: string): React.CSSProperties {
  const bg = b === 'current' ? '#e8f5e9' : b === '90+ days' ? '#fdecea' : '#fff3e0';
  const fg = b === 'current' ? HEMPIRE.green : b === '90+ days' ? '#b00020' : '#8a4b00';
  return { background: bg, color: fg, padding: '2px 8px', borderRadius: 999, fontSize: 11 };
}
