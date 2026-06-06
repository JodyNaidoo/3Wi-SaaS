import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { Table, Td } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'Photo queue',     href: '/cc/technical' },
  { key: 'F2', label: 'Help requests',   href: '/cc/technical?p=help' },
  { key: 'F3', label: 'Gate audits',     href: '/cc/technical?p=gates' },
  { key: 'F4', label: 'Lab results',     href: '/cc/technical?p=lab' },
  { key: 'F5', label: 'NCR log',         href: '/cc/technical?p=ncr' },
  { key: 'F6', label: 'Field schedule',  href: '/cc/technical?p=schedule' },
  { key: 'F7', label: 'Hub operations',  href: '/cc/technical?p=hub' },
];

export function TechnicalCC() {
  return (
    <Shell role="technical" hotkeys={HOTKEYS}>
      <h1 className="text-2xl font-bold mb-4">Photo Queue</h1>
      <Card>
        <Table headers={['When', 'Farmer', 'District', 'Gate', 'Action']}>
          <tr>
            <Td>2 hours ago</Td>
            <Td>Demo Farmer</Td>
            <Td>OR Tambo</Td>
            <Td>G2 — Plot prep</Td>
            <Td>
              <Button variant="primary" className="mr-1">Approve</Button>
              <Button variant="secondary" className="mr-1">Respond</Button>
              <Button variant="danger">Raise NCR</Button>
            </Td>
          </tr>
        </Table>
      </Card>
      <Card title="Open help requests" className="mt-4">
        <p className="text-sm">No open requests. SLA timer green.</p>
      </Card>
    </Shell>
  );
}
