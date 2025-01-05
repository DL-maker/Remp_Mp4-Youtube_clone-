"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";

// Fonction pour récupérer la liste des vidéos depuis l'API
async function fetchVideoList() {
  try {
    const response = await fetch("/api/list-videos");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const videoFiles = await response.json();
    return videoFiles.map((name: string) => ({
      src: `/videos/${name}`, // Chemin relatif vers la vidéo 
      title: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), // Remplace les _ par des espaces et met en majuscule la première lettre de chaque mot
      key: name // Utilisation du nom du fichier comme clé unique
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des vidéos:", error);
    return [];
  }
}

const VideoPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');

  const [videos, setVideos] = useState<Array<{ src: string; title: string; key: string }>>([]);
  const [selectedVideo, setSelectedVideo] = useState<{ src: string; title: string; key: string } | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      const videoList = await fetchVideoList();
      setVideos(videoList);

      if (videoId) {
        const video = videoList.find((v: { key: string }) => v.key === videoId);
        setSelectedVideo(video || null);
      }
    };

    loadVideos();
  }, [videoId]);

  function toggleColumn(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <Navbar toggleColumn={toggleColumn} />
      <div className="flex">
        <div className="flex-1 p-4">
          {selectedVideo ? (
            <div>
              <video width="100%" controls autoPlay className="rounded-lg">
                <source src={selectedVideo.src} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture des vidéos.
              </video>
              <h1 className="text-2xl font-bold mt-4">{selectedVideo.title}</h1>
            </div>
          ) : (
            <p>Chargement de la vidéo...</p>
          )}
        </div>
        <div className="w-1/3 p-4">
          <h2 className="text-xl font-bold mb-4">Autres vidéos</h2>
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.key} className="cursor-pointer" onClick={() => router.push(`/video_page?videoId=${video.key}`)}>
                <video width="100%" className="rounded-lg">
                  <source src={video.src} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture des vidéos.
                </video>
                <p className="mt-2">{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
