/**
 * customers.ts — group-wide customer ledger (external + intercompany)
 * Mounted at /customers in server.ts.
 *
 * Routes:
 *   GET    /customers                 - list (filters: type, status, q, unit)
 *   GET    /customers/:id             - one customer + recent invoices
 *   POST   /customers                 - create
 *   PATCH  /customers/:id             - update
 *   DELETE /customers/:id             - hard delete
 *   GET    /customers/_summary/balances - per-customer total owing (view)
 */
import { Router } from 'express';
import { z } from 'zod';
import { withTenant, prisma } from '../lib/prisma.js';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';

export const customersRouter = Router();
customersRouter.use(requireAuth);

// ───────────────────────────────────────────── LIST
customersRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const { type, status, q, unit } = req.query as Record<string, string | undefined>;
    const where: any = { tenantId: tid };
    if (type)   where.customerType = type;
    if (status) where.status = status;
    if (unit)   where.internalUnitSlug = unit;
    if (q) {
      where.OR = [
        { displayName:  { contains: q, mode: 'insensitive' } },
        { companyName:  { contains: q, mode: 'insensitive' } },
        { primaryEmail: { contains: q, mode: 'insensitive' } },
        { vatNumber:    { contains: q, mode: 'insensitive' } },
      ];
    }
    const rows = await withTenant(tid, (tx) =>
      tx.customer.findMany({ where, orderBy: { displayName: 'asc' } }),
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── GET ONE
customersRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const c = await withTenant(tid, (tx) =>
      tx.customer.findFirst({
        where: { id: req.params.id, tenantId: tid },
        include: {
          invoices: {
            orderBy: { issueDate: 'desc' },
            take: 50,
            include: { payments: true },
          },
        },
      }),
    );
    if (!c) return res.status(404).json({ error: 'not_found' });
    res.json(c);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── CREATE
const CustomerSchema = z.object({
  customerType:     z.enum(['external', 'internal_unit']).default('external'),
  internalUnitSlug: z.string().optional(),
  displayName:      z.string().min(1),
  companyName:      z.string().optional(),
  givenName:        z.string().optional(),
  familyName:       z.string().optional(),
  title:            z.string().optional(),
  primaryEmail:     z.string().email(),
  primaryPhone:     z.string().optional(),
  mobile:           z.string().optional(),
  website:          z.string().optional(),
  billLine1:        z.string().optional(),
  billLine2:        z.string().optional(),
  billCity:         z.string().optional(),
  billProvince:     z.string().optional(),
  billPostal:       z.string().optional(),
  billCountry:      z.string().optional(),
  shipLine1:        z.string().optional(),
  shipLine2:        z.string().optional(),
  shipCity:         z.string().optional(),
  shipProvince:     z.string().optional(),
  shipPostal:       z.string().optional(),
  shipCountry:      z.string().optional(),
  taxable:          z.boolean().optional(),
  vatNumber:        z.string().optional(),
  companyRegNumber: z.string().optional(),
  bbbeeLevel:       z.string().optional(),
  currency:         z.string().optional(),
  paymentTerms:     z.string().optional(),
  status:           z.enum(['active', 'pipeline', 'paused', 'churned']).optional(),
  industry:         z.string().optional(),
  accountManager:   z.string().optional(),
  notes:            z.string().optional(),
});

customersRouter.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const parsed = CustomerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
    const created = await withTenant(tid, (tx) =>
      tx.customer.create({
        data: { ...parsed.data, tenantId: tid, createdByUserId: req.user!.id },
      }),
    );
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── UPDATE
customersRouter.patch('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const parsed = CustomerSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
    const updated = await withTenant(tid, async (tx) => {
      const exists = await tx.customer.findFirst({ where: { id: req.params.id, tenantId: tid } });
      if (!exists) return null;
      return tx.customer.update({
        where: { id: req.params.id },
        data: { ...parsed.data, updatedAt: new Date() },
      });
    });
    if (!updated) return res.status(404).json({ error: 'not_found' });
    res.json(updated);
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── DELETE
customersRouter.delete('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    await withTenant(tid, (tx) =>
      tx.customer.deleteMany({ where: { id: req.params.id, tenantId: tid } }),
    );
    res.status(204).send();
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── BALANCES VIEW
customersRouter.get('/_summary/balances', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM ar_customer_balances WHERE tenant_id = $1::uuid ORDER BY total_owing_zar DESC`, tid,
    );
    res.json(rows);
  } catch (e) { next(e); }
});
