import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

/**
 * Wrap a callback in a transaction with the tenant GUC set so RLS is enforced.
 * Use this for ANY query that touches tenant-scoped tables.
 */
export async function withTenant<T>(tenantId: string, fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`set local app.tenant_id = '${tenantId}'`);
    return fn(tx as unknown as PrismaClient);
  });
}
