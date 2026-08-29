import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { listingId, reportedUserId, reason, description } = body;

    if (!reason) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        listingId: listingId || null,
        reportedUserId: reportedUserId || null,
        reason,
        description: description?.trim() || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      report,
      message: 'Thanks. Your report has been submitted.',
    });
  } catch (error) {
    console.error('Submit report error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
