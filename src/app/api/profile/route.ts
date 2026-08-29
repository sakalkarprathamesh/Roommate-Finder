import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, school, department, year, division, studentId, bio, profilePhotoUrl } = body;

    const updated = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(school ? { school } : {}),
        ...(department ? { department } : {}),
        ...(year ? { year } : {}),
        ...(division !== undefined ? { division: division ? division.trim() : null } : {}),
        ...(studentId ? { studentId: studentId.trim() } : {}),
        ...(bio !== undefined ? { bio: bio ? bio.trim() : null } : {}),
        ...(profilePhotoUrl !== undefined ? { profilePhotoUrl: profilePhotoUrl ? profilePhotoUrl.trim() : null } : {}),
      },
    });

    return NextResponse.json({ profile: updated, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
