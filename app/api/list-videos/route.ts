// /app/api/list-videos/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';
import { prisma } from '@/lib/prisma';

// Initialisation du client S3 avec AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

const bucketName = process.env.AWS_BUCKET_NAME!;

// Fonction pour récupérer des vidéos de test quand AWS n'est pas disponible
function getDefaultVideos() {
  return [
    {
      id: '1',
      filename: "Cannot Believe They Built This.mp4",
      date: new Date().toISOString().split('T')[0],
      type: 'video',
      url: '/videos/Cannot Believe They Built This.mp4',
      size: 0,
      username: 'No account - local storage'
    },
    {
      id: '2',
      filename: "Easily add video to your Next.js app.mp4",
      date: new Date().toISOString().split('T')[0],
      type: 'video',
      url: '/videos/Easily add video to your Next.js app.mp4',
      size: 0,
      username: 'No account - local storage'
    },
    {
      id: '3',
      filename: "RECYCLER votre VIEUX PC en SERVEUR MULTI-TÂCHES.mp4",
      date: new Date().toISOString().split('T')[0],
      type: 'video',
      url: '/videos/RECYCLER votre VIEUX PC en SERVEUR MULTI-TÂCHES.mp4',
      size: 0,
      username: 'No account - local storage'
    }
  ];
}

export async function GET(request: Request) {
  try {
    // Analyser les paramètres de requête
    const url = new URL(request.url);
    const startParam = url.searchParams.get('start');
    const limitParam = url.searchParams.get('limit');
    
    // Convertir en nombres avec des valeurs par défaut
    const start = startParam ? parseInt(startParam, 10) : 0;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    const sessionCookie = (await cookies()).get('session')?.value;

    // Si l'utilisateur n'est pas connecté, retourner des vidéos par défaut pour l'affichage public
    if (!sessionCookie) {
      const defaultVideos = getDefaultVideos();
      // Appliquer la pagination
      return NextResponse.json(defaultVideos.slice(start, start + limit));
    }

    const session = await decrypt(sessionCookie);
    const userId = session?.userId;

    // Si l'utilisateur n'est pas authentifié, retourner des vidéos par défaut
    if (!userId) {
      const defaultVideos = getDefaultVideos();
      return NextResponse.json(defaultVideos.slice(start, start + limit));
    }

    // Récupérer le nom d'utilisateur à partir de l'ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const username = user.username;

    try {
      // Essayer de lister les objets dans le dossier de l'utilisateur
      let videos: { id: string; filename: any; date: any; type: string; url: string; size: number; username: string; }[] = [];
      
      try {
        const listCommand = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: `users/${username}/`,
          MaxKeys: limit
        });

        const listResult = await s3Client.send(listCommand);
        
        // Transformer les objets S3 en objets vidéo pour l'interface
        if (listResult.Contents && listResult.Contents.length > 0) {
          // Filtrer uniquement les fichiers vidéo (pas les métadonnées)
          const videoFiles = listResult.Contents.filter(obj => 
            obj.Key && (
              obj.Key.endsWith('.mp4') || 
              obj.Key.endsWith('.mov') ||
              obj.Key.endsWith('.webm') ||
              obj.Key.endsWith('.avi')
            )
          );
          
          videos = videoFiles.map((obj, index) => ({
            id: (index + 1).toString(),
            filename: obj.Key?.split('/').pop() || 'video.mp4',
            date: obj.LastModified?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            type: 'video',
            url: `/api/video-stream?key=${encodeURIComponent(obj.Key || '')}`,
            size: obj.Size || 0,
            username: username
          }));
        }
      } catch (listError) {
        console.log("Erreur lors du listage des objets S3:", listError);
        
        // Solution alternative: essayer de récupérer le fichier de métadonnées
        try {
          const metadataKey = `users/${username}/latest-video-metadata.json`;
          const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: metadataKey
          });
          
          const metadataResult = await s3Client.send(getCommand);
          const metadata = JSON.parse(await metadataResult.Body?.transformToString() || '{}');
          
          if (metadata.path) {
            videos.push({
              id: '1',
              filename: metadata.filename || 'video.mp4',
              date: metadata.uploadDate?.split('T')[0] || new Date().toISOString().split('T')[0],
              type: 'video',
              url: `/api/video-stream?key=${encodeURIComponent(metadata.path)}`,
              size: 0,
              username: username
            });
          }
        } catch (metadataError) {
          console.log("Erreur lors de la récupération des métadonnées:", metadataError);
        }
      }
      
      // Si aucune vidéo n'a été trouvée, utiliser les vidéos par défaut
      if (videos.length === 0) {
        videos = getDefaultVideos();
      }
      
      // Appliquer la pagination et retourner le résultat
      return NextResponse.json(videos.slice(start, start + limit));
      
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos:', error);
      // En cas d'erreur, retourner des vidéos par défaut avec pagination
      return NextResponse.json(getDefaultVideos().slice(start, start + limit));
    }
  } catch (error) {
    console.error('Erreur générale:', error);
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 });
  }
}