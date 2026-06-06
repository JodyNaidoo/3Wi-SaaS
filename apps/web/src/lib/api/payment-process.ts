/**
 * Client helpers for the Hempire payment verification process (Stage 2-6).
 * Maps 1:1 to the API routers in apps/api/src/routes/{farmer-portal,
 * verifications,authorisations,payments,ecrda}.ts
 */
import { api } from '../api';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

// ───────────────────────────────────────────────────── Types
export type ProcessStatus =
  | 'Awaiting Beneficiary' | 'Beneficiary-Accepted' | 'Disputed'
  | 'Calculation-Verified' | 'Calculation-Rejected'
  | 'Release-Authorised'   | 'On Hold'
  | 'Payment Pending'      | 'Paid'                  | 'Payment Failed';

export interface QueueDisbursement {
  id: string;
  processStatus: ProcessStatus;
  processStatusAt?: string;
  amountTotal: number | string;
  fundedHa: number | string;
  rateMechanisation?: number | string;
  rateLabour?: number | string;
  amountMechanisation?: number | string;
  amountLabour?: number | string;
  releaseBatchId?: string | null;
  paidAt?: string | null;
  grower: {
    fullName: string;
    externalRef: number;
    district?: string | null;
    region?: string | null;
    coordinator?: string | null;
    mappedHa?: number | string | null;
    seedlingsReceived?: number | null;
  };
  farmerSignoff?: {
    signedFullName?: string;
    signedAt?: string;
    decision?: string;
    indemnityVersion?: string;
    bankingBank?: string | null;
    bankingAccountType?: string | null;
  } | null;
  verificationSignoff?: {
    signedFullName?: string;
    signedAt?: string;
  } | null;
  releaseBatch?: { id: string; batchCode: string } | null;
  paymentRecord?: {
    bankReference?: string;
    paymentDate?: string;
    status?: string;
    popStorageKey?: string;
  } | null;
}

export interface ReleaseBatchSummary {
  id: string;
  batchCode: string;
  totalAmount: number | string;
  growerCount: number;
  status: 'pending_auth' | 'authorised' | 'paid' | 'on_hold' | 'cancelled';
  createdAt: string;
  releaseSignoff?: { signedFullName?: string; signedAt?: string; decision?: string } | null;
  _count?: { disbursements: number; paymentRecords: number };
}

export interface ReleaseBatchDetail extends ReleaseBatchSummary {
  disbursements: QueueDisbursement[];
}

// ───────────────────────────────────────────────────── Farmer portal (public)
export async function farmerOtpRequest(externalRef: number): Promise<{
  ok: boolean; sentTo: string; challengeId?: string; expiresAt?: number;
  devNote?: string; disbursementStatus?: ProcessStatus;
}> {
  const r = await fetch(`${API}/farmer/otp-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ externalRef }),
  });
  if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
  return r.json();
}

export async function farmerOtpVerify(externalRef: number, code: string): Promise<{
  ok: boolean; token: string; grower: { id: string; fullName: string; externalRef: number; district?: string };
  disbursementId: string;
}> {
  const r = await fetch(`${API}/farmer/otp-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ externalRef, code }),
  });
  if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
  return r.json();
}

export async function farmerGetDisbursement(token: string): Promise<{ disbursement: QueueDisbursement }> {
  const r = await fetch(`${API}/farmer/disbursement`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
  return r.json();
}

export interface FarmerAcceptBody {
  decision: 'accepted';
  signedFullName: string;
  indemnityAccepted: true;
  banking: {
    accountHolder: string;
    bank: string;
    accountNumber: string;
    branchCode: string;
    accountType: 'cheque' | 'savings' | 'current' | 'transmission';
    proofStorageKey?: string;
  };
}
export interface FarmerDisputeBody {
  decision: 'disputed';
  signedFullName: string;
  disputeReason: string;
}

export async function farmerSubmitSignoff(token: string, body: FarmerAcceptBody | FarmerDisputeBody) {
  const r = await fetch(`${API}/farmer/signoff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error((await r.json()).error ?? r.statusText);
  return r.json();
}

// ───────────────────────────────────────────────────── Verifier (Solly)
export const verifications = {
  queue:   () => api<{ queue: QueueDisbursement[]; count: number; totalValue: number }>('/verifications/queue'),
  twofa:   () => api<{ challengeId: string; expiresAt: number; method: string; devNote?: string }>('/verifications/twofa/start', { method: 'POST' }),
  verify:  (id: string, body: { code: string; signedFullName: string; notes?: string }) =>
             api<{ ok: boolean }>(`/verifications/${id}/verify`, { method: 'POST', body: JSON.stringify(body) }),
  reject:  (id: string, body: { code: string; signedFullName: string; reason: string }) =>
             api<{ ok: boolean }>(`/verifications/${id}/reject`, { method: 'POST', body: JSON.stringify(body) }),
};

// ───────────────────────────────────────────────────── Authoriser (Dr Blouw)
export const authorisations = {
  queue:        () => api<{ queue: QueueDisbursement[]; count: number; totalValue: number }>('/authorisations/queue'),
  createBatch:  (disbursementIds: string[]) => api<{ ok: boolean; batch: ReleaseBatchSummary }>('/authorisations/batches', { method: 'POST', body: JSON.stringify({ disbursementIds }) }),
  listBatches:  (status?: string) => api<{ batches: ReleaseBatchSummary[] }>(`/authorisations/batches${status ? `?status=${status}` : ''}`),
  getBatch:     (id: string) => api<{ batch: ReleaseBatchDetail }>(`/authorisations/batches/${id}`),
  twofa:        () => api<{ challengeId: string; expiresAt: number; method: string; devNote?: string }>('/authorisations/twofa/start', { method: 'POST' }),
  authorise:    (id: string, body: { code: string; signedFullName: string; governanceAttestation: true }) =>
                  api<{ ok: boolean }>(`/authorisations/batches/${id}/authorise`, { method: 'POST', body: JSON.stringify(body) }),
  hold:         (id: string, body: { code: string; signedFullName: string; reason: string }) =>
                  api<{ ok: boolean }>(`/authorisations/batches/${id}/hold`, { method: 'POST', body: JSON.stringify(body) }),
};

// ───────────────────────────────────────────────────── Payments (Bookkeeper)
export const payments = {
  queue:        () => api<{ queue: QueueDisbursement[]; count: number; totalValue: number }>('/payments/queue'),
  exportUrl:    (batchId: string) => {
    const token = (typeof window !== 'undefined') ? window.localStorage.getItem('3wi.auth.v1') : null;
    let bearer = '';
    try { bearer = token ? JSON.parse(token).accessToken : ''; } catch {}
    return `${API}/payments/batches/${batchId}/export?bearer=${encodeURIComponent(bearer)}`;
  },
  exportCsv:    async (batchId: string): Promise<Blob> => {
    const token = (typeof window !== 'undefined') ? window.localStorage.getItem('3wi.auth.v1') : null;
    let bearer = '';
    try { bearer = token ? JSON.parse(token).accessToken : ''; } catch {}
    const r = await fetch(`${API}/payments/batches/${batchId}/export`, { headers: { Authorization: `Bearer ${bearer}` } });
    if (!r.ok) throw new Error((await r.text()) || r.statusText);
    return r.blob();
  },
  confirm:      (id: string, body: { bankReference: string; paymentDate: string; popStorageKey?: string }) =>
                  api<{ ok: boolean }>(`/payments/${id}/confirm`, { method: 'POST', body: JSON.stringify(body) }),
  fail:         (id: string, body: { reason: string }) =>
                  api<{ ok: boolean }>(`/payments/${id}/fail`, { method: 'POST', body: JSON.stringify(body) }),
};

// ───────────────────────────────────────────────────── ECRDA (read-only)
export const ecrda = {
  summary:        () => api<{
    growerCount: number; paidCount: number; paidValue: number;
    totalEnvelope: number; remainingValue: number; percentPaid: number;
    byStatus: Record<string, { count: number; value: number }>;
  }>('/ecrda/summary'),
  disbursements:  (district?: string) => api<{ disbursements: QueueDisbursement[]; count: number }>(`/ecrda/disbursements${district ? `?district=${encodeURIComponent(district)}` : ''}`),
  popUrl:         (id: string) => api<{ url: string; bankReference?: string; paymentDate?: string; amount: number | string }>(`/ecrda/disbursements/${id}/pop`),
};

// ───────────────────────────────────────────────────── Shared formatters
export function formatRand(n?: number | string | null): string {
  if (n == null || n === '') return '—';
  const v = Number(n);
  if (Number.isNaN(v)) return '—';
  return `R ${v.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
export function formatNum(n?: number | string | null, digits = 2): string {
  if (n == null || n === '') return '—';
  const v = Number(n);
  if (Number.isNaN(v)) return '—';
  return v.toLocaleString('en-ZA', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
export function statusPillClasses(status: ProcessStatus | string): string {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Payment Pending':
    case 'Release-Authorised':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Calculation-Verified':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Beneficiary-Accepted':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'Awaiting Beneficiary':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Disputed':
    case 'Calculation-Rejected':
    case 'Payment Failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'On Hold':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
