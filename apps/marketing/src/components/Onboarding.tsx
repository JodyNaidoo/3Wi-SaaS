const STEPS = [
  { n: 1, name: 'Project identity',     body: 'Name, dates, budget, funder, MOA, brand colours.' },
  { n: 2, name: 'Workstreams',          body: 'Up to 10 streams. Sum-not-exceed validation.' },
  { n: 3, name: 'Milestones',           body: 'Up to 25 milestones. CSV import. Payment triggers.' },
  { n: 4, name: 'Risk register',        body: '12 standard PMO risks pre-loaded. PFMA flags.' },
  { n: 5, name: 'User groups',          body: 'CSV-bulk farmer import. Role-scoped command centres.' },
  { n: 6, name: 'AI prompt configuration', body: 'Edit each of the 5 prompts with project-specific context.' },
];

export function Onboarding() {
  return (
    <section>
      <div className="container">
        <h2>Set up your project command centre in 30 minutes.</h2>
        <p style={{ color: '#475569', maxWidth: 640, marginBottom: '2rem' }}>
          Six steps. Each step saves to the database before proceeding. Resume anytime.
        </p>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {STEPS.map((s) => (
            <div key={s.n} className="card">
              <div style={{ background: '#015807', color: 'white', width: 28, height: 28, borderRadius: 999, display: 'grid', placeItems: 'center', fontWeight: 700, marginBottom: '.5rem' }}>{s.n}</div>
              <h3 style={{ fontSize: '1rem' }}>{s.name}</h3>
              <p style={{ fontSize: '.85rem', color: '#475569', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
