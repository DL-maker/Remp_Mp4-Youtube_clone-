import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const start = parseInt(url.searchParams.get('start') || '0', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const videosDirectory = path.join(process.cwd(), 'public', 'videos');
    const files = await fs.readdir(videosDirectory);
    const videoFiles = files.filter(file => 
      file.endsWith('.mp4') || file.endsWith('.webm')
    ).slice(start, start + limit);

    return NextResponse.json(videoFiles);
  } catch (error) {
    console.error('Erreur lors de la lecture du dossier videos:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
