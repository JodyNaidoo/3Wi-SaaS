import Stripe from 'stripe';
import { isMock } from './mocks/mode.js';
import {
  fakeCheckoutUrl,
  fakeCustomer,
  fakeInvoice,
  fakeInvoiceList,
  fakePortalUrl,
  fakeSubscription,
} from './mocks/stripe-fixtures.js';

let mockBannerLogged = false;
function logMockBannerOnce() {
  if (mockBannerLogged) return;
  mockBannerLogged = true;
  // eslint-disable-next-line no-console
  console.warn('[3Wi MOCK] Stripe is mocked - no real API calls; webhooks accept any signature.');
}

/**
 * Real Stripe SDK instance. In mock mode this is still constructed (with a
 * dummy key) so legacy direct accesses don't throw, but every wrapper function
 * below short-circuits before it touches the network.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_mock', {
  apiVersion: '2024-09-30.acacia',
});

export const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER ?? 'price_mock_starter',
  professional: process.env.STRIPE_PRICE_PRO ?? 'price_mock_professional',
};

export async function createCustomer(opts: { email: string; name: string; tenantId: string }): Promise<Stripe.Customer> {
  if (isMock('stripe')) {
    logMockBannerOnce();
    return fakeCustomer(opts);
  }
  return stripe.customers.create({
    email: opts.email,
    name: opts.name,
    metadata: { tenantId: opts.tenantId },
  });
}

export async function createSubscription(opts: {
  customerId: string;
  tier: 'starter' | 'professional';
}): Promise<Stripe.Subscription> {
  if (isMock('stripe')) {
    logMockBannerOnce();
    return fakeSubscription(opts);
  }
  return stripe.subscriptions.create({
    customer: opts.customerId,
    items: [{ price: PRICE_IDS[opts.tier] }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function createUsageInvoice(opts: {
  customerId: string;
  description: string;
  amountCents: number;
  currency?: string;
}): Promise<Stripe.Invoice> {
  if (isMock('stripe')) {
    logMockBannerOnce();
    return fakeInvoice(opts);
  }
  const item = await stripe.invoiceItems.create({
    customer: opts.customerId,
    amount: opts.amountCents,
    currency: opts.currency ?? 'zar',
    description: opts.description,
  });
  const invoice = await stripe.invoices.create({
    customer: opts.customerId,
    auto_advance: true,
  });
  void item;
  return invoice;
}

/** Checkout session URL for a tier. Real Stripe returns a hosted URL; mock returns a local route. */
export async function createCheckoutSession(opts: {
  customerId: string;
  tier: 'starter' | 'professional';
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string; id: string }> {
  if (isMock('stripe')) {
    logMockBannerOnce();
    return { id: `cs_mock_${Date.now()}`, url: fakeCheckoutUrl(opts.tier) };
  }
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: opts.customerId,
    line_items: [{ price: PRICE_IDS[opts.tier], quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
  });
  return { id: session.id, url: session.url ?? opts.successUrl };
}

/** Billing portal session. */
export async function createPortalSession(opts: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  if (isMock('stripe')) {
    logMockBannerOnce();
    return { url: fakePortalUrl(opts.returnUrl) };
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: opts.customerId,
    return_url: opts.returnUrl,
  });
  return { url: session.url };
}

/** List invoices for a customer. */
export async function listInvoices(customerId: string): Promise<Stripe.Invoice[]> {
  if (isMock('stripe')) {
    logMockBannerOnce();
    return fakeInvoiceList();
  }
  const list = await stripe.invoices.list({ customer: customerId, limit: 24 });
  return list.data;
}

/**
 * Verify a webhook payload. In mock mode any incoming POST is accepted as a
 * valid event - useful for local CLI replay without configuring signatures.
 */
export function constructWebhookEvent(rawBody: Buffer | string, signature: string | undefined): Stripe.Event {
  if (isMock('stripe')) {
    logMockBannerOnce();
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    let parsed: unknown;
    try {
      parsed = JSON.parse(bodyStr);
    } catch {
      parsed = { type: 'mock.unknown', data: { object: {} } };
    }
    return parsed as Stripe.Event;
  }
  return stripe.webhooks.constructEvent(
    rawBody,
    signature ?? '',
    process.env.STRIPE_WEBHOOK_SECRET ?? '',
  );
}
