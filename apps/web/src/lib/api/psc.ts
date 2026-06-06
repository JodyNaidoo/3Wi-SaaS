import { api } from '../api';

export interface PartSummary {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  leadFunder?: string | null;
  budgetAllocation?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  sortOrder?: number;
  _count?: { deliverables: number; growers: number; disbursements: number };
}

export interface Deliverable {
  id: string;
  code: string;
  title?: string | null;
  description?: string | null;
  owner?: string | null;
  dueDate?: string | null;
  status?: string | null;
  percentComplete?: number | null;
  payment?: string | number | null;
  funder?: string | null;
  sortOrder?: number;
}

export interface PartDetail extends PartSummary {
  deliverables: Deliverable[];
}

export interface DisbursementRow {
  id: string;
  growerId: string;
  partId?: string | null;
  fundedHa?: string | number | null;
  rateMechanisation?: string | number | null;
  rateLabour?: string | number | null;
  amountMechanisation?: string | number | null;
  amountLabour?: string | number | null;
  amountTotal?: string | number | null;
  status?: string | null;
  basis?: string | null;
  grower?: {
    fullName?: string | null;
    externalRef?: number | null;
    district?: string | null;
    mappedHa?: string | number | null;
  } | null;
  signoffs?: Array<{ id: string; signoffStatus?: string | null; signedAt?: string | null }>;
}

export interface ProjectMetadata {
  id: string;
  name?: string | null;
  code?: string | null;
  tagline?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  totalBudget?: string | number | null;
  funder?: string | null;
  moaReference?: string | null;
  workstreams?: Array<{ id: string; code: string; name: string; budget?: string | number | null }>;
  milestones?: Array<{ id: string; code: string; label?: string | null; dueDate?: string | null }>;
  risks?: Array<{
    id: string;
    code: string;
    label?: string | null;
    likelihood?: number | null;
    impact?: number | null;
    ragStatus?: string | null;
    controlAction?: string | null;
    owner?: string | null;
    pfmaFlag?: boolean | null;
  }>;
}

export async function listParts(projectId: string): Promise<{ parts: PartSummary[] }> {
  return api(`/projects/${projectId}/parts`);
}

export async function getPart(projectId: string, partId: string): Promise<{ part: PartDetail }> {
  return api(`/projects/${projectId}/parts/${partId}`);
}

export async function listDisbursements(
  projectId: string,
  filters?: { partId?: string },
): Promise<{ disbursements: DisbursementRow[] }> {
  const qs = filters?.partId ? `?partId=${encodeURIComponent(filters.partId)}` : '';
  return api(`/projects/${projectId}/disbursements${qs}`);
}

export async function getProject(projectId: string): Promise<{ project: ProjectMetadata }> {
  return api(`/projects/${projectId}`);
}
