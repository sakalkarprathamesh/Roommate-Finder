export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const occupiedListingsCount = await prisma.listing.count({
      where: {
        OR: [
          { status: 'OCCUPIED' },
          { status: 'FILLED' },
        ],
      },
    });

    const activeListingsCount = await prisma.listing.count({
      where: {
        status: 'ACTIVE',
      },
    });

    // Each occupied space represents matched student connections
    const matchedStudentsCount = occupiedListingsCount > 0 ? occupiedListingsCount * 2 : 0;

    return NextResponse.json({
      occupiedListingsCount,
      matchedStudentsCount,
      activeListingsCount,
    });
  } catch (error) {
    console.error('Fetch public stats error:', error);
    return NextResponse.json({
      occupiedListingsCount: 0,
      matchedStudentsCount: 0,
      activeListingsCount: 0,
    });
  }
}
