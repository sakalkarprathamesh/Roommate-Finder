const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function promoteOwner() {
  const email = 'sakalkarprathamesh77@gmail.com'.toLowerCase().trim();
  console.log(`Setting role = "admin" for "${email}"...`);

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: 'admin',
          isDemo: false,
        },
      });
      console.log(`✅ Existing user "${email}" (ID: ${updated.id}) successfully promoted to role = "admin"!`);
    } else {
      console.log(`Creating admin account for "${email}"...`);
      const defaultPasswordHash = await bcrypt.hash('Admin@123', 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash: defaultPasswordHash,
          role: 'admin',
          isActive: true,
          isDemo: false,
          profile: {
            create: {
              name: 'Prathamesh Sakalkar',
              email,
              phone: '+91 99000 00000',
              school: 'School of Computing',
              department: 'Computer Science & Engineering',
              year: 'Staff / Admin',
              emailVerified: true,
              studentVerified: true,
              verificationStatus: 'verified',
              role: 'admin',
              bio: 'Platform Owner & Administrator for Roomie (MIT-ADT University).',
            },
          },
        },
      });
      console.log(`✅ Created new admin user for "${email}" with role = "admin" (ID: ${newUser.id})`);
    }
  } catch (err) {
    console.error('Error promoting admin user:', err);
  } finally {
    await prisma.$disconnect();
  }
}

promoteOwner();
