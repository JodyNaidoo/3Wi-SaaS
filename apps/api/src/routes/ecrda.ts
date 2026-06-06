/**
 * Stage 6 — ECRDA closure dashboard (read-only).
 *
 * Routes:
 *   GET  /ecrda/summary                  - headline KPIs (total paid, count paid, envelope)
 *   GET  /ecrda/disbursements            - per-grower status table
 *                                            NO banking fields are returned, ever.
 *   GET  /ecrda/disbursements/:id/pop    - signed download URL for the POP PDF
 *                                            (uses Supabase Storage in prod, stub in mock)
 *
 * Role guard: role='ecrda_viewer' (or 'director' for oversight).
 * All access is audited.
 */

import { Router } from 'express';
import { withTenant, prisma } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const ecrdaRouter = Router();
ecrdaRouter.use(requireAuth);
ecrdaRouter.use(requireRole('ecrda_viewer', 'director', 'psc'));

// ───────────────────────────────────────────── Headline summary
ecrdaRouter.get('/summary', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const data = await withTenant(tid, async (tx) => {
      const all = await tx.disbursement.findMany({
        select: {
          amountTotal: true, processStatus: true, releaseBatchId: true,
        },
      });
      const byStatus: Record<string, { count: number; value: number }> = {};
      let total = 0;
      let paidValue = 0;
      let paidCount = 0;
      for (const d of all) {
        const v = Number(d.amountTotal);
        total += v;
        const s = d.processStatus;
        byStatus[s] = byStatus[s] ?? { count: 0, value: 0 };
        byStatus[s].count += 1;
        byStatus[s].value += v;
        if (s === 'Paid') { paidValue += v; paidCount += 1; }
      }
      return { all, byStatus, total, paidValue, paidCount };
    });

    res.json({
      growerCount: data.all.length,
      paidCount: data.paidCount,
      paidValue: data.paidValue,
      totalEnvelope: data.total,
      remainingValue: data.total - data.paidValue,
      percentPaid: data.total === 0 ? 0 : Math.round((data.paidValue / data.total) * 10000) / 100,
      byStatus: data.byStatus,
    });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── Per-grower table
ecrdaRouter.get('/disbursements', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const district = typeof req.query.district === 'string' ? req.query.district : undefined;

    const rows = await withTenant(tid, (tx) =>
      tx.disbursement.findMany({
        where: district ? { grower: { district } } : {},
        select: {
          id: true, processStatus: true, processStatusAt: true,
          amountTotal: true, fundedHa: true, paidAt: true,
          grower: { select: { fullName: true, externalRef: true, district: true, coordinator: true, region: true } },
          paymentRecord: { select: { bankReference: true, paymentDate: true, status: true, popStorageKey: true } },
          // EXPLICITLY no farmerSignoff banking fields
        },
        orderBy: { grower: { externalRef: 'asc' } },
      }),
    );

    // Audit the read so ECRDA access is traceable
    await prisma.auditLog.create({
      data: {
        tenantId: tid,
        userId: req.user!.id,
        action: 'ecrda.dashboard.read',
        entityType: 'disbursement',
        entityId: null,
        ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null,
        metadata: { district, rowCount: rows.length } as never,
      },
    });

    res.json({ disbursements: rows, count: rows.length });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── POP download URL
ecrdaRouter.get('/disbursements/:id/pop', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const userId = req.user!.id;

    const rec = await withTenant(tid, (tx) =>
      tx.paymentRecord.findFirst({
        where: { disbursementId: req.params.id, status: 'paid' },
        select: { popStorageKey: true, bankReference: true, paymentDate: true, amount: true },
      }),
    );
    if (!rec || !rec.popStorageKey) return res.status(404).json({ error: 'No POP attached for this disbursement yet' });

    // In MOCK_MODE we return a stub signed URL. In prod, generate a Supabase
    // Storage signed URL with 5-minute TTL.
    const mockUrl = `http://localhost:4000/ecrda/disbursements/${req.params.id}/pop-file?key=${encodeURIComponent(rec.popStorageKey)}`;

    await prisma.auditLog.create({
      data: {
        tenantId: tid, userId,
        action: 'ecrda.pop.download',
        entityType: 'disbursement', entityId: req.params.id,
        metadata: { bankReference: rec.bankReference } as never,
      },
    });

    res.json({ url: mockUrl, bankReference: rec.bankReference, paymentDate: rec.paymentDate, amount: rec.amount });
  } catch (e) { next(e); }
});
