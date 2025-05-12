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

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
    }

    const session = await decrypt(sessionCookie);
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: `users/${user.username}/`,
      MaxKeys: 100
    });

    const response = await s3Client.send(command);
    
    const videos = response.Contents
      ?.filter(object => object.Key?.endsWith('.mp4'))
      ?.map(object => ({
        key: object.Key,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${object.Key}`,
        lastModified: object.LastModified,
        size: object.Size
      })) || [];

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des vidéos' }, { status: 500 });
  }
}