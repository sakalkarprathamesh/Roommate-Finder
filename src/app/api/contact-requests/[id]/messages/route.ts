import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestId = params.id;

    const request = await prisma.contactRequest.findUnique({
      where: { id: requestId },
      include: {
        listing: true,
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Access control: Only sender and receiver can view the chat
    const isParticipant = request.senderId === user.id || request.receiverId === user.id;
    if (!isParticipant && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You do not have access to this chat' }, { status: 403 });
    }

    // Rule: Chat is only available once connection is ACCEPTED
    if (request.status !== 'ACCEPTED') {
      return NextResponse.json(
        { error: 'Chat is only available once both users have accepted the connection' },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { contactRequestId: requestId },
      include: {
        sender: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const formattedMessages = messages.map((m) => ({
      id: m.id,
      contactRequestId: m.contactRequestId,
      listingId: m.listingId,
      senderId: m.senderId,
      senderName: m.sender.profile?.name || (m.sender.email ? m.sender.email.split('@')[0] : 'User'),
      senderPhoto: m.sender.profile?.profilePhotoUrl || null,
      content: m.content,
      createdAt: m.createdAt,
      isSelf: m.senderId === user.id,
    }));

    return NextResponse.json({
      connectionId: request.id,
      listingTitle: request.listing.title,
      listingId: request.listingId,
      partner:
        request.senderId === user.id
          ? { id: request.receiver.id, name: request.receiver.profile?.name || 'Student' }
          : { id: request.sender.id, name: request.sender.profile?.name || 'Student' },
      messages: formattedMessages,
    });
  } catch (error: any) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to retrieve messages' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requestId = params.id;
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 });
    }

    // 500-Word Limit Enforcement
    const words = content.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount > 500) {
      return NextResponse.json(
        { error: 'Message exceeds 500 word limit — please shorten it' },
        { status: 400 }
      );
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
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Access control: Only sender or receiver
    const isParticipant = request.senderId === user.id || request.receiverId === user.id;
    if (!isParticipant && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Rule: Must be ACCEPTED
    if (request.status !== 'ACCEPTED') {
      return NextResponse.json(
        { error: 'Chat is only available once both users have accepted the connection' },
        { status: 403 }
      );
    }

    // Create the message record
    const newMessage = await prisma.message.create({
      data: {
        contactRequestId: request.id,
        listingId: request.listingId,
        senderId: user.id,
        content: content.trim(),
      },
      include: {
        sender: { include: { profile: true } },
      },
    });

    // Notify the recipient
    const recipientId = request.senderId === user.id ? request.receiverId : request.senderId;
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'NEW_MESSAGE',
        title: `New message from ${user.profile?.name || 'Roommate'}`,
        message: content.trim().length > 60 ? `${content.trim().substring(0, 60)}...` : content.trim(),
        link: '/inbox',
      },
    });

    return NextResponse.json({
      message: {
        id: newMessage.id,
        contactRequestId: newMessage.contactRequestId,
        listingId: newMessage.listingId,
        senderId: newMessage.senderId,
        senderName: newMessage.sender.profile?.name || 'User',
        senderPhoto: newMessage.sender.profile?.profilePhotoUrl || null,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        isSelf: true,
      },
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send message' }, { status: 500 });
  }
}
