import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getSqliteUrl(): string | undefined {
  // In Vercel serverless execution, copy the bundled database to writeable /tmp
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

  return undefined;
}

const sqliteUrl = getSqliteUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: sqliteUrl ? { db: { url: sqliteUrl } } : undefined,
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
