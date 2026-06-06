const APP = 'https://app.3wipmo.co.za/cc/director?demo=sunshines';

export function DemoEmbed() {
  return (
    <section id="demo" style={{ background: '#F8FAFC' }}>
      <div className="container">
        <h2>Live demo — the Sunshines Project</h2>
        <p style={{ color: '#475569', maxWidth: 640, marginBottom: '1.5rem' }}>
          This is a live demo of a real R8.7m government-funded programme. Click through all 5 command centres without logging in.
        </p>
        <div style={{ borderRadius: '.75rem', overflow: 'hidden', border: '1px solid #CBD5E1', background: 'white', aspectRatio: '16/9' }}>
          <iframe title="Sunshines demo" src={APP} style={{ width: '100%', height: '100%', border: 0 }} />
        </div>
      </div>
    </section>
  );
}
