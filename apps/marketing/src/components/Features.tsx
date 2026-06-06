const CENTRES = [
  { name: 'PMO Director',     icon: '🎯', desc: '10 hotkeys covering every entity, milestone, risk, KPI, and the AI prompt editor.' },
  { name: 'PSC / Funder',     icon: '🏛️', desc: 'Read-only governance view with KPI scoreboard and quarterly report pack.' },
  { name: 'Farmer / Beneficiary', icon: '🌱', desc: 'Mobile-first, phone+PIN login, offline photo upload, plain language.' },
  { name: 'Technical Hub',    icon: '🛠️', desc: 'Photo queue, help-request SLA, gate audits, NCR log, hub QC ops.' },
  { name: 'Offtaker',         icon: '📦', desc: 'Delivery schedule, QC intake, acceptance reports, payment triggers.' },
];

export function Features() {
  return (
    <section>
      <div className="container">
        <h2>Five command centres. One platform.</h2>
        <p style={{ maxWidth: 640, marginBottom: '2.5rem', color: '#475569' }}>
          Each role sees only what they need. Hotkeys F1–F10 keep navigation instant.
        </p>
        <div className="grid-5">
          {CENTRES.map((c) => (
            <div className="card" key={c.name}>
              <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{c.icon}</div>
              <h3 style={{ fontSize: '1rem' }}>{c.name}</h3>
              <p style={{ fontSize: '.85rem', color: '#475569', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
