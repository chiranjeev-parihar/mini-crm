import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client instance.
 * Reuses a single connection pool across hot reloads in development.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
