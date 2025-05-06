import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '@/app/_lib/session'; // Import your encrypt function
import { cookies } from 'next/headers'; // Import cookies

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid field types' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (authError) {
      console.error('Supabase signup error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      );
    }

    if (!authData?.user?.id) {
      return NextResponse.json(
        { error: 'Failed to retrieve user ID from Supabase Auth' },
        { status: 500 }
      );
    }

    let newUser;
    // Insert user data into your 'User' table using Prisma
    try {
      newUser = await prisma.user.create({
        data: {
          id: authData.user.id, // Use the UUID from Supabase Auth
          username: username,
          email: email,
          passwordHash: hashedPassword,
          createdAt: new Date(),
          role: 'USER', // Assuming 'USER' is your default role
        },
      });
      console.log('User created in database:', newUser);
    } catch (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create user in the database', details: (dbError as Error).message },
        { status: 500 }
      );
    }

    // Create a session cookie for the newly signed-up user
    try {
      const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000); // 7 days
      const session = await encrypt({ userId: newUser.id, expires });
      const cookieStore = await cookies();
      cookieStore.set('session', session, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // Ensure secure in production
        path: '/',
        expires,
      });
      console.log('Session cookie created for user:', newUser.id);
    } catch (sessionError) {
      console.error('Error creating session cookie:', sessionError);
      // You might want to handle this error differently,
      // maybe still return success but log the session creation failure.
    }

    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}