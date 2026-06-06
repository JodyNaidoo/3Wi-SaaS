import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/auth';

export interface Hotkey { key: string; label: string; href: string; }

/** Shared command-centre shell. Consumed by every CC page. */
export function Shell({ role, hotkeys, children }: { role: string; hotkeys: Hotkey[]; children: ReactNode }) {
  const { user, signOut } = useAuthStore();
  const loc = useLocation();
  const nav = useNavigate();
  return (
    <div className={`min-h-screen flex ${role === 'farmer' ? 'farmer-shell' : ''}`}>
      <aside className="w-56 bg-[var(--brand-primary,#0F172A)] text-white p-4 hidden md:block">
        <div className="font-bold mb-1 text-lg">3Wi PMO</div>
        <div className="text-xs opacity-70 mb-6 capitalize">{role} command centre</div>
        <nav className="space-y-1">
          {hotkeys.map((h) => (
            <Link
              key={h.key}
              to={h.href}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-white/10 ${loc.pathname === h.href ? 'bg-white/10' : ''}`}
            >
              <span className="hotkey-pill bg-white/20 text-white">{h.key}</span>
              <span>{h.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="text-sm">
            <span className="opacity-60">Signed in as </span>
            <strong>{user?.fullName ?? '...'}</strong>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-100 capitalize">{role}</span>
          </div>
          <button
            className="text-sm text-slate-600 hover:text-slate-900"
            onClick={() => { signOut(); nav('/auth/login'); }}
          >Sign out</button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
