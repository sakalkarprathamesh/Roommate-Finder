import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const listingId = params.id;
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    let newStatus = listing.status;
    let newExpiresAt = listing.expiresAt;

    if (action === 'mark_filled') {
      newStatus = 'FILLED';
    } else if (action === 'mark_active') {
      newStatus = 'ACTIVE';
    } else if (action === 'renew') {
      newStatus = 'ACTIVE';
      newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: newStatus,
        expiresAt: newExpiresAt,
      },
    });

    return NextResponse.json({
      listing: updated,
      message:
        action === 'renew'
          ? 'Listing renewed for 30 days'
          : action === 'mark_filled'
          ? 'Listing marked as filled'
          : 'Listing status updated',
    });
  } catch (error) {
    console.error('Update listing status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
