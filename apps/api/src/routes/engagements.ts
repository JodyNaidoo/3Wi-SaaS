/**
 * Engagements — client engagement workflow.
 *
 * Routes:
 *   POST   /engagements/start       - intake form submission (status=requested)
 *   GET    /engagements             - list engagements for current tenant
 *   GET    /engagements/:id         - single engagement detail
 *   PATCH  /engagements/:id/status  - move engagement to next state
 *
 * Auth: all routes require auth. Status updates restricted to director.
 *
 * Tenant isolation: all queries wrap in withTenant() so RLS bites.
 *
 * Integrations fired on transition to 'accepted' (NEW):
 *   1. QuickBooks createDepositInvoice() -> stores depositInvoiceRef on engagement
 *   2. Asana createEngagementProject()   -> stores asanaProjectId on engagement
 *   Both are MOCK by default. Set QBO_* / ASANA_* env vars to enable live.
 */

import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { createDepositInvoice } from '../services/quickbooks.js';
import { createEngagementProject } from '../services/asana.js';

export const engagementsRouter = Router();
engagementsRouter.use(requireAuth);

// ───────────────────────────────────────────── Helpers

const StartBody = z.object({
  serviceUnit: z.string().min(1),
  serviceSlug: z.string().min(1),
  serviceName: z.string().min(1),
  clientName: z.string().min(2),
  clientCompany: z.string().optional(),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  scopeChoices: z.record(z.string(), z.any()).optional(),
  budgetIndication: z.string().optional(),
  desiredStartDate: z.string().optional(),
  notes: z.string().optional(),
});

function buildScopeSummary(input: z.infer<typeof StartBody>): string {
  const lines: string[] = [];
  lines.push(`Service: ${input.serviceName}`);
  lines.push(`Client: ${input.clientName}${input.clientCompany ? ` (${input.clientCompany})` : ''}`);
  if (input.budgetIndication) lines.push(`Budget indication: ${input.budgetIndication}`);
  if (input.desiredStartDate) lines.push(`Desired start: ${input.desiredStartDate}`);
  if (input.scopeChoices) {
    for (const [k, v] of Object.entries(input.scopeChoices)) {
      lines.push(`  · ${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
    }
  }
  if (input.notes) lines.push(`Notes: ${input.notes}`);
  return lines.join('\n');
}

// ───────────────────────────────────────────── POST /start

engagementsRouter.post('/start', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const body = StartBody.parse(req.body);
    const summary = buildScopeSummary(body);

    const created = await withTenant(tid, (tx) =>
      tx.engagement.create({
        data: {
          tenantId: tid,
          serviceUnit: body.serviceUnit,
          serviceSlug: body.serviceSlug,
          serviceName: body.serviceName,
          clientName: body.clientName,
          clientCompany: body.clientCompany ?? null,
          clientEmail: body.clientEmail,
          clientPhone: body.clientPhone ?? null,
          scopeChoices: body.scopeChoices ?? undefined,
          scopeSummary: summary,
          budgetIndication: body.budgetIndication ?? null,
          desiredStartDate: body.desiredStartDate ? new Date(body.desiredStartDate) : null,
          notes: body.notes ?? null,
          createdByUserId: req.user!.id,
        },
      }),
    );

    res.status(201).json({
      engagement: created,
      nextStep: 'An operations team member will review your request within one business day and follow up with the scoped proposal and a kick-off invoice.',
    });
  } catch (e) {
    next(e);
  }
});

// ───────────────────────────────────────────── GET / (list)

engagementsRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const serviceUnit = typeof req.query.serviceUnit === 'string' ? req.query.serviceUnit : undefined;

    const items = await withTenant(tid, (tx) =>
      tx.engagement.findMany({
        where: {
          ...(status ? { status: status as any } : {}),
          ...(serviceUnit ? { serviceUnit } : {}),
        },
        orderBy: { createdAt: 'desc' },
      }),
    );

    res.json({
      engagements: items,
      count: items.length,
    });
  } catch (e) {
    next(e);
  }
});

// ───────────────────────────────────────────── GET /:id

engagementsRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const id = req.params.id;
    const item = await withTenant(tid, (tx) =>
      tx.engagement.findFirst({
        where: { id, tenantId: tid },
      }),
    );
    if (!item) return res.status(404).json({ error: 'Engagement not found' });
    res.json({ engagement: item });
  } catch (e) {
    next(e);
  }
});

// ───────────────────────────────────────────── PATCH /:id/status

const StatusPatch = z.object({
  status: z.enum(['requested', 'accepted', 'in_progress', 'delivered', 'closed', 'cancelled']),
  scopeDocUrl: z.string().url().optional(),
  depositInvoiceRef: z.string().optional(),
  asanaProjectId: z.string().optional(),
});

engagementsRouter.patch('/:id/status', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const id = req.params.id;
    const patch = StatusPatch.parse(req.body);

    // Pre-fetch current engagement so we know the previous status
    const existing = await withTenant(tid, (tx) =>
      tx.engagement.findFirst({ where: { id, tenantId: tid } }),
    );
    if (!existing) return res.status(404).json({ error: 'Engagement not found' });

    // Detect transition INTO 'accepted' (from anything else)
    const transitioningToAccepted = patch.status === 'accepted' && existing.status !== 'accepted';

    // Fire integrations on accept (best-effort: don't fail the patch if they error)
    let qboResult: Awaited<ReturnType<typeof createDepositInvoice>> | undefined;
    let asanaResult: Awaited<ReturnType<typeof createEngagementProject>> | undefined;

    if (transitioningToAccepted) {
      try {
        qboResult = await createDepositInvoice({
          engagementId: existing.id,
          clientName: existing.clientName,
          clientEmail: existing.clientEmail,
          clientCompany: existing.clientCompany,
          serviceName: existing.serviceName,
          serviceSlug: existing.serviceSlug,
          scopeSummary: existing.scopeSummary,
          budgetIndication: existing.budgetIndication,
        });
      } catch (e) {
        console.error('[engagements] QuickBooks integration failed:', (e as Error).message);
      }

      try {
        asanaResult = await createEngagementProject({
          engagementId: existing.id,
          serviceName: existing.serviceName,
          serviceSlug: existing.serviceSlug,
          clientName: existing.clientName,
          clientCompany: existing.clientCompany,
        });
      } catch (e) {
        console.error('[engagements] Asana integration failed:', (e as Error).message);
      }
    }

    const timestamps: Record<string, Date> = {};
    if (patch.status === 'accepted')    timestamps.acceptedAt = new Date();
    if (patch.status === 'delivered')   timestamps.deliveredAt = new Date();
    if (patch.status === 'closed')      timestamps.closedAt = new Date();

    // Persist status + any integration results (manual overrides in body win)
    const updated = await withTenant(tid, (tx) =>
      tx.engagement.update({
        where: { id },
        data: {
          status: patch.status,
          ...(patch.scopeDocUrl                                         ? { scopeDocUrl: patch.scopeDocUrl } : {}),
          ...(patch.depositInvoiceRef                                   ? { depositInvoiceRef: patch.depositInvoiceRef }
                                                                       : (qboResult?.invoiceRef           ? { depositInvoiceRef: qboResult.invoiceRef } : {})),
          ...(patch.asanaProjectId                                      ? { asanaProjectId: patch.asanaProjectId }
                                                                       : (asanaResult?.projectId         ? { asanaProjectId: asanaResult.projectId } : {})),
          ...timestamps,
        },
      }),
    );

    res.json({
      engagement: updated,
      ...(transitioningToAccepted ? {
        integrations: {
          quickbooks: qboResult ?? null,
          asana:      asanaResult ?? null,
        },
      } : {}),
    });
  } catch (e) {
    next(e);
  }
});
