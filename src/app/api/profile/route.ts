import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    });

    const profile = dbUser?.profile;

    return NextResponse.json({
      profile: {
        userId: user.id,
        name: profile?.name || user.email.split('@')[0],
        email: user.email,
        phone: profile?.phone || '',
        school: profile?.school || 'School of Computing',
        department: profile?.department || 'Computer Science & Engineering',
        year: profile?.year || '2nd Year',
        division: profile?.division || '',
        profilePhotoUrl: profile?.profilePhotoUrl || '',
        avatarId: profile?.avatarId || 'avatar-male-1',
        city: dbUser?.city || profile?.city || 'Pune',
        preferences: dbUser?.preferences ? JSON.parse(dbUser.preferences) : [],
        bio: profile?.bio || '',
        emailVerified: true,
        studentVerified: false,
        verificationStatus: 'verified',
        role: dbUser?.role || user.role || 'SEEKER',
        roles: dbUser?.roles ? JSON.parse(dbUser.roles) : [dbUser?.role || user.role || 'SEEKER'],
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
        division: '',
        profilePhotoUrl: '',
        avatarId: 'avatar-male-1',
        city: 'Pune',
        preferences: [],
        bio: '',
        emailVerified: true,
        studentVerified: false,
        verificationStatus: 'verified',
        role: user.role || 'SEEKER',
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
    const {
      name,
      phone,
      school,
      department,
      year,
      division,
      studentId,
      bio,
      profilePhotoUrl,
      avatarId,
      city,
      preferences,
    } = body;

    // 1. Update user fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(city ? { city } : {}),
        ...(preferences !== undefined
          ? { preferences: typeof preferences === 'string' ? preferences : JSON.stringify(preferences) }
          : {}),
      },
    });

    // 2. Update or upsert profile record
    const updated = await prisma.profile.upsert({
      where: { userId: user.id },
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
        ...(avatarId ? { avatarId } : {}),
        ...(city ? { city } : {}),
      },
      create: {
        userId: user.id,
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
        avatarId: avatarId || 'avatar-male-1',
        city: city || 'Pune',
        emailVerified: true,
        studentVerified: false,
        verificationStatus: 'verified',
        role: user.role || 'SEEKER',
      },
    });

    return NextResponse.json({
      profile: {
        ...updated,
        avatarId: avatarId || updated.avatarId || 'avatar-male-1',
        city: city || updated.city || 'Pune',
        preferences: preferences || [],
      },
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    const msg = error?.message || 'Failed to update profile. Please try again.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
