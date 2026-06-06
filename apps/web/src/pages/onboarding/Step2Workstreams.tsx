import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Stepper } from './_Stepper';

interface WS { code: string; name: string; budget: string; leadRole: string; colour?: string; icon?: string; }

const DEFAULTS: WS[] = [
  { code: 'A', name: 'Production', budget: '', leadRole: 'Production Manager' },
  { code: 'B', name: 'Capacity Building', budget: '', leadRole: 'Training Lead' },
  { code: 'C', name: 'Compliance', budget: '', leadRole: 'Compliance Officer' },
  { code: 'D', name: 'Offtake', budget: '', leadRole: 'Commercial Lead' },
  { code: 'E', name: 'Finance', budget: '', leadRole: 'Finance Manager' },
  { code: 'F', name: 'PMO', budget: '', leadRole: 'PMO Director' },
];

export function Step2Workstreams() {
  const [list, setList] = useState<WS[]>(DEFAULTS);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  function update(i: number, patch: Partial<WS>) {
    setList((l) => l.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));
  }
  function addRow() {
    if (list.length >= 10) return;
    setList((l) => [...l, { code: String.fromCharCode(65 + l.length), name: '', budget: '', leadRole: '' }]);
  }
  function remove(i: number) {
    setList((l) => l.filter((_, idx) => idx !== i));
  }

  async function submit() {
    setError(null);
    const projectId = sessionStorage.getItem('onboarding.projectId');
    if (!projectId) return setError('No project in session — restart onboarding');
    try {
      await api(`/projects/${projectId}/workstreams`, {
        method: 'POST',
        body: JSON.stringify({
          workstreams: list.map((w) => ({ ...w, budget: Number(w.budget) })),
        }),
      });
      nav('/onboarding/3');
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Stepper current={2} />
      <Card title="Step 2 of 6 — Workstreams (max 10)">
        <p className="text-sm text-slate-600 mb-4">Sum of workstream budgets must not exceed project total.</p>
        <div className="space-y-2">
          {list.map((w, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-1"><Input label="Code" value={w.code} onChange={(e) => update(i, { code: e.target.value })} /></div>
              <div className="col-span-4"><Input label="Name" value={w.name} onChange={(e) => update(i, { name: e.target.value })} /></div>
              <div className="col-span-3"><Input label="Budget (R)" type="number" value={w.budget} onChange={(e) => update(i, { budget: e.target.value })} /></div>
              <div className="col-span-3"><Input label="Lead role" value={w.leadRole} onChange={(e) => update(i, { leadRole: e.target.value })} /></div>
              <div className="col-span-1"><Button type="button" variant="ghost" onClick={() => remove(i)}>×</Button></div>
            </div>
          ))}
        </div>
        {list.length < 10 ? <Button variant="secondary" type="button" onClick={addRow} className="mt-3">+ Add workstream</Button> : null}
        {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => nav('/onboarding/1')}>Back</Button>
          <Button onClick={submit}>Continue</Button>
        </div>
      </Card>
    </div>
  );
}
