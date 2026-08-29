import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Automatically resolve PostgreSQL connection URL across Vercel Postgres, Neon, Supabase, or DATABASE_URL
const resolvedDbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: resolvedDbUrl ? { db: { url: resolvedDbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
