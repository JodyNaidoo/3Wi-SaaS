import { useState } from 'react';

export function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    // wire to your CRM/form endpoint in production
    setDone(true);
  }
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h3 style={{ marginBottom: '.5rem' }}>3Wi PTY Ltd</h3>
          <p style={{ color: '#475569', fontSize: '.9rem' }}>AI-powered PMO Suite for any project, anywhere. Powered by Claude AI.</p>
        </div>
        <div>
          <h3 style={{ fontSize: '.9rem', textTransform: 'uppercase', color: '#64748B' }}>Contact us</h3>
          {done ? (
            <p style={{ fontSize: '.9rem' }}>Thanks — we'll be in touch within 24 hours.</p>
          ) : (
            <form onSubmit={submit} style={{ display: 'grid', gap: '.5rem' }}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required style={{ padding: '.5rem', border: '1px solid #CBD5E1', borderRadius: '.4rem' }} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required style={{ padding: '.5rem', border: '1px solid #CBD5E1', borderRadius: '.4rem' }} />
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder="What are you trying to manage?" style={{ padding: '.5rem', border: '1px solid #CBD5E1', borderRadius: '.4rem' }} />
              <button className="btn btn-primary" type="submit">Send</button>
            </form>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: '.9rem', textTransform: 'uppercase', color: '#64748B' }}>Legal</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '.9rem', color: '#475569', lineHeight: 1.8 }}>
            <li><a href="/privacy">Privacy policy</a></li>
            <li><a href="/terms">Terms of service</a></li>
            <li><a href="/security">Security &amp; POPIA</a></li>
            <li>support@3wipmo.co.za</li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', fontSize: '.8rem', color: '#94A3B8' }}>
        © {new Date().getFullYear()} 3Wi PTY Ltd. All rights reserved.
      </div>
    </footer>
  );
}
