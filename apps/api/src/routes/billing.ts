import { Router } from 'express';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { createPortalSession, createUsageInvoice } from '../services/stripe.js';

export const billingRouter = Router();
billingRouter.use(requireAuth);

billingRouter.get('/summary', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const data = await withTenant(tid, async (tx) => {
      const [tenant, sub, lastInvoice, activeUsers, monthReports] = await Promise.all([
        tx.tenant.findUniqueOrThrow({ where: { id: tid } }),
        tx.subscription.findFirst({ where: { tenantId: tid }, orderBy: { createdAt: 'desc' } }),
        tx.invoice.findFirst({ where: { tenantId: tid }, orderBy: { createdAt: 'desc' } }),
        tx.user.count({ where: { tenantId: tid, status: 'active' } }),
        tx.report.count({
          where: {
            tenantId: tid,
            createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        }),
      ]);
      const userFee = Number(sub?.userFeePerMonth ?? 1500);
      const reportFee = Number(sub?.reportFee ?? 1000);
      const subtotal = activeUsers * userFee + monthReports * reportFee;
      const vat = subtotal * Number(sub?.vatRate ?? 0);
      return {
        tenant,
        subscription: sub,
        lastInvoice,
        activeUsers,
        monthReports,
        userFee,
        reportFee,
        estimatedSubtotal: subtotal,
        estimatedVat: vat,
        estimatedTotal: subtotal + vat,
      };
    });
    res.json(data);
  } catch (e) { next(e); }
});

billingRouter.get('/invoices', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const list = await withTenant(req.user!.tenantId, (tx) =>
      tx.invoice.findMany({ where: { tenantId: req.user!.tenantId }, orderBy: { createdAt: 'desc' } }),
    );
    res.json({ invoices: list });
  } catch (e) { next(e); }
});

billingRouter.post('/invoice', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const out = await withTenant(tid, async (tx) => {
      const tenant = await tx.tenant.findUniqueOrThrow({ where: { id: tid } });
      const sub = await tx.subscription.findFirstOrThrow({ where: { tenantId: tid } });
      const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const periodEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const activeUsers = await tx.user.count({ where: { tenantId: tid, status: 'active' } });
      const reports = await tx.report.count({
        where: { tenantId: tid, createdAt: { gte: periodStart, lte: periodEnd } },
      });
      const subtotal = activeUsers * Number(sub.userFeePerMonth) + reports * Number(sub.reportFee);
      const vat = subtotal * Number(sub.vatRate);

      const inv = await tx.invoice.create({
        data: {
          tenantId: tid,
          periodStart,
          periodEnd,
          activeUsers,
          reportsCount: reports,
          subtotal,
          vatAmount: vat,
          totalAmount: subtotal + vat,
        },
      });

      if (tenant.stripeCustomerId) {
        const stripeInv = await createUsageInvoice({
          customerId: tenant.stripeCustomerId,
          description: `3Wi PMO Suite - ${activeUsers} users + ${reports} reports`,
          amountCents: Math.round((subtotal + vat) * 100),
        });
        await tx.invoice.update({ where: { id: inv.id }, data: { stripeInvoiceId: stripeInv.id } });
      }
      return inv;
    });
    res.json({ invoice: out });
  } catch (e) { next(e); }
});

billingRouter.post('/portal', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const tenant = await withTenant(tid, (tx) => tx.tenant.findUniqueOrThrow({ where: { id: tid } }));
    if (!tenant.stripeCustomerId) return res.status(400).json({ error: 'No Stripe customer linked' });
    const session = await createPortalSession({
      customerId: tenant.stripeCustomerId,
      returnUrl: req.body?.returnUrl ?? 'https://app.3wipmo.co.za/billing',
    });
    res.json({ url: session.url });
  } catch (e) { next(e); }
});
