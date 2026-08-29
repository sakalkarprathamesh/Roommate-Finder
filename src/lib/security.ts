import prisma from './db';

/**
 * Validates whether the requesting user is authorized to view target user's private contact details
 * (Gmail, phone number, student ID).
 */
export async function canAccessPrivateContact(
  requesterUserId: string | null | undefined,
  targetUserId: string,
  listingId?: string
): Promise<boolean> {
  if (!requesterUserId) return false;

  // 1. Self access
  if (requesterUserId === targetUserId) return true;

  // 2. Admin access
  const requester = await prisma.user.findUnique({
    where: { id: requesterUserId },
    select: { role: true },
  });
  if (requester?.role === 'admin') return true;

  // 3. Accepted Contact Request check
  const acceptedRequest = await prisma.contactRequest.findFirst({
    where: {
      status: 'ACCEPTED',
      OR: [
        { senderId: requesterUserId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: requesterUserId },
      ],
      ...(listingId ? { listingId } : {}),
    },
  });

  return Boolean(acceptedRequest);
}

/**
 * Returns public-safe profile fields, omitting private contact details unless authorized.
 */
export function sanitizeProfile(profile: any, isAuthorized: boolean) {
  if (!profile) return null;

  return {
    id: profile.id,
    userId: profile.userId,
    name: profile.name,
    school: profile.school,
    department: profile.department,
    year: profile.year,
    division: profile.division,
    profilePhotoUrl: profile.profilePhotoUrl,
    bio: profile.bio,
    emailVerified: profile.emailVerified,
    studentVerified: profile.studentVerified,
    verificationStatus: profile.verificationStatus,
    role: profile.role,
    // Sensitive private fields strictly conditionally exposed:
    email: isAuthorized ? profile.email : undefined,
    phone: isAuthorized ? profile.phone : undefined,
    studentId: isAuthorized ? profile.studentId : undefined,
  };
}
