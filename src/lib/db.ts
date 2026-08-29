import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Automatically resolve database connection string from Neon / Supabase / Vercel Postgres
const resolvedDbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

if (resolvedDbUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedDbUrl;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: resolvedDbUrl ? { db: { url: resolvedDbUrl } } : undefined,
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
