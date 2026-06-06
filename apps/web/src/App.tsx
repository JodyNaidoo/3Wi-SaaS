import { Router } from './router';
import { useEffect } from 'react';
import { useAuthStore } from './lib/auth';

export default function App() {
  const { tenantSlug, hydrate } = useAuthStore();
  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (tenantSlug) document.documentElement.setAttribute('data-tenant', tenantSlug);
    else document.documentElement.removeAttribute('data-tenant');
  }, [tenantSlug]);
  return <Router />;
}
