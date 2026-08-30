export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Administrator privileges required' }, { status: 403 });
  }

  try {
    const [totalUsers, activeListings, totalOccupied, pendingReports, totalRequests, acceptedRequests] =
      await Promise.all([
        prisma.user.count(),
        prisma.listing.count({ where: { status: 'ACTIVE' } }),
        prisma.listing.count({ where: { OR: [{ status: 'OCCUPIED' }, { status: 'FILLED' }] } }),
        prisma.report.count({ where: { status: 'PENDING' } }),
        prisma.contactRequest.count(),
        prisma.contactRequest.count({ where: { status: 'ACCEPTED' } }),
      ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        activeListings,
        totalOccupied,
        pendingReports,
        totalRequests,
        acceptedRequests,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin stats' }, { status: 500 });
  }
}
