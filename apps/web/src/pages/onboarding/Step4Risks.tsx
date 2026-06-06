import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Stepper } from './_Stepper';

interface Risk { code: string; label: string; likelihood: number; impact: number; ragStatus: 'green'|'amber'|'red'; controlAction: string; owner: string; pfmaFlag: boolean; }

const STANDARD: Risk[] = [
  { code: 'R01', label: 'Funder disbursement delay',         likelihood: 3, impact: 5, ragStatus: 'amber', controlAction: 'Weekly funder liaison; evidence pre-prep', owner: 'PM',           pfmaFlag: false },
  { code: 'R02', label: 'PFMA non-compliance',                likelihood: 2, impact: 5, ragStatus: 'amber', controlAction: 'Ring-fenced account, 3-quote rule, monthly audit', owner: 'Finance',     pfmaFlag: true  },
  { code: 'R03', label: 'Procurement irregularity',           likelihood: 2, impact: 5, ragStatus: 'amber', controlAction: 'CFO sign-off on all > R10k procurements', owner: 'Finance',     pfmaFlag: true  },
  { code: 'R04', label: 'Fraud / corruption',                  likelihood: 1, impact: 5, ragStatus: 'red',   controlAction: 'Dual-signatory; whistle-blower channel', owner: 'Director',    pfmaFlag: true  },
  { code: 'R05', label: 'Beneficiary permit / licence expiry', likelihood: 4, impact: 4, ragStatus: 'amber', controlAction: '90/60/30 day reminders; bulk renewal',  owner: 'Compliance',  pfmaFlag: false },
  { code: 'R06', label: 'Supplier / contractor failure',       likelihood: 2, impact: 4, ragStatus: 'amber', controlAction: 'Pre-qualification + alternates list',   owner: 'Procurement', pfmaFlag: false },
  { code: 'R07', label: 'Stakeholder governance breakdown',    likelihood: 2, impact: 4, ragStatus: 'green', controlAction: 'PSC ToR + monthly meetings',            owner: 'PM',           pfmaFlag: false },
  { code: 'R08', label: 'Quality / non-conformance',           likelihood: 3, impact: 4, ragStatus: 'amber', controlAction: 'Digital gate audits; lab COA',          owner: 'Technical',   pfmaFlag: false },
  { code: 'R09', label: 'Schedule slippage',                    likelihood: 3, impact: 3, ragStatus: 'amber', controlAction: 'Weekly milestone reviews',              owner: 'PM',           pfmaFlag: false },
  { code: 'R10', label: 'Data / reporting integrity',          likelihood: 2, impact: 4, ragStatus: 'amber', controlAction: 'Source data validation; audit log',     owner: 'PMO',          pfmaFlag: false },
  { code: 'R11', label: 'Key-person dependency',               likelihood: 2, impact: 4, ragStatus: 'amber', controlAction: 'Cross-training; knowledge handover docs', owner: 'Director',    pfmaFlag: false },
  { code: 'R12', label: 'Regulatory change',                    likelihood: 2, impact: 3, ragStatus: 'green', controlAction: 'Quarterly regulatory scan',             owner: 'Compliance',  pfmaFlag: false },
];

export function Step4Risks() {
  const [risks, setRisks] = useState<Risk[]>(STANDARD);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  function update(i: number, patch: Partial<Risk>) {
    setRisks((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }

  async function submit() {
    setError(null);
    const projectId = sessionStorage.getItem('onboarding.projectId');
    if (!projectId) return setError('No project in session');
    try {
      await api(`/projects/${projectId}/risks`, { method: 'POST', body: JSON.stringify({ risks }) });
      nav('/onboarding/5');
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Stepper current={4} />
      <Card title="Step 4 of 6 — Risk register">
        <p className="text-sm text-slate-600 mb-4">12 standard PMO risks pre-loaded. Edit, remove, or add. PFMA-flagged risks are red-flagged everywhere.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50">
              {['Code','Risk','L','I','RAG','Control action','Owner','PFMA'].map(h => <th key={h} className="px-2 py-1 text-left">{h}</th>)}
            </tr></thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={r.code} className="border-t">
                  <td className="px-2 py-1 font-mono">{r.code}</td>
                  <td className="px-2 py-1"><Input value={r.label} onChange={(e) => update(i, { label: e.target.value })} /></td>
                  <td className="px-2 py-1"><Input type="number" min={1} max={5} value={r.likelihood} onChange={(e) => update(i, { likelihood: Number(e.target.value) })} /></td>
                  <td className="px-2 py-1"><Input type="number" min={1} max={5} value={r.impact} onChange={(e) => update(i, { impact: Number(e.target.value) })} /></td>
                  <td className="px-2 py-1">
                    <select className="border rounded px-1 py-1 text-xs" value={r.ragStatus} onChange={(e) => update(i, { ragStatus: e.target.value as Risk['ragStatus'] })}>
                      <option value="green">Green</option><option value="amber">Amber</option><option value="red">Red</option>
                    </select>
                  </td>
                  <td className="px-2 py-1"><Input value={r.controlAction} onChange={(e) => update(i, { controlAction: e.target.value })} /></td>
                  <td className="px-2 py-1"><Input value={r.owner} onChange={(e) => update(i, { owner: e.target.value })} /></td>
                  <td className="px-2 py-1 text-center"><input type="checkbox" checked={r.pfmaFlag} onChange={(e) => update(i, { pfmaFlag: e.target.checked })} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => nav('/onboarding/3')}>Back</Button>
          <Button onClick={submit}>Continue</Button>
        </div>
      </Card>
    </div>
  );
}
