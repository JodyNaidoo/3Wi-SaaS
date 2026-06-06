const PAINS = [
  { title: 'Monthly reports take days to write.', body: 'Project managers spend 20 hours a month assembling status updates from spreadsheets, photos, and emails. The reports are stale by the time they reach the funder.' },
  { title: 'Funders cannot see real-time progress.', body: 'Funders ask "where are we?" and get a slide deck. Six weeks later, when the gate evidence finally arrives, three milestones have already slipped.' },
  { title: 'Beneficiaries have no direct channel.', body: 'Farmers in a 200-strong programme have no way to ask a question, raise an issue, or upload evidence except through a WhatsApp group that nobody monitors.' },
];

export function Problem() {
  return (
    <section style={{ background: '#F8FAFC' }}>
      <div className="container">
        <h2>The PMO problem we solve</h2>
        <p style={{ maxWidth: 640, marginBottom: '2.5rem', color: '#475569' }}>
          Three pain points kill funded programmes. We built the PMO Suite around them.
        </p>
        <div className="grid-3">
          {PAINS.map((p) => (
            <div className="card" key={p.title}>
              <h3 style={{ fontSize: '1.1rem' }}>{p.title}</h3>
              <p style={{ fontSize: '.95rem', color: '#475569', margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
