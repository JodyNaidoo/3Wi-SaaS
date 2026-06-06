import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`${API}/auth/forgot`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setDone(true);
  }
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
        {done ? (
          <p className="text-sm text-slate-600">If that email is on file, a reset link has been sent.</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}
        <div className="mt-4 text-sm">
          <Link to="/auth/login" className="text-slate-600 hover:underline">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
