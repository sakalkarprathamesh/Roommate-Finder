const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setAdmin() {
  const emailArg = process.argv[2];
  if (!emailArg) {
    console.error('Usage: node scripts/set-admin.js <email>');
    console.error('Example: node scripts/set-admin.js myemail@gmail.com');
    process.exit(1);
  }

  const cleanEmail = emailArg.toLowerCase().trim();
  console.log(`Setting role = "admin" for: "${cleanEmail}"...`);

  try {
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profile: true },
    });

    if (!user) {
      console.error(`❌ User with email "${cleanEmail}" was not found in the database.`);
      console.log('Please register this account on the website first, then run this command again.');
      process.exit(1);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' },
    });

    console.log(`✅ Successfully promoted "${cleanEmail}" (Name: ${user.profile?.name || 'User'}) to role = "admin"!`);
    console.log(`You can now log in and access the protected Admin Dashboard directly at: /admin`);
  } catch (err) {
    console.error('Error setting admin role:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();
