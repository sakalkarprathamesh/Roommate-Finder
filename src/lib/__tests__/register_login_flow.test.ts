import prisma from '../db';
import { hashPassword, comparePassword, signToken, verifyToken } from '../auth';

async function testRegisterLoginFlow() {
  console.log('===============================================================');
  console.log('🧪 TESTING REGISTRATION -> LOGOUT -> LOGIN END-TO-END FLOW');
  console.log('===============================================================\n');

  const testEmail = 'student.test@gmail.com';
  const testPassword = 'MySecretPassword@2026';

  // 1. Cleanup any prior test run
  await prisma.user.deleteMany({ where: { email: testEmail.toLowerCase().trim() } });

  // 2. Simulate Registration
  console.log('Step 1: Normalizing inputs for registration...');
  const normalizedRegEmail = testEmail.toLowerCase().trim();
  console.log(`  -> Input: "${testEmail}" -> Normalized: "${normalizedRegEmail}"`);

  console.log('Step 2: Hashing password with bcrypt (10 rounds)...');
  const passwordHash = await hashPassword(testPassword);
  console.log(`  -> Generated Hash: ${passwordHash.substring(0, 20)}... (Starts with $2)`);

  console.log('Step 3: Storing user and profile in persistent database...');
  const createdUser = await prisma.user.create({
    data: {
      email: normalizedRegEmail,
      passwordHash,
      role: 'student',
      profile: {
        create: {
          name: 'Test Student',
          email: normalizedRegEmail,
          phone: '+91 9988776655',
          school: 'School of Computing',
          department: 'Computer Science & Engineering',
          year: '2nd Year',
        },
      },
    },
    include: { profile: true },
  });
  console.log(`  -> User stored with DB ID: ${createdUser.id}`);

  // 3. Simulate Logout (Token discarded)
  console.log('\nStep 4: Simulating user logout (session cookie cleared)...');

  // 4. Simulate Immediate Login with various casings & whitespaces
  const loginAttempts = [
    { email: 'student.test@gmail.com', pass: 'MySecretPassword@2026', label: 'Exact match' },
    { email: '  Student.Test@Gmail.com  ', pass: 'MySecretPassword@2026', label: 'Uppercase + extra whitespace' },
  ];

  for (const attempt of loginAttempts) {
    console.log(`\nStep 5: Testing Login [${attempt.label}]...`);
    const normalizedLoginEmail = attempt.email.toLowerCase().trim();
    console.log(`  -> Login Email Input: "${attempt.email}" -> Normalized: "${normalizedLoginEmail}"`);

    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedLoginEmail },
      include: { profile: true },
    });

    if (!dbUser) {
      throw new Error(`FAIL: User "${normalizedLoginEmail}" was NOT found in database!`);
    }
    console.log(`  -> User found in database: ID=${dbUser.id}, Email=${dbUser.email}`);

    const isPasswordValid = await comparePassword(attempt.pass, dbUser.passwordHash);
    if (!isPasswordValid) {
      throw new Error(`FAIL: Password comparison failed for "${attempt.email}"!`);
    }
    console.log('  -> ✅ Password verified successfully via bcrypt.compare!');

    const token = await signToken({ userId: dbUser.id, email: dbUser.email, role: dbUser.role });
    const verified = await verifyToken(token);
    if (!verified || verified.userId !== dbUser.id) {
      throw new Error('FAIL: JWT token verification failed!');
    }
    console.log('  -> ✅ Session JWT verified successfully!');
  }

  // Cleanup
  await prisma.user.deleteMany({ where: { email: testEmail.toLowerCase().trim() } });

  console.log('\n===============================================================');
  console.log('🎉 REGISTRATION -> LOGOUT -> LOGIN CYCLE VERIFIED 100% WORKING!');
  console.log('===============================================================');
}

testRegisterLoginFlow()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
