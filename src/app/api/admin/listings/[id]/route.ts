import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const listingId = params.id;
    await prisma.listing.delete({
      where: { id: listingId },
    });

    return NextResponse.json({ success: true, message: 'Listing removed by administrator' });
  } catch (error) {
    console.error('Admin remove listing error:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
