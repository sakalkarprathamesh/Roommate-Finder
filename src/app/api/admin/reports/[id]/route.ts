import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const reportId = params.id;
    const body = await req.json();
    const { status } = body; // 'RESOLVED', 'DISMISSED'

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: status || 'RESOLVED',
        reviewedAt: new Date(),
        reviewedBy: user.id,
      },
    });

    return NextResponse.json({ report: updated, message: 'Report updated' });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
