import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/_lib/session';

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const bucketName = process.env.AWS_BUCKET_NAME!;

export async function GET() {
  const sessionCookie = (await cookies()).get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
  }

  const session = await decrypt(sessionCookie);
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié. Se connecter' }, { status: 401 });
  }

  try {
    const prefix = `videos/${userId}-`; // Recherche les fichiers commençant par 'videos/IDUTILISATEUR-'
    const listObjectsResponse = await s3.listObjectsV2({ Bucket: bucketName, Prefix: prefix }).promise();

    const videoUrls = listObjectsResponse.Contents?.map(object => {
      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${object.Key}`;
    }) || [];

    return NextResponse.json(videoUrls);
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos de l\'utilisateur depuis S3:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la récupération des vidéos.' }, { status: 500 });
  }
}