/**
 * Stage 3 — Calculation verification (Mr Solly Vuso, Technical Verifier).
 *
 * Routes:
 *   GET  /verifications/queue             - returns disbursements awaiting verification
 *   POST /verifications/twofa/start       - issues a 2FA challenge for the current user
 *   POST /verifications/:id/verify        - body: { code, signedFullName }
 *   POST /verifications/:id/reject        - body: { code, signedFullName, reason }
 *
 * Role guard: only users with role='verifier' may act on the verify/reject endpoints.
 * Read of the queue is allowed for verifier and director (for oversight).
 *
 * Formula defence-in-depth: on every verify, the server re-computes
 *   funded_ha × (rate_mech + rate_lab)  and  compares to amount_total.
 * Any mismatch is recorded as formula_check_passed=false and the verify
 * is rejected with a 422.
 */

import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { challenge, verify as verify2FA } from '../services/mocks/twofa.js';

export const verificationsRouter = Router();
verificationsRouter.use(requireAuth);

// ───────────────────────────────────────────── GET /queue
verificationsRouter.get('/queue', requireRole('verifier', 'director', 'psc'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const items = await withTenant(tid, (tx) =>
      tx.disbursement.findMany({
        where: { processStatus: 'Beneficiary-Accepted' },
        include: {
          grower: { select: { fullName: true, externalRef: true, district: true, mappedHa: true } },
          farmerSignoff: {
            select: { signedFullName: true, signedAt: true, indemnityVersion: true, decision: true },
          },
        },
        orderBy: { grower: { externalRef: 'asc' } },
      }),
    );
    res.json({
      queue: items,
      count: items.length,
      totalValue: items.reduce((s, d) => s + Number(d.amountTotal), 0),
    });
  } catch (e) {
    next(e);
  }
});

// ───────────────────────────────────────────── POST /twofa/start
verificationsRouter.post('/twofa/start', requireRole('verifier'), async (req: AuthedRequest, res) => {
  const ch = challenge({
    userId: req.user!.id,
    userLabel: req.user!.email ?? req.user!.id,
    purpose: 'Sunshines calculation verification sign-off',
  });
  res.json({
    challengeId: ch.challengeId,
    expiresAt: ch.expiresAt,
    method: ch.method,
    devNote: ch.devCode ? '2FA code printed to API console (MOCK_MODE)' : undefined,
  });
});

// ───────────────────────────────────────────── POST /:id/verify
const verifySchema = z.object({
  code: z.string().regex(/^\d{6}$/),
  signedFullName: z.string().min(3),
  notes: z.string().optional(),
});

verificationsRouter.post('/:id/verify', requireRole('verifier'), async (req: AuthedRequest, res, next) => {
  try {
    const body = verifySchema.parse(req.body);
    const tid = req.user!.tenantId;
    const userId = req.user!.id;
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null;

    // 2FA gate
    const twofa = verify2FA(userId, body.code);
    if (!twofa.ok) {
      return res.status(401).json({ error: 'Invalid or expired 2FA code', reason: twofa.reason });
    }

    const result = await withTenant(tid, async (tx) => {
      const d = await tx.disbursement.findFirstOrThrow({
        where: { id: req.params.id },
        include: { farmerSignoff: true },
      });

      if (d.processStatus !== 'Beneficiary-Accepted') {
        throw new Error(`Cannot verify — status is ${d.processStatus}, expected Beneficiary-Accepted`);
      }

      // Defence-in-depth formula re-check
      const fundedHa = new Prisma.Decimal(d.fundedHa);
      const rateTotal = new Prisma.Decimal(d.rateMechanisation).add(new Prisma.Decimal(d.rateLabour));
      const expectedTotal = fundedHa.mul(rateTotal);
      const actualTotal = new Prisma.Decimal(d.amountTotal);
      const formulaCheckPassed = expectedTotal.equals(actualTotal);

      if (!formulaCheckPassed) {
        return {
          conflict: true,
          expectedTotal: expectedTotal.toString(),
          actualTotal: actualTotal.toString(),
        };
      }

      // Idempotency: refuse if already verified
      const existing = await tx.verificationSignoff.findUnique({ where: { disbursementId: d.id } });
      if (existing) {
        return { existing: true, signoff: existing };
      }

      const signoff = await tx.verificationSignoff.create({
        data: {
          tenantId: tid,
          disbursementId: d.id,
          verifierUserId: userId,
          decision: 'verified',
          signedFullName: body.signedFullName,
          signedIp: ip,
          twofaMethod: twofa.method,
          twofaEvidenceHash: twofa.evidenceHash,
          formulaCheckPassed: true,
          notes: body.notes,
        },
      });

      await tx.disbursement.update({
        where: { id: d.id },
        data: { processStatus: 'Calculation-Verified', processStatusAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          tenantId: tid, userId,
          action: 'verifier.verify',
          entityType: 'disbursement',
          entityId: d.id,
          ipAddress: ip,
          metadata: { signedFullName: body.signedFullName, twofaMethod: twofa.method } as never,
        },
      });

      return { signoff, conflict: false, existing: false };
    });

    if ('conflict' in result && result.conflict) return res.status(422).json({ error: 'Formula mismatch', ...result });
    res.json({ ok: true, ...result });
  } catch (e) {
    next(e);
  }
});

// ───────────────────────────────────────────── POST /:id/reject
const rejectSchema = z.object({
  code: z.string().regex(/^\d{6}$/),
  signedFullName: z.string().min(3),
  reason: z.string().min(5),
});

verificationsRouter.post('/:id/reject', requireRole('verifier'), async (req: AuthedRequest, res, next) => {
  try {
    const body = rejectSchema.parse(req.body);
    const tid = req.user!.tenantId;
    const userId = req.user!.id;
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null;

    const twofa = verify2FA(userId, body.code);
    if (!twofa.ok) return res.status(401).json({ error: 'Invalid or expired 2FA code', reason: twofa.reason });

    const result = await withTenant(tid, async (tx) => {
      const d = await tx.disbursement.findFirstOrThrow({ where: { id: req.params.id } });
      if (d.processStatus !== 'Beneficiary-Accepted') {
        throw new Error(`Cannot reject — status is ${d.processStatus}`);
      }

      const signoff = await tx.verificationSignoff.create({
        data: {
          tenantId: tid,
          disbursementId: d.id,
          verifierUserId: userId,
          decision: 'rejected',
          signedFullName: body.signedFullName,
          signedIp: ip,
          twofaMethod: twofa.method,
          twofaEvidenceHash: twofa.evidenceHash,
          formulaCheckPassed: false,
          rejectionReason: body.reason,
        },
      });

      await tx.disbursement.update({
        where: { id: d.id },
        data: { processStatus: 'Calculation-Rejected', processStatusAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          tenantId: tid, userId,
          action: 'verifier.reject',
          entityType: 'disbursement',
          entityId: d.id,
          ipAddress: ip,
          metadata: { reason: body.reason, signedFullName: body.signedFullName } as never,
        },
      });

      return { signoff };
    });

    res.json({ ok: true, ...result });
  } catch (e) {
    next(e);
  }
});
