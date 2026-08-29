import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { sanitizeProfile } from '@/lib/security';

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [receivedRequests, sentRequests] = await Promise.all([
      prisma.contactRequest.findMany({
        where: { receiverId: user.id },
        include: {
          sender: { include: { profile: true } },
          listing: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.contactRequest.findMany({
        where: { senderId: user.id },
        include: {
          receiver: { include: { profile: true } },
          listing: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    // Format received requests
    const received = receivedRequests.map((r) => {
      const isAccepted = r.status === 'ACCEPTED';
      return {
        id: r.id,
        listingId: r.listingId,
        listingTitle: r.listing.title,
        listingLocation: r.listing.location,
        listingRent: r.listing.rent,
        status: r.status,
        message: r.message,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        sender: {
          id: r.sender.id,
          profile: sanitizeProfile(r.sender.profile, isAccepted),
        },
      };
    });

    // Format sent requests
    const sent = sentRequests.map((r) => {
      const isAccepted = r.status === 'ACCEPTED';
      return {
        id: r.id,
        listingId: r.listingId,
        listingTitle: r.listing.title,
        listingLocation: r.listing.location,
        listingRent: r.listing.rent,
        status: r.status,
        message: r.message,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        receiver: {
          id: r.receiver.id,
          profile: sanitizeProfile(r.receiver.profile, isAccepted),
        },
      };
    });

    // Connected list: all accepted requests (either sent or received)
    const connected: any[] = [];

    receivedRequests
      .filter((r) => r.status === 'ACCEPTED')
      .forEach((r) => {
        connected.push({
          id: r.id,
          listingId: r.listingId,
          listingTitle: r.listing.title,
          listingLocation: r.listing.location,
          listingRent: r.listing.rent,
          status: 'ACCEPTED',
          connectedAt: r.updatedAt,
          contact: {
            id: r.sender.id,
            profile: sanitizeProfile(r.sender.profile, true), // Fully authorized contact info
          },
          role: 'Requester',
        });
      });

    sentRequests
      .filter((r) => r.status === 'ACCEPTED')
      .forEach((r) => {
        connected.push({
          id: r.id,
          listingId: r.listingId,
          listingTitle: r.listing.title,
          listingLocation: r.listing.location,
          listingRent: r.listing.rent,
          status: 'ACCEPTED',
          connectedAt: r.updatedAt,
          contact: {
            id: r.receiver.id,
            profile: sanitizeProfile(r.receiver.profile, true), // Fully authorized contact info
          },
          role: 'Listing Owner',
        });
      });

    return NextResponse.json({
      received,
      sent,
      connected,
    });
  } catch (error) {
    console.error('Fetch contact requests error:', error);
    return NextResponse.json({ error: 'Failed to retrieve contact requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Please log in to request contact' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { listingId, message } = body;

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        owner: { include: { profile: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.ownerId === user.id) {
      return NextResponse.json({ error: 'You cannot send a contact request to your own listing' }, { status: 400 });
    }

    const existing = await prisma.contactRequest.findUnique({
      where: {
        senderId_listingId: {
          senderId: user.id,
          listingId: listing.id,
        },
      },
    });

    if (existing) {
      if (existing.status === 'PENDING') {
        return NextResponse.json({ error: 'You already have a pending contact request for this listing' }, { status: 400 });
      }
      if (existing.status === 'ACCEPTED') {
        return NextResponse.json({ error: 'Your contact request is already approved' }, { status: 400 });
      }

      // Re-activate if rejected or cancelled
      const reactivated = await prisma.contactRequest.update({
        where: { id: existing.id },
        data: {
          status: 'PENDING',
          message: message?.trim() || null,
          updatedAt: new Date(),
        },
      });

      await prisma.notification.create({
        data: {
          userId: listing.ownerId,
          type: 'REQUEST_RECEIVED',
          title: 'New Contact Request',
          message: `${user.profile?.name || 'A student'} requested contact for your listing "${listing.title}".`,
          link: '/inbox',
        },
      });

      return NextResponse.json({
        contactRequest: reactivated,
        message: 'Contact request sent successfully',
      });
    }

    const newRequest = await prisma.contactRequest.create({
      data: {
        senderId: user.id,
        receiverId: listing.ownerId,
        listingId: listing.id,
        status: 'PENDING',
        message: message?.trim() || null,
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.ownerId,
        type: 'REQUEST_RECEIVED',
        title: 'New Contact Request',
        message: `${user.profile?.name || 'A student'} (${user.profile?.department || 'MIT-ADT'}) requested contact for your listing "${listing.title}".`,
        link: '/inbox',
      },
    });

    return NextResponse.json({
      contactRequest: newRequest,
      message: 'Contact request sent successfully',
    });
  } catch (error) {
    console.error('Send contact request error:', error);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}
