import { api } from '../api';

export interface DisbursementSignoff {
  id: string;
  signedBy?: string | null;
  signedAt?: string | null;
  notes?: string | null;
}

export interface Disbursement {
  id: string;
  fundedHa?: number | null;
  amountMechanisation?: number | null;
  amountLabour?: number | null;
  amountTotal?: number | null;
  status?: string | null;
  // 0005 — payment verification process state
  processStatus?: string | null;
  processStatusAt?: string | null;
  signoff?: DisbursementSignoff | null;
}

export interface Grower {
  id: string;
  externalRef?: number | null;
  fullName: string;
  farmName?: string | null;
  district?: string | null;
  region?: string | null;
  coordinator?: string | null;
  seedlingsPlanned?: number | null;
  seedlingsReceived?: number | null;
  deliveryGap?: number | null;
  plannedHa?: number | null;
  mappedHa?: number | null;
  theoreticalHa?: number | null;
  outlierFlag?: boolean | null;
  status?: string | null;
  notes?: string | null;
  disbursement?: Disbursement | null;
}

export async function listGrowers(
  projectId: string,
  filters?: { partId?: string }
): Promise<{ growers: Grower[] }> {
  const qs = filters?.partId ? `?partId=${encodeURIComponent(filters.partId)}` : '';
  return api<{ growers: Grower[] }>(`/projects/${projectId}/growers${qs}`);
}

export async function getGrower(projectId: string, id: string): Promise<{ grower: Grower }> {
  return api<{ grower: Grower }>(`/projects/${projectId}/growers/${id}`);
}

export async function updateGrower(
  projectId: string,
  id: string,
  data: Partial<Grower>
): Promise<{ grower: Grower }> {
  return api<{ grower: Grower }>(`/projects/${projectId}/growers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
