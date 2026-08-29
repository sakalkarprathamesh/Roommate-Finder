import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { canAccessPrivateContact, sanitizeProfile } from '@/lib/security';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const targetUserId = params.id;
    const currentUser = await getAuthUserFromRequest(req);

    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [{ id: targetUserId }, { profile: { id: targetUserId } }],
        isActive: true,
      },
      include: { profile: true },
    });

    if (!targetUser || !targetUser.profile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const isAuthorized = await canAccessPrivateContact(currentUser?.id, targetUser.id);
    const publicProfile = sanitizeProfile(targetUser.profile, isAuthorized);

    return NextResponse.json({
      profile: publicProfile,
      isAuthorizedContact: isAuthorized,
    });
  } catch (error) {
    console.error('Fetch profile details error:', error);
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}
