import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const milestonesRouter = Router({ mergeParams: true });
milestonesRouter.use(requireAuth);

milestonesRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const items = await withTenant(req.user!.tenantId, (tx) =>
      tx.milestone.findMany({
        where: { projectId: req.params.projectId },
        orderBy: { code: 'asc' },
      }),
    );
    res.json({ milestones: items });
  } catch (e) { next(e); }
});

const upsertManySchema = z.object({
  milestones: z.array(z.object({
    code: z.string(),
    label: z.string(),
    dueDate: z.string(),
    workstreamIds: z.array(z.string()).default([]),
    paymentAmount: z.number().nullable().optional(),
    gateEvidence: z.any().optional(),
  })).max(25),
});

milestonesRouter.post('/', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const body = upsertManySchema.parse(req.body);
    const out = await withTenant(req.user!.tenantId, async (tx) => {
      await tx.milestone.deleteMany({ where: { projectId: req.params.projectId } });
      return tx.milestone.createManyAndReturn({
        data: body.milestones.map((m) => ({
          projectId: req.params.projectId,
          code: m.code,
          label: m.label,
          dueDate: new Date(m.dueDate),
          workstreamIds: m.workstreamIds,
          paymentAmount: m.paymentAmount ?? null,
          gateEvidence: m.gateEvidence ?? null,
        })),
      });
    });
    res.json({ milestones: out });
  } catch (e) { next(e); }
});

const updateSchema = z.object({
  status: z.enum(['pending','in_progress','done','blocked']).optional(),
  completionPct: z.number().min(0).max(100).optional(),
  paymentAmount: z.number().optional(),
});

milestonesRouter.patch('/:mid', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const updated = await withTenant(req.user!.tenantId, (tx) =>
      tx.milestone.update({ where: { id: req.params.mid }, data: body }),
    );
    res.json({ milestone: updated });
  } catch (e) { next(e); }
});
