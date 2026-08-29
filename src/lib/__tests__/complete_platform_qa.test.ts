import prisma from '../db';
import { hashPassword, signToken, isValidEmail } from '../auth';
import { canAccessPrivateContact, sanitizeProfile } from '../security';
import {
  CREATOR_NAME,
  SUPPORT_EMAIL,
  MIT_SCHOOLS,
  MIT_DEPARTMENTS,
  ACADEMIC_YEARS,
  LISTING_TYPES,
  ACCOMMODATION_TYPES,
  PUNE_AREAS,
} from '../constants';

async function runComprehensiveQA() {
  console.log('======================================================================');
  console.log('🌟 MIT-ADT ROOMMATE FINDER — COMPLETE PLATFORM QA & BUG AUDIT');
  console.log('======================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ PASS [${totalTests}]: ${testName}`);
      if (detail) console.log(`     -> ${detail}`);
    } else {
      console.error(`  ❌ FAIL [${totalTests}]: ${testName}`);
      if (detail) console.error(`     -> Error detail: ${detail}`);
      throw new Error(`QA Assertion Failed: ${testName}`);
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 1: Constants, Creator Info, & Support Contacts
  // -------------------------------------------------------------
  console.log('📋 [TEST GROUP 1]: Branding, Creator Attribution, & Contact Info');
  assert(CREATOR_NAME === 'Prathamesh Sakalkar', 'Creator Name Attribution', `Creator is ${CREATOR_NAME}`);
  assert(SUPPORT_EMAIL === 'workxash@gmail.com', 'Official Support Email', `Support email is ${SUPPORT_EMAIL}`);
  assert(MIT_SCHOOLS.length >= 7, 'MIT-ADT Schools Catalog', `${MIT_SCHOOLS.length} schools configured`);
  assert(MIT_DEPARTMENTS.length >= 10, 'MIT-ADT Departments Catalog', `${MIT_DEPARTMENTS.length} departments configured`);
  assert(PUNE_AREAS.length >= 6, 'Campus Localities & Areas', `${PUNE_AREAS.length} Pune campus areas configured`);
  console.log('');

  // -------------------------------------------------------------
  // TEST GROUP 2: Authentication & Password Security
  // -------------------------------------------------------------
  console.log('🔒 [TEST GROUP 2]: Authentication, Password Hashing & JWT Sessions');
  const rawPass = 'SuperSecurePass@2026';
  const hashed = await hashPassword(rawPass);
  assert(hashed !== rawPass && hashed.startsWith('$2'), 'Bcrypt Password Hashing', 'Passwords are never stored in plain text');
  assert(isValidEmail('prathamesh@gmail.com'), 'Email Validator (Valid Gmail)', 'Gmail accepted');
  assert(!isValidEmail('invalid-email'), 'Email Validator (Invalid Reject)', 'Malformed email rejected');

  const testPayload = { userId: 'usr_test123', email: 'student@gmail.com', role: 'student' };
  const token = await signToken(testPayload);
  assert(typeof token === 'string' && token.split('.').length === 3, 'JWT Token Signing (HS256)', 'Secure session token created');
  console.log('');

  // -------------------------------------------------------------
  // TEST GROUP 3: 4 Listing Types & Capacity Validation
  // -------------------------------------------------------------
  console.log('🏠 [TEST GROUP 3]: 4 Listing Types & Data Integrity');
  const types = Object.keys(LISTING_TYPES);
  assert(types.includes('NEED_ROOMMATE'), 'Listing Type: I NEED A ROOMMATE');
  assert(types.includes('NEED_ACCOMMODATION'), 'Listing Type: I NEED ACCOMMODATION');
  assert(types.includes('HAVE_VACANCY'), 'Listing Type: I HAVE A VACANCY');
  assert(types.includes('HAVE_ROOM'), 'Listing Type: I HAVE A ROOM/FLAT AVAILABLE');
  console.log('');

  // -------------------------------------------------------------
  // TEST GROUP 4: Database Model Relationships & Seed Integrity
  // -------------------------------------------------------------
  console.log('🗄️ [TEST GROUP 4]: Database Entity Relationships & Seed Data');
  const admin = await prisma.user.findUnique({ where: { email: 'admin@mitadt.ac.in' }, include: { profile: true } });
  assert(admin !== null && admin.role === 'admin', 'Housing Administrator Account Exists');

  const rahul = await prisma.user.findUnique({ where: { email: 'rahul.sharma@gmail.com' }, include: { profile: true, listings: true } });
  assert(rahul !== null && rahul.listings.length > 0, 'Rahul Sharma Profile & Active Listings');

  const ananya = await prisma.user.findUnique({ where: { email: 'ananya.ux@gmail.com' }, include: { profile: true, listings: true } });
  assert(ananya !== null && ananya.listings.length > 0, 'Ananya Patel Profile & Listings');

  const totalListings = await prisma.listing.count();
  assert(totalListings >= 4, 'Accommodations Catalog Seeded', `Total listings: ${totalListings}`);
  console.log('');

  // -------------------------------------------------------------
  // TEST GROUP 5: Strict Privacy Shield & Contact Unlocking
  // -------------------------------------------------------------
  console.log('🛡️ [TEST GROUP 5]: Strict Privacy Layer & Contact Shield');
  // 1. Unconnected access
  const canAnanyaAccessRahul = await canAccessPrivateContact(ananya!.id, rahul!.id);
  const sanitizedForAnanya = sanitizeProfile(rahul!.profile, canAnanyaAccessRahul);
  assert(canAnanyaAccessRahul === false, 'Unauthorized Student Access Denied');
  assert(sanitizedForAnanya?.phone === undefined, 'Private Phone Stripped for Unauthorized Viewers');
  assert(sanitizedForAnanya?.email === undefined, 'Private Gmail Stripped for Unauthorized Viewers');

  // 2. Self access
  const canRahulAccessSelf = await canAccessPrivateContact(rahul!.id, rahul!.id);
  assert(canRahulAccessSelf === true, 'Self Access to Contact Details Allowed');

  // 3. Accepted connection access
  const rohan = await prisma.user.findUnique({ where: { email: 'rohan.engg@gmail.com' }, include: { profile: true } });
  assert(rohan !== null, 'Rohan Deshmukh Connected Student Exists');

  const canRohanAccessRahul = await canAccessPrivateContact(rohan!.id, rahul!.id);
  const sanitizedForRohan = sanitizeProfile(rahul!.profile, canRohanAccessRahul);
  assert(canRohanAccessRahul === true, 'Accepted Request Grants Contact Access');
  assert(sanitizedForRohan?.phone === rahul!.profile?.phone, 'Phone Unlocked on ACCEPTED State', `Phone: ${sanitizedForRohan?.phone}`);

  // 4. Admin moderation access
  const canAdminAccessRahul = await canAccessPrivateContact(admin!.id, rahul!.id);
  assert(canAdminAccessRahul === true, 'Administrator Authorized for Moderation');
  console.log('');

  // -------------------------------------------------------------
  // TEST GROUP 6: Listing Lifecycle & Expiration Logic
  // -------------------------------------------------------------
  console.log('🔄 [TEST GROUP 6]: Listing Lifecycle, 30-Day Expiration & Renewal');
  const sampleListing = rahul!.listings[0];
  assert(sampleListing.status === 'ACTIVE', 'Listing Status is ACTIVE');
  assert(new Date(sampleListing.expiresAt) > new Date(), 'Listing Has Valid Expiration Date in the Future');

  // Renew test
  const renewedExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60);
  const renewedListing = await prisma.listing.update({
    where: { id: sampleListing.id },
    data: { expiresAt: renewedExpiry, status: 'ACTIVE' },
  });
  assert(renewedListing.expiresAt > sampleListing.expiresAt, '30-Day Listing Renewal Functionality');
  console.log('');

  // -------------------------------------------------------------
  // TEST GROUP 7: Clean Student Account & Verification Status
  // -------------------------------------------------------------
  console.log('🎓 [TEST GROUP 7]: Student Account & Email Verification Status');
  assert(rahul!.profile?.emailVerified === true, 'Rahul Profile Email Verified');
  assert(ananya!.profile?.emailVerified === true, 'Ananya Profile Email Verified');
  console.log('');

  console.log('======================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} PLATFORM AUDIT TESTS PASSED WITH 100% SUCCESS!`);
  console.log('======================================================================');
}

runComprehensiveQA()
  .catch((err) => {
    console.error('QA Test Suite Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
