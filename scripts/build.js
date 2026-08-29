const { execSync } = require('child_process');

const dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (dbUrl) {
  process.env.DATABASE_URL = dbUrl;
} else {
  // Temporary fallback during Prisma Client build step if env var not yet injected
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/mitadt?schema=public';
}

console.log('⚡ Generating Prisma Client for Cloud PostgreSQL...');
execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

if (dbUrl && !dbUrl.includes('localhost:5432')) {
  try {
    const migrationUrl = process.env.POSTGRES_URL_NON_POOLING || dbUrl;
    console.log('⚡ Pushing database schema to Cloud PostgreSQL...');
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
    console.log('✅ Cloud PostgreSQL database synchronized successfully.');
  } catch (err) {
    console.warn('⚠️ Note during database sync/seed:', err.message);
  }
} else {
  console.log('ℹ️ Build completed.');
}
