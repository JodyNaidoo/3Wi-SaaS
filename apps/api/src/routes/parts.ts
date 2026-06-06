import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const partsRouter = Router({ mergeParams: true });
partsRouter.use(requireAuth);

partsRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const parts = await withTenant(req.user!.tenantId, (tx) =>
      tx.part.findMany({
        where: { projectId: req.params.projectId },
        orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
        include: {
          _count: { select: { deliverables: true, growers: true, disbursements: true } },
        },
      }),
    );
    res.json({ parts });
  } catch (e) { next(e); }
});

const createSchema = z.object({
  code: z.string().min(1).max(16),
  name: z.string().min(2),
  description: z.string().optional(),
  leadFunder: z.string().min(2),
  budgetAllocation: z.number().nonnegative().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'paused', 'closed']).default('active'),
  sortOrder: z.number().int().nonnegative().default(0),
});

partsRouter.post('/', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const created = await withTenant(req.user!.tenantId, (tx) =>
      tx.part.create({
        data: {
          tenantId: req.user!.tenantId,
          projectId: req.params.projectId,
          code: body.code,
          name: body.name,
          description: body.description,
          leadFunder: body.leadFunder,
          budgetAllocation: body.budgetAllocation,
          startDate: body.startDate ? new Date(body.startDate) : null,
          endDate: body.endDate ? new Date(body.endDate) : null,
          status: body.status,
          sortOrder: body.sortOrder,
        },
      }),
    );
    res.json({ part: created });
  } catch (e) { next(e); }
});

partsRouter.get('/:partId', async (req: AuthedRequest, res, next) => {
  try {
    const part = await withTenant(req.user!.tenantId, (tx) =>
      tx.part.findFirst({
        where: { id: req.params.partId, projectId: req.params.projectId },
        include: {
          deliverables: { orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }] },
        },
      }),
    );
    if (!part) return res.status(404).json({ error: 'Part not found' });
    res.json({ part });
  } catch (e) { next(e); }
});
