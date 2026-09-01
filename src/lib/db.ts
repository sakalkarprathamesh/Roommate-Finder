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

  const candidatePaths = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(process.cwd(), 'dev.db'),
    path.join('/var', 'task', 'prisma', 'dev.db'),
    path.join('/var', 'task', 'dev.db'),
    path.resolve('./prisma/dev.db'),
    path.resolve('./dev.db'),
  ];

  let sourceDbPath: string | null = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      sourceDbPath = p;
      break;
    }
  }

  if (isServerless) {
    // On Vercel serverless functions, the application root is strictly read-only.
    // SQLite requires write access to the directory for rollback journals and locking.
    // /tmp is the only guaranteed writable directory on AWS Lambda & Vercel.
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

  // 2. Resolve absolute path to the local database
  if (sourceDbPath) {
    return `file:${sourceDbPath}`;
  }

  return `file:${candidatePaths[0]}`;
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

