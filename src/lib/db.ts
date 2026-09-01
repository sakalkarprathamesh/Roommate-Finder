import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getSqliteDatabaseUrl(): string {
  // 1. If DATABASE_URL is explicitly a file: protocol, use it
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // 2. Resolve absolute path to the bundled prisma/dev.db
  const prismaDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const rootDbPath = path.join(process.cwd(), 'dev.db');

  if (fs.existsSync(prismaDbPath)) {
    return `file:${prismaDbPath}`;
  }

  if (fs.existsSync(rootDbPath)) {
    return `file:${rootDbPath}`;
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
