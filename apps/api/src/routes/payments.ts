/**
 * Stage 5 — Payment execution (Hempire-EC bookkeeper).
 *
 * Routes:
 *   GET  /payments/queue                    - lists Release-Authorised disbursements
 *   GET  /payments/batches/:id/export       - CSV in ABSA-style bulk-payment format
 *                                              (decrypts banking details — POPIA audited)
 *   POST /payments/:disbursementId/confirm  - body: { bankReference, paymentDate, popStorageKey }
 *                                              marks disbursement as Paid
 *   POST /payments/:disbursementId/fail     - body: { reason }
 *                                              marks as Payment Failed (returns to farmer for new banking)
 *
 * Role guard: only role='bookkeeper'.
 * Segregation: a bookkeeper cannot also act as verifier or authoriser (enforced
 * at sign-off creation in those routes).
 */

import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { decryptBanking, auditDecrypt, maskAccount } from '../services/banking-encrypt.js';

export const paymentsRouter = Router();
paymentsRouter.use(requireAuth);

// ───────────────────────────────────────────── Queue
paymentsRouter.get('/queue', requireRole('bookkeeper', 'director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const items = await withTenant(tid, (tx) =>
      tx.disbursement.findMany({
        where: { processStatus: 'Release-Authorised' },
        include: {
          grower: { select: { fullName: true, externalRef: true, district: true } },
          releaseBatch: { select: { id: true, batchCode: true } },
          farmerSignoff: { select: { bankingBank: true, bankingAccountType: true } },
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

// ───────────────────────────────────────────── CSV export
paymentsRouter.get('/batches/:id/export', requireRole('bookkeeper'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const userId = req.user!.id;
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null;

    const batch = await withTenant(tid, (tx) =>
      tx.releaseBatch.findFirst({
        where: { id: req.params.id, status: 'authorised' },
        include: {
          disbursements: {
            where: { processStatus: 'Release-Authorised' },
            include: {
              grower: { select: { fullName: true, externalRef: true } },
              farmerSignoff: true,
            },
            orderBy: { grower: { externalRef: 'asc' } },
          },
        },
      }),
    );
    if (!batch) return res.status(404).json({ error: 'Authorised batch not found' });
    if (batch.disbursements.length === 0) return res.status(404).json({ error: 'No payable lines in batch' });

    // ABSA-style bulk-pay CSV
    // Columns: SeqNo, BeneficiaryName, AccountHolder, BankName, AccountNumber, BranchCode, AccountType, Amount, OurReference, BeneficiaryReference
    const lines: string[] = [];
    lines.push('SeqNo,BeneficiaryName,AccountHolder,BankName,AccountNumber,BranchCode,AccountType,Amount,OurReference,BeneficiaryReference');

    for (let i = 0; i < batch.disbursements.length; i++) {
      const d = batch.disbursements[i];
      const fs = d.farmerSignoff;
      if (!fs) continue;

      const holder = decryptBanking(fs.bankingAccountHolderEnc);
      const acct = decryptBanking(fs.bankingAccountNumberEnc);
      const branch = decryptBanking(fs.bankingBranchCodeEnc);

      // POPIA: log every decrypt
      await auditDecrypt({
        tenantId: tid, userId, disbursementId: d.id, ipAddress: ip,
        reason: `bank-batch-export:${batch.batchCode}`,
      });

      const fields = [
        String(i + 1),
        csvEscape(d.grower.fullName),
        csvEscape(holder ?? ''),
        csvEscape(fs.bankingBank ?? ''),
        csvEscape(acct ?? ''),
        csvEscape(branch ?? ''),
        csvEscape((fs.bankingAccountType ?? '').toUpperCase()),
        Number(d.amountTotal).toFixed(2),
        csvEscape(`SUNSHINES-${d.grower.externalRef}`),
        csvEscape(`Sunshines Part1 disbursement #${d.grower.externalRef}`),
      ];
      lines.push(fields.join(','));
    }

    const filename = `bank_batch_${batch.batchCode}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(lines.join('\r\n') + '\r\n');
  } catch (e) { next(e); }
});

function csvEscape(s: string): string {
  if (s == null) return '';
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// ───────────────────────────────────────────── Confirm payment
const confirmSchema = z.object({
  bankReference: z.string().min(3),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  popStorageKey: z.string().optional(),
});

paymentsRouter.post('/:disbursementId/confirm', requireRole('bookkeeper'), async (req: AuthedRequest, res, next) => {
  try {
    const body = confirmSchema.parse(req.body);
    const tid = req.user!.tenantId;
    const userId = req.user!.id;
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null;

    const result = await withTenant(tid, async (tx) => {
      const d = await tx.disbursement.findFirstOrThrow({ where: { id: req.params.disbursementId } });
      if (d.processStatus !== 'Release-Authorised' && d.processStatus !== 'Payment Pending' && d.processStatus !== 'Payment Failed') {
        throw new Error(`Cannot confirm payment — status is ${d.processStatus}`);
      }

      const existing = await tx.paymentRecord.findUnique({ where: { disbursementId: d.id } });
      const record = existing
        ? await tx.paymentRecord.update({
            where: { id: existing.id },
            data: {
              bankReference: body.bankReference,
              paymentDate: new Date(body.paymentDate),
              popStorageKey: body.popStorageKey,
              status: 'paid',
              capturedBy: userId,
              capturedAt: new Date(),
            },
          })
        : await tx.paymentRecord.create({
            data: {
              tenantId: tid,
              disbursementId: d.id,
              releaseBatchId: d.releaseBatchId,
              amount: d.amountTotal,
              bankReference: body.bankReference,
              paymentDate: new Date(body.paymentDate),
              popStorageKey: body.popStorageKey,
              status: 'paid',
              capturedBy: userId,
              capturedAt: new Date(),
            },
          });

      await tx.disbursement.update({
        where: { id: d.id },
        data: { processStatus: 'Paid', processStatusAt: new Date(), paidAt: new Date(body.paymentDate) },
      });

      await tx.auditLog.create({
        data: {
          tenantId: tid, userId,
          action: 'bookkeeper.confirm',
          entityType: 'disbursement', entityId: d.id,
          ipAddress: ip,
          metadata: { bankReference: body.bankReference, paymentDate: body.paymentDate } as never,
        },
      });

      return record;
    });

    res.json({ ok: true, paymentRecord: result });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── Mark failed
const failSchema = z.object({
  reason: z.string().min(5),
});

paymentsRouter.post('/:disbursementId/fail', requireRole('bookkeeper'), async (req: AuthedRequest, res, next) => {
  try {
    const body = failSchema.parse(req.body);
    const tid = req.user!.tenantId;
    const userId = req.user!.id;
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null;

    const result = await withTenant(tid, async (tx) => {
      const d = await tx.disbursement.findFirstOrThrow({ where: { id: req.params.disbursementId } });
      const existing = await tx.paymentRecord.findUnique({ where: { disbursementId: d.id } });

      const record = existing
        ? await tx.paymentRecord.update({
            where: { id: existing.id },
            data: { status: 'failed', failedReason: body.reason, capturedBy: userId, capturedAt: new Date() },
          })
        : await tx.paymentRecord.create({
            data: {
              tenantId: tid,
              disbursementId: d.id,
              releaseBatchId: d.releaseBatchId,
              amount: d.amountTotal,
              status: 'failed',
              failedReason: body.reason,
              capturedBy: userId,
              capturedAt: new Date(),
            },
          });

      await tx.disbursement.update({
        where: { id: d.id },
        data: { processStatus: 'Payment Failed', processStatusAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          tenantId: tid, userId,
          action: 'bookkeeper.fail',
          entityType: 'disbursement', entityId: d.id,
          ipAddress: ip,
          metadata: { reason: body.reason } as never,
        },
      });

      return record;
    });

    res.json({ ok: true, paymentRecord: result });
  } catch (e) { next(e); }
});
