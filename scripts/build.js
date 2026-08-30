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

    console.log('🔒 Ensuring test/demo accounts are flagged as isDemo = true...');
    execSync(
      `DATABASE_URL="${migrationUrl}" npx tsx -e "
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        async function run() {
          const demoEmails = [
            'admin@mitadt.ac.in',
            'rahul.sharma@gmail.com',
            'ananya.ux@gmail.com',
            'rohan.engg@gmail.com',
            'priya.foodtech@gmail.com',
            'aditya.aero@gmail.com'
          ];
          await prisma.user.updateMany({
            where: {
              OR: [
                { email: { in: demoEmails } },
                { email: { contains: '+demo' } },
                { email: { contains: '+test' } },
                { email: { startsWith: 'demo.' } },
                { email: { startsWith: 'test.' } },
                { email: { contains: '@demo.' } },
                { email: { contains: '@test.' } }
              ]
            },
            data: { isDemo: true }
          });
          const demoUsers = await prisma.user.findMany({ where: { isDemo: true }, select: { id: true } });
          const ids = demoUsers.map(u => u.id);
          await prisma.listing.updateMany({
            where: { ownerId: { in: ids } },
            data: { isDemo: true }
          });
          console.log('✅ Demo data isolation sync complete.');
        }
        run().then(() => prisma.\\$disconnect()).catch(err => { console.warn(err); prisma.\\$disconnect(); });
      "`,
      { stdio: 'inherit', shell: true, env: { ...process.env, DATABASE_URL: migrationUrl } }
    );
  } catch (err) {
    console.warn('⚠️ Note during database schema sync:', err.message);
  }
} else {
  console.log('ℹ️ Build completed.');
}
