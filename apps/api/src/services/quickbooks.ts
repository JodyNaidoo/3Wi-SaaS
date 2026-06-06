/**
 * QuickBooks Online integration — deposit invoice creation on engagement accept.
 *
 * MOCK_MODE (default until real credentials are configured):
 *   - Returns a fake invoice reference shaped like a real QBO invoice ID
 *   - Logs to console so you can see the call would have fired
 *   - No external network calls
 *
 * LIVE_MODE (when env vars below are set):
 *   - QBO_BASE_URL              e.g. https://quickbooks.api.intuit.com
 *   - QBO_REALM_ID              QBO company realm
 *   - QBO_ACCESS_TOKEN          OAuth 2.0 access token
 *   - QBO_REFRESH_TOKEN         OAuth 2.0 refresh token (for renewal)
 *   - QBO_CUSTOMER_DEFAULT_ID   Default customer to bill against if engagement has no client match
 *
 *   When live mode is on, this calls the QBO REST API to:
 *     POST /v3/company/{realmId}/invoice
 *   with line items derived from the engagement's serviceName, scope summary,
 *   and a default 30% deposit fraction (configurable).
 *
 * Returns { invoiceRef, invoiceUrl, amountCents, status } regardless of mode
 * so the caller can persist the ref onto the engagement row.
 */

export interface CreateDepositInvoiceInput {
  engagementId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  serviceName: string;
  serviceSlug: string;
  scopeSummary?: string | null;
  budgetIndication?: string | null;
}

export interface CreateDepositInvoiceResult {
  invoiceRef: string;        // QBO invoice doc number (e.g. "INV-2026-0042")
  invoiceUrl?: string;       // Web link to invoice in QBO (live mode) or stub
  amountCents?: number;      // Best-effort budget × deposit fraction
  status: 'created' | 'mock' | 'failed';
  notes?: string;
}

const DEPOSIT_FRACTION = Number(process.env.QBO_DEPOSIT_FRACTION ?? '0.30');

function isLiveMode(): boolean {
  return !!(process.env.QBO_BASE_URL && process.env.QBO_REALM_ID && process.env.QBO_ACCESS_TOKEN);
}

/**
 * Parse a budget band like "R 100 000 – R 250 000" into a midpoint in cents.
 * Returns 0 if it can't parse.
 */
function budgetBandToCents(band?: string | null): number {
  if (!band) return 0;
  const nums = band.match(/\d[\d\s]*\d|\d/g);
  if (!nums || nums.length === 0) return 0;
  const cleaned = nums.map((n) => Number(n.replace(/\s/g, '')));
  if (cleaned.length === 1) return Math.round(cleaned[0] * 100);
  const mid = (cleaned[0] + cleaned[cleaned.length - 1]) / 2;
  return Math.round(mid * 100);
}

/**
 * Generate a realistic-looking QBO invoice ref for mock mode.
 */
function mockInvoiceRef(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${year}-${n}`;
}

export async function createDepositInvoice(input: CreateDepositInvoiceInput): Promise<CreateDepositInvoiceResult> {
  const totalCents = budgetBandToCents(input.budgetIndication);
  const depositCents = Math.round(totalCents * DEPOSIT_FRACTION);

  if (!isLiveMode()) {
    const ref = mockInvoiceRef();
    console.log(`[quickbooks/MOCK] would create invoice ${ref} for ${input.clientName} :: ${input.serviceName} :: ${depositCents > 0 ? `R${(depositCents / 100).toFixed(2)}` : 'no-budget-band'}`);
    return {
      invoiceRef: ref,
      invoiceUrl: `https://quickbooks.intuit.com/invoice/${ref} (mock — not a real URL)`,
      amountCents: depositCents,
      status: 'mock',
      notes: 'MOCK_MODE — set QBO_* env vars to enable live invoice creation',
    };
  }

  // LIVE MODE — placeholder. Implement when QBO credentials are available.
  // Stubbed to return a failed result so callers know live mode isn't wired yet.
  console.warn('[quickbooks] LIVE mode flagged but no real implementation yet. Returning failure.');
  return {
    invoiceRef: '',
    status: 'failed',
    notes: 'LIVE_MODE not yet implemented. Use QBO Node SDK (intuit-oauth + node-quickbooks) and wire the POST /v3/company/{realmId}/invoice call here.',
  };
}
