// Singleton Prisma client — survives hot reload in dev and reuses the
// connection across Vercel serverless invocations.
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __notemdPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__notemdPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__notemdPrisma = prisma;
}
