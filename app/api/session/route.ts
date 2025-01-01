import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';

export async function GET() {
  const sessionCookie = (await cookies()).get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
  }

  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
  }

  return NextResponse.json({ userId: session.userId });
}
