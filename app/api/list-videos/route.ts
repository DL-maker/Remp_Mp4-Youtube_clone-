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
    
    const start = startParam ? parseInt(startParam, 10) : 0;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
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
            const filename = pathParts[pathParts.length - 1];
            
            allVideos.push({
              id: `s3-${obj.Key}`,
              key: obj.Key || '',
              filename,
              title: filename.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
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

    // 2. Récupérer les vidéos locales publiques
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

    // Trier les vidéos par date (les plus récentes en premier)
    allVideos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Appliquer la pagination
    return NextResponse.json(allVideos.slice(start, start + limit));
    
  } catch (error) {
    console.error('Erreur générale:', error);
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 });
  }
}