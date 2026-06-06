const STEPS = [
  '1. Identity',
  '2. Workstreams',
  '3. Milestones',
  '4. Risks',
  '5. Users',
  '6. AI prompts',
];

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap gap-2 mb-4 text-xs">
      {STEPS.map((s, i) => {
        const idx = i + 1;
        const state = idx < current ? 'done' : idx === current ? 'current' : 'pending';
        return (
          <li key={s}
            className={`px-2 py-1 rounded
              ${state === 'done' ? 'bg-green-100 text-green-800' : ''}
              ${state === 'current' ? 'bg-slate-900 text-white' : ''}
              ${state === 'pending' ? 'bg-slate-100 text-slate-500' : ''}`}>
            {s}
          </li>
        );
      })}
    </ol>
  );
}
