import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const growersRouter = Router({ mergeParams: true });
growersRouter.use(requireAuth);

// Pull the most recent disbursement (with its latest signoff) and surface it
// as a singular `disbursement` field on each grower, since UI/lib types model
// the relation as 1:1 in practice.
function withLatestDisbursement<T extends { disbursements?: any[] }>(g: T) {
  const { disbursements, ...rest } = g as any;
  const latest = Array.isArray(disbursements) && disbursements.length > 0 ? disbursements[0] : null;
  let disbursement: any = null;
  if (latest) {
    const { signoffs, ...d } = latest;
    const latestSignoff = Array.isArray(signoffs) && signoffs.length > 0 ? signoffs[0] : null;
    disbursement = { ...d, signoff: latestSignoff };
  }
  return { ...rest, disbursement };
}

growersRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const partId = typeof req.query.partId === 'string' ? req.query.partId : undefined;
    const rows = await withTenant(req.user!.tenantId, (tx) =>
      tx.grower.findMany({
        where: {
          projectId: req.params.projectId,
          ...(partId ? { partId } : {}),
        },
        include: {
          disbursements: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              signoffs: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
        orderBy: { externalRef: 'asc' },
      }),
    );
    const growers = rows.map(withLatestDisbursement);
    res.json({ growers });
  } catch (e) { next(e); }
});

growersRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const row = await withTenant(req.user!.tenantId, (tx) =>
      tx.grower.findFirst({
        where: { id: req.params.id, projectId: req.params.projectId },
        include: {
          disbursements: {
            orderBy: { createdAt: 'desc' },
            include: {
              signoffs: {
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      }),
    );
    if (!row) return res.status(404).json({ error: 'Grower not found' });
    res.json({ grower: withLatestDisbursement(row) });
  } catch (e) { next(e); }
});

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  farmName: z.string().optional(),
  district: z.string().optional(),
  region: z.string().optional(),
  coordinator: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  idNumber: z.string().optional(),
  seedlingsPlanned: z.number().int().nonnegative().optional(),
  seedlingsReceived: z.number().int().nonnegative().optional(),
  deliveryGap: z.number().int().optional(),
  plannedHa: z.number().nonnegative().optional(),
  mappedHa: z.number().nonnegative().optional(),
  theoreticalHa: z.number().nonnegative().optional(),
  outlierFlag: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'dropped']).optional(),
  notes: z.string().optional(),
});

growersRouter.put('/:id', requireRole('director', 'staff'), async (req: AuthedRequest, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const updated = await withTenant(req.user!.tenantId, (tx) =>
      tx.grower.update({
        where: { id: req.params.id },
        data: body,
      }),
    );
    res.json({ grower: updated });
  } catch (e) { next(e); }
});

const bulkSchema = z.object({
  partId: z.string().uuid(),
  growers: z.array(z.object({
    externalRef: z.number().int().positive(),
    fullName: z.string().min(2),
    farmName: z.string().optional(),
    district: z.string().optional(),
    region: z.string().optional(),
    coordinator: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    seedlingsPlanned: z.number().int().nonnegative().default(0),
    seedlingsReceived: z.number().int().nonnegative().default(0),
    deliveryGap: z.number().int().default(0),
    plannedHa: z.number().nonnegative().default(0),
    mappedHa: z.number().nonnegative().default(0),
    theoreticalHa: z.number().nonnegative().default(0),
    outlierFlag: z.boolean().default(false),
  })).max(500),
});

growersRouter.post('/bulk-import', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const body = bulkSchema.parse(req.body);
    const tid = req.user!.tenantId;
    const projectId = req.params.projectId;

    const result = await withTenant(tid, async (tx) => {
      const out = [];
      for (const g of body.growers) {
        const upserted = await tx.grower.upsert({
          where: { projectId_externalRef: { projectId, externalRef: g.externalRef } },
          update: { ...g, partId: body.partId },
          create: { ...g, projectId, partId: body.partId, tenantId: tid },
        });
        out.push(upserted);
      }
      return out;
    });

    res.json({ count: result.length, growers: result });
  } catch (e) { next(e); }
});
