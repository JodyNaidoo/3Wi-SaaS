import { create } from 'zustand';

interface User {
  id: string;
  tenantId: string;
  role: string;
  fullName: string;
  email?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tenantSlug: string | null;
  setSession: (s: { user: User; accessToken: string; refreshToken: string; tenantSlug?: string }) => void;
  signOut: () => void;
  hydrate: () => void;
}

const KEY = '3wi.auth.v1';

// Synchronous hydration at module load. Reads localStorage BEFORE React
// renders, so RequireAuth never sees a transient null user on full page
// reload. Avoids the redirect-to-login race that useEffect-based hydration
// produces.
function readInitialSession(): { user: User | null; accessToken: string | null; refreshToken: string | null; tenantSlug: string | null } {
  if (typeof window === 'undefined') return { user: null, accessToken: null, refreshToken: null, tenantSlug: null };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { user: null, accessToken: null, refreshToken: null, tenantSlug: null };
    const s = JSON.parse(raw);
    return {
      user: s.user ?? null,
      accessToken: s.accessToken ?? null,
      refreshToken: s.refreshToken ?? null,
      tenantSlug: s.tenantSlug ?? null,
    };
  } catch {
    return { user: null, accessToken: null, refreshToken: null, tenantSlug: null };
  }
}

const initial = readInitialSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  accessToken: initial.accessToken,
  refreshToken: initial.refreshToken,
  tenantSlug: initial.tenantSlug,
  setSession: (s) => {
    set({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken, tenantSlug: s.tenantSlug ?? null });
    localStorage.setItem(KEY, JSON.stringify(s));
  },
  signOut: () => {
    set({ user: null, accessToken: null, refreshToken: null, tenantSlug: null });
    localStorage.removeItem(KEY);
  },
  hydrate: () => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      set({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken, tenantSlug: s.tenantSlug ?? null });
    } catch {}
  },
}));
