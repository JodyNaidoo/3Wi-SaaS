import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function Login() {
  const [mode, setMode] = useState<'staff' | 'farmer'>('staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const nav = useNavigate();
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const path = mode === 'staff' ? '/auth/login' : '/auth/farmer-login';
      const body = mode === 'staff' ? { email, password } : { phone, pin };
      const res = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Login failed');
      setSession({
        user: { ...data.user, fullName: data.user.fullName ?? data.user.full_name },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      nav(data.user.role === 'farmer' ? '/cc/farmer' : `/cc/${data.user.role}`);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign in to 3Wi PMO</h1>
        <div className="flex gap-2 mb-4 text-sm">
          <button onClick={() => setMode('staff')} className={`px-3 py-1 rounded ${mode === 'staff' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>Staff / Director</button>
          <button onClick={() => setMode('farmer')} className={`px-3 py-1 rounded ${mode === 'farmer' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>Farmer</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'staff' ? (
            <>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </>
          ) : (
            <>
              <Input label="Phone (10 digits, e.g. 0712345678)" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <Input label="4-digit PIN" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} required />
            </>
          )}
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in…' : 'Sign in'}</Button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link to="/auth/forgot" className="text-slate-600 hover:underline">Forgot password</Link>
          <Link to="/auth/signup" className="text-slate-600 hover:underline">Create tenant</Link>
        </div>
      </div>
    </div>
  );
}
