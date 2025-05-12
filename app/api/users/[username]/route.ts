import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

// Fonction helper pour retirer une propriété de l'objet
function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _unused, ...rest } = obj;
  return rest;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    // Résoudre le Promise pour obtenir params
    const { username } = await context.params;
    const { searchParams } = new URL(_request.url);
    const accessToken = searchParams.get('accessToken');

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
        const userData = omit(profileUser, 'accessToken');
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
            const userData = omit(profileUser, 'accessToken');
            return NextResponse.json(userData);
          }
        }
      }

      // Aucun accès valide
      return NextResponse.json({ error: 'Profil privé' }, { status: 403 });
    }

    // Profil public, retourner les données
    const userData = omit(profileUser, 'accessToken');
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}