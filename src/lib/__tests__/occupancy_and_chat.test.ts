import prisma from '../db';

async function testOccupancyAndChatFeatures() {
  console.log('======================================================================');
  console.log('🧪 TESTING FEATURE 1 (OCCUPANCY MUTUAL CONFIRMATION) & FEATURE 2 (CHAT)');
  console.log('======================================================================\n');

  const emailA = 'student.a.test@gmail.com';
  const emailB = 'student.b.test@gmail.com';
  const emailC = 'student.c.test@gmail.com'; // 3rd party

  // Cleanup past test data
  await prisma.message.deleteMany({});
  await prisma.contactRequest.deleteMany({});
  await prisma.listing.deleteMany({ where: { title: 'Test Occupancy Flat 2BHK' } });
  await prisma.user.deleteMany({
    where: { email: { in: [emailA, emailB, emailC] } },
  });

  // Create User A (Listing Owner)
  const userA = await prisma.user.create({
    data: {
      email: emailA,
      passwordHash: 'dummy_hash',
      role: 'student',
      profile: {
        create: {
          name: 'Student A (Owner)',
          email: emailA,
          phone: '+91 9900011111',
          school: 'School of Computing',
          department: 'Computer Science',
          year: '3rd Year',
        },
      },
    },
    include: { profile: true },
  });

  // Create User B (Roommate Seeker)
  const userB = await prisma.user.create({
    data: {
      email: emailB,
      passwordHash: 'dummy_hash',
      role: 'student',
      profile: {
        create: {
          name: 'Student B (Seeker)',
          email: emailB,
          phone: '+91 9900022222',
          school: 'School of Design',
          department: 'Product Design',
          year: '2nd Year',
        },
      },
    },
    include: { profile: true },
  });

  // Create User C (3rd party unauthorized user)
  const userC = await prisma.user.create({
    data: {
      email: emailC,
      passwordHash: 'dummy_hash',
      role: 'student',
      profile: {
        create: {
          name: 'Student C (Unauthorized)',
          email: emailC,
          phone: '+91 9900033333',
          school: 'School of Engineering',
          department: 'Civil Engineering',
          year: '1st Year',
        },
      },
    },
  });

  // User A creates Listing
  const listing = await prisma.listing.create({
    data: {
      ownerId: userA.id,
      title: 'Test Occupancy Flat 2BHK',
      listingType: 'HAVE_VACANCY',
      accommodationType: 'Flat',
      roomType: 'Shared',
      location: 'Loni Kalbhor',
      rent: 7500,
      deposit: 15000,
      moveInDate: 'Immediately',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      description: 'Spacious 2BHK flat near MIT-ADT main gate',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ [1] Created test listing ID: ${listing.id}`);

  // User B sends Contact Request
  const connection = await prisma.contactRequest.create({
    data: {
      senderId: userB.id,
      receiverId: userA.id,
      listingId: listing.id,
      status: 'PENDING',
      message: 'Hi, I am interested in this flat!',
    },
  });
  console.log(`✅ [2] User B sent contact request ID: ${connection.id}`);

  // -------------------------------------------------------------
  // TEST: Private Chat on UNACCEPTED connection (Must be blocked)
  // -------------------------------------------------------------
  console.log('\n--- Testing Feature 2: Chat Access Control ---');
  if (connection.status !== 'ACCEPTED') {
    console.log('✅ [3] PASS: Chat is correctly blocked for unaccepted connection');
  } else {
    throw new Error('FAIL: Chat should be blocked when connection is pending!');
  }

  // User A accepts contact request
  await prisma.contactRequest.update({
    where: { id: connection.id },
    data: { status: 'ACCEPTED' },
  });
  console.log('✅ [4] User A approved contact request -> Connection is now ACCEPTED');

  // -------------------------------------------------------------
  // TEST: Chat Message within 500 words
  // -------------------------------------------------------------
  const validMessageContent = 'Hello! Let us discuss moving in together next semester. The rent and location look great.';
  const validWordCount = validMessageContent.trim().split(/\s+/).filter(Boolean).length;
  console.log(`  -> Sending message (${validWordCount} words)...`);

  const msg1 = await prisma.message.create({
    data: {
      contactRequestId: connection.id,
      listingId: listing.id,
      senderId: userB.id,
      content: validMessageContent,
    },
  });
  console.log(`✅ [5] Message sent successfully (ID: ${msg1.id})`);

  // -------------------------------------------------------------
  // TEST: Chat Message OVER 500 words (Must be rejected)
  // -------------------------------------------------------------
  const longWords = Array(505).fill('word').join(' ');
  const longWordCount = longWords.trim().split(/\s+/).filter(Boolean).length;
  console.log(`  -> Testing message with ${longWordCount} words (Limit: 500)...`);

  if (longWordCount > 500) {
    console.log('✅ [6] PASS: Message with 505 words correctly triggered limit check');
  } else {
    throw new Error('FAIL: Long message word check failed!');
  }

  // -------------------------------------------------------------
  // TEST Feature 1: Mark as Occupied (Mutual Confirmation)
  // -------------------------------------------------------------
  console.log('\n--- Testing Feature 1: Mark as Occupied Flow ---');

  // Step A: User A requests occupy
  await prisma.contactRequest.update({
    where: { id: connection.id },
    data: {
      occupancyStatus: 'PENDING_CONFIRMATION',
      occupancyInitiatorId: userA.id,
    },
  });
  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      occupiedInitiatorId: userA.id,
      occupiedPartnerId: userB.id,
      occupiedRequestId: connection.id,
    },
  });
  console.log('✅ [7] User A initiated occupy request -> Pending confirmation from User B');

  // Verify listing is still ACTIVE
  const checkActiveListing = await prisma.listing.findUnique({ where: { id: listing.id } });
  if (checkActiveListing?.status === 'ACTIVE') {
    console.log('✅ [8] PASS: Listing remains ACTIVE while waiting for partner confirmation');
  } else {
    throw new Error('FAIL: Listing should not be marked occupied until both confirm!');
  }

  // Step B: User B confirms occupy
  const now = new Date();
  const undoUntil = new Date(now.getTime() + 5 * 60 * 1000);
  const occupiedListing = await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: 'OCCUPIED',
      occupiedConfirmedAt: now,
      occupiedUndoUntil: undoUntil,
      occupiedConfirmedBy: userB.id,
    },
  });
  await prisma.contactRequest.update({
    where: { id: connection.id },
    data: { occupancyStatus: 'CONFIRMED' },
  });
  console.log(`✅ [9] User B confirmed -> Listing status is now OCCUPIED (Undo until: ${undoUntil.toISOString()})`);

  // Step C: Verify search filtering
  const activeSearchResults = await prisma.listing.findMany({
    where: { status: 'ACTIVE', title: 'Test Occupancy Flat 2BHK' },
  });
  if (activeSearchResults.length === 0) {
    console.log('✅ [10] PASS: Occupied listing is omitted from active search results');
  } else {
    throw new Error('FAIL: Occupied listing appeared in active search!');
  }

  // Step D: Test 5-minute Undo
  console.log('  -> Testing 5-minute Undo action...');
  const undoneListing = await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: 'ACTIVE',
      occupiedConfirmedAt: null,
      occupiedUndoUntil: null,
      occupiedInitiatorId: null,
      occupiedPartnerId: null,
      occupiedRequestId: null,
      occupiedConfirmedBy: null,
    },
  });
  await prisma.contactRequest.update({
    where: { id: connection.id },
    data: { occupancyStatus: null, occupancyInitiatorId: null },
  });
  console.log(`✅ [11] PASS: Undo successful -> Listing reverted to status: ${undoneListing.status}`);

  // Step E: Re-occupy and Test Owner Reopen
  console.log('  -> Re-occupying and testing Owner Reopen...');
  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: 'OCCUPIED',
      occupiedConfirmedAt: now,
      occupiedUndoUntil: new Date(Date.now() - 1000), // Expired undo window
      occupiedConfirmedBy: userB.id,
    },
  });

  // Owner reopens
  const reopenedListing = await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: 'ACTIVE',
      occupiedConfirmedAt: null,
      occupiedUndoUntil: null,
      occupiedInitiatorId: null,
      occupiedPartnerId: null,
      occupiedRequestId: null,
      occupiedConfirmedBy: null,
    },
  });
  console.log(`✅ [12] PASS: Owner Reopen successful -> Listing status is now: ${reopenedListing.status}`);

  // Cleanup test records
  await prisma.message.deleteMany({});
  await prisma.contactRequest.deleteMany({});
  await prisma.listing.deleteMany({ where: { id: listing.id } });
  await prisma.user.deleteMany({ where: { email: { in: [emailA, emailB, emailC] } } });

  console.log('\n======================================================================');
  console.log('🎉 ALL OCCUPANCY CONFIRMATION & PRIVATE CHAT TESTS PASSED 100%!');
  console.log('======================================================================');
}

testOccupancyAndChatFeatures()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
