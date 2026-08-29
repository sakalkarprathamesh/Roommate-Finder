import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;

  // If a PostgreSQL / Supabase / Neon connection string is provided, use it directly
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // If running on Vercel Serverless environment with SQLite:
  if (process.env.VERCEL) {
    const tmpDbPath = '/tmp/dev.db';
    const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

    if (!fs.existsSync(tmpDbPath)) {
      try {
        if (fs.existsSync(bundledDbPath)) {
          fs.copyFileSync(bundledDbPath, tmpDbPath);
        }
      } catch (err) {
        console.error('Error copying bundled database to /tmp:', err);
      }
    }
    return `file:${tmpDbPath}`;
  }

  return envUrl || 'file:./dev.db';
}

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
