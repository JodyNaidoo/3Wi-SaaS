import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    role: string;
    email?: string;
    phone?: string;
  };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization ?? '';
  const [scheme, token] = auth.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret') as AuthedRequest['user'];
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Requires one of: ${roles.join(', ')}` });
    }
    next();
  };
}

export function signAccessToken(payload: NonNullable<AuthedRequest['user']>) {
  return jwt.sign(payload, process.env.JWT_SECRET ?? 'dev-secret', {
    expiresIn: process.env.JWT_EXPIRY ?? '15m',
  });
}

export function signRefreshToken(payload: { id: string; tenantId: string }) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRY ?? '30d',
  });
}
