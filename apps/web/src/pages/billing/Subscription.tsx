import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { openBillingPortal } from '../../lib/stripe';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Shell, type Hotkey } from '../../components/ui/Shell';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'Subscription', href: '/billing/subscription' },
  { key: 'F2', label: 'Invoices',     href: '/billing/invoices' },
];

interface Summary {
  tenant: { name: string; subscriptionTier: string };
  subscription: any;
  activeUsers: number;
  monthReports: number;
  userFee: number;
  reportFee: number;
  estimatedSubtotal: number;
  estimatedVat: number;
  estimatedTotal: number;
}

export function Subscription() {
  const [data, setData] = useState<Summary | null>(null);
  useEffect(() => { api<Summary>('/billing/summary').then(setData); }, []);
  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>
      {!data ? <p>Loading…</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Active users this month">
            <div className="text-3xl font-bold">{data.activeUsers}</div>
            <p className="text-xs text-slate-500">@ R{data.userFee.toLocaleString()} each</p>
          </Card>
          <Card title="Reports generated this month">
            <div className="text-3xl font-bold">{data.monthReports}</div>
            <p className="text-xs text-slate-500">@ R{data.reportFee.toLocaleString()} each</p>
          </Card>
          <Card title="Estimated invoice">
            <div className="text-3xl font-bold">R{data.estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-slate-500">VAT: R{data.estimatedVat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </Card>
        </div>
      )}
      <div className="mt-6">
        <Button onClick={() => openBillingPortal(window.location.href)}>Manage in Stripe portal</Button>
      </div>
    </Shell>
  );
}
