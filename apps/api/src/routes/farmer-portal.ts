/**
 * Farmer self-verification portal (Stage 2 of the Hempire payment process).
 *
 * Endpoints:
 *   POST /farmer/otp-request   - body { externalRef } | { phone }
 *                                  → issues a 6-digit OTP via SMS to the
 *                                    grower's registered phone, returns
 *                                    a challengeId + masked phone.
 *
 *   POST /farmer/otp-verify    - body { externalRef, code }
 *                                  → on success returns a short-lived JWT
 *                                    scoped to that grower + disbursement.
 *
 *   GET  /farmer/disbursement  - bearer: farmer JWT
 *                                  → returns the grower & disbursement detail
 *                                    needed to render the verify screen.
 *
 *   POST /farmer/signoff       - bearer: farmer JWT
 *                                  → body: accept + banking + indemnity
 *                                    OR  dispute + reason.
 *                                    Idempotent by disbursement_id.
 *
 * The farmer JWT is intentionally narrow — type='farmer', scoped to one
 * disbursement, 60-minute TTL. It does NOT carry tenant-wide privileges.
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { withTenant, prisma } from '../lib/prisma.js';
import { encryptBanking } from '../services/banking-encrypt.js';
import { challenge as issueChallenge, verify as verifyChallenge } from '../services/mocks/twofa.js';
import { sendSms, farmerInviteBody, farmerConfirmationBody } from '../services/mocks/sms.js';

export const farmerPortalRouter = Router();

// ───────────────────────────────────────────── Farmer JWT helpers
interface FarmerTokenPayload {
  type: 'farmer';
  tenantId: string;
  growerId: string;
  disbursementId: string;
  externalRef: number;
}

interface FarmerRequest extends Request {
  farmer?: FarmerTokenPayload;
}

function signFarmerToken(p: FarmerTokenPayload): string {
  return jwt.sign(p, process.env.JWT_SECRET ?? 'dev-secret', { expiresIn: '60m' });
}

function requireFarmer(req: FarmerRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization ?? '';
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret') as FarmerTokenPayload;
    if (payload.type !== 'farmer') {
      return res.status(401).json({ error: 'Wrong token type for farmer portal' });
    }
    req.farmer = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired farmer token' });
  }
}

function maskPhone(phone: string | null): string {
  if (!phone) return '—';
  const last4 = phone.replace(/\D/g, '').slice(-4);
  return `+•• •••• •• ${last4}`;
}

// ───────────────────────────────────────────── 1. OTP request
const otpRequestSchema = z.object({
  externalRef: z.coerce.number().int().positive(),
});

farmerPortalRouter.post('/otp-request', async (req, res, next) => {
  try {
    const body = otpRequestSchema.parse(req.body);

    // Public endpoint — we need to find the grower without an authed tenant.
    // The (project_id, external_ref) pair is globally unique; in practice the
    // farmer enters their personal reference number printed on their invite.
    const grower = await prisma.grower.findFirst({
      where: { externalRef: body.externalRef },
      include: {
        disbursements: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!grower || !grower.disbursements[0]) {
      // Don't reveal whether the ref exists — return generic OK with a fake
      // delay so we don't leak enumeration.
      await new Promise((r) => setTimeout(r, 500));
      return res.json({
        ok: true,
        sentTo: '—',
        message: 'If that reference exists, an SMS has been sent.',
      });
    }

    const disbursement = grower.disbursements[0];
    const otp = issueChallenge({
      userId: `grower:${grower.id}`,
      userLabel: `${grower.fullName} (#${grower.externalRef})`,
      purpose: `Sunshines farmer portal login — ${grower.fullName}`,
    });

    const portalUrl = process.env.PUBLIC_FARMER_PORTAL_URL ?? 'http://localhost:5173/my-farm';
    await sendSms(
      grower.phone ?? '+27000000000',
      farmerInviteBody({
        growerName: grower.fullName,
        externalRef: grower.externalRef,
        otp: otp.devCode ?? '••••••',
        portalUrl,
      }),
    );

    res.json({
      ok: true,
      sentTo: maskPhone(grower.phone),
      challengeId: otp.challengeId,
      expiresAt: otp.expiresAt,
      // In MOCK_MODE we don't return the code — Jody reads it from the API console.
      devNote: otp.devCode ? 'OTP code printed to API console (MOCK_MODE)' : undefined,
      disbursementStatus: disbursement.processStatus,
    });
  } catch (e) {
    next(e);
  }
});

// ───────────────────────────────────────────── 2. OTP verify
const otpVerifySchema = z.object({
  externalRef: z.coerce.number().int().positive(),
  code: z.string().regex(/^\d{6}$/),
});

farmerPortalRouter.post('/otp-verify', async (req, res, next) => {
  try {
    const body = otpVerifySchema.parse(req.body);

    const grower = await prisma.grower.findFirst({
      where: { externalRef: body.externalRef },
      include: {
        disbursements: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!grower || !grower.disbursements[0]) {
      return res.status(404).json({ error: 'Grower not found' });
    }

    const result = verifyChallenge(`grower:${grower.id}`, body.code);
    if (!result.ok) {
      return res.status(401).json({ error: 'Invalid or expired OTP', reason: result.reason });
    }

    const token = signFarmerToken({
      type: 'farmer',
      tenantId: grower.tenantId,
      growerId: grower.id,
      disbursementId: grower.disbursements[0].id,
      externalRef: grower.externalRef,
    });

    res.json({
      ok: true,
      token,
      grower: {
        id: grower.id,
        fullName: grower.fullName,
        externalRef: grower.externalRef,
        district: grower.district,
      },
      disbursementId: grower.disbursements[0].id,
    });
  } catch (e) {
    next(e);
  }
});

// ───────────────────────────────────────────── 3. Get my disbursement (authed)
farmerPortalRouter.get('/disbursement', requireFarmer, async (req: FarmerRequest, res, next) => {
  try {
    const f = req.farmer!;
    const row = await withTenant(f.tenantId, (tx) =>
      tx.disbursement.findFirst({
        where: { id: f.disbursementId, growerId: f.growerId },
        include: {
          grower: {
            select: {
              fullName: true, farmName: true, district: true, region: true,
              coordinator: true, externalRef: true,
              seedlingsReceived: true, mappedHa: true, theoreticalHa: true,
            },
          },
          farmerSignoff: { select: { decision: true, signedAt: true } },
        },
      }),
    );
    if (!row) return res.status(404).json({ error: 'Disbursement not found' });
    res.json({ disbursement: row });
  } catch (e) {
    next(e);
  }
});

// ───────────────────────────────────────────── 4. Submit sign-off (authed, idempotent)
const signoffSchema = z.discriminatedUnion('decision', [
  z.object({
    decision: z.literal('accepted'),
    signedFullName: z.string().min(3),
    indemnityAccepted: z.literal(true),
    banking: z.object({
      accountHolder: z.string().min(2),
      bank: z.string().min(2),
      accountNumber: z.string().regex(/^\d{6,16}$/),
      branchCode: z.string().regex(/^\d{4,8}$/),
      accountType: z.enum(['cheque', 'savings', 'current', 'transmission']),
      proofStorageKey: z.string().optional(),
    }),
  }),
  z.object({
    decision: z.literal('disputed'),
    signedFullName: z.string().min(3),
    disputeReason: z.string().min(10),
  }),
]);

farmerPortalRouter.post('/signoff', requireFarmer, async (req: FarmerRequest, res, next) => {
  try {
    const f = req.farmer!;
    const body = signoffSchema.parse(req.body);
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0] ?? req.socket.remoteAddress ?? null;
    const fingerprint = req.headers['user-agent'] ?? null;

    const result = await withTenant(f.tenantId, async (tx) => {
      // Confirm disbursement belongs to this grower and is in a signable state
      const disbursement = await tx.disbursement.findFirstOrThrow({
        where: { id: f.disbursementId, growerId: f.growerId },
      });

      if (!['Awaiting Beneficiary', 'Disputed'].includes(disbursement.processStatus)) {
        throw new Error(`Cannot sign off — current status: ${disbursement.processStatus}`);
      }

      // Idempotency: upsert by disbursement_id
      const existing = await tx.farmerSignoff.findUnique({ where: { disbursementId: disbursement.id } });
      if (existing && existing.decision !== 'no_response') {
        return { signoff: existing, idempotent: true };
      }

      let data: any;
      if (body.decision === 'accepted') {
        data = {
          decision: 'accepted',
          signedFullName: body.signedFullName,
          signedAt: new Date(),
          signedIp: ip,
          signedDeviceFingerprint: typeof fingerprint === 'string' ? fingerprint.slice(0, 200) : null,
          indemnityVersion: '1.0',
          bankingAccountHolderEnc: encryptBanking(body.banking.accountHolder),
          bankingBank: body.banking.bank,
          bankingAccountNumberEnc: encryptBanking(body.banking.accountNumber),
          bankingBranchCodeEnc: encryptBanking(body.banking.branchCode),
          bankingAccountType: body.banking.accountType,
          bankingProofStorageKey: body.banking.proofStorageKey,
        };
      } else {
        data = {
          decision: 'disputed',
          signedFullName: body.signedFullName,
          signedAt: new Date(),
          signedIp: ip,
          signedDeviceFingerprint: typeof fingerprint === 'string' ? fingerprint.slice(0, 200) : null,
          disputeReason: body.disputeReason,
        };
      }

      const signoff = existing
        ? await tx.farmerSignoff.update({ where: { id: existing.id }, data })
        : await tx.farmerSignoff.create({
            data: {
              ...data,
              tenantId: f.tenantId,
              disbursementId: disbursement.id,
              growerId: f.growerId,
            },
          });

      // Advance disbursement process_status
      const newStatus = body.decision === 'accepted' ? 'Beneficiary-Accepted' : 'Disputed';
      await tx.disbursement.update({
        where: { id: disbursement.id },
        data: { processStatus: newStatus, processStatusAt: new Date() },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          tenantId: f.tenantId,
          userId: null,
          action: `farmer.signoff.${body.decision}`,
          entityType: 'disbursement',
          entityId: disbursement.id,
          ipAddress: ip,
          metadata: {
            externalRef: f.externalRef,
            signedFullName: body.signedFullName,
            indemnityVersion: body.decision === 'accepted' ? '1.0' : undefined,
          } as never,
        },
      });

      return { signoff, idempotent: false };
    });

    // Send confirmation SMS (mock prints to console)
    const grower = await prisma.grower.findUnique({ where: { id: f.growerId } });
    if (grower?.phone) {
      await sendSms(grower.phone, farmerConfirmationBody(grower.fullName, grower.externalRef));
    }

    res.json({ ok: true, ...result });
  } catch (e) {
    next(e);
  }
});
