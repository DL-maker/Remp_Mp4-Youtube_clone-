import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Nom d\'utilisateur requis' }, { status: 400 });
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
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
