const TIERS = [
  { name: 'Starter', price: 'R5,000', period: '/mo', annual: 'R48,000/yr (-20%)', features: ['1 project','Up to 10 users','3 AI reports / month','Email support'] },
  { name: 'Professional', price: 'R15,000', period: '/mo', annual: 'R144,000/yr (-20%)', featured: true, features: ['Up to 3 projects','Up to 50 users','20 AI reports / month','Priority support'] },
  { name: 'Enterprise', price: 'Custom', period: '', annual: 'Volume pricing', features: ['Unlimited projects','Unlimited users','Unlimited reports','SLA + dedicated support'] },
];

export function Pricing() {
  return (
    <section>
      <div className="container">
        <h2 id="pricing">Pricing</h2>
        <p style={{ color: '#475569', marginBottom: '2rem' }}>VAT exclusive. Annual billing 20% off.</p>
        <div className="pricing-grid">
          {TIERS.map((t) => (
            <div key={t.name} className={`card pricing-card ${t.featured ? 'featured' : ''}`}>
              <h3>{t.name}</h3>
              <div style={{ fontSize: '2.25rem', fontWeight: 700 }}>{t.price}<span style={{ fontSize: '1rem', fontWeight: 400, color: '#475569' }}>{t.period}</span></div>
              <div style={{ fontSize: '.85rem', color: '#475569', marginBottom: '1rem' }}>{t.annual}</div>
              <ul style={{ paddingLeft: '1.1rem', lineHeight: 1.8, color: '#334155' }}>
                {t.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <a className="btn btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }} href="https://app.3wipmo.co.za/auth/signup">Choose {t.name}</a>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '.85rem', color: '#64748B', marginTop: '1.5rem' }}>
          Connected-person pricing available — billed per active user (R1,500) plus per AI report (R1,000) for SARS-defensible line items.
        </p>
      </div>
    </section>
  );
}
