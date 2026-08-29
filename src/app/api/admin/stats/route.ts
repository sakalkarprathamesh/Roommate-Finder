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
    const [totalUsers, activeListings, pendingReports, pendingVerifications, totalRequests, acceptedRequests] =
      await Promise.all([
        prisma.user.count({ where: { role: 'student' } }),
        prisma.listing.count({ where: { status: 'ACTIVE' } }),
        prisma.report.count({ where: { status: 'PENDING' } }),
        prisma.profile.count({ where: { verificationStatus: 'pending', role: 'student' } }),
        prisma.contactRequest.count(),
        prisma.contactRequest.count({ where: { status: 'ACCEPTED' } }),
      ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        activeListings,
        pendingReports,
        pendingVerifications,
        totalRequests,
        acceptedRequests,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin stats' }, { status: 500 });
  }
}
