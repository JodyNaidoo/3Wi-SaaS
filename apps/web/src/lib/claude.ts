// Front-end helpers for AI skills. The actual streaming happens server-side.
import { streamAi } from './api';

export const SKILL_LABELS: Record<string, { name: string; tagline: string; route: string }> = {
  monthly_ops:       { name: 'Monthly Operations Report', tagline: 'Workstream RAG, disbursement, gate progress, PFMA checklist',  route: '/ai/monthly-ops' },
  risk_update:       { name: 'Risk Register Update',     tagline: 'Likelihood, impact, RAG, controls, owners, PFMA flags',          route: '/ai/risk-update' },
  mov_pack:          { name: 'MoV Evidence Pack',         tagline: 'Gate evidence, KPIs, financials, NCRs — funder-ready',           route: '/ai/mov-pack' },
  quarterly_report:  { name: 'Quarterly PSC Report',      tagline: 'MOA scorecard, financial report, stakeholder engagement',         route: '/ai/quarterly' },
  stakeholder_comms: { name: 'Stakeholder Communication', tagline: 'Branded letters and emails to funders, farmers, offtakers',        route: '/ai/stakeholder' },
};

export { streamAi };
