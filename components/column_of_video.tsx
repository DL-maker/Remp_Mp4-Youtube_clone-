'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Interface pour représenter une vidéo
interface Video {
  src: string;
  title: string;
  key: string;
  username: string;
  date: string;
}

const VIDEO_LOAD_LIMIT = 10;

// Fonction pour récupérer la liste des vidéos depuis l'API
async function fetchVideoList(startIndex: number, limit: number): Promise<Video[]> {
  try {
    const response = await fetch(`/api/list-videos?start=${startIndex}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const videoFiles = await response.json();
    return videoFiles;
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
    throw error;
  }
}

const ColumnOfVideo = () => {
  const [videos, setVideos] = useState<Video[]>([]);
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
            key={`${video.key}-${index}`}
            className="group relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            onClick={() => router.push(`/video_page?videoId=${encodeURIComponent(video.key)}`)}
            role="button"
            tabIndex={0}
            aria-label={`Lire la vidéo ${video.title}`}
            onKeyDown={(e) => e.key === "Enter" && router.push(`/video_page?videoId=${encodeURIComponent(video.key)}`)}
          >
            <div className="aspect-video relative overflow-hidden">
              <video
                className="w-full h-full object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                controls={false}
                muted
                loop
                onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
              >
                <source src={video.src} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture des vidéos.
              </video>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{video.title}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <Image
                    src="/Photo_profile_light_mode.png"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/${encodeURIComponent(video.username)}`);
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{video.username}</p>
                  <p className="text-xs text-gray-400">{new Date(video.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-gray-600">Chargement des vidéos...</p>
        </div>
      )}

      <div ref={observerTarget} className="h-4" />
    </div>
  );
};

export default React.memo(ColumnOfVideo);
