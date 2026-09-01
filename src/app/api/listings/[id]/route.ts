import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { canAccessPrivateContact, sanitizeProfile } from '@/lib/security';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const listingId = params.id;
    const currentUser = await getAuthUserFromRequest(req);

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        owner: {
          include: { profile: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const isOwner = currentUser?.id === listing.ownerId;
    const isAuthorized = await canAccessPrivateContact(currentUser?.id, listing.ownerId, listing.id);

    let contactRequest = null;
    if (currentUser && !isOwner) {
      contactRequest = await prisma.contactRequest.findUnique({
        where: {
          senderId_listingId: {
            senderId: currentUser.id,
            listingId: listing.id,
          },
        },
      });
    }

    const responseListing = {
      ...listing,
      owner: {
        id: listing.owner.id,
        profile: sanitizeProfile(listing.owner.profile, isAuthorized),
      },
      isOwner,
      isAuthorizedContact: isAuthorized,
      contactRequestStatus: contactRequest ? contactRequest.status : null,
    };

    return NextResponse.json({ listing: responseListing });
  } catch (error) {
    console.error('Fetch listing error:', error);
    return NextResponse.json({ error: 'Failed to retrieve listing' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const listingId = params.id;
    const existing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existing.ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own listings' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      listingType,
      accommodationType,
      roomType,
      location,
      address,
      rent,
      deposit,
      singleRent,
      doubleRent,
      tripleRent,
      maintenanceCharges,
      noticePeriod,
      pgType,
      bedrooms,
      bathrooms,
      furnishing,
      preferredTenant,
      availableFrom,
      amenities,
      photos,
      currentOccupants,
      vacancies,
      totalCapacity,
      moveInDate,
      description,
      status,
    } = body;

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(listingType ? { listingType } : {}),
        ...(accommodationType ? { accommodationType } : {}),
        ...(roomType ? { roomType } : {}),
        ...(location ? { location } : {}),
        ...(address !== undefined ? { address: address?.trim() || null } : {}),
        ...(rent !== undefined ? { rent: parseInt(rent, 10) } : {}),
        ...(deposit !== undefined ? { deposit: parseInt(deposit, 10) } : {}),
        ...(singleRent !== undefined ? { singleRent: singleRent ? parseInt(singleRent, 10) : null } : {}),
        ...(doubleRent !== undefined ? { doubleRent: doubleRent ? parseInt(doubleRent, 10) : null } : {}),
        ...(tripleRent !== undefined ? { tripleRent: tripleRent ? parseInt(tripleRent, 10) : null } : {}),
        ...(maintenanceCharges !== undefined ? { maintenanceCharges: parseInt(maintenanceCharges, 10) } : {}),
        ...(noticePeriod !== undefined ? { noticePeriod } : {}),
        ...(pgType !== undefined ? { pgType } : {}),
        ...(bedrooms !== undefined ? { bedrooms: parseInt(bedrooms, 10) } : {}),
        ...(bathrooms !== undefined ? { bathrooms: parseInt(bathrooms, 10) } : {}),
        ...(furnishing !== undefined ? { furnishing } : {}),
        ...(preferredTenant !== undefined ? { preferredTenant } : {}),
        ...(availableFrom !== undefined ? { availableFrom } : {}),
        ...(amenities !== undefined ? { amenities } : {}),
        ...(photos !== undefined ? { photos } : {}),
        ...(currentOccupants !== undefined ? { currentOccupants: parseInt(currentOccupants, 10) } : {}),
        ...(vacancies !== undefined ? { vacancies: parseInt(vacancies, 10) } : {}),
        ...(totalCapacity !== undefined ? { totalCapacity: parseInt(totalCapacity, 10) } : {}),
        ...(moveInDate ? { moveInDate: moveInDate.trim() } : {}),
        ...(description ? { description: description.trim() } : {}),
        ...(status ? { status } : {}),
        // If owner is resubmitting, clear previous rejection reason
        ...(status === 'PENDING_VERIFICATION' ? { rejectionReason: null, submittedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ listing: updated, message: 'Listing updated successfully' });
  } catch (error) {
    console.error('Update listing error:', error);
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const listingId = params.id;
    const existing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (existing.ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own listings' }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
