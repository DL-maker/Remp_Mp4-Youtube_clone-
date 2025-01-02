import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encrypt } from '@/app/_lib/session';

export async function POST(request: Request) {
  const { userId } = await request.json();
  const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000); // 7 days in milliseconds
  const session = await encrypt({ userId, expires });
  
  const cookieStore = cookies();
  (await cookieStore).set('session', session, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    expires,
  });
  
  return NextResponse.json({ success: true });
}
