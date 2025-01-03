import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const videoDir = path.join(process.cwd(), "videos"); // Chemin vers le dossier des vidéos
    const files = fs.readdirSync(videoDir); // Lire les fichiers dans le dossier

    // Filtrer uniquement les fichiers .mp4
    const videoFiles = files.filter((file) => file.endsWith(".mp4"));

    // Retourner les noms des fichiers vidéo dans la réponse
    return NextResponse.json(videoFiles);
  } catch (error) {
    console.error("Erreur lors de la lecture des vidéos:", error);
    return NextResponse.json({ error: "Impossible de lire les vidéos" }, { status: 500 });
  }
}
