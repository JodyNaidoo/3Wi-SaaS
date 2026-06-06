import { useAuthStore } from './auth';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = (await res.json()).error ?? msg; } catch {}
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export function streamAi(opts: {
  skill: string;
  projectId: string;
  input: string;
  onToken: (t: string) => void;
  onDone: (reportId: string) => void;
  onError: (e: string) => void;
}) {
  const token = useAuthStore.getState().accessToken;
  const ctrl = new AbortController();
  fetch(`${API}/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ skill: opts.skill, projectId: opts.projectId, input: opts.input }),
    signal: ctrl.signal,
  })
    .then(async (res) => {
      if (!res.body) throw new Error('No stream body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const evt = JSON.parse(line.slice(6));
            if (evt.token) opts.onToken(evt.token);
            else if (evt.done) opts.onDone(evt.reportId);
            else if (evt.error) opts.onError(evt.error);
          } catch {}
        }
      }
    })
    .catch((e) => opts.onError((e as Error).message));
  return () => ctrl.abort();
}
