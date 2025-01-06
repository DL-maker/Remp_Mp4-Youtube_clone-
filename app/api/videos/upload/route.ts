// app/api/videos/upload/route.ts
import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une vidéo' },
        { status: 400 }
      );
    }

    // Définir le dossier de destination
    const uploadDir = type === 'normale' ? 'videos' : 'shorts';
    const publicDir = path.join(process.cwd(), 'public', uploadDir);

    // Créer le dossier s'il n'existe pas
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    // Créer un nom de fichier unique
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const filePath = path.join(publicDir, fileName);

    // Convertir le fichier en Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sauvegarder le fichier
    await writeFile(filePath, buffer);

    // Retourner l'URL relative du fichier
    return NextResponse.json({
      url: `/${uploadDir}/${fileName}`,
      message: 'Fichier téléchargé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du fichier' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};