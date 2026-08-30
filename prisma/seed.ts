import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // SAFE SEEDING: Check if users already exist. NEVER wipe real student data!
  const existingUsersCount = await prisma.user.count();
  if (existingUsersCount > 0) {
    console.log(`ℹ️ Database already contains ${existingUsersCount} users. Preserving existing accounts and listings.`);
    return;
  }

  console.log('🌱 Database is empty. Seeding initial admin and demo listings...');
  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

  // 1. Admin Account
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mitadt.ac.in',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true,
      profile: {
        create: {
          name: 'MIT-ADT Housing Admin',
          email: 'admin@mitadt.ac.in',
          phone: '+91 20 6711 6000',
          school: 'School of Computing',
          department: 'Student Affairs & Housing Administration',
          year: 'Staff',
          studentId: 'STAFF-ADMIN-01',
          emailVerified: true,
          studentVerified: true,
          verificationStatus: 'verified',
          role: 'admin',
          bio: 'Official student housing and accommodation administrator for MIT-ADT University Pune.',
        },
      },
    },
  });

  // 2. Student 1: Rahul Sharma
  const rahul = await prisma.user.create({
    data: {
      email: 'rahul.sharma@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'student',
      isActive: true,
      profile: {
        create: {
          name: 'Rahul Sharma',
          email: 'rahul.sharma@gmail.com',
          phone: '+91 98234 11223',
          school: 'School of Computing',
          department: 'Computer Science & Engineering',
          year: '3rd Year',
          division: 'Div A',
          studentId: 'MIT2023-CS-042',
          profilePhotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
          bio: 'CSE 3rd year student. Serious about academics and quiet study hours. We keep our flat clean and respectful.',
          emailVerified: true,
          studentVerified: true,
          verificationStatus: 'verified',
          role: 'student',
        },
      },
    },
  });

  // 3. Student 2: Ananya Patel
  const ananya = await prisma.user.create({
    data: {
      email: 'ananya.ux@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'student',
      isActive: true,
      profile: {
        create: {
          name: 'Ananya Patel',
          email: 'ananya.ux@gmail.com',
          phone: '+91 99701 44556',
          school: 'Institute of Design',
          department: 'User Experience (UX/UI)',
          year: '3rd Year',
          division: 'Batch B',
          studentId: 'MIT2023-DES-108',
          profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
          bio: 'Design student at MIT ID. Looking for a neat flatmate for a furnished 2BHK flat near Amanora / Magarpatta.',
          emailVerified: true,
          studentVerified: true,
          verificationStatus: 'verified',
          role: 'student',
        },
      },
    },
  });

  // 4. Sample Accommodation Listings
  await prisma.listing.create({
    data: {
      ownerId: rahul.id,
      title: '1 Vacancy in 2BHK Flat near Gate 2',
      listingType: 'HAVE_VACANCY',
      accommodationType: 'Flat',
      roomType: 'Shared',
      location: 'Near MIT-ADT',
      rent: 7500,
      deposit: 15000,
      currentOccupants: 3,
      vacancies: 1,
      totalCapacity: 4,
      moveInDate: 'September 2026',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      description: 'We are three MIT-ADT students looking for one more student to share our 2BHK flat. High-speed WiFi, RO water, and daily maid service available.',
      status: 'ACTIVE',
    },
  });

  await prisma.listing.create({
    data: {
      ownerId: ananya.id,
      title: 'Looking for 1 Female Flatmate for 2BHK in Amanora',
      listingType: 'NEED_ROOMMATE',
      accommodationType: 'Flat',
      roomType: 'Shared',
      location: 'Amanora / Magarpatta',
      rent: 9500,
      deposit: 20000,
      currentOccupants: 1,
      vacancies: 1,
      totalCapacity: 2,
      moveInDate: 'Immediately',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
      description: 'Seeking a female student or designer roommate to share a fully furnished premium flat with gym, pool, and club access in Amanora.',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Initial database seed completed.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
