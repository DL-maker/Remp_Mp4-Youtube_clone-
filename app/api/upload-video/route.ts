import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from 'crypto';
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;
    const sessionCookie = (await cookies()).get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Session cookie is missing.' }, { status: 400 });
    }

    const session = await decrypt(sessionCookie);
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
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

    if (!videoFile) {
      return NextResponse.json({ error: 'Aucun fichier vidéo sélectionné.' }, { status: 400 });
    }

    const buffer = await videoFile.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    
    // Générer un nom de fichier unique
    const uniqueFileName = `${randomUUID()}-${videoFile.name}`;
    
    // Créer un dossier avec le nom d'utilisateur
    const fileName = `users/${username}/${uniqueFileName}`;

    // Paramètres pour l'upload de la vidéo
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: videoFile.type
    });

    // Upload la vidéo
    await s3Client.send(uploadCommand);

    // Créer une référence à la vidéo la plus récente
    try {
      // Métadonnées avec le nom d'utilisateur
      const metadataCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `users/${username}/latest-video-metadata.json`,
        Body: JSON.stringify({
          filename: uniqueFileName,
          originalName: videoFile.name,
          uploadDate: new Date().toISOString(),
          contentType: videoFile.type,
          path: fileName,
          username: username
        }),
        ContentType: 'application/json'
      });
      
      await s3Client.send(metadataCommand);
    } catch (metadataError) {
      console.warn('Erreur lors de lenregistrement des métadonnées:', metadataError);
    }

    const videoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log('Upload vers S3 réussi:', videoUrl);

    return NextResponse.json({ 
      message: 'Vidéo uploadée avec succès!', 
      url: videoUrl,
      username: username 
    });

  } catch (error: unknown) {
    console.error('Erreur lors de l\'upload vers S3:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de la vidéo.' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};