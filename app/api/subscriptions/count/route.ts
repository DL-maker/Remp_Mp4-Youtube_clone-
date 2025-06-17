import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Nom d\'utilisateur requis' }, { status: 400 });
    }

    // Trouver l'utilisateur cible
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, isInvisible: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérification d'autorisation
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      // Si l'utilisateur n'est pas connecté, seuls les profils publics peuvent être consultés
      if (user.isInvisible) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
      }
    } else {
      // Vérifier la session
      const session = await decrypt(sessionCookie);
      if (!session?.userId) {
        return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
      }

      // Si l'utilisateur cible est invisible et que ce n'est pas lui-même
      if (user.isInvisible && session.userId !== user.id) {
        // Vérifier s'il a un accès spécial accordé
        const hasAccess = await prisma.profileAccess.findFirst({
          where: {
            OR: [
              { granterId: user.id, receiverId: session.userId },
              { granterId: session.userId, receiverId: user.id }
            ]
          }
        });

        if (!hasAccess) {
          return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }
      }
    }

    // Compter les abonnés
    const subscribersCount = await prisma.subscription.count({
      where: { channelId: user.id }
    });

    return NextResponse.json({ subscribersCount });
  } catch (error) {
    console.error('Erreur lors du comptage des abonnés:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
