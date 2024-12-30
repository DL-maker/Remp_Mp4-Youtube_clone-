import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Types
interface SessionPayload {
  [key: string]: string | number | Date | undefined;  // More specific index signature
  userId: string;
  expires: Date;
}

interface SessionResult {
  userId: string;
}

// Constants
const key = new TextEncoder().encode(process.env.SECRET_KEY);

const cookie = {
  name: 'session',
  options: { 
    httpOnly: true, 
    sameSite: 'lax' as const, 
    secure: true, 
    path: '/' 
  },
  duration: 60 * 60 * 24 * 7, // 7 days in seconds
};

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(key);
}

export async function decrypt(session: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, key, { 
      algorithms: ['HS256'] 
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<NextResponse> {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({ userId, expires });
  
  (await cookies()).set(cookie.name, session, {
    ...cookie.options,
    expires
  });
  
  return NextResponse.redirect('/login', 302);
}

export async function verifySession(): Promise<string | SessionResult> {
  const sessionCookie = (await cookies()).get(cookie.name)?.value;
  
  if (!sessionCookie) {
    return '/login';
  }
  
  const session = await decrypt(sessionCookie);
  
  if (!session?.userId) {
    return '/login';
  }
  
  return { userId: session.userId };
}

export async function deleteSession(): Promise<NextResponse> {
  (await cookies()).delete(cookie.name);
  return NextResponse.redirect('/login', 302);
}