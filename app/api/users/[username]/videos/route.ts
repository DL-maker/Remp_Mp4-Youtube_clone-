import { NextResponse } from 'next/server';
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
    const username = params.username;
    
    // Chercher les vidéos dans le dossier de l'utilisateur
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: `users/${username}/`,
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      return NextResponse.json({ videos: [] });
    }

    // Filtrer pour ne garder que les fichiers vidéo
    const videos = response.Contents
      .filter(obj => obj.Key && !obj.Key.endsWith('/') && !obj.Key.endsWith('metadata.json'))
      .map(obj => {
        const key = obj.Key!;
        const filename = key.split('/').pop()!;
        return {
          id: `s3-${key}`,
          key: key,
          filename: filename,
          title: filename.split('-').slice(1).join('-').replace(/_/g, ' '),
          date: obj.LastModified?.toISOString() || new Date().toISOString(),
          type: 'video',
          src: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
          size: obj.Size || 0,
          username: username
        };
      });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des vidéos' }, { status: 500 });
  }
}