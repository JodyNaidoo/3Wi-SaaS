/**
 * Offtaker submissions API client.
 */

import { useAuthStore } from '../auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export type OfftakerStatus =
  | 'draft' | 'submitted' | 'screening' | 'tna' | 'verification'
  | 'recommendation' | 'approved' | 'approved_conditional'
  | 'declined' | 'deferred' | 'withdrawn';

export interface OfftakerSubmission {
  id: string;
  tenantId: string;
  legalName: string;
  tradingName: string | null;
  registrationNumber: string | null;
  legalEntityType: string | null;
  primaryContactName: string | null;
  primaryContactEmail: string;
  primaryContactPhone: string | null;
  bbbeeLevel: string | null;
  offtakerCategory: string | null;
  targetDistricts: string[];
  productCategories: string[];
  preferredFarmerTypes: string[];
  totalHectaresCapacity: number | null;
  estimatedFarmers: number | null;
  formPayload: Record<string, unknown>;
  status: OfftakerStatus;
  screeningScorecard: Record<string, unknown> | null;
  tnaSummary: string | null;
  verificationNotes: string | null;
  recommendation: string | null;
  recommendationNotes: string | null;
  conditions: string | null;
  reviewerName: string | null; reviewerDate: string | null;
  programmeManagerName: string | null; programmeManagerDate: string | null;
  sectorHeadName: string | null; sectorHeadDate: string | null;
  ipmExecutiveName: string | null; ipmExecutiveDate: string | null;
  ceoName: string | null; ceoDate: string | null;
  submissionRef: string | null;
  submittedAt: string;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OfftakerDashboardData {
  total: number;
  approvedCount: number;
  approvedHaCapacity: number;
  approvedFarmers: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  byBbbee: Record<string, number>;
  byDistrict: Record<string, number>;
  byProduct: Record<string, number>;
  recent: Partial<OfftakerSubmission>[];
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

export const offtakers = {
  async start(input: any): Promise<{ submission: OfftakerSubmission; nextStep: string }> {
    const r = await fetch(`${API_BASE}/offtaker-submissions/start`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(input),
    });
    return handle(r);
  },

  async list(filter?: { status?: OfftakerStatus; category?: string }): Promise<{ submissions: OfftakerSubmission[]; count: number }> {
    const params = new URLSearchParams();
    if (filter?.status) params.set('status', filter.status);
    if (filter?.category) params.set('category', filter.category);
    const qs = params.toString();
    const r = await fetch(`${API_BASE}/offtaker-submissions${qs ? `?${qs}` : ''}`, { headers: authHeaders() });
    return handle(r);
  },

  async get(id: string): Promise<{ submission: OfftakerSubmission }> {
    const r = await fetch(`${API_BASE}/offtaker-submissions/${id}`, { headers: authHeaders() });
    return handle(r);
  },

  async dashboard(): Promise<OfftakerDashboardData> {
    const r = await fetch(`${API_BASE}/offtaker-submissions/dashboard`, { headers: authHeaders() });
    return handle(r);
  },

  async patchScreening(id: string, body: any): Promise<{ submission: OfftakerSubmission }> {
    const r = await fetch(`${API_BASE}/offtaker-submissions/${id}/screening`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify(body),
    });
    return handle(r);
  },

  async patchDecision(id: string, body: any): Promise<{ submission: OfftakerSubmission }> {
    const r = await fetch(`${API_BASE}/offtaker-submissions/${id}/decision`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify(body),
    });
    return handle(r);
  },
};
