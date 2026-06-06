import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const helpRequestsRouter = Router({ mergeParams: true });
helpRequestsRouter.use(requireAuth);

const createSchema = z.object({
  gate: z.string().optional(),
  message: z.string().min(2),
  photoUrl: z.string().url().optional(),
});

helpRequestsRouter.post('/', requireRole('farmer'), async (req: AuthedRequest, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const created = await withTenant(req.user!.tenantId, (tx) =>
      tx.helpRequest.create({
        data: {
          projectId: req.params.projectId,
          farmerUserId: req.user!.id,
          gate: body.gate,
          message: body.message,
          photoUrl: body.photoUrl,
        },
      }),
    );
    res.json({ helpRequest: created });
  } catch (e) { next(e); }
});

helpRequestsRouter.get('/', requireRole('technical','director'), async (req: AuthedRequest, res, next) => {
  try {
    const list = await withTenant(req.user!.tenantId, (tx) =>
      tx.helpRequest.findMany({
        where: { projectId: req.params.projectId, status: { in: ['open','breached'] } },
        orderBy: { createdAt: 'asc' },
        include: { farmer: { select: { fullName: true, phone: true, district: true } } },
      }),
    );
    res.json({ helpRequests: list });
  } catch (e) { next(e); }
});

const respondSchema = z.object({
  response: z.string().min(2),
  action: z.enum(['respond','approve','ncr']).default('respond'),
});

helpRequestsRouter.patch('/:rid', requireRole('technical'), async (req: AuthedRequest, res, next) => {
  try {
    const body = respondSchema.parse(req.body);
    const updated = await withTenant(req.user!.tenantId, (tx) =>
      tx.helpRequest.update({
        where: { id: req.params.rid },
        data: {
          response: body.response,
          status: body.action === 'ncr' ? 'closed' : 'responded',
          responderId: req.user!.id,
          respondedAt: new Date(),
        },
      }),
    );
    res.json({ helpRequest: updated });
  } catch (e) { next(e); }
});
