/**
 * Banking-field encryption helper.
 *
 * Used to encrypt at rest:
 *   farmer_signoffs.banking_account_holder_enc
 *   farmer_signoffs.banking_account_number_enc
 *   farmer_signoffs.banking_branch_code_enc
 *
 * Algorithm: AES-256-GCM. Each encrypted value includes its 12-byte IV and
 * 16-byte authentication tag, so the ciphertext is self-contained and a
 * single string field is enough to store everything.
 *
 * Format: base64( iv (12) || authTag (16) || ciphertext )
 *
 * Key: 32 raw bytes, supplied via BANKING_ENC_KEY env var as base64.
 * In MOCK_MODE / dev, if BANKING_ENC_KEY is unset a deterministic dev key
 * is used so the system still works for local testing — never use in prod.
 *
 * POPIA notes:
 *   - Banking fields are NEVER returned by the ECRDA dashboard route.
 *   - Banking fields are decrypted only by the Stage 5 bookkeeper role.
 *   - Every decrypt() call SHOULD be wrapped in an audit_log insert by the
 *     caller (see auditDecrypt() helper below).
 */

import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;

const DEV_KEY_WARNING =
  '[banking-encrypt] BANKING_ENC_KEY env var is not set. Using a fixed dev key so the system works for testing. DO NOT USE IN PRODUCTION.';

let warned = false;
function getKey(): Buffer {
  const raw = process.env.BANKING_ENC_KEY;
  if (!raw || raw.trim() === '') {
    if (!warned) {
      warned = true;
      // eslint-disable-next-line no-console
      console.warn(DEV_KEY_WARNING);
    }
    // Deterministic 32-byte dev key. Safe ONLY because it's never used in prod.
    return crypto.createHash('sha256').update('3wi-dev-banking-key-do-not-use-in-prod').digest();
  }
  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) {
    throw new Error(`BANKING_ENC_KEY must be 32 bytes (base64) — got ${buf.length}`);
  }
  return buf;
}

export function encryptBanking(plaintext: string | null | undefined): string | null {
  if (plaintext == null || plaintext === '') return null;
  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('base64');
}

export function decryptBanking(envelope: string | null | undefined): string | null {
  if (envelope == null || envelope === '') return null;
  const key = getKey();
  const buf = Buffer.from(envelope, 'base64');
  if (buf.length < IV_LEN + TAG_LEN + 1) {
    throw new Error('[banking-encrypt] ciphertext too short to be valid');
  }
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ct = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString('utf8');
}

/** Mask an account number for log/UI display: 1234567890 → •••••• 7890 */
export function maskAccount(plaintext: string | null | undefined): string {
  if (!plaintext) return '—';
  const s = String(plaintext).replace(/\s+/g, '');
  if (s.length <= 4) return '•••• ' + s;
  return '•'.repeat(Math.max(0, s.length - 4)) + ' ' + s.slice(-4);
}

/**
 * Records a POPIA audit-log entry for a banking-field read. Caller must
 * invoke this every time decryptBanking() is used to serve banking data
 * to a human (the bookkeeper's payment loader). Keep entries lightweight.
 */
export async function auditDecrypt(args: {
  tenantId: string;
  userId: string;
  disbursementId: string;
  ipAddress?: string | null;
  reason?: string;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tenantId: args.tenantId,
      userId: args.userId,
      action: 'banking.decrypt',
      entityType: 'disbursement',
      entityId: args.disbursementId,
      ipAddress: args.ipAddress ?? null,
      metadata: { reason: args.reason ?? 'payment-loader' } as never,
    },
  });
}
