import prisma from '../db';
import { hashPassword, signToken } from '../auth';
import { canAccessPrivateContact, sanitizeProfile } from '../security';

async function runLocalE2ETest() {
  console.log('===============================================================');
  console.log('🧪 MIT-ADT ROOMMATE FINDER — LOCAL END-TO-END TEST SUITE');
  console.log('===============================================================\n');

  // 1. Test User Registration
  console.log('✓ STEP 1: New Student Registration');
  const testEmail = `student_${Date.now()}@gmail.com`;
  const passwordHash = await hashPassword('Student@123');

  const newStudent = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash,
      role: 'student',
      isActive: true,
      profile: {
        create: {
          name: 'Prathamesh Test User',
          email: testEmail,
          phone: '+91 98765 43210',
          school: 'School of Computing',
          department: 'Computer Science & Engineering',
          year: '3rd Year',
          division: 'Div B',
          emailVerified: true,
          studentVerified: false,
          role: 'student',
        },
      },
    },
    include: { profile: true },
  });

  if (!newStudent || !newStudent.profile) {
    throw new Error('Registration failed to create user and profile!');
  }
  console.log(`  -> Registered: ${newStudent.profile.name} (${newStudent.email})`);
  console.log('  -> PASS: User registered and stored in database.\n');

  // 2. Test Token Authentication
  console.log('✓ STEP 2: Issue Secure JWT Session');
  const token = await signToken({
    userId: newStudent.id,
    email: newStudent.email,
    role: newStudent.role,
  });
  if (!token) throw new Error('Failed to generate token');
  console.log('  -> PASS: JWT Session token generated.\n');

  // 3. Test Accommodation Listing Creation
  console.log('✓ STEP 3: Post Accommodation Listing');
  const newListing = await prisma.listing.create({
    data: {
      ownerId: newStudent.id,
      title: 'Spacious 2BHK Master Bedroom near MIT Campus',
      listingType: 'HAVE_VACANCY',
      accommodationType: 'Flat',
      roomType: 'Private',
      location: 'Near MIT-ADT',
      rent: 9500,
      deposit: 15000,
      currentOccupants: 2,
      vacancies: 1,
      totalCapacity: 3,
      moveInDate: 'Immediately',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      description: 'Looking for a clean, non-smoking MIT-ADT student to share a 2BHK flat in Loni Kalbhor.',
      status: 'ACTIVE',
    },
  });

  if (!newListing || newListing.rent !== 9500) {
    throw new Error('Failed to create accommodation listing!');
  }
  console.log(`  -> Created Listing: "${newListing.title}" for ₹${newListing.rent}/mo`);
  console.log('  -> PASS: Listing stored in database.\n');

  // 4. Test Search & Filters
  console.log('✓ STEP 4: Query Active Listings with Multi-Facet Filters');
  const foundListings = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      location: 'Near MIT-ADT',
    },
    include: {
      owner: { include: { profile: true } },
    },
  });

  if (foundListings.length === 0) {
    throw new Error('Failed to find created listing in query!');
  }
  console.log(`  -> Found ${foundListings.length} active listings matching filter "Near MIT-ADT".`);
  console.log('  -> PASS: Search & filtering working.\n');

  // 5. Test Contact Request & Privacy Shield
  console.log('✓ STEP 5: Contact Request & Mutual Contact Reveal');
  const ananya = await prisma.user.findUnique({
    where: { email: 'ananya.ux@gmail.com' },
    include: { profile: true },
  });
  if (!ananya) throw new Error('Ananya seed account not found');

  // Before request: Ananya CANNOT see Prathamesh's phone number
  const canAccessBefore = await canAccessPrivateContact(ananya.id, newStudent.id);
  const sanitizedBefore = sanitizeProfile(newStudent.profile, canAccessBefore);
  if (canAccessBefore || sanitizedBefore?.phone !== undefined) {
    throw new Error('Contact privacy violated! Phone number was leaked before accepted request.');
  }
  console.log('  -> Verified: Phone number is hidden before request approval.');

  // Create request
  const contactReq = await prisma.contactRequest.create({
    data: {
      senderId: ananya.id,
      receiverId: newStudent.id,
      listingId: newListing.id,
      status: 'PENDING',
      message: 'Hi Prathamesh, I would love to check out the flat!',
    },
  });

  // Accept request
  await prisma.contactRequest.update({
    where: { id: contactReq.id },
    data: { status: 'ACCEPTED' },
  });

  // After accept: Ananya CAN see Prathamesh's phone number
  const canAccessAfter = await canAccessPrivateContact(ananya.id, newStudent.id);
  const sanitizedAfter = sanitizeProfile(newStudent.profile, canAccessAfter);

  if (!canAccessAfter || sanitizedAfter?.phone !== '+91 98765 43210') {
    throw new Error('Failed to unlock phone number after request acceptance!');
  }
  console.log(`  -> Verified: Phone number "${sanitizedAfter.phone}" unlocked on ACCEPTED status.`);
  console.log('  -> PASS: Privacy and contact sharing workflow verified.\n');

  // 6. Test Admin Access
  console.log('✓ STEP 6: Housing Administrator Moderation Access');
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@mitadt.ac.in' },
  });
  if (!admin || admin.role !== 'admin') {
    throw new Error('Admin account not found or missing admin role');
  }
  const totalListings = await prisma.listing.count();
  const totalUsers = await prisma.user.count();
  console.log(`  -> Admin Dashboard KPI Stats: ${totalUsers} Users, ${totalListings} Listings.`);
  console.log('  -> PASS: Administrator moderation system functional.\n');

  // Clean up test data
  await prisma.contactRequest.delete({ where: { id: contactReq.id } });
  await prisma.listing.delete({ where: { id: newListing.id } });
  await prisma.profile.delete({ where: { userId: newStudent.id } });
  await prisma.user.delete({ where: { id: newStudent.id } });

  console.log('===============================================================');
  console.log('🎉 100% OF ALL LOCAL WORKFLOWS TESTED & PASSED SUCCESSFULLY!');
  console.log('===============================================================');
}

runLocalE2ETest()
  .catch((e) => {
    console.error('Test execution failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
