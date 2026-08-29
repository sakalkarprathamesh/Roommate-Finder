const { execSync } = require('child_process');

const dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (dbUrl) {
  process.env.DATABASE_URL = dbUrl;
} else {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/mitadt?schema=public';
}

console.log('⚡ Generating Prisma Client for PostgreSQL...');
execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

if (dbUrl && !dbUrl.includes('localhost:5432')) {
  try {
    const migrationUrl = process.env.POSTGRES_URL_NON_POOLING || dbUrl;
    console.log('⚡ Pushing database schema migrations to PostgreSQL on Vercel...');
    execSync(`DATABASE_URL="${migrationUrl}" npx prisma db push --accept-data-loss`, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, DATABASE_URL: migrationUrl },
    });
    console.log('🌱 Seeding initial demo student accounts and listings...');
    execSync(`DATABASE_URL="${migrationUrl}" npx tsx prisma/seed.ts`, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, DATABASE_URL: migrationUrl },
    });
    console.log('✅ PostgreSQL database sync & seed completed successfully.');
  } catch (err) {
    console.warn('⚠️ Database migration/seed warning:', err.message);
  }
} else {
  console.log('ℹ️ No live DATABASE_URL provided during build step.');
}
