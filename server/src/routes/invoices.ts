/**
 * invoices.ts — group-wide invoice ledger + line items + payments + ageing
 * Mount at: app.use('/api/invoices', requireAuth, invoicesRouter)
 */
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { withTenant } from '../tenant.js';

const r = Router();

// ---------------- LIST INVOICES ----------------
r.get('/', async (req: any, res) => {
  const tid = req.user.tenantId;
  const { status, unit, customer_id, intercompany } = req.query as Record<string, string | undefined>;
  const where: any = { tenantId: tid };
  if (status)       where.status = status;
  if (unit)         where.providerUnitSlug = unit;
  if (customer_id)  where.customerId = customer_id;
  if (intercompany) where.isIntercompany = intercompany === 'true';

  const rows = await withTenant(tid, () =>
    prisma.invoice.findMany({
      where,
      orderBy: { issueDate: 'desc' },
      include: { customer: { select: { id: true, displayName: true, customerType: true } } },
      take: 250,
    })
  );
  res.json(rows);
});

// ---------------- GET ONE ----------------
r.get('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  const inv = await withTenant(tid, () =>
    prisma.invoice.findFirst({
      where: { id: req.params.id, tenantId: tid },
      include: {
        customer: true,
        lineItems: { orderBy: { sortOrder: 'asc' } },
        payments: { orderBy: { paymentDate: 'desc' } },
      },
    })
  );
  if (!inv) return res.status(404).json({ error: 'not_found' });
  res.json(inv);
});

// ---------------- CREATE ----------------
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
  invoiceNumber:    z.string().optional(), // auto if absent
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

r.post('/', async (req: any, res) => {
  const tid = req.user.tenantId;
  const parsed = CreateInvoiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
  const d = parsed.data;

  const created = await withTenant(tid, async () => {
    // generate invoice number if missing
    let invoiceNumber = d.invoiceNumber;
    if (!invoiceNumber) {
      const year = new Date().getFullYear();
      const count = await prisma.invoice.count({
        where: { tenantId: tid, providerUnitSlug: d.providerUnitSlug, issueDate: { gte: new Date(`${year}-01-01`) } },
      });
      invoiceNumber = nextInvoiceNumber(d.providerUnitSlug, year, count + 1);
    }

    // totals from line items
    let subtotal = 0;
    let vatAmount = 0;
    for (const li of d.lineItems) {
      const line = li.quantity * li.unitPriceZar;
      subtotal += line;
      vatAmount += line * (li.vatRatePct / 100);
    }
    const total = subtotal + vatAmount;

    return prisma.invoice.create({
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
        createdByUserId: req.user.id,
        lineItems: { create: d.lineItems.map((li, i) => ({ ...li, sortOrder: li.sortOrder ?? i })) },
      },
      include: { lineItems: true, customer: true },
    });
  });

  res.status(201).json(created);
});

// ---------------- UPDATE STATUS / META ----------------
const UpdateInvoiceSchema = z.object({
  status:         z.enum(['draft','sent','viewed','partial','paid','overdue','void']).optional(),
  dueDate:        z.string().optional(),
  notes:          z.string().optional(),
  internalNotes:  z.string().optional(),
  sentAt:         z.string().optional(),
});

r.patch('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  const parsed = UpdateInvoiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
  const data: any = { ...parsed.data, updatedAt: new Date() };
  if (data.dueDate) data.dueDate = new Date(data.dueDate);
  if (data.sentAt)  data.sentAt  = new Date(data.sentAt);
  const updated = await withTenant(tid, async () => {
    const exists = await prisma.invoice.findFirst({ where: { id: req.params.id, tenantId: tid } });
    if (!exists) return null;
    return prisma.invoice.update({ where: { id: req.params.id }, data });
  });
  if (!updated) return res.status(404).json({ error: 'not_found' });
  res.json(updated);
});

// ---------------- DELETE ----------------
r.delete('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  await withTenant(tid, () =>
    prisma.invoice.deleteMany({ where: { id: req.params.id, tenantId: tid } })
  );
  res.status(204).send();
});

// ---------------- PAYMENTS (sub-resource) ----------------
const PaymentSchema = z.object({
  paymentDate: z.string().optional(),
  amountZar:   z.number().positive(),
  method:      z.enum(['bank_transfer','cash','mobile','card','cheque','intercompany_netting','other']).default('bank_transfer'),
  reference:   z.string().optional(),
  notes:       z.string().optional(),
});

r.post('/:id/payments', async (req: any, res) => {
  const tid = req.user.tenantId;
  const parsed = PaymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
  const result = await withTenant(tid, async () => {
    const inv = await prisma.invoice.findFirst({ where: { id: req.params.id, tenantId: tid } });
    if (!inv) return { error: 'not_found' as const };
    const payment = await prisma.payment.create({
      data: {
        tenantId: tid,
        invoiceId: inv.id,
        paymentDate: parsed.data.paymentDate ? new Date(parsed.data.paymentDate) : new Date(),
        amountZar: parsed.data.amountZar.toFixed(2) as any,
        method: parsed.data.method,
        reference: parsed.data.reference,
        notes: parsed.data.notes,
        createdByUserId: req.user.id,
      },
    });
    // recompute paid + status
    const sum = await prisma.payment.aggregate({
      where: { invoiceId: inv.id }, _sum: { amountZar: true },
    });
    const paid = Number(sum._sum.amountZar ?? 0);
    const total = Number(inv.totalZar);
    let status = inv.status;
    if (paid >= total)         status = 'paid' as any;
    else if (paid > 0)         status = 'partial' as any;
    await prisma.invoice.update({
      where: { id: inv.id },
      data: { amountPaidZar: paid.toFixed(2) as any, status, paidAt: status === ('paid' as any) ? new Date() : null },
    });
    return { payment };
  });
  if ('error' in result) return res.status(404).json(result);
  res.status(201).json(result.payment);
});

// ---------------- AGEING (uses view) ----------------
r.get('/_summary/ageing', async (req: any, res) => {
  const tid = req.user.tenantId;
  const rows = await withTenant(tid, () =>
    prisma.$queryRawUnsafe<any[]>(`SELECT * FROM invoice_ageing WHERE tenant_id = $1::uuid ORDER BY days_overdue DESC`, tid)
  );
  res.json(rows);
});

// ---------------- DASHBOARD TOTALS ----------------
r.get('/_summary/totals', async (req: any, res) => {
  const tid = req.user.tenantId;
  const result = await withTenant(tid, () =>
    prisma.$queryRawUnsafe<any[]>(`
      SELECT
        COUNT(*) FILTER (WHERE status NOT IN ('paid','void'))                                       AS open_count,
        COALESCE(SUM(balance_due_zar) FILTER (WHERE status NOT IN ('paid','void')), 0)              AS open_balance_zar,
        COALESCE(SUM(balance_due_zar) FILTER (WHERE due_date < CURRENT_DATE
                                               AND status NOT IN ('paid','void')), 0)              AS overdue_zar,
        COALESCE(SUM(total_zar) FILTER (WHERE issue_date >= date_trunc('month', CURRENT_DATE)), 0)  AS billed_mtd_zar,
        COALESCE(SUM(total_zar) FILTER (WHERE is_intercompany = TRUE
                                         AND issue_date >= date_trunc('month', CURRENT_DATE)), 0)  AS intercompany_mtd_zar
      FROM invoices
      WHERE tenant_id = $1::uuid
    `, tid)
  );
  res.json(result[0] ?? {});
});

export default r;
