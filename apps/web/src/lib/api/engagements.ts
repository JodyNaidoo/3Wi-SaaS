/**
 * Engagements API client.
 *
 * Wraps the /engagements endpoints with typed helpers that the UI calls.
 */

import { useAuthStore } from '../auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export type EngagementStatus =
  | 'requested'
  | 'accepted'
  | 'in_progress'
  | 'delivered'
  | 'closed'
  | 'cancelled';

export interface Engagement {
  id: string;
  tenantId: string;
  serviceUnit: string;
  serviceSlug: string;
  serviceName: string;
  clientName: string;
  clientCompany: string | null;
  clientEmail: string;
  clientPhone: string | null;
  scopeSummary: string | null;
  scopeChoices: Record<string, unknown> | null;
  budgetIndication: string | null;
  desiredStartDate: string | null;
  notes: string | null;
  status: EngagementStatus;
  requestedAt: string;
  acceptedAt: string | null;
  deliveredAt: string | null;
  closedAt: string | null;
  scopeDocUrl: string | null;
  depositInvoiceRef: string | null;
  asanaProjectId: string | null;
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StartEngagementInput {
  serviceUnit: string;     // "knockout-marketing"
  serviceSlug: string;     // "brand-development"
  serviceName: string;     // "Brand Development"
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  clientPhone?: string;
  scopeChoices?: Record<string, unknown>;
  budgetIndication?: string;
  desiredStartDate?: string;
  notes?: string;
}

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().accessToken;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(r: Response): Promise<T> {
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`API ${r.status}: ${txt}`);
  }
  return r.json() as Promise<T>;
}

export const engagements = {
  async start(input: StartEngagementInput): Promise<{ engagement: Engagement; nextStep: string }> {
    const r = await fetch(`${API_BASE}/engagements/start`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(input),
    });
    return handle(r);
  },

  async list(filter?: { status?: EngagementStatus; serviceUnit?: string }): Promise<{ engagements: Engagement[]; count: number }> {
    const params = new URLSearchParams();
    if (filter?.status) params.set('status', filter.status);
    if (filter?.serviceUnit) params.set('serviceUnit', filter.serviceUnit);
    const qs = params.toString();
    const r = await fetch(`${API_BASE}/engagements${qs ? `?${qs}` : ''}`, {
      headers: authHeaders(),
    });
    return handle(r);
  },

  async get(id: string): Promise<{ engagement: Engagement }> {
    const r = await fetch(`${API_BASE}/engagements/${id}`, {
      headers: authHeaders(),
    });
    return handle(r);
  },

  async patchStatus(
    id: string,
    body: { status: EngagementStatus; scopeDocUrl?: string; depositInvoiceRef?: string; asanaProjectId?: string },
  ): Promise<{ engagement: Engagement }> {
    const r = await fetch(`${API_BASE}/engagements/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    return handle(r);
  },
};

export function statusPillClasses(s: EngagementStatus): string {
  switch (s) {
    case 'requested':    return 'bg-amber-100 text-amber-800';
    case 'accepted':     return 'bg-blue-100 text-blue-800';
    case 'in_progress':  return 'bg-indigo-100 text-indigo-800';
    case 'delivered':    return 'bg-emerald-100 text-emerald-800';
    case 'closed':       return 'bg-slate-100 text-slate-700';
    case 'cancelled':    return 'bg-rose-100 text-rose-700';
  }
}
