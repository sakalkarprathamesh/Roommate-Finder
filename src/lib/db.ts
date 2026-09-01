import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getSqliteDatabaseUrl(): string {
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.LAMBDA_TASK_ROOT) ||
    process.env.NODE_ENV === 'production';

  const prismaDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const rootDbPath = path.join(process.cwd(), 'dev.db');
  const sourceDbPath = fs.existsSync(prismaDbPath) ? prismaDbPath : fs.existsSync(rootDbPath) ? rootDbPath : null;

  if (isServerless) {
    // Vercel serverless containers have a strictly read-only filesystem under /var/task.
    // SQLite requires write access for locking and journals, available exclusively in /tmp.
    const tmpDbPath = path.join('/tmp', 'dev.db');
    try {
      if (!fs.existsSync(tmpDbPath) && sourceDbPath) {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.error('Error synchronizing SQLite database to /tmp for write operations:', err);
    }
  }

  // 1. If DATABASE_URL is explicitly a file: protocol, use it
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // 2. Resolve absolute path to the local dev database
  if (sourceDbPath) {
    return `file:${sourceDbPath}`;
  }

  return `file:${prismaDbPath}`;
}

const sqliteUrl = getSqliteDatabaseUrl();
process.env.DATABASE_URL = sqliteUrl;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: sqliteUrl,
      },
    },
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

