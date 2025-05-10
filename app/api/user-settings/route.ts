import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isInvisible: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
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
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isInvisible: data.isInvisible,
      },
    });

    return NextResponse.json({
      message: 'Paramètres mis à jour avec succès',
      isInvisible: updatedUser.isInvisible,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}