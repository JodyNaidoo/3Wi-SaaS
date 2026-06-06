import type { Response, NextFunction } from 'express';
import type { AuthedRequest } from './auth.js';
import { prisma } from '../lib/prisma.js';

/**
 * Set the Postgres `app.tenant_id` GUC for the duration of THIS request, so RLS isolates the
 * tenant. Must run after `requireAuth`.
 *
 * The cleanest pattern is `withTenant()` per query, but for routers that don't already use a
 * transaction we set it on a connection here. (Note: with PgBouncer in transaction mode this
 * does NOT span across queries — prefer `withTenant`.)
 */
export async function setTenantContext(req: AuthedRequest, _res: Response, next: NextFunction) {
  if (!req.user) return next();
  try {
    await prisma.$executeRawUnsafe(`set app.tenant_id = '${req.user.tenantId}'`);
    next();
  } catch (e) {
    next(e as Error);
  }
}
