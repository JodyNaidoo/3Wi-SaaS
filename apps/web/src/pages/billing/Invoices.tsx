import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Table, Td } from '../../components/ui/Table';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'Subscription', href: '/billing/subscription' },
  { key: 'F2', label: 'Invoices',     href: '/billing/invoices' },
];

interface Invoice { id: string; periodStart: string; periodEnd: string; activeUsers: number; reportsCount: number; totalAmount: string; status: string; }

export function Invoices() {
  const [list, setList] = useState<Invoice[]>([]);
  useEffect(() => { api<{ invoices: Invoice[] }>('/billing/invoices').then((d) => setList(d.invoices)); }, []);
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <Card>
        {list.length ? (
          <Table headers={['Period','Users','Reports','Total','Status']}>
            {list.map((i) => (
              <tr key={i.id}>
                <Td>{i.periodStart.slice(0,10)} → {i.periodEnd.slice(0,10)}</Td>
                <Td>{i.activeUsers}</Td>
                <Td>{i.reportsCount}</Td>
                <Td>R{Number(i.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                <Td><span className={`px-2 py-0.5 rounded text-xs ${i.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{i.status}</span></Td>
              </tr>
            ))}
          </Table>
        ) : <p className="text-sm text-slate-500">No invoices yet.</p>}
      </Card>
    </Shell>
  );
}
