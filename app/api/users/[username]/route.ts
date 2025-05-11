import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const username = params.username;
    
    // Récupérer l'utilisateur du profil
    const profileUser = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        createdAt: true,
        isInvisible: true,
        accessToken: true,
      },
    });

    if (!profileUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Si le profil est invisible, vérifier l'accès
    if (profileUser.isInvisible) {
      // Vérifier si un token d'accès valide est fourni
      if (accessToken && accessToken === profileUser.accessToken) {
        // Token valide, autoriser l'accès
        const { isInvisible, accessToken: _, ...userData } = profileUser;
        return NextResponse.json(userData);
      }

      // Vérifier si l'utilisateur connecté a accès au profil
      const sessionCookie = (await cookies()).get('session')?.value;
      if (sessionCookie) {
        const session = await decrypt(sessionCookie);
        const requestingUserId = session?.userId;

        if (requestingUserId) {
          // Vérifier si l'utilisateur est le propriétaire ou a un accès accordé
          const hasAccess = await prisma.profileAccess.findFirst({
            where: {
              OR: [
                { granterId: profileUser.id, receiverId: requestingUserId },
                { granterId: requestingUserId, receiverId: profileUser.id }
              ]
            }
          });

          if (hasAccess || requestingUserId === profileUser.id) {
            const { isInvisible, accessToken: _, ...userData } = profileUser;
            return NextResponse.json(userData);
          }
        }
      }

      // Aucun accès valide
      return NextResponse.json({ error: 'Profil privé' }, { status: 403 });
    }

    // Profil public, retourner les données
    const { isInvisible, accessToken: _, ...userData } = profileUser;
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}