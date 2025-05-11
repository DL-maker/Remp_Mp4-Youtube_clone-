import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    // Vérifier si l'utilisateur existe et s'il est en mode invisible
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        isInvisible: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Si l'utilisateur est en mode invisible, vérifier si le demandeur est le propriétaire du profil
    if (user.isInvisible) {
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

    // Si tout est ok, récupérer les vidéos de l'utilisateur
    const videos = await prisma.video.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        url: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ videos: videos });
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des vidéos' },
      { status: 500 }
    );
  }
}