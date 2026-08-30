import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      profile: profile || (user as any).profile || {
        userId: user.id,
        name: user.email.split('@')[0],
        email: user.email,
        phone: '',
        school: 'School of Computing',
        department: 'Computer Science & Engineering',
        year: '2nd Year',
        division: null,
        profilePhotoUrl: null,
        bio: null,
        emailVerified: true,
        studentVerified: false,
        verificationStatus: 'verified',
        role: 'student',
      },
    });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({
      profile: (user as any).profile || {
        userId: user.id,
        name: user.email.split('@')[0],
        email: user.email,
        phone: '',
        school: 'School of Computing',
        department: 'Computer Science & Engineering',
        year: '2nd Year',
        division: null,
        profilePhotoUrl: null,
        bio: null,
        emailVerified: true,
        studentVerified: false,
        verificationStatus: 'verified',
        role: 'student',
      },
    });
  }
}

export async function PUT(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, school, department, year, division, studentId, bio, profilePhotoUrl } = body;

    // Ensure the parent User record exists in the database
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          passwordHash: 'oauth_or_jwt_managed',
          role: user.role || 'student',
          isActive: true,
        },
      });
    }

    const updated = await prisma.profile.upsert({
      where: { userId: dbUser.id },
      update: {
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
      create: {
        userId: dbUser.id,
        name: (name || user.email.split('@')[0]).trim(),
        email: user.email,
        phone: (phone || '').trim(),
        school: school || 'School of Computing',
        department: department || 'Computer Science & Engineering',
        year: year || '2nd Year',
        division: division ? division.trim() : null,
        studentId: studentId ? studentId.trim() : null,
        bio: bio ? bio.trim() : null,
        profilePhotoUrl: profilePhotoUrl ? profilePhotoUrl.trim() : null,
        emailVerified: true,
        studentVerified: false,
        verificationStatus: 'verified',
        role: 'student',
      },
    });

    return NextResponse.json({ profile: updated, message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('Update profile error:', error);
    const msg = error?.message || 'Failed to update profile. Please try again.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
