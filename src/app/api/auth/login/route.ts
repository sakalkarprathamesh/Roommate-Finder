import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { comparePassword, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Step 3 & 4: Normalize email (trim whitespace + lowercase)
    const cleanEmail = email.toLowerCase().trim();
    console.log(`[AUTH_LOGIN] Attempting login for email: "${cleanEmail}"`);

    // Step 5: Query the persistent database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        profile: true,
      },
    });

    if (!user) {
      console.warn(`[AUTH_LOGIN] User "${cleanEmail}" NOT found in database.`);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log(`[AUTH_LOGIN] User "${cleanEmail}" found in database (ID: ${user.id}). Checking password...`);

    if (!user.isActive) {
      console.warn(`[AUTH_LOGIN] User "${cleanEmail}" is suspended.`);
      return NextResponse.json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 });
    }

    // Step 2: Compare password using bcrypt
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      console.warn(`[AUTH_LOGIN] Password mismatch for user "${cleanEmail}".`);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log(`[AUTH_LOGIN] Password verified successfully for "${cleanEmail}". Issuing session cookie...`);

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      message: 'Login successful',
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
    console.error('[AUTH_LOGIN] Error during login:', error);
    const msg = error?.message || 'Database error occurred during login.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
