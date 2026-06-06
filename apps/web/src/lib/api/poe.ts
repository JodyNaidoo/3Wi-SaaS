/**
 * Portfolio of Evidence API client.
 */

import { useAuthStore } from '../auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export type PoeStatus =
  | 'draft'
  | 'submitted'
  | 'under_verification'
  | 'competent'
  | 'not_yet_competent'
  | 're_assess'
  | 'deferred'
  | 'cancelled';

export interface PoeSubmission {
  id: string;
  tenantId: string;
  candidateName: string;
  candidateIdNumber: string | null;
  cohort: string;
  district: string | null;
  farmName: string | null;
  candidatePhone: string | null;
  candidateEmail: string | null;
  learnerReference: string | null;
  growerId: string | null;
  moduleId: string;
  moduleTitle: string;
  moduleUsId: string | null;
  moduleNqfLevel: number | null;
  moduleCredits: number | null;
  evidencePayload: Record<string, unknown>;
  status: PoeStatus;
  totalScore: number | null;
  decision: string | null;
  assessorFeedback: string | null;
  requiredActions: string | null;
  coordinatorName: string | null;
  coordinatorRole: string | null;
  coordinatorDate: string | null;
  assessorName: string | null;
  assessorReg: string | null;
  assessorDate: string | null;
  internalModeratorName: string | null;
  internalModeratorDate: string | null;
  externalModeratorName: string | null;
  externalModeratorDate: string | null;
  poeRef: string | null;
  submittedAt: string;
  verifiedAt: string | null;
  decidedAt: string | null;
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PoeDashboardLearner {
  candidateName: string;
  cohort: string;
  district: string | null;
  status: Record<string, PoeStatus>;
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

export interface StartPoeInput {
  candidateName: string;
  candidateIdNumber?: string;
  cohort: string;
  district?: string;
  farmName?: string;
  candidatePhone?: string;
  candidateEmail?: string;
  learnerReference?: string;
  growerId?: string;
  moduleId: string;
  moduleTitle: string;
  moduleUsId?: string;
  moduleNqfLevel?: number;
  moduleCredits?: number;
  evidencePayload: Record<string, unknown>;
  totalScore?: number;
  decision?: string;
  assessorFeedback?: string;
  requiredActions?: string;
  coordinatorName?: string;
  coordinatorRole?: string;
  coordinatorDate?: string;
  poeRef?: string;
}

export const poe = {
  async start(input: StartPoeInput): Promise<{ submission: PoeSubmission; nextStep: string }> {
    const r = await fetch(`${API_BASE}/poe-submissions/start`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify(input),
    });
    return handle(r);
  },

  async list(filter?: { status?: PoeStatus; moduleId?: string; cohort?: string; candidate?: string }):
    Promise<{ submissions: PoeSubmission[]; count: number }>
  {
    const params = new URLSearchParams();
    if (filter?.status) params.set('status', filter.status);
    if (filter?.moduleId) params.set('moduleId', filter.moduleId);
    if (filter?.cohort) params.set('cohort', filter.cohort);
    if (filter?.candidate) params.set('candidate', filter.candidate);
    const qs = params.toString();
    const r = await fetch(`${API_BASE}/poe-submissions${qs ? `?${qs}` : ''}`, { headers: authHeaders() });
    return handle(r);
  },

  async get(id: string): Promise<{ submission: PoeSubmission }> {
    const r = await fetch(`${API_BASE}/poe-submissions/${id}`, { headers: authHeaders() });
    return handle(r);
  },

  async dashboard(cohort?: string): Promise<{ learners: PoeDashboardLearner[]; cohorts: string[]; submissionCount: number }> {
    const qs = cohort ? `?cohort=${encodeURIComponent(cohort)}` : '';
    const r = await fetch(`${API_BASE}/poe-submissions/dashboard${qs}`, { headers: authHeaders() });
    return handle(r);
  },

  async verify(id: string, body: { totalScore: number; status: PoeStatus; evidenceUpdates?: Record<string, unknown> }): Promise<{ submission: PoeSubmission }> {
    const r = await fetch(`${API_BASE}/poe-submissions/${id}/verify`, {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify(body),
    });
    return handle(r);
  },

  async patchDecision(id: string, body: {
    decision: string;
    status: PoeStatus;
    assessorFeedback?: string;
    requiredActions?: string;
    assessorName?: string;
    assessorReg?: string;
    internalModeratorName?: string;
    externalModeratorName?: string;
  }): Promise<{ submission: PoeSubmission }> {
    const r = await fetch(`${API_BASE}/poe-submissions/${id}/decision`, {
      method: 'PATCH', headers: authHeaders(),
      body: JSON.stringify(body),
    });
    return handle(r);
  },
};
