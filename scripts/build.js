const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

const isPostgres = dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'));

if (isPostgres) {
  schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema);
  process.env.DATABASE_URL = dbUrl;
  console.log('⚡ Configured Prisma for PostgreSQL cloud database.');
} else {
  schema = schema.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, schema);
  console.log('⚡ Configured Prisma for SQLite database.');
}

console.log('⚡ Generating Prisma Client...');
execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

if (isPostgres && !dbUrl.includes('localhost:5432')) {
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
    console.warn('⚠️ Database migration/seed note:', err.message);
  }
} else {
  console.log('ℹ️ Build completed.');
}
