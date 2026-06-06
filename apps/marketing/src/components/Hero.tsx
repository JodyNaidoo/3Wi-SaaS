export function Hero() {
  return (
    <section className="hero" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div className="container">
        <span className="pill" style={{ background: 'rgba(253,243,28,.15)', color: '#FDF31C' }}>Built for government-funded programmes</span>
        <h1 style={{ marginTop: '1rem', maxWidth: 760 }}>
          AI-powered project management for <span>government-funded programmes</span>.
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: 720, opacity: .85, marginBottom: '2rem' }}>
          3Wi PMO Suite gives your team, your funders, and your beneficiaries a single source of truth.
          Generate funder-ready reports in seconds. Track every gate, every risk, every payment.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a className="btn btn-primary" href="https://app.3wipmo.co.za/auth/signup">Start free trial</a>
          <a className="btn btn-ghost" href="#demo">See it in action</a>
        </div>
        <div style={{ marginTop: '2.5rem', opacity: .6, fontSize: '.85rem' }}>
          3Wi PTY Ltd · Powered by Claude AI
        </div>
      </div>
    </section>
  );
}
