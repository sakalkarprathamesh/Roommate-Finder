const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure database files are present and synchronized
const prismaDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const rootDbPath = path.join(process.cwd(), 'dev.db');

if (fs.existsSync(prismaDbPath) && !fs.existsSync(rootDbPath)) {
  fs.copyFileSync(prismaDbPath, rootDbPath);
} else if (fs.existsSync(rootDbPath) && !fs.existsSync(prismaDbPath)) {
  fs.copyFileSync(rootDbPath, prismaDbPath);
}

const sqliteUrl = `file:${prismaDbPath}`;
process.env.DATABASE_URL = sqliteUrl;

console.log('⚡ Generating Prisma Client for SQLite Database...');
execSync('npx prisma generate', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: sqliteUrl } });
console.log('✅ SQLite Prisma Client generation complete.');
