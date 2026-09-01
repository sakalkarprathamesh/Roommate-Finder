export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  try {
    const listings = await prisma.listing.findMany({
      where: {
        OR: [
          { status: 'PENDING_VERIFICATION' },
          { status: 'REJECTED' },
          { status: 'VERIFIED' },
        ],
      },
      include: {
        owner: {
          include: { profile: true },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ verifications: listings });
  } catch (error) {
    console.error('Fetch verifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch verification listings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { listingId, action, rejectionReason } = body;

    if (!listingId || !action) {
      return NextResponse.json({ error: 'Missing listingId or action' }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      const updated = await prisma.listing.update({
        where: { id: listingId },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
          verifiedBy: user.id,
          rejectionReason: null,
        },
      });

      // Send approval notification to owner
      await prisma.notification.create({
        data: {
          userId: listing.ownerId,
          type: 'VERIFICATION_STATUS',
          title: '🎉 Listing Verified & Published!',
          message: `Your accommodation "${listing.title}" has been verified by the admin team and is now live on Roomie.`,
          link: listing.accommodationType === 'PG' ? '/manage/pg' : '/manage/flat',
        },
      });

      return NextResponse.json({
        success: true,
        listing: updated,
        message: 'Listing verified and made publicly visible',
      });
    }

    if (action === 'REJECT') {
      if (!rejectionReason || !rejectionReason.trim()) {
        return NextResponse.json({ error: 'Please provide a clear reason for rejection' }, { status: 400 });
      }

      const updated = await prisma.listing.update({
        where: { id: listingId },
        data: {
          status: 'REJECTED',
          rejectionReason: rejectionReason.trim(),
          verifiedAt: new Date(),
          verifiedBy: user.id,
        },
      });

      // Send rejection notification with reason to owner
      await prisma.notification.create({
        data: {
          userId: listing.ownerId,
          type: 'VERIFICATION_STATUS',
          title: '⚠️ Listing Verification Update',
          message: `Your listing "${listing.title}" requires revisions: ${rejectionReason.trim()}. Please edit and resubmit.`,
          link: listing.accommodationType === 'PG' ? '/manage/pg' : '/manage/flat',
        },
      });

      return NextResponse.json({
        success: true,
        listing: updated,
        message: 'Listing marked as rejected with reason',
      });
    }

    return NextResponse.json({ error: 'Invalid action. Must be APPROVE or REJECT' }, { status: 400 });
  } catch (error) {
    console.error('Process verification error:', error);
    return NextResponse.json({ error: 'Failed to process verification' }, { status: 500 });
  }
}
