import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const listingId = params.id;
    const body = await req.json();
    const { action, connectionId } = body;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        owner: { include: { profile: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // -------------------------------------------------------------
    // ACTION 1: REQUEST OCCUPANCY (User A marks space as occupied)
    // -------------------------------------------------------------
    if (action === 'request_occupy') {
      if (!connectionId) {
        return NextResponse.json({ error: 'Connection ID is required' }, { status: 400 });
      }

      const connection = await prisma.contactRequest.findUnique({
        where: { id: connectionId },
        include: {
          sender: { include: { profile: true } },
          receiver: { include: { profile: true } },
        },
      });

      if (!connection || connection.listingId !== listingId) {
        return NextResponse.json({ error: 'Invalid connection for this listing' }, { status: 404 });
      }

      if (connection.status !== 'ACCEPTED') {
        return NextResponse.json(
          { error: 'Cannot mark as occupied without an active accepted connection' },
          { status: 400 }
        );
      }

      const isParticipant = connection.senderId === user.id || connection.receiverId === user.id;
      if (!isParticipant && user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const partnerId = connection.senderId === user.id ? connection.receiverId : connection.senderId;

      // Update connection and listing to pending confirmation
      await prisma.contactRequest.update({
        where: { id: connection.id },
        data: {
          occupancyStatus: 'PENDING_CONFIRMATION',
          occupancyInitiatorId: user.id,
        },
      });

      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: {
          occupiedInitiatorId: user.id,
          occupiedPartnerId: partnerId,
          occupiedRequestId: connection.id,
        },
      });

      // Send confirmation prompt notification to partner
      await prisma.notification.create({
        data: {
          userId: partnerId,
          type: 'OCCUPANCY_REQUEST',
          title: 'Occupancy Confirmation Request',
          message: `${user.profile?.name || 'A student'} marked the space as occupied with you for "${listing.title}". Has this space actually been taken?`,
          link: '/inbox',
        },
      });

      return NextResponse.json({
        listing: updatedListing,
        message: 'Occupancy confirmation request sent. Waiting for partner to confirm.',
      });
    }

    // -------------------------------------------------------------
    // ACTION 2: CONFIRM OCCUPANCY (User B confirms)
    // -------------------------------------------------------------
    if (action === 'confirm_occupy') {
      if (!connectionId) {
        return NextResponse.json({ error: 'Connection ID is required' }, { status: 400 });
      }

      const connection = await prisma.contactRequest.findUnique({
        where: { id: connectionId },
        include: {
          sender: { include: { profile: true } },
          receiver: { include: { profile: true } },
        },
      });

      if (!connection || connection.listingId !== listingId) {
        return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
      }

      const isParticipant = connection.senderId === user.id || connection.receiverId === user.id;
      if (!isParticipant && user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Mark listing as OCCUPIED, record confirmation timestamp and 5-minute undo window
      const now = new Date();
      const undoUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

      await prisma.contactRequest.update({
        where: { id: connection.id },
        data: {
          occupancyStatus: 'CONFIRMED',
        },
      });

      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: {
          status: 'OCCUPIED',
          occupiedConfirmedAt: now,
          occupiedUndoUntil: undoUntil,
          occupiedConfirmedBy: user.id,
        },
      });

      const initiatorId = connection.occupancyInitiatorId || (connection.senderId === user.id ? connection.receiverId : connection.senderId);

      // Notify initiator
      await prisma.notification.create({
        data: {
          userId: initiatorId,
          type: 'OCCUPANCY_CONFIRMED',
          title: 'Space Confirmed as Occupied! 🏠',
          message: `${user.profile?.name || 'Your roommate'} confirmed the space is occupied for "${listing.title}".`,
          link: '/inbox',
        },
      });

      return NextResponse.json({
        listing: updatedListing,
        undoUntil: undoUntil.toISOString(),
        message: 'Space marked as occupied successfully! Both parties have confirmed.',
      });
    }

    // -------------------------------------------------------------
    // ACTION 3: DECLINE OCCUPANCY (User B selects "Not yet")
    // -------------------------------------------------------------
    if (action === 'decline_occupy') {
      if (connectionId) {
        await prisma.contactRequest.update({
          where: { id: connectionId },
          data: {
            occupancyStatus: null,
            occupancyInitiatorId: null,
          },
        });
      }

      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: {
          occupiedInitiatorId: null,
          occupiedPartnerId: null,
          occupiedRequestId: null,
        },
      });

      return NextResponse.json({
        listing: updatedListing,
        message: 'Occupancy confirmation declined. Listing remains active.',
      });
    }

    // -------------------------------------------------------------
    // ACTION 4: UNDO OCCUPANCY (Within 5 minutes of confirmation)
    // -------------------------------------------------------------
    if (action === 'undo_occupy') {
      const isParticipant =
        listing.ownerId === user.id ||
        listing.occupiedInitiatorId === user.id ||
        listing.occupiedPartnerId === user.id ||
        listing.occupiedConfirmedBy === user.id;

      if (!isParticipant && user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const now = new Date();
      if (!listing.occupiedUndoUntil || now > new Date(listing.occupiedUndoUntil)) {
        return NextResponse.json(
          { error: 'The 5-minute undo window has expired. Only the listing owner can reopen this listing.' },
          { status: 400 }
        );
      }

      // Revert listing to ACTIVE
      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
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

      if (listing.occupiedRequestId) {
        await prisma.contactRequest.update({
          where: { id: listing.occupiedRequestId },
          data: {
            occupancyStatus: null,
            occupancyInitiatorId: null,
          },
        });
      }

      return NextResponse.json({
        listing: updatedListing,
        message: 'Occupancy undone. Listing is active and visible in search results again.',
      });
    }

    // -------------------------------------------------------------
    // ACTION 5: REOPEN LISTING (Owner only, after undo window or anytime)
    // -------------------------------------------------------------
    if (action === 'reopen') {
      if (listing.ownerId !== user.id && user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only the original listing owner can reopen this listing.' },
          { status: 403 }
        );
      }

      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
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

      if (listing.occupiedRequestId) {
        await prisma.contactRequest.update({
          where: { id: listing.occupiedRequestId },
          data: {
            occupancyStatus: null,
            occupancyInitiatorId: null,
          },
        });
      }

      return NextResponse.json({
        listing: updatedListing,
        message: 'Listing reopened successfully! It is now active in search results.',
      });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    console.error('Occupancy action error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to perform occupancy action' }, { status: 500 });
  }
}
