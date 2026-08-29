import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, signToken, isValidEmail, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      school,
      department,
      year,
      division,
      password,
      confirmPassword,
      bio,
      profilePhotoUrl,
    } = body;

    if (!fullName || !email || !phone || !school || !department || !year || !password) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

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

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        role: 'student',
        isActive: true,
        profile: {
          create: {
            name: fullName.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            school,
            department,
            year,
            division: division?.trim() || null,
            profilePhotoUrl: profilePhotoUrl?.trim() || null,
            bio: bio?.trim() || null,
            emailVerified: true,
            studentVerified: false,
            verificationStatus: 'verified',
            role: 'student',
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
        title: 'Welcome to MIT-ADT Roommate Finder!',
        message: 'Your student account is active. Start exploring accommodations or post your listing!',
        link: '/find',
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
    console.error('Registration error:', error);
    const msg = error?.message || 'Database error occurred while creating account.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
