import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const sessionCookie = (await cookies()).get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
  }

  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId }, // Removed Number() conversion
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  return NextResponse.json({
    userId: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  });
}