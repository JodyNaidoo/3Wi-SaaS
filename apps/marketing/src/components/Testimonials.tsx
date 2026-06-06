export function Testimonials() {
  return (
    <section style={{ background: '#3F1101', color: '#FDF31C' }}>
      <div className="container">
        <span className="pill badge-hempire" style={{ marginBottom: '1rem' }}>Anchor case study</span>
        <h2 style={{ color: 'white', marginTop: '1rem' }}>Sunshines Project — Eastern Cape hemp pilot</h2>
        <p style={{ color: 'rgba(255,255,255,.85)', maxWidth: 640, marginBottom: '2rem' }}>
          A R8.7m ECRDA-funded programme, 46 farmers, 8 districts, 5 command centres, operational in 30 days.
        </p>
        <div className="grid-3">
          <div className="card" style={{ background: 'rgba(255,255,255,.95)', color: '#0F172A' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>R8.7m</div>
            <p style={{ margin: 0, color: '#475569' }}>Programme funded under MOA HEMP/IBS/MOA/2025</p>
          </div>
          <div className="card" style={{ background: 'rgba(255,255,255,.95)', color: '#0F172A' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>46</div>
            <p style={{ margin: 0, color: '#475569' }}>Farmers across 8 Eastern Cape districts</p>
          </div>
          <div className="card" style={{ background: 'rgba(255,255,255,.95)', color: '#0F172A' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>30 days</div>
            <p style={{ margin: 0, color: '#475569' }}>From kick-off to fully operational PMO</p>
          </div>
        </div>
      </div>
    </section>
  );
}
