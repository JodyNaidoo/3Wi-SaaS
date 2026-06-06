import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function Signup() {
  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const setSession = useAuthStore((s) => s.setSession);
  const nav = useNavigate();
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantName, tenantSlug, fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Signup failed');
      setSession({
        user: { ...data.user, fullName: data.user.fullName ?? data.user.full_name },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tenantSlug,
      });
      nav('/onboarding/1');
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Create your PMO workspace</h1>
        <p className="text-sm text-slate-600 mb-4">14-day free trial. No credit card required.</p>
        <form onSubmit={submit} className="space-y-3">
          <Input label="Organisation name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required />
          <Input label="Workspace slug (lowercase, dashes)" value={tenantSlug} onChange={(e) => setTenantSlug(e.target.value)} required pattern="[a-z0-9-]+" />
          <Input label="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password (min 10 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={10} />
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <Button type="submit" className="w-full">Create workspace</Button>
        </form>
        <div className="mt-4 text-sm">
          <Link to="/auth/login" className="text-slate-600 hover:underline">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
