import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const targetUserId = params.id;
    const body = await req.json();
    const { isActive } = body;

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive },
      include: { profile: true },
    });

    return NextResponse.json({
      user: updated,
      message: isActive ? 'User account reactivated' : 'User account suspended',
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  }
}
