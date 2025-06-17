import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ isSubscribed: false });
    }

    const session = await decrypt(sessionCookie);
    const userId = session?.userId;
    if (!userId) {
      return NextResponse.json({ isSubscribed: false });
    }

    const { searchParams } = new URL(request.url);
    const channelUsername = searchParams.get('username');
    
    if (!channelUsername) {
      return NextResponse.json({ error: 'Nom d\'utilisateur requis' }, { status: 400 });
    }

    // Trouver l'utilisateur
    const channelUser = await prisma.user.findUnique({
      where: { username: channelUsername },
      select: { id: true }
    });

    if (!channelUser) {
      return NextResponse.json({ isSubscribed: false });
    }

    // Vérifier si l'abonnement existe
    const subscription = await prisma.subscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: userId,
          channelId: channelUser.id
        }
      }
    });

    return NextResponse.json({ isSubscribed: !!subscription });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'abonnement:', error);
    return NextResponse.json({ isSubscribed: false });
  }
}
