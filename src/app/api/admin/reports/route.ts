export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: { include: { profile: true } },
        reportedUser: { include: { profile: true } },
        listing: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Admin fetch reports error:', error);
    return NextResponse.json({ error: 'Failed to retrieve reports' }, { status: 500 });
  }
}
