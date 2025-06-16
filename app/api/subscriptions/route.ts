import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

// Créer un abonnement (s'abonner)
export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    const subscriberId = session?.userId;
    if (!subscriberId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { channelUsername } = await request.json();
    if (!channelUsername) {
      return NextResponse.json({ error: 'Nom d\'utilisateur requis' }, { status: 400 });
    }

    // Trouver l'utilisateur à suivre
    const channelUser = await prisma.user.findUnique({
      where: { username: channelUsername },
      select: { id: true, username: true }
    });

    if (!channelUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier si on ne s'abonne pas à soi-même
    if (subscriberId === channelUser.id) {
      return NextResponse.json({ error: 'Vous ne pouvez pas vous abonner à vous-même' }, { status: 400 });
    }

    // Vérifier si l'abonnement existe déjà
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: subscriberId,
          channelId: channelUser.id
        }
      }
    });

    if (existingSubscription) {
      return NextResponse.json({ error: 'Déjà abonné' }, { status: 400 });
    }

    // Créer l'abonnement
    const subscription = await prisma.subscription.create({
      data: {
        subscriberId: subscriberId,
        channelId: channelUser.id
      },
      include: {
        channel: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Abonnement créé avec succès',
      subscription: {
        id: subscription.id,
        channelUsername: subscription.channel.username,
        createdAt: subscription.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Supprimer un abonnement (se désabonner)
export async function DELETE(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    const subscriberId = session?.userId;
    if (!subscriberId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { channelUsername } = await request.json();
    if (!channelUsername) {
      return NextResponse.json({ error: 'Nom d\'utilisateur requis' }, { status: 400 });
    }

    // Trouver l'utilisateur
    const channelUser = await prisma.user.findUnique({
      where: { username: channelUsername },
      select: { id: true }
    });

    if (!channelUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Supprimer l'abonnement
    const deletedSubscription = await prisma.subscription.deleteMany({
      where: {
        subscriberId: subscriberId,
        channelId: channelUser.id
      }
    });

    if (deletedSubscription.count === 0) {
      return NextResponse.json({ error: 'Abonnement non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Désabonnement réussi'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'abonnement:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Récupérer les abonnements de l'utilisateur connecté
export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    const userId = session?.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer tous les abonnements de l'utilisateur
    const subscriptions = await prisma.subscription.findMany({
      where: { subscriberId: userId },
      include: {
        channel: {
          select: {
            username: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Pour chaque abonnement, récupérer la dernière vidéo depuis S3
    const subscriptionsWithVideos = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          // Récupérer les vidéos de cet utilisateur depuis S3
          const videosResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/users/${encodeURIComponent(sub.channel.username)}/videos`);
          
          if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            const latestVideo = videosData.videos && videosData.videos.length > 0 
              ? videosData.videos[0] // La première vidéo (la plus récente)
              : null;

            return {
              id: sub.id,
              name: sub.channel.username,
              videoKey: latestVideo?.key || '',
              videoTitle: latestVideo ? 
                (latestVideo.key.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Vidéo sans titre') 
                : 'Aucune vidéo',
              createdAt: sub.createdAt
            };
          } else {
            // Si on ne peut pas récupérer les vidéos, retourner sans vidéo
            return {
              id: sub.id,
              name: sub.channel.username,
              videoKey: '',
              videoTitle: 'Aucune vidéo',
              createdAt: sub.createdAt
            };
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des vidéos pour ${sub.channel.username}:`, error);
          return {
            id: sub.id,
            name: sub.channel.username,
            videoKey: '',
            videoTitle: 'Aucune vidéo',
            createdAt: sub.createdAt
          };
        }
      })
    );

    return NextResponse.json({
      subscriptions: subscriptionsWithVideos
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
