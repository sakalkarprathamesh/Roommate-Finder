const { execSync } = require('child_process');

console.log('⚡ Generating Prisma Client...');
execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

try {
  console.log('⚡ Syncing database schema with prisma db push...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
  console.log('🌱 Seeding initial demo student profiles and listings...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: process.env });
} catch (err) {
  console.warn('⚠️ Database sync/seed note:', err.message);
}
