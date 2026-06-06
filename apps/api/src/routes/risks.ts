import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const risksRouter = Router({ mergeParams: true });
risksRouter.use(requireAuth);

risksRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const risks = await withTenant(req.user!.tenantId, (tx) =>
      tx.risk.findMany({ where: { projectId: req.params.projectId }, orderBy: { code: 'asc' } }),
    );
    res.json({ risks });
  } catch (e) { next(e); }
});

const upsertSchema = z.object({
  risks: z.array(z.object({
    code: z.string(),
    label: z.string(),
    likelihood: z.number().int().min(1).max(5),
    impact: z.number().int().min(1).max(5),
    ragStatus: z.enum(['green','amber','red']),
    controlAction: z.string(),
    owner: z.string(),
    pfmaFlag: z.boolean().default(false),
  })),
});

risksRouter.post('/', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const body = upsertSchema.parse(req.body);
    const out = await withTenant(req.user!.tenantId, async (tx) => {
      await tx.risk.deleteMany({ where: { projectId: req.params.projectId } });
      return tx.risk.createManyAndReturn({
        data: body.risks.map((r) => ({ ...r, projectId: req.params.projectId })),
      });
    });
    res.json({ risks: out });
  } catch (e) { next(e); }
});
