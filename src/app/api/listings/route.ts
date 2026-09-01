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
    const sortBy = url.searchParams.get('sortBy') || 'newest';
    const includeDemo = url.searchParams.get('includeDemo') === 'true';
    const demoOnly = url.searchParams.get('demoOnly') === 'true';

    const demoFilter = demoOnly
      ? { isDemo: true }
      : includeDemo
      ? {}
      : { isDemo: false };

    const statusParam = url.searchParams.get('status');
    
    // Status Security Filter:
    // - Default (null): Public search returns only ACTIVE and VERIFIED listings.
    // - ALL: Returns all statuses (used by owner manage pages or admin).
    // - Specific status (e.g. ACTIVE, VERIFIED, PENDING_VERIFICATION, REJECTED).
    let statusCondition: any = undefined;
    if (statusParam === null || statusParam === '') {
      statusCondition = {
        OR: [
          { status: 'ACTIVE' },
          { status: 'VERIFIED' },
          { status: 'active' },
          { status: 'verified' },
        ],
      };
    } else if (statusParam.toUpperCase() === 'ALL') {
      statusCondition = undefined;
    } else {
      statusCondition = {
        OR: [
          { status: statusParam.toUpperCase() },
          { status: statusParam.toLowerCase() },
          { status: statusParam },
        ],
      };
    }

    const now = new Date();

    const listings = await prisma.listing.findMany({
      where: {
        ...demoFilter,
        ...(statusCondition ? statusCondition : {}),
        owner: {
          isActive: true,
          ...demoFilter,
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
                { address: { contains: q } },
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
        isDemo: l.owner.isDemo,
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
      isDemo,
    } = body;

    const parseSafeInt = (val: any, fallback: number = 0): number => {
      if (val === undefined || val === null || val === '') return fallback;
      const num = typeof val === 'number' ? val : parseInt(String(val).replace(/[^\d-]/g, ''), 10);
      return isNaN(num) ? fallback : num;
    };

    const parseSafeOptionalInt = (val: any): number | null => {
      if (val === undefined || val === null || val === '') return null;
      const num = typeof val === 'number' ? val : parseInt(String(val).replace(/[^\d-]/g, ''), 10);
      return isNaN(num) ? null : num;
    };

    if (!title?.trim() || !location?.trim() || rent === undefined || rent === null || rent === '' || !description?.trim()) {
      return NextResponse.json({ error: 'Please fill in all required fields (Title, Location, Rent, and Description)' }, { status: 400 });
    }

    const rentNum = parseSafeInt(rent, 0);
    const depositNum = parseSafeInt(deposit, 0);
    const occupantsNum = parseSafeInt(currentOccupants, 0);
    const vacanciesNum = Math.max(1, parseSafeInt(vacancies, 1));
    const capacityNum = Math.max(1, parseSafeInt(totalCapacity, occupantsNum + vacanciesNum));

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
    const isListingDemo = Boolean(isDemo) || Boolean((user as any).isDemo);

    // Initial status: PG and Flat listings default to PENDING_VERIFICATION
    const initialStatus = status || (accommodationType === 'PG' || accommodationType === 'Flat' ? 'PENDING_VERIFICATION' : 'ACTIVE');

    const listing = await prisma.listing.create({
      data: {
        ownerId: user.id,
        title: title.trim(),
        listingType: listingType || 'HAVE_VACANCY',
        accommodationType: accommodationType || 'Room',
        roomType: roomType || 'Single',
        location,
        address: address?.trim() || null,
        rent: rentNum,
        deposit: depositNum,
        singleRent: parseSafeOptionalInt(singleRent),
        doubleRent: parseSafeOptionalInt(doubleRent),
        tripleRent: parseSafeOptionalInt(tripleRent),
        maintenanceCharges: parseSafeInt(maintenanceCharges, 0),
        noticePeriod: noticePeriod || null,
        pgType: pgType || null,
        bedrooms: parseSafeOptionalInt(bedrooms),
        bathrooms: parseSafeOptionalInt(bathrooms),
        furnishing: furnishing || null,
        preferredTenant: preferredTenant || null,
        availableFrom: availableFrom || null,
        amenities: amenities || null,
        photos: photos || null,
        currentOccupants: occupantsNum,
        vacancies: vacanciesNum,
        totalCapacity: capacityNum,
        moveInDate: (moveInDate || availableFrom || 'Immediately').trim(),
        expiresAt,
        description: description.trim(),
        status: initialStatus,
        submittedAt: new Date(),
        isDemo: isListingDemo,
      },
    });

    return NextResponse.json({
      listing,
      message: initialStatus === 'PENDING_VERIFICATION'
        ? 'Listing submitted and is waiting for admin verification'
        : 'Accommodation listing published successfully',
    });
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
