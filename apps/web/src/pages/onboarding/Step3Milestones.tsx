import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Stepper } from './_Stepper';

interface Mil { code: string; label: string; dueDate: string; paymentAmount: string; }

export function Step3Milestones() {
  const [list, setList] = useState<Mil[]>([
    { code: 'M01', label: 'MOA signed', dueDate: '', paymentAmount: '' },
  ]);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  function update(i: number, patch: Partial<Mil>) {
    setList((l) => l.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }
  function addRow() {
    if (list.length >= 25) return;
    const next = `M${String(list.length + 1).padStart(2, '0')}`;
    setList((l) => [...l, { code: next, label: '', dueDate: '', paymentAmount: '' }]);
  }
  function remove(i: number) { setList((l) => l.filter((_, idx) => idx !== i)); }

  async function importCsv(file: File) {
    const text = await file.text();
    const rows = text.split(/\r?\n/).filter(Boolean).slice(1); // skip header
    const next: Mil[] = rows.map((r) => {
      const [code, label, dueDate, paymentAmount] = r.split(',');
      return { code, label, dueDate, paymentAmount: paymentAmount ?? '' };
    });
    setList(next.slice(0, 25));
  }

  async function submit() {
    setError(null);
    const projectId = sessionStorage.getItem('onboarding.projectId');
    if (!projectId) return setError('No project in session');
    try {
      await api(`/projects/${projectId}/milestones`, {
        method: 'POST',
        body: JSON.stringify({
          milestones: list.map((m) => ({
            code: m.code,
            label: m.label,
            dueDate: m.dueDate,
            paymentAmount: m.paymentAmount ? Number(m.paymentAmount) : null,
            workstreamIds: [],
          })),
        }),
      });
      nav('/onboarding/4');
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Stepper current={3} />
      <Card title="Step 3 of 6 — Milestones (max 25)">
        <div className="flex justify-end mb-3">
          <label className="text-sm cursor-pointer text-slate-600 hover:underline">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
          </label>
        </div>
        {list.map((m, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-end mb-2">
            <div className="col-span-2"><Input label="Code" value={m.code} onChange={(e) => update(i, { code: e.target.value })} /></div>
            <div className="col-span-5"><Input label="Label" value={m.label} onChange={(e) => update(i, { label: e.target.value })} /></div>
            <div className="col-span-2"><Input label="Due" type="date" value={m.dueDate} onChange={(e) => update(i, { dueDate: e.target.value })} /></div>
            <div className="col-span-2"><Input label="Payment (R)" type="number" value={m.paymentAmount} onChange={(e) => update(i, { paymentAmount: e.target.value })} /></div>
            <div className="col-span-1"><Button type="button" variant="ghost" onClick={() => remove(i)}>×</Button></div>
          </div>
        ))}
        {list.length < 25 ? <Button variant="secondary" type="button" onClick={addRow} className="mt-2">+ Add milestone</Button> : null}
        {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => nav('/onboarding/2')}>Back</Button>
          <Button onClick={submit}>Continue</Button>
        </div>
      </Card>
    </div>
  );
}
