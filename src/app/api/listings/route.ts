export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';
import { sanitizeProfile } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q')?.toLowerCase().trim() || '';
    const listingType = url.searchParams.get('listingType') || '';
    const accommodationType = url.searchParams.get('accommodationType') || '';
    const roomType = url.searchParams.get('roomType') || '';
    const location = url.searchParams.get('location') || '';
    const school = url.searchParams.get('school') || '';
    const department = url.searchParams.get('department') || '';
    const year = url.searchParams.get('year') || '';
    const minRent = parseInt(url.searchParams.get('minRent') || '0', 10);
    const maxRent = parseInt(url.searchParams.get('maxRent') || '999999', 10);
    const status = url.searchParams.get('status') || 'ACTIVE';
    const sortBy = url.searchParams.get('sortBy') || 'newest';

    const now = new Date();

    const listings = await prisma.listing.findMany({
      where: {
        status,
        ...(status === 'ACTIVE' ? { expiresAt: { gte: now } } : {}),
        owner: {
          isActive: true,
          profile: {
            ...(school ? { school } : {}),
            ...(department ? { department } : {}),
            ...(year ? { year } : {}),
          },
        },
        ...(listingType ? { listingType } : {}),
        ...(accommodationType ? { accommodationType } : {}),
        ...(roomType ? { roomType } : {}),
        ...(location ? { location: { contains: location } } : {}),
        ...(minRent > 0 ? { rent: { gte: minRent } } : {}),
        ...(maxRent < 999999 ? { rent: { lte: maxRent } } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { description: { contains: q } },
                { location: { contains: q } },
                { owner: { profile: { name: { contains: q } } } },
              ],
            }
          : {}),
      },
      include: {
        owner: {
          include: { profile: true },
        },
      },
      orderBy:
        sortBy === 'rent_asc'
          ? { rent: 'asc' }
          : sortBy === 'rent_desc'
          ? { rent: 'desc' }
          : { createdAt: 'desc' },
    });

    const sanitizedListings = listings.map((l) => ({
      ...l,
      owner: {
        id: l.owner.id,
        profile: sanitizeProfile(l.owner.profile, false),
      },
    }));

    return NextResponse.json({
      listings: sanitizedListings,
      total: sanitizedListings.length,
    });
  } catch (error) {
    console.error('Fetch listings error:', error);
    return NextResponse.json({ error: 'Failed to retrieve listings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Please log in to post a listing' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      listingType,
      accommodationType,
      roomType,
      location,
      rent,
      deposit,
      currentOccupants,
      vacancies,
      totalCapacity,
      moveInDate,
      description,
    } = body;

    if (!title || !listingType || !accommodationType || !roomType || !location || !rent || !moveInDate || !description) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    const rentNum = parseInt(rent, 10);
    const depositNum = parseInt(deposit || '0', 10);
    const occupantsNum = parseInt(currentOccupants || '0', 10);
    const vacanciesNum = parseInt(vacancies || '1', 10);
    const capacityNum = parseInt(totalCapacity || '1', 10);

    if (rentNum < 0 || depositNum < 0 || occupantsNum < 0 || vacanciesNum < 0 || capacityNum < 1) {
      return NextResponse.json({ error: 'Values cannot be negative, and capacity must be at least 1' }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    const listing = await prisma.listing.create({
      data: {
        ownerId: user.id,
        title: title.trim(),
        listingType,
        accommodationType,
        roomType,
        location,
        rent: rentNum,
        deposit: depositNum,
        currentOccupants: occupantsNum,
        vacancies: vacanciesNum,
        totalCapacity: capacityNum,
        moveInDate: moveInDate.trim(),
        expiresAt,
        description: description.trim(),
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      listing,
      message: 'Accommodation listing published successfully',
    });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
