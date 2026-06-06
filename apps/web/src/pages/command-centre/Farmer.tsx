import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'My farm',         href: '/cc/farmer' },
  { key: 'F2', label: 'Upload evidence', href: '/cc/farmer?p=upload' },
  { key: 'F3', label: 'Ask for help',    href: '/cc/farmer?p=help' },
  { key: 'F4', label: 'My gate status',  href: '/cc/farmer?p=gate' },
  { key: 'F5', label: 'My payments',     href: '/cc/farmer?p=payments' },
  { key: 'F6', label: 'GACP guide',      href: '/cc/farmer?p=gacp' },
  { key: 'F7', label: 'My district',     href: '/cc/farmer?p=district' },
  { key: 'F8', label: 'My schedule',     href: '/cc/farmer?p=schedule' },
];

export function FarmerCC() {
  return (
    <Shell role="farmer" hotkeys={HOTKEYS}>
      <h1 className="text-2xl font-bold mb-4">Hello, farmer.</h1>
      <Card>
        <p>Welcome to your farm portal. Use the buttons below to upload evidence, ask for help, or check your gate status.</p>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card title="Upload a photo">
          <p className="text-sm mb-3">Take a geotagged photo of your field, hub, or compliance evidence.</p>
          <Button>Open camera</Button>
        </Card>
        <Card title="Ask for help">
          <p className="text-sm mb-3">A technical extension officer will respond within 24 hours.</p>
          <Button>Send a message</Button>
        </Card>
      </div>
    </Shell>
  );
}
