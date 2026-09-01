export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Safely delete all related records in transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete sent messages
      await tx.message.deleteMany({ where: { senderId: user.id } });

      // 2. Delete contact requests
      await tx.contactRequest.deleteMany({
        where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      });

      // 3. Delete notifications
      await tx.notification.deleteMany({ where: { userId: user.id } });

      // 4. Delete reports
      await tx.report.deleteMany({
        where: { OR: [{ reporterId: user.id }, { reportedUserId: user.id }] },
      });

      // 5. Delete listings owned by user
      await tx.listing.deleteMany({ where: { ownerId: user.id } });

      // 6. Delete profile
      await tx.profile.deleteMany({ where: { userId: user.id } });

      // 7. Delete user account
      await tx.user.delete({ where: { id: user.id } });
    });

    const response = NextResponse.json({
      success: true,
      message: 'Your Roomie account has been permanently deleted.',
    });

    // Clear authentication cookie
    response.cookies.set({
      name: 'roomie_token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete account. Please try again.' },
      { status: 500 }
    );
  }
}
