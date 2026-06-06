import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Input';
import { Stepper } from './_Stepper';
import { SKILL_LABELS } from '../../lib/claude';

const SKILLS = Object.keys(SKILL_LABELS);

export function Step6Prompts() {
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string>(SKILLS[0]);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    Promise.all(SKILLS.map(async (s) => {
      const data = await api<{ systemPrompt: string }>(`/ai/prompts/${s}`);
      return [s, data.systemPrompt] as const;
    })).then((entries) => setPrompts(Object.fromEntries(entries)));
  }, []);

  async function save(skill: string) {
    setBusy(true);
    try { await api(`/ai/prompts/${skill}`, { method: 'PUT', body: JSON.stringify({ systemPrompt: prompts[skill] }) }); }
    finally { setBusy(false); }
  }

  async function finish() {
    const projectId = sessionStorage.getItem('onboarding.projectId');
    if (!projectId) return;
    await api(`/projects/${projectId}/onboarding/finish`, { method: 'POST', body: '{}' });
    sessionStorage.removeItem('onboarding.projectId');
    nav('/cc/director');
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Stepper current={6} />
      <Card title="Step 6 of 6 — AI skill prompts">
        <p className="text-sm text-slate-600 mb-4">Customise each prompt with project-specific context (funder name, KPI targets, brand voice). Generic prompts produce generic reports.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {SKILLS.map((s) => (
            <button key={s} type="button" onClick={() => setActive(s)}
              className={`px-3 py-1 rounded text-sm ${active === s ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>
              {SKILL_LABELS[s].name}
            </button>
          ))}
        </div>
        <Textarea rows={14} value={prompts[active] ?? ''} onChange={(e) => setPrompts((p) => ({ ...p, [active]: e.target.value }))} />
        <div className="flex justify-between pt-4">
          <Button variant="secondary" onClick={() => nav('/onboarding/5')}>Back</Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => save(active)} disabled={busy}>Save prompt</Button>
            <Button onClick={finish}>Finish onboarding</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
