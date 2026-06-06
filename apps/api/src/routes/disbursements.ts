import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const disbursementsRouter = Router({ mergeParams: true });
disbursementsRouter.use(requireAuth);

// Default Sunshines Part 1 rates. Stored per-disbursement so they can drift
// later without affecting historic rows.
const DEFAULT_RATE_MECH = new Prisma.Decimal('7350.00');
const DEFAULT_RATE_LAB  = new Prisma.Decimal('3618.72');

disbursementsRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const partId = typeof req.query.partId === 'string' ? req.query.partId : undefined;
    const items = await withTenant(req.user!.tenantId, (tx) =>
      tx.disbursement.findMany({
        where: {
          projectId: req.params.projectId,
          ...(partId ? { partId } : {}),
        },
        include: {
          grower: { select: { fullName: true, externalRef: true, district: true, mappedHa: true } },
          signoffs: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { grower: { externalRef: 'asc' } },
      }),
    );
    res.json({ disbursements: items });
  } catch (e) { next(e); }
});

const calcSchema = z.object({
  fundedHa: z.number().nonnegative(),
  rateMechanisation: z.number().nonnegative().optional(),
  rateLabour: z.number().nonnegative().optional(),
});

// Pure calculator. No side effects.
disbursementsRouter.post('/calculate', async (req: AuthedRequest, res, next) => {
  try {
    const body = calcSchema.parse(req.body);
    const fundedHa = new Prisma.Decimal(String(body.fundedHa));
    const rateMech = body.rateMechanisation !== undefined
      ? new Prisma.Decimal(String(body.rateMechanisation)) : DEFAULT_RATE_MECH;
    const rateLab  = body.rateLabour !== undefined
      ? new Prisma.Decimal(String(body.rateLabour)) : DEFAULT_RATE_LAB;

    const amountMech = fundedHa.mul(rateMech);
    const amountLab  = fundedHa.mul(rateLab);
    const amountTot  = amountMech.add(amountLab);

    res.json({
      fundedHa: fundedHa.toString(),
      rateMechanisation: rateMech.toString(),
      rateLabour: rateLab.toString(),
      amountMechanisation: amountMech.toString(),
      amountLabour: amountLab.toString(),
      amountTotal: amountTot.toString(),
    });
  } catch (e) { next(e); }
});

const signoffSchema = z.object({
  signoffStatus: z.enum(['Awaiting', 'Disputed', 'Signed', 'Withdrawn']),
  witnessName: z.string().optional(),
  witnessEmail: z.string().email().optional(),
  signatureRef: z.string().optional(),
  notesFromGrower: z.string().optional(),
});

disbursementsRouter.post('/:id/signoff', requireRole('director', 'staff'), async (req: AuthedRequest, res, next) => {
  try {
    const body = signoffSchema.parse(req.body);
    const tid = req.user!.tenantId;

    const result = await withTenant(tid, async (tx) => {
      const disbursement = await tx.disbursement.findFirstOrThrow({
        where: { id: req.params.id, projectId: req.params.projectId },
      });

      const signoff = await tx.disbursementSignoff.create({
        data: {
          tenantId: tid,
          disbursementId: disbursement.id,
          growerId: disbursement.growerId,
          signoffStatus: body.signoffStatus,
          signedAt: body.signoffStatus === 'Signed' ? new Date() : null,
          witnessName: body.witnessName,
          witnessEmail: body.witnessEmail,
          signatureRef: body.signatureRef,
          notesFromGrower: body.notesFromGrower,
        },
      });

      // If signed, advance disbursement to Approved (separate Paid step is finance-side).
      if (body.signoffStatus === 'Signed' && disbursement.status === 'Pending') {
        await tx.disbursement.update({
          where: { id: disbursement.id },
          data: { status: 'Approved' },
        });
      }

      return signoff;
    });

    res.json({ signoff: result });
  } catch (e) { next(e); }
});
