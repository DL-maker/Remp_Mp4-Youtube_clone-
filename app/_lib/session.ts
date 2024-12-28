import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const key = new TextEncoder().encode(process.env.SECRET_KEY);

const cookie = {
  name: 'session',
  options: { httpOnly: true, sameSite: 'lax' as const, secure: true, path: '/' },
  duration: 60 * 60 * 24 * 7,
};

export async function encrypt(payload: object) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(key);
}

export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
    const expires = new Date(Date.now() + cookie.duration)
    const session = await encrypt({userId, expires})

    ;(await cookies()).set(cookie.name, session, {...cookie.options, expires})
    return NextResponse.redirect('/login', 302)
}

export async function verifySession() {
    const sessionCookie = (await cookies()).get(cookie.name)?.value
    if (!sessionCookie) {
        return '/login';
    }
    const session = await decrypt(sessionCookie)
    if (!session?.userId) {
        return('/login')
    }

    return {userId: session.userId}
}

export async function deleteSession() {
    (await cookies()).delete(cookie.name)
    return NextResponse.redirect('/login', 302)
}