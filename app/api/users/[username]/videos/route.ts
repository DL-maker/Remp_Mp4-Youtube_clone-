import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

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
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const username = params.username;

    // Récupérer l'utilisateur et vérifier son statut
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        isInvisible: true,
        accessToken: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    let hasAccess = false;

    // Si le profil est invisible, vérifier l'accès
    if (user.isInvisible) {
      // Vérifier le token d'accès
      if (accessToken && accessToken === user.accessToken) {
        hasAccess = true;
      } else {
        // Vérifier si l'utilisateur connecté a accès
        const sessionCookie = (await cookies()).get('session')?.value;
        if (sessionCookie) {
          const session = await decrypt(sessionCookie);
          const requestingUserId = session?.userId;

          if (requestingUserId) {
            // Vérifier si c'est le propriétaire ou s'il a un accès accordé
            const profileAccess = await prisma.profileAccess.findFirst({
              where: {
                OR: [
                  { granterId: user.id, receiverId: requestingUserId },
                  { granterId: requestingUserId, receiverId: user.id }
                ]
              }
            });

            hasAccess = !!profileAccess || requestingUserId === user.id;
          }
        }
      }

      if (!hasAccess) {
        return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
      }
    }

    // Si on arrive ici, soit le profil est public, soit l'accès a été validé
    // Récupérer les vidéos depuis S3
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: `users/${username}/`,
    });

    const response = await s3Client.send(command);
    
    const videos = response.Contents?.filter(obj => 
      obj.Key?.endsWith('.mp4') || 
      obj.Key?.endsWith('.mov') || 
      obj.Key?.endsWith('.webm') || 
      obj.Key?.endsWith('.avi')
    ).map(obj => ({
      id: obj.Key,
      key: obj.Key!,
      title: obj.Key!.split('/').pop()!.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      src: `/api/video-stream?key=${encodeURIComponent(obj.Key!)}`,
      date: obj.LastModified!.toISOString(),
    })) || [];

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des vidéos' },
      { status: 500 }
    );
  }
}