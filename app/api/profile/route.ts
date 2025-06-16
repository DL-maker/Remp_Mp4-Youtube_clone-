import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Vérifier la session
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    if (!session?.userId) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
    }    // D'abord récupérer les données de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }    // Ensuite récupérer les vidéos et statistiques d'abonnement
    const [userVideos, subscribersCount, subscriptionsCount] = await Promise.all([
      // Vidéos de l'utilisateur (depuis S3)
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/users/videos`, {
        headers: {
          'Cookie': `session=${sessionCookie}`
        }
      }).then(res => res.json()).catch(() => ({ videos: [] })),
      
      // Nombre d'abonnés (personnes qui suivent cet utilisateur)
      prisma.subscription.count({
        where: { channelId: user.id }
      }),
      
      // Nombre d'abonnements (personnes que cet utilisateur suit)
      prisma.subscription.count({
        where: { subscriberId: user.id }
      })
    ]);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Construire la réponse avec toutes les données nécessaires
    const profileData = {
      userId: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      videos: userVideos.videos || [],
      stats: {
        videosCount: userVideos.videos?.length || 0,
        subscribersCount,
        subscriptionsCount,
        likesCount: 0 // Pour l'instant, peut être implémenté plus tard
      }
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}
