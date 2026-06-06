/**
 * Stage 4 — Release authorisation (Dr Sunshine Blouw, Release Authoriser).
 *
 * Routes:
 *   GET  /authorisations/queue             - lists Calculation-Verified disbursements
 *                                            ready to be batched.
 *   POST /authorisations/batches           - body: { disbursementIds[] }
 *                                            creates a new release batch
 *                                            (status = pending_auth).
 *   GET  /authorisations/batches           - lists release batches with status.
 *   GET  /authorisations/batches/:id       - batch detail incl. line items.
 *   POST /authorisations/twofa/start       - issues a 2FA challenge.
 *   POST /authorisations/batches/:id/authorise - body: { code, signedFullName, governanceAttestation }
 *   POST /authorisations/batches/:id/hold      - body: { code, signedFullName, reason }
 *
 * Segregation: only role='authoriser' may authorise/hold. Verifier may NOT.
 */

import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { challenge, verify as verify2FA } from '../services/mocks/twofa.js';

export const authorisationsRouter = Router();
authorisationsRouter.use(requireAuth);

// ───────────────────────────────────────────── Queue: verified, not yet batched
authorisationsRouter.get('/queue', requireRole('authoriser', 'director', 'psc'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const items = await withTenant(tid, (tx) =>
      tx.disbursement.findMany({
        where: { processStatus: 'Calculation-Verified', releaseBatchId: null },
        include: {
          grower: { select: { fullName: true, externalRef: true, district: true } },
          verificationSignoff: { select: { signedFullName: true, signedAt: true } },
        },
        orderBy: { grower: { externalRef: 'asc' } },
      }),
    );
    res.json({
      queue: items,
      count: items.length,
      totalValue: items.reduce((s, d) => s + Number(d.amountTotal), 0),
    });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── Create batch
const createBatchSchema = z.object({
  disbursementIds: z.array(z.string().uuid()).min(1).max(100),
});

authorisationsRouter.post('/batches', requireRole('authoriser', 'director', 'psc'), async (req: AuthedRequest, res, next) => {
  try {
    const body = createBatchSchema.parse(req.body);
    const tid = req.user!.tenantId;
    const userId = req.user!.id;

    const result = await withTenant(tid, async (tx) => {
      const items = await tx.disbursement.findMany({
        where: {
          id: { in: body.disbursementIds },
          processStatus: 'Calculation-Verified',
          releaseBatchId: null,
        },
      });
      if (items.length !== body.disbursementIds.length) {
        throw new Error('Some disbursements are not Calculation-Verified or are already batched');
      }

      const projectId = items[0].projectId;
      const partId = items[0].partId;
      const totalAmount = items.reduce(
        (s, d) => s.add(new Prisma.Decimal(d.amountTotal)),
        new Prisma.Decimal(0),
      );

      const batchCode = `B-${new Date().toISOString().slice(0, 10)}-${String(Date.now()).slice(-4)}`;

      const batch = await tx.releaseBatch.create({
        data: {
          tenantId: tid,
          projectId,
          partId,
          batchCode,
          totalAmount,
          growerCount: items.length,
          status: 'pending_auth',
          createdBy: userId,
        },
      });

      await tx.disbursement.updateMany({
        where: { id: { in: body.disbursementIds } },
        data: { releaseBatchId: batch.id },
      });

      await tx.auditLog.create({
        data: {
          tenantId: tid, userId,
          action: 'authoriser.batch.create',
          entityType: 'release_batch', entityId: batch.id,
          metadata: { batchCode, count: items.length, total: totalAmount.toString() } as never,
        },
      });

      return batch;
    });

    res.json({ ok: true, batch: result });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── List + detail
authorisationsRouter.get('/batches', requireRole('authoriser', 'director', 'psc', 'bookkeeper'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const batches = await withTenant(tid, (tx) =>
      tx.releaseBatch.findMany({
        where: status ? { status } : {},
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { disbursements: true, paymentRecords: true } },
          releaseSignoff: { select: { signedFullName: true, signedAt: true, decision: true } },
        },
      }),
    );
    res.json({ batches });
  } catch (e) { next(e); }
});

authorisationsRouter.get('/batches/:id', requireRole('authoriser', 'director', 'psc', 'bookkeeper'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const batch = await withTenant(tid, (tx) =>
      tx.releaseBatch.findFirst({
        where: { id: req.params.id },
        include: {
          disbursements: {
            include: {
              grower: { select: { fullName: true, externalRef: true, district: true } },
            },
            orderBy: { grower: { externalRef: 'asc' } },
          },
          releaseSignoff: true,
        },
      }),
    );
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json({ batch });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── 2FA challenge
authorisationsRouter.post('/twofa/start', requireRole('authoriser'), async (req: AuthedRequest, res) => {
  const ch = challenge({
    userId: req.user!.id,
    userLabel: req.user!.email ?? req.user!.id,
    purpose: 'Sunshines release authorisation sign-off',
  });
  res.json({
    challengeId: ch.challengeId,
    expiresAt: ch.expiresAt,
    method: ch.method,
    devNote: ch.devCode ? '2FA code printed to API console (MOCK_MODE)' : undefined,
  });
});

// ───────────────────────────────────────────── Authorise batch
const authoriseSchema = z.object({
  code: z.string().regex(/^\d{6}$/),
  signedFullName: z.string().min(3),
  governanceAttestation: z.literal(true),
});

authorisationsRouter.post('/batches/:id/authorise', requireRole('authoriser'), async (req: AuthedRequest, res, next) => {
  try {
    const body = authoriseSchema.parse(req.body);
    const tid = req.user!.tenantId;
    const userId = req.user!.id;
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null;

    const twofa = verify2FA(userId, body.code);
    if (!twofa.ok) return res.status(401).json({ error: 'Invalid or expired 2FA code', reason: twofa.reason });

    const result = await withTenant(tid, async (tx) => {
      const batch = await tx.releaseBatch.findFirstOrThrow({ where: { id: req.params.id } });
      if (batch.status !== 'pending_auth') {
        throw new Error(`Cannot authorise — batch status is ${batch.status}`);
      }

      // Segregation check: authoriser cannot also be the verifier on any line in the batch
      const overlap = await tx.verificationSignoff.findFirst({
        where: { disbursementId: { in: (await tx.disbursement.findMany({ where: { releaseBatchId: batch.id }, select: { id: true } })).map((d) => d.id) }, verifierUserId: userId },
      });
      if (overlap) {
        throw new Error('Segregation of duties violation: you verified one of these disbursements and cannot also authorise');
      }

      const signoff = await tx.releaseSignoff.create({
        data: {
          tenantId: tid,
          releaseBatchId: batch.id,
          authoriserUserId: userId,
          decision: 'authorised',
          signedFullName: body.signedFullName,
          signedIp: ip,
          twofaMethod: twofa.method,
          twofaEvidenceHash: twofa.evidenceHash,
          governanceAttestation: body.governanceAttestation,
        },
      });

      await tx.releaseBatch.update({
        where: { id: batch.id },
        data: { status: 'authorised' },
      });

      // Advance all line-item disbursements
      await tx.disbursement.updateMany({
        where: { releaseBatchId: batch.id, processStatus: 'Calculation-Verified' },
        data: { processStatus: 'Release-Authorised', processStatusAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          tenantId: tid, userId,
          action: 'authoriser.authorise',
          entityType: 'release_batch', entityId: batch.id,
          ipAddress: ip,
          metadata: { signedFullName: body.signedFullName, batchCode: batch.batchCode } as never,
        },
      });

      return { batch, signoff };
    });

    res.json({ ok: true, ...result });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── Hold batch
const holdSchema = z.object({
  code: z.string().regex(/^\d{6}$/),
  signedFullName: z.string().min(3),
  reason: z.string().min(5),
});

authorisationsRouter.post('/batches/:id/hold', requireRole('authoriser'), async (req: AuthedRequest, res, next) => {
  try {
    const body = holdSchema.parse(req.body);
    const tid = req.user!.tenantId;
    const userId = req.user!.id;
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null;

    const twofa = verify2FA(userId, body.code);
    if (!twofa.ok) return res.status(401).json({ error: 'Invalid or expired 2FA code', reason: twofa.reason });

    const result = await withTenant(tid, async (tx) => {
      const batch = await tx.releaseBatch.findFirstOrThrow({ where: { id: req.params.id } });
      if (batch.status !== 'pending_auth') {
        throw new Error(`Cannot hold — batch status is ${batch.status}`);
      }

      const signoff = await tx.releaseSignoff.create({
        data: {
          tenantId: tid,
          releaseBatchId: batch.id,
          authoriserUserId: userId,
          decision: 'held',
          signedFullName: body.signedFullName,
          signedIp: ip,
          twofaMethod: twofa.method,
          twofaEvidenceHash: twofa.evidenceHash,
          holdReason: body.reason,
        },
      });

      await tx.releaseBatch.update({ where: { id: batch.id }, data: { status: 'on_hold' } });

      await tx.disbursement.updateMany({
        where: { releaseBatchId: batch.id, processStatus: 'Calculation-Verified' },
        data: { processStatus: 'On Hold', processStatusAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          tenantId: tid, userId,
          action: 'authoriser.hold',
          entityType: 'release_batch', entityId: batch.id,
          ipAddress: ip,
          metadata: { reason: body.reason } as never,
        },
      });

      return { batch, signoff };
    });

    res.json({ ok: true, ...result });
  } catch (e) { next(e); }
});
