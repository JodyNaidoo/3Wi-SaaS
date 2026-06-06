import { useEffect, useState } from 'react';
import { api, streamAi } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { SKILL_LABELS } from '../../lib/claude';

export function AiSkillPage({ skill, role = 'director' }: { skill: keyof typeof SKILL_LABELS; role?: string }) {
  const meta = SKILL_LABELS[skill];
  const [systemPrompt, setSystemPrompt] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    api<{ systemPrompt: string }>(`/ai/prompts/${skill}`).then((d) => setSystemPrompt(d.systemPrompt));
    api<{ projects: { id: string }[] }>('/projects').then((d) => setProjectId(d.projects[0]?.id ?? ''));
  }, [skill]);

  function generate() {
    if (!projectId || !input.trim()) return;
    setOutput('');
    setReportId(null);
    setRunning(true);
    streamAi({
      skill,
      projectId,
      input,
      onToken: (t) => setOutput((o) => o + t),
      onDone: (id) => { setReportId(id); setRunning(false); },
      onError: (e) => { setOutput((o) => o + `\n\n[error] ${e}`); setRunning(false); },
    });
  }

  function copyOutput() { navigator.clipboard.writeText(output); }

  const HOTKEYS: Hotkey[] = Object.entries(SKILL_LABELS).map(([k, v], i) => ({
    key: `F${i + 1}`, label: v.name, href: v.route,
  }));

  return (
    <Shell role={role} hotkeys={HOTKEYS}>
      <h1 className="text-2xl font-bold">{meta.name}</h1>
      <p className="text-sm text-slate-600 mb-4">{meta.tagline}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Your input">
          <Textarea rows={10} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe the period or context — the more specific, the better the output." />
          <div className="flex gap-2 mt-3">
            <Button onClick={generate} disabled={running || !input.trim()}>
              {running ? 'Streaming…' : 'Generate'}
            </Button>
            <details className="text-sm">
              <summary className="cursor-pointer text-slate-600">View prompt</summary>
              <pre className="mt-2 max-h-48 overflow-auto bg-slate-50 p-2 rounded text-xs whitespace-pre-wrap">{systemPrompt}</pre>
            </details>
          </div>
        </Card>

        <Card title="Output">
          <pre className="whitespace-pre-wrap text-sm font-sans min-h-[14rem]">{output || (running ? 'Waiting for first token…' : 'Output appears here.')}</pre>
          {output ? (
            <div className="flex gap-2 mt-3">
              <Button variant="secondary" onClick={copyOutput}>Copy</Button>
              {reportId ? <span className="text-xs text-green-700 self-center">Saved as report {reportId.slice(0, 8)}</span> : null}
            </div>
          ) : null}
        </Card>
      </div>
    </Shell>
  );
}
