const SKILLS = [
  { name: 'Monthly Operations Report', input: 'WS-A pre-season prep underway. M02 active. R5 permit expiry flagged for 3 farmers.', output: 'Overall RAG: Amber. Workstream A on track. Disbursement T1 pending evidence pack…' },
  { name: 'Risk Register Update', input: 'Implementation plan submitted. 5 GPS records flagged.', output: 'R1 amber (disbursement pending). R10 amber (Survey123 baseline data quality)…' },
  { name: 'MoV Evidence Pack', input: 'T1 disbursement evidence collection.', output: 'Evidence completeness 78%. Recommendation: release partial T1 against confirmed evidence…' },
  { name: 'Quarterly PSC Report', input: 'Cycle 1 harvest summary. Burn R1.1m of R1.5m.', output: 'Executive summary: Programme on track against 6 of 8 KPIs…' },
  { name: 'Stakeholder Communication', input: 'Confirm Cycle 1 harvest readiness with Medigrow.', output: 'Dear Medigrow team, Gate 4 THC/MRL results for 6 confirmed growers attached…' },
];

export function AiSkills() {
  return (
    <section style={{ background: '#0F172A', color: 'white' }}>
      <div className="container">
        <h2>Five AI skills. Outputs are ready to submit.</h2>
        <p style={{ maxWidth: 640, marginBottom: '2.5rem', opacity: .8 }}>
          Not drafts. Not "you'll need to rewrite this". The output you see is the report you send to the funder.
        </p>
        <div className="grid-3">
          {SKILLS.map((s) => (
            <div key={s.name} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: '.75rem', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem' }}>{s.name}</h3>
              <div style={{ fontSize: '.75rem', opacity: .6, textTransform: 'uppercase', letterSpacing: '.05em', marginTop: '.75rem' }}>Input</div>
              <p style={{ fontSize: '.85rem', opacity: .85, margin: '.25rem 0 .75rem' }}>{s.input}</p>
              <div style={{ fontSize: '.75rem', opacity: .6, textTransform: 'uppercase', letterSpacing: '.05em' }}>Output (truncated)</div>
              <p style={{ fontSize: '.85rem', margin: '.25rem 0', color: '#FDF31C' }}>{s.output}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
