import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma'; // Si vous voulez enregistrer des infos en base

// Initialisation du client S3 côté serveur (une seule fois)
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(request: Request) {
  console.log('Bucket', process.env.AWS_BUCKET_NAME);
  console.log('test', process.env.TEST_VAR);
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;

    if (!videoFile) {
      return NextResponse.json({ error: 'Aucun fichier vidéo sélectionné.' }, { status: 400 });
    }

    const buffer = await videoFile.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const fileName = `videos/${randomUUID()}-${videoFile.name}`; // Nom de fichier unique

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: videoFile.type, // Important pour que S3 sache le type de fichier
    };

    const uploadResult = await s3.upload(params).promise();

    console.log('Upload vers S3 réussi:', uploadResult);

    // Optionnellement, enregistrer les informations de la vidéo dans la base de données
    // const newVideo = await prisma.video.create({
    //   data: {
    //     url: uploadResult.Location,
    //     title: videoFile.name, // Ou récupérer le titre depuis un autre champ du formulaire
    //     // ... autres informations ...
    //     userId: 'ID_DE_L_UTILISATEUR_CONNECTE', // Récupérer l'ID de l'utilisateur depuis la session
    //   },
    // });
    // console.log('Informations de la vidéo enregistrées:', newVideo);

    return NextResponse.json({ message: 'Vidéo uploadée avec succès!', url: uploadResult.Location });

  } catch (error: any) {
    console.log('Erreur lors de l\'upload vers S3:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload de la vidéo.' }, { status: 500 });
  }
}

// Configuration pour désactiver le body parsing par défaut de Next.js pour les FormData
export const config = {
  api: {
    bodyParser: false,
  },
};