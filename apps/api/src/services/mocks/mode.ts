/**
 * Central detection helper for "mock mode" — the offline path that bypasses
 * external services (Anthropic, Stripe, Resend) when Jody hasn't paid for keys.
 *
 * Three triggers (any one wins):
 *   1. MOCK_MODE=true                     -> global force-mock
 *   2. MOCK_<SERVICE>=true                -> per-service force-mock
 *   3. The service's API key env var is missing/empty -> soft fallback
 *
 * The soft fallback emits a single console.warn the first time it engages so the
 * dev knows why their request is being stubbed.
 */

export type MockableService = 'claude' | 'stripe' | 'resend';

const KEY_ENV: Record<MockableService, string> = {
  claude: 'ANTHROPIC_API_KEY',
  stripe: 'STRIPE_SECRET_KEY',
  resend: 'RESEND_API_KEY',
};

const PER_SERVICE_FORCE: Record<MockableService, string> = {
  claude: 'MOCK_CLAUDE',
  stripe: 'MOCK_STRIPE',
  resend: 'MOCK_RESEND',
};

const warned: Record<MockableService, boolean> = {
  claude: false,
  stripe: false,
  resend: false,
};

export function isGlobalMock(): boolean {
  return (process.env.MOCK_MODE ?? 'false').toLowerCase() === 'true';
}

export function isMock(service: MockableService): boolean {
  if (isGlobalMock()) return true;
  if ((process.env[PER_SERVICE_FORCE[service]] ?? '').toLowerCase() === 'true') return true;
  const apiKey = process.env[KEY_ENV[service]];
  if (!apiKey || apiKey.trim() === '') {
    if (!warned[service]) {
      warned[service] = true;
      // eslint-disable-next-line no-console
      console.warn(
        `[3Wi MOCK] ${service.toUpperCase()} key (${KEY_ENV[service]}) missing - falling back to mock implementation. ` +
          `Set ${KEY_ENV[service]} or MOCK_MODE=true to silence this warning.`,
      );
    }
    return true;
  }
  return false;
}

/** Snapshot the current live/mock state - used by the startup banner. */
export function modeSnapshot() {
  return {
    globalMock: isGlobalMock(),
    services: {
      claude: isMock('claude') ? 'MOCK' : 'LIVE',
      stripe: isMock('stripe') ? 'MOCK' : 'LIVE',
      resend: isMock('resend') ? 'MOCK' : 'LIVE',
    } as Record<MockableService, 'MOCK' | 'LIVE'>,
  };
}

/** Pretty banner for server.ts startup. */
export function printStartupBanner(port: number | string): void {
  const snap = modeSnapshot();
  const line = '-'.repeat(64);
  // eslint-disable-next-line no-console
  console.log(
    [
      '',
      line,
      `  3Wi PMO API - listening on :${port}`,
      `  MOCK_MODE = ${snap.globalMock ? 'TRUE (everything stubbed)' : 'FALSE'}`,
      `    - Anthropic Claude  : ${snap.services.claude}`,
      `    - Stripe billing    : ${snap.services.stripe}`,
      `    - Resend email      : ${snap.services.resend}`,
      snap.globalMock
        ? '  No external API calls will be made. Outputs come from fixtures.'
        : '  Live services use the real API keys from .env.',
      line,
      '',
    ].join('\n'),
  );
}
