"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Fonction pour récupérer la liste des vidéos depuis l'API
async function fetchVideoList() {
  try {
    const response = await fetch("/api/list-videos");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const videoFiles = await response.json();
    return videoFiles.map((name: string) => ({
      src: `/videos/${name}`,
      title: name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      key: name // Utilisation du nom du fichier comme clé unique
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des vidéos:", error);
    return [];
  }
}

const ColumnOfVideo = () => {
  const [videos, setVideos] = useState<Array<{ src: string; title: string; key: string }>>([]);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadInitialVideos = async () => {
      setLoading(true);
      const initialVideos = await fetchVideoList();
      setVideos(initialVideos);
      setLoading(false);
    };

    loadInitialVideos();
  }, []);

  useEffect(() => {
    const loadMoreVideos = async () => {
      setLoading(true);
      const moreVideos = await fetchVideoList();
      setVideos((prev) => [...prev, ...moreVideos]);
      setLoading(false);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreVideos();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {videos.map((video) => (
        <div key={video.key} className="px-2 cursor-pointer" onClick={() => router.push(`/video_page?videoId=${video.key}`)}>
          <video width="100%" className="rounded-lg max-w-xs">
            <source src={video.src} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture des vidéos.
          </video>
          <p>{video.title}</p>
        </div>
      ))}
      <div ref={observerTarget} className="h-10" />
      {loading && (
        <div className="col-span-full text-center py-4">
          Chargement des vidéos...
        </div>
      )}
    </div>
  );
};

export default ColumnOfVideo;