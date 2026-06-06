import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'Delivery schedule',  href: '/cc/offtaker' },
  { key: 'F2', label: 'QC intake',           href: '/cc/offtaker?p=qc' },
  { key: 'F3', label: 'Acceptance reports',  href: '/cc/offtaker?p=accept' },
  { key: 'F4', label: 'Rejections',          href: '/cc/offtaker?p=reject' },
  { key: 'F5', label: 'Payment triggers',    href: '/cc/offtaker?p=payments' },
  { key: 'F6', label: 'Crop pipeline',       href: '/cc/offtaker?p=pipeline' },
];

export function OfftakerCC() {
  return (
    <Shell role="offtaker" hotkeys={HOTKEYS}>
      <h1 className="text-2xl font-bold mb-4">Delivery Schedule</h1>
      <Card>
        <p className="text-sm">No deliveries scheduled in the next 7 days. Cycle 1 confirmation expected from PMO by week 32.</p>
      </Card>
      <Card title="Crop pipeline" className="mt-4">
        <p className="text-sm">Total committed volumes by district will display here once cycles activate.</p>
      </Card>
    </Shell>
  );
}
