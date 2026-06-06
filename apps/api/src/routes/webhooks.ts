import { Router, raw } from 'express';
import Stripe from 'stripe';
import { constructWebhookEvent } from '../services/stripe.js';
import { prisma } from '../lib/prisma.js';

export const webhooksRouter = Router();

// Stripe wants the raw body; mount before json parser in server.ts
webhooksRouter.post('/stripe', raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(req.body, sig);
  } catch (err) {
    return res.status(400).send(`Webhook signature error: ${(err as Error).message}`);
  }

  switch (event.type) {
    case 'invoice.paid': {
      const inv = event.data.object as Stripe.Invoice;
      await prisma.invoice.updateMany({
        where: { stripeInvoiceId: inv.id },
        data: { status: 'paid', paidAt: new Date() },
      });
      break;
    }
    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice;
      await prisma.invoice.updateMany({
        where: { stripeInvoiceId: inv.id },
        data: { status: 'overdue' },
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: 'cancelled' },
      });
      break;
    }
    default:
      // ignore others
      break;
  }

  res.json({ received: true });
});
