import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, signToken, isValidEmail, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = (body.fullName || body.name || '').trim();
    const email = (body.email || '').toLowerCase().trim();
    const phone = (body.phone || '').trim();
    const password = body.password;
    const confirmPassword = body.confirmPassword || body.password;
    const {
      school,
      department,
      year,
      division,
      bio,
      profilePhotoUrl,
      avatarId,
      role,
      roles,
      city,
      preferences,
      isDemo,
    } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Normalize email (lowercase + trim whitespace)
    const cleanEmail = email.toLowerCase().trim();
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address (e.g. yourname@gmail.com)' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Detect if this is a test/demo account by email pattern or explicit parameter
    const isDemoAccount =
      Boolean(isDemo) ||
      cleanEmail.includes('+demo') ||
      cleanEmail.includes('+test') ||
      cleanEmail.startsWith('demo.') ||
      cleanEmail.startsWith('test.') ||
      cleanEmail.includes('@demo.') ||
      cleanEmail.includes('@test.');

    // Step 2: Hash password with bcrypt
    const passwordHash = await hashPassword(password);

    const assignedRole = role || 'SEEKER';
    const rolesArray = Array.isArray(roles) ? JSON.stringify(roles) : JSON.stringify([assignedRole]);

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        role: assignedRole,
        roles: rolesArray,
        city: city || 'Pune',
        preferences: preferences ? (typeof preferences === 'string' ? preferences : JSON.stringify(preferences)) : null,
        isActive: true,
        isDemo: isDemoAccount,
        profile: {
          create: {
            name: fullName.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            school: school || 'School of Computing',
            department: department || 'Computer Science & Engineering',
            year: year || '1st Year',
            division: division?.trim() || null,
            profilePhotoUrl: profilePhotoUrl?.trim() || null,
            avatarId: avatarId || null,
            city: city || 'Pune',
            bio: bio?.trim() || null,
            emailVerified: true,
            studentVerified: false,
            verificationStatus: 'verified',
            role: assignedRole,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: newUser.id,
        type: 'SYSTEM',
        title: 'Welcome to Roomie!',
        message: 'Your account is active. Start exploring accommodations or manage your listings!',
        link: assignedRole === 'PG_OWNER' ? '/pg/new' : assignedRole === 'FLAT_OWNER' ? '/flat/new' : '/find',
      },
    });

    const token = await signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        roles: newUser.roles,
        city: newUser.city,
        isDemo: newUser.isDemo,
        profile: newUser.profile,
      },
      message: 'Account created successfully',
    });

    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('[AUTH_REGISTER] Error during registration:', error);
    const msg = error?.message || 'Database error occurred while creating account.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
