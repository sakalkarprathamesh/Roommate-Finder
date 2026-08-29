import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database for clean re-seed...');
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

  // 1. Admin Account
  console.log('Creating Admin account...');
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

  // 2. Student 1: Rahul Sharma (School of Computing, CSE 3rd Year) - MIT-ADT Verified
  console.log('Creating Student 1: Rahul Sharma...');
  const rahul = await prisma.user.create({
    data: {
      email: 'rahul.sharma@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'student',
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

  // 3. Student 2: Ananya Patel (Institute of Design, UX/UI 3rd Year) - MIT-ADT Verified
  console.log('Creating Student 2: Ananya Patel...');
  const ananya = await prisma.user.create({
    data: {
      email: 'ananya.ux@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'student',
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

  // 4. Student 3: Rohan Deshmukh (School of Engineering, Mechanical 2nd Year) - Verification Pending
  console.log('Creating Student 3: Rohan Deshmukh...');
  const rohan = await prisma.user.create({
    data: {
      email: 'rohan.engg@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'student',
      profile: {
        create: {
          name: 'Rohan Deshmukh',
          email: 'rohan.engg@gmail.com',
          phone: '+91 97654 88990',
          school: 'School of Engineering',
          department: 'Mechanical Engineering',
          year: '2nd Year',
          division: 'Div C',
          studentId: 'MIT2024-ME-055',
          profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          bio: 'Mechanical engineering sophomore. Gym goer and formula racing enthusiast. Looking for a room near Gate 1/2.',
          emailVerified: true,
          studentVerified: false,
          verificationStatus: 'pending',
          role: 'student',
        },
      },
    },
  });

  // 5. Student 4: Priya Kulkarni (College of Food Technology, 2nd Year) - MIT-ADT Verified
  console.log('Creating Student 4: Priya Kulkarni...');
  const priya = await prisma.user.create({
    data: {
      email: 'priya.foodtech@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'student',
      profile: {
        create: {
          name: 'Priya Kulkarni',
          email: 'priya.foodtech@gmail.com',
          phone: '+91 94220 33441',
          school: 'College of Food Technology',
          department: 'Food Technology',
          year: '2nd Year',
          division: 'Div A',
          studentId: 'MIT2024-FT-015',
          profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          bio: 'Food technology student. Early riser, neat and organized. We have 1 vacancy in our clean girls PG flat.',
          emailVerified: true,
          studentVerified: true,
          verificationStatus: 'verified',
          role: 'student',
        },
      },
    },
  });

  // 6. Student 5: Aditya Verma (School of Engineering, Aerospace 3rd Year) - Verification Pending
  console.log('Creating Student 5: Aditya Verma...');
  const aditya = await prisma.user.create({
    data: {
      email: 'aditya.aero@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'student',
      profile: {
        create: {
          name: 'Aditya Verma',
          email: 'aditya.aero@gmail.com',
          phone: '+91 98901 77662',
          school: 'School of Engineering',
          department: 'Aerospace Engineering',
          year: '3rd Year',
          division: 'Div A',
          studentId: 'MIT2023-AE-077',
          profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
          bio: 'Aerospace student working on drone projects. We have 2 spots open in our 3BHK flat in Kadamwakabasti.',
          emailVerified: true,
          studentVerified: false,
          verificationStatus: 'pending',
          role: 'student',
        },
      },
    },
  });

  // 7. Create Accommodation Listings across 4 Types
  console.log('Creating Accommodation Listings...');

  // Listing 1: Rahul Sharma -> HAVE_VACANCY
  const listing1 = await prisma.listing.create({
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
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      description: 'We are three MIT-ADT students looking for one more student to share our 2BHK flat. High-speed WiFi, RO water, and daily maid service available. 5 minutes walk from campus main gate.',
      status: 'ACTIVE',
    },
  });

  // Listing 2: Ananya Patel -> NEED_ROOMMATE
  const listing2 = await prisma.listing.create({
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
      description: 'Seeking a female student or designer roommate to share a fully furnished premium flat with gym, pool, and club access in Amanora. 20 min campus commute.',
      status: 'ACTIVE',
    },
  });

  // Listing 3: Rohan Deshmukh -> NEED_ACCOMMODATION
  const listing3 = await prisma.listing.create({
    data: {
      ownerId: rohan.id,
      title: 'Looking for a Private Room in Loni Kalbhor / Campus Area',
      listingType: 'NEED_ACCOMMODATION',
      accommodationType: 'Room',
      roomType: 'Private',
      location: 'Near MIT-ADT',
      rent: 8000,
      deposit: 10000,
      currentOccupants: 0,
      vacancies: 1,
      totalCapacity: 1,
      moveInDate: 'September 2026',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      description: '2nd year mechanical engineering student looking for an individual private room or single occupancy flat near campus with parking for a two-wheeler.',
      status: 'ACTIVE',
    },
  });

  // Listing 4: Priya Kulkarni -> HAVE_ROOM
  const listing4 = await prisma.listing.create({
    data: {
      ownerId: priya.id,
      title: 'Clean Single Room in Girls PG Flat',
      listingType: 'HAVE_ROOM',
      accommodationType: 'PG',
      roomType: 'Private',
      location: 'Loni Kalbhor',
      rent: 8500,
      deposit: 15000,
      currentOccupants: 2,
      vacancies: 1,
      totalCapacity: 3,
      moveInDate: 'Immediately',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      description: 'Private room in a 3BHK girls PG in Loni Kalbhor. Includes home-cooked mess food, washing machine, study table, and 24/7 security. Vegetarian friendly.',
      status: 'ACTIVE',
    },
  });

  // Listing 5: Aditya Verma -> HAVE_VACANCY
  const listing5 = await prisma.listing.create({
    data: {
      ownerId: aditya.id,
      title: '2 Vacancies in Spacious 3BHK Flat in Kadamwakabasti',
      listingType: 'HAVE_VACANCY',
      accommodationType: 'Flat',
      roomType: 'Shared',
      location: 'Kadamwakabasti',
      rent: 6500,
      deposit: 12000,
      currentOccupants: 2,
      vacancies: 2,
      totalCapacity: 4,
      moveInDate: 'September 2026',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      description: 'Two spots available for engineering students in a 3BHK apartment in Kadamwakabasti. Spacious balcony, modular kitchen, and quiet study environment.',
      status: 'ACTIVE',
    },
  });

  // 8. Contact Requests
  console.log('Seeding sample Contact Requests...');

  // Accepted Contact Request: Rohan -> Rahul on Listing 1 (Rahul's vacancy)
  // Since it is ACCEPTED, Rohan can view Rahul's private phone & Gmail, and Rahul can view Rohan's!
  await prisma.contactRequest.create({
    data: {
      senderId: rohan.id,
      receiverId: rahul.id,
      listingId: listing1.id,
      status: 'ACCEPTED',
      message: 'Hi Rahul! I am a 2nd year Mech student looking for a spot in your 2BHK flat near Gate 2. Can we coordinate a visit?',
    },
  });

  // Pending Contact Request: Aditya -> Rahul on Listing 1 (Private contact MUST remain hidden!)
  await prisma.contactRequest.create({
    data: {
      senderId: aditya.id,
      receiverId: rahul.id,
      listingId: listing1.id,
      status: 'PENDING',
      message: 'Hey Rahul, I saw your listing for the shared flat. I am interested in joining next month.',
    },
  });

  // 9. Notifications
  console.log('Seeding Notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: rahul.id,
        type: 'REQUEST_RECEIVED',
        title: 'New Contact Request',
        message: 'Aditya Verma (Aerospace Engineering • 3rd Year) requested contact details for your listing "1 Vacancy in 2BHK Flat near Gate 2".',
        link: '/inbox',
        isRead: false,
      },
      {
        userId: rohan.id,
        type: 'REQUEST_ACCEPTED',
        title: 'Contact Request Approved! 🎉',
        message: 'Rahul Sharma approved your contact request! You can now view his phone number and email in your Connected inbox.',
        link: '/inbox',
        isRead: false,
      },
    ],
  });

  // 10. Sample Report for Admin Moderation
  console.log('Seeding Sample Report...');
  await prisma.report.create({
    data: {
      reporterId: ananya.id,
      reportedUserId: aditya.id,
      listingId: listing5.id,
      reason: 'Spam',
      description: 'Testing report: Please verify student ID card submission.',
      status: 'PENDING',
    },
  });

  console.log('✅ MIT-ADT Roommate Finder database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
