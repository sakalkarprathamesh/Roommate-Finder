export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const [realUsers, demoUsers, realListings, demoListings] = await Promise.all([
      prisma.user.findMany({
        where: { isDemo: false },
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findMany({
        where: { isDemo: true },
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.listing.findMany({
        where: { isDemo: false },
        include: { owner: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.listing.findMany({
        where: { isDemo: true },
        include: { owner: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      realUsers,
      demoUsers,
      realListings,
      demoListings,
    });
  } catch (error) {
    console.error('Internal review fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch internal review data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, targetId, targetType, isDemo } = body;

    if (action === 'toggle_demo') {
      if (targetType === 'user') {
        const updatedUser = await prisma.user.update({
          where: { id: targetId },
          data: { isDemo: Boolean(isDemo) },
        });
        // Also update user's listings to match
        await prisma.listing.updateMany({
          where: { ownerId: targetId },
          data: { isDemo: Boolean(isDemo) },
        });
        return NextResponse.json({ success: true, user: updatedUser });
      } else if (targetType === 'listing') {
        const updatedListing = await prisma.listing.update({
          where: { id: targetId },
          data: { isDemo: Boolean(isDemo) },
        });
        return NextResponse.json({ success: true, listing: updatedListing });
      }
    }

    if (action === 'tag_all_demo_seeds') {
      // Flag all known test accounts
      const demoEmailPatterns = [
        'admin@mitadt.ac.in',
        'rahul.sharma@gmail.com',
        'ananya.ux@gmail.com',
        'rohan.engg@gmail.com',
        'priya.foodtech@gmail.com',
        'aditya.aero@gmail.com',
      ];

      await prisma.user.updateMany({
        where: {
          OR: [
            { email: { in: demoEmailPatterns } },
            { email: { contains: '+demo' } },
            { email: { contains: '+test' } },
            { email: { startsWith: 'demo.' } },
            { email: { startsWith: 'test.' } },
            { email: { contains: '@demo.' } },
            { email: { contains: '@test.' } },
          ],
        },
        data: { isDemo: true },
      });

      // Update listings belonging to demo users
      const demoUserIds = (
        await prisma.user.findMany({
          where: { isDemo: true },
          select: { id: true },
        })
      ).map((u) => u.id);

      await prisma.listing.updateMany({
        where: { ownerId: { in: demoUserIds } },
        data: { isDemo: true },
      });

      return NextResponse.json({ success: true, message: 'All demo accounts and listings flagged successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Internal review mutation error:', error);
    return NextResponse.json({ error: 'Failed to update internal review state' }, { status: 500 });
  }
}
