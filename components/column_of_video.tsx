'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const VIDEO_LOAD_LIMIT = 10; // Limite du nombre de vidéos chargées à chaque fois

// Fonction pour générer un nom d'utilisateur basé sur la source de la vidéo
function generateRandomName(videoSource: string = '') {
  // Si la vidéo provient du dossier /videos/ local, c'est une vidéo locale
  if (videoSource.startsWith('/videos/') || !videoSource.includes('amazonaws.com')) {
    return 'No account - local storage';
  }
  
  // Sinon, c'est une vidéo AWS, générer un nom aléatoire
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
  const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Lee"];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Fonction pour récupérer la liste des vidéos depuis l'API
async function fetchVideoList(startIndex: number, limit: number) {
  try {
    const response = await fetch(`/api/list-videos?start=${startIndex}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Les données retournées sont maintenant des objets plus complexes
    const videoFiles = await response.json();
    
    return videoFiles.map((video: any) => {
      // Vérifier si video est un objet avec une propriété filename ou un simple string
      const name = typeof video === 'string' ? video : (video.filename || '');
      const src = typeof video === 'string' 
        ? `/videos/${video}` 
        : (video.url || `/videos/${video.filename || ''}`);
      
      // S'assurer que name est bien une chaîne avant d'appliquer replace
      const title = typeof name === 'string'
        ? name.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
        : 'Vidéo sans titre';
      
      return {
        src,
        title,
        key: typeof video === 'string' ? video : (video.id || video.filename || Date.now().toString()),
      };
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
    throw error;
  }
}

const ColumnOfVideo = () => {
  const [videos, setVideos] = useState<Array<{ src: string; title: string; key: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const loadVideos = useCallback(
    async (startIndex: number, limit: number) => {
      setLoading(true);
      setError(null);
      try {
        const newVideos = await fetchVideoList(startIndex, limit);
        setVideos((prev) => [...prev, ...newVideos]);
        if (newVideos.length < limit) {
          setHasMore(false);
        }
      } catch {
        setError("Une erreur est survenue lors du chargement des vidéos.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadVideos(0, VIDEO_LOAD_LIMIT);
  }, [loadVideos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadVideos(videos.length, VIDEO_LOAD_LIMIT);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, videos.length, loadVideos]);

  return (
    <div className="p-4">

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <div
            key={`${video.key}-${index}`} // Assurez-vous que la clé est unique
            className="group relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            onClick={() => router.push(`/video_page?videoId=${video.key}`)}
            role="button"
            tabIndex={0}
            aria-label={`Lire la vidéo ${video.title}`}
            onKeyDown={(e) => e.key === "Enter" && router.push(`/video_page?videoId=${video.key}`)}
          >
            {/* Vidéo */}
            <video
              width="100%"
              className="rounded-lg group-hover:opacity-75 transition-opacity aspect-video"
              controls={false}
              muted
              loop
              onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
              onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
            >
              <source src={video.src} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture des vidéos.
            </video>

            {/* Profil en dessous */}
            <div className="flex items-center mt-4 space-x-2">
              <Image
                src={"https://thispersondoesnotexist.com"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full h-10 w-10 object-cover cursor-pointer"
              />
              <span className="text-sm font-medium">{generateRandomName(video.src)}</span>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Chargement des vidéos...</p>
        </div>
      )}

      {!hasMore && !loading && (
        <div className="text-center py-4 text-gray-600">
          Toutes les vidéos ont été chargées.
        </div>
      )}

      <div ref={observerTarget} className="h-10" />
    </div>
  );
};

export default React.memo(ColumnOfVideo);
