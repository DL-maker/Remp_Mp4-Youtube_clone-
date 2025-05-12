import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Générer un token d'accès unique
function generateAccessToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST() {
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

    // Générer ou régénérer le token d'accès
    const accessToken = generateAccessToken();
    
    // Mettre à jour le token d'accès de l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: { accessToken },
    });

    return NextResponse.json({
      message: 'Token d\'accès généré avec succès',
      accessToken: accessToken
    });
  } catch (error) {
    console.error('Erreur lors de la génération du token:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Utiliser le token pour donner accès à un utilisateur
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json({ error: 'Token d\'accès requis' }, { status: 400 });
    }

    // Vérifier le token et trouver l'utilisateur qui l'a généré
    const granterUser = await prisma.user.findUnique({
      where: { accessToken },
    });

    if (!granterUser) {
      return NextResponse.json({ error: 'Token d\'accès invalide' }, { status: 404 });
    }

    // Obtenir l'ID de l'utilisateur qui demande l'accès
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    const receiverId = session?.userId;
    if (!receiverId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier si l'accès existe déjà
    const existingAccess = await prisma.profileAccess.findFirst({
      where: {
        granterId: granterUser.id,
        receiverId: receiverId,
      },
    });

    if (existingAccess) {
      return NextResponse.json({ error: 'Accès déjà accordé' }, { status: 400 });
    }

    // Créer l'accès
    const profileAccess = await prisma.profileAccess.create({
      data: {
        granterId: granterUser.id,
        receiverId: receiverId,
      },
      include: {
        granter: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Accès accordé avec succès',
      granterUsername: profileAccess.granter.username,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'accès:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Récupérer la liste des accès
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

    // Récupérer les accès accordés et reçus
    const [grantedAccesses, receivedAccesses] = await Promise.all([
      prisma.profileAccess.findMany({
        where: { granterId: userId },
        include: {
          receiver: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      }),
      prisma.profileAccess.findMany({
        where: { receiverId: userId },
        include: {
          granter: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      grantedAccesses,
      receivedAccesses,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des accès:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Supprimer un accès
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { accessId } = body;

    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    const userId = session?.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier que l'utilisateur a le droit de supprimer cet accès
    const access = await prisma.profileAccess.findFirst({
      where: {
        id: accessId,
        OR: [
          { granterId: userId },
          { receiverId: userId },
        ],
      },
    });

    if (!access) {
      return NextResponse.json({ error: 'Accès non trouvé ou non autorisé' }, { status: 404 });
    }

    // Supprimer l'accès
    await prisma.profileAccess.delete({
      where: { id: accessId },
    });

    return NextResponse.json({
      message: 'Accès supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'accès:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const sessionCookie = (await cookies()).get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const session = await decrypt(sessionCookie);
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const data = await request.json();

    await prisma.user.update({
      where: { id: userId },
      data: {
        isInvisible: data.isInvisible,
      },
    });

    return NextResponse.json({
      message: 'Paramètres mis à jour avec succès',
      isInvisible: data.isInvisible,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}