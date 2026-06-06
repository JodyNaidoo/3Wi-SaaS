import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma, withTenant } from '../lib/prisma.js';
import { signAccessToken, signRefreshToken } from '../middleware/auth.js';
import { authRateLimit } from '../middleware/rateLimit.js';

export const authRouter = Router();
authRouter.use(authRateLimit);

const signupSchema = z.object({
  tenantName: z.string().min(2),
  tenantSlug: z.string().regex(/^[a-z0-9-]+$/),
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(10),
});

authRouter.post('/signup', async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(body.password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { name: body.tenantName, slug: body.tenantSlug, billingEmail: body.email },
      });
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: body.email,
          fullName: body.fullName,
          role: 'director',
          passwordHash,
        },
      });
      return { tenant, user };
    });

    const access = signAccessToken({
      id: result.user.id,
      tenantId: result.tenant.id,
      role: 'director',
      email: result.user.email ?? undefined,
    });
    const refresh = signRefreshToken({ id: result.user.id, tenantId: result.tenant.id });
    res.json({ accessToken: access, refreshToken: refresh, user: result.user, tenant: result.tenant });
  } catch (e) {
    next(e);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const access = signAccessToken({
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email ?? undefined,
    });
    const refresh = signRefreshToken({ id: user.id, tenantId: user.tenantId });
    res.json({ accessToken: access, refreshToken: refresh, user });
  } catch (e) {
    next(e);
  }
});

const farmerLoginSchema = z.object({
  phone: z.string().regex(/^0\d{9}$/, 'SA mobile format: 10 digits starting with 0'),
  pin: z.string().regex(/^\d{4}$/),
});

authRouter.post('/farmer-login', async (req, res, next) => {
  try {
    const body = farmerLoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { phone: body.phone } });
    if (!user || user.role !== 'farmer' || !user.pinHash)
      return res.status(401).json({ error: 'Invalid phone or PIN' });

    const ok = await bcrypt.compare(body.pin, user.pinHash);
    if (!ok) return res.status(401).json({ error: 'Invalid phone or PIN' });

    const access = signAccessToken({
      id: user.id,
      tenantId: user.tenantId,
      role: 'farmer',
      phone: user.phone ?? undefined,
    });
    const refresh = signRefreshToken({ id: user.id, tenantId: user.tenantId });
    res.json({ accessToken: access, refreshToken: refresh, user });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret') as {
      id: string;
      tenantId: string;
    };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });
    const access = signAccessToken({
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
    });
    res.json({ accessToken: access });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

authRouter.post('/forgot', async (req, res) => {
  // stub — issues a one-time link via Resend in production
  res.json({ ok: true, message: 'If the email exists, a reset link has been sent.' });
});

void withTenant;
