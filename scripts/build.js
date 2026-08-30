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
    console.log('⚡ Ensuring database schema is synced without data loss...');
    execSync(`DATABASE_URL="${migrationUrl}" npx prisma db push`, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, DATABASE_URL: migrationUrl },
    });
    console.log('✅ Database schema verified.');
  } catch (err) {
    console.warn('⚠️ Note during database schema sync:', err.message);
  }
} else {
  console.log('ℹ️ Build completed.');
}
