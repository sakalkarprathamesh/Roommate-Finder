const { execSync } = require('child_process');

// Ensure a non-empty fallback DATABASE_URL exists so Prisma generation never throws P1012 during build
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/mitadt?schema=public';
}

console.log('⚡ Generating Prisma Client...');
execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

// If a real external database (Neon, Supabase, Vercel Postgres) is connected, push schema and seed
const isRealDb = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost:5432');

if (isRealDb) {
  try {
    console.log('⚡ Syncing database schema with cloud PostgreSQL...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
    console.log('🌱 Seeding initial demo student profiles and listings...');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: process.env });
  } catch (err) {
    console.warn('⚠️ Database sync/seed note:', err.message);
  }
} else {
  console.log('ℹ️ Build completed with default Prisma Client.');
}
