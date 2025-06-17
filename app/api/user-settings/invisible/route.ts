import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
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

    const { isInvisible } = await request.json();
    if (typeof isInvisible !== 'boolean') {
      return NextResponse.json({ error: 'Paramètre isInvisible requis (boolean)' }, { status: 400 });
    }

    // Mettre à jour le statut invisible de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isInvisible },
      select: {
        id: true,
        username: true,
        isInvisible: true,
        accessToken: true
      }
    });

    // Si l'utilisateur devient invisible et n'a pas encore de token d'accès, en créer un
    if (isInvisible && !updatedUser.accessToken) {
      const accessToken = crypto.randomUUID();
      await prisma.user.update({
        where: { id: userId },
        data: { accessToken }
      });
    }

    // Si l'utilisateur redevient visible, on peut optionnellement supprimer le token d'accès
    if (!isInvisible && updatedUser.accessToken) {
      await prisma.user.update({
        where: { id: userId },
        data: { accessToken: null }
      });
    }

    return NextResponse.json({
      message: `Mode ${isInvisible ? 'invisible' : 'visible'} activé avec succès`,
      isInvisible: isInvisible,
      accessToken: isInvisible ? updatedUser.accessToken || crypto.randomUUID() : null
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mode invisible:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
