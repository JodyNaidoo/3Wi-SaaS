import { api } from './api';

export async function openBillingPortal(returnUrl: string): Promise<string> {
  const { url } = await api<{ url: string }>('/billing/portal', {
    method: 'POST',
    body: JSON.stringify({ returnUrl }),
  });
  window.location.href = url;
  return url;
}
