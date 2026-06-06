import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Stepper } from './_Stepper';

export function Step1Identity() {
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    tagline: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    funder: '',
    moaReference: '',
  });
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { project } = await api<{ project: { id: string } }>('/projects', {
        method: 'POST',
        body: JSON.stringify({ ...form, totalBudget: Number(form.totalBudget) }),
      });
      sessionStorage.setItem('onboarding.projectId', project.id);
      nav('/onboarding/2');
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Stepper current={1} />
      <Card title="Step 1 of 6 — Project identity">
        <form onSubmit={submit} className="space-y-3">
          <Input label="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Project code (e.g. SUNSHINES-001)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <Textarea label="Description (2-3 sentences)" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            <Input label="End date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Total budget (R)" type="number" value={form.totalBudget} onChange={(e) => setForm({ ...form, totalBudget: e.target.value })} required />
            <Input label="Primary funder" value={form.funder} onChange={(e) => setForm({ ...form, funder: e.target.value })} required />
          </div>
          <Input label="MOA / contract reference" value={form.moaReference} onChange={(e) => setForm({ ...form, moaReference: e.target.value })} />
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
