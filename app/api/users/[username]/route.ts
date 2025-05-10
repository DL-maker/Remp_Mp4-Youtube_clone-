import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        createdAt: true,
        isInvisible: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier si l'utilisateur est en mode invisible
    if (user.isInvisible) {
      // Obtenir l'ID de l'utilisateur qui fait la requête
      const sessionCookie = (await cookies()).get('session')?.value;
      if (!sessionCookie) {
        return NextResponse.json({ error: 'Profil privé' }, { status: 403 });
      }

      const session = await decrypt(sessionCookie);
      const requestingUserId = session?.userId;

      // Si l'utilisateur qui fait la requête n'est pas le propriétaire du profil
      if (requestingUserId !== user.id) {
        return NextResponse.json({ error: 'Profil privé' }, { status: 403 });
      }
    }

    // Si l'utilisateur n'est pas en mode invisible ou si c'est son propre profil
    const { isInvisible, ...userData } = user;
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des informations utilisateur' },
      { status: 500 }
    );
  }
}