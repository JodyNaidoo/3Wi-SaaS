/**
 * Mock 2FA challenge service for Stage 3 (Solly) and Stage 4 (Dr Blouw) sign-off.
 *
 * Real implementation will use TOTP (authenticator app) or WebAuthn. For now,
 * MOCK_MODE prints a deterministic 6-digit code to the API console.
 *
 * Caller flow:
 *   1. challenge(userId)  → starts a challenge, returns the expected code
 *      (in mock mode, also logged to console for the dev to copy-paste).
 *   2. verify(userId, code) → returns { ok, evidenceHash } if the supplied
 *      code matches the most recent challenge for that user, else { ok: false }.
 *
 * Storage: in-memory map keyed by userId. In prod this'd be Redis with a TTL.
 * The hash returned on verify is sha256(userId + code + challengeId) — stored
 * in the verification_signoffs / release_signoffs tables as immutable evidence.
 */

import crypto from 'node:crypto';
import { isGlobalMock } from './mode.js';

interface Challenge {
  code: string;
  challengeId: string;
  issuedAt: number;
  method: 'totp' | 'sms' | 'mock';
}

const CHALLENGES = new Map<string, Challenge>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

function nowMs() { return Date.now(); }

export function isMock2FA(): boolean {
  return isGlobalMock() || (process.env.MOCK_2FA ?? '').toLowerCase() === 'true';
}

export interface ChallengeIssued {
  challengeId: string;
  expiresAt: number;
  method: 'totp' | 'sms' | 'mock';
  // ONLY present in mock mode — never returned in prod
  devCode?: string;
}

/**
 * Issue a 2FA challenge for a user. Returns metadata the API can pass to
 * the client. In mock mode the dev code is also logged to the console so
 * Jody can copy-paste it without leaving the API window.
 */
export function challenge(args: {
  userId: string;
  userLabel?: string;
  purpose: string;
}): ChallengeIssued {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const challengeId = crypto.randomBytes(8).toString('hex');
  const method: Challenge['method'] = isMock2FA() ? 'mock' : 'totp';
  CHALLENGES.set(args.userId, { code, challengeId, issuedAt: nowMs(), method });

  if (isMock2FA()) {
    // eslint-disable-next-line no-console
    console.log(
      [
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        `  🔐 [MOCK 2FA]  ${args.purpose}`,
        `  user:    ${args.userLabel ?? args.userId}`,
        `  code:    ${code}`,
        `  expires: ${new Date(nowMs() + TTL_MS).toISOString()}`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
      ].join('\n'),
    );
  }

  return {
    challengeId,
    expiresAt: nowMs() + TTL_MS,
    method,
    devCode: isMock2FA() ? code : undefined,
  };
}

export interface VerifyResult {
  ok: boolean;
  evidenceHash?: string;
  method?: 'totp' | 'sms' | 'mock';
  reason?: string;
}

/**
 * Verify a 2FA code submission. On success, returns an evidenceHash that
 * the caller MUST persist in the signoff row (twofa_evidence_hash).
 */
export function verify(userId: string, code: string): VerifyResult {
  const ch = CHALLENGES.get(userId);
  if (!ch) return { ok: false, reason: 'no_challenge' };
  if (nowMs() - ch.issuedAt > TTL_MS) {
    CHALLENGES.delete(userId);
    return { ok: false, reason: 'expired' };
  }
  if (ch.code !== code) return { ok: false, reason: 'code_mismatch' };
  const evidenceHash = crypto
    .createHash('sha256')
    .update(`${userId}|${ch.challengeId}|${ch.code}`)
    .digest('hex');
  CHALLENGES.delete(userId); // single-use
  return { ok: true, evidenceHash, method: ch.method };
}
