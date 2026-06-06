/**
 * invoices.ts — group-wide invoice ledger (every 3Wi unit posts here)
 * Mounted at /invoices in server.ts.
 *
 * Routes:
 *   GET    /invoices                       - list (filters: status, unit, customer_id, intercompany)
 *   GET    /invoices/:id                   - one invoice + line items + payments
 *   POST   /invoices                       - create (auto invoice-number if not supplied)
 *   PATCH  /invoices/:id                   - update status / dates / notes
 *   DELETE /invoices/:id                   - hard delete
 *   POST   /invoices/:id/payments          - record a payment (recomputes status)
 *   GET    /invoices/_summary/totals       - KPI strip
 *   GET    /invoices/_summary/ageing       - ageing buckets (view)
 */
import { Router } from 'express';
import { z } from 'zod';
import { withTenant, prisma } from '../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';

export const invoicesRouter = Router();
invoicesRouter.use(requireAuth);

// ───────────────────────────────────────────── LIST
invoicesRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const { status, unit, customer_id, intercompany } = req.query as Record<string, string | undefined>;
    const where: any = { tenantId: tid };
    if (status)       where.status = status;
    if (unit)         where.providerUnitSlug = unit;
    if (customer_id)  where.customerId = customer_id;
    if (intercompany) where.isIntercompany = intercompany === 'true';

    const rows = await withTenant(tid, (tx) =>
      tx.arInvoice.findMany({
        where,
        orderBy: { issueDate: 'desc' },
        include: { customer: { select: { id: true, displayName: true, customerType: true } } },
        take: 250,
      }),
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── GET ONE
invoicesRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const inv = await withTenant(tid, (tx) =>
      tx.arInvoice.findFirst({
        where: { id: req.params.id, tenantId: tid },
        include: {
          customer: true,
          lineItems: { orderBy: { sortOrder: 'asc' } },
          payments: { orderBy: { paymentDate: 'desc' } },
        },
      }),
    );
    if (!inv) return res.status(404).json({ error: 'not_found' });
    res.json(inv);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── CREATE
const LineSchema = z.object({
  serviceCode:  z.string().optional(),
  description:  z.string().min(1),
  quantity:     z.number().default(1),
  unit:         z.string().optional(),
  unitPriceZar: z.number(),
  vatRatePct:   z.number().default(15),
  sortOrder:    z.number().optional(),
});

const CreateInvoiceSchema = z.object({
  invoiceNumber:    z.string().optional(),
  providerUnitSlug: z.string().min(1),
  customerId:       z.string().uuid(),
  isIntercompany:   z.boolean().optional(),
  issueDate:        z.string().optional(),
  dueDate:          z.string(),
  currency:         z.string().optional(),
  notes:            z.string().optional(),
  internalNotes:    z.string().optional(),
  engagementId:     z.string().uuid().optional(),
  lineItems:        z.array(LineSchema).default([]),
});

function nextInvoiceNumber(unitSlug: string, year: number, seq: number) {
  const code = unitSlug.toUpperCase().split('-').map(p => p.slice(0, 3)).join('');
  return `${code}-${year}-${String(seq).padStart(4, '0')}`;
}

invoicesRouter.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const parsed = CreateInvoiceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
    const d = parsed.data;

    const created = await withTenant(tid, async (tx) => {
      let invoiceNumber = d.invoiceNumber;
      if (!invoiceNumber) {
        const year = new Date().getFullYear();
        const count = await tx.arInvoice.count({
          where: {
            tenantId: tid,
            providerUnitSlug: d.providerUnitSlug,
            issueDate: { gte: new Date(`${year}-01-01`) },
          },
        });
        invoiceNumber = nextInvoiceNumber(d.providerUnitSlug, year, count + 1);
      }

      let subtotal = 0;
      let vatAmount = 0;
      for (const li of d.lineItems) {
        const line = li.quantity * li.unitPriceZar;
        subtotal += line;
        vatAmount += line * (li.vatRatePct / 100);
      }
      const total = subtotal + vatAmount;

      return tx.arInvoice.create({
        data: {
          tenantId: tid,
          invoiceNumber,
          providerUnitSlug: d.providerUnitSlug,
          customerId: d.customerId,
          isIntercompany: d.isIntercompany ?? false,
          issueDate: d.issueDate ? new Date(d.issueDate) : new Date(),
          dueDate: new Date(d.dueDate),
          currency: d.currency ?? 'ZAR',
          subtotalZar: subtotal.toFixed(2) as any,
          vatAmountZar: vatAmount.toFixed(2) as any,
          totalZar: total.toFixed(2) as any,
          amountPaidZar: '0' as any,
          notes: d.notes,
          internalNotes: d.internalNotes,
          engagementId: d.engagementId,
          createdByUserId: req.user!.id,
          lineItems: { create: d.lineItems.map((li, i) => ({ ...li, sortOrder: li.sortOrder ?? i })) },
        },
        include: { lineItems: true, customer: true },
      });
    });

    res.status(201).json(created);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── UPDATE
const UpdateInvoiceSchema = z.object({
  status:         z.enum(['draft','sent','viewed','partial','paid','overdue','void']).optional(),
  dueDate:        z.string().optional(),
  notes:          z.string().optional(),
  internalNotes:  z.string().optional(),
  sentAt:         z.string().optional(),
});

invoicesRouter.patch('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const parsed = UpdateInvoiceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
    const data: any = { ...parsed.data, updatedAt: new Date() };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    if (data.sentAt)  data.sentAt  = new Date(data.sentAt);
    const updated = await withTenant(tid, async (tx) => {
      const exists = await tx.arInvoice.findFirst({ where: { id: req.params.id, tenantId: tid } });
      if (!exists) return null;
      return tx.arInvoice.update({ where: { id: req.params.id }, data });
    });
    if (!updated) return res.status(404).json({ error: 'not_found' });
    res.json(updated);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── DELETE
invoicesRouter.delete('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    await withTenant(tid, (tx) =>
      tx.arInvoice.deleteMany({ where: { id: req.params.id, tenantId: tid } }),
    );
    res.status(204).send();
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── PAYMENTS (sub-resource)
const PaymentSchema = z.object({
  paymentDate: z.string().optional(),
  amountZar:   z.number().positive(),
  method:      z.enum(['bank_transfer','cash','mobile','card','cheque','intercompany_netting','other']).default('bank_transfer'),
  reference:   z.string().optional(),
  notes:       z.string().optional(),
});

invoicesRouter.post('/:id/payments', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const parsed = PaymentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });

    const result = await withTenant(tid, async (tx) => {
      const inv = await tx.arInvoice.findFirst({ where: { id: req.params.id, tenantId: tid } });
      if (!inv) return { error: 'not_found' as const };

      const payment = await tx.arPayment.create({
        data: {
          tenantId: tid,
          invoiceId: inv.id,
          paymentDate: parsed.data.paymentDate ? new Date(parsed.data.paymentDate) : new Date(),
          amountZar: parsed.data.amountZar.toFixed(2) as any,
          method: parsed.data.method,
          reference: parsed.data.reference,
          notes: parsed.data.notes,
          createdByUserId: req.user!.id,
        },
      });

      const sum = await tx.arPayment.aggregate({
        where: { invoiceId: inv.id }, _sum: { amountZar: true },
      });
      const paid = Number(sum._sum.amountZar ?? 0);
      const total = Number(inv.totalZar);
      let status = inv.status;
      if (paid >= total) status = 'paid' as any;
      else if (paid > 0) status = 'partial' as any;
      await tx.arInvoice.update({
        where: { id: inv.id },
        data: {
          amountPaidZar: paid.toFixed(2) as any,
          status,
          paidAt: status === ('paid' as any) ? new Date() : null,
        },
      });
      return { payment };
    });

    if ('error' in result) return res.status(404).json(result);
    res.status(201).json(result.payment);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── AGEING (view)
invoicesRouter.get('/_summary/ageing', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM ar_invoice_ageing WHERE tenant_id = $1::uuid ORDER BY days_overdue DESC`, tid,
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── DASHBOARD TOTALS
invoicesRouter.get('/_summary/totals', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const result = await prisma.$queryRawUnsafe<any[]>(`
      SELECT
        COUNT(*) FILTER (WHERE status NOT IN ('paid','void'))                                       AS open_count,
        COALESCE(SUM(balance_due_zar) FILTER (WHERE status NOT IN ('paid','void')), 0)              AS open_balance_zar,
        COALESCE(SUM(balance_due_zar) FILTER (WHERE due_date < CURRENT_DATE
                                               AND status NOT IN ('paid','void')), 0)              AS overdue_zar,
        COALESCE(SUM(total_zar) FILTER (WHERE issue_date >= date_trunc('month', CURRENT_DATE)), 0)  AS billed_mtd_zar,
        COALESCE(SUM(total_zar) FILTER (WHERE is_intercompany = TRUE
                                         AND issue_date >= date_trunc('month', CURRENT_DATE)), 0)  AS intercompany_mtd_zar
      FROM ar_invoices
      WHERE tenant_id = $1::uuid
    `, tid);
    res.json(result[0] ?? {});
  } catch (e) { next(e); }
});
