import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestId = params.id;
    const body = await req.json();
    const { status } = body; // 'ACCEPTED', 'REJECTED', 'CANCELLED'

    if (!['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const request = await prisma.contactRequest.findUnique({
      where: { id: requestId },
      include: {
        listing: true,
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Contact request not found' }, { status: 404 });
    }

    // Authorization checks
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      if (request.receiverId !== user.id && user.role !== 'admin') {
        return NextResponse.json({ error: 'Only the listing owner can accept or reject this request' }, { status: 403 });
      }
    } else if (status === 'CANCELLED') {
      if (request.senderId !== user.id && request.receiverId !== user.id && user.role !== 'admin') {
        return NextResponse.json({ error: 'Not authorized to cancel this request' }, { status: 403 });
      }
    }

    const updated = await prisma.contactRequest.update({
      where: { id: requestId },
      data: { status },
    });

    // Notify sender on approval
    if (status === 'ACCEPTED') {
      await prisma.notification.create({
        data: {
          userId: request.senderId,
          type: 'REQUEST_ACCEPTED',
          title: 'Contact Request Approved! 🎉',
          message: `${user.profile?.name || 'The listing owner'} approved your request for "${request.listing.title}". You can now view their phone number and email!`,
          link: '/inbox',
        },
      });
    } else if (status === 'REJECTED') {
      await prisma.notification.create({
        data: {
          userId: request.senderId,
          type: 'REQUEST_REJECTED',
          title: 'Contact Request Declined',
          message: `Your contact request for "${request.listing.title}" was declined.`,
          link: '/inbox',
        },
      });
    }

    return NextResponse.json({
      contactRequest: updated,
      message:
        status === 'ACCEPTED'
          ? 'Contact request accepted! Both parties can now view verified contact details.'
          : status === 'REJECTED'
          ? 'Contact request declined'
          : 'Contact request cancelled',
    });
  } catch (error) {
    console.error('Update contact request error:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
