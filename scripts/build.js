const { execSync } = require('child_process');

// 1. Resolve PostgreSQL database URL from Vercel Postgres / Neon / Supabase environment variables
const dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  'postgresql://postgres:postgres@localhost:5432/mitadt?schema=public';

process.env.DATABASE_URL = dbUrl;

console.log('⚡ Generating Prisma Client for PostgreSQL...');
execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

// 2. If connected to a real cloud PostgreSQL database, automatically push schema migrations & seed
const isRealDb = dbUrl && !dbUrl.includes('localhost:5432');

if (isRealDb) {
  try {
    console.log('⚡ Pushing database schema migrations to PostgreSQL on Vercel...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
    console.log('🌱 Seeding initial demo student accounts and listings...');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: process.env });
    console.log('✅ PostgreSQL database sync & seed completed successfully.');
  } catch (err) {
    console.warn('⚠️ Database migration/seed warning:', err.message);
  }
} else {
  console.log('ℹ️ Default build completed.');
}
