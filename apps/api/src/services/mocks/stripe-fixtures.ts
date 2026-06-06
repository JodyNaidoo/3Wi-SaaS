/**
 * Fake Stripe-shaped objects for MOCK_MODE. These intentionally use the
 * `Stripe.<Type>` interfaces from the SDK so consumers see identical types.
 *
 * Only fields the app actually reads are populated; the rest are filled with
 * reasonable defaults via `as unknown as Stripe.X` to avoid having to recreate
 * Stripe's enormous response shapes.
 */
import type Stripe from 'stripe';

const now = () => Math.floor(Date.now() / 1000);
let counter = 1;
const nextId = (prefix: string) => `${prefix}_mock_${Date.now()}_${counter++}`;

export function fakeCustomer(opts: { email: string; name: string; tenantId: string }): Stripe.Customer {
  return {
    id: nextId('cus'),
    object: 'customer',
    email: opts.email,
    name: opts.name,
    metadata: { tenantId: opts.tenantId, mock: 'true' },
    created: now(),
    livemode: false,
    balance: 0,
    currency: 'zar',
    delinquent: false,
    description: null,
    invoice_prefix: 'MOCK',
    invoice_settings: {
      custom_fields: null,
      default_payment_method: null,
      footer: null,
      rendering_options: null,
    },
    next_invoice_sequence: 1,
    preferred_locales: [],
    shipping: null,
    tax_exempt: 'none',
    test_clock: null,
  } as unknown as Stripe.Customer;
}

export function fakeCheckoutUrl(tier: string): string {
  return `/billing/mock-checkout?tier=${encodeURIComponent(tier)}&ts=${Date.now()}`;
}

export function fakePortalUrl(returnUrl: string): string {
  return `/billing/mock-portal?return=${encodeURIComponent(returnUrl)}`;
}

export function fakeSubscription(opts: {
  customerId: string;
  tier: 'starter' | 'professional';
}): Stripe.Subscription {
  return {
    id: nextId('sub'),
    object: 'subscription',
    customer: opts.customerId,
    status: 'active',
    livemode: false,
    created: now(),
    current_period_start: now(),
    current_period_end: now() + 30 * 24 * 3600,
    cancel_at_period_end: false,
    metadata: { tier: opts.tier, mock: 'true' },
    items: {
      object: 'list',
      data: [],
      has_more: false,
      url: '',
    },
  } as unknown as Stripe.Subscription;
}

export function fakeInvoice(opts: {
  customerId: string;
  description: string;
  amountCents: number;
  currency?: string;
}): Stripe.Invoice {
  return {
    id: nextId('in'),
    object: 'invoice',
    customer: opts.customerId,
    amount_due: opts.amountCents,
    amount_paid: 0,
    amount_remaining: opts.amountCents,
    currency: opts.currency ?? 'zar',
    description: opts.description,
    status: 'open',
    livemode: false,
    created: now(),
    auto_advance: true,
    paid: false,
    number: `MOCK-${Date.now()}`,
    hosted_invoice_url: `/billing/mock-invoice/${nextId('inv')}`,
    invoice_pdf: `/billing/mock-invoice/${nextId('inv')}.pdf`,
    metadata: { mock: 'true' },
  } as unknown as Stripe.Invoice;
}

export function fakeInvoiceList(): Stripe.Invoice[] {
  return [
    fakeInvoice({
      customerId: 'cus_mock',
      description: '3Wi PMO Suite - April 2026',
      amountCents: 1800000,
    }),
    fakeInvoice({
      customerId: 'cus_mock',
      description: '3Wi PMO Suite - March 2026',
      amountCents: 1800000,
    }),
  ];
}
