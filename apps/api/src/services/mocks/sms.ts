/**
 * Mock SMS service.
 *
 * In MOCK_MODE (or when no SMS provider env vars are set), this prints the
 * outbound message to console with a clear banner so Jody can see what
 * would have been sent to the farmer's phone.
 *
 * For prod, swap to a Twilio / Clickatell adapter — interface is `sendSms`.
 */

import { isGlobalMock } from './mode.js';

export interface SmsResult {
  ok: boolean;
  provider: 'mock' | 'twilio' | 'clickatell';
  messageId?: string;
  error?: string;
}

const PROVIDER_KEY = process.env.SMS_PROVIDER_API_KEY ?? '';

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const mock = isGlobalMock() || !PROVIDER_KEY || (process.env.MOCK_SMS ?? '').toLowerCase() === 'true';
  if (mock) {
    const id = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    // eslint-disable-next-line no-console
    console.log(
      [
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        `  📱 [MOCK SMS]  to: ${to}`,
        '  --------------------------------------------------------------',
        ...body.split('\n').map((line) => `  ${line}`),
        '  --------------------------------------------------------------',
        `  messageId: ${id}`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
      ].join('\n'),
    );
    return { ok: true, provider: 'mock', messageId: id };
  }
  // TODO: wire to Twilio / Clickatell here. Intentionally left unimplemented;
  // see NO_KEYS_DEPLOY.md for the prod path.
  return { ok: false, provider: 'twilio', error: 'live SMS not configured — set SMS_PROVIDER_API_KEY' };
}

/** Helper: format the standard Sunshines invitation message. */
export function farmerInviteBody(args: {
  growerName: string;
  externalRef: number | string;
  otp: string;
  portalUrl: string;
}): string {
  return [
    `Hempire-EC Sunshines Project`,
    `Hi ${args.growerName}, your payment verification is ready.`,
    `Open ${args.portalUrl} and enter your one-time PIN: ${args.otp}`,
    `Your reference: #${args.externalRef}. The PIN expires in 10 minutes.`,
  ].join('\n');
}

/** Helper: post-submission confirmation message. */
export function farmerConfirmationBody(growerName: string, ref: string | number): string {
  return [
    `Hempire-EC Sunshines Project`,
    `Thank you ${growerName} — your verification has been received (ref #${ref}).`,
    `You'll get another SMS once your payment is processed.`,
  ].join('\n');
}

/** Helper: paid notification with POP link. */
export function farmerPaidBody(growerName: string, popUrl: string): string {
  return [
    `Hempire-EC Sunshines Project`,
    `Payment processed, ${growerName}. Your proof of payment is at:`,
    popUrl,
  ].join('\n');
}
