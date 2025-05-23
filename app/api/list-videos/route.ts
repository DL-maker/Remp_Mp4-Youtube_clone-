// /app/api/list-videos/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import path from 'path';
import { promises as fs } from 'fs';
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const startParam = url.searchParams.get('start');
    const limitParam = url.searchParams.get('limit');
    const userOnly = url.searchParams.get('userOnly') === 'true';
    
    const start = startParam ? parseInt(startParam, 10) : 0;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    let requestingUserId = null;
    let requestingUsername = null;

    // Si on demande uniquement les vidéos de l'utilisateur, on vérifie la session
    if (userOnly) {
      const sessionCookie = (await cookies()).get('session')?.value;
      if (!sessionCookie) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
      }

      const session = await decrypt(sessionCookie);
      requestingUserId = session?.userId;

      if (!requestingUserId) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { id: requestingUserId },
        select: { username: true }
      });

      if (!user) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
      }

      requestingUsername = user.username;
    }
    
    let allVideos = [];
    
    // 1. Récupérer toutes les vidéos S3 des utilisateurs
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: 'users/',
      });

      const listResult = await s3Client.send(listCommand);
      
      if (listResult.Contents && listResult.Contents.length > 0) {
        const videoFiles = listResult.Contents.filter(obj => 
          obj.Key && (
            obj.Key.endsWith('.mp4') || 
            obj.Key.endsWith('.mov') ||
            obj.Key.endsWith('.webm') ||
            obj.Key.endsWith('.avi')
          )
        );
        
        for (const obj of videoFiles) {
          const pathParts = obj.Key?.split('/');
          if (pathParts && pathParts.length >= 3) {
            const username = pathParts[1];

            // Si on veut uniquement les vidéos de l'utilisateur, on filtre par son nom d'utilisateur
            if (userOnly && username !== requestingUsername) {
              continue;
            }

            // Vérifier si l'utilisateur est en mode invisible
            if (!userOnly) {
              const user = await prisma.user.findUnique({
                where: { username },
                select: { 
                  id: true,
                  isInvisible: true,
                  accessToken: true
                }
              });

              if (user?.isInvisible) {
                // Vérifier le token d'accès dans l'URL
                const accessToken = url.searchParams.get('accessToken');
                if (accessToken !== user.accessToken) {
                  // Vérifier si l'utilisateur connecté a accès
                  const sessionCookie = (await cookies()).get('session')?.value;
                  if (sessionCookie) {
                    const session = await decrypt(sessionCookie);
                    const requestingUserId = session?.userId;

                    if (requestingUserId) {
                      const hasAccess = await prisma.profileAccess.findFirst({
                        where: {
                          OR: [
                            { granterId: user.id, receiverId: requestingUserId },
                            { granterId: requestingUserId, receiverId: user.id }
                          ]
                        }
                      });

                      if (!hasAccess && requestingUserId !== user.id) {
                        continue;
                      }
                    } else {
                      continue;
                    }
                  } else {
                    continue;
                  }
                }
              }
            }

            allVideos.push({
              id: `s3-${obj.Key}`,
              key: obj.Key || '',
              filename: pathParts[pathParts.length - 1],
              title: pathParts[pathParts.length - 1].replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
              date: obj.LastModified?.toISOString() || new Date().toISOString(),
              type: 'video',
              src: `/api/video-stream?key=${encodeURIComponent(obj.Key || '')}`,
              size: obj.Size || 0,
              username: username
            });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos S3:', error);
    }

    // Ne pas inclure les vidéos publiques si on veut uniquement les vidéos de l'utilisateur
    if (!userOnly) {
      try {
        const publicVideosDir = path.join(process.cwd(), 'public', 'videos');
        const files = await fs.readdir(publicVideosDir);
        const publicVideoFiles = files.filter(file => 
          file.endsWith('.mp4') || 
          file.endsWith('.mov') ||
          file.endsWith('.webm') ||
          file.endsWith('.avi')
        );

        const publicVideos = publicVideoFiles.map((filename, index) => ({
          id: `local-${index}`,
          key: filename,
          filename,
          title: filename.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          date: new Date().toISOString(),
          type: 'video',
          src: `/videos/${filename}`,
          size: 0,
          username: 'Public'
        }));

        allVideos = [...allVideos, ...publicVideos];
      } catch (error) {
        console.error('Erreur lors de la récupération des vidéos locales:', error);
      }
    }

    // Trier les vidéos par date (les plus récentes en premier)
    allVideos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Appliquer la pagination
    return NextResponse.json(allVideos.slice(start, start + limit));
    
  } catch (error) {
    console.error('Erreur générale:', error);
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 });
  }
}