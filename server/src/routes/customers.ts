/**
 * customers.ts — group-wide customer ledger
 * Mount at: app.use('/api/customers', requireAuth, customersRouter)
 */
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { withTenant } from '../tenant.js';

const r = Router();

// ---------------- LIST ----------------
r.get('/', async (req: any, res) => {
  const tid = req.user.tenantId;
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
  const rows = await withTenant(tid, () =>
    prisma.customer.findMany({ where, orderBy: { displayName: 'asc' } })
  );
  res.json(rows);
});

// ---------------- GET ONE ----------------
r.get('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  const c = await withTenant(tid, () =>
    prisma.customer.findFirst({
      where: { id: req.params.id, tenantId: tid },
      include: {
        invoices: {
          orderBy: { issueDate: 'desc' },
          take: 50,
          include: { payments: true },
        },
      },
    })
  );
  if (!c) return res.status(404).json({ error: 'not_found' });
  res.json(c);
});

// ---------------- CREATE ----------------
const CreateSchema = z.object({
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

r.post('/', async (req: any, res) => {
  const tid = req.user.tenantId;
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
  const created = await withTenant(tid, () =>
    prisma.customer.create({
      data: { ...parsed.data, tenantId: tid, createdByUserId: req.user.id },
    })
  );
  res.status(201).json(created);
});

// ---------------- UPDATE ----------------
r.patch('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  const parsed = CreateSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
  const updated = await withTenant(tid, async () => {
    const exists = await prisma.customer.findFirst({ where: { id: req.params.id, tenantId: tid } });
    if (!exists) return null;
    return prisma.customer.update({
      where: { id: req.params.id },
      data: { ...parsed.data, updatedAt: new Date() },
    });
  });
  if (!updated) return res.status(404).json({ error: 'not_found' });
  res.json(updated);
});

// ---------------- DELETE ----------------
r.delete('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  await withTenant(tid, () =>
    prisma.customer.deleteMany({ where: { id: req.params.id, tenantId: tid } })
  );
  res.status(204).send();
});

// ---------------- BALANCES (uses view via raw query) ----------------
r.get('/_summary/balances', async (req: any, res) => {
  const tid = req.user.tenantId;
  const rows = await withTenant(tid, () =>
    prisma.$queryRawUnsafe<any[]>(`SELECT * FROM customer_balances WHERE tenant_id = $1::uuid ORDER BY total_owing_zar DESC`, tid)
  );
  res.json(rows);
});

export default r;
